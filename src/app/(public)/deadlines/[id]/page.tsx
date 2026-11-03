import { getDeadlineById, getDeadlines } from "@/lib/data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CountdownBadge from "@/components/CountdownBadge";
import DeadlineInteractionSection from "@/components/DeadlineInteractionSection";
import Link from "next/link";

export const revalidate = 3600;

export async function generateStaticParams() {
  const deadlines = getDeadlines();
  return deadlines.map((d) => ({ id: d.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const deadline = getDeadlineById(id);
  if (!deadline) return {};

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const ogUrl = `${baseUrl}/api/og?title=${encodeURIComponent(
    deadline.title
  )}&subject=${encodeURIComponent(
    deadline.subjectCode
  )}&dueDate=${encodeURIComponent(deadline.dueDate)}&priority=${
    deadline.priority
  }&type=${deadline.type}`;

  return {
    title: deadline.title,
    description: deadline.description,
    openGraph: {
      title: `${deadline.title} | Deadline Hub PTIT`,
      description: deadline.description,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${deadline.title} | Deadline Hub PTIT`,
      description: deadline.description,
      images: [ogUrl],
    },
    robots: { index: true, follow: true },
  };
}

const priorityConfig = {
  high: {
    label: "Cao",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/30",
  },
  medium: {
    label: "Trung bình",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/30",
  },
  low: {
    label: "Thấp",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30",
  },
};

const typeLabels: Record<string, string> = {
  assignment: "📝 Bài tập",
  exam: "📋 Kiểm tra",
  lab: "🔬 Thực hành",
  project: "💡 Đồ án",
  quiz: "❓ Quiz",
  report: "📊 Báo cáo",
  presentation: "🎤 Thuyết trình",
};

export default async function DeadlineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deadline = getDeadlineById(id);

  if (!deadline) {
    notFound();
  }

  const pc = priorityConfig[deadline.priority] || priorityConfig.medium;
  const typeLabel = typeLabels[deadline.type] || deadline.type;
  const dueDate = new Date(deadline.dueDate);
  const dueDateStr = dueDate.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Deadlines",
        item: `${baseUrl}/deadlines`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: deadline.title,
        item: `${baseUrl}/deadlines/${id}`,
      },
    ],
  };

  return (
    <>
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <nav className="text-sm text-slate-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-white transition-colors">
            Trang chủ
          </Link>
          <span>›</span>
          <Link href="/deadlines" className="hover:text-white transition-colors">
            Deadlines
          </Link>
          <span>›</span>
          <span className="text-slate-300 truncate">{deadline.title}</span>
        </nav>

        <div className={`rounded-2xl border p-6 sm:p-8 mb-8 ${pc.bg}`}>
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="bg-slate-800/80 text-slate-300 text-sm px-3 py-1 rounded-full border border-slate-700">
              {typeLabel}
            </span>
            <span
              className={`text-sm px-3 py-1 rounded-full border ${pc.bg} ${pc.color}`}
            >
              Ưu tiên: {pc.label}
            </span>
            <span className="bg-slate-800/80 text-blue-400 text-sm px-3 py-1 rounded-full border border-blue-500/30">
              {deadline.subjectCode}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white mb-4">
            {deadline.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-slate-400">
              <span>📅</span>
              <span className="text-sm">{dueDateStr}</span>
            </div>
            <CountdownBadge dueDate={deadline.dueDate} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-bold text-white mb-4">📄 Mô tả</h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {deadline.description}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">📚 Môn học</h2>
              <Link
                href={`/subjects/${deadline.subjectSlug}`}
                className="flex items-center gap-3 hover:text-blue-400 transition-colors group"
              >
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-xl">
                  📖
                </div>
                <div>
                  <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {deadline.subjectName}
                  </div>
                  <div className="text-slate-500 text-sm">
                    {deadline.subjectCode}
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-4">
              <h2 className="text-lg font-bold text-white mb-4">🎯 Trạng thái</h2>
              <DeadlineInteractionSection
                deadlineId={deadline.id}
                completedBy={deadline.completedBy}
              />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-sm font-bold text-white mb-3">ℹ️ Thông tin</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Loại</dt>
                  <dd className="text-slate-300">{typeLabel}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Độ ưu tiên</dt>
                  <dd className={pc.color}>{pc.label}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Ngày tạo</dt>
                  <dd className="text-slate-300">
                    {new Date(deadline.createdAt).toLocaleDateString("vi-VN")}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Hoàn thành</dt>
                  <dd className="text-slate-300">
                    {deadline.completedBy.length} người
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/deadlines"
            className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1"
          >
            ← Quay lại danh sách
          </Link>
        </div>
      </div>
    </>
  );
}
