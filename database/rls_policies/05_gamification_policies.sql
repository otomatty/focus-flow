-- badges のRLSポリシー
alter table badges enable row level security;

create policy "全ユーザーがバッジを参照可能"
    on badges for select
    using (true);

create policy "管理者はバッジを作成可能"
    on badges for insert
    with check (
        exists (
            select 1 from user_role_mappings urm
            join user_roles ur on urm.role_id = ur.id
            where urm.user_id = auth.uid()
            and ur.name = 'admin'
            and urm.is_active = true
        )
    );

create policy "管理者はバッジを更新可能"
    on badges for update
    using (
        exists (
            select 1 from user_role_mappings urm
            join user_roles ur on urm.role_id = ur.id
            where urm.user_id = auth.uid()
            and ur.name = 'admin'
            and urm.is_active = true
        )
    );

-- user_badges のRLSポリシー
alter table user_badges enable row level security;

create policy "ユーザーは自分のバッジを参照可能"
    on user_badges for select
    using (auth.uid() = user_id);

create policy "システムのみがバッジを付与可能"
    on user_badges for insert
    with check (auth.uid() = user_id);

-- quests のRLSポリシー
alter table quests enable row level security;

create policy "全ユーザーがクエストを参照可能"
    on quests for select
    using (true);

create policy "管理者はクエストを作成可能"
    on quests for insert
    with check (
        exists (
            select 1 from user_role_mappings urm
            join user_roles ur on urm.role_id = ur.id
            where urm.user_id = auth.uid()
            and ur.name = 'admin'
            and urm.is_active = true
        )
    );

create policy "管理者はクエストを更新可能"
    on quests for update
    using (
        exists (
            select 1 from user_role_mappings urm
            join user_roles ur on urm.role_id = ur.id
            where urm.user_id = auth.uid()
            and ur.name = 'admin'
            and urm.is_active = true
        )
    );

-- user_quests のRLSポリシー
alter table user_quests enable row level security;

create policy "ユーザーは自分のクエスト進捗を参照可能"
    on user_quests for select
    using (auth.uid() = user_id);

create policy "ユーザーは自分のクエストを開始可能"
    on user_quests for insert
    with check (auth.uid() = user_id);

create policy "ユーザーは自分のクエスト進捗を更新可能"
    on user_quests for update
    using (auth.uid() = user_id); 