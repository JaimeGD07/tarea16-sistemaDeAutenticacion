import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16 renombro middleware.ts a proxy.ts y lo corre en runtime
// Node.js (antes Edge). La firma y el comportamiento son los mismos.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Corre en todas las rutas excepto archivos estaticos y de imagen,
     * para no gastar ciclos revalidando la sesion en assets.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
