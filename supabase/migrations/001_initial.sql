-- ===========================================
-- 001 - Schema inicial (ya aplicado en Supabase)
-- Esto es el schema base con el que arrancamos
-- ===========================================

-- Tabla de usuarios (perfil)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  notification_window TEXT NOT NULL DEFAULT 'random'
    CHECK (notification_window IN ('morning', 'afternoon', 'random')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla de entradas diarias (fotos)
CREATE TABLE IF NOT EXISTS daily_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  gps_lat DOUBLE PRECISION,
  gps_lng DOUBLE PRECISION,
  UNIQUE(user_id, date)
);

-- Tabla de amistades
CREATE TABLE IF NOT EXISTS friendships (
  user_id_a UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_id_b UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id_a, user_id_b)
);

-- Tabla de reacciones
CREATE TABLE IF NOT EXISTS reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES daily_entries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(entry_id, user_id, emoji)
);
