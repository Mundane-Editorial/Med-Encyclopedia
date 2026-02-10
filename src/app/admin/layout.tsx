import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  // Admin layout doesn't include public Navbar/Footer
  // This is handled by individual admin page layouts
  return <>{children}</>;
}
