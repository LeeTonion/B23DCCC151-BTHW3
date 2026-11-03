import Link from "next/link";
import type { Deadline } from "@/lib/types";
import CountdownBadge from "./CountdownBadge";

const priorityConfig = {
  high: {
    label: "Cao",
    bg: "bg-red-500/10 border-red-500/30",
    badge: "bg-red-500/20 text-red-400 border-red-500/30",
    dot: "bg-red-500",
  },
  medium: {
    label: "TB",
    bg: "bg-yellow-500/10 border-yellow-500/30",
    badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    dot: "bg-yellow-500",
  },
  low: {
    label: "Thấp",
    bg: "bg-emerald-500/10 border-emerald-500/30",
    badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-500",
  },
};

const typeIcons: Record<string, string> = {
  assignment: "📝",
  exam: "📋",
  lab: "🔬",
  project: "💡",
  quiz: "❓",
  report: "📊",
  presentation: "🎤",
};

interface DeadlineCardProps {
  deadline: Deadline;
  isDone?: boolean;
}

export default function DeadlineCard({ deadline, isDone = false }: DeadlineCardProps) {
  const pc = priorityConfig[deadline.priority] || priorityConfig.medium;
  const icon = typeIcons[deadline.type] || "📌";

  const dueDate = new Date(deadline.dueDate);
  const dateStr = dueDate.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link href={`/deadlines/${deadline.id}`} className="block group">
      <div
        className={`rounded-xl border p-5 transition-all hover:scale-[1.01] hover:shadow-lg ${
          isDone
            ? "bg-slate-900/50 border-slate-700 opacity-60"
            : `${pc.bg} hover:border-blue-500/50`
        }`}
      >
        
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xl">{icon}</span>
            <h3
              className={`font-semibold text-sm sm:text-base truncate group-hover:text-blue-400 transition-colors ${
                isDone ? "line-through text-slate-500" : "text-white"
              }`}
            >
              {deadline.title}
            </h3>
          </div>
          {isDone && (
            <span className="text-emerald-400 text-xs flex-shrink-0">✅ Xong</span>
          )}
        </div>

        <p className="text-slate-400 text-sm line-clamp-2 mb-3">
          {deadline.description}
        </p>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500">{deadline.subjectCode}</span>
          <span className="text-slate-600">·</span>
          <span className={`px-2 py-0.5 rounded-full border ${pc.badge}`}>
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${pc.dot} mr-1`} />
            {pc.label}
          </span>
          <span className="text-slate-500 ml-auto">📅 {dateStr}</span>
          <CountdownBadge dueDate={deadline.dueDate} />
        </div>
      </div>
    </Link>
  );
}

