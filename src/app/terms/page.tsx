export const metadata = { title: "Kullanım Şartları — Ziya" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Kullanım Şartları</h1>
      <p className="mt-1 text-sm text-muted">Son güncelleme: 29 Temmuz 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-foreground">1. Hizmetin Niteliği</h2>
          <p className="mt-2 text-muted">
            Ziya, geçmiş piyasa olaylarının istatistiksel analizine dayalı bir karar destek
            aracıdır. Sunulan tüm tahminler, skorlar ve etiketler{" "}
            <strong className="text-foreground">yatırım tavsiyesi değildir</strong> ve bir yatırım
            danışmanlığı hizmeti teşkil etmez. Yatırım kararlarınız için lisanslı bir yatırım
            danışmanına başvurun.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">2. Hesap Sorumluluğu</h2>
          <p className="mt-2 text-muted">
            Hesabınızın güvenliğinden siz sorumlusunuz. Şifrenizi kimseyle paylaşmayın; hesabınızda
            şüpheli bir etkinlik fark ederseniz bizimle iletişime geçin.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">3. Kabul Edilebilir Kullanım</h2>
          <p className="mt-2 text-muted">
            Hizmeti otomatik veri kazıma (scraping), tersine mühendislik veya üçüncü taraflara zarar
            verecek şekillerde kullanamazsınız. Kurumsal API erişimi ayrı bir sözleşmeye tabidir.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">4. Paketler ve Ödeme</h2>
          <p className="mt-2 text-muted">
            Free paket ücretsizdir. Pro ve Kurumsal paketlerin ödeme koşulları, bu paketler aktif
            hale geldiğinde ayrıca belirtilecektir.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">5. Sorumluluk Sınırlaması</h2>
          <p className="mt-2 text-muted">
            Ziya, sunulan bilgilerin doğruluğunu makul ölçüde sağlamaya çalışır ancak piyasa
            verilerindeki gecikme, eksiklik veya hatalardan doğabilecek zararlardan sorumlu
            tutulamaz.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">6. Değişiklikler</h2>
          <p className="mt-2 text-muted">
            Bu şartları zaman zaman güncelleyebiliriz. Önemli değişikliklerde kayıtlı kullanıcıları
            bilgilendiririz.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">7. Uygulanacak Hukuk</h2>
          <p className="mt-2 text-muted">Bu şartlar Türkiye Cumhuriyeti yasalarına tabidir.</p>
        </section>
      </div>
    </div>
  );
}
