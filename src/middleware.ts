import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(function middleware(req) {
  const { pathname, searchParams } = req.nextUrl;
  const session = req.auth;
  const role = session?.user?.role;

  // Protect /dashboard - require authenticated user
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      const callbackUrl = encodeURIComponent(
        req.nextUrl.pathname +
          (searchParams.toString() ? "?" + searchParams.toString() : "")
      );
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${callbackUrl}`, req.url)
      );
    }
  }

  // Protect /admin - require admin role
  if (pathname.startsWith("/admin")) {
    if (!session) {
      const callbackUrl = encodeURIComponent(req.nextUrl.pathname);
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${callbackUrl}`, req.url)
      );
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/403", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
