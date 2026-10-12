"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp, type ActionState } from "@/app/auth/actions";

const initialState: ActionState = {};

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <div className="auth-shell">
      <section className="auth-brand">
        <span className="auth-brand-mark">Tarea16 · Auth</span>
        <div className="auth-brand-copy">
          <h1>Crea tu cuenta en un minuto.</h1>
          <p>
            Validamos tus datos en el servidor y confirmamos tu correo antes
            de dejarte entrar, para mantener la cuenta protegida desde el
            primer dia.
          </p>
        </div>
      </section>

      <section className="auth-form-side">
        <div className="auth-card">
          <p className="auth-card-eyebrow">Primera vez aqui</p>
          <h2>Crea tu cuenta</h2>
          <p className="auth-card-sub">
            Completa tus datos. Te enviaremos un correo de confirmacion.
          </p>

          {state?.error && <div className="alert alert-error">{state.error}</div>}
          {state?.success && (
            <div className="alert alert-success">{state.success}</div>
          )}

          <form action={formAction}>
            <div className="field">
              <label htmlFor="fullName">Nombre completo</label>
              <input id="fullName" name="fullName" type="text" autoComplete="name" required />
            </div>
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
                autoComplete="new-password"
                required
              />
              <p className="field-hint">
                Minimo 8 caracteres, con una mayuscula y un numero.
              </p>
            </div>
            <button className="btn-primary" type="submit" disabled={pending}>
              {pending ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <div className="auth-links">
            <span>Ya tienes cuenta?</span>
            <Link href="/login">Inicia sesion</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
