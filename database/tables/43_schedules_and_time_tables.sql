-- スケジュール管理用のスキーマ作成
create schema if not exists ff_schedules;
create schema if not exists ff_time_table;

-- 列挙型の定義
create type ff_schedules.priority_level as enum ('high', 'medium', 'low');
create type ff_schedules.recurrence_pattern as enum ('daily', 'weekly', 'monthly');
create type ff_schedules.sync_status as enum ('synced', 'pending', 'failed');
create type ff_time_table.visibility_type as enum ('private', 'public', 'followers');

-- 関数定義（最初に配置）
create or replace function ff_schedules.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace function ff_schedules.create_default_categories()
returns trigger as $$
begin
  insert into ff_schedules.schedule_categories (
    user_id,
    name,
    description,
    system_category_id,
    sort_order
  )
  select
    new.id,
    name,
    description,
    id,
    row_number() over (order by is_default desc, name)
  from ff_schedules.system_categories;
  
  return new;
end;
$$ language plpgsql;

create or replace function ff_time_table.update_template_likes_count()
returns trigger as $$
begin
  if (tg_op = 'INSERT') then
    update ff_time_table.templates
    set likes_count = likes_count + 1
    where id = new.template_id;
  elsif (tg_op = 'DELETE') then
    update ff_time_table.templates
    set likes_count = likes_count - 1
    where id = old.template_id;
  end if;
  return null;
end;
$$ language plpgsql;

-- カラーパレット
create table ff_schedules.color_palette (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color_code text not null,
  created_at timestamp with time zone default now()
);

-- システムデフォルトカテゴリー
create table ff_schedules.system_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  color_id uuid references ff_schedules.color_palette,
  is_default boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(name)
);

-- ユーザーカテゴリー
create table ff_schedules.schedule_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  color_id uuid references ff_schedules.color_palette,
  system_category_id uuid references ff_schedules.system_categories,
  is_active boolean default true,
  sort_order integer not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, name)
);

-- スケジュール関連のテーブル
create table ff_schedules.schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  start_date date not null,
  start_time time,
  end_date date not null,
  end_time time,
  is_all_day boolean default false,
  category_id uuid references ff_schedules.schedule_categories not null,
  priority ff_schedules.priority_level not null,
  color_id uuid references ff_schedules.color_palette,
  is_google_synced boolean default false,
  google_event_data jsonb,
  google_sync_error text,
  google_last_modified timestamp with time zone,
  project_id uuid references ff_tasks.projects,
  task_id uuid references ff_tasks.tasks,
  habit_id uuid references ff_habits.user_habits,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 繰り返し設定の基本情報
create table ff_schedules.recurrence_rules (
  id uuid primary key default gen_random_uuid(),
  pattern ff_schedules.recurrence_pattern not null,
  interval integer default 1,
  start_date date not null,
  end_date date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 繰り返しの曜日設定
create table ff_schedules.recurrence_weekdays (
  id uuid primary key default gen_random_uuid(),
  rule_id uuid references ff_schedules.recurrence_rules on delete cascade not null,
  day_of_week integer not null check (day_of_week between 0 and 6),
  created_at timestamp with time zone default now(),
  unique(rule_id, day_of_week)
);

-- スケジュールと繰り返しルールの関連付け
create table ff_schedules.schedule_recurrences (
  id uuid primary key default gen_random_uuid(),
  schedule_id uuid references ff_schedules.schedules on delete cascade not null,
  rule_id uuid references ff_schedules.recurrence_rules on delete cascade not null,
  created_at timestamp with time zone default now(),
  unique(schedule_id, rule_id)
);

create table ff_schedules.schedule_reminders (
  id uuid primary key default gen_random_uuid(),
  schedule_id uuid references ff_schedules.schedules on delete cascade not null,
  minutes_before integer not null,
  is_enabled boolean default true,
  created_at timestamp with time zone default now()
);

-- Googleカレンダー連携関連のテーブル
create table ff_schedules.google_calendar_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  google_account_email text not null,
  access_token text not null,
  refresh_token text not null,
  token_expires_at timestamp with time zone not null,
  is_enabled boolean default true,
  last_synced_at timestamp with time zone,
  sync_range_months integer default 1,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, google_account_email)
);

