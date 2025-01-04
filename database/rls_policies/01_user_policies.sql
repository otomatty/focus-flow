-- システム管理者チェック用の関数
create or replace function ff_users.is_system_admin(user_id uuid)
returns boolean as $$
declare
    result boolean;
    role_count integer;
    role_details jsonb;
begin
    -- ロールの詳細情報を取得
    select 
        jsonb_build_object(
            'role_mappings', jsonb_agg(
                jsonb_build_object(
                    'role_id', ur.id,
                    'role_name', ur.name,
                    'is_active', urm.is_active,
                    'assigned_at', urm.assigned_at
                )
            )
        )
    into role_details
    from ff_users.user_role_mappings urm
    join ff_users.user_roles ur on urm.role_id = ur.id
    where urm.user_id = user_id;

    -- システム管理者権限の確認（現在の日時でアクティブなものだけを確認）
    select exists (
        select 1
        from ff_users.user_role_mappings urm
        join ff_users.user_roles ur on urm.role_id = ur.id
        where urm.user_id = user_id
        and ur.name = 'SYSTEM_ADMIN'
        and urm.is_active = true
        and urm.assigned_at <= now()
    ) into result;

    -- 全ロールの数を取得
    select count(*)
    into role_count
    from ff_users.user_role_mappings urm
    where urm.user_id = user_id
    and urm.assigned_at <= now();

    -- デバッグログを記録
    insert into ff_logs.debug_logs (
        function_name,
        status,
        details,
        created_at
    ) values (
        'is_system_admin',
        case 
            when result then 'success'
            when role_count = 0 then 'no_roles'
            else 'not_admin'
        end,
        jsonb_build_object(
            'user_id', user_id,
            'is_admin', result,
            'role_count', role_count,
            'role_details', role_details,
            'current_timestamp', now(),
            'check_timestamp', now()
        ),
        now()
    );

    return result;
exception
    when others then
        -- エラーログを記録
        insert into ff_logs.debug_logs (
            function_name,
            status,
            details,
            created_at
        ) values (
            'is_system_admin',
            'error',
            jsonb_build_object(
                'user_id', user_id,
                'error_code', SQLSTATE,
                'error_message', SQLERRM,
                'stack_trace', pg_exception_context(),
                'role_details', role_details,
                'current_timestamp', now()
            ),
            now()
        );
        return false;
end;
$$ language plpgsql security definer;

-- user_profiles のRLSポリシー
alter table if exists ff_users.user_profiles enable row level security;

-- 既存のポリシーを削除
drop policy if exists "ユーザーは自分のプロファイルを参照可能" on ff_users.user_profiles;
drop policy if exists "ユーザーは自分のプロファイルを作成可能" on ff_users.user_profiles;
drop policy if exists "ユーザーは自分のプロファイルを更新可能" on ff_users.user_profiles;
drop policy if exists "ユーザーは自分のプロファイルを削除可能" on ff_users.user_profiles;

-- ポリシーを再作成
create policy "ユーザーは自分のプロファイルを参照可能"
    on ff_users.user_profiles for select
    using (auth.uid() = user_id or ff_users.is_system_admin(auth.uid()));

create policy "ユーザーは自分のプロファイルを作成可能"
    on ff_users.user_profiles for insert
    with check (auth.uid() = user_id);

create policy "ユーザーは自分のプロファイルを更新可能"
    on ff_users.user_profiles for update
    using (auth.uid() = user_id or ff_users.is_system_admin(auth.uid()));

create policy "ユーザーは自分のプロファイルを削除可能"
    on ff_users.user_profiles for delete
    using (auth.uid() = user_id or ff_users.is_system_admin(auth.uid()));

-- user_roles のRLSポリシー
alter table if exists ff_users.user_roles enable row level security;

-- 既存のポリシーを削除
drop policy if exists "全てのユーザーはロール情報を参照可能" on ff_users.user_roles;
drop policy if exists "管理者はロールを作成可能" on ff_users.user_roles;
drop policy if exists "管理者はロールを更新可能" on ff_users.user_roles;
drop policy if exists "管理者はロールを削除可能" on ff_users.user_roles;

