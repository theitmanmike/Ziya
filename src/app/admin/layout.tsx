import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/admin", label: "Genel Bakış" },
  { href: "/admin/ingestion", label: "Haber Çekme" },
  { href: "/admin/sources", label: "Kaynaklar" },
  { href: "/admin/customers", label: "Müşteriler" },
  { href: "/admin/pricing", label: "Paketler" },
  { href: "/admin/settings", label: "Ayarlar" },
  { href: "/admin/integrations", label: "Entegrasyonlar" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-xl font-semibold">Yetkiniz yok</h1>
        <p className="mt-2 text-sm text-muted">Bu sayfa yalnızca admin kullanıcılar içindir.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Admin Paneli</h1>
        <p className="mt-1 text-sm text-muted">Giriş: {user.email}</p>
      </div>
      <div className="flex flex-col gap-8 sm:flex-row">
        <nav className="flex shrink-0 gap-1 overflow-x-auto sm:w-48 sm:flex-col">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm text-muted hover:bg-surface-hover hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
