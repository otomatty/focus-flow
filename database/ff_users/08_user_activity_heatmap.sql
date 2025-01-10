-- ユーザーの日次活動記録テーブル
create table if not exists ff_users.user_daily_activities (
    id uuid not null default gen_random_uuid(),
    user_id uuid not null references auth.users(id),
    activity_date date not null,
    -- ログイン関連
    login_count integer not null default 0,
    -- タスク関連
    total_tasks integer not null default 0,
    completed_tasks integer not null default 0,
    -- フォーカスセッション関連
    focus_sessions integer not null default 0,
    focus_minutes integer not null default 0, -- 分単位で記録
    -- 習慣関連
    total_habits integer not null default 0,
    completed_habits integer not null default 0,
    -- 活動レベル（0-4: GitHubのContributionレベルのように）
    activity_level integer not null default 0,
    -- メタデータ
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    -- プライマリキーにパーティションキーを含める
    primary key (id, activity_date),
    -- ユニーク制約
    unique(user_id, activity_date)
) partition by range (activity_date);

-- パーティション自動作成トリガー関数
create or replace function ff_users.create_daily_activities_partition()
returns trigger as $$
declare
    partition_date date;
    partition_name text;
begin
    partition_date := date_trunc('month', new.activity_date)::date;
    partition_name := 'user_daily_activities_' || to_char(partition_date, 'YYYY_MM');

    if not exists (
        select 1
        from pg_class c
        join pg_namespace n on n.oid = c.relnamespace
        where n.nspname = 'ff_users'
        and c.relname = partition_name
    ) then
        execute format(
            'create table if not exists ff_users.%I ' ||
            'partition of ff_users.user_daily_activities ' ||
            'for values from (%L) to (%L)',
            partition_name,
            partition_date,
            partition_date + interval '1 month'
        );

        -- パーティションにインデックスを作成
        execute format(
            'create index if not exists %I on ff_users.%I (user_id, activity_date)',
            'idx_' || partition_name || '_user_date',
            partition_name
        );
    end if;
    return new;
end;
$$ language plpgsql;

-- パーティション自動作成トリガー
create trigger create_daily_activities_partition_trigger
    before insert on ff_users.user_daily_activities
    for each row
    execute function ff_users.create_daily_activities_partition();

-- インデックスの作成
create index if not exists idx_user_daily_activities_user_id 
    on ff_users.user_daily_activities(user_id);
create index if not exists idx_user_daily_activities_date 
    on ff_users.user_daily_activities(activity_date);
create index if not exists idx_user_daily_activities_level 
    on ff_users.user_daily_activities(activity_level);

-- RLSの設定
alter table ff_users.user_daily_activities enable row level security;

create policy "Users can view their own activity history"
    on ff_users.user_daily_activities for select
    using (auth.uid() = user_id);

create policy "Service role can manage all activities"
    on ff_users.user_daily_activities for all
    using (auth.role() = 'service_role');

-- 活動レベルを計算する関数
create or replace function ff_users.calculate_activity_level(
    p_login_count integer,
    p_completed_tasks integer,
    p_focus_minutes integer,
    p_completed_habits integer
) returns integer as $$
declare
    total_points integer;
    max_points integer := 10; -- 最大ポイント
begin
    -- ポイントの計算
    total_points := 
        least(p_login_count, 1) +                    -- ログイン: 最大1ポイント
        least(p_completed_tasks, 3) +                -- タスク完了: 最大3ポイント
        least(p_focus_minutes / 30, 3) +            -- フォーカス時間: 30分ごとに1ポイント、最大3ポイント
        least(p_completed_habits, 3);               -- 習慣完了: 最大3ポイント

    -- 活動レベルの決定（0-4）
    return case
        when total_points = 0 then 0                -- レベル0: 活動なし
        when total_points <= 3 then 1               -- レベル1: 少し活動
        when total_points <= 6 then 2               -- レベル2: 普通の活動
        when total_points <= 8 then 3               -- レベル3: 活発な活動
        else 4                                      -- レベル4: とても活発な活動
    end;
