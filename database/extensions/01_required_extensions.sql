-- UUID生成のための拡張機能
create extension if not exists "uuid-ossp";

-- 全文検索のための拡張機能
create extension if not exists pg_trgm;

-- 階層データ構造のための拡張機能
create extension if not exists ltree;

-- 暗号化のための拡張機能
create extension if not exists pgcrypto;

-- 数学関数のための拡張機能
create extension if not exists tablefunc;

-- コメント
comment on extension "uuid-ossp" is 'UUID生成機能を提供する拡張機能';
comment on extension pg_trgm is 'テキスト類似性検索のための拡張機能';
comment on extension ltree is '階層データ構造を扱うための拡張機能';
comment on extension pgcrypto is '暗号化機能を提供する拡張機能';
comment on extension tablefunc is '高度な表関数を提供する拡張機能'; 