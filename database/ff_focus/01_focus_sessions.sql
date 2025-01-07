-- 集中セッションの種類を定義する列挙型
create type ff_focus.session_type as enum (
    'FREE',          -- 自由な集中時間
    'SCHEDULED'      -- スケジュール済みの集中時間
);

-- セッションの完了状態を定義する列挙型
create type ff_focus.completion_status as enum (
    'PERFECT',       -- 完璧に完了（25分フル＋適切な休憩）
    'COMPLETED',     -- 完了（25分は達成したが、理想的な休憩を取らなかった）
    'PARTIAL',       -- 部分的に完了（25分未満で終了）
    'ABANDONED'      -- 放棄（ほとんど進まなかった）
);

-- 集中セッションテーブル（月次パーティション）
create table if not exists ff_focus.focus_sessions (
    -- 基本情報
    id uuid not null default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    session_type ff_focus.session_type not null default 'FREE',
    
    -- 時間管理
    scheduled_start_time timestamp with time zone,  -- スケジュール時の開始予定時刻
    actual_start_time timestamp with time zone not null,     -- 実際の開始時刻
    end_time timestamp with time zone,              -- 終了時刻
    actual_duration interval,                       -- 実際の集中時間
    
    -- セッション完了状態
    completion_status ff_focus.completion_status not null,  -- セッションの完了状態
    session_number integer not null,               -- 連続セッション中の何番目のセッションか
    total_sessions integer not null,               -- この回の連続セッションの総数
    needs_long_break boolean default false,         -- 長休憩が必要かどうか
    
    -- 関連付け
    task_id uuid references ff_tasks.tasks(id),              -- タスクとの連携
    habit_id uuid references ff_habits.user_habits(id),           -- 習慣との連携
    schedule_id uuid references ff_schedules.schedules(id),  -- スケジュールとの連携
    -- note_id uuid references ff_notes.notes(id),             -- TODO:ノート機能の実装
    
    -- フィードバック
    focus_rating integer not null check (focus_rating between 1 and 5),  -- 集中度の自己評価
    
    -- 経験値
    earned_exp integer not null default 0,          -- このセッションで獲得した経験値
    
    -- システム管理
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    
    -- パーティショニングキーを含む主キー制約
    primary key (id, actual_start_time),
    -- 外部キー参照用の一意制約（パーティショニングキーを含む）
    unique (id, actual_start_time)
) partition by range (actual_start_time);

-- テーブルとカラムのコメント
comment on table ff_focus.focus_sessions is '25分の集中セッション記録を管理するテーブル';
comment on column ff_focus.focus_sessions.session_type is 'セッションの種類（自由、スケジュール済み）';
comment on column ff_focus.focus_sessions.completion_status is 'セッションの完了状態（完璧、完了、部分的、放棄）';
comment on column ff_focus.focus_sessions.session_number is '連続セッション中の何番目のセッションか';
comment on column ff_focus.focus_sessions.total_sessions is 'この回の連続セッションの総数';
comment on column ff_focus.focus_sessions.needs_long_break is '4セッション完了後の長休憩（15分）が必要かどうか';
comment on column ff_focus.focus_sessions.focus_rating is '集中度の自己評価（1-5）';
comment on column ff_focus.focus_sessions.earned_exp is 'このセッションで獲得した経験値';

-- 経験値計算用の関数（シンプル化）
create or replace function ff_focus.calculate_session_exp(
    p_completion_status ff_focus.completion_status,
    p_session_number integer
) returns integer as $$
declare
    base_exp integer;
begin
    -- 基本経験値の設定
    case p_completion_status
        when 'PERFECT' then base_exp := 100;
        when 'COMPLETED' then base_exp := 80;
        when 'PARTIAL' then base_exp := 40;
        when 'ABANDONED' then base_exp := 10;
    end case;
    
    -- 連続セッションボーナス（3セッション目以降にボーナス）
    if p_session_number >= 3 then
        base_exp := base_exp * 1.2;  -- 20%ボーナス
    end if;

    return base_exp;
end;
$$ language plpgsql immutable;

-- 集中セッションの完了状態を判定する関数
create or replace function ff_focus.determine_completion_status(
    p_actual_duration interval,            -- 実際の集中時間
    p_start_time timestamp with time zone, -- 開始時刻
    p_end_time timestamp with time zone    -- 終了時刻
)
returns ff_focus.completion_status as $$
declare
    v_target_duration interval := interval '25 minutes';  -- 目標時間（25分）
    v_minimum_duration interval := interval '5 minutes';  -- 最小有効時間（5分）
    v_actual_minutes int;
    v_break_duration interval;
