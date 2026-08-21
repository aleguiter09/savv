-- Remove unused default-account flag; home/filters no longer depend on it.
ALTER TABLE public.account DROP COLUMN IF EXISTS is_default;
