"use client";

import { useSession } from "next-auth/react";
import MarkDoneButton from "./MarkDoneButton";
import Link from "next/link";

interface DeadlineInteractionSectionProps {
  deadlineId: string;
  completedBy: string[];
}

export default function DeadlineInteractionSection({
  deadlineId,
  completedBy,
}: DeadlineInteractionSectionProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-10 bg-slate-800 rounded-lg" />
        <div className="h-4 bg-slate-800 rounded w-1/2" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div>
        <p className="text-slate-400 text-sm mb-3">
          Đăng nhập để đánh dấu deadline đã hoàn thành.
        </p>
        <Link
          href={`/login?callbackUrl=/deadlines/${deadlineId}`}
          className="block text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  const userId = session.user.id;
  const isDone = completedBy.includes(userId);

  return (
    <div>
      <MarkDoneButton deadlineId={deadlineId} initialDone={isDone} />
      <div className="mt-4 text-xs text-slate-500">
        {completedBy.length} người đã hoàn thành
      </div>
    </div>
  );
}

