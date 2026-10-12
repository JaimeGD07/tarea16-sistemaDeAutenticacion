"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type ActionState } from "@/app/auth/actions";

const initialState: ActionState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <div className="auth-shell">
      <section className="auth-brand">
        <span className="auth-brand-mark">Tarea16 · Auth</span>
        <div className="auth-brand-copy">
          <h1>Que bueno verte de nuevo.</h1>
          <p>
            Tu sesion se guarda en una cookie httpOnly: nunca queda expuesta
            a JavaScript en el navegador.
          </p>
        </div>
      </section>

      <section className="auth-form-side">
        <div className="auth-card">
          <p className="auth-card-eyebrow">Bienvenido</p>
          <h2>Inicia sesion</h2>
          <p className="auth-card-sub">
            Ingresa tus credenciales para continuar a tu dashboard.
          </p>

          {state?.error && <div className="alert alert-error">{state.error}</div>}
          {state?.success && (
            <div className="alert alert-success">{state.success}</div>
          )}

          <form action={formAction}>
            <div className="field">
              <label htmlFor="email">Correo electronico</label>
              <input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="field">
              <label htmlFor="password">Contrasena</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            <button className="btn-primary" type="submit" disabled={pending}>
              {pending ? "Entrando..." : "Iniciar sesion"}
            </button>
          </form>

          <div className="auth-links">
            <Link href="/forgot-password">Olvide mi contrasena</Link>
            <Link href="/signup">Crear una cuenta</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