create table ff_schedules.google_calendars (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid references ff_schedules.google_calendar_connections on delete cascade not null,
  google_calendar_id text not null,
  calendar_name text not null,
  description text,
  color_id uuid references ff_schedules.color_palette,
  is_primary boolean default false,
  is_selected boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(connection_id, google_calendar_id)
);

create table ff_schedules.schedule_google_events (
  id uuid primary key default gen_random_uuid(),
  schedule_id uuid references ff_schedules.schedules on delete cascade not null,
  google_calendar_id uuid references ff_schedules.google_calendars not null,
  google_event_id text not null,
  last_synced_at timestamp with time zone not null,
  sync_status ff_schedules.sync_status not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(schedule_id, google_calendar_id)
);

-- タイムテーブル関連のテーブル
create table ff_time_table.templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  color_id uuid references ff_schedules.color_palette,
  visibility ff_time_table.visibility_type not null default 'private',
  is_featured boolean default false, -- システム側でおすすめテンプレートとして表示
  likes_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- テンプレートのいいね管理
create table ff_time_table.template_likes (
  id uuid primary key default gen_random_uuid(),
  template_id uuid references ff_time_table.templates on delete cascade not null,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default now(),
  unique(template_id, user_id)
);

create table ff_time_table.template_apply_days (
  id uuid primary key default gen_random_uuid(),
  template_id uuid references ff_time_table.templates on delete cascade not null,
  day_of_week integer not null check (day_of_week between 0 and 6),
  created_at timestamp with time zone default now(),
  unique(template_id, day_of_week)
);

create table ff_time_table.template_time_slots (
  id uuid primary key default gen_random_uuid(),
  template_id uuid references ff_time_table.templates on delete cascade not null,
  title text not null,
  description text,
  start_time time not null,
  end_time time not null,
  color_id uuid references ff_schedules.color_palette,
  created_at timestamp with time zone default now()
);

-- デフォルトカラーパレットの登録
insert into ff_schedules.color_palette (name, color_code) values
  ('Blue', '#2196F3'),
  ('Red', '#F44336'),
  ('Green', '#4CAF50'),
  ('Yellow', '#FFEB3B'),
  ('Purple', '#9C27B0'),
  ('Orange', '#FF9800'),
  ('Grey', '#9E9E9E');

-- システムデフォルトカテゴリーの登録
insert into ff_schedules.system_categories (name, description, is_default) values
  ('Work', 'Work related schedules', true),
  ('Personal', 'Personal schedules', false),
  ('Habit', 'Habit related schedules', false),
  ('Other', 'Other schedules', false);

-- トリガー定義（関数定義の後に配置）
create trigger update_schedule_categories_updated_at
  before update on ff_schedules.schedule_categories
  for each row
  execute function ff_schedules.update_updated_at();

create trigger update_schedules_updated_at
  before update on ff_schedules.schedules
  for each row
  execute function ff_schedules.update_updated_at();

create trigger update_google_calendar_connections_updated_at
  before update on ff_schedules.google_calendar_connections
  for each row
  execute function ff_schedules.update_updated_at();

create trigger update_templates_updated_at
  before update on ff_time_table.templates
  for each row
  execute function ff_schedules.update_updated_at();

create trigger update_recurrence_rules_updated_at
  before update on ff_schedules.recurrence_rules
  for each row
  execute function ff_schedules.update_updated_at();

create trigger create_user_default_categories
  after insert on auth.users
  for each row
  execute function ff_schedules.create_default_categories();

create trigger update_template_likes_count
  after insert or delete on ff_time_table.template_likes
  for each row
  execute function ff_time_table.update_template_likes_count();

