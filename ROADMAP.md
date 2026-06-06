# FitReal - Estrategia, Arquitectura y Roadmap

> Documento estratégico: producto, UX, arquitectura técnica y plan de ejecución en 3 fases.

---

## BLOQUE 1 — PRODUCTO, UX Y FUNCIONALIDADES

### El core insight

FitReal NO compite con Strava (tracking) ni con Apple Fitness (stats). Compite con BeReal en el espacio "autenticidad social". Tu ventaja: **el fitness es repetitivo, social y mide constancia mejor que cualquier otra vertical**. BeReal se quedó sin razón para volver. Tú tienes una: **demostrar que entrenas**.

**Regla de oro:** todo lo que añadas debe reforzar uno de estos tres pilares:
1. **Autenticidad** (no se puede falsear)
2. **Constancia** (rachas, presión positiva)
3. **Amigos** (sin amigos, no hay app)

Si una feature no toca al menos dos, fuera.

---

### 1.1 Funcionalidades imprescindibles para v1.0

Lo que necesitas SÍ o SÍ antes de pedir a alguien que descargue la app:

| Feature | Por qué | Esfuerzo |
|---|---|---|
| **Onboarding de 3 pantallas** | Sin esto, el 70% no entiende el concepto y se va | S |
| **Notificación diaria aleatoria** | El core BeReal. "Tienes 2 horas para subir tu foto" | M |
| **Doble cámara (front + back simultánea)** | Signature visual de autenticidad. BeReal lo demostró | M |
| **Streak / racha de días** | Variable Schedule of Reinforcement. El loop de Duolingo | S |
| **Late post detection** | "Subió 3h tarde" como BeReal. Honestidad social | S |
| **Recordatorio si racha en peligro** | Push a las 22:00 si no ha subido | S |
| **Compartir invitación con deeplink** | Sin esto no hay growth | M |
| **Reportar / bloquear** | App Store lo exige para UGC | S |
| **Borrar cuenta in-app** | App Store lo exige desde 2022 | S |
| **Empty states bonitos** | Sin amigos, sin posts, el feed vacío mata | S |

### 1.2 Funcionalidades diferenciales (la personalidad)

Lo que NADIE más tiene y que define la marca FitReal:

1. **"Real or Fake?"** — Un detector visual sutil. Si la foto no tiene movimiento, sudor o contexto de gym, los amigos pueden marcarla como "❓Postureo". 3 marcas → la foto queda con un sello "🤡 Postureo detectado". Gamifica la honestidad.

2. **Verificación contextual opcional** — Pides al usuario etiquetar: "💪 Pesas", "🏃 Cardio", "🧘 Movilidad", "🤸 Calistenia", "🥊 Deporte". Esto alimenta stats sin esfuerzo y permite retos por categoría.

3. **"Spot check" de gimnasio** — Si activas GPS, la foto muestra un pin con el lugar. Si vas siempre al mismo gym, los amigos lo ven. Crea identidad ("el del Basic-Fit de Chamberí").

4. **Reto semanal automático** — Todos los lunes a las 00:00, un reto: "Esta semana, 5 días seguidos" / "Esta semana, una foto de cardio". Premio: badge animado en el perfil.

5. **"Workout window"** — En vez de notificación aleatoria todo el día (BeReal), tú eliges tu ventana: mañana (7-10h), tarde (17-20h), random. Más realista para fitness.

6. **Modo "Sin excusas"** — Días que NO entrenas, puedes subir foto de descanso activo, comida real, o "rest day". Mantiene la racha PERO marca diferente en el calendario. Compromiso, no perfección.

7. **Doble foto = doble racha**. Si subes foto y otro amigo reacciona en menos de 1h con su propia foto, los dos ganan un "combo".

8. **Feed solo del día** — A medianoche el feed se borra (BeReal style). La foto solo existe en tu perfil/calendario. **Esto crea FOMO real.**

### 1.3 Mecánicas de retención diaria

Las claves psicológicas que enganchan:

- **Loss aversion** — "Tu racha de 23 días se pierde si no subes en 2h" (push notification)
- **Variable reward** — Notificación a hora aleatoria dentro de tu ventana → dopamina
- **Social pressure** — "Marcos y 4 más ya subieron hoy" → push notification
- **Streak freeze** — 1 por mes gratis (Duolingo style). Pagas más con la suscripción
- **Comeback bonus** — Si rompes racha, te dan "2x reactions" durante 3 días
- **Calendario público** — En tu perfil, GitHub-style activity grid. Visible para amigos
- **Sticky day** — El día 7, 30, 100, 365 tienen badges especiales animados

### 1.4 Mecánicas sociales/virales

- **Deeplink de invitación** — `fitreal://invite/abc123` con tu nombre y racha. Al instalar la app, te conecta directo
- **Compartir racha en stories** — Botón "Compartir mi racha de X días" → genera imagen con tu foto + número grande → Instagram Stories. Viralidad pasiva
- **Friend Codes** — Como Pokémon GO. Username + 4 dígitos. Difícil de adivinar, fácil de compartir
- **Squad** — Grupos de 3-8 amigos privados. Ves un mini-feed dedicado, racha de grupo, reto interno
- **Public challenges** — "Octubre Sin Excusas: 25/31 días". Cualquiera se apunta. Top 100 público. **Esto trae usuarios nuevos**
- **Replies con foto** — Puedes reaccionar a la foto de un amigo CON tu propia foto. Combo de fotos en cadena
- **Co-workout** — Si dos amigos suben en la misma ventana de 30min, sale un badge "Entrenaron juntos"

### 1.5 Mejoras de UX/UI pantalla por pantalla

#### Login / Register
- **Quitar** el flujo email/password como primary. Default: Sign in with Apple (iOS, obligatorio si tienes otro auth) y luego Email
- **Username durante onboarding**, no en register. Que el primer paso sea solo entrar
- **Auto-focus** en el primer input, teclado abierto desde el principio
- **Mensajes de error inline** debajo del input, no Alert
- **Loading state en el botón**, no Alert

