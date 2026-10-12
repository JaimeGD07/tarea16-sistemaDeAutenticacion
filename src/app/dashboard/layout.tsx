import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Segunda capa de proteccion ademas del proxy (defensa en profundidad):
  // si por algun motivo se renderiza sin sesion, no se muestra el contenido.
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="dashboard-shell">
      <Navbar />
      {children}
    </div>
  );
}
