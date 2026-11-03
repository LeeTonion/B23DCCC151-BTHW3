"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/deadlines", label: "Deadlines" },
  { href: "/subjects/lap-trinh-web", label: "Môn học" },
];

const roleLabels: Record<string, { label: string; color: string }> = {
  admin: { label: "Lớp trưởng", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  user: { label: "Sinh viên", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  guest: { label: "Khách", color: "bg-slate-500/20 text-slate-400 border-slate-500/30" },
};

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const role = session?.user?.role || "guest";
  const roleInfo = roleLabels[role] || roleLabels.guest;

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/ptit-logo.svg"
              alt="PTIT Logo"
              width={34}
              height={34}
              className="rounded-lg shadow-sm group-hover:scale-105 transition-transform"
              priority
            />
            <span className="font-bold text-white group-hover:text-blue-400 transition-colors hidden sm:block">
              Deadline Hub
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {session?.user?.role === "admin" && (
              <Link
                href="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === "/admin"
                    ? "bg-red-600 text-white"
                    : "text-red-400 hover:text-white hover:bg-red-900/50"
                }`}
              >
                ⚙️ Admin
              </Link>
            )}
            {session && (
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith("/dashboard")
                    ? "bg-emerald-600 text-white"
                    : "text-emerald-400 hover:text-white hover:bg-emerald-900/50"
                }`}
              >
                📊 Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {session?.user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-medium text-white">
                    {session.user.name}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${roleInfo.color}`}
                  >
                    {roleInfo.label}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

