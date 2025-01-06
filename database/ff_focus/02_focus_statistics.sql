-- 集中セッション統計情報テーブル
create table if not exists ff_focus.focus_statistics (
    -- 基本情報
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    
    -- 全体の統計
    total_sessions integer default 0,                -- 総セッション数
    total_focus_time interval default '0'::interval, -- 総集中時間
    total_exp_earned integer default 0,              -- 獲得した総経験値
    
    -- セッション完了状態の内訳
    perfect_sessions integer default 0,              -- 完璧に完了したセッション数
    completed_sessions integer default 0,            -- 完了したセッション数
    partial_sessions integer default 0,              -- 部分的に完了したセッション数
    abandoned_sessions integer default 0,            -- 放棄したセッション数
    
    -- 連続セッションの記録
    max_consecutive_sessions integer default 0,      -- 最大連続セッション数
    current_streak integer default 0,                -- 現在の連続セッション数
    longest_streak integer default 0,                -- 最長連続セッション記録
    last_session_date date,                         -- 最後のセッション日
    
    -- 時間帯別の統計
    morning_sessions integer default 0,              -- 朝（5-11時）のセッション数
    afternoon_sessions integer default 0,            -- 昼（11-17時）のセッション数
    evening_sessions integer default 0,              -- 夕方（17-23時）のセッション数
    night_sessions integer default 0,                -- 夜（23-5時）のセッション数
    
    -- 平均値
    avg_focus_rating numeric(3,2) default 0,        -- 平均集中度
    avg_session_duration interval,                   -- 平均セッション時間
    
    -- 達成指標
    completion_rate numeric(5,2) default 0,          -- 完了率（Perfect + Completed）
    perfect_rate numeric(5,2) default 0,             -- 完璧達成率
    
    -- システム管理
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    
    constraint focus_statistics_user_id_key unique (user_id)
);

-- テーブルとカラムのコメント
comment on table ff_focus.focus_statistics is 'ユーザーごとの集中セッション統計情報';
comment on column ff_focus.focus_statistics.total_sessions is '実施した総セッション数';
comment on column ff_focus.focus_statistics.total_focus_time is '累計の集中時間';
comment on column ff_focus.focus_statistics.current_streak is '現在の連続セッション記録（日単位）';
comment on column ff_focus.focus_statistics.longest_streak is '過去最長の連続セッション記録（日単位）';
comment on column ff_focus.focus_statistics.completion_rate is 'セッション完了率（Perfect + Completed）';
comment on column ff_focus.focus_statistics.perfect_rate is '完璧なセッションの達成率';

-- 統計情報テーブルのRLSを有効化
alter table ff_focus.focus_statistics enable row level security;

-- 統計情報テーブルのRLSポリシーを設定
create policy "ユーザーは自分の統計情報を参照可能" on ff_focus.focus_statistics
    for select using (auth.uid() = user_id);

create policy "システムは統計情報を更新可能" on ff_focus.focus_statistics
    for all using (
        exists (
            select 1 from ff_users.user_role_mappings urm
            join ff_users.user_roles ur on urm.role_id = ur.id
            where urm.user_id = auth.uid()
            and ur.name = 'SYSTEM_ADMIN'
        )
    );

create policy "システム管理者は全ての統計情報を参照可能" on ff_focus.focus_statistics
    for select using (
        exists (
            select 1 from ff_users.user_role_mappings urm
            join ff_users.user_roles ur on urm.role_id = ur.id
            where urm.user_id = auth.uid()
            and ur.name = 'SYSTEM_ADMIN'
        )
    );

-- インデックスの作成
create index idx_focus_statistics_user_id on ff_focus.focus_statistics(user_id);
create index idx_focus_statistics_last_session_date on ff_focus.focus_statistics(last_session_date);

-- 連続日数を更新する関数
create or replace function ff_focus.update_session_streak()
returns trigger as $$
declare
    v_last_date date;
