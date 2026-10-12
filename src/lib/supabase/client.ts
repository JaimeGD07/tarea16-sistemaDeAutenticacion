"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente de Supabase para usar dentro de Client Components ("use client").
 * Este cliente lee/escribe la sesion a traves de cookies del navegador,
 * nunca guarda el token en localStorage.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
