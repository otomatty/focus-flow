-- 集中セッション統計取得関数
create or replace function get_focus_session_stats(
    p_user_id uuid,
    p_start_date timestamp with time zone,
    p_end_date timestamp with time zone
)
returns table (
    total_sessions bigint,
    total_duration interval,
    total_bonus_points bigint,
    average_duration interval,
    completion_rate numeric
) as $$
begin
    return query
    select
        count(*) as total_sessions,
        sum(duration) as total_duration,
        sum(bonus_points) as total_bonus_points,
        avg(duration) as average_duration,
        (sum(case when is_completed then 1 else 0 end)::numeric / count(*)::numeric * 100) as completion_rate
    from focus_sessions
    where user_id = p_user_id
    and start_time between p_start_date and p_end_date;
end;
$$ language plpgsql;

-- 集中セッション完了時の経験値計算関数
create or replace function calculate_focus_session_exp(
    p_duration interval,
    p_bonus_points integer
)
returns integer as $$
declare
    base_exp integer;
    duration_minutes integer;
begin
    duration_minutes := extract(epoch from p_duration)::integer / 60;
    base_exp := duration_minutes * 2; -- 1分あたり2ポイント
    return base_exp + p_bonus_points;
end;
$$ language plpgsql;

-- 新しいパーティション作成関数
create or replace function create_focus_session_partition(
    p_year integer,
    p_month integer
)
returns void as $$
declare
    partition_name text;
    start_date text;
    end_date text;
begin
    partition_name := format('focus_sessions_y%sm%s', 
        p_year,
        lpad(p_month::text, 2, '0')
    );
    
    start_date := format('%s-%s-01',
        p_year,
        lpad(p_month::text, 2, '0')
    );
    
    end_date := case when p_month = 12
        then format('%s-01-01', p_year + 1)
        else format('%s-%s-01',
            p_year,
            lpad((p_month + 1)::text, 2, '0')
        )
    end;
    
    execute format(
        'create table if not exists %I partition of focus_sessions
        for values from (%L) to (%L)',
        partition_name,
        start_date,
        end_date
    );
    
    -- パーティションテーブル用のインデックスを作成
    execute format(
        'create index if not exists idx_%s_user_id on %I (user_id)',
        partition_name,
        partition_name
    );
    
    execute format(
        'create index if not exists idx_%s_start_time on %I (start_time)',
        partition_name,
        partition_name
    );
end;
$$ language plpgsql; 