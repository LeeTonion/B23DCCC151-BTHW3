"use client";

import { useState, useTransition, useRef } from "react";
import type { Subject } from "@/lib/types";
import type { ActionResult } from "@/actions/deadline";

interface AdminDeadlineFormProps {
  subjects: Subject[];
  addDeadlineAction: (formData: FormData) => Promise<ActionResult>;
}

export default function AdminDeadlineForm({
  subjects,
  addDeadlineAction,
}: AdminDeadlineFormProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const subjectId = formData.get("subjectId") as string;
    const subject = subjects.find((s) => s.id === subjectId);
    if (subject) {
      formData.set("subjectSlug", subject.slug);
      formData.set("subjectName", subject.name);
      formData.set("subjectCode", subject.code);
    }

    setMessage(null);
    startTransition(async () => {
      const result = await addDeadlineAction(formData);
      setMessage({ type: result.success ? "success" : "error", text: result.message });
      if (result.success) {
        formRef.current?.reset();
      }
    });
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Tiêu đề *
        </label>
        <input
          name="title"
          required
          placeholder="Tiêu đề deadline..."
          className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Môn học *
        </label>
        <select
          name="subjectId"
          required
          className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Chọn môn học...</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.code})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Loại *
          </label>
          <select
            name="type"
            required
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="assignment">📝 Bài tập</option>
            <option value="exam">📋 Kiểm tra</option>
            <option value="lab">🔬 Thực hành</option>
            <option value="project">💡 Đồ án</option>
            <option value="quiz">❓ Quiz</option>
            <option value="report">📊 Báo cáo</option>
            <option value="presentation">🎤 Thuyết trình</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Độ ưu tiên *
          </label>
          <select
            name="priority"
            required
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="high">🔴 Cao</option>
            <option value="medium">🟡 Trung bình</option>
            <option value="low">🟢 Thấp</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Hạn nộp *
        </label>
        <input
          name="dueDate"
          type="datetime-local"
          required
          className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Mô tả *
        </label>
        <textarea
          name="description"
          required
          rows={4}
          placeholder="Mô tả chi tiết về deadline..."
          className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 resize-none"
        />
      </div>

      {message && (
        <div
          className={`text-sm rounded-lg p-3 ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Đang thêm...
          </>
        ) : (
          "➕ Thêm deadline"
        )}
      </button>
    </form>
  );
}

