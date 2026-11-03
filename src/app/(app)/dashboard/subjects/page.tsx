import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSubjects, getDeadlines } from "@/lib/data";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Môn học - Dashboard",
  robots: { index: false },
};

export default async function DashboardSubjectsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/subjects");
  }

  const userId = session.user.id;
  const subjects = getSubjects();
  const allDeadlines = getDeadlines();
  const now = new Date();

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-6">📚 Môn học</h1>
      <div className="grid gap-4">
        {subjects.map((subject) => {
          const deadlines = allDeadlines.filter(
            (d) => d.subjectSlug === subject.slug
          );
          const completed = deadlines.filter((d) =>
            d.completedBy.includes(userId)
          ).length;
          const upcoming = deadlines.filter(
            (d) => !d.completedBy.includes(userId) && new Date(d.dueDate) > now
          ).length;

          return (
            <Link
              key={subject.id}
              href={`/subjects/${subject.slug}`}
              className="flex items-center gap-4 bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-5 transition-all group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{
                  backgroundColor: `${subject.color}20`,
                  border: `2px solid ${subject.color}40`,
                }}
              >
                {subject.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">
                  {subject.name}
                </h3>
                <p className="text-slate-500 text-sm">{subject.code}</p>
              </div>
              <div className="flex gap-4 text-sm text-right flex-shrink-0">
                <div>
                  <div className="font-bold text-emerald-400">{completed}</div>
                  <div className="text-slate-500 text-xs">Xong</div>
                </div>
                <div>
                  <div className="font-bold text-yellow-400">{upcoming}</div>
                  <div className="text-slate-500 text-xs">Còn lại</div>
                </div>
                <div>
                  <div className="font-bold text-slate-300">{deadlines.length}</div>
                  <div className="text-slate-500 text-xs">Tổng</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

