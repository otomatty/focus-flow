-- ユーザーレベル情報の初期化関数
create or replace function ff_gamification.initialize_user_level(new_user_id uuid)
returns ff_gamification.user_levels as $$
declare
    new_level ff_gamification.user_levels;
begin
    -- トランザクションの開始
    begin
        -- 既存のレベル情報をチェック
        if exists (
            select 1
            from ff_gamification.user_levels
            where user_id = new_user_id
        ) then
            select * into new_level
            from ff_gamification.user_levels
            where user_id = new_user_id;
            return new_level;
        end if;

        -- 新規レベル情報を作成
        insert into ff_gamification.user_levels (
            user_id,
            current_level,
            current_exp,
            total_exp,
            created_at,
            updated_at
        ) values (
            new_user_id,
            1,  -- 初期レベル
            0,  -- 初期経験値
            0,  -- 累計経験値
            now(),
            now()
        ) returning * into new_level;

        -- システムログに記録
        insert into ff_logs.system_logs (
            event_type,
            event_source,
            event_data,
            severity
        ) values (
            'USER_LEVEL_INITIALIZED',
            'initialize_user_level',
            jsonb_build_object(
                'user_id', new_user_id,
                'initial_level', 1
            ),
            'INFO'
        );

        return new_level;

    exception when others then
        -- エラーをログに記録
        insert into ff_logs.system_logs (
            event_type,
            event_source,
            event_data,
            severity
        ) values (
            'ERROR_INITIALIZING_USER_LEVEL',
            'initialize_user_level',
            jsonb_build_object(
                'user_id', new_user_id,
                'error_code', SQLSTATE,
                'error_message', SQLERRM
            ),
            'ERROR'
        );
        raise;
    end;
end;
$$ language plpgsql security definer;

-- RLSポリシーの設定
alter table ff_gamification.user_levels enable row level security;

create policy "Users can view their own level"
    on ff_gamification.user_levels for select
    using (auth.uid() = user_id);

create policy "Service role can manage all levels"
    on ff_gamification.user_levels for all
    using (auth.role() = 'service_role');

drop policy if exists "Initialize level through function" on ff_gamification.user_levels;

create policy "Users can initialize their own level"
    on ff_gamification.user_levels for insert
    with check (
        auth.uid() = user_id or
        auth.role() = 'service_role'
    );

-- トリガーの設定
create or replace function ff_gamification.tr_initialize_user_level()
returns trigger as $$
begin
    perform ff_gamification.initialize_user_level(new.id);
    return new;
end;
$$ language plpgsql security definer;

create trigger initialize_user_level_on_profile_creation
    after insert on ff_users.user_profiles
    for each row
    execute function ff_gamification.tr_initialize_user_level(); 