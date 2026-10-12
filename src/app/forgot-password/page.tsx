"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPassword, type ActionState } from "@/app/auth/actions";

const initialState: ActionState = {};

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(forgotPassword, initialState);

  return (
    <div className="auth-shell">
      <section className="auth-brand">
        <span className="auth-brand-mark">Tarea16 · Auth</span>
        <div className="auth-brand-copy">
          <h1>Pasa, te ayudamos a recuperarla.</h1>
          <p>
            Te enviaremos un enlace de un solo uso a tu correo para que
            elijas una contrasena nueva.
          </p>
        </div>
      </section>

      <section className="auth-form-side">
        <div className="auth-card">
          <p className="auth-card-eyebrow">Recuperar acceso</p>
          <h2>Olvide mi contrasena</h2>
          <p className="auth-card-sub">
            Escribe el correo con el que te registraste.
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
            <button className="btn-primary" type="submit" disabled={pending}>
              {pending ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>

          <div className="auth-links">
            <Link href="/login">Volver a iniciar sesion</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
