import { getDeadlines, getSubjects } from "@/lib/data";
import DeadlineCard from "@/components/DeadlineCard";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Class Deadline Hub - Cổng Deadline Lớp Học PTIT",
  description:
    "Cổng thông tin theo dõi và quản lý deadline các môn học chính khóa của lớp - Học viện Công nghệ Bưu chính Viễn thông (PTIT).",
  openGraph: {
    title: "Class Deadline Hub - Cổng Deadline Lớp Học PTIT",
    description: "Cổng thông tin deadline lớp học PTIT",
    images: ["/api/og?title=Class+Deadline+Hub+PTIT&subject=PTIT"],
  },
};

export default function HomePage() {
  const deadlines = getDeadlines();
  const subjects = getSubjects();

  const now = new Date();
  const upcomingDeadlines = deadlines
    .filter((d) => new Date(d.dueDate) >= now)
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

  const urgentCount = upcomingDeadlines.filter((d) => {
    const diff =
      (new Date(d.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 3;
  }).length;

  const overdueCount = deadlines.filter(
    (d) => new Date(d.dueDate) < now
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 border border-red-500/30 p-8 sm:p-12 mb-10 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2.5 bg-red-500/20 border border-red-500/40 rounded-full px-4 py-1.5 text-red-300 text-xs sm:text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            Học viện Công nghệ Bưu chính Viễn thông · Lớp D21CQCN01-B
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Class Deadline <span className="text-red-500">Hub</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
            Cổng thông tin deadline tập trung của lớp. Tra cứu hạn nộp công khai,
            theo dõi lịch nộp bài tập lớn, thi giữa kỳ và đồ án của các môn học kỳ
            này.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/deadlines"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3.5 rounded-xl text-sm sm:text-base transition-all shadow-lg shadow-red-600/30 hover:shadow-red-600/50 flex items-center gap-2"
            >
              📋 Xem toàn bộ 12 deadline →
            </Link>
            <Link
              href="/login"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-6 py-3.5 rounded-xl text-sm sm:text-base transition-all flex items-center gap-2"
            >
              🔑 Đăng nhập sinh viên / Lớp trưởng
            </Link>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none select-none hidden lg:block">
          <div className="w-96 h-96 rounded-full bg-red-600 blur-3xl" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-sm mb-2">
            <span>Tổng bài tập/thi</span>
            <span className="text-xl">📋</span>
          </div>
          <div className="text-3xl font-black text-white">{deadlines.length}</div>
          <div className="text-xs text-slate-500 mt-1">Đang được theo dõi</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-sm mb-2">
            <span>Gấp trong 3 ngày</span>
            <span className="text-xl">🔥</span>
          </div>
          <div className="text-3xl font-black text-red-400">{urgentCount}</div>
          <div className="text-xs text-red-400/80 mt-1">Cần nộp ngay</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-sm mb-2">
            <span>Sắp đến hạn</span>
            <span className="text-xl">⏳</span>
          </div>
          <div className="text-3xl font-black text-yellow-400">
            {upcomingDeadlines.length}
          </div>
          <div className="text-xs text-yellow-400/80 mt-1">Chưa hết hạn</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-sm mb-2">
            <span>Môn học theo dõi</span>
            <span className="text-xl">📚</span>
          </div>
          <div className="text-3xl font-black text-emerald-400">
            {subjects.length}
          </div>
          <div className="text-xs text-emerald-400/80 mt-1">Kỳ 1 năm học 2026</div>
        </div>
      </div>

      <section className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              📚 Môn học kỳ này
            </h2>
            <p className="text-slate-400 text-sm">
              Nhấp vào môn học để xem các đầu việc và bài kiểm tra chi tiết
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {subjects.map((subject) => {
            const subjectDeadlines = deadlines.filter(
              (d) => d.subjectSlug === subject.slug
            );
            return (
              <Link
                key={subject.id}
                href={`/subjects/${subject.slug}`}
                className="group bg-slate-900/90 border border-slate-800 hover:border-slate-600 rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl p-3 bg-slate-800/80 rounded-xl group-hover:scale-110 transition-transform">
                      {subject.icon}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {subject.code}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-white group-hover:text-red-400 transition-colors mb-1.5">
                    {subject.name}
                  </h3>
                  <p className="text-slate-500 text-xs mb-3 font-medium">
                    👨‍🏫 {subject.instructor}
                  </p>
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {subject.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>{subjectDeadlines.length} deadline</span>
                  <span className="text-red-400 group-hover:translate-x-1 transition-transform">
                    Chi tiết môn →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              ⚡ Deadline quan trọng sắp đến hạn
            </h2>
            <p className="text-slate-400 text-sm">
              Được tự động sắp xếp theo thứ tự hạn nộp gần nhất
            </p>
          </div>
          <Link
            href="/deadlines"
            className="text-red-400 hover:text-red-300 text-sm font-semibold transition-colors hidden sm:block"
          >
            Xem tất cả {deadlines.length} bài nộp →
          </Link>
        </div>

        <div className="grid gap-4">
          {upcomingDeadlines.slice(0, 4).map((deadline) => (
            <DeadlineCard key={deadline.id} deadline={deadline} />
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/deadlines"
            className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm"
          >
            Xem tất cả {deadlines.length} bài nộp →
          </Link>
        </div>
      </section>

      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10">
        <h2 className="text-xl font-bold text-white mb-6 text-center">
          📌 Hướng dẫn sử dụng cổng Deadline của lớp
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-800">
            <div className="text-2xl mb-2">🌐</div>
            <h3 className="font-bold text-white mb-2">1. Xem công khai</h3>
            <p className="text-slate-400 leading-relaxed">
              Mọi thành viên và khách đều có thể xem danh sách deadline, môn học,
              và chia sẻ link có ảnh preview tự động cho Google / Facebook / Zalo.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-800">
            <div className="text-2xl mb-2">✅</div>
            <h3 className="font-bold text-white mb-2">2. Sinh viên đăng nhập</h3>
            <p className="text-slate-400 leading-relaxed">
              Đăng nhập tài khoản sinh viên (<code className="text-blue-400">sv@ptit.edu.vn</code>) để đánh dấu bài đã làm xong và theo dõi tiến độ cá nhân tại Dashboard.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-800">
            <div className="text-2xl mb-2">⚙️</div>
            <h3 className="font-bold text-white mb-2">3. Lớp trưởng quản trị</h3>
            <p className="text-slate-400 leading-relaxed">
              Đăng nhập tài khoản lớp trưởng (<code className="text-red-400">admin@ptit.edu.vn</code>) để thêm deadline mới, xoá deadline với cơ chế cập nhật tức thì (On-demand ISR).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
