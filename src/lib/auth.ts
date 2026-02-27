import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import type { NextRequest } from "next/server";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!passwordMatch) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          wardId: user.wardId,
        };
      },
    }),
  ],
  callbacks: {
    async authorized({ auth, request }: { auth: { user?: { role?: string } } | null; request: NextRequest }) {
      const { pathname } = request.nextUrl;

      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user?.role === "ADMIN";

      // Protect /individual/* routes — must be logged in
      if (pathname.startsWith("/individual")) {
        if (!isLoggedIn) return false; // redirects to signIn page
        return true;
      }

      // Protect /admin/* routes — must be admin
      if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) return false;
        if (!isAdmin) {
          return Response.redirect(new URL("/individual/dashboard", request.nextUrl));
        }
        return true;
      }

      // Redirect logged-in users away from /login and /register
      if (pathname === "/login" || pathname === "/register") {
        if (isLoggedIn) {
          const dest = isAdmin ? "/admin/dashboard" : "/individual/dashboard";
          return Response.redirect(new URL(dest, request.nextUrl));
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
        token.wardId = (user as { wardId?: string | null }).wardId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role: string }).role = token.role as string;
        (session.user as { wardId?: string | null }).wardId =
          token.wardId as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