-- インデックス
create index idx_schedules_user_id on ff_schedules.schedules(user_id);
create index idx_schedules_start_date on ff_schedules.schedules(start_date);
create index idx_schedules_category on ff_schedules.schedules(category_id);
create index idx_schedules_is_google_synced on ff_schedules.schedules(is_google_synced);
create index idx_google_calendar_connections_user_id on ff_schedules.google_calendar_connections(user_id);
create index idx_google_calendars_connection_id on ff_schedules.google_calendars(connection_id);
create index idx_schedule_google_events_schedule_id on ff_schedules.schedule_google_events(schedule_id);
create index idx_schedule_google_events_google_calendar_id on ff_schedules.schedule_google_events(google_calendar_id);
create index idx_templates_user_id on ff_time_table.templates(user_id);
create index idx_recurrence_rules_pattern on ff_schedules.recurrence_rules(pattern);
create index idx_recurrence_weekdays_rule_id on ff_schedules.recurrence_weekdays(rule_id);
create index idx_schedule_recurrences_schedule_id on ff_schedules.schedule_recurrences(schedule_id);
create index idx_schedule_categories_user_id on ff_schedules.schedule_categories(user_id);
create index idx_schedule_categories_name on ff_schedules.schedule_categories(name);
create index idx_schedule_categories_system_id on ff_schedules.schedule_categories(system_category_id);
create index idx_schedule_categories_sort_order on ff_schedules.schedule_categories(sort_order);
create index idx_templates_visibility on ff_time_table.templates(visibility);
create index idx_templates_is_featured on ff_time_table.templates(is_featured);
create index idx_templates_likes_count on ff_time_table.templates(likes_count);
create index idx_template_likes_user_id on ff_time_table.template_likes(user_id);
create index idx_template_likes_template_id on ff_time_table.template_likes(template_id);

-- RLSポリシー
alter table ff_schedules.schedules enable row level security;
alter table ff_schedules.google_calendar_connections enable row level security;
alter table ff_schedules.google_calendars enable row level security;
alter table ff_time_table.templates enable row level security;
alter table ff_schedules.schedule_categories enable row level security;

-- スケジュール用のポリシー
create policy "Users can view their own schedules"
  on ff_schedules.schedules for select
  using (auth.uid() = user_id);

create policy "Users can insert their own schedules"
  on ff_schedules.schedules for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own schedules"
  on ff_schedules.schedules for update
  using (auth.uid() = user_id);

create policy "Users can delete their own schedules"
  on ff_schedules.schedules for delete
  using (auth.uid() = user_id);

-- Googleカレンダー連携用のポリシー
create policy "Users can view their own calendar connections"
  on ff_schedules.google_calendar_connections for select
  using (auth.uid() = user_id);

create policy "Users can manage their own calendar connections"
  on ff_schedules.google_calendar_connections for all
  using (auth.uid() = user_id);

create policy "Users can view calendars from their connections"
  on ff_schedules.google_calendars for select
  using (
    exists (
      select 1 from ff_schedules.google_calendar_connections
      where id = google_calendars.connection_id
      and user_id = auth.uid()
    )
  );

-- タイムテーブル用のポリシー
create policy "Users can view their own templates"
  on ff_time_table.templates for select
  using (auth.uid() = user_id);

create policy "Users can insert their own templates"
  on ff_time_table.templates for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own templates"
  on ff_time_table.templates for update
  using (auth.uid() = user_id);

create policy "Users can delete their own templates"
  on ff_time_table.templates for delete
  using (auth.uid() = user_id);

-- テンプレートいいね用のポリシー
create policy "Users can view template likes"
  on ff_time_table.template_likes for select
  using (true);

create policy "Users can like templates they can view"
  on ff_time_table.template_likes for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from ff_time_table.templates
      where id = template_id
      and (
        visibility = 'public'
        or user_id = auth.uid()
        or (
          visibility = 'followers'
          and exists (
            select 1 from ff_social.follows
            where follower_id = auth.uid()
            and following_id = templates.user_id
            and status = 'accepted'
          )
        )
      )
    )
  );

create policy "Users can unlike their likes"
  on ff_time_table.template_likes for delete
  using (auth.uid() = user_id);

-- いいねカウント更新用の関数とトリガー
create or replace function ff_time_table.update_template_likes_count()
returns trigger as $$
begin
  if (tg_op = 'INSERT') then
    update ff_time_table.templates
    set likes_count = likes_count + 1
    where id = new.template_id;
  elsif (tg_op = 'DELETE') then
    update ff_time_table.templates
    set likes_count = likes_count - 1
    where id = old.template_id;
  end if;
  return null;
end;
$$ language plpgsql;

create trigger update_template_likes_count
  after insert or delete on ff_time_table.template_likes
  for each row
  execute function ff_time_table.update_template_likes_count(); 