#### Onboarding (NUEVO, 4 pantallas)
1. "**Bienvenido a FitReal**. Una foto al día. Sin galería. Sin filtros." — fondo con loop de fotos reales
2. "**Tu ventana**. ¿Cuándo entrenas?" — mañana / tarde / random
3. "**Permisos**. Cámara y notificaciones." — botón único que pide ambos
4. "**Añade 3 amigos**. La app es mejor con amigos." — campo de búsqueda + skip

#### Feed
- **Cards a pantalla completa estilo BeReal** — swipe vertical entre amigos del día
- **No cards pequeñas en lista**. Inmersión, no scroll de Twitter
- **Header sticky** con avatar del autor, racha en badge, hora
- **Mini-mapa o ciudad** si hay GPS
- **Reactions overlay** sobre la foto, no debajo
- **Indicador "Llegaste tarde 2h"** si subió fuera de ventana
- **Empty state** con CTA: "Añade amigos para ver su entreno" + botón

#### Cámara
- **Doble cámara simultánea** (front pequeña, back grande, como BeReal). Cuando le des al botón, captura ambas
- **Countdown 3-2-1** antes del disparo
- **Sin botón de galería** (ya lo tienes, mantenlo)
- **Compass overlay sutil** indicando que GPS está activo
- **Sin zoom** — fuerza la cámara honesta
- **Switch front/back** solo en cámara "secundaria"

#### Preview / Subida
- **Caption opcional** (max 60 chars), no obligatorio
- **Selector de tipo de entreno** con emojis grandes (💪 🏃 🧘 🤸 🥊)
- **Toggle "Compartir ubicación"** explícito
- **Progress bar de subida** (no spinner)
- **Animación de éxito** — confeti naranja + número de racha grande

#### Perfil
- **Header inmersivo** — última foto como fondo blureado, avatar grande
- **Stats horizontales**: racha actual, mejor racha, días totales, amigos
- **Calendario activity** GitHub-style (12 meses)
- **Badges grid** debajo
- **Botón "Editar perfil"** para username, ventana, bio
- **Settings en icono ⚙️** arriba — ahí logout, eliminar cuenta, notificaciones

#### Amigos
- **3 tabs**: Mis amigos / Solicitudes / Buscar
- **Solicitudes con avatar + racha** del que te pide
- **Buscar por username con preview** de su perfil antes de enviar
- **Sugerencias** (gente con amigos en común)
- **Botón "Compartir invitación"** muy visible arriba

#### Notificaciones (pantalla)
- Lista de eventos: "Marcos reaccionó", "Sara aceptó tu solicitud", "Tu racha está en peligro"
- Filtros: todas / reacciones / amigos / rachas
- Marcar como leído al ver

### 1.6 Sistema de gamificación

#### Rachas
- **Racha actual** (current streak)
- **Mejor racha** (best streak) — visible en perfil
- **Streak freezes**: 1 al mes gratis, +1 por cada 30 días de racha, +5 con suscripción
- **Recovery window**: 24h después de romper racha puedes "recuperar" con 1 reto

#### Badges (mínimo 30 al lanzamiento)
- 🔥 **First Week** — 7 días
- 💪 **Iron Will** — 30 días
- 👑 **Century** — 100 días
- 🏆 **Year of Sweat** — 365 días
- 🌅 **Early Bird** — 30 entrenos antes de las 8am
- 🌙 **Night Owl** — 30 entrenos después de las 22h
- 🌍 **Globetrotter** — entreno en 5 ciudades distintas
- 👥 **Squad Up** — 10 amigos
- 💌 **Reactor** — 100 reacciones dadas
- 🎯 **Perfect Week** — 7 días seguidos con foto en ventana
- 🤸 **Mixed Bag** — todos los tipos de entreno en una semana
- (etc.)

#### Rankings
- **Semanal**: top racha entre tus amigos
- **Mensual**: más entrenos del mes entre amigos
- **Global**: top 100 rachas mundial (público, opt-in)
- **Por squad**: ranking interno del grupo

#### Retos
- **Solo**: "Completa 5 entrenos esta semana"
- **Amigos** 1v1: "Yo te reto a 7 días seguidos"
- **Squad**: "Octubre Sin Excusas" entre los 5 del grupo
- **Públicos**: oficiales de FitReal (mensuales con badge exclusivo)

#### Recompensas visuales
- **Confeti** al subir (más grande con racha más larga)
- **Halos de color** alrededor del avatar según racha (bronce 7, plata 30, oro 100, fuego animado 365)
- **Skins de UI** desbloqueables (tema "Black & Gold" a los 100 días)

### 1.7 Cómo evitar ser "solo otra app de fitness"

| Anti-patrón | Antídoto FitReal |
|---|---|
| Logging detallado de ejercicios | NO. Solo foto. Una decisión, un click |
| Stats de salud (HR, calorías) | NO en v1. Es para Strava/Apple. Tu valor es social |
| Posts editables / borrables | NO. La autenticidad muere si puedes editar |
| Subir desde galería | NO, nunca. Es la diferencia con todas las demás |
| Filtros de cámara | NO. Real significa real |
| Feed "para ti" algorítmico | NO. Solo amigos. Reverse de Instagram |
| Stories que duran 24h | NO. El POST dura 24h en feed. Diferenciación |
| Likes públicos (números) | Cuidadosos. Solo reacciones, sin contar likes |

**Tu estrategia es "menos es más"**. Cada feature debe pasar el test: "¿Esto refuerza autenticidad, constancia o conexión con amigos?"

---

## BLOQUE 2 — ARQUITECTURA TÉCNICA Y SUPABASE

### 2.1 Nueva estructura del proyecto

