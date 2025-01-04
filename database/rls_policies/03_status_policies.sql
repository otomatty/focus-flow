-- RLSの有効化
alter table ff_users.account_statuses enable row level security;
alter table ff_users.presence_statuses enable row level security;
alter table ff_users.focus_statuses enable row level security;
alter table ff_users.status_history enable row level security;

-- アカウント状態のRLSポリシー
create policy "システム管理者はアカウント状態を管理可能"
    on ff_users.account_statuses
    using (exists (
        select 1 from ff_users.user_role_mappings urm
        join ff_users.user_roles ur on ur.id = urm.role_id
        where urm.user_id = auth.uid()
        and ur.name = 'SYSTEM_ADMIN'
        and urm.is_active = true
    ));

create policy "ユーザーは自分のアカウント状態を参照可能"
    on ff_users.account_statuses for select
    using (auth.uid() = user_id);

-- プレゼンス状態のRLSポリシー
create policy "ユーザーは自分のプレゼンス状態を管理可能"
    on ff_users.presence_statuses
    using (auth.uid() = user_id);

create policy "認証済みユーザーは他のユーザーのプレゼンス状態を参照可能"
    on ff_users.presence_statuses for select
    to authenticated
    using (true);

-- フォーカス状態のRLSポリシー
create policy "ユーザーは自分のフォーカス状態を管理可能"
    on ff_users.focus_statuses
    using (auth.uid() = user_id);

create policy "パーティーメンバーはフォーカス状態を参照可能"
    on ff_users.focus_statuses for select
    using (
        auth.uid() = user_id
        or exists (
            select 1 from ff_party.party_members pm
            join ff_party.parties p on p.id = pm.party_id
            where pm.user_id = focus_statuses.user_id
            and p.is_active = true
            and exists (
                select 1 from ff_party.party_members
                where party_id = p.id
                and user_id = auth.uid()
            )
        )
    );

-- ステータス履歴のRLSポリシー
create policy "システム管理者は全ての状態履歴を参照可能"
    on ff_users.status_history
    using (exists (
        select 1 from ff_users.user_role_mappings urm
        join ff_users.user_roles ur on ur.id = urm.role_id
        where urm.user_id = auth.uid()
        and ur.name = 'SYSTEM_ADMIN'
        and urm.is_active = true
    ));

create policy "ユーザーは自分の状態履歴を参照可能"
    on ff_users.status_history for select
    using (auth.uid() = user_id);

-- ステータス履歴の挿入ポリシー
create policy "システムのみが状態履歴を記録可能"
    on ff_users.status_history for insert
    with check (false);

-- プレゼンス状態の自動更新ポリシー
create policy "システムのみがプレゼンス状態を自動更新可能"
    on ff_users.presence_statuses for update
    using (
        auth.uid() = user_id
        or exists (
            select 1 from ff_users.user_role_mappings urm
            join ff_users.user_roles ur on ur.id = urm.role_id
            where urm.user_id = auth.uid()
            and ur.name = 'SYSTEM'
            and urm.is_active = true
        )
    ); 