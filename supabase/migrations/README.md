# Migraciones de Supabase

Ejecuta cada archivo SQL en orden en el **SQL Editor** de Supabase.

| # | Archivo | Estado |
|---|---------|--------|
| 001 | `001_initial.sql` | YA APLICADO (schema base) |
| 002 | `002_profile_extensions.sql` | Aplicar |
| 003 | `003_streaks.sql` | Aplicar |

## Como aplicar una migracion

1. Abre tu proyecto en supabase.com/dashboard
2. SQL Editor → New Query
3. Copia el contenido del archivo
4. Run

Las migraciones estan escritas con `IF NOT EXISTS` y `DO $$ ... EXCEPTION` para que sean **idempotentes** (puedes ejecutarlas varias veces sin error).

## Despues de aplicar 002 y 003

Tu tabla `users` tendra nuevos campos. Para usuarios que ya existian, ejecuta esto para inicializar timezone:

```sql
UPDATE users SET timezone = 'Europe/Madrid' WHERE timezone = 'UTC';
```

Ajusta el timezone si vives en otro sitio (ej. `'America/New_York'`).
