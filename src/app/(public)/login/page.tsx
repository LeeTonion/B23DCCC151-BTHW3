// src/app/(public)/login/page.tsx
"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isGitHubPending, setIsGitHubPending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    });
  };

  const handleGitHubSignIn = () => {
    setIsGitHubPending(true);
    signIn("github", { callbackUrl });
  };

  const demoAccounts = [
    {
      email: "admin@ptit.edu.vn",
      password: "admin123",
      role: "Admin (Lớp trưởng)",
      badge: "bg-red-500/20 text-red-400 border-red-500/30",
    },
    {
      email: "sv@ptit.edu.vn",
      password: "sv123456",
      role: "Sinh viên PTIT",
      badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/10 border border-red-500/30 rounded-2xl p-2 mb-4">
            <Image
              src="/ptit-logo.svg"
              alt="PTIT Logo"
              width={48}
              height={48}
              className="rounded-xl"
              priority
            />
          </div>
          <h1 className="text-3xl font-black text-white">Đăng nhập</h1>
          <p className="text-slate-400 mt-1.5 text-sm">
            Class Deadline Hub · Học viện CNBCVT
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          {/* GitHub OAuth Button (Điểm cộng) */}
          <button
            type="button"
            onClick={handleGitHubSignIn}
            disabled={isGitHubPending}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-3 border border-slate-700 hover:border-slate-500 shadow-sm disabled:opacity-60 mb-6"
          >
            {isGitHubPending ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            )}
            <span>Đăng nhập bằng GitHub (OAuth)</span>
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-slate-500 font-medium">
                Hoặc bằng tài khoản trường
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email PTIT
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@ptit.edu.vn"
                className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-500 text-sm"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm rounded-xl p-3 flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 text-sm"
            >
              {isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          {/* Quick-fill Demo accounts */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">
                Tài khoản kiểm thử nhanh (1-click):
              </span>
              <span className="text-[11px] text-slate-500">Bấm để tự điền</span>
            </div>

            <div className="space-y-2.5">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => {
                    setEmail(acc.email);
                    setPassword(acc.password);
                  }}
                  className="w-full text-left bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 rounded-xl p-3 transition-all flex items-center justify-between text-xs group"
                >
                  <div>
                    <span className="font-semibold text-white group-hover:text-red-400 transition-colors">
                      {acc.email}
                    </span>
                    <span className="text-slate-500 block text-[11px] mt-0.5">
                      Mật khẩu: {acc.password}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full border text-[11px] font-medium ${acc.badge}`}
                  >
                    {acc.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          <Link href="/" className="hover:text-white transition-colors">
            ← Quay lại trang chủ
          </Link>
        </p>
      </div>
    </div>
  );
}
