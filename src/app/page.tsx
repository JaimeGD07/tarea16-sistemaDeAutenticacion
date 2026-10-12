import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="dashboard-shell">
      <Navbar />
      <main className="dashboard-main">
        <div className="dashboard-hero">
          <h1>Autenticacion segura con cookies httpOnly</h1>
          <p>
            Next.js 16 (App Router) + Supabase + @supabase/ssr. Registro,
            inicio de sesion y rutas protegidas
            con middleware.
          </p>
        </div>
        <div className="card-grid">
          <div className="info-card">
            <div className="info-card-label">Sesion</div>
            <div className="info-card-value">Cookies httpOnly + secure</div>
          </div>
          <div className="info-card">
            <div className="info-card-label">Proteccion</div>
            <div className="info-card-value">XSS y CSRF cubiertos</div>
          </div>
          <div className="info-card">
            <div className="info-card-label">Rutas privadas</div>
            <div className="info-card-value">/dashboard vía proxy</div>
          </div>
        </div>
      </main>
    </div>
  );
}
