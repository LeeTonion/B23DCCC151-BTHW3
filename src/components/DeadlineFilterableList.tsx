// src/components/DeadlineFilterableList.tsx
"use client";

import { useState, useMemo } from "react";
import type { Deadline } from "@/lib/types";
import DeadlineCard from "./DeadlineCard";

interface DeadlineFilterableListProps {
  initialDeadlines: Deadline[];
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

export default function DeadlineFilterableList({
  initialDeadlines,
  subjects,
}: DeadlineFilterableListProps) {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const filtered = useMemo(() => {
    return initialDeadlines.filter((d) => {
      if (selectedSubject && d.subjectName !== selectedSubject) return false;
      if (selectedPriority && d.priority !== selectedPriority) return false;
      if (selectedType && d.type !== selectedType) return false;
      return true;
    });
  }, [initialDeadlines, selectedSubject, selectedPriority, selectedType]);

  const now = new Date();
  const upcoming = filtered.filter((d) => new Date(d.dueDate) >= now);
  const overdue = filtered.filter((d) => new Date(d.dueDate) < now);

  const hasFilter = selectedSubject || selectedPriority || selectedType;

  return (
    <div>
      {/* Interactive filter (use client) */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
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
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {hasFilter && (
          <button
            onClick={() => {
              setSelectedSubject("");
              setSelectedPriority("");
              setSelectedType("");
            }}
            className="text-sm text-slate-400 hover:text-white transition-colors underline self-center"
          >
            Xoá bộ lọc
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <div className="text-4xl mb-3">🔍</div>
          <p>Không tìm thấy deadline phù hợp với bộ lọc.</p>
        </div>
      ) : (
        <div>
          {upcoming.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                ⏰ Sắp đến hạn
                <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full">
                  {upcoming.length}
                </span>
              </h2>
              <div className="grid gap-4">
                {upcoming.map((d) => (
                  <DeadlineCard key={d.id} deadline={d} />
                ))}
              </div>
            </section>
          )}

          {overdue.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                ⚠️ Đã qua hạn
                <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded-full">
                  {overdue.length}
                </span>
              </h2>
              <div className="grid gap-4">
                {overdue.map((d) => (
                  <DeadlineCard key={d.id} deadline={d} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

