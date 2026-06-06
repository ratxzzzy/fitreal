-- ===========================================
-- 003 - Sistema de rachas
-- Funcion para recalcular streak respetando timezone
-- ===========================================

CREATE OR REPLACE FUNCTION recalc_user_streak(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_tz TEXT;
  v_today DATE;
  v_streak INT := 0;
  v_last DATE;
  v_check DATE;
BEGIN
  SELECT timezone INTO v_tz FROM users WHERE id = p_user_id;
  IF v_tz IS NULL THEN v_tz := 'UTC'; END IF;
  v_today := (now() AT TIME ZONE v_tz)::date;

  SELECT MAX(date) INTO v_last
  FROM daily_entries
  WHERE user_id = p_user_id;

  IF v_last IS NULL THEN
    UPDATE users SET current_streak = 0, last_entry_date = NULL WHERE id = p_user_id;
    RETURN;
  END IF;

  -- Si la ultima foto no es de hoy ni ayer, la racha esta rota
  IF v_last < v_today - INTERVAL '1 day' THEN
    UPDATE users SET current_streak = 0, last_entry_date = v_last WHERE id = p_user_id;
    RETURN;
  END IF;

  v_check := v_last;
  LOOP
    IF EXISTS (
      SELECT 1 FROM daily_entries
      WHERE user_id = p_user_id AND date = v_check
    ) THEN
      v_streak := v_streak + 1;
      v_check := v_check - INTERVAL '1 day';
    ELSE
      EXIT;
    END IF;
  END LOOP;

  UPDATE users
  SET current_streak = v_streak,
      best_streak = GREATEST(best_streak, v_streak),
      last_entry_date = v_last
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION trg_recalc_streak()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM recalc_user_streak(COALESCE(NEW.user_id, OLD.user_id));
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS posts_streak_update ON daily_entries;
CREATE TRIGGER posts_streak_update
AFTER INSERT OR UPDATE OR DELETE ON daily_entries
FOR EACH ROW EXECUTE FUNCTION trg_recalc_streak();

-- Recalcular para todos los usuarios existentes
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT id FROM users LOOP
    PERFORM recalc_user_streak(r.id);
  END LOOP;
END $$;
