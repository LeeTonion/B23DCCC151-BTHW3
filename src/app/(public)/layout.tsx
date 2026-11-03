// src/app/(public)/layout.tsx
import SessionProvider from "@/components/SessionProvider";
import Header from "@/components/Header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider session={null}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="bg-slate-900 border-t border-slate-800 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
            <p>© 2026 Class Deadline Hub - PTIT. Được xây dựng với Next.js.</p>
          </div>
        </footer>
      </div>
    </SessionProvider>
  );
}
