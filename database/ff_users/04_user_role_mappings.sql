-- ユーザーロールマッピングテーブル
create table if not exists ff_users.user_role_mappings (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null unique,  -- 1ユーザー1ロールを保証
    role_id uuid references ff_users.user_roles(id) not null,
    assigned_at timestamp with time zone default now(),
    assigned_by uuid references auth.users(id),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- テーブルコメント
comment on table ff_users.user_role_mappings is 'ユーザーとロールの関連付けを管理するテーブル';

-- カラムコメント
comment on column ff_users.user_role_mappings.id is 'マッピングの一意識別子';
comment on column ff_users.user_role_mappings.user_id is 'ロールが割り当てられるユーザーのID';
comment on column ff_users.user_role_mappings.role_id is '割り当てられるロールのID';
comment on column ff_users.user_role_mappings.assigned_at is 'ロールが割り当てられた日時';
comment on column ff_users.user_role_mappings.assigned_by is 'ロールを割り当てた管理者のID';
comment on column ff_users.user_role_mappings.created_at is 'レコード作成日時';
comment on column ff_users.user_role_mappings.updated_at is 'レコード更新日時';

-- インデックス
create index if not exists idx_user_role_mappings_user_id on ff_users.user_role_mappings(user_id);
create index if not exists idx_user_role_mappings_role_id on ff_users.user_role_mappings(role_id);

-- 新規ユーザーにデフォルトロールを付与する関数
create or replace function ff_users.assign_default_user_role(new_user auth.users)
returns void as $$
declare
    default_role_id uuid;
    existing_role_mapping uuid;
begin
    -- トランザクションの開始
    begin
        -- 既存のロール割り当てをチェック（FOR UPDATE句を追加してロックを取得）
        select id into existing_role_mapping
        from ff_users.user_role_mappings
        where user_id = new_user.id
        for update skip locked;

        if existing_role_mapping is not null then
            -- 既に割り当てがある場合はログを記録して正常終了
            insert into ff_logs.system_logs (
                event_type,
                event_source,
                event_data,
                created_by,
                severity
            ) values (
                'DEFAULT_ROLE_SKIPPED',
                'assign_default_user_role',
                jsonb_build_object(
                    'user_id', new_user.id,
                    'reason', 'User already has a role assigned',
                    'existing_mapping_id', existing_role_mapping
                ),
                null,
                'INFO'
            );
            return;
        end if;

        -- デフォルトロール（USER）のIDを取得
        select id into default_role_id
        from ff_users.user_roles
        where name = 'USER'
        for update skip locked;

        -- ロールが見つからない場合はデフォルトロールを作成
        if default_role_id is null then
            insert into ff_users.user_roles (name, description)
            values ('USER', '一般ユーザー。基本的な機能へのアクセスが可能。')
            returning id into default_role_id;
        end if;

        -- ユーザーにロールを割り当て
        insert into ff_users.user_role_mappings (
            user_id,
            role_id,
            assigned_at,
            assigned_by
        ) values (
            new_user.id,
            default_role_id,
            now(),
            null
        );

        -- システムログに記録
        insert into ff_logs.system_logs (
            event_type,
            event_source,
            event_data,
            created_by,
            severity
        ) values (
            'DEFAULT_ROLE_ASSIGNED',
            'assign_default_user_role',
            jsonb_build_object(
                'user_id', new_user.id,
                'role_id', default_role_id
            ),
            null,
            'INFO'
        );

        -- デフォルトカテゴリを作成
        perform ff_schedules.create_default_categories(new_user);

    exception
        when unique_violation then
            -- 一意性制約違反の場合は無視（他のトランザクションが既に挿入した可能性）
            insert into ff_logs.system_logs (
                event_type,
                event_source,
                event_data,
                created_by,
                severity
            ) values (
                'DEFAULT_ROLE_DUPLICATE',
                'assign_default_user_role',
                jsonb_build_object(
                    'user_id', new_user.id,
                    'error', SQLERRM
                ),
                null,
                'WARNING'
            );
        when others then
            -- その他のエラーの場合はログを記録して再スロー
            insert into ff_logs.system_logs (
                event_type,
                event_source,
                event_data,
                created_by,
                severity
            ) values (
                'ERROR_ASSIGNING_ROLE',
                'assign_default_user_role',
                jsonb_build_object(
                    'user_id', new_user.id,
                    'error_code', SQLSTATE,
                    'error_message', SQLERRM
                ),
                null,
                'ERROR'
            );
            raise;
    end;
end;
$$ language plpgsql security definer;

-- トリガーの設定は削除（create_user_profile関数内で直接呼び出すため）
drop trigger if exists tr_assign_default_user_role on auth.users;

-- 更新日時の自動更新トリガー
create trigger update_user_role_mappings_updated_at
    before update on ff_users.user_role_mappings
    for each row
    execute function ff_users.update_updated_at_column(); 