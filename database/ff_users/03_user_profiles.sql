-- ユーザープロファイルテーブル
create table if not exists ff_users.user_profiles (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null unique,
    display_name text,
    email text,
    profile_image text,
    bio text,                                    -- 自己紹介文
    title text,                                  -- 肩書き・役職
    location text,                               -- 所在地
    website text,                                -- 個人サイト/ポートフォリオ
    social_links jsonb default '{
        "github": null,
        "twitter": null,
        "linkedin": null,
        "facebook": null,
        "instagram": null
    }'::jsonb,                                   -- ソーシャルリンク
    languages text[] default array[]::text[],    -- 使用言語
    timezone text,                               -- タイムゾーン
    cache_version integer default 1,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- テーブルコメント
comment on table ff_users.user_profiles is 'ユーザーのプロフィール情報を管理するテーブル';

-- カラムコメント
comment on column ff_users.user_profiles.id is 'プロフィールの一意識別子';
comment on column ff_users.user_profiles.user_id is 'ユーザーID';
comment on column ff_users.user_profiles.display_name is '表示名';
comment on column ff_users.user_profiles.email is 'メールアドレス';
comment on column ff_users.user_profiles.profile_image is 'プロフィール画像のURL';
comment on column ff_users.user_profiles.bio is '自己紹介文';
comment on column ff_users.user_profiles.title is '肩書き・役職';
comment on column ff_users.user_profiles.location is '所在地';
comment on column ff_users.user_profiles.website is '個人サイト/ポートフォリオのURL';
comment on column ff_users.user_profiles.social_links is 'ソーシャルメディアリンク';
comment on column ff_users.user_profiles.languages is '使用可能な言語';
comment on column ff_users.user_profiles.timezone is 'ユーザーのタイムゾーン';
comment on column ff_users.user_profiles.cache_version is 'キャッシュバージョン';
comment on column ff_users.user_profiles.created_at is 'レコード作成日時';
comment on column ff_users.user_profiles.updated_at is 'レコード更新日時';

-- 新規ユーザー登録時のプロフィール作成関数
create or replace function ff_users.create_user_profile()
returns trigger as $$
declare
    provider text;
    social_links_data jsonb;
    user_timezone text;
begin
    -- 認証プロバイダーを取得
    provider := new.raw_user_meta_data->>'provider';
    
    -- プロバイダーに応じてソーシャルリンクを設定
    if provider = 'github' then
        social_links_data := jsonb_build_object(
            'github', new.raw_user_meta_data->>'html_url',
            'twitter', null,
            'linkedin', null,
            'facebook', null,
            'instagram', null
        );
    else
        social_links_data := '{
            "github": null,
            "twitter": null,
            "linkedin": null,
            "facebook": null,
            "instagram": null
        }'::jsonb;
    end if;

    -- タイムゾーンの設定（デフォルトはAsia/Tokyo）
    user_timezone := coalesce(new.raw_user_meta_data->>'timezone', 'Asia/Tokyo');

    -- auth.usersテーブルから必要な情報を取得してプロフィールを作成
    insert into ff_users.user_profiles (
        user_id,
        display_name,
        email,
        profile_image,
        social_links,
        timezone
    )
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'name', new.email),
        new.email,
        case 
            when provider = 'github' then new.raw_user_meta_data->>'avatar_url'
            when provider = 'google' then new.raw_user_meta_data->>'picture'
            else null
        end,
        social_links_data,
        user_timezone
    );
    return new;
end;
$$ language plpgsql security definer;

-- 新規ユーザー登録時のトリガー
create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function ff_users.create_user_profile();

-- プロフィール更新時のトリガー
create trigger update_user_profiles_updated_at
    before update on ff_users.user_profiles
    for each row
    execute function ff_users.update_updated_at_column();

create trigger update_user_profiles_cache_version
    before update on ff_users.user_profiles
    for each row
    execute function ff_users.update_cache_version();

-- インデックス
create index if not exists idx_user_profiles_user_id on ff_users.user_profiles(user_id);
create index if not exists idx_user_profiles_email on ff_users.user_profiles(email);
create index if not exists idx_user_profiles_display_name on ff_users.user_profiles(display_name); 