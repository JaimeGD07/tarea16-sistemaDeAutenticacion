import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tarea 16 · Auth segura con Supabase",
  description:
    "Autenticacion con cookies httpOnly, Next.js 16 App Router y Supabase.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
