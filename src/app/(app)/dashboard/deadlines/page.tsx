// src/app/(app)/dashboard/deadlines/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDeadlines } from "@/lib/data";
import DeadlineCard from "@/components/DeadlineCard";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Deadline của tôi",
  robots: { index: false },
};

export default async function DashboardDeadlinesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/deadlines");
  }

  const userId = session.user.id;
  const allDeadlines = getDeadlines();
  const now = new Date();

  const pending = allDeadlines.filter(
    (d) => !d.completedBy.includes(userId) && new Date(d.dueDate) > now
  );
  const completed = allDeadlines.filter((d) => d.completedBy.includes(userId));
  const overdue = allDeadlines.filter(
    (d) => !d.completedBy.includes(userId) && new Date(d.dueDate) <= now
  );

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-6">📋 Deadline của tôi</h1>

      {overdue.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold text-red-400 mb-3">
            ⚠️ Quá hạn ({overdue.length})
          </h2>
          <div className="grid gap-3">
            {overdue.map((d) => (
              <DeadlineCard key={d.id} deadline={d} isDone={false} />
            ))}
          </div>
        </section>
      )}

      {pending.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold text-yellow-400 mb-3">
            ⏳ Đang chờ ({pending.length})
          </h2>
          <div className="grid gap-3">
            {pending.map((d) => (
              <DeadlineCard key={d.id} deadline={d} isDone={false} />
            ))}
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section>
          <h2 className="text-base font-bold text-emerald-400 mb-3">
            ✅ Đã xong ({completed.length})
          </h2>
          <div className="grid gap-3">
            {completed.map((d) => (
              <DeadlineCard key={d.id} deadline={d} isDone={true} />
            ))}
          </div>
        </section>
      )}

      {allDeadlines.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          Chưa có deadline nào.
        </div>
      )}
    </div>
  );
}

