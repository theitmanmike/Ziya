export const metadata = { title: "Gizlilik Politikası — Ziya" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Gizlilik Politikası</h1>
      <p className="mt-1 text-sm text-muted">Son güncelleme: 29 Temmuz 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-foreground">1. Topladığımız Veriler</h2>
          <p className="mt-2 text-muted">
            Hesap oluşturduğunuzda e-posta adresinizi ve kimlik doğrulama bilgilerinizi (Supabase
            Auth üzerinden, şifreniz bize hiçbir zaman düz metin olarak ulaşmaz) saklarız. Sosyal
            medya verisi yalnızca kamuya açık içerikten, kişisel veri minimizasyonu ilkesiyle
            toplanır (bkz. Proje Dosyası Bölüm 10.1).
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">2. Verilerin Kullanım Amacı</h2>
          <p className="mt-2 text-muted">
            Verileriniz yalnızca hesabınızı yönetmek, paket seviyenizi belirlemek ve hizmeti
            iyileştirmek için kullanılır. Verileriniz üçüncü taraflara satılmaz.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">3. Altyapı Sağlayıcıları</h2>
          <p className="mt-2 text-muted">
            Veritabanı ve kimlik doğrulama için Supabase, barındırma için Vercel kullanıyoruz. Bu
            sağlayıcılar veri işleyici (data processor) sıfatıyla, yalnızca hizmeti sunmak amacıyla
            verilerinize erişebilir.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">4. KVKK / GDPR Hakları</h2>
          <p className="mt-2 text-muted">
            Verilerinize erişme, düzeltme, silinmesini talep etme ve işlemeye itiraz etme hakkınız
            vardır. Talepleriniz için bizimle iletişime geçin.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">5. Veri Saklama</h2>
          <p className="mt-2 text-muted">
            Hesap verileriniz, hesabınız aktif olduğu sürece saklanır. Hesabınızı silmek isterseniz
            bizimle iletişime geçin.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">6. İletişim</h2>
          <p className="mt-2 text-muted">
            Gizlilikle ilgili sorularınız için:{" "}
            <span className="text-foreground">destek@ziya.cicibyte.com</span>
          </p>
        </section>
      </div>
    </div>
  );
}
