import Link from "next/link";

export default function DeadlineNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <div className="text-7xl mb-6">🔍</div>
      <h1 className="text-4xl font-black text-white mb-3">
        Deadline không tồn tại
      </h1>
      <p className="text-slate-400 mb-8 max-w-md mx-auto">
        Deadline bạn đang tìm không tồn tại hoặc đã bị xoá bởi admin.
      </p>
      <div className="flex gap-3 justify-center">
        <Link
          href="/deadlines"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Xem tất cả deadline
        </Link>
        <Link
          href="/"
          className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Trang chủ
        </Link>
      </div>
    </div>
  );
}

