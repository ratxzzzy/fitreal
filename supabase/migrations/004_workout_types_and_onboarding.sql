-- ===========================================
-- 004 - Tipos de entrenamiento + tracking de onboarding
-- ===========================================

-- Onboarding flag
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarded_at TIMESTAMPTZ;

-- Marca a usuarios existentes como ya onboarded
UPDATE users SET onboarded_at = created_at WHERE onboarded_at IS NULL;

-- Tipos de entrenamiento + caption
ALTER TABLE daily_entries ADD COLUMN IF NOT EXISTS workout_type TEXT;
ALTER TABLE daily_entries ADD COLUMN IF NOT EXISTS caption TEXT;

DO $$ BEGIN
  ALTER TABLE daily_entries ADD CONSTRAINT workout_type_check
    CHECK (workout_type IN ('weights','cardio','mobility','calisthenics','sport','rest'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE daily_entries ADD CONSTRAINT caption_max_length
    CHECK (char_length(caption) <= 60);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
