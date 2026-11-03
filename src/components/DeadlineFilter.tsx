"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

interface DeadlineFilterProps {
  subjects: string[];
}

const PRIORITY_OPTIONS = [
  { value: "", label: "Tất cả độ ưu tiên" },
  { value: "high", label: "🔴 Cao" },
  { value: "medium", label: "🟡 Trung bình" },
  { value: "low", label: "🟢 Thấp" },
];

const TYPE_OPTIONS = [
  { value: "", label: "Tất cả loại" },
  { value: "assignment", label: "📝 Bài tập" },
  { value: "exam", label: "📋 Kiểm tra" },
  { value: "lab", label: "🔬 Thực hành" },
  { value: "project", label: "💡 Đồ án" },
  { value: "quiz", label: "❓ Quiz" },
  { value: "report", label: "📊 Báo cáo" },
  { value: "presentation", label: "🎤 Thuyết trình" },
];

export default function DeadlineFilter({ subjects }: DeadlineFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleChange = (name: string, value: string) => {
    router.push(`${pathname}?${createQueryString(name, value)}`);
  };

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <select
        value={searchParams.get("subject") || ""}
        onChange={(e) => handleChange("subject", e.target.value)}
        className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Tất cả môn học</option>
        {subjects.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("priority") || ""}
        onChange={(e) => handleChange("priority", e.target.value)}
        className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {PRIORITY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("type") || ""}
        onChange={(e) => handleChange("type", e.target.value)}
        className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {TYPE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {(searchParams.get("subject") ||
        searchParams.get("priority") ||
        searchParams.get("type")) && (
        <button
          onClick={() => router.push(pathname)}
          className="text-sm text-slate-400 hover:text-white transition-colors underline"
        >
          Xoá bộ lọc
        </button>
      )}
    </div>
  );
}

