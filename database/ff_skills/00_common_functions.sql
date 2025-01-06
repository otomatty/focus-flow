-- updated_at列を自動更新する関数
create or replace function ff_skills.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- コメント
comment on function ff_skills.update_updated_at_column() is 'updated_at列を現在のUTC時刻に自動更新するトリガー関数';

-- 権限の設定
grant execute on function ff_skills.update_updated_at_column() to service_role; 