"use client";

import { useActionState } from "react";
import { resetPassword, type ActionState } from "@/app/auth/actions";

const initialState: ActionState = {};

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(resetPassword, initialState);

  return (
    <div className="auth-shell">
      <section className="auth-brand">
        <span className="auth-brand-mark">Tarea16 · Auth</span>
        <div className="auth-brand-copy">
          <h1>Ultimo paso.</h1>
          <p>Elige una contrasena nueva para tu cuenta.</p>
        </div>
      </section>

      <section className="auth-form-side">
        <div className="auth-card">
          <p className="auth-card-eyebrow">Nueva contrasena</p>
          <h2>Restablecer contrasena</h2>
          <p className="auth-card-sub">
            Este enlace es de un solo uso y caduca por seguridad.
          </p>

          {state?.error && <div className="alert alert-error">{state.error}</div>}

          <form action={formAction}>
            <div className="field">
              <label htmlFor="password">Nueva contrasena</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="confirmPassword">Confirmar contrasena</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
              />
            </div>
            <button className="btn-primary" type="submit" disabled={pending}>
              {pending ? "Guardando..." : "Guardar contrasena"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
