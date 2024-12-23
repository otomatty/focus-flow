-- user_profiles のRLSポリシー
alter table user_profiles enable row level security;

create policy "ユーザーは自分のプロファイルを参照可能"
    on user_profiles for select
    using (auth.uid() = user_id);

create policy "ユーザーは自分のプロファイルを作成可能"
    on user_profiles for insert
    with check (auth.uid() = user_id);

create policy "ユーザーは自分のプロファイルを更新可能"
    on user_profiles for update
    using (auth.uid() = user_id);

-- user_role_mappings のRLSポリシー
alter table user_role_mappings enable row level security;

create policy "管理者はすべてのロールマッピングを参照可能"
    on user_role_mappings for select
    using (
        exists (
            select 1 from user_role_mappings urm
            join user_roles ur on urm.role_id = ur.id
            where urm.user_id = auth.uid()
            and ur.name = 'admin'
            and urm.is_active = true
        )
    );

create policy "ユーザーは自分のロールマッピングを参照可能"
    on user_role_mappings for select
    using (user_id = auth.uid());

create policy "管理者はロールマッピングを作成可能"
    on user_role_mappings for insert
    with check (
        exists (
            select 1 from user_role_mappings urm
            join user_roles ur on urm.role_id = ur.id
            where urm.user_id = auth.uid()
            and ur.name = 'admin'
            and urm.is_active = true
        )
    );

create policy "管理者はロールマッピングを更新可能"
    on user_role_mappings for update
    using (
        exists (
            select 1 from user_role_mappings urm
            join user_roles ur on urm.role_id = ur.id
            where urm.user_id = auth.uid()
            and ur.name = 'admin'
            and urm.is_active = true
        )
    );

-- user_settings のRLSポリシー
alter table user_settings enable row level security;

create policy "ユーザーは自分の設定を参照可能"
    on user_settings for select
    using (auth.uid() = user_id);

create policy "ユーザーは自分の設定を作成可能"
    on user_settings for insert
    with check (auth.uid() = user_id);

create policy "ユーザーは自分の設定を更新可能"
    on user_settings for update
    using (auth.uid() = user_id); 