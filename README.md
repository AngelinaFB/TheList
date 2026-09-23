# TheList — Watchlist privada

Proyecto Next.js para compartir listas de series y películas con invitación privada.

## Qué hace esta versión

- Solo puede entrar quien tenga una invitación válida.
- El usuario se registra con email + contraseña.
- Cada usuario tiene una watchlist propia.
- Desde la home se puede entrar a la watchlist de otro usuario.
- Si es tu propia watchlist, puedes añadir y quitar títulos.
- Si es la watchlist de otra persona, puedes dejar comentarios sobre un item concreto.

## 1) Crear el proyecto en Supabase

Crea un proyecto en Supabase y luego ejecuta el SQL de [supabase.sql](supabase.sql).

Importante:
- En Supabase > Authentication > Settings, activa magic links o OTP por email si quieres entrar sin contraseña.
- Para la prueba rápida puedes dejarlo con confirmación por email o con flujo seguro por enlace.

## 2) Variables de entorno

Crea un archivo .env.local con esto:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
ADMIN_SECRET=pon-un-secreto-fuerte
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 3) Instalar

```bash
npm install
npm run dev
```

## 4) Flujo final que te recomiendo

1. Abre `/invite`.
2. Genera una invitación para un email.
3. Abre `/signup`.
4. Introduce el email, nombre de usuario y token.
5. La app crea el usuario con una contraseña aleatoria interna y te lleva a `/login`.
6. En `/login` introduces el correo y recibes un código o enlace por email.
7. Cuando lo verificas, la sesión queda persistente.
8. Si borra cookies, volverá a pedirte acceso por email.
9. Si la sesión continua activa, entra automáticamente a la home.

## 5) Qué hace cada pieza

- `/invite`: crea un token para invitar a un correo.
- `/signup`: verifica la invitación, crea la cuenta y guarda el username.
- `/login`: manda el acceso por correo y valida el código.
- `/`: si hay sesión activa, entra directo; si no, redirige a login.

## 6) Admin

`/invite` usa `ADMIN_SECRET` para generar tokens de invitación.

Más adelante puedes crear un panel superadmin para cambiar el username del usuario y gestionar invitaciones.

## 7) Despliegue

- Conecta el repo a Vercel.
- Añade las variables de entorno.
- Haz deploy.

---

## Estructura actual

- [pages/index.js](pages/index.js): home con login/registro y listado de usuarios.
- [pages/watchlist.js](pages/watchlist.js): watchlist propia o ajena.
- [pages/login.js](pages/login.js): acceso por correo con código o enlace.
- [pages/signup.js](pages/signup.js): registro con token de invitación.
- [pages/invite.js](pages/invite.js): creación de invitación por admin.
- [supabase.sql](supabase.sql): tablas y políticas de seguridad.
