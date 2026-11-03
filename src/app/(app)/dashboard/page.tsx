import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDeadlines } from "@/lib/data";
import DeadlineCard from "@/components/DeadlineCard";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard - Deadline của tôi",
  robots: { index: false },
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const userId = session.user.id;
  const allDeadlines = getDeadlines();
  const now = new Date();

  const completed = allDeadlines.filter((d) =>
    d.completedBy.includes(userId)
  );
  const pending = allDeadlines.filter(
    (d) => !d.completedBy.includes(userId) && new Date(d.dueDate) > now
  );
  const overdue = allDeadlines.filter(
    (d) => !d.completedBy.includes(userId) && new Date(d.dueDate) <= now
  );

  const stats = [
    { label: "Tổng deadline", value: allDeadlines.length, icon: "📋", color: "text-blue-400" },
    { label: "Chờ hoàn thành", value: pending.length, icon: "⏳", color: "text-yellow-400" },
    { label: "Đã hoàn thành", value: completed.length, icon: "✅", color: "text-emerald-400" },
    { label: "Quá hạn", value: overdue.length, icon: "⚠️", color: "text-red-400" },
  ];

  return (
    <div>
      
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-1">
          Chào, {session.user.name}! 👋
        </h1>
        <p className="text-slate-400 text-sm">
          {session.user.role === "admin" ? "Lớp trưởng · " : "Sinh viên · "}
          {session.user.email}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className={`text-3xl font-black ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-slate-500 text-xs mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold text-white">Tiến độ hoàn thành</h2>
          <span className="text-sm text-slate-400">
            {completed.length}/{allDeadlines.length}
          </span>
        </div>
        <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all"
            style={{
              width: `${allDeadlines.length > 0 ? Math.round((completed.length / allDeadlines.length) * 100) : 0}%`,
            }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {allDeadlines.length > 0
            ? Math.round((completed.length / allDeadlines.length) * 100)
            : 0}
          % hoàn thành
        </p>
      </div>

      {overdue.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
          <h2 className="text-red-400 font-bold mb-3 flex items-center gap-2">
            ⚠️ Đã quá hạn ({overdue.length})
          </h2>
          <div className="space-y-2">
            {overdue.slice(0, 3).map((d) => (
              <Link
                key={d.id}
                href={`/deadlines/${d.id}`}
                className="flex items-center gap-2 text-sm text-red-300 hover:text-red-200 transition-colors"
              >
                <span>•</span>
                <span className="truncate">{d.title}</span>
                <span className="flex-shrink-0 text-red-500 text-xs">
                  {d.subjectCode}
                </span>
              </Link>
            ))}
            {overdue.length > 3 && (
              <p className="text-red-500 text-xs">
                và {overdue.length - 3} deadline khác...
              </p>
            )}
          </div>
        </div>
      )}

      {pending.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            ⏳ Chờ hoàn thành
            <span className="text-sm bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
              {pending.length}
            </span>
          </h2>
          <div className="grid gap-4">
            {pending.slice(0, 5).map((d) => (
              <DeadlineCard key={d.id} deadline={d} isDone={false} />
            ))}
            {pending.length > 5 && (
              <Link
                href="/dashboard/deadlines"
                className="text-blue-400 hover:text-blue-300 text-sm text-center py-2"
              >
                Xem tất cả {pending.length} deadline →
              </Link>
            )}
          </div>
        </div>
      )}

      {pending.length === 0 && overdue.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-white mb-2">
            Tuyệt vời! Bạn đã hoàn thành tất cả!
          </h3>
          <p className="text-slate-400">Không có deadline nào đang chờ.</p>
        </div>
      )}
    </div>
  );
}

