-- ff_notesスキーマの作成
create schema if not exists ff_notes;

-- ノートのメインテーブル
create table if not exists ff_notes.notes (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    title text not null,
    content text not null,
    content_format text not null check (content_format in ('markdown', 'rich_text')) default 'markdown',
    tags text[] default array[]::text[],
    visibility text not null check (visibility in ('private', 'shared', 'public')) default 'private',
    is_archived boolean default false,
    is_pinned boolean default false,
    metadata jsonb default '{}'::jsonb,
    version integer default 1,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- ノート間のリンクテーブル
create table if not exists ff_notes.note_links (
    id uuid primary key default uuid_generate_v4(),
    source_note_id uuid references ff_notes.notes(id) not null,
    target_note_id uuid references ff_notes.notes(id) not null,
    link_type text not null check (link_type in ('reference', 'parent_child', 'related')),
    created_at timestamp with time zone default now(),
    unique(source_note_id, target_note_id)
);

-- reference_typeの定義を更新
create type ff_notes.reference_type as enum (
    'goal_reflection',      -- 目標の振り返り
    'goal_milestone',       -- マイルストーンの記録
    'habit_reflection',     -- 習慣の振り返り
    'habit_log',           -- 習慣の実施記録
    'task',                -- タスク
    'focus_session'        -- 集中セッション
);

-- ノートと他の機能との関連付けテーブルを更新
create table if not exists ff_notes.note_references (
    id uuid primary key default uuid_generate_v4(),
    note_id uuid references ff_notes.notes(id) not null,
    reference_type ff_notes.reference_type not null,
    reference_id uuid not null,
    metadata jsonb default '{}'::jsonb,  -- 参照に関する追加情報
    created_at timestamp with time zone default now(),
    unique(note_id, reference_type, reference_id)
);

-- ノートの変更履歴テーブル
create table if not exists ff_notes.note_versions (
    id uuid primary key default uuid_generate_v4(),
    note_id uuid references ff_notes.notes(id) not null,
    title text not null,
    content text not null,
    tags text[] default array[]::text[],
    version integer not null,
    created_by uuid references auth.users(id) not null,
    created_at timestamp with time zone default now()
);

-- ノートの共有設定テーブル
create table if not exists ff_notes.note_shares (
    id uuid primary key default uuid_generate_v4(),
    note_id uuid references ff_notes.notes(id) not null,
    shared_with_user_id uuid references auth.users(id),
    shared_with_role_id uuid references ff_users.user_roles(id),
    permission_level text not null check (permission_level in ('read', 'write', 'admin')),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    check (
        (shared_with_user_id is not null and shared_with_role_id is null) or
        (shared_with_user_id is null and shared_with_role_id is not null)
    )
);

-- ノートの公開設定テーブル
create table if not exists ff_notes.note_public_settings (
    id uuid primary key default uuid_generate_v4(),
    note_id uuid references ff_notes.notes(id) not null unique,
    public_url_id text unique not null,
    is_password_protected boolean default false,
    password_hash text,
    allow_comments boolean default false,
    allow_reactions boolean default false,
    expires_at timestamp with time zone,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- ノートテンプレートテーブル
create table if not exists ff_notes.note_templates (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    content text not null,
    template_type text not null check (template_type in (
        'goal_reflection',
        'milestone_reflection',
        'habit_reflection',
        'habit_log'
    )),
    metadata jsonb default '{}'::jsonb,  -- テンプレートのメタデータ（変数定義など）
    is_default boolean default false,    -- デフォルトテンプレートかどうか
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- RLSポリシーの設定
alter table ff_notes.notes enable row level security;
alter table ff_notes.note_links enable row level security;
alter table ff_notes.note_references enable row level security;
alter table ff_notes.note_versions enable row level security;
alter table ff_notes.note_shares enable row level security;
alter table ff_notes.note_public_settings enable row level security;

-- ノートの基本ポリシー
create policy "Users can view their own notes" on ff_notes.notes
    for select using (auth.uid() = user_id);

create policy "Users can insert their own notes" on ff_notes.notes
    for insert with check (auth.uid() = user_id);

create policy "Users can update their own notes" on ff_notes.notes
    for update using (auth.uid() = user_id);

create policy "Users can delete their own notes" on ff_notes.notes
    for delete using (auth.uid() = user_id);

-- インデックスの作成
create index if not exists idx_notes_user_id on ff_notes.notes(user_id);
create index if not exists idx_notes_title on ff_notes.notes(title);
create index if not exists idx_notes_tags on ff_notes.notes using gin(tags);
create index if not exists idx_notes_created_at on ff_notes.notes(created_at);
create index if not exists idx_notes_visibility on ff_notes.notes(visibility);

-- 更新日時を自動更新するトリガー
create or replace function ff_notes.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_notes_updated_at
    before update on ff_notes.notes
    for each row
    execute function ff_notes.update_updated_at_column();

create trigger update_note_shares_updated_at
    before update on ff_notes.note_shares
    for each row
    execute function ff_notes.update_updated_at_column();

create trigger update_note_public_settings_updated_at
    before update on ff_notes.note_public_settings
    for each row
    execute function ff_notes.update_updated_at_column();

-- インデックスの追加
create index idx_note_templates_template_type on ff_notes.note_templates(template_type);
create index idx_note_templates_is_default on ff_notes.note_templates(is_default) where is_default = true;

-- トリガーの追加
create trigger update_note_templates_updated_at
    before update on ff_notes.note_templates
    for each row
    execute function ff_notes.update_updated_at_column(); 