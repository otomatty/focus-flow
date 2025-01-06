-- シーズン移行管理テーブル
create table if not exists ff_gamification.season_transitions (
    id uuid primary key default uuid_generate_v4(),
    from_season_id uuid references ff_gamification.seasons(id) not null,
    to_season_id uuid references ff_gamification.seasons(id) not null,
    transition_start timestamp with time zone not null,
    transition_end timestamp with time zone not null,
    status text not null default 'pending',
    transition_steps jsonb not null default '{
        "archive_data": "pending",
        "calculate_rewards": "pending",
        "distribute_rewards": "pending",
        "reset_progress": "pending",
        "initialize_new_season": "pending"
    }'::jsonb,
    error_logs jsonb default '[]'::jsonb,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique (from_season_id, to_season_id),
    check (status in ('pending', 'in_progress', 'completed', 'failed')),
    check (transition_start < transition_end)
);

-- バックアップポイント管理テーブル
create table if not exists ff_gamification.transition_backups (
    id uuid primary key default uuid_generate_v4(),
    transition_id uuid references ff_gamification.season_transitions(id) not null,
    backup_type text not null,
    backup_data jsonb not null,
    created_at timestamp with time zone default now(),
    check (backup_type in ('full', 'progress_only', 'rewards_only'))
);

-- 移行チェックポイント管理テーブル
create table if not exists ff_gamification.transition_checkpoints (
    id uuid primary key default uuid_generate_v4(),
    transition_id uuid references ff_gamification.season_transitions(id) not null,
    step_name text not null,
    status text not null default 'pending',
    processed_users integer default 0,
    total_users integer,
    error_count integer default 0,
    last_processed_user_id uuid,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    check (status in ('pending', 'in_progress', 'completed', 'failed'))
);

-- パフォーマンス統計テーブル
create table if not exists ff_gamification.transition_performance_stats (
    id uuid primary key default uuid_generate_v4(),
    transition_id uuid references ff_gamification.season_transitions(id) not null,
    step_name text not null,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone,
    processed_records integer,
    execution_time interval,
    memory_usage jsonb,
    performance_metrics jsonb,
    created_at timestamp with time zone default now()
);

-- 移行通知テーブル
create table if not exists ff_gamification.transition_notifications (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    transition_id uuid references ff_gamification.season_transitions(id) not null,
    notification_type text not null,
    message text not null,
    read boolean default false,
    created_at timestamp with time zone default now(),
    check (notification_type in ('season_end', 'rewards_ready', 'new_season_start'))
);