begin
    -- 前回のセッション日を取得
    select last_session_date
    into v_last_date
    from ff_focus.focus_statistics
    where user_id = new.user_id;

    -- 連続日数の更新
    if v_last_date is null then
        -- 初回セッション
        update ff_focus.focus_statistics
        set current_streak = 1,
            longest_streak = 1
        where user_id = new.user_id;
    elsif v_last_date = current_date - interval '1 day' then
        -- 連続日数を増加
        update ff_focus.focus_statistics
        set current_streak = current_streak + 1,
            longest_streak = greatest(longest_streak, current_streak + 1)
        where user_id = new.user_id;
    elsif v_last_date < current_date - interval '1 day' then
        -- 連続が途切れた場合
        update ff_focus.focus_statistics
        set current_streak = 1
        where user_id = new.user_id;
    end if;

    return new;
end;
$$ language plpgsql security definer;

-- 統計情報更新用のトリガー関数
create or replace function ff_focus.update_focus_statistics()
returns trigger as $$
declare
    v_time_of_day text;
begin
    -- 新しいセッションの時間帯を判定
    select
        case
            when extract(hour from new.actual_start_time) between 5 and 10 then 'morning'
            when extract(hour from new.actual_start_time) between 11 and 16 then 'afternoon'
            when extract(hour from new.actual_start_time) between 17 and 22 then 'evening'
            else 'night'
        end into v_time_of_day;

    -- 統計情報の更新または作成
    insert into ff_focus.focus_statistics (user_id)
    values (new.user_id)
    on conflict (user_id) do update
    set
        total_sessions = focus_statistics.total_sessions + 1,
        total_focus_time = focus_statistics.total_focus_time + new.actual_duration,
        total_exp_earned = focus_statistics.total_exp_earned + new.earned_exp,
        perfect_sessions = focus_statistics.perfect_sessions + (case when new.completion_status = 'PERFECT' then 1 else 0 end),
        completed_sessions = focus_statistics.completed_sessions + (case when new.completion_status = 'COMPLETED' then 1 else 0 end),
        partial_sessions = focus_statistics.partial_sessions + (case when new.completion_status = 'PARTIAL' then 1 else 0 end),
        abandoned_sessions = focus_statistics.abandoned_sessions + (case when new.completion_status = 'ABANDONED' then 1 else 0 end),
        morning_sessions = focus_statistics.morning_sessions + (case when v_time_of_day = 'morning' then 1 else 0 end),
        afternoon_sessions = focus_statistics.afternoon_sessions + (case when v_time_of_day = 'afternoon' then 1 else 0 end),
        evening_sessions = focus_statistics.evening_sessions + (case when v_time_of_day = 'evening' then 1 else 0 end),
        night_sessions = focus_statistics.night_sessions + (case when v_time_of_day = 'night' then 1 else 0 end),
        avg_focus_rating = (focus_statistics.avg_focus_rating * focus_statistics.total_sessions + new.focus_rating) / (focus_statistics.total_sessions + 1),
        avg_session_duration = (focus_statistics.total_focus_time + new.actual_duration) / (focus_statistics.total_sessions + 1),
        completion_rate = ((focus_statistics.perfect_sessions + focus_statistics.completed_sessions + 
            (case when new.completion_status in ('PERFECT', 'COMPLETED') then 1 else 0 end))::numeric * 100) / 
            (focus_statistics.total_sessions + 1),
        perfect_rate = ((focus_statistics.perfect_sessions + 
            (case when new.completion_status = 'PERFECT' then 1 else 0 end))::numeric * 100) / 
            (focus_statistics.total_sessions + 1),
        last_session_date = current_date,
        updated_at = now();

    return new;
end;
$$ language plpgsql security definer;

-- 統計情報更新トリガーの作成
create trigger tr_update_focus_statistics
    after insert on ff_focus.focus_sessions
    for each row
    execute function ff_focus.update_focus_statistics();

-- 連続日数更新トリガーの作成
create trigger tr_update_session_streak
    after insert on ff_focus.focus_sessions
    for each row
    execute function ff_focus.update_session_streak(); 