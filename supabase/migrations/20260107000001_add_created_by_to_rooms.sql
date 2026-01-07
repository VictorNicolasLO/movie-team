-- Add created_by column to rooms table
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS created_by TEXT;
