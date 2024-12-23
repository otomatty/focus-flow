-- updated_at更新トリガー
create trigger update_user_profiles_updated_at
    before update on user_profiles
    for each row
    execute function update_updated_at_column();

create trigger update_user_settings_updated_at
    before update on user_settings
    for each row
    execute function update_updated_at_column();

create trigger update_tasks_updated_at
    before update on tasks
    for each row
    execute function update_updated_at_column();

create trigger update_task_reminders_updated_at
    before update on task_reminders
    for each row
    execute function update_updated_at_column();

create trigger update_schedules_updated_at
    before update on schedules
    for each row
    execute function update_updated_at_column();

create trigger update_focus_sessions_updated_at
    before update on focus_sessions
    for each row
    execute function update_updated_at_column();

create trigger update_user_quests_updated_at
    before update on user_quests
    for each row
    execute function update_updated_at_column();

-- キャッシュバージョン更新トリガー
create trigger update_user_profiles_cache_version
    before update on user_profiles
    for each row
    execute function update_cache_version();

-- タスク完了時の経験値付与トリガー
create or replace function on_task_complete()
returns trigger as $$
begin
    if new.status = 'completed' and old.status != 'completed' then
        -- 基本経験値（優先度に応じて変動）
        perform add_experience_points(
            new.user_id,
            case new.priority
                when 'high' then 100
                when 'medium' then 50
                when 'low' then 30
                else 20
            end
        );
        
        -- バッジ条件チェック
        insert into user_badges (user_id, badge_id)
        select new.user_id, badge_id
        from check_badge_conditions(
            new.user_id,
            'task_complete',
            jsonb_build_object(
                'count',
                (select count(*) from tasks where user_id = new.user_id and status = 'completed')
            )
        );
        
        -- クエスト進捗更新
        perform update_quest_progress(
            new.user_id,
            'task_complete',
            jsonb_build_object('count', 1)
        );
    end if;
    return new;
end;
$$ language plpgsql;

create trigger task_complete_trigger
    after update on tasks
    for each row
    execute function on_task_complete();

-- 集中セッション完了時の経験値付与トリガー
create or replace function on_focus_session_complete()
returns trigger as $$
begin
    if new.is_completed and not old.is_completed then
        -- 経験値を計算して付与
        perform add_experience_points(
            new.user_id,
            calculate_focus_session_exp(new.duration, new.bonus_points)
        );
        
        -- バッジ条件チェック
        insert into user_badges (user_id, badge_id)
        select new.user_id, badge_id
        from check_badge_conditions(
            new.user_id,
            'focus_session_complete',
            jsonb_build_object(
                'count',
                (select count(*) from focus_sessions where user_id = new.user_id and is_completed = true)
            )
        );
        
        -- クエスト進捗更新
        perform update_quest_progress(
            new.user_id,
            'focus_session',
            jsonb_build_object(
                'minutes',
                extract(epoch from new.duration)::integer / 60
            )
        );
    end if;
    return new;
end;
$$ language plpgsql;

create trigger focus_session_complete_trigger
    after update on focus_sessions
    for each row
    execute function on_focus_session_complete(); 