```
fitreal/
├── app/                          # expo-router (sin cambios)
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (onboarding)/             # NUEVO
│   │   ├── _layout.tsx
│   │   ├── welcome.tsx
│   │   ├── window.tsx
│   │   ├── permissions.tsx
│   │   └── friends.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── feed.tsx
│   │   ├── camera.tsx
│   │   ├── friends.tsx           # antes en profile, ahora separado
│   │   └── profile.tsx
│   ├── post/[id].tsx             # detalle de un post
│   ├── user/[username].tsx       # perfil de otro
│   ├── settings.tsx              # NUEVO
│   └── challenge/[id].tsx        # NUEVO
├── src/
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── database.types.ts
│   │   ├── storage.ts            # helpers de Storage (signed URLs, etc.)
│   │   ├── notifications.ts      # registro push + handlers
│   │   ├── deeplinks.ts          # parsing de invitaciones
│   │   └── analytics.ts          # eventos (Posthog/Amplitude opcional)
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── ProfileContext.tsx    # NUEVO - cache del perfil propio
│   ├── hooks/                    # NUEVO
│   │   ├── useFeed.ts
│   │   ├── useStreak.ts
│   │   ├── useFriends.ts
│   │   ├── useProfile.ts
│   │   └── useTodayEntry.ts
│   ├── components/               # NUEVO
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── ScreenContainer.tsx
│   │   ├── feed/
│   │   │   ├── FeedCard.tsx
│   │   │   ├── ReactionBar.tsx
│   │   │   └── EmptyFeed.tsx
│   │   ├── profile/
│   │   │   ├── StreakBadge.tsx
│   │   │   ├── ActivityCalendar.tsx
│   │   │   └── StatsRow.tsx
│   │   └── camera/
│   │       ├── DualCamera.tsx
│   │       └── CaptureButton.tsx
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   └── typography.ts
│   ├── types/
│   │   ├── models.ts             # dominio: Post, User, Friend, etc.
│   │   └── notifications.ts
│   └── utils/
│       ├── date.ts               # streak math, "today", timezone-safe
│       ├── streak.ts             # calcular racha
│       └── validation.ts
├── assets/
└── supabase/                     # NUEVO
    ├── migrations/               # SQL versionado
    │   ├── 001_initial.sql
    │   ├── 002_streaks.sql
    │   ├── 003_challenges.sql
    │   └── ...
    └── functions/                # Edge Functions (opcional)
        ├── send-daily-notif/
        └── compute-leaderboard/
```

**Por qué este cambio:**
- `hooks/` aísla lógica de Supabase de los componentes → testeable, reutilizable
- `components/` con primitivos compartidos → no duplicas estilos
- `theme/` centralizado → cambiar accent color es 1 línea
- `supabase/migrations/` versionado → cambios reproducibles, no perdidos

### 2.2 Mejoras al modelo de datos

#### Revisión de tablas actuales

**`users`** — bien diseñada. Cambios:
- Añadir `display_name TEXT` (separable del username)
- Añadir `avatar_url TEXT` (subir avatar al storage)
- Añadir `bio TEXT` (140 chars)
- Añadir `timezone TEXT NOT NULL DEFAULT 'UTC'` — **crítico para streaks**
- Añadir `current_streak INT NOT NULL DEFAULT 0`
- Añadir `best_streak INT NOT NULL DEFAULT 0`
- Añadir `last_entry_date DATE` — para calcular streak rápido
- Añadir `streak_freezes INT NOT NULL DEFAULT 1`
- Añadir `friend_code TEXT UNIQUE` — username#1234

**`daily_entries`** — cambios:
- Renombrar a `posts` (más genérico, deja sitio a workouts)
- Añadir `workout_type TEXT` (pesas, cardio, etc.)
- Añadir `caption TEXT`
- Añadir `is_late BOOLEAN` (calculado contra ventana de notif)
- Añadir `notification_sent_at TIMESTAMPTZ` (para calcular `is_late`)
- Añadir `front_photo_url TEXT` (para dual camera)
- Añadir `city TEXT` (geocoding del GPS, opcional)
- Añadir índice por `(date DESC, user_id)` para feed paginado

**`friendships`** — bien. Cambios:
- Añadir `accepted_at TIMESTAMPTZ`
- Asegurar constraint `user_id_a < user_id_b` para evitar duplicados al revés

**`reactions`** — bien. Cambios:
- Considerar limitar a 1 reacción por user por post (en vez de por emoji). UX más limpio.

#### Tablas nuevas

