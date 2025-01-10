create schema if not exists ff_gamification;

-- バッジマスターテーブル
create table if not exists ff_gamification.badges (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,
    description text not null,
    condition_type text not null,
    condition_value jsonb not null,
    image_url text,
    created_at timestamp with time zone default now()
);

-- 初期バッジデータの投入（プレステージバッジ）
insert into ff_gamification.badges (name, description, condition_type, condition_value) values
    ('prestige_1', 'プレステージ1達成', 'prestige_reached', '{"prestige": 1}'::jsonb),
    ('prestige_2', 'プレステージ2達成', 'prestige_reached', '{"prestige": 2}'::jsonb),
    ('prestige_3', 'プレステージ3達成', 'prestige_reached', '{"prestige": 3}'::jsonb),
    ('prestige_4', 'プレステージ4達成', 'prestige_reached', '{"prestige": 4}'::jsonb),
    ('prestige_5', 'プレステージ5達成', 'prestige_reached', '{"prestige": 5}'::jsonb),
    ('prestige_6', 'プレステージ6達成', 'prestige_reached', '{"prestige": 6}'::jsonb),
    ('prestige_7', 'プレステージ7達成', 'prestige_reached', '{"prestige": 7}'::jsonb),
    ('prestige_8', 'プレステージ8達成', 'prestige_reached', '{"prestige": 8}'::jsonb),
    ('prestige_9', 'プレステージ9達成', 'prestige_reached', '{"prestige": 9}'::jsonb),
    ('prestige_10', 'プレステージ10達成', 'prestige_reached', '{"prestige": 10}'::jsonb)
on conflict (name) do nothing;

-- 月間ログインバッジを生成する関数
create or replace function ff_gamification.generate_monthly_login_badges(
    target_year integer default extract(year from current_date + interval '1 month'),
    target_month integer default extract(month from current_date + interval '1 month')
) returns setof ff_gamification.badges as $$
declare
    month_days integer;
    badge_prefix text;
    badge_record ff_gamification.badges;
begin
    -- 対象月の日数を取得
    month_days := extract(days from 
        (date_trunc('month', make_date(target_year, target_month, 1)) + interval '1 month - 1 day')::date
    );

    -- バッジ名のプレフィックスを作成（例：2025年1月）
    badge_prefix := target_year || '年' || target_month || '月';

    -- 1日達成バッジ
    insert into ff_gamification.badges (
        name,
        description,
        condition_type,
        condition_value
    ) values (
        badge_prefix || ' 行動開始！',
        badge_prefix || 'に初めてログインしました',
        'monthly_login',
        jsonb_build_object('year', target_year, 'month', target_month, 'days', 1)
    ) on conflict (name) do nothing
    returning * into badge_record;
    if badge_record is not null then return next badge_record; end if;

    -- 1週間達成バッジ
    insert into ff_gamification.badges (
        name,
        description,
        condition_type,
        condition_value
    ) values (
        badge_prefix || ' シングルセブン',
        badge_prefix || 'に7日間ログインしました',
        'monthly_login',
        jsonb_build_object('year', target_year, 'month', target_month, 'days', 7)
    ) on conflict (name) do nothing
    returning * into badge_record;
    if badge_record is not null then return next badge_record; end if;

    -- 2週間達成バッジ
    insert into ff_gamification.badges (
        name,
        description,
        condition_type,
        condition_value
    ) values (
        badge_prefix || ' ダブルセブン',
        badge_prefix || 'に14日間ログインしました',
        'monthly_login',
        jsonb_build_object('year', target_year, 'month', target_month, 'days', 14)
    ) on conflict (name) do nothing
    returning * into badge_record;
    if badge_record is not null then return next badge_record; end if;

    -- 3週間達成バッジ
    insert into ff_gamification.badges (
        name,
        description,
        condition_type,
        condition_value
    ) values (
        badge_prefix || ' トリプルセブン',
        badge_prefix || 'に21日間ログインしました',
        'monthly_login',
        jsonb_build_object('year', target_year, 'month', target_month, 'days', 21)
    ) on conflict (name) do nothing
    returning * into badge_record;
    if badge_record is not null then return next badge_record; end if;

    -- 全日達成バッジ
    insert into ff_gamification.badges (
        name,
        description,
        condition_type,
        condition_value
    ) values (
        badge_prefix || ' コンプリート！',
        badge_prefix || 'に' || month_days || '日間すべてログインしました',
        'monthly_login',
        jsonb_build_object('year', target_year, 'month', target_month, 'days', month_days)
    ) on conflict (name) do nothing
    returning * into badge_record;
    if badge_record is not null then return next badge_record; end if;

    return;
end;
$$ language plpgsql security definer;

-- 毎月1日の0時に次月のバッジを自動生成するトリガー関数
create or replace function ff_gamification.tr_generate_next_month_badges()
returns trigger as $$
declare
    next_year integer;
    next_month integer;
begin
    -- 次月の年月を計算
    if extract(month from current_date) = 12 then
        next_month := 1;
        next_year := extract(year from current_date) + 1;
    else
        next_month := extract(month from current_date) + 1;
        next_year := extract(year from current_date);
    end if;

    -- 次月のバッジを生成
    perform ff_gamification.generate_monthly_login_badges(next_year, next_month);
    return null;
end;
$$ language plpgsql security definer;

-- 現在月と次月のバッジを初期生成
do $$
begin
    -- 現在月のバッジを生成
    perform ff_gamification.generate_monthly_login_badges(
        extract(year from current_date)::integer,
        extract(month from current_date)::integer
    );
    
    -- 次月のバッジを生成
    perform ff_gamification.generate_monthly_login_badges(
        extract(year from current_date + interval '1 month')::integer,
        extract(month from current_date + interval '1 month')::integer
    );
end;
$$; 