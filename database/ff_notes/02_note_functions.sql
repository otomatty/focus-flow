-- バージョン管理関数
create or replace function ff_notes.create_note_version()
returns trigger as $$
begin
    insert into ff_notes.note_versions (
        note_id,
        title,
        content,
        tags,
        version,
        created_by
    ) values (
        new.id,
        new.title,
        new.content,
        new.tags,
        new.version,
        auth.uid()
    );
    return new;
end;
$$ language plpgsql security definer;

-- ノート更新時のバージョン管理トリガー
create trigger tr_create_note_version
    after update of title, content, tags on ff_notes.notes
    for each row
    when (old.* is distinct from new.*)
    execute function ff_notes.create_note_version();

-- リンクされたアイテムの取得関数
create or replace function ff_notes.get_linked_items(
    p_note_id uuid,
    p_type text default null
)
returns table (
    item_id uuid,
    item_type text,
    title text,
    preview text
) as $$
begin
    return query
    select
        r.reference_id as item_id,
        r.reference_type as item_type,
        case
            when r.reference_type = 'task' then (
                select title from ff_tasks.tasks where id = r.reference_id
            )
            when r.reference_type = 'goal' then (
                select title from ff_goals.goals where id = r.reference_id
            )
            when r.reference_type = 'habit' then (
                select title from ff_habits.habits where id = r.reference_id
            )
            when r.reference_type = 'note' then (
                select title from ff_notes.notes where id = r.reference_id
            )
        end as title,
        case
            when r.reference_type = 'task' then (
                select substring(description, 1, 100) 
                from ff_tasks.tasks where id = r.reference_id
            )
            when r.reference_type = 'goal' then (
                select substring(description, 1, 100)
                from ff_goals.goals where id = r.reference_id
            )
            when r.reference_type = 'habit' then (
                select substring(description, 1, 100)
                from ff_habits.habits where id = r.reference_id
            )
            when r.reference_type = 'note' then (
                select substring(content, 1, 100)
                from ff_notes.notes where id = r.reference_id
            )
        end as preview
    from ff_notes.note_references r
    where r.note_id = p_note_id
    and (p_type is null or r.reference_type = p_type);
end;
$$ language plpgsql security definer;

-- ノートの共有チェック関数
create or replace function ff_notes.can_access_note(
    p_note_id uuid,
    p_user_id uuid
)
returns boolean as $$
declare
    v_note_visibility text;
    v_note_user_id uuid;
    v_has_share boolean;
    v_user_role_id uuid;
begin
    -- ノートの基本情報を取得
    select visibility, user_id
    into v_note_visibility, v_note_user_id
    from ff_notes.notes
    where id = p_note_id;

    -- ノートが存在しない場合はfalse
    if v_note_visibility is null then
        return false;
    end if;

    -- ノートの所有者の場合はtrue
    if v_note_user_id = p_user_id then
        return true;
    end if;

    -- 公開ノートの場合はtrue
    if v_note_visibility = 'public' then
        return true;
    end if;

    -- 共有設定の確認
    if v_note_visibility = 'shared' then
        -- ユーザーの直接共有を確認
        select exists(
            select 1
            from ff_notes.note_shares
            where note_id = p_note_id
            and shared_with_user_id = p_user_id
        ) into v_has_share;

        if v_has_share then
            return true;
        end if;

        -- ユーザーのロールによる共有を確認
        select role_id
        into v_user_role_id
        from ff_users.user_role_mappings
        where user_id = p_user_id;

        if v_user_role_id is not null then
            select exists(
                select 1
                from ff_notes.note_shares
                where note_id = p_note_id
                and shared_with_role_id = v_user_role_id
            ) into v_has_share;

            return v_has_share;
        end if;
    end if;

    return false;
end;
$$ language plpgsql security definer;

-- ノートの検索関数
create or replace function ff_notes.search_notes(
    p_user_id uuid,
    p_query text default null,
    p_tags text[] default null,
    p_visibility text default null,
    p_limit integer default 10,
    p_offset integer default 0
)
returns table (
    id uuid,
    title text,
    content text,
    tags text[],
    visibility text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
) as $$
begin
    return query
    select
        n.id,
        n.title,
        n.content,
        n.tags,
        n.visibility,
        n.created_at,
        n.updated_at
    from ff_notes.notes n
    where (
        n.user_id = p_user_id
        or n.visibility = 'public'
        or (
            n.visibility = 'shared'
            and ff_notes.can_access_note(n.id, p_user_id)
        )
    )
    and (
        p_query is null
        or n.title ilike '%' || p_query || '%'
        or n.content ilike '%' || p_query || '%'
    )
    and (
        p_tags is null
        or n.tags && p_tags
    )
    and (
        p_visibility is null
        or n.visibility = p_visibility
    )
    order by n.updated_at desc
    limit p_limit
    offset p_offset;
end;
$$ language plpgsql security definer; 