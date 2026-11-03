// src/app/(public)/subjects/[slug]/page.tsx - SSG
import { getSubjectBySlug, getSubjects, getDeadlinesBySubject } from "@/lib/data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DeadlineCard from "@/components/DeadlineCard";
import Link from "next/link";

// SSG: generate all subject pages at build time
export const dynamic = "force-static";

export async function generateStaticParams() {
  const subjects = getSubjects();
  return subjects.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const subject = getSubjectBySlug(slug);
  if (!subject) return {};

  return {
    title: `${subject.name} (${subject.code})`,
    description: subject.description,
    openGraph: {
      title: `${subject.name} - Deadline Hub PTIT`,
      description: subject.description,
    },
  };
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const subject = getSubjectBySlug(slug);

  if (!subject) {
    notFound();
  }

  const deadlines = getDeadlinesBySubject(slug);
  const subjects = getSubjects();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
        <span>›</span>
        <span className="text-slate-300">{subject.name}</span>
      </nav>

      {/* Subject Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{ backgroundColor: `${subject.color}20`, border: `2px solid ${subject.color}40` }}
          >
            {subject.icon}
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">{subject.name}</h1>
            <p className="text-slate-400">{subject.code} · {subject.instructor}</p>
          </div>
        </div>
        <p className="text-slate-400 max-w-2xl">{subject.description}</p>
      </div>

      {/* Deadlines */}
      <h2 className="text-xl font-bold text-white mb-4">
        📋 Deadline ({deadlines.length})
      </h2>
      {deadlines.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          Chưa có deadline nào cho môn này.
        </div>
      ) : (
        <div className="grid gap-4">
          {deadlines.map((d) => (
            <DeadlineCard key={d.id} deadline={d} />
          ))}
        </div>
      )}

      {/* Other subjects */}
      <div className="mt-12">
        <h2 className="text-lg font-bold text-white mb-4">📚 Các môn khác</h2>
        <div className="flex flex-wrap gap-3">
          {subjects
            .filter((s) => s.slug !== slug)
            .map((s) => (
              <Link
                key={s.id}
                href={`/subjects/${s.slug}`}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
              >
                {s.icon} {s.name}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

