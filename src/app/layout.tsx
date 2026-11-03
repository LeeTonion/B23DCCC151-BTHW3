import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Class Deadline Hub - PTIT",
    template: "%s | Deadline Hub PTIT",
  },
  description:
    "Cổng thông tin deadline lớp học PTIT - Quản lý và theo dõi deadline các môn học.",
  keywords: ["deadline", "PTIT", "sinh viên", "học tập", "deadline hub"],
  authors: [{ name: "PTIT" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Class Deadline Hub - PTIT",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className={`${beVietnamPro.className} bg-slate-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
