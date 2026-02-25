-- 009_expand_multilingual_support.sql
-- Adjusted to use JSONB translations column.
-- No schema changes needed for new languages as we use JSONB.

-- 1. 扩展历史事件表 (historical_events)
-- 包含 scope 字段以区分全球 (global) 和 国内 (domestic) 视角
ALTER TABLE historical_events
ADD COLUMN IF NOT EXISTS scope VARCHAR(50) DEFAULT 'global';

UPDATE historical_events SET scope = 'global' WHERE scope IS NULL;