begin
    -- 実際の集中時間（分）を計算
    v_actual_minutes := extract(epoch from p_actual_duration) / 60;
    
    -- 休憩時間を計算（終了時刻 - 開始時刻 - 実際の集中時間）
    v_break_duration := (p_end_time - p_start_time) - p_actual_duration;

    -- 完了状態の判定
    -- 1. 完璧な完了：25分フルで集中し、適切な休憩（2-7分）を取った場合
    if v_actual_minutes >= 25 and 
       v_break_duration between interval '2 minutes' and interval '7 minutes' then
        return 'PERFECT';
        
    -- 2. 通常の完了：25分は達成したが、休憩が理想的でない場合
    elsif v_actual_minutes >= 25 then
        return 'COMPLETED';
        
    -- 3. 部分的な完了：5分以上25分未満の集中ができた場合
    elsif v_actual_minutes >= 5 then
        return 'PARTIAL';
        
    -- 4. 放棄：5分未満で終了した場合
    else
        return 'ABANDONED';
    end if;
end;
$$ language plpgsql immutable;

-- セッション完了時のトリガー関数を更新
create or replace function ff_focus.on_session_complete()
returns trigger as $$
begin
    -- 完了状態の判定
    if new.completion_status is null then
        new.completion_status := ff_focus.determine_completion_status(
            new.actual_duration,
            new.actual_start_time,
            new.end_time
        );
    end if;

    -- 経験値の計算と設定
    new.earned_exp := ff_focus.calculate_session_exp(
        new.completion_status,
        new.session_number
    );

    -- 経験値をユーザーレベルテーブルに反映
    update ff_gamification.user_levels
    set total_exp = total_exp + new.earned_exp
    where user_id = new.user_id;

    -- 4セッション完了後の長休憩フラグ設定
    if new.session_number % 4 = 0 then
        new.needs_long_break := true;
    end if;

    return new;
end;
$$ language plpgsql security definer;

-- セッション完了時のトリガー
create trigger tr_session_complete
    before insert on ff_focus.focus_sessions
    for each row
    execute function ff_focus.on_session_complete();

-- 親テーブルにRLSを有効化
alter table ff_focus.focus_sessions enable row level security;

-- 親テーブルにRLSポリシーを設定
create policy "ユーザーは自分の集中セッションを参照可能" on ff_focus.focus_sessions
    for select using (auth.uid() = user_id);

create policy "ユーザーは自分の集中セッションを作成可能" on ff_focus.focus_sessions
    for insert with check (auth.uid() = user_id);

create policy "システム管理者は全ての集中セッションを参照可能" on ff_focus.focus_sessions
    for select using (
        exists (
            select 1 from ff_users.user_role_mappings urm
            join ff_users.user_roles ur on urm.role_id = ur.id
            where urm.user_id = auth.uid()
            and ur.name = 'SYSTEM_ADMIN'
        )
    );

create policy "システム管理者は全ての集中セッションを更新可能" on ff_focus.focus_sessions
    for update using (
        exists (
            select 1 from ff_users.user_role_mappings urm
            join ff_users.user_roles ur on urm.role_id = ur.id
            where urm.user_id = auth.uid()
            and ur.name = 'SYSTEM_ADMIN'
        )
    );

create policy "システム管理者は全ての集中セッションを削除可能" on ff_focus.focus_sessions
    for delete using (
        exists (
            select 1 from ff_users.user_role_mappings urm
            join ff_users.user_roles ur on urm.role_id = ur.id
            where urm.user_id = auth.uid()
            and ur.name = 'SYSTEM_ADMIN'
        )
    );

-- 初期パーティション作成（2025年1月）
create table if not exists ff_focus.focus_sessions_y2025m01 partition of ff_focus.focus_sessions
    for values from ('2025-01-01') to ('2025-02-01');

-- 初期パーティションにRLSを有効化
alter table ff_focus.focus_sessions_y2025m01 enable row level security;

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
        'create index if not exists idx_%s_actual_start_time on %s (actual_start_time)',
        replace(partition_name, 'ff_focus.', ''),
        partition_name
    );

    execute format(
        'create index if not exists idx_%s_session_status on %s (session_status)',
        replace(partition_name, 'ff_focus.', ''),
        partition_name
    );

    execute format(
        'create index if not exists idx_%s_task_id on %s (task_id) where task_id is not null',
        replace(partition_name, 'ff_focus.', ''),
        partition_name
    );

    execute format(
        'create index if not exists idx_%s_habit_id on %s (habit_id) where habit_id is not null',
        replace(partition_name, 'ff_focus.', ''),
        partition_name
    );

    execute format(
        'create index if not exists idx_%s_schedule_id on %s (schedule_id) where schedule_id is not null',
        replace(partition_name, 'ff_focus.', ''),
        partition_name
    );

    execute format(
        'create index if not exists idx_%s_tags on %s using gin (tags)',
        replace(partition_name, 'ff_focus.', ''),
        partition_name
    );
end;
$$ language plpgsql;

