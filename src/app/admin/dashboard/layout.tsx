import AdminNav from '@/components/AdminNav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminNav />
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
