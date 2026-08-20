import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { UserRole } from "@/types/next-auth";

/**
 * Cuentas demo para presentar el prototipo sin backend.
 * El demo usa sesiones JWT y no requiere OAuth externo.
 */
const DEMO_USERS: Record<
  UserRole,
  { id: string; name: string; email: string; role: UserRole; image: string }
> = {
  agricultor: {
    id: "f1", // coincide con el agricultor mock Juan Pérez
    name: "Juan Pérez",
    email: "juan@agroconecta.pe",
    role: "agricultor",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  comprador: {
    id: "c1",
    name: "María López",
    email: "maria@agroconecta.pe",
    role: "comprador",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  // Necesario fuera de `next dev` para que Auth.js confíe en el host de la petición
  trustHost: true,
  providers: [
    Credentials({
      id: "demo",
      name: "Cuenta demo",
      credentials: {
        email: { label: "Email", type: "text" },
        name: { label: "Nombre", type: "text" },
        role: { label: "Rol", type: "text" },
      },
      // Demo: cualquier correo/contraseña funciona. Si el correo coincide con
      // una cuenta demo se usa su perfil; si no, se crea una sesión temporal.
      authorize: async (credentials) => {
        const role: UserRole =
          credentials?.role === "agricultor" ? "agricultor" : "comprador";
        const email =
          typeof credentials?.email === "string" && credentials.email.trim()
            ? credentials.email.trim().toLowerCase()
            : null;

        if (!email) return DEMO_USERS[role];

        const known = Object.values(DEMO_USERS).find((u) => u.email === email);
        if (known) return known;

        return {
          id: `u-${email}`,
          name:
            (typeof credentials?.name === "string" &&
              credentials.name.trim()) ||
            email.split("@")[0],
          email,
          role,
          image: null,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: UserRole }).role ?? "comprador";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role =
          (token.role as UserRole | undefined) ?? "comprador";
        if (token.sub) session.user.id = token.sub;
      }
      return session;
    },
  },
});
