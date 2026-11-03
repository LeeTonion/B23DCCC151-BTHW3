"use server";

import { revalidatePath, updateTag } from "next/cache";
import { auth } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { addDeadline, deleteDeadline, toggleDeadlineComplete } from "@/lib/data";
import { z } from "zod";
import type { Role } from "@/lib/types";

const AddDeadlineSchema = z.object({
  title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự").max(200),
  description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự").max(2000),
  subjectId: z.string().min(1, "Vui lòng chọn môn học"),
  subjectSlug: z.string().min(1),
  subjectName: z.string().min(1),
  subjectCode: z.string().min(1),
  dueDate: z.string().min(1, "Vui lòng chọn ngày hạn nộp"),
  priority: z.enum(["high", "medium", "low"]),
  type: z.enum([
    "assignment",
    "exam",
    "lab",
    "project",
    "quiz",
    "report",
    "presentation",
  ]),
});

export type ActionResult = {
  success: boolean;
  message: string;
  data?: unknown;
};

export async function addDeadlineAction(
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, message: "Bạn chưa đăng nhập." };
  }

  const role = session.user.role as Role;
  if (!can(role, "add_deadline")) {
    return { success: false, message: "Bạn không có quyền thêm deadline." };
  }

  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    subjectId: formData.get("subjectId"),
    subjectSlug: formData.get("subjectSlug"),
    subjectName: formData.get("subjectName"),
    subjectCode: formData.get("subjectCode"),
    dueDate: formData.get("dueDate"),
    priority: formData.get("priority"),
    type: formData.get("type"),
  };

  const parsed = AddDeadlineSchema.safeParse(raw);
  if (!parsed.success) {
    const messages = parsed.error.issues.map((e) => e.message).join(", ");
    return { success: false, message: messages };
  }

  try {
    const newDeadline = addDeadline(parsed.data);

    try {
      updateTag("deadlines");
    } catch {
    }
    revalidatePath("/deadlines");

    return {
      success: true,
      message: "Thêm deadline thành công!",
      data: newDeadline,
    };
  } catch {
    return { success: false, message: "Lỗi hệ thống, vui lòng thử lại." };
  }
}

export async function deleteDeadlineAction(id: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, message: "Bạn chưa đăng nhập." };
  }

  const role = session.user.role as Role;
  if (!can(role, "delete_deadline")) {
    return { success: false, message: "Bạn không có quyền xoá deadline." };
  }

  if (!id || typeof id !== "string") {
    return { success: false, message: "ID deadline không hợp lệ." };
  }

  try {
    const deleted = deleteDeadline(id);
    if (!deleted) {
      return { success: false, message: "Deadline không tồn tại." };
    }

    try {
      updateTag("deadlines");
    } catch {
    }
    revalidatePath("/deadlines");
    revalidatePath(`/deadlines/${id}`);

    return { success: true, message: "Xoá deadline thành công!" };
  } catch {
    return { success: false, message: "Lỗi hệ thống, vui lòng thử lại." };
  }
}

export async function markDoneAction(
  deadlineId: string
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, message: "Bạn chưa đăng nhập." };
  }

  const role = session.user.role as Role;
  if (!can(role, "mark_done")) {
    return { success: false, message: "Bạn không có quyền đánh dấu deadline." };
  }

  if (!deadlineId || typeof deadlineId !== "string") {
    return { success: false, message: "ID deadline không hợp lệ." };
  }

  try {
    const updated = toggleDeadlineComplete(deadlineId, session.user.id);
    if (!updated) {
      return { success: false, message: "Deadline không tồn tại." };
    }

    const isDone = updated.completedBy.includes(session.user.id);
    revalidatePath("/dashboard");
    revalidatePath("/deadlines");

    return {
      success: true,
      message: isDone ? "Đã đánh dấu hoàn thành!" : "Đã bỏ đánh dấu!",
      data: { isDone },
    };
  } catch {
    return { success: false, message: "Lỗi hệ thống, vui lòng thử lại." };
  }
}
