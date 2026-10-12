import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const fullName = (user?.user_metadata?.full_name as string) || "Sin nombre";
  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("es-SV", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  return (
    <main className="dashboard-main">
      <div className="dashboard-hero">
        <h1>Hola, {fullName.split(" ")[0]}</h1>
        <p>
          <span className="dot-green" />
          Sesion activa protegida con cookies httpOnly
        </p>
      </div>

      <div className="card-grid">
        <div className="info-card">
          <div className="info-card-label">Nombre completo</div>
          <div className="info-card-value">{fullName}</div>
        </div>
        <div className="info-card">
          <div className="info-card-label">Correo</div>
          <div className="info-card-value">{user?.email}</div>
        </div>
        <div className="info-card">
          <div className="info-card-label">Correo confirmado</div>
          <div className="info-card-value">
            {user?.email_confirmed_at ? "Si" : "Pendiente"}
          </div>
        </div>
        <div className="info-card">
          <div className="info-card-label">Cuenta creada</div>
          <div className="info-card-value">{createdAt}</div>
        </div>
        <div className="info-card">
          <div className="info-card-label">ID de usuario</div>
          <div className="info-card-value" style={{ fontSize: "0.8rem" }}>
            {user?.id}
          </div>
        </div>
      </div>
    </main>
  );
}
