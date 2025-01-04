-- 集中セッションテーブル（月次パーティション）
create table if not exists ff_focus.focus_sessions (
    id uuid not null default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    schedule_id uuid references ff_schedules.schedules(id),
    start_time timestamp with time zone not null,
    end_time timestamp with time zone,
    duration interval,
    is_completed boolean default false,
    bonus_points integer default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    -- パーティションキーを含む主キー制約
    primary key (id, start_time),
    -- 外部キー参照用の一意制約
    unique (id)
) partition by range (start_time);

-- 既存のパーティションを削除
do $$
declare
    partition_name text;
begin
    -- 2024年のパーティションを削除
    for i in 1..12 loop
        partition_name := format('ff_focus.focus_sessions_y2024m%s', lpad(i::text, 2, '0'));
        execute format('drop table if exists %s', partition_name);
    end loop;
    
    -- 2025年1月のパーティションを削除
    execute 'drop table if exists ff_focus.focus_sessions_y2025m01';
end $$;

-- 2025年1月のパーティション作成
create table if not exists ff_focus.focus_sessions_y2025m01 partition of ff_focus.focus_sessions
    for values from ('2025-01-01') to ('2025-02-01');

-- パーティション自動作成用の関数
create or replace function ff_focus.create_focus_sessions_partition()
returns void as $$
declare
    next_month date;
    partition_name text;
    start_date text;
    end_date text;
begin
    -- 次の月の初日を取得
    next_month := date_trunc('month', now()) + interval '1 month';
    
    -- パーティション名を生成（例：focus_sessions_y2025m01）
    partition_name := format('ff_focus.focus_sessions_y%sm%s',
        to_char(next_month, 'YYYY'),
        to_char(next_month, 'MM'));
    
    -- 開始日と終了日を設定
    start_date := to_char(next_month, 'YYYY-MM-DD');
    end_date := to_char(next_month + interval '1 month', 'YYYY-MM-DD');
    
    -- パーティションが存在しない場合のみ作成
    execute format(
        'create table if not exists %s partition of ff_focus.focus_sessions
        for values from (%L) to (%L)',
        partition_name, start_date, end_date
    );

    -- パーティションテーブルにRLSを有効化
    execute format(
        'alter table %s enable row level security',
        partition_name
    );

    -- パーティションテーブル用のインデックスを作成
    execute format(
        'create index if not exists idx_%s_user_id on %s (user_id)',
        replace(partition_name, 'ff_focus.', ''),
        partition_name
    );
    
    execute format(
        'create index if not exists idx_%s_start_time on %s (start_time)',
        replace(partition_name, 'ff_focus.', ''),
        partition_name
    );

    execute format(
        'create index if not exists idx_%s_schedule_id on %s (schedule_id)',
        replace(partition_name, 'ff_focus.', ''),
        partition_name
    );

    execute format(
        'create index if not exists idx_%s_is_completed on %s (is_completed)',
        replace(partition_name, 'ff_focus.', ''),
        partition_name
    );

    execute format(
        'create index if not exists idx_%s_user_completed on %s (user_id, is_completed)',
        replace(partition_name, 'ff_focus.', ''),
        partition_name
    );

    -- パーティションテーブル用のRLSポリシーを作成
    execute format(
        'create policy "ユーザーは自分の集中セッションを参照可能" on %s
        for select using (auth.uid() = user_id)',
        partition_name
    );

    execute format(
        'create policy "ユーザーは自分の集中セッションを作成可能" on %s
        for insert with check (
            auth.uid() = user_id
            and (
                schedule_id is null
                or exists (
                    select 1 from ff_schedules.schedules
                    where schedules.id = schedule_id
                    and schedules.user_id = auth.uid()
                )
            )
        )',
        partition_name
    );

    execute format(
        'create policy "ユーザーは自分の集中セッションを更新可能" on %s
        for update using (auth.uid() = user_id)',
        partition_name
    );

    execute format(
        'create policy "ユーザーは自分の集中セッションを削除可能" on %s
        for delete using (auth.uid() = user_id)',
        partition_name
    );
end;
$$ language plpgsql;

-- pg_cronを使用してスケジュール実行を設定
select cron.schedule(
    'create_focus_sessions_partition', -- ジョブの名前
    '0 0 1 * *',                      -- 毎月1日の午前0時に実行
    $$select ff_focus.create_focus_sessions_partition()$$
); 