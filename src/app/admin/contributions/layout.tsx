import AdminNav from "@/components/AdminNav";

export default function ContributionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminNav />

      {/* Content area scrolls, sidebar does NOT */}
      <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-8">
        {children}
      </main>
    </div>
  );
}