end;
$$ language plpgsql immutable;

-- 日次活動を記録/更新する関数
create or replace function ff_users.record_daily_activity(
    p_user_id uuid,
    p_activity_date date default current_date,
    p_login_count integer default null,
    p_total_tasks integer default null,
    p_completed_tasks integer default null,
    p_focus_sessions integer default null,
    p_focus_minutes integer default null,
    p_total_habits integer default null,
    p_completed_habits integer default null
) returns ff_users.user_daily_activities as $$
declare
    activity_record ff_users.user_daily_activities;
begin
    insert into ff_users.user_daily_activities (
        user_id,
        activity_date,
        login_count,
        total_tasks,
        completed_tasks,
        focus_sessions,
        focus_minutes,
        total_habits,
        completed_habits,
        activity_level
    ) values (
        p_user_id,
        p_activity_date,
        coalesce(p_login_count, 0),
        coalesce(p_total_tasks, 0),
        coalesce(p_completed_tasks, 0),
        coalesce(p_focus_sessions, 0),
        coalesce(p_focus_minutes, 0),
        coalesce(p_total_habits, 0),
        coalesce(p_completed_habits, 0),
        ff_users.calculate_activity_level(
            coalesce(p_login_count, 0),
            coalesce(p_completed_tasks, 0),
            coalesce(p_focus_minutes, 0),
            coalesce(p_completed_habits, 0)
        )
    )
    on conflict (user_id, activity_date) do update set
        login_count = case when p_login_count is not null 
            then excluded.login_count 
            else ff_users.user_daily_activities.login_count end,
        total_tasks = case when p_total_tasks is not null 
            then excluded.total_tasks 
            else ff_users.user_daily_activities.total_tasks end,
        completed_tasks = case when p_completed_tasks is not null 
            then excluded.completed_tasks 
            else ff_users.user_daily_activities.completed_tasks end,
        focus_sessions = case when p_focus_sessions is not null 
            then excluded.focus_sessions 
            else ff_users.user_daily_activities.focus_sessions end,
        focus_minutes = case when p_focus_minutes is not null 
            then excluded.focus_minutes 
            else ff_users.user_daily_activities.focus_minutes end,
        total_habits = case when p_total_habits is not null 
            then excluded.total_habits 
            else ff_users.user_daily_activities.total_habits end,
        completed_habits = case when p_completed_habits is not null 
            then excluded.completed_habits 
            else ff_users.user_daily_activities.completed_habits end,
        activity_level = ff_users.calculate_activity_level(
            case when p_login_count is not null 
                then excluded.login_count 
                else ff_users.user_daily_activities.login_count end,
            case when p_completed_tasks is not null 
                then excluded.completed_tasks 
                else ff_users.user_daily_activities.completed_tasks end,
            case when p_focus_minutes is not null 
                then excluded.focus_minutes 
                else ff_users.user_daily_activities.focus_minutes end,
            case when p_completed_habits is not null 
                then excluded.completed_habits 
                else ff_users.user_daily_activities.completed_habits end
        ),
        updated_at = now()
    returning * into activity_record;

    return activity_record;
end;
$$ language plpgsql security definer;

-- ヒートマップデータを取得する関数
create or replace function ff_users.get_activity_heatmap(
    p_user_id uuid,
    p_start_date date,
    p_end_date date
) returns table (
    activity_date date,
    activity_level integer,
    login_count integer,
    completed_tasks integer,
    focus_minutes integer,
    completed_habits integer
) as $$
begin
    return query
    select 
        a.activity_date,
        a.activity_level,
        a.login_count,
        a.completed_tasks,
        a.focus_minutes,
        a.completed_habits
    from ff_users.user_daily_activities a
    where a.user_id = p_user_id
    and a.activity_date between p_start_date and p_end_date
    order by a.activity_date;
end;
$$ language plpgsql security definer; 