// src/app/(app)/admin/page.tsx - SSR, admin only
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { can } from "@/lib/permissions";
import { getDeadlines, getSubjects } from "@/lib/data";
import { addDeadlineAction, deleteDeadlineAction } from "@/actions/deadline";
import AdminDeadlineForm from "@/components/AdminDeadlineForm";
import AdminDeadlineList from "@/components/AdminDeadlineList";
import type { Metadata } from "next";
import type { Role } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin - Quản lý Deadline",
  robots: { index: false },
};

export default async function AdminPage() {
  // Auth check (not relying solely on middleware)
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  const role = session.user.role as Role;
  if (!can(role, "add_deadline")) {
    redirect("/403");
  }

  const deadlines = getDeadlines();
  const subjects = getSubjects();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">⚙️ Admin Panel</h1>
        <p className="text-slate-400">
          Quản lý deadline · Đang đăng nhập: {session.user.name}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add form */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">➕ Thêm Deadline</h2>
          <AdminDeadlineForm
            subjects={subjects}
            addDeadlineAction={addDeadlineAction}
          />
        </div>

        {/* Deadline list */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">
            📋 Danh sách ({deadlines.length})
          </h2>
          <AdminDeadlineList
            deadlines={deadlines}
            deleteDeadlineAction={deleteDeadlineAction}
          />
        </div>
      </div>
    </div>
  );
}

