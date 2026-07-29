import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="text-lg font-semibold tracking-tight">Ziya</span>
              <span className="hidden text-sm text-muted sm:inline">
                Olay Odaklı Hisse Senedi Etki Tahmin Ajanı
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm text-muted">
              <Link href="/" className="hover:text-foreground">
                Olay Akışı
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted sm:px-6">
            <p>
              Ziya bir karar destek aracıdır; sunulan tahminler geçmiş olayların istatistiksel
              analizine dayanır ve{" "}
              <strong className="text-foreground">yatırım tavsiyesi değildir</strong>.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