```sql
-- ============================================
-- 002_profile_extensions.sql
-- ============================================
ALTER TABLE users ADD COLUMN display_name TEXT;
ALTER TABLE users ADD COLUMN avatar_url TEXT;
ALTER TABLE users ADD COLUMN bio TEXT CHECK (char_length(bio) <= 140);
ALTER TABLE users ADD COLUMN timezone TEXT NOT NULL DEFAULT 'UTC';
ALTER TABLE users ADD COLUMN current_streak INT NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN best_streak INT NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN last_entry_date DATE;
ALTER TABLE users ADD COLUMN streak_freezes INT NOT NULL DEFAULT 1;
ALTER TABLE users ADD COLUMN friend_code TEXT UNIQUE;
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMPTZ;

CREATE INDEX idx_users_friend_code ON users(friend_code);
CREATE INDEX idx_users_username_lower ON users(LOWER(username));

-- ============================================
-- 003_posts_extensions.sql (renombrado de daily_entries)
-- ============================================
ALTER TABLE daily_entries ADD COLUMN workout_type TEXT
  CHECK (workout_type IN ('weights','cardio','mobility','calisthenics','sport','rest'));
ALTER TABLE daily_entries ADD COLUMN caption TEXT CHECK (char_length(caption) <= 60);
ALTER TABLE daily_entries ADD COLUMN is_late BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE daily_entries ADD COLUMN notification_sent_at TIMESTAMPTZ;
ALTER TABLE daily_entries ADD COLUMN front_photo_url TEXT;
ALTER TABLE daily_entries ADD COLUMN city TEXT;
ALTER TABLE daily_entries ADD COLUMN deleted_at TIMESTAMPTZ;

CREATE INDEX idx_posts_date_user ON daily_entries(date DESC, user_id);
CREATE INDEX idx_posts_user_date ON daily_entries(user_id, date DESC);

-- ============================================
-- 004_notifications.sql
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'friend_request','friend_accepted','reaction','daily_reminder',
    'streak_warning','challenge_invite','challenge_won','friend_posted'
  )),
  actor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  entry_id UUID REFERENCES daily_entries(id) ON DELETE CASCADE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_notif_user_unread ON notifications(user_id, created_at DESC)
  WHERE read_at IS NULL;

-- Push tokens para envíos
CREATE TABLE push_tokens (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('ios','android')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, token)
);

-- ============================================
-- 005_streaks.sql
-- ============================================
-- Histórico de streaks (para badges "ya tuviste racha de 30")
CREATE TABLE streak_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at DATE NOT NULL,
  ended_at DATE,
  length INT NOT NULL,
  freezes_used INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Función para recalcular el streak desde cero (idempotente)
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
  v_today := (now() AT TIME ZONE v_tz)::date;

  SELECT MAX(date) INTO v_last
  FROM daily_entries
  WHERE user_id = p_user_id AND deleted_at IS NULL;

  IF v_last IS NULL OR v_last < v_today - INTERVAL '1 day' THEN
    UPDATE users SET current_streak = 0, last_entry_date = v_last WHERE id = p_user_id;
    RETURN;
  END IF;

  v_check := v_last;
  LOOP
    IF EXISTS (
      SELECT 1 FROM daily_entries
      WHERE user_id = p_user_id AND date = v_check AND deleted_at IS NULL
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

-- Trigger: actualizar streak al insertar/borrar post
CREATE OR REPLACE FUNCTION trg_recalc_streak()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM recalc_user_streak(COALESCE(NEW.user_id, OLD.user_id));
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER posts_streak_update
AFTER INSERT OR UPDATE OR DELETE ON daily_entries
FOR EACH ROW EXECUTE FUNCTION trg_recalc_streak();

-- ============================================
-- 006_challenges.sql
-- ============================================
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  visibility TEXT NOT NULL CHECK (visibility IN ('private','public','squad')),
  goal_type TEXT NOT NULL CHECK (goal_type IN ('days_count','streak_length','workouts_of_type')),
  goal_target INT NOT NULL,
  workout_type TEXT,
  starts_at DATE NOT NULL,
  ends_at DATE NOT NULL,
  badge_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_challenges_active ON challenges(ends_at)
  WHERE ends_at >= CURRENT_DATE;

CREATE TABLE challenge_members (
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  progress INT NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (challenge_id, user_id)
);
CREATE INDEX idx_challenge_members_user ON challenge_members(user_id);

-- ============================================
-- 007_achievements.sql
-- ============================================
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('bronze','silver','gold','platinum')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_badges (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, badge_id)
);

-- ============================================
-- 008_moderation.sql
-- ============================================
CREATE TABLE blocked_users (
  blocker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (blocker_id, blocked_id),
  CHECK (blocker_id <> blocked_id)
);

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reported_entry_id UUID REFERENCES daily_entries(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (reason IN ('inappropriate','spam','harassment','fake','other')),
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','reviewed','dismissed','action_taken')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_reports_pending ON reports(created_at DESC) WHERE status = 'pending';
```

### 2.3 RLS para todas las tablas nuevas

```sql
-- notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users see own notifications"
  ON notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "users mark own notifications read"
  ON notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- push_tokens
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own tokens"
  ON push_tokens FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- streak_history
ALTER TABLE streak_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own streaks"
  ON streak_history FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- challenges
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "see public challenges or own"
  ON challenges FOR SELECT TO authenticated
  USING (visibility = 'public' OR creator_id = auth.uid()
    OR EXISTS (SELECT 1 FROM challenge_members
               WHERE challenge_id = challenges.id AND user_id = auth.uid()));
CREATE POLICY "create challenges"
  ON challenges FOR INSERT TO authenticated
  WITH CHECK (creator_id = auth.uid());

-- challenge_members
ALTER TABLE challenge_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "see own memberships and challenge mates"
  ON challenge_members FOR SELECT TO authenticated
  USING (user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM challenge_members cm
               WHERE cm.challenge_id = challenge_members.challenge_id
               AND cm.user_id = auth.uid()));
CREATE POLICY "join challenges"
  ON challenge_members FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "leave own membership"
  ON challenge_members FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- badges (lectura pública)
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "everyone reads badges" ON badges FOR SELECT TO authenticated USING (true);

-- user_badges
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "see own and friends badges"
  ON user_badges FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM friendships
      WHERE status = 'accepted'
      AND ((user_id_a = auth.uid() AND user_id_b = user_badges.user_id)
        OR (user_id_b = auth.uid() AND user_id_a = user_badges.user_id))
    )
  );

-- blocked_users
ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own blocks"
  ON blocked_users FOR ALL TO authenticated
  USING (blocker_id = auth.uid()) WITH CHECK (blocker_id = auth.uid());

-- reports
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users create reports"
  ON reports FOR INSERT TO authenticated
  WITH CHECK (reporter_id = auth.uid());
CREATE POLICY "users see own reports"
  ON reports FOR SELECT TO authenticated
  USING (reporter_id = auth.uid());
```

### 2.4 Seguridad — cambios críticos

#### Storage: pasar de público a privado + signed URLs

El bucket actual `daily-photos` es público. **Cambiar a privado** y servir signed URLs con expiración. Razones:
- Cualquiera con la URL ve la foto (sin RLS)
- En App Store review pueden bajar la app si el bucket es público con PII

