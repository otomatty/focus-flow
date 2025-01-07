-- リマインダーの種類を定義
create type ff_tasks.reminder_type as enum (
    'one_time',      -- 一回限り
    'recurring',     -- 繰り返し
    'deadline',      -- 締切前
    'start_time'     -- 開始時刻前
);

-- リマインダーの通知方法を定義
create type ff_tasks.notification_method as enum (
    'email',
    'push',
    'both'
);

-- リマインダーのステータスを定義
create type ff_tasks.reminder_status as enum (
    'active',        -- アクティブ
    'completed',     -- 完了
    'cancelled',     -- キャンセル
    'failed'         -- 送信失敗
);

-- タスクリマインダーテーブル
create table if not exists ff_tasks.task_reminders (
    id uuid primary key default uuid_generate_v4(),
    task_id uuid references ff_tasks.tasks(id) on delete cascade,
    reminder_type ff_tasks.reminder_type not null,
    reminder_time timestamp with time zone not null,
    message text,
    notification_method ff_tasks.notification_method not null default 'push',
    status ff_tasks.reminder_status not null default 'active',
    is_sent boolean default false,
    sent_at timestamp with time zone,
    recurring_pattern jsonb,  -- 繰り返しパターンの設定
    created_by uuid references auth.users(id) not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    -- JSONBフィールドの構造を検証
    constraint valid_recurring_pattern check (
        recurring_pattern is null or 
        jsonb_typeof(recurring_pattern) = 'object'
    )
);

comment on table ff_tasks.task_reminders is 'タスクのリマインダー設定を管理するテーブル';
comment on column ff_tasks.task_reminders.reminder_type is 'リマインダーの種類';
comment on column ff_tasks.task_reminders.reminder_time is 'リマインダーを送信する時刻';
comment on column ff_tasks.task_reminders.message is 'カスタムリマインダーメッセージ';
comment on column ff_tasks.task_reminders.notification_method is '通知方法';
comment on column ff_tasks.task_reminders.status is 'リマインダーの状態';
comment on column ff_tasks.task_reminders.recurring_pattern is '繰り返しリマインダーの設定';

-- インデックス
create index task_reminders_task_id_idx on ff_tasks.task_reminders(task_id);
create index task_reminders_reminder_time_idx on ff_tasks.task_reminders(reminder_time)
    where status = 'active' and is_sent = false;
create index task_reminders_created_by_idx on ff_tasks.task_reminders(created_by);
create index task_reminders_status_idx on ff_tasks.task_reminders(status);

-- RLSポリシー
alter table ff_tasks.task_reminders enable row level security;

-- リマインダーのRLSポリシー
create policy "リマインダーは作成者が参照可能" 
    on ff_tasks.task_reminders
    for select using (auth.uid() = created_by);

create policy "リマインダーはタスク所有者が参照可能" 
    on ff_tasks.task_reminders
    for select using (
        exists (
            select 1 from ff_tasks.tasks
            where id = task_reminders.task_id
            and user_id = auth.uid()
        )
    );

create policy "リマインダーはプロジェクトメンバーも参照可能" 
    on ff_tasks.task_reminders
    for select using (
        exists (
            select 1 from ff_tasks.tasks t
            join ff_tasks.project_members pm on t.project_id = pm.project_id
            where t.id = task_reminders.task_id
            and pm.user_id = auth.uid()
        )
    );

create policy "システム管理者はリマインダーを参照可能"
    on ff_tasks.task_reminders
    for select using (ff_users.is_system_admin(auth.uid()));

-- 更新日時トリガー
create trigger handle_updated_at before update on ff_tasks.task_reminders
    for each row execute procedure moddatetime (updated_at);

-- リマインダー通知作成関数
create or replace function ff_tasks.create_reminder_notification(
    p_reminder_id uuid
)
returns uuid as $$
declare
    v_reminder record;
    v_task record;
    v_notification_id uuid;
    v_template_data jsonb;
begin
    -- リマインダーと関連タスクの情報を取得
    select r.*, t.title as task_title, t.user_id as task_owner_id
    into v_reminder
    from ff_tasks.task_reminders r
    join ff_tasks.tasks t on t.id = r.task_id
    where r.id = p_reminder_id;

    if not found then
        raise exception 'Reminder not found: %', p_reminder_id;
    end if;

    -- テンプレートデータの作成
    v_template_data := jsonb_build_object(
        'task_id', v_reminder.task_id,
        'task_title', v_reminder.task_title,
        'reminder_type', v_reminder.reminder_type,
        'reminder_time', v_reminder.reminder_time,
        'custom_message', coalesce(v_reminder.message, '')
    );

    -- TODO: 通知の作成（ff_notifications.create_notification関数は後で実装）
    v_notification_id := uuid_generate_v4();

    -- リマインダーの状態を更新
    update ff_tasks.task_reminders
    set is_sent = true,
        sent_at = now(),
        status = 'completed'
    where id = p_reminder_id;

    return v_notification_id;
exception
    when others then
        -- エラー時はリマインダーの状態を失敗に更新
        update ff_tasks.task_reminders
        set status = 'failed'
        where id = p_reminder_id;
        raise;
end;
$$ language plpgsql security definer;

/* TODO: 通知テンプレートの登録は後で実装
-- リマインダーの通知テンプレート登録
do $$
begin
    -- タスクリマインダーカテゴリの登録
    insert into ff_notifications.categories (
        name,
        display_name,
        description,
        icon,
        color,
        priority
    )
    values (
        'task_reminder',
        'タスクリマインダー',
        'タスクの期限や開始時刻に関する通知',
        'bell',
        '#FF9800',
        85
    )
    on conflict (name) do nothing;

    -- テンプレートの登録
    insert into ff_notifications.templates (
        category_id,
        name,
        title_template,
        body_template,
        action_type,
        action_data
    )
    select
        c.id,
        'task_deadline_reminder',
        'タスクの期限が近づいています',
        '{{task_title}}の期限が近づいています。{{custom_message}}',
        'link',
        '{"path": "/tasks/{{task_id}}"}'::jsonb
    from ff_notifications.categories c
    where c.name = 'task_reminder'
    on conflict (category_id, name) do nothing;

    insert into ff_notifications.templates (
        category_id,
        name,
        title_template,
        body_template,
        action_type,
        action_data
    )
    select
        c.id,
        'task_start_reminder',
        'タスクの開始時刻です',
        '{{task_title}}を開始する時間です。{{custom_message}}',
        'link',
        '{"path": "/tasks/{{task_id}}"}'::jsonb
    from ff_notifications.categories c
    where c.name = 'task_reminder'
    on conflict (category_id, name) do nothing;

    insert into ff_notifications.templates (
        category_id,
        name,
        title_template,
        body_template,
        action_type,
        action_data
    )
    select
        c.id,
        'task_general_reminder',
        'タスクのリマインダー',
        '{{task_title}}のリマインダーです。{{custom_message}}',
        'link',
        '{"path": "/tasks/{{task_id}}"}'::jsonb
    from ff_notifications.categories c
    where c.name = 'task_reminder'
    on conflict (category_id, name) do nothing;
end;
$$;
*/ 