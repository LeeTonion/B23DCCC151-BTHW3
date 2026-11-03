import type { NextAuthConfig } from "next-auth";
import type { Role } from "./types";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role =
          (user as { role?: Role }).role ||
          (user.email === "admin@ptit.edu.vn" ? "admin" : "user");
        token.studentId =
          (user as { studentId?: string }).studentId || "B21DCCN_OAUTH";
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.studentId = token.studentId as string;
      }
      return session;
    },
  },
  providers: [],
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only",
};

