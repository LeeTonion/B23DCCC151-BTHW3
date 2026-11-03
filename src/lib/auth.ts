import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import type { Provider } from "next-auth/providers";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { getUserByEmail } from "./data";
import type { Role } from "./types";

const providers: Provider[] = [
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Mật khẩu", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      const user = getUserByEmail(credentials.email as string);
      if (!user) return null;

      const isValid = await bcrypt.compare(
        credentials.password as string,
        user.password
      );
      if (!isValid) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as Role,
        studentId: user.studentId,
      };
    },
  }),
  GitHub({
    clientId: process.env.GITHUB_ID || "Ov23lieUr5By07e6W0er",
    clientSecret:
      process.env.GITHUB_SECRET || "e9bb8e63e73853b4a42aa52172931ef2ecd62787",
  }),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "ptit-deadline-hub-super-secret-key-2026",
  providers,
});
