import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { AuthNav } from "@/components/AuthNav";
import { Logo } from "@/components/Logo";
import { getCurrentUser } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ziya — Olay Odaklı Hisse Senedi Etki Tahmin Ajanı",
  description:
    "Ziya, piyasaya düşen her haberi geçmişteki binlerce benzeriyle karşılaştırır ve olası fiyat etkisini güven skoruyla birlikte sunar.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = process.env.NEXT_PUBLIC_SUPABASE_URL ? await getCurrentUser() : null;

  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand focus:px-3 focus:py-2 focus:text-sm focus:text-brand-foreground"
        >
          İçeriğe geç
        </a>
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <Link href="/" className="flex items-center gap-3">
              <Logo />
              <span className="hidden text-sm text-muted md:inline">
                Olay Odaklı Hisse Senedi Etki Tahmin Ajanı
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm text-muted">
              <Link href="/" className="hover:text-foreground">
                Olay Akışı
              </Link>
              <Link href="/pricing" className="hover:text-foreground">
                Paketler
              </Link>
              <AuthNav email={user?.email ?? null} isAdmin={user?.role === "admin"} />
            </nav>
          </div>
        </header>

        <main id="icerik" className="flex-1">
          {children}
        </main>

        <footer className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted sm:px-6">
            <p>
              Ziya bir karar destek aracıdır; sunulan tahminler geçmiş olayların istatistiksel
              analizine dayanır ve{" "}
              <strong className="text-foreground">yatırım tavsiyesi değildir</strong>.
            </p>
            <p className="mt-2 flex gap-3">
              <Link href="/terms" className="hover:text-foreground">
                Kullanım Şartları
              </Link>
              <Link href="/privacy" className="hover:text-foreground">
                Gizlilik Politikası
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
