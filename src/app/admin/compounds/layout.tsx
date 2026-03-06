import AdminNav from '@/components/AdminNav';

export default function CompoundsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen">
      <AdminNav />
      <div className="flex-1 p-8 text-gray-900 dark:text-gray-100">{children}</div>
    </div>
  );
}
