"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionState = {
  error?: string;
  success?: string;
};

// --- Esquemas de validacion en servidor (nunca confiar solo en el cliente) ---

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Ingresa tu nombre completo."),
  email: z.string().trim().email("Correo invalido."),
  password: z
    .string()
    .min(8, "La contrasena debe tener al menos 8 caracteres.")
    .regex(/[A-Z]/, "Debe incluir al menos una mayuscula.")
    .regex(/[0-9]/, "Debe incluir al menos un numero."),
});

const signInSchema = z.object({
  email: z.string().trim().email("Correo invalido."),
  password: z.string().min(1, "Ingresa tu contrasena."),
});

const emailSchema = z.object({
  email: z.string().trim().email("Correo invalido."),
});

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "La contrasena debe tener al menos 8 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contrasenas no coinciden.",
    path: ["confirmPassword"],
  });

// --- Server Actions ---

export async function signUp(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = signUpSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { fullName, email, password } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  });

  if (error) {
    // Mensaje generico: no revelamos si el correo ya existe (anti-enumeracion)
    return {
      error: "No se pudo completar el registro. Intenta de nuevo mas tarde.",
    };
  }

  return {
    success:
      "Cuenta creada Satisfactoriamente.",
  };
}

export async function signIn(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    // Mensaje generico y consistente tanto si el correo no existe
    // como si la contrasena es incorrecta.
    return { error: "Correo o contrasena incorrectos." };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function forgotPassword(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = emailSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm?next=/reset-password`,
  });

  // Siempre respondemos con el mismo mensaje exista o no la cuenta,
  // para no filtrar que correos estan registrados.
  return {
    success:
      "Si el correo esta registrado, te enviamos un enlace para restablecer tu contrasena.",
  };
}

export async function resetPassword(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: "No se pudo actualizar la contrasena. El enlace pudo haber expirado." };
  }

  redirect("/dashboard");
}
