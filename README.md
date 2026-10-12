# Tarea 16 — Autenticación segura con cookies httpOnly (Next.js 16 + Supabase)

Sistema de autenticación completo con Next.js 16 (App Router), TypeScript,
Supabase Auth y `@supabase/ssr`, gestionando la sesión enteramente mediante
cookies **httpOnly**. Incluye registro, inicio de sesión, cierre de sesión, middleware de protección de rutas y un dashboard privado.

## 1. Stack

- Next.js 16 (App Router, Server Actions)
- TypeScript
- Supabase (Authentication)
- `@supabase/ssr` para el manejo de cookies en server/client/middleware
- Zod para validación de formularios en el servidor

## 2. Configuración de Supabase (URL y API Key)

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Ve a **Project Settings → API**. Ahí encontrarás dos valores que necesita
   esta app:
   - **Project URL** → va en `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → va en `NEXT_PUBLIC_SUPABASE_ANON_KEY`

   > La `anon key` es pública por diseño (Supabase la protege con Row Level
   > Security), así que es segura de exponer en el cliente. **Nunca** uses la
   > `service_role key` en esta app: esa sí es secreta y solo debe vivir en
   > backends de confianza — este proyecto no la necesita.

3. En **Authentication → URL Configuration**, agrega:
   - **Site URL**: `http://localhost:3000` (o tu dominio en producción)
   - **Redirect URLs**: `http://localhost:3000/auth/confirm` y la versión con
     tu dominio de producción (ej. `https://tu-app.vercel.app/auth/confirm`)

   Esto es lo que permite que el link de confirmación de correo y el de
   recuperación de contraseña regresen correctamente a la app.

4. Copia `.env.local.example` como `.env.local` y rellena los tres valores:

   ```bash
   cp .env.local.example .env.local
   ```

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY_AQUI
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

5. En producción (Vercel/Netlify), define esas mismas tres variables en el
   panel de variables de entorno del proyecto, cambiando
   `NEXT_PUBLIC_SITE_URL` por la URL real desplegada, y agrega esa misma URL
   a los Redirect URLs de Supabase (paso 3).

## 3. Instalación y uso

```bash
pnpm install   # o npm install / yarn install
pnpm dev       # http://localhost:3000
```

Flujo para probarlo:
1. `/signup` → crea una cuenta (revisa el correo para confirmar).
2. `/auth/confirm` → Supabase te redirige aquí automáticamente al confirmar;
   la app intercambia el `code` por una sesión y te manda a `/dashboard`.
3. `/login` → inicia sesión con la cuenta confirmada.
4. `/dashboard` → ruta privada, solo accesible con sesión activa.
5. Botón **Cerrar sesión** en la barra de navegación.
6. `/forgot-password` → pide el enlace de recuperación; `/reset-password` →
   define la contraseña nueva.

## 4. Cómo se protegen las cookies (XSS / CSRF)

- Las cookies de sesión las crea `@supabase/ssr` con los flags `httpOnly`,
  `secure` (en producción) y `sameSite=lax`. Al ser httpOnly, **no son
  legibles desde JavaScript en el navegador**, lo que evita que un ataque XSS
  robe el token de sesión.
- El atributo `sameSite=lax` evita que la cookie se envíe en requests
  cross-site iniciados por otros sitios, mitigando CSRF.
- El token de sesión **nunca** se guarda en `localStorage` ni se maneja
  manualmente: todo pasa por los tres clientes de Supabase separados
  (`src/lib/supabase/client.ts`, `server.ts`, `middleware.ts`).
- Las Server Actions (`src/app/auth/actions.ts`) validan los datos en el
  servidor con Zod antes de llamar a Supabase, y devuelven mensajes de error
  genéricos (por ejemplo "Correo o contraseña incorrectos" en vez de decir
  cuál de los dos falló) para no facilitar ataques de enumeración de
  usuarios.

## 5. Estructura del proyecto

```
src/
  proxy.ts                     # Middleware (Next.js 16 renombró middleware.ts -> proxy.ts)
  lib/supabase/
    client.ts                  # Cliente para Client Components
    server.ts                  # Cliente para Server Components / Server Actions
    middleware.ts              # Cliente + lógica de protección usada por proxy.ts
  app/
    layout.tsx / globals.css   # Layout raíz y estilos (paleta pastel)
    page.tsx                   # Landing con nav condicional
    login/page.tsx
    signup/page.tsx
    forgot-password/page.tsx
    reset-password/page.tsx
    auth/
      actions.ts               # Server Actions: signUp, signIn, signOut, forgotPassword, resetPassword
      confirm/route.ts         # Route Handler que intercambia el code por sesión
    dashboard/
      layout.tsx               # Verifica sesión server-side (defensa en profundidad)
      page.tsx                 # Datos del usuario autenticado
components/
  Navbar.tsx                   # Nav condicional según estado de auth
```

## 6. Pasos seguidos para construirlo

1. **Proyecto Supabase**: creado el proyecto, copiadas `Project URL` y
   `anon key`, y configuradas las Redirect URLs de autenticación.
2. **Scaffold Next.js 16** con TypeScript y App Router; instalación de
   `@supabase/ssr`, `@supabase/supabase-js` y `zod`.
3. **Tres clientes de Supabase separados** (`client.ts`, `server.ts`,
   `middleware.ts`), cada uno con la estrategia de cookies correcta para su
   contexto de ejecución (browser, Server Components/Actions, o
   middleware/proxy).
4. **`proxy.ts`** (equivalente a `middleware.ts` en Next 16): revalida la
   sesión en cada request con `getUser()` (no `getSession()`, porque
   `getUser()` sí valida el token contra Supabase), redirige a `/login` si no
   hay sesión en una ruta privada, y a `/dashboard` si un usuario autenticado
   visita `/login` o `/signup`.
5. **Server Actions** (`signUp`, `signIn`, `signOut`, `forgotPassword`,
   `resetPassword`) con validación Zod en el servidor y mensajes de error
   genéricos.
6. **Route Handler `/auth/confirm`**: intercambia el `code` que Supabase
   agrega a la URL (tras confirmar correo o pedir recuperación) por una
   sesión real, usando `exchangeCodeForSession`.
7. **Páginas de UI**: `/login`, `/signup`, `/forgot-password`,
   `/reset-password`, usando `useActionState` de React 19 para mostrar
   estados de carga y error sin JavaScript adicional.
8. **Dashboard protegido**: layout que revisa la sesión en el servidor
   (segunda capa de defensa además del proxy) y página que muestra los datos
   del usuario autenticado.
9. **Navbar condicional**: Server Component que consulta la sesión y muestra
   "Iniciar sesión / Crear cuenta" o "Dashboard / Cerrar sesión" según
   corresponda.
10. **Estilos**: paleta pastel morado / rosa / verde en `globals.css`
    (tokens de color como variables CSS, tipografías Outfit + Inter),
    pantalla de auth con layout split-screen (panel de marca + formulario) y
    dashboard con tarjetas de información.

## 7. Despliegue

1. Sube el repo a GitHub.
2. Impórtalo en Vercel (o Netlify).
3. Define las tres variables de entorno (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` con la URL de
   producción).
4. Agrega la URL de producción + `/auth/confirm` a los Redirect URLs de
   Supabase (paso 3 de la sección 2).
5. Despliega y prueba el flujo completo en producción.
