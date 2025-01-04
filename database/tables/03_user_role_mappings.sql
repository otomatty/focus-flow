-- ユーザーロールマッピングテーブル
-- このテーブルはユーザーと役割の関係を管理します

-- 新規ユーザーにデフォルトロールを付与するトリガー関数
create or replace function ff_users.assign_default_user_role()
returns trigger as $$
declare
    default_role_id uuid;
    default_role_name text := 'USER';
begin
    -- トランザクション開始
    begin
        -- デバッグログ: 関数開始
        insert into ff_logs.debug_logs (
            function_name,
            status,
            details,
            created_at
        ) values (
            'assign_default_user_role',
            'start',
            jsonb_build_object(
                'user_id', new.id,
                'default_role_name', default_role_name,
                'timestamp', now()
            ),
            now()
        );

        -- USERロールのIDを取得
        select id into strict default_role_id
        from ff_users.user_roles
        where name = default_role_name;

        -- ユバッグログ: ロールID取得
        insert into ff_logs.debug_logs (
            function_name,
            status,
            details,
            created_at
        ) values (
            'assign_default_user_role',
            'role_found',
            jsonb_build_object(
                'user_id', new.id,
                'role_id', default_role_id,
                'role_name', default_role_name
            ),
            now()
        );

        -- ユーザーにロールが割り当てられていない場合のみ、デフォルトロールを割り当て
        if not exists (
            select 1
            from ff_users.user_role_mappings
            where user_id = new.id
        ) then
            insert into ff_users.user_role_mappings (
                user_id,
                role_id,
                is_active,
                assigned_at,
                assigned_by
            ) values (
                new.id,
                default_role_id,
                true,
                now(),
                new.id
            );
            
            -- ログ記録
            insert into ff_logs.system_logs (
                event_type,
                event_source,
                event_data,
                created_by
            ) values (
                'DEFAULT_ROLE_ASSIGNED',
                'assign_default_user_role',
                jsonb_build_object(
                    'user_id', new.id,
                    'role_id', default_role_id,
                    'role_name', default_role_name
                ),
                new.id
            );

            insert into ff_logs.debug_logs (
                function_name,
                status,
                details,
                created_at
            ) values (
                'assign_default_user_role',
                'success',
                jsonb_build_object(
                    'user_id', new.id,
                    'role_id', default_role_id,
                    'role_name', default_role_name,
                    'timestamp', now()
                ),
                now()
            );
        else
            -- デバッグログ: 既存のロールマッピングが見つかった
            insert into ff_logs.debug_logs (
                function_name,
                status,
                details,
                created_at
            ) values (
                'assign_default_user_role',
                'existing_role_found',
                jsonb_build_object(
                    'user_id', new.id,
                    'timestamp', now()
                ),
                now()
            );
        end if;
    exception
        when no_data_found then
            insert into ff_logs.debug_logs (
                function_name,
                status,
                details,
                created_at
            ) values (
                'assign_default_user_role',
                'error_no_default_role',
                jsonb_build_object(
                    'user_id', new.id,
                    'default_role_name', default_role_name,
                    'error_code', SQLSTATE,
                    'error_message', SQLERRM
                ),
                now()
            );
            raise exception 'デフォルトロール（%）が見つかりません。システム管理者に連絡してください。', default_role_name;
        when too_many_rows then
            insert into ff_logs.debug_logs (
                function_name,
                status,
                details,
                created_at
            ) values (
                'assign_default_user_role',
                'error_multiple_default_roles',
                jsonb_build_object(
                    'user_id', new.id,
                    'default_role_name', default_role_name,
                    'error_code', SQLSTATE,
                    'error_message', SQLERRM
                ),
                now()
            );
            raise exception 'デフォルトロール（%）が複数存在します。システム管理者に連絡してください。', default_role_name;
        when others then
            -- エラーログ記録
            insert into ff_logs.debug_logs (
                function_name,
                status,
                details,
                created_at
            ) values (
                'assign_default_user_role',
                'error_unknown',
                jsonb_build_object(
                    'user_id', new.id,
                    'error_code', SQLSTATE,
                    'error_message', SQLERRM,
                    'stack_trace', pg_exception_context()
                ),
                now()
            );
            raise;
    end;

    return new;
end;
$$ language plpgsql security definer;

-- auth.usersテーブルに対するトリガーを作成
drop trigger if exists tr_assign_default_user_role on auth.users;
create trigger tr_assign_default_user_role
    after insert on auth.users
    for each row
    execute function ff_users.assign_default_user_role();

create table if not exists ff_users.user_role_mappings (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    role_id uuid references ff_users.user_roles(id) not null,
    is_active boolean default true,
    assigned_at timestamp with time zone default now(),
    assigned_by uuid references auth.users(id),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    -- アクティブなマッピングの重複を防ぐ
    unique(user_id, role_id, is_active)
);

-- テーブルコメント
comment on table ff_users.user_role_mappings is 'ユーザーとロールの関連付けを管理するテーブル';

-- カラムコメント
comment on column ff_users.user_role_mappings.id is 'マッピングの一意識別子';
comment on column ff_users.user_role_mappings.user_id is 'ロールが割り当てられるユーザーのID';
comment on column ff_users.user_role_mappings.role_id is '割り当てられるロールのID';
comment on column ff_users.user_role_mappings.is_active is 'このロール割り当てが有効かどうか';
comment on column ff_users.user_role_mappings.assigned_at is 'ロールが割り当てられた日時';
comment on column ff_users.user_role_mappings.assigned_by is 'ロールを割り当てた管理者のID';
comment on column ff_users.user_role_mappings.created_at is 'レコード作成日時';
comment on column ff_users.user_role_mappings.updated_at is 'レコード更新日時';

-- インデックス
create index if not exists idx_user_role_mappings_user_id on ff_users.user_role_mappings(user_id);
create index if not exists idx_user_role_mappings_role_id on ff_users.user_role_mappings(role_id);
create index if not exists idx_user_role_mappings_active on ff_users.user_role_mappings(is_active);

-- トリガー
drop trigger if exists update_user_role_mappings_updated_at on ff_users.user_role_mappings;
create trigger update_user_role_mappings_updated_at
    before update on ff_users.user_role_mappings
    for each row
    execute function update_updated_at_column(); 