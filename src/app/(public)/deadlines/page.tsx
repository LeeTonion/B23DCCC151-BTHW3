// src/app/(public)/deadlines/page.tsx - ISR (revalidate 60s)
import { getDeadlines, getSubjects } from "@/lib/data";
import type { Metadata } from "next";
import DeadlineFilterableList from "@/components/DeadlineFilterableList";

// ISR: revalidate every 60 seconds
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tất cả Deadlines",
  description: "Danh sách tất cả deadline của lớp - PTIT Deadline Hub",
  robots: { index: true, follow: true },
};

export default function DeadlinesPage() {
  const deadlines = getDeadlines();
  const subjects = getSubjects();
  const subjectNames = subjects.map((s) => s.name);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">📋 Tất cả Deadlines</h1>
        <p className="text-slate-400">
          {deadlines.length} deadline • Tự động cập nhật sau 60 giây (ISR)
        </p>
      </div>

      <DeadlineFilterableList
        initialDeadlines={deadlines}
        subjects={subjectNames}
      />
    </div>
  );
}
