"use client";

import { useState, useTransition } from "react";
import { markDoneAction } from "@/actions/deadline";

interface MarkDoneButtonProps {
  deadlineId: string;
  initialDone: boolean;
}

export default function MarkDoneButton({
  deadlineId,
  initialDone,
}: MarkDoneButtonProps) {
  const [isDone, setIsDone] = useState(initialDone);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleToggle = () => {
    setError(null);
    startTransition(async () => {
      const result = await markDoneAction(deadlineId);
      if (result.success) {
        setIsDone((result.data as { isDone: boolean }).isDone);
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
          isDone
            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
            : "bg-slate-700 hover:bg-emerald-600 text-slate-300 hover:text-white"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isPending ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : isDone ? (
          "✅"
        ) : (
          "⭕"
        )}
        {isDone ? "Đã hoàn thành" : "Đánh dấu xong"}
      </button>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