-- ポリシーを再作成
create policy "全てのユーザーはロール情報を参照可能"
    on ff_users.user_roles for select
    using (true);

create policy "管理者はロールを作成可能"
    on ff_users.user_roles for insert
    with check (ff_users.is_system_admin(auth.uid()));

create policy "管理者はロールを更新可能"
    on ff_users.user_roles for update
    using (ff_users.is_system_admin(auth.uid()));

create policy "管理者はロールを削除可能"
    on ff_users.user_roles for delete
    using (ff_users.is_system_admin(auth.uid()));

-- user_role_mappings のRLSポリシー
alter table if exists ff_users.user_role_mappings enable row level security;

-- 既存のポリシーを削除
drop policy if exists "ユーザーは自分のロールマッピングを参照可能" on ff_users.user_role_mappings;
drop policy if exists "管理者はすべてのロールマッピングを参照可能" on ff_users.user_role_mappings;
drop policy if exists "管理者はロールマッピングを作成可能" on ff_users.user_role_mappings;
drop policy if exists "管理者はロールマッピングを更新可能" on ff_users.user_role_mappings;
drop policy if exists "管理者はロールマッピングを削除可能" on ff_users.user_role_mappings;

-- ポリシーを再作成
create policy "ユーザーは自分のロールマッピングを参照可能"
    on ff_users.user_role_mappings for select
    using (user_id = auth.uid());

create policy "管理者はすべてのロールマッピングを参照可能"
    on ff_users.user_role_mappings for select
    using (ff_users.is_system_admin(auth.uid()));

create policy "管理者はロールマッピングを作成可能"
    on ff_users.user_role_mappings for insert
    with check (ff_users.is_system_admin(auth.uid()));

create policy "管理者はロールマッピングを更新可能"
    on ff_users.user_role_mappings for update
    using (ff_users.is_system_admin(auth.uid()));

create policy "管理者はロールマッピングを削除可能"
    on ff_users.user_role_mappings for delete
    using (ff_users.is_system_admin(auth.uid()));

-- user_settings のRLSポリシー
alter table if exists ff_users.user_settings enable row level security;

-- 既存のポリシーを削除
drop policy if exists "ユーザーは自分の設定を参照可能" on ff_users.user_settings;
drop policy if exists "ユーザーは自分の設定を作成可能" on ff_users.user_settings;
drop policy if exists "ユーザーは自分の設定を更新可能" on ff_users.user_settings;
drop policy if exists "ユーザーは自分の設定を削除可能" on ff_users.user_settings;

-- ポリシーを再作成
create policy "ユーザーは自分の設定を参照可能"
    on ff_users.user_settings for select
    using (auth.uid() = user_id or ff_users.is_system_admin(auth.uid()));

create policy "ユーザーは自分の設定を作成可能"
    on ff_users.user_settings for insert
    with check (auth.uid() = user_id);

create policy "ユーザーは自分の設定を更新可能"
    on ff_users.user_settings for update
    using (auth.uid() = user_id or ff_users.is_system_admin(auth.uid()));

create policy "ユーザーは自分の設定を削除可能"
    on ff_users.user_settings for delete
    using (auth.uid() = user_id or ff_users.is_system_admin(auth.uid()));

-- auth.usersテーブルへのアクセス権限を付与
grant usage on schema auth to anon, authenticated;
grant select on auth.users to anon, authenticated;
grant update on auth.users to service_role;
grant select, insert, update on auth.users to postgres;

-- auth関連の関数への権限付与
grant execute on function auth.uid() to anon, authenticated;
grant execute on function auth.role() to anon, authenticated;
grant execute on function auth.email() to anon, authenticated;

-- ff_usersスキーマへの権限設定
grant usage on schema ff_users to anon, authenticated;
grant all on all tables in schema ff_users to service_role;
grant all on all sequences in schema ff_users to service_role;
grant all on all functions in schema ff_users to service_role;

-- ff_logsスキーマへの権限設定
grant usage on schema ff_logs to anon, authenticated;
grant all on all tables in schema ff_logs to service_role;
grant all on all sequences in schema ff_logs to service_role; 