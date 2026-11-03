// src/app/(public)/403/page.tsx
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "403 - Không có quyền truy cập",
  robots: { index: false },
};

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-red-500 mb-4">403</div>
        <h1 className="text-3xl font-bold text-white mb-3">
          Không có quyền truy cập
        </h1>
        <p className="text-slate-400 mb-8">
          Bạn không có quyền truy cập trang này. Trang này chỉ dành cho admin.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/"
            className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