**Migración:**
```sql
-- Marcar bucket como privado desde el dashboard
-- Luego, en Storage policies:
CREATE POLICY "owners upload"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'daily-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "owner reads own + friends read friends"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'daily-photos' AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR EXISTS (
        SELECT 1 FROM friendships
        WHERE status = 'accepted'
        AND (
          (user_id_a = auth.uid()
            AND user_id_b::text = (storage.foldername(name))[1])
          OR (user_id_b = auth.uid()
            AND user_id_a::text = (storage.foldername(name))[1])
        )
      )
    )
  );

CREATE POLICY "owners update own"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'daily-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text);
```

En el cliente, en vez de `getPublicUrl`, usar `createSignedUrl(path, 3600)`.

#### Validación una foto/día

Ya tienes `UNIQUE(user_id, date)`. Añade trigger anti-foto-pasada:

```sql
CREATE OR REPLACE FUNCTION validate_post_date()
RETURNS TRIGGER AS $$
DECLARE
  v_tz TEXT;
  v_today DATE;
BEGIN
  SELECT timezone INTO v_tz FROM users WHERE id = NEW.user_id;
  v_today := (now() AT TIME ZONE v_tz)::date;
  IF NEW.date <> v_today THEN
    RAISE EXCEPTION 'Posts only allowed for today (tz=%, expected=%, got=%)',
      v_tz, v_today, NEW.date;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_validate_date
BEFORE INSERT ON daily_entries
FOR EACH ROW EXECUTE FUNCTION validate_post_date();
```

#### Bloqueo de no-amigos en el feed
La RLS actual ya lo cubre, pero añade `blocked_users` al check:

```sql
DROP POLICY "Users can see friends entries" ON daily_entries;
CREATE POLICY "Users can see friends entries"
  ON daily_entries FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR (
      EXISTS (
        SELECT 1 FROM friendships
        WHERE status = 'accepted'
        AND ((user_id_a = auth.uid() AND user_id_b = daily_entries.user_id)
          OR (user_id_b = auth.uid() AND user_id_a = daily_entries.user_id))
      )
      AND NOT EXISTS (
        SELECT 1 FROM blocked_users
        WHERE (blocker_id = auth.uid() AND blocked_id = daily_entries.user_id)
        OR (blocker_id = daily_entries.user_id AND blocked_id = auth.uid())
      )
      AND daily_entries.deleted_at IS NULL
    )
  );
```

### 2.5 Rendimiento

#### Índices clave
Ya añadidos arriba. Repaso:
- `daily_entries(date DESC, user_id)` — feed paginado
- `daily_entries(user_id, date DESC)` — perfil
- `users(LOWER(username))` — búsqueda case-insensitive
- `users(friend_code)` — invitaciones
- `notifications(user_id, created_at DESC) WHERE read_at IS NULL` — partial index para badge count

#### Paginación del feed

```typescript
// src/hooks/useFeed.ts
const PAGE_SIZE = 20;

export function useFeed() {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: async ({ pageParam }) => {
      const { data, error } = await supabase
        .from('daily_entries')
        .select('id, user_id, photo_url, front_photo_url, date, caption, captured_at, users!inner(username, avatar_url, current_streak)')
        .lte('date', pageParam ?? new Date().toISOString().split('T')[0])
        .order('date', { ascending: false })
        .order('captured_at', { ascending: false })
        .limit(PAGE_SIZE);
      if (error) throw error;
      return data;
    },
    getNextPageParam: (last) => last.at(-1)?.date,
    initialPageParam: undefined,
  });
}
```

#### Carga de imágenes
- Reemplazar `Image` por `expo-image` (caché + placeholder + transitions)
- Para fotos del feed: usar Supabase Storage **image transformation** con `?width=600&quality=70`
- Pre-fetch de la siguiente página cuando el usuario está a 5 posts del final

#### Caché local
- TanStack Query (`@tanstack/react-query`) para todas las queries
- `staleTime: 60 * 1000` para feed, `Infinity` para badges
- Persistencia con `@tanstack/query-async-storage-persister` + AsyncStorage

### 2.6 Push notifications: estrategia

#### Tabla de envíos automáticos

| Trigger | Quién | Cuándo | Mensaje |
|---|---|---|---|
| **Ventana de notificación** | usuario | hora aleatoria dentro de su ventana | "⏰ Tu momento FitReal. Tienes 2h" |
| **Friend posted** | amigos del autor | al subir foto | "🔥 Marcos acaba de entrenar. ¡Tu turno!" |
| **Streak warning** | usuario sin post | 2h antes de medianoche local | "🚨 Tu racha de X días en peligro" |
| **Streak warning final** | usuario sin post | 30 min antes | "💀 Última oportunidad" |
| **Reaction received** | autor del post | al recibir 1ª reacción | "💪 marcos reaccionó a tu foto" |
| **Friend request** | usuario | al recibir solicitud | "👋 sara quiere ser tu amigo" |
| **Friend accepted** | usuario | aceptación recibida | "🎉 sara aceptó tu solicitud" |
| **Challenge invite** | usuario | invitación | "🎯 marcos te reta: 7 días seguidos" |
| **Challenge won** | usuario | reto completado | "🏆 ¡Reto completado! +1 badge" |
| **Comeback** | usuario inactivo 3+ días | 18:00 día 3 | "Te echamos de menos. Vuelve con un combo x2" |

#### Arquitectura

**Edge Function en Supabase** + **pg_cron** para los recurrentes:

```typescript
// supabase/functions/send-push/index.ts
import { Expo } from 'expo-server-sdk';
const expo = new Expo();

Deno.serve(async (req) => {
  const { user_ids, title, body, data } = await req.json();
  const tokens = await getPushTokens(user_ids);
  const messages = tokens.map(t => ({
    to: t.token,
    title, body, data, sound: 'default',
  }));
  const chunks = expo.chunkPushNotifications(messages);
  for (const chunk of chunks) {
    await expo.sendPushNotificationsAsync(chunk);
  }
  return new Response('ok');
});
```

