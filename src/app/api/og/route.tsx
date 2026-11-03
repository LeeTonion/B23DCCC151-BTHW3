import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Class Deadline Hub";
  const subject = searchParams.get("subject") || "PTIT";
  const dueDate = searchParams.get("dueDate") || "";
  const priority = searchParams.get("priority") || "medium";
  const type = searchParams.get("type") || "assignment";

  const priorityColors: Record<string, string> = {
    high: "#EF4444",
    medium: "#F59E0B",
    low: "#10B981",
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

  const color = priorityColors[priority] || "#F59E0B";
  const typeLabel = typeLabels[type] || type;

  let dueDateFormatted = "";
  if (dueDate) {
    try {
      dueDateFormatted = new Date(dueDate).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      dueDateFormatted = dueDate;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        
        <div style={{ display: "flex", alignItems: "center", marginBottom: "40px" }}>
          <div
            style={{
              background: color,
              borderRadius: "12px",
              padding: "12px 24px",
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            {typeLabel}
          </div>
          <div
            style={{
              marginLeft: "16px",
              background: "#1E3A5F",
              borderRadius: "8px",
              padding: "8px 16px",
              color: "#93C5FD",
              fontSize: "16px",
            }}
          >
            {subject}
          </div>
        </div>

        <div
          style={{
            color: "white",
            fontSize: "52px",
            fontWeight: "bold",
            lineHeight: 1.2,
            flex: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          {title.length > 80 ? title.substring(0, 77) + "..." : title}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #334155",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                background: color,
                borderRadius: "50%",
                marginRight: "12px",
              }}
            />
            <div style={{ color: "#94A3B8", fontSize: "20px" }}>
              Class Deadline Hub - PTIT
            </div>
          </div>
          {dueDateFormatted && (
            <div
              style={{
                background: "#1E293B",
                border: `2px solid ${color}`,
                borderRadius: "12px",
                padding: "12px 24px",
                color: color,
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              ⏰ Hạn: {dueDateFormatted}
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

