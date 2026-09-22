# TheList — Watchlist privada

Proyecto Next.js para compartir una lista de series/películas privada con invitaciones.

Setup rápido:

1. Crear proyecto en Supabase y ejecutar las migraciones/crear tablas:

```sql
-- invites table
create table invites (
  id bigserial primary key,
  email text not null,
  token text not null,
  used boolean default false,
  created_at timestamptz default now()
);

-- watchlist table
create table watchlist (
  id bigserial primary key,
  title text not null,
  added_at timestamptz default now(),
  added_by uuid
);
```

2. Configurar variables de entorno en Vercel o localmente:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
ADMIN_SECRET=<un-secreto-que-tu-elijas>
```

3. Instalar dependencias y ejecutar localmente:

```bash
npm install
npm run dev
```

Flujo de invitaciones:
- El `admin` usa `/invite` y provee `ADMIN_SECRET` para generar un token para un email.
- El invitado recibe el token y lo verifica en `/accept` usando su email.
- Una vez verificado, el admin/you puede crear el usuario en Supabase Auth o permitir signup.

Despliegue:
- Conectar el repo a Vercel, configurar las variables de entorno, desplegar.
# TheList