**Cron jobs (pg_cron):**

```sql
-- Cada 5 min: revisar streaks en peligro
SELECT cron.schedule('streak-warning', '*/5 * * * *', $$
  SELECT net.http_post(
    url := 'https://<project>.supabase.co/functions/v1/send-streak-warning',
    headers := '{"Authorization": "Bearer ..."}'::jsonb
  )
$$);

-- Diario 18:00 UTC: comeback notifications
SELECT cron.schedule('comeback-push', '0 18 * * *', $$
  SELECT net.http_post(
    url := 'https://<project>.supabase.co/functions/v1/send-comeback',
    headers := '{"Authorization": "Bearer ..."}'::jsonb
  )
$$);
```

**Triggers para eventos en tiempo real:**

```sql
-- Al insertar reaction → llamar a edge function vía pg_net
CREATE OR REPLACE FUNCTION notify_reaction()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, type, actor_id, entry_id, metadata)
  SELECT de.user_id, 'reaction', NEW.user_id, NEW.entry_id,
    jsonb_build_object('emoji', NEW.emoji)
  FROM daily_entries de WHERE de.id = NEW.entry_id AND de.user_id <> NEW.user_id;

  -- Disparar push async
  PERFORM net.http_post(
    url := 'https://<project>.supabase.co/functions/v1/send-push-reaction',
    body := jsonb_build_object('reaction_id', NEW.id)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER reactions_notify
AFTER INSERT ON reactions
FOR EACH ROW EXECUTE FUNCTION notify_reaction();
```

#### En el cliente

```typescript
// src/lib/notifications.ts
import * as Notifications from 'expo-notifications';

export async function registerForPush(userId: string) {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;
  const token = (await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas?.projectId,
  })).data;
  await supabase.from('push_tokens').upsert({
    user_id: userId, token, platform: Platform.OS,
  });
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: true,
  }),
});
```

---

## BLOQUE 3 — ROADMAP DE EJECUCIÓN

### FASE 1 — Pulir la app actual (2-3 semanas)

#### Objetivo
Que la app se sienta **terminada**. No nuevas features grandes; pulido visual, onboarding y todos los estados (loading/empty/error) bonitos.

#### Funcionalidades
- Onboarding de 4 pantallas
- Theme centralizado (`src/theme/`)
- Componentes UI base (Button, Input, Avatar, Badge)
- Pantalla de Settings (editar perfil, ventana, logout, eliminar cuenta)
- Avatar de usuario (subir a Storage)
- Streak calculado correctamente con timezone
- Migrar Storage a privado + signed URLs
- Recordatorio diario (push notification simple)
- Empty states de Feed/Amigos/Perfil
- Error boundaries
- Loading skeletons
- Animaciones (react-native-reanimated) de transición
- Pull-to-refresh en feed con animación naranja
- Confeti al subir foto
- Mejorar formato de fecha ("hoy", "ayer")
- Botón "Compartir mi racha" en perfil

#### Archivos a crear/modificar
```
NUEVOS:
  app/(onboarding)/_layout.tsx
  app/(onboarding)/welcome.tsx
  app/(onboarding)/window.tsx
  app/(onboarding)/permissions.tsx
  app/(onboarding)/friends.tsx
  app/settings.tsx
  src/theme/{colors,spacing,typography}.ts
  src/components/ui/{Button,Input,Avatar,Badge,ScreenContainer}.tsx
  src/components/feed/{FeedCard,ReactionBar,EmptyFeed}.tsx
  src/components/profile/{StreakBadge,StatsRow,ActivityCalendar}.tsx
  src/hooks/{useFeed,useStreak,useFriends,useTodayEntry}.ts
  src/lib/{notifications,storage}.ts
  src/utils/{date,streak}.ts
  supabase/migrations/002_profile_extensions.sql
  supabase/migrations/003_posts_extensions.sql
  supabase/migrations/004_notifications.sql
  supabase/migrations/005_streaks.sql

MODIFICAR:
  app/_layout.tsx — añadir gate de onboarding
  app/(tabs)/feed.tsx — usar useFeed + FeedCard
  app/(tabs)/camera.tsx — confeti + signed URL
  app/(tabs)/profile.tsx — StreakBadge + ActivityCalendar
  src/contexts/AuthContext.tsx — añadir profile context
  src/lib/supabase.ts — añadir helpers
  app.json — añadir notifications config con projectId EAS
```

#### Código de ejemplo (Button base)
```typescript
// src/components/ui/Button.tsx
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../../theme';

type Props = {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
};

export function Button({ onPress, title, variant = 'primary', loading, disabled }: Props) {
  const bg = {
    primary: colors.accent,
    secondary: colors.surface,
    ghost: 'transparent',
  }[variant];
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={{
        backgroundColor: bg, borderRadius: 14, padding: spacing.md,
        alignItems: 'center', opacity: disabled ? 0.5 : 1, minHeight: 52,
        justifyContent: 'center',
      }}
    >
      {loading
        ? <ActivityIndicator color={colors.white} />
        : <Text style={{ color: colors.white, fontSize: 16, fontWeight: '700' }}>{title}</Text>}
    </TouchableOpacity>
  );
}
```

#### Riesgos técnicos
- Timezone de streaks: si el usuario viaja, su racha puede romperse. **Mitigación:** guardar TZ al hacer login, ofrecer actualizar
- Signed URLs caducan: si se cachean en `expo-image` pasadas las 1h, fallan. **Mitigación:** TTL de 24h
- Migrar bucket a privado: si tienes datos en producción, hay que re-firmar URLs almacenadas. **Mitigación:** no almacenar URL, solo path

