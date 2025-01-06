-- ユーザーロールマッピングテーブル
create table if not exists ff_users.user_role_mappings (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null unique,
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

-- 新規ユーザーにデフォルトロールを付与するトリガー関数
create or replace function ff_users.assign_default_user_role()
returns trigger as $$
declare
    default_role_id uuid;
begin
    -- デフォルトロールのIDを取得
    select id into default_role_id
    from ff_users.user_roles
    where name = 'USER';

    -- ロールが見つからない場合はエラー
    if default_role_id is null then
        raise exception 'デフォルトロール（USER）が見つかりません。';
    end if;

    -- ユーザーにロールを割り当て
    insert into ff_users.user_role_mappings (
        user_id,
        role_id,
        assigned_at,
        assigned_by
    ) values (
        new.id,
        default_role_id,
        now(),
        new.id
    );

    -- システムログに記録
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
            'role_id', default_role_id
        ),
        new.id
    );

    return new;
exception
    when others then
        -- エラーログ記録
        insert into ff_logs.system_logs (
            event_type,
            event_source,
            event_data,
            created_by
        ) values (
            'ERROR_ASSIGNING_DEFAULT_ROLE',
            'assign_default_user_role',
            jsonb_build_object(
                'user_id', new.id,
                'error_code', SQLSTATE,
                'error_message', SQLERRM
            ),
            new.id
        );
        raise;
end;
$$ language plpgsql security definer;

-- トリガーの設定
drop trigger if exists tr_assign_default_user_role on auth.users;
create trigger tr_assign_default_user_role
    after insert on auth.users
    for each row
    execute function ff_users.assign_default_user_role();

-- 更新日時の自動更新トリガー
create trigger update_user_role_mappings_updated_at
    before update on ff_users.user_role_mappings
    for each row
    execute function ff_users.update_updated_at_column(); 