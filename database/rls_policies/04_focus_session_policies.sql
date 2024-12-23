-- focus_sessions のRLSポリシー
alter table focus_sessions enable row level security;

create policy "ユーザーは自分の集中セッションを参照可能"
    on focus_sessions for select
    using (auth.uid() = user_id);

create policy "ユーザーは自分の集中セッションを作成可能"
    on focus_sessions for insert
    with check (
        auth.uid() = user_id
        and (
            schedule_id is null
            or exists (
                select 1 from schedules
                where schedules.id = schedule_id
                and schedules.user_id = auth.uid()
            )
        )
    );

create policy "ユーザーは自分の集中セッションを更新可能"
    on focus_sessions for update
    using (auth.uid() = user_id);

create policy "ユーザーは自分の集中セッションを削除可能"
    on focus_sessions for delete
    using (auth.uid() = user_id);

-- パーティションテーブルにも同じポリシーを適用
do $$
begin
    for i in 1..12 loop
        execute format(
            'alter table focus_sessions_y2024m%s enable row level security;
            
            create policy "ユーザーは自分の集中セッションを参照可能"
                on focus_sessions_y2024m%s for select
                using (auth.uid() = user_id);
            
            create policy "ユーザーは自分の集中セッションを作成可能"
                on focus_sessions_y2024m%s for insert
                with check (
                    auth.uid() = user_id
                    and (
                        schedule_id is null
                        or exists (
                            select 1 from schedules
                            where schedules.id = schedule_id
                            and schedules.user_id = auth.uid()
                        )
                    )
                );
            
            create policy "ユーザーは自分の集中セッションを更新可能"
                on focus_sessions_y2024m%s for update
                using (auth.uid() = user_id);
            
            create policy "ユーザーは自分の集中セッションを削除可能"
                on focus_sessions_y2024m%s for delete
                using (auth.uid() = user_id);',
            lpad(i::text, 2, '0'),
            lpad(i::text, 2, '0'),
            lpad(i::text, 2, '0'),
            lpad(i::text, 2, '0'),
            lpad(i::text, 2, '0')
        );
    end loop;
end $$; 