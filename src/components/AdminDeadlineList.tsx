// src/components/AdminDeadlineList.tsx
"use client";

import { useState, useTransition } from "react";
import type { Deadline } from "@/lib/types";
import type { ActionResult } from "@/actions/deadline";
import Link from "next/link";

interface AdminDeadlineListProps {
  deadlines: Deadline[];
  deleteDeadlineAction: (id: string) => Promise<ActionResult>;
}

const typeIcons: Record<string, string> = {
  assignment: "📝",
  exam: "📋",
  lab: "🔬",
  project: "💡",
  quiz: "❓",
  report: "📊",
  presentation: "🎤",
};

export default function AdminDeadlineList({
  deadlines,
  deleteDeadlineAction,
}: AdminDeadlineListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Xoá deadline "${title}"?`)) return;

    setDeletingId(id);
    setMessage(null);
    startTransition(async () => {
      const result = await deleteDeadlineAction(id);
      setMessage(result.message);
      setDeletingId(null);
    });
  };

  return (
    <div className="space-y-3">
      {message && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg p-3">
          {message}
        </div>
      )}

      {deadlines.length === 0 && (
        <div className="text-center py-8 text-slate-500 bg-slate-900 border border-slate-800 rounded-xl">
          Chưa có deadline nào.
        </div>
      )}

      {deadlines.map((d) => (
        <div
          key={d.id}
          className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-start gap-3"
        >
          <span className="text-xl flex-shrink-0 mt-0.5">
            {typeIcons[d.type] || "📌"}
          </span>
          <div className="flex-1 min-w-0">
            <Link
              href={`/deadlines/${d.id}`}
              className="font-medium text-white hover:text-blue-400 transition-colors text-sm block truncate"
            >
              {d.title}
            </Link>
            <p className="text-slate-500 text-xs mt-0.5">
              {d.subjectCode} ·{" "}
              {new Date(d.dueDate).toLocaleDateString("vi-VN")} ·{" "}
              {d.completedBy.length} đã xong
            </p>
          </div>
          <button
            onClick={() => handleDelete(d.id, d.title)}
            disabled={isPending && deletingId === d.id}
            className="flex-shrink-0 text-red-400 hover:text-red-300 hover:bg-red-500/10 disabled:opacity-40 p-1.5 rounded-lg transition-colors text-sm"
            title="Xoá deadline"
          >
            {isPending && deletingId === d.id ? (
              <span className="block w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              "🗑️"
            )}
          </button>
        </div>
      ))}
    </div>
  );
}

