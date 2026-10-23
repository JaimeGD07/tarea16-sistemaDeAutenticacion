import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente de Supabase para Server Components, Server Actions y Route Handlers.
 *
 * Usa el store de cookies de Next.js para leer y escribir la sesion.
 * Las cookies de sesion las gestiona @supabase/ssr con los flags
 * httpOnly, secure y sameSite ya aplicados por Supabase (ver README,
 * seccion "Como se protegen las cookies").
 *
 * `set` puede fallar cuando se llama desde un Server Component puro
 * (Next.js no permite escribir cookies fuera de Server Actions o Route
 * Handlers). Se ignora ese error a proposito: el proxy (middleware) se
 * encarga de refrescar la sesion en cada request, asi que este caso no
 * rompe la autenticacion.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Llamado desde un Server Component: el proxy refresca la sesión.
          }
        },
      },
    }
  );
}
