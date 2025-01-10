-- ff_storageスキーマの作成
create schema if not exists ff_storage;

-- ストレージプラン定義テーブル
create table if not exists ff_storage.storage_plans (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    max_storage_bytes bigint not null,  -- 最大ストレージ容量（バイト）
    max_file_size_bytes bigint not null,  -- 1ファイルあたりの最大サイズ（バイト）
    allowed_file_types text[] not null,  -- 許可されるファイルタイプ
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- ユーザーのストレージ使用状況テーブル
create table if not exists ff_storage.user_storage (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    plan_id uuid references ff_storage.storage_plans(id) not null,
    used_storage_bytes bigint not null default 0,  -- 使用中のストレージ容量（バイト）
    file_count integer not null default 0,  -- 保存されているファイル数
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(user_id)
);

-- ファイル管理テーブル
create table if not exists ff_storage.files (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    bucket_name text not null,  -- Supabaseのストレージバケット名
    file_path text not null,    -- ファイルパス
    file_name text not null,    -- オリジナルのファイル名
    file_type text not null,    -- MIMEタイプ
    file_size_bytes bigint not null,  -- ファイルサイズ（バイト）
    metadata jsonb default '{}'::jsonb,  -- メタデータ（必要に応じて）
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(bucket_name, file_path)
);

-- デフォルトのストレージプランを挿入
insert into ff_storage.storage_plans (name, max_storage_bytes, max_file_size_bytes, allowed_file_types) values
    ('free', 104857600, 5242880, array['image/jpeg', 'image/png', 'image/gif', 'image/webp']),  -- 100MB total, 5MB per file
    ('premium', 1073741824, 52428800, array['image/jpeg', 'image/png', 'image/gif', 'image/webp']);  -- 1GB total, 50MB per file

-- ストレージ使用量を更新する関数
create or replace function ff_storage.update_storage_usage()
returns trigger as $$
begin
    if (tg_op = 'INSERT') then
        update ff_storage.user_storage
        set used_storage_bytes = used_storage_bytes + new.file_size_bytes,
            file_count = file_count + 1,
            updated_at = now()
        where user_id = new.user_id;
    elsif (tg_op = 'DELETE') then
        update ff_storage.user_storage
        set used_storage_bytes = used_storage_bytes - old.file_size_bytes,
            file_count = file_count - 1,
            updated_at = now()
        where user_id = old.user_id;
    end if;
    return null;
end;
$$ language plpgsql security definer;

-- ファイル追加/削除時のトリガー
create trigger update_storage_usage_on_file_change
    after insert or delete on ff_storage.files
    for each row
    execute function ff_storage.update_storage_usage();

-- ストレージ制限をチェックする関数
create or replace function ff_storage.check_storage_limits(
    p_user_id uuid,
    p_file_size_bytes bigint,
    p_file_type text
)
returns table (
    can_upload boolean,
    message text
) as $$
declare
    v_plan_id uuid;
    v_used_storage_bytes bigint;
    v_max_storage_bytes bigint;
    v_max_file_size_bytes bigint;
    v_allowed_file_types text[];
begin
    -- ユーザーのストレージ情報を取得
    select us.plan_id, us.used_storage_bytes, sp.max_storage_bytes, sp.max_file_size_bytes, sp.allowed_file_types
    into v_plan_id, v_used_storage_bytes, v_max_storage_bytes, v_max_file_size_bytes, v_allowed_file_types
    from ff_storage.user_storage us
    join ff_storage.storage_plans sp on sp.id = us.plan_id
    where us.user_id = p_user_id;

    -- ファイルタイプのチェック
    if not p_file_type = any(v_allowed_file_types) then
        return query select false, 'このファイル形式はアップロードできません';
        return;
    end if;

    -- ファイルサイズのチェック
    if p_file_size_bytes > v_max_file_size_bytes then
        return query select false, format('ファイルサイズが大きすぎます（最大 %s）', v_max_file_size_bytes);
        return;
    end if;

    -- 合計ストレージ使用量のチェック
    if v_used_storage_bytes + p_file_size_bytes > v_max_storage_bytes then
        return query select false, 'ストレージの空き容量が不足しています';
        return;
    end if;

    return query select true, 'アップロード可能です';
end;
$$ language plpgsql security definer;

-- RLSポリシーの設定
alter table ff_storage.files enable row level security;
alter table ff_storage.user_storage enable row level security;

-- ファイルへのアクセスポリシー
create policy "Users can view their own files"
    on ff_storage.files for select
    using (auth.uid() = user_id);

create policy "Users can insert their own files"
    on ff_storage.files for insert
    with check (auth.uid() = user_id);

create policy "Users can delete their own files"
    on ff_storage.files for delete
    using (auth.uid() = user_id);

-- ストレージ使用状況へのアクセスポリシー
create policy "Users can view their own storage usage"
    on ff_storage.user_storage for select
    using (auth.uid() = user_id);

-- インデックスの作成
create index idx_files_user_id on ff_storage.files(user_id);
create index idx_files_bucket_path on ff_storage.files(bucket_name, file_path);
create index idx_user_storage_user_id on ff_storage.user_storage(user_id); 