-- クエストタイプマスターテーブル
create table if not exists ff_gamification.quest_types (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,
    description text not null,
    validation_rules jsonb not null, -- クエスト達成条件の検証ルール
    created_at timestamp with time zone default now()
);

-- クエスト難易度マスターテーブル
create table if not exists ff_gamification.quest_difficulties (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,
    level integer not null unique,
    exp_multiplier numeric(3,2) not null default 1.00,
    created_at timestamp with time zone default now()
);

-- クエストマスターテーブル
create table if not exists ff_gamification.quests (
    id uuid primary key default uuid_generate_v4(),
    title text not null unique,
    description text not null,
    quest_type_id uuid references ff_gamification.quest_types(id) not null,
    difficulty_id uuid references ff_gamification.quest_difficulties(id) not null,
    requirements jsonb not null,
    base_reward_exp integer not null,
    reward_badge_id uuid references ff_gamification.badges(id),
    duration_type text check (duration_type in ('daily', 'weekly', 'monthly')),
    is_party_quest boolean default false, -- パーティー向けクエストかどうか
    min_level integer default 1, -- 受注可能な最小レベル
    max_participants integer, -- 最大参加人数（パーティークエストの場合のみ使用）
    is_active boolean default true,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- 初期クエストタイプデータの投入
insert into ff_gamification.quest_types (name, description, validation_rules) values
    ('task_complete', 'タスク完了に関するクエスト', 
     '{"required_fields": ["count"], "rules": {"count": {"type": "integer", "min": 1}}}'::jsonb),
    ('focus_session', '集中セッションに関するクエスト',
     '{"required_fields": ["minutes"], "rules": {"minutes": {"type": "integer", "min": 1}}}'::jsonb),
    ('schedule_follow', 'スケジュール遵守に関するクエスト',
     '{"required_fields": ["completion_rate"], "rules": {"completion_rate": {"type": "integer", "min": 1, "max": 100}}}'::jsonb),
    ('party_challenge', 'パーティー向けの特別なチャレンジ',
     '{"required_fields": ["target_count", "achievement_rate"], "rules": {"target_count": {"type": "integer", "min": 1}, "achievement_rate": {"type": "integer", "min": 1, "max": 100}}}'::jsonb)
on conflict (name) do nothing;

-- 初期クエスト難易度データの投入
insert into ff_gamification.quest_difficulties (name, level, exp_multiplier) values
    ('初級', 1, 1.00),
    ('中級', 2, 1.25),
    ('上級', 3, 1.50),
    ('超級', 4, 2.00),
    ('神級', 5, 3.00)
on conflict (name) do nothing;

-- 初期クエストデータの投入
insert into ff_gamification.quests (
    title,
    description,
    quest_type_id,
    difficulty_id,
    requirements,
    base_reward_exp,
    duration_type,
    is_party_quest,
    min_level,
    max_participants
) values
    (
        'デイリータスクマスター',
        '1日のタスクをすべて完了する',
        (select id from ff_gamification.quest_types where name = 'task_complete'),
        (select id from ff_gamification.quest_difficulties where level = 1),
        '{"count": 5}'::jsonb,
        100,
        'daily',
        false,
        1,
        null
    ),
    (
        '集中の時間',
        '1日の集中セッションを完了する',
        (select id from ff_gamification.quest_types where name = 'focus_session'),
        (select id from ff_gamification.quest_difficulties where level = 1),
        '{"minutes": 120}'::jsonb,
        150,
        'daily',
        false,
        1,
        null
    ),
    (
        '週間プランナー',
        '週間スケジュールを完全に実行する',
        (select id from ff_gamification.quest_types where name = 'schedule_follow'),
        (select id from ff_gamification.quest_difficulties where level = 2),
        '{"completion_rate": 80}'::jsonb,
        500,
        'weekly',
        false,
        1,
        null
    ),
    (
        'パーティー集中チャレンジ',
        'パーティーメンバー全員で目標集中時間を達成する',
        (select id from ff_gamification.quest_types where name = 'party_challenge'),
        (select id from ff_gamification.quest_difficulties where level = 3),
        '{"target_count": 480, "achievement_rate": 80}'::jsonb,
        1000,
        'weekly',
        true,
        5,
        4
    )
on conflict (title) do nothing;

-- インデックス
create index if not exists idx_quests_quest_type_id on ff_gamification.quests(quest_type_id);
create index if not exists idx_quests_difficulty_id on ff_gamification.quests(difficulty_id);
create index if not exists idx_quests_is_party_quest on ff_gamification.quests(is_party_quest);
create index if not exists idx_quests_is_active on ff_gamification.quests(is_active);
create index if not exists idx_quests_min_level on ff_gamification.quests(min_level);

-- コメント
comment on table ff_gamification.quest_types is 'クエストの種類を管理するマスターテーブル';
comment on table ff_gamification.quest_difficulties is 'クエストの難易度を管理するマスターテーブル';
comment on table ff_gamification.quests is 'クエストの基本情報を管理するテーブル';

comment on column ff_gamification.quest_types.validation_rules is 'クエスト達成条件の検証ルールをJSON形式で定義';
comment on column ff_gamification.quest_difficulties.exp_multiplier is '経験値の倍率（1.00 = 100%）';
comment on column ff_gamification.quests.is_party_quest is 'パーティー向けクエストかどうかを示すフラグ';
comment on column ff_gamification.quests.min_level is 'クエストを受注可能な最小レベル';
comment on column ff_gamification.quests.max_participants is 'パーティークエストの場合の最大参加人数'; 

-- クエスト進捗更新関数
create or replace function ff_gamification.update_quest_progress(
    p_user_id uuid,
    p_quest_type_id uuid,
    p_progress jsonb
)
returns void as $$
declare
    quest_record record;
    validation_rules jsonb;
    required_field text;
    is_valid boolean;
begin
    -- クエストタイプの検証ルールを取得
    select validation_rules into validation_rules
    from ff_quest.quest_types
    where id = p_quest_type_id;

    -- 進捗データの検証
    is_valid := true;
    for required_field in 
        select value::text
        from jsonb_array_elements_text(validation_rules->'required_fields')
    loop
        if not p_progress ? required_field then
            is_valid := false;
        end if;
    end loop;

    if not is_valid then
        raise exception 'Invalid progress data format';
    end if;

    -- アクティブなクエストを取得して進捗を更新
    for quest_record in
        select 
            uq.id,
            uq.progress,
            q.requirements,
            q.base_reward_exp,
            q.difficulty_id,
            q.is_party_quest,
            q.reward_badge_id
        from ff_gamification.user_quests uq
        join ff_gamification.quests q on uq.quest_id = q.id
        where uq.user_id = p_user_id
        and uq.status = 'in_progress'
        and q.quest_type_id = p_quest_type_id
    loop
        -- 進捗を更新
        update ff_gamification.user_quests
        set progress = quest_record.progress || p_progress
        where id = quest_record.id;
        
        -- クエスト完了チェック
        if ff_quest.check_quest_completion(quest_record.progress || p_progress, quest_record.requirements) then
            -- 報酬の計算と付与
            perform ff_gamification.grant_quest_rewards(
                p_user_id,
                quest_record.base_reward_exp,
                quest_record.difficulty_id,
                quest_record.reward_badge_id,
                quest_record.is_party_quest
            );

            -- クエストを完了状態に更新
                update ff_gamification.user_quests
            set 
                status = 'completed',
                completed_at = now()
            where id = quest_record.id;
        end if;
    end loop;
end;
$$ language plpgsql;

-- クエスト完了チェック関数
create or replace function ff_gamification.check_quest_completion(
    p_progress jsonb,
    p_requirements jsonb
)
returns boolean as $$
declare
    requirement record;
begin
    for requirement in select * from jsonb_each(p_requirements)
    loop
        if not (
            p_progress ? requirement.key
            and (p_progress->>requirement.key)::numeric >= (requirement.value)::numeric
        ) then
            return false;
        end if;
    end loop;
    return true;
end;
$$ language plpgsql;

-- クエスト報酬付与関数
create or replace function ff_gamification.grant_quest_rewards(
    p_user_id uuid,
    p_base_exp integer,
    p_difficulty_id uuid,
    p_badge_id uuid,
    p_is_party_quest boolean
)
returns void as $$
declare
    v_exp_multiplier numeric;
    v_final_exp integer;
begin
    -- 難易度による経験値倍率を取得
    select exp_multiplier into v_exp_multiplier
    from ff_gamification.quest_difficulties
    where id = p_difficulty_id;

    -- パーティークエストの場合は追加ボーナス
    if p_is_party_quest then
        v_exp_multiplier := v_exp_multiplier * 1.5;
    end if;

    -- 最終経験値を計算
    v_final_exp := (p_base_exp * v_exp_multiplier)::integer;

    -- 経験値を付与
    perform ff_gamification.add_experience_points(p_user_id, v_final_exp);

    -- バッジがある場合は付与
    if p_badge_id is not null then
        insert into ff_achievements.user_badges (user_id, badge_id)
        values (p_user_id, p_badge_id)
        on conflict (user_id, badge_id) do nothing;
    end if;
end;
$$ language plpgsql;

-- パーティークエスト進捗更新関数
create or replace function ff_gamification.update_party_quest_progress(
    p_party_id uuid,
    p_quest_type_id uuid,
    p_progress jsonb
)
returns void as $$
declare
    v_quest_id uuid;
    v_party_progress jsonb;
    v_requirements jsonb;
    v_is_completed boolean;
begin
    -- パーティーのクエストIDを取得
    select quest_id into v_quest_id
    from ff_gamification.parties
    where id = p_party_id;

    -- 現在の進捗を取得または初期化
    select coalesce(progress, '{}'::jsonb)
    into v_party_progress
    from ff_gamification.party_quest_progress
    where party_id = p_party_id;

    -- 進捗を更新
    insert into ff_gamification.party_quest_progress (party_id, progress)
    values (p_party_id, v_party_progress || p_progress)
    on conflict (party_id)
    do update set progress = ff_gamification.party_quest_progress.progress || p_progress;

    -- クエスト要件を取得
    select requirements into v_requirements
    from ff_gamification.quests
    where id = v_quest_id;

    -- 完了チェック
    v_is_completed := ff_gamification.check_quest_completion(v_party_progress || p_progress, v_requirements);

    if v_is_completed then
        -- パーティークエストを完了状態に更新
        update ff_gamification.parties
        set is_completed = true
        where id = p_party_id;

        -- パーティーメンバー全員に報酬を付与
            perform ff_gamification.complete_party_quest(p_party_id, user_id)
        from ff_gamification.party_members
        where party_id = p_party_id;
    end if;
end;
$$ language plpgsql; 