// src/app/(app)/layout.tsx - App layout for protected pages
import { auth } from "@/lib/auth";
import SessionProvider from "@/components/SessionProvider";
import Header from "@/components/Header";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </SessionProvider>
  );
}

