-- focus_sessions のインデックス
create index if not exists idx_focus_sessions_user_id on focus_sessions (user_id);
create index if not exists idx_focus_sessions_schedule_id on focus_sessions (schedule_id);
create index if not exists idx_focus_sessions_start_time on focus_sessions (start_time);
create index if not exists idx_focus_sessions_is_completed on focus_sessions (is_completed);
create index if not exists idx_focus_sessions_user_completed on focus_sessions (user_id, is_completed);

-- パーティションテーブルごとのインデックス作成
do $$
begin
    for i in 1..12 loop
        execute format(
            'create index if not exists idx_focus_sessions_y2024m%s_user_id 
             on focus_sessions_y2024m%s (user_id)',
            lpad(i::text, 2, '0'),
            lpad(i::text, 2, '0')
        );
        
        execute format(
            'create index if not exists idx_focus_sessions_y2024m%s_start_time 
             on focus_sessions_y2024m%s (start_time)',
            lpad(i::text, 2, '0'),
            lpad(i::text, 2, '0')
        );
    end loop;
end $$; 