import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-mark">
        Tarea16 · Auth
      </Link>
      <div className="navbar-links">
        {user ? (
          <>
            <Link href="/dashboard" className="pill pill-purple">
              Dashboard
            </Link>
            <form action={signOut}>
              <button type="submit" className="btn-secondary" style={{ width: "auto", padding: "8px 16px" }}>
                Cerrar sesion
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login">Iniciar sesion</Link>
            <Link href="/signup" className="pill pill-purple">
              Crear cuenta
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
