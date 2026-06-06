-- ===========================================
-- FitReal - Schema para Supabase
-- Ejecuta este SQL en el SQL Editor de Supabase
-- ===========================================

-- Tabla de usuarios (perfil)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  notification_window TEXT NOT NULL DEFAULT 'random'
    CHECK (notification_window IN ('morning', 'afternoon', 'random')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla de entradas diarias (fotos)
CREATE TABLE daily_entries (
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
CREATE TABLE friendships (
  user_id_a UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_id_b UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id_a, user_id_b)
);

-- Tabla de reacciones
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES daily_entries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(entry_id, user_id, emoji)
);

-- Indices para rendimiento
CREATE INDEX idx_daily_entries_user_date ON daily_entries(user_id, date);
CREATE INDEX idx_friendships_user_a ON friendships(user_id_a);
CREATE INDEX idx_friendships_user_b ON friendships(user_id_b);
CREATE INDEX idx_reactions_entry ON reactions(entry_id);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- Politicas: users
CREATE POLICY "Users can read all profiles"
  ON users FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE TO authenticated
  USING (id = auth.uid());

-- Politicas: daily_entries
CREATE POLICY "Users can see friends entries"
  ON daily_entries FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM friendships
      WHERE status = 'accepted'
      AND (
        (user_id_a = auth.uid() AND user_id_b = daily_entries.user_id)
        OR (user_id_b = auth.uid() AND user_id_a = daily_entries.user_id)
      )
    )
  );

CREATE POLICY "Users can insert own entries"
  ON daily_entries FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Politicas: friendships
CREATE POLICY "Users can see own friendships"
  ON friendships FOR SELECT TO authenticated
  USING (user_id_a = auth.uid() OR user_id_b = auth.uid());

CREATE POLICY "Users can send friend requests"
  ON friendships FOR INSERT TO authenticated
  WITH CHECK (user_id_a = auth.uid());

CREATE POLICY "Users can accept friend requests"
  ON friendships FOR UPDATE TO authenticated
  USING (user_id_b = auth.uid());

-- Politicas: reactions
CREATE POLICY "Users can see reactions"
  ON reactions FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can add reactions"
  ON reactions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ===========================================
-- Storage: crear bucket "daily-photos"
-- En Supabase Dashboard > Storage > New Bucket
-- Nombre: daily-photos
-- Public: SI
-- ===========================================
