-- RLSの有効化
alter table ff_party.parties enable row level security;
alter table ff_party.party_members enable row level security;
alter table ff_party.party_generation_history enable row level security;

-- パーティーテーブルのポリシー
create policy "ユーザーは自分が所属するパーティーを参照可能"
    on ff_party.parties
    for select
    using (exists (
        select 1 from ff_party.party_members
        where party_id = parties.id
        and user_id = auth.uid()
    ));

create policy "システム管理者はすべてのパーティーを管理可能"
    on ff_party.parties
    using (exists (
        select 1 from ff_users.user_role_mappings urm
        join ff_users.user_roles ur on ur.id = urm.role_id
        where urm.user_id = auth.uid()
        and ur.name = 'SYSTEM_ADMIN'
        and urm.is_active = true
    ));

-- パーティーメンバーテーブルのポリシー
create policy "ユーザーは自分のパーティーメンバー情報を参照可能"
    on ff_party.party_members
    for select
    using (
        user_id = auth.uid()
        or exists (
            select 1 from ff_party.party_members pm
            where pm.party_id = party_members.party_id
            and pm.user_id = auth.uid()
        )
    );

create policy "システムのみがパーティーメンバーを管理可能"
    on ff_party.party_members
    using (false)
    with check (false);

-- パーティー生成履歴テーブルのポリシー
create policy "システム管理者のみが生成履歴を参照可能"
    on ff_party.party_generation_history
    for select
    using (exists (
        select 1 from ff_users.user_role_mappings urm
        join ff_users.user_roles ur on ur.id = urm.role_id
        where urm.user_id = auth.uid()
        and ur.name = 'SYSTEM_ADMIN'
        and urm.is_active = true
    )); 