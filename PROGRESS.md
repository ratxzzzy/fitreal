# FitReal - Progreso del Proyecto

## Que es FitReal
App estilo BeReal pero para fitness. Foto diaria de tu entrenamiento, sin galeria, sin filtros. Feed de amigos con contador de dias y reacciones.

## Stack Tecnologico
- **Frontend:** React Native + Expo (SDK 54) + TypeScript
- **Routing:** expo-router (file-based)
- **Backend:** Supabase (Auth + PostgreSQL + Storage)
- **Camara:** expo-camera (CameraView)
- **Ubicacion:** expo-location (opcional)
- **Notificaciones:** expo-notifications (pendiente)

## Estructura del Proyecto

```
fitreal/
├── app/
│   ├── _layout.tsx          # Layout raiz con AuthProvider + redirecciones
│   ├── index.tsx             # Redirige a login
│   ├── (auth)/
│   │   ├── _layout.tsx       # Stack navigator para auth
│   │   ├── login.tsx         # Pantalla de login (email + password)
│   │   └── register.tsx      # Pantalla de registro (username + email + password)
│   └── (tabs)/
│       ├── _layout.tsx       # Tab navigator (Feed, Foto, Perfil)
│       ├── feed.tsx          # Feed de amigos con fotos y reacciones
│       ├── camera.tsx        # Camara + preview + subida a Supabase
│       └── profile.tsx       # Perfil, stats, amigos, solicitudes
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx   # Contexto de autenticacion (signUp, signIn, signOut)
│   └── lib/
│       ├── supabase.ts       # Cliente Supabase con AsyncStorage
│       └── database.types.ts # Tipos TypeScript para las tablas
├── supabase-schema.sql       # Schema SQL completo para Supabase
├── app.json                  # Configuracion Expo (SDK 54, permisos iOS)
├── package.json              # Dependencias (SDK 54 compatible)
├── tsconfig.json             # Config TypeScript
├── .env.example              # Template para credenciales Supabase
└── .gitignore                # Ignora node_modules, .env, etc.
```

## Base de Datos (Supabase)

### Tablas
- **users** - id, username, email, notification_window, created_at
- **daily_entries** - id, user_id, photo_url, captured_at, date, gps_lat, gps_lng (UNIQUE user_id+date)
- **friendships** - user_id_a, user_id_b, status (pending/accepted), created_at
- **reactions** - id, entry_id, user_id, emoji, created_at

### Row Level Security (RLS)
- Todas las tablas tienen RLS activado
- Usuarios solo pueden insertar/editar sus propios datos
- Usuarios pueden ver entries de amigos aceptados
- Reacciones visibles para todos los autenticados

### Storage
- Bucket: `daily-photos` (publico)
- Politicas: upload para autenticados, lectura publica

## Funcionalidades Implementadas

### Auth
- [x] Login con email y password
- [x] Registro con username, email y password
- [x] Logout con confirmacion
- [x] Sesion persistente con AsyncStorage
- [x] Redireccion automatica segun estado de auth

### Camara
- [x] Permiso de camara con pantalla explicativa
- [x] Vista de camara a pantalla completa
- [x] Cambio camara frontal/trasera
- [x] Captura de foto
- [x] Preview con opciones Repetir / Subir
- [x] Subida a Supabase Storage
- [x] Insercion en daily_entries con fecha y GPS
- [x] Control de duplicados (max 1 foto por dia)
- [x] Estado "Hecho por hoy" despues de subir

### Feed
- [x] Lista de fotos de amigos del dia
- [x] Badge con contador de dias consecutivos
- [x] Reacciones con emojis (musculo, fuego, trofeo, aplauso, rayo)
- [x] Pull-to-refresh
- [x] Estado vacio cuando no hay entries

### Perfil
- [x] Avatar con inicial del username
- [x] Stats: dias este ano, numero de amigos
- [x] Solicitudes de amistad pendientes con boton Aceptar
- [x] Buscar y agregar amigos por username
- [x] Lista de amigos ordenada por dias de actividad
- [x] Boton de logout

## Diseno
- Tema oscuro (fondo #000)
- Color accent naranja (#FF6B35)
- Solo orientacion portrait
- Solo iOS (sin tablet)

## Problemas Resueltos

### 1. Expo Go incompatible (SDK 56 vs Expo Go 54.0.2)
- **Problema:** El proyecto se creo con SDK 56 pero el usuario tenia Expo Go 54.0.2
- **Solucion:** Downgrade completo a SDK 54 (expo ~54.0.0, react 19.1.0, RN 0.81.5, etc.)

### 2. TypeScript no compilaba (module: "preserve")
- **Problema:** expo/tsconfig.base usa `module: "preserve"` que requiere TS 5.5+
- **Solucion:** Actualizar typescript de ~5.3.3 a ~5.8.0

### 3. Plugin expo-status-bar no existe en SDK 54
- **Problema:** `PluginError: Unable to resolve a valid config plugin for expo-status-bar`
- **Solucion:** Eliminar expo-status-bar de la lista de plugins en app.json

### 4. Supabase URL invalida
- **Problema:** El .env tenia `hhttps://` (doble h) y la API key era del nuevo formato
- **Solucion:** Corregir URL y usar la Legacy anon key (formato eyJ...)

### 5. RLS bloquea insercion de perfil en registro
- **Problema:** `new row violates row-level security policy` al registrarse
- **Solucion:** Pasar id explicitamente en el insert de users (AuthContext.tsx)

### 6. Storage sin politicas de subida
- **Problema:** `new row violates row-level security policy` al subir foto
- **Solucion:** Crear politicas en storage.objects para bucket daily-photos

### 7. Foreign key violated en daily_entries
- **Problema:** El perfil no se creo en la tabla users (por el error #5 previo)
- **Solucion:** Insertar perfil manualmente via SQL

## Configuracion de Supabase Necesaria

1. Crear proyecto en supabase.com
2. Ejecutar supabase-schema.sql en SQL Editor
3. Crear bucket "daily-photos" (publico) en Storage
4. Crear politicas de Storage (upload, read, update)
5. Desactivar "Confirm email" en Authentication > Providers > Email
6. Copiar Project URL y Legacy anon key al archivo .env

## Pendiente
- [ ] Push notifications (recordatorio diario)
- [ ] Onboarding screens
- [ ] Despliegue en App Store
- [ ] Mejoras de UI/UX