#### Orden exacto de implementación
1. `src/theme/` + Button/Input/Avatar primitivos
2. Migración 002 (profile extensions) + ProfileContext
3. Pantalla settings + editar perfil + eliminar cuenta
4. Migración 005 (streaks) + recálculo
5. StreakBadge + ActivityCalendar en perfil
6. Onboarding 4 pantallas + gate en root layout
7. Refactor de Feed con FeedCard + useFeed paginado
8. Empty/Loading/Error states en feed y perfil
9. Migración Storage a privado + signed URLs
10. Push notifications setup + recordatorio diario
11. Confeti + animaciones
12. Compartir racha (deeplink + share image)

#### Checklist de validación FASE 1
- [ ] Usuario nuevo ve onboarding completo
- [ ] Usuario existente NO ve onboarding
- [ ] Subir foto incrementa `current_streak` correctamente
- [ ] Borrar foto decrementa `current_streak`
- [ ] Foto del día anterior NO se puede subir (trigger date)
- [ ] Signed URL del feed funciona; revocar permisos rompe acceso
- [ ] Push recordatorio llega en la ventana configurada
- [ ] Eliminar cuenta borra todas las filas (cascade)
- [ ] Empty states aparecen sin amigos / sin posts
- [ ] App no crashea sin conexión (error boundary)
- [ ] Streak no se rompe al cambiar de día en TZ correcta

---

### FASE 2 — Funcionalidades sociales (3-4 semanas)

#### Objetivo
Pasar de "app individual con feed" a **plataforma social viral**. Sin esto, no hay crecimiento.

#### Funcionalidades
- Friend codes (`username#1234`)
- Deep linking de invitaciones (`fitreal://invite/CODE`)
- Compartir invitación con imagen generada
- Buscar amigos mejorado (autocomplete, sugerencias por mutuos)
- Perfil público de otros usuarios (route `/user/[username]`)
- Doble cámara simultánea (front + back)
- Reacciones repensadas (1 por user, picker animado)
- Comentarios cortos opcionales (60 chars)
- Detección de "late post" (visible en feed)
- Squads (grupos privados de 3-8)
- Compartir racha como imagen
- Reportar / bloquear
- Sistema de notificaciones in-app (campana arriba)

#### Archivos a crear/modificar
```
NUEVOS:
  app/user/[username].tsx
  app/post/[id].tsx
  app/squad/[id].tsx
  app/notifications.tsx
  src/components/camera/DualCamera.tsx
  src/components/feed/{LatePostBadge,Comment}.tsx
  src/components/social/{InviteCard,ShareStreakImage}.tsx
  src/hooks/{useNotifications,useSquad,useUserProfile}.ts
  src/lib/deeplinks.ts
  src/lib/imageGen.ts (react-native-view-shot)
  supabase/migrations/006_squads.sql
  supabase/migrations/007_comments.sql
  supabase/migrations/008_moderation.sql
  supabase/functions/send-push-reaction/index.ts
  supabase/functions/send-push-friend/index.ts

MODIFICAR:
  app/(tabs)/friends.tsx — separar de profile, añadir tabs
  app/(tabs)/feed.tsx — añadir badge late, comentarios
  app/(tabs)/camera.tsx — dual cam + workout type picker
  app.json — añadir scheme + associatedDomains
```

#### Riesgos técnicos
- **Dual camera**: expo-camera no soporta nativamente capturar ambas a la vez. **Mitigación:** capturar back, hacer flip y capturar front en ~200ms, componer las dos PNG en el cliente con `react-native-skia` o `expo-gl`. O usar `react-native-vision-camera` (requiere dev client).
- **Deep linking iOS**: necesitas configurar Universal Links con un archivo `apple-app-site-association` en tu dominio. Para Expo Go funciona el `fitreal://` scheme directo.
- **Notificaciones push de "Friend posted"**: si tienes 100 amigos y todos postean, sería spam. **Mitigación:** límite de 3 push de este tipo al día, agrupado: "marcos, sara y 3 más han entrenado hoy"
- **Comentarios**: añade moderation overhead. **Mitigación:** botón de reportar al lado, queue de reports, máximo 60 chars

#### Orden de implementación
1. Friend codes + búsqueda mejorada
2. Perfil público `/user/[username]`
3. Deep linking + invitaciones
4. Sistema de notificaciones in-app + badge
5. Push de eventos (reacción, friend request, friend posted, friend accepted)
6. Doble cámara
7. Workout type picker en preview
8. Late post badge
9. Reacciones repensadas
10. Comentarios cortos
11. Reportar/bloquear
12. Squads
13. Compartir racha como imagen
14. App Store assets (screenshots, descripción)

#### Checklist FASE 2
- [ ] Invitación con deeplink abre la app y precarga el amigo
- [ ] Doble foto se ve en feed con front pequeña sobre back
- [ ] Push de "Marcos posteó" llega en <30s tras subida
- [ ] Spam control: máx 3 friend_posted/día
- [ ] Bloquear a un usuario oculta sus posts y perfil
- [ ] Reportar genera fila en `reports` con `pending`
- [ ] Compartir racha genera PNG con racha y abre share sheet
- [ ] Squad con 3+ miembros se ve en perfil
- [ ] Comentarios respetan 60 char limit en backend (trigger)
- [ ] Notificaciones in-app marcan como leído al abrir

---

### FASE 3 — Super app fitness (4-6 semanas)

#### Objetivo
Profundizar el fitness sin perder la simplicidad. Métricas personales, retos, calendario, badges y monetización.

#### Funcionalidades
- Tipos de entreno con stats por tipo
- Objetivos semanales (5 entrenos/sem, 3 cardio/sem)
- Streaks avanzadas (mejor racha, freezes, recovery)
- Estadísticas personales (gráficas mensuales, distribución por tipo)
- Calendario de actividad completo en perfil
- Sistema completo de logros (30+ badges)
- Challenges públicos mensuales oficiales
- Challenges privados entre amigos (1v1 y squad)
- Rankings (semanal/mensual/global)
- Notificaciones inteligentes (basadas en patrones de uso)
- "Real or Fake?" — community honesty layer
- Suscripción Premium (streak freezes extra, badges exclusivos, sin retraso en feed)
- Apple Sign in obligatorio + onboarding mejorado