-- データ整合性チェック結果テーブル
create table if not exists ff_gamification.data_integrity_checks (
    id uuid primary key default uuid_generate_v4(),
    transition_id uuid references ff_gamification.season_transitions(id) not null,
    check_type text not null,
    inconsistencies jsonb default '[]'::jsonb,
    resolved boolean default false,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- テーブルコメント
comment on table ff_gamification.season_transitions is 'シーズン移行プロセスを管理するテーブル';
comment on table ff_gamification.transition_backups is 'シーズン移行時のバックアップデータを管理するテーブル';
comment on table ff_gamification.transition_checkpoints is 'シーズン移行の進捗チェックポイントを管理するテーブル';
comment on table ff_gamification.transition_performance_stats is 'シーズン移行処理のパフォーマンス統計を管理するテーブル';
comment on table ff_gamification.transition_notifications is 'シーズン移行に関するユーザー通知を管理するテーブル';
comment on table ff_gamification.data_integrity_checks is 'データ整合性チェックの結果を管理するテーブル';

-- インデックス
create index if not exists idx_season_transitions_status on ff_gamification.season_transitions(status);
create index if not exists idx_transition_backups_transition on ff_gamification.transition_backups(transition_id);
create index if not exists idx_transition_checkpoints_transition on ff_gamification.transition_checkpoints(transition_id);
create index if not exists idx_transition_performance_stats_transition on ff_gamification.transition_performance_stats(transition_id);
create index if not exists idx_transition_notifications_user on ff_gamification.transition_notifications(user_id);
create index if not exists idx_data_integrity_checks_transition on ff_gamification.data_integrity_checks(transition_id);

-- バックアップ作成関数
create or replace function ff_gamification.create_transition_backup(
    p_transition_id uuid,
    p_backup_type text
)
returns uuid as $$
declare
    v_backup_id uuid;
begin
    insert into ff_gamification.transition_backups (
        transition_id,
        backup_type,
        backup_data
    )
    select
        p_transition_id,
        p_backup_type,
        case p_backup_type
            when 'full' then (
                select jsonb_build_object(
                    'user_progress', jsonb_agg(to_jsonb(up.*)),
                    'season_data', to_jsonb(s.*)
                )
                from ff_gamification.user_progress up
                join ff_gamification.seasons s on s.id = up.season_id
                where s.id = (
                    select from_season_id
                    from ff_gamification.season_transitions
                    where id = p_transition_id
                )
            )
            when 'progress_only' then (
                select jsonb_agg(to_jsonb(up.*))
                from ff_gamification.user_progress up
                where up.season_id = (
                    select from_season_id
                    from ff_gamification.season_transitions
                    where id = p_transition_id
                )
            )
            else null
        end
    returning id into v_backup_id;

    return v_backup_id;
end;
$$ language plpgsql;

-- チェックポイント更新関数
create or replace function ff_gamification.update_checkpoint(
    p_transition_id uuid,
    p_step_name text,
    p_processed_count integer,
    p_status text
)
returns void as $$
begin
    update ff_gamification.transition_checkpoints
    set
        processed_users = processed_users + p_processed_count,
        status = p_status,
        updated_at = now()
    where transition_id = p_transition_id
    and step_name = p_step_name;
end;
$$ language plpgsql;

-- パフォーマンス記録関数
create or replace function ff_gamification.log_performance_stats(
    p_transition_id uuid,
    p_step_name text,
    p_start_time timestamp with time zone,
    p_processed_records integer
)
returns void as $$
begin
    insert into ff_gamification.transition_performance_stats (
        transition_id,
        step_name,
        start_time,
        end_time,
        processed_records,
        execution_time,
        performance_metrics
    )
    values (
        p_transition_id,
        p_step_name,
        p_start_time,
        now(),
        p_processed_records,
        now() - p_start_time,
        jsonb_build_object(
            'avg_time_per_record', 
            extract(epoch from (now() - p_start_time)) / nullif(p_processed_records, 0)
        )
    );
end;
$$ language plpgsql;

-- 通知作成関数
create or replace function ff_gamification.create_transition_notification(
    p_user_id uuid,
    p_transition_id uuid,
    p_notification_type text,
    p_message text
)
returns void as $$
begin
    insert into ff_gamification.transition_notifications (
        user_id,
        transition_id,
        notification_type,
        message
    )
    values (
        p_user_id,
        p_transition_id,
        p_notification_type,
        p_message
    );
end;
$$ language plpgsql;

-- データ整合性チェック関数
create or replace function ff_gamification.verify_data_integrity(
    p_transition_id uuid
)
returns void as $$
begin
    -- 進捗データの整合性チェック
    insert into ff_gamification.data_integrity_checks (
        transition_id,
        check_type,
        inconsistencies
    )
    select
        p_transition_id,
        'progress',
        jsonb_agg(
            jsonb_build_object(
                'user_id', up.user_id,
                'issue', 'invalid_points',
                'details', 'Points do not match achievements'
            )
        )
    from ff_gamification.user_progress up
    where up.season_id = (
        select from_season_id
        from ff_gamification.season_transitions
        where id = p_transition_id
    )
    and up.current_points < 0;
end;
$$ language plpgsql;

-- シーズン移行実行関数
create or replace function ff_gamification.execute_season_transition(
    p_from_season_id uuid,
    p_to_season_id uuid
)
returns void as $$
declare
    v_transition_record record;
    v_start_time timestamp with time zone;
begin
    v_start_time := now();
    
    -- 移行レコードの作成
    insert into ff_gamification.season_transitions (
        from_season_id,
        to_season_id,
        transition_start,
        transition_end
    )
    values (
        p_from_season_id,
        p_to_season_id,
        now(),
        now() + interval '24 hours'
    )
    returning * into v_transition_record;

    -- バックアップの作成
    perform ff_gamification.create_transition_backup(v_transition_record.id, 'full');
    
    -- データ整合性チェック
    perform ff_gamification.verify_data_integrity(v_transition_record.id);
    
    -- 移行処理の実行
    perform ff_gamification.archive_season_data(p_from_season_id);
    perform ff_gamification.calculate_season_rewards(p_from_season_id);
    perform ff_gamification.distribute_season_rewards(p_from_season_id);
    perform ff_gamification.reset_season_progress(p_from_season_id);
    perform ff_gamification.initialize_new_season(p_to_season_id);
    
    -- パフォーマンス統計の記録
    perform ff_gamification.log_performance_stats(
        v_transition_record.id,
        'full_transition',
        v_start_time,
        (select count(*) from ff_gamification.user_progress where season_id = p_from_season_id)
    );
    
    -- 移行完了を記録
    update ff_gamification.season_transitions
    set 
        status = 'completed',
        transition_steps = jsonb_set(
            transition_steps,
            '{initialize_new_season}',
            '"completed"'::jsonb
        ),
        updated_at = now()
    where id = v_transition_record.id;

exception when others then
    -- エラー発生時の処理
    update ff_gamification.season_transitions
    set 
        status = 'failed',
        error_logs = error_logs || jsonb_build_object(
            'timestamp', now(),
            'error', SQLERRM,
            'detail', SQLSTATE
        ),
        updated_at = now()
    where id = v_transition_record.id;
    
    raise;
end;
$$ language plpgsql; 