-- パーティーマスターテーブル
create table if not exists ff_social.parties (
    id uuid primary key default uuid_generate_v4(),
    quest_id uuid references ff_gamification.quests(id) not null,
    start_date date not null,
    end_date date not null,
    max_members integer not null default 4,
    is_active boolean default true,
    is_completed boolean default false,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    -- パーティーの期間が重複しないように制約
    constraint parties_date_range_check check (end_date > start_date),
    constraint parties_date_range_overlap exclude using gist (
        daterange(start_date, end_date) with &&
    )
);

-- パーティーメンバーテーブル
create table if not exists ff_social.party_members (
    id uuid primary key default uuid_generate_v4(),
    party_id uuid references ff_social.parties(id) not null,
    user_id uuid references auth.users(id) not null,
    joined_at timestamp with time zone default now(),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    -- 同じパーティー期間中に同じユーザーが複数のパーティーに所属できないように制約
    unique(user_id, party_id)
);

-- パーティー生成履歴テーブル
create table if not exists ff_social.party_generation_history (
    id uuid primary key default uuid_generate_v4(),
    generation_date date not null,
    total_parties integer not null,
    total_users integer not null,
    execution_time interval not null,
    created_at timestamp with time zone default now()
);

-- テーブルコメント
comment on table ff_social.parties is 'パーティーの基本情報を管理するテーブル';
comment on table ff_social.party_members is 'パーティーメンバーの関係を管理するテーブル';
comment on table ff_social.party_generation_history is 'パーティー生成処理の実行履歴を管理するテーブル';

-- カラムコメント
comment on column ff_social.parties.id is 'パーティーの一意識別子';
comment on column ff_social.parties.quest_id is '割り当てられたクエストのID';
comment on column ff_social.parties.start_date is 'パーティーの開始日';
comment on column ff_social.parties.end_date is 'パーティーの終了日';
comment on column ff_social.parties.max_members is '最大メンバー数';
comment on column ff_social.parties.is_active is 'パーティーがアクティブかどうか';
comment on column ff_social.parties.is_completed is 'クエストが完了したかどうか';

-- インデックス
create index if not exists idx_parties_date_range on ff_social.parties using gist (daterange(start_date, end_date));
create index if not exists idx_parties_is_active on ff_social.parties(is_active);
create index if not exists idx_parties_quest_id on ff_social.parties(quest_id);
create index if not exists idx_party_members_party_id on ff_social.party_members(party_id);
create index if not exists idx_party_members_user_id on ff_social.party_members(user_id);
create index if not exists idx_party_generation_history_date on ff_social.party_generation_history(generation_date);

-- パーティー自動生成関数
create or replace function ff_social.generate_weekly_parties()
returns void as $$
declare
    total_users integer;
    party_size integer := 4; -- デフォルトのパーティーサイズ
    start_date date;
    end_date date;
    party_count integer := 0;
    start_time timestamp;
    available_quest_ids uuid[];
begin
    start_time := clock_timestamp();
    
    -- 次の月曜日を取得
    start_date := date_trunc('week', current_date + interval '1 week')::date;
    end_date := start_date + interval '6 days';
    
    -- アクティブなユーザー数を取得
    select count(*) into total_users
    from auth.users u
    join ff_users.account_statuses a on u.id = a.user_id
    where a.status = 'active';
    
    -- 利用可能なクエストIDを取得
    select array_agg(id) into available_quest_ids
    from ff_quest.quests
    where is_active = true
    and is_party_quest = true
    and difficulty <= 3; -- 適度な難易度のクエストのみを選択
    
    -- トランザクション開始
    begin
        -- 既存のアクティブなパーティーを非アクティブに設定
        update ff_social.parties
        set is_active = false
        where end_date < current_date;

        -- 一時テーブルを作成
        create temporary table if not exists party_creation (
            id uuid,
            party_index integer
        ) on commit drop;
        
        -- ユーザーをランダムに割り当てとパーティー作成を一度に行う
        with shuffled_users as (
            select u.id as user_id
            from auth.users u
            join ff_users.account_statuses a on u.id = a.user_id
            where a.status = 'active'
            order by random()
        ),
        party_assignments as (
            select
                user_id,
                (row_number() over () - 1) / party_size as party_index
            from shuffled_users
        ),
        created_parties as (
            insert into ff_social.parties (quest_id, start_date, end_date, max_members)
            select
                available_quest_ids[1 + (party_index % array_length(available_quest_ids, 1))],
                start_date,
                end_date,
                party_size
            from (
                select distinct party_index
                from party_assignments
            ) p
            returning id, (row_number() over ())::integer - 1 as party_index
        )
        insert into party_creation
        select * from created_parties;
        
        -- パーティー数を取得
        select count(*) into party_count from party_creation;
        
        -- メンバーを割り当て
        insert into ff_social.party_members (party_id, user_id)
        select
            pc.id,
            pa.user_id
        from party_assignments pa
        join party_creation pc on pc.party_index = pa.party_index;
        
        -- 履歴を記録
        insert into ff_social.party_generation_history (
            generation_date,
            total_parties,
            total_users,
            execution_time
        ) values (
            current_date,
            party_count,
            total_users,
            clock_timestamp() - start_time
        );
        
    exception when others then
        -- エラーログを記録
        insert into ff_logs.error_logs (
            function_name,
            error_message,
            error_detail,
            created_at
        ) values (
            'generate_weekly_parties',
            SQLERRM,
            SQLSTATE,
            now()
        );
        raise;
    end;
end;
$$ language plpgsql security definer;

-- クエスト完了関数
create or replace function ff_social.complete_party_quest(
    p_party_id uuid,
    p_user_id uuid
)
returns boolean as $$
declare
    v_is_member boolean;
    v_is_completed boolean;
    v_quest_id uuid;
begin
    -- パーティーメンバーかどうかを確認
    select exists (
        select 1 from ff_social.party_members
        where party_id = p_party_id
        and user_id = p_user_id
    ) into v_is_member;

    if not v_is_member then
        return false;
    end if;

    -- クエストが既に完了していないかを確認
    select is_completed, quest_id
    into v_is_completed, v_quest_id
    from ff_social.parties
    where id = p_party_id;

    if v_is_completed then
        return false;
    end if;

    -- クエストを完了状態に更新
    update ff_social.parties
    set is_completed = true,
        updated_at = now()
    where id = p_party_id;

    -- パーティーメンバーに報酬を付与
    insert into ff_quest.quest_rewards (
        user_id,
        quest_id,
        party_id,
        reward_type,
        amount,
        created_at
    )
    select
        pm.user_id,
        v_quest_id,
        p_party_id,
        qr.reward_type,
        qr.amount,
        now()
    from ff_social.party_members pm
    cross join ff_quest.quest_reward_settings qr
    where pm.party_id = p_party_id
    and qr.quest_id = v_quest_id;

    return true;
end;
$$ language plpgsql security definer;

-- pg_cronを使用して毎週月曜日の午前0時にパーティー生成を実行
select cron.schedule(
    'generate_weekly_parties',
    '0 0 * * 1',
    $$select ff_social.generate_weekly_parties()$$
); 