// src/app/not-found.tsx - Global 404
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Không tìm thấy trang",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-blue-500 mb-4">404</div>
        <h1 className="text-3xl font-bold text-white mb-3">
          Trang không tồn tại
        </h1>
        <p className="text-slate-400 mb-8">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xoá.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Về trang chủ
          </Link>
          <Link
            href="/deadlines"
            className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Xem deadlines
          </Link>
        </div>
      </div>
    </div>
  );
}

