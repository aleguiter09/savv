-- Link both legs of a transfer. Nullable: legacy rows stay NULL (no backfill).
ALTER TABLE public.movement
  ADD COLUMN IF NOT EXISTS transfer_group_id uuid NULL;

CREATE INDEX IF NOT EXISTS idx_movement_transfer_group_id
  ON public.movement (transfer_group_id)
  WHERE transfer_group_id IS NOT NULL;