#### Archivos a crear/modificar
```
NUEVOS:
  app/(tabs)/challenges.tsx (o stats.tsx, depende de IA)
  app/stats.tsx
  app/badges.tsx
  app/leaderboard.tsx
  src/components/stats/{WeeklyChart,WorkoutTypeBreakdown,YearGrid}.tsx
  src/components/challenges/{ChallengeCard,ProgressBar,LeaderboardRow}.tsx
  src/components/badges/{BadgeGrid,BadgeDetailModal}.tsx
  src/hooks/{useChallenges,useBadges,useStats,useLeaderboard}.ts
  src/lib/subscription.ts (RevenueCat)
  supabase/migrations/009_challenges.sql
  supabase/migrations/010_achievements.sql
  supabase/migrations/011_premium.sql
  supabase/functions/compute-weekly-leaderboard/index.ts
  supabase/functions/grant-badges/index.ts
  supabase/functions/spawn-monthly-challenge/index.ts

MODIFICAR:
  app/(tabs)/profile.tsx — añadir stats + badges + challenges
  app/(tabs)/_layout.tsx — quizá añadir tab challenges
  app/(tabs)/camera.tsx — sugerir workout type según día
  src/contexts/ProfileContext.tsx — incluir badges, challenges activos
```

#### Riesgos técnicos
- **Calcular badges en tiempo real es caro**: usar batch nocturno con Edge Function + pg_cron, no triggers por cada post
- **Leaderboards globales**: con 100k usuarios, la query "top 100 streaks" tarda. **Mitigación:** materialized view refrescada cada 10 min
- **Suscripciones**: usar RevenueCat (envuelve App Store + Google Play). NO implementar IAP directo
- **"Real or fake?" puede ser tóxico**: cap a "3 marks para flag" + posibilidad de apelar + nunca muestra quién marcó
- **Challenges públicos**: cuidado con cheaters (cuentas falsas). **Mitigación:** solo cuentas con 30+ días de antigüedad pueden entrar en challenges públicos

#### Orden de implementación
1. Migration 010 (badges) + lista de 30 badges seed
2. Edge function `grant-badges` + cron diario
3. Badges grid en perfil
4. Workout type stats (gráfica simple)
5. Calendario YearGrid completo
6. Migration 009 (challenges) + UI básica
7. Crear challenge 1v1 entre amigos
8. Squad challenges
9. Challenges públicos mensuales (creados por admin, 1 al mes)
10. Leaderboards (materialized view + UI)
11. Streak freezes + recovery
12. Notificaciones inteligentes (comeback, suggested challenge)
13. Real or fake? (con cautela)
14. Setup RevenueCat
15. Paywall y tier premium

#### Checklist FASE 3
- [ ] Badge se otorga a las 24h del trigger (no antes)
- [ ] Streak freeze se consume automáticamente al saltarse un día
- [ ] Recovery window de 24h permite recuperar racha 1 vez/mes
- [ ] Leaderboard semanal refresca cada lunes 00:00 local
- [ ] Challenge progress sube al hacer entreno relevante (no manual)
- [ ] Challenge invitation push llega y permite aceptar/rechazar
- [ ] Real/fake flag se muestra solo con 3+ marcas
- [ ] Premium desbloquea badges con tier `platinum`
- [ ] RevenueCat sandbox funciona en TestFlight
- [ ] Stats page muestra distribución por tipo en pie chart

---

## DECISIONES CLAVE A TOMAR YA

| Decisión | Mi recomendación | Por qué |
|---|---|---|
| ¿Bucket público o privado? | **Privado + signed URLs** | App Store + privacidad |
| ¿Anon key legacy o nueva? | **Mantén legacy hasta migración oficial** | El SDK aún no soporta bien las nuevas |
| ¿RevenueCat o IAP nativo? | **RevenueCat** | 10k usuarios free, salva semanas |
| ¿TanStack Query o SWR? | **TanStack Query** | Más maduro en RN, mejor caché |
| ¿Dev client o seguir con Expo Go? | **Dev client en Fase 2** | Sin dev client no tienes notificaciones reales en build local |
| ¿GitHub Actions para CI? | **Sí**, al empezar Fase 1 | Type check + lint en cada push |
| ¿Sentry para errors? | **Sí**, en Fase 2 | Sin esto, no sabes qué crashea |
| ¿Posthog/Amplitude? | **Posthog free tier**, en Fase 2 | Funnels, retention cohorts |

---

## QUE NO HACER

1. **No añadir tracking GPS de ejercicio** — entras a competir con Strava y pierdes
2. **No abrir el feed más allá de amigos** — el caos de Instagram no
3. **No permitir editar fotos** — mata la autenticidad
4. **No copiar el botón "BeReal" literal** — diseña tu identidad (cámara con halo naranja)
5. **No saltarte el bucket privado** — App Store te baja
6. **No olvides el botón "Eliminar cuenta"** — App Store te baja
7. **No esperes a Fase 3 para Sentry** — los crashes de Fase 1/2 te ciegan
8. **No metas web** — focus iOS, después Android, y solo cuando esté validado
9. **No metas chat directo en Fase 2** — masivo en moderation cost, postpone a Fase 4 si acaso
10. **No persigas features. Persigue retención.**

---

## MÉTRICAS A SEGUIR

Desde Fase 1:
- **D1 retention** (% que vuelve día 2)
- **D7 retention** (% que vuelve día 7)
- **D30 retention**
- **Daily active users / Monthly active users (DAU/MAU)** — objetivo >40%
- **% usuarios con racha >= 7**
- **Fotos subidas / día / usuario activo** — debería ser 0.7-0.9
- **K-factor** (invitaciones enviadas × tasa de aceptación)

Si DAU/MAU < 30% en Fase 1, no avances a Fase 2 hasta arreglar retención.
