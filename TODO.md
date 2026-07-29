# Ziya — Yapılacaklar Listesi (TODO)

> Bu dosya, [Proje Dosyası.md](../Proje%20Dosyası.md)'nda tanımlanan mimariyi ve gerçek hayat senaryolarını **çalışan bir ürüne** dönüştürmek için fazlara bölünmüş mühendislik yol haritasıdır. Her madde işaretlenebilir (checkbox) bir iş birimidir. Kapsam dışı / dış bağımlılık gerektiren maddeler `⛔` ile işaretlenmiştir.

**Teknoloji yığını kararı:**

| Katman | Seçim | Gerekçe |
|---|---|---|
| Frontend/Framework | Next.js 15 (App Router, TypeScript) | Vercel ile birebir entegre, SSR + API routes tek repoda |
| Stil / UI | Tailwind CSS + shadcn/ui | Hızlı, erişilebilir, profesyonel dashboard bileşenleri |
| Veritabanı | Supabase (Postgres + `pgvector`) | Event Memory'nin vektörel arama ihtiyacını tek serviste karşılar |
| Auth | Supabase Auth | Kurumsal/bireysel kullanıcı ayrımı için hazır altyapı |
| Hosting | Vercel | Zaten proje bağlı (`cicibyte/ziya`) |
| Repo | GitHub (`Ziya`) | Zaten bağlı |
| Embedding | OpenAI `text-embedding-3-small` (veya eşdeğeri) | ⛔ API anahtarı gerektirir — kullanıcı sağlayacak |
| Piyasa verisi | Alpha Vantage / Finnhub (ücretsiz kademe ile başla) | ⛔ API anahtarı gerektirir |
| Haber verisi | NewsAPI / RSS (MVP) → Bloomberg/Reuters (ileri faz) | ⛔ Ücretli kaynaklar için lisans gerekir |
| KAP entegrasyonu | KAP açık veri servisi | ⛔ Faz 3'te ele alınacak |

---

## Faz 0 — Altyapı Kurulumu

- [x] GitHub reposu bağlantısı doğrulandı (`origin` → Ziya reposu)
- [ ] Next.js + TypeScript + Tailwind proje iskeletini oluştur
- [ ] shadcn/ui bileşen kütüphanesini kur
- [ ] ESLint + Prettier + `tsconfig` strict mod yapılandırması
- [ ] `.env.example` dosyasını oluştur (Supabase URL/anon key/service key, embedding API key placeholder'ları)
- [ ] Supabase projesini yerel `lib/supabase` client'larıyla (browser + server) bağla
- [ ] ⛔ Supabase proje URL + anon/service key'lerini `.env.local`'a ekle (kullanıcı sağlayacak — dashboard: `piuhezrgmoheoaosgmot`)
- [ ] Vercel projesiyle environment variable eşlemesini yap (`cicibyte/ziya`)
- [ ] ⛔ Özel alan adı: `ziya.cicibyte.com` → Vercel projesine ekle, Cloudflare DNS'te CNAME kaydı oluştur (bkz. aşağıdaki "Alan Adı Kurulumu" notu — kullanıcı aksiyonu gerekir)
- [ ] README.md'yi kurulum talimatlarıyla güncelle

## Faz 1 — MVP: Event Memory + Dashboard (Mühürlenmiş Demo Veri)

Hedef: Gerçek API'ler bağlanmadan önce, **Proje Dosyası'ndaki 5 senaryonun** gerçek verisiyle uçtan uca çalışan bir ürün.

- [ ] `pgvector` uzantısını aktif eden migration
- [ ] Tablo şeması: `sources`, `assets`, `events`, `event_assets`, `market_context`, `predictions`, `outcomes`, `rumor_tracking`
- [ ] Row Level Security (RLS) politikaları (okuma herkese açık demo, yazma yalnız servis rolü)
- [ ] Seed script: Bölüm 4'teki 5 senaryoyu (Tesla, Apple söylentisi, short squeeze, KAP bedelsiz sermaye, Nvidia zincirleme etki) gerçek tablo satırlarına dök
- [ ] Ana Dashboard sayfası: olay akışı (event feed) — kart bazlı, güven skoru rozetli, kategori etiketli
- [ ] Olay Detay sayfası: piyasa bağlamı matrisi (T0-1s / T0 / T0+24s / T0+1h tablosu), tahmin aralığı, benzer olay listesi
- [ ] Söylenti (Rumor) durum rozetleri: `Rumor` / `Unverified` / `Confirmed` / `False` renk kodlaması
- [ ] Basit istatistiksel "benzer olay ortalaması" tahmin fonksiyonu (kural tabanlı — ML değil, MVP için yeterli)
- [ ] Responsive tasarım (mobil/masaüstü)
- [ ] Boş durum, yükleme durumu ve hata durumu ekranları
- [ ] Yasal uyarı bileşeni: her tahmin kartında "Bu bir yatırım tavsiyesi değildir" ibaresi

## Faz 2 — Söylenti Motoru (Rumor Engine)

- [ ] `rumor_tracking` tablosu için durum makinesi: `rumor → unverified → confirmed/false`
- [ ] Kaynak doğruluk oranı hesaplama fonksiyonu (kaynak bazlı geçmiş isabet yüzdesi)
- [ ] ⛔ Sosyal medya kaynak entegrasyonları (Reddit API, X API, Telegram) — API erişim onayı gerekir
- [ ] Gürültü filtresi: düşük güven skorlu kaynaklardan gelen olaylar için "Yüksek Yanlış Olasılığı" etiketi
- [ ] Söylenti yaşam döngüsü zaman çizelgesi UI bileşeni (olay detay sayfasında)

## Faz 3 — Yerel Piyasa (KAP / BIST)

- [ ] ⛔ KAP açık veri servisi entegrasyonu (bildirim polling)
- [ ] Seans içi/seans dışı bildirim zamanlama mantığı
- [ ] BIST varlık evreni (`assets` tablosuna yerel hisseler)
- [ ] Çoklu para birimi / çoklu borsa gösterimi (TRY, USD)

## Faz 4 — Zincirleme Etki ve Portföy Perspektifi

- [ ] `related_assets` ilişki tablosu (rakip, tedarikçi, sektör paydaşı)
- [ ] Zincirleme etki hesaplama ve görselleştirme (Senaryo 5 — Nvidia örneği)
- [ ] Kullanıcı portföyü (izleme listesi) ve portföye özel bildirim filtresi

## Faz 5 — Gerçek Veri Entegrasyonu ve Kurumsal API

- [ ] ⛔ Piyasa verisi sağlayıcı entegrasyonu (Alpha Vantage/Finnhub) — API anahtarı ile
- [ ] ⛔ Haber akışı entegrasyonu (NewsAPI/RSS) — API anahtarı ile
- [ ] ⛔ Embedding üretimi ve gerçek vektörel benzerlik araması (OpenAI/Cohere) — API anahtarı ile
- [ ] Cron/Edge Function ile periyodik olay yakalama (Supabase Edge Functions veya Vercel Cron)
- [ ] Gerçekleşme takibi job'ı: T0+1s / T0+24s / T0+1h fiyatlarını otomatik çek ve `outcomes` tablosunu güncelle
- [ ] Model güncelleme döngüsü: tahmin hatası (MAE) hesaplama ve zaman içi izleme
- [ ] Genel Kullanıma Açık API (REST) + API key yönetimi
- [ ] Webhook desteği (kurumsal müşteriler için)

## Sürekli / Yatay Konular

- [ ] Kimlik doğrulama (Supabase Auth — e-posta + OAuth)
- [ ] Kullanıcı ayarları: izlenen varlıklar, bildirim tercihleri
- [ ] Test altyapısı: birim testleri (Vitest) + uçtan uca testler (Playwright)
- [ ] CI/CD: GitHub Actions ile lint + test + build kontrolü, Vercel otomatik deploy
- [ ] Hata izleme (Sentry veya eşdeğeri)
- [ ] Performans: sayfa yükleme, veritabanı sorgu indeksleri (`pgvector` ANN indeksi)
- [ ] Erişilebilirlik (a11y) kontrolü
- [ ] Yasal/uyumluluk metinleri: Kullanım Şartları, Gizlilik Politikası, "yatırım tavsiyesi değildir" feragatnamesi
- [ ] Çoklu dil desteği (TR/EN) — opsiyonel

---

## Şu An Neredeyiz?

**Aktif faz:** Faz 0 → Faz 1 (MVP iskeleti + seed senaryolar)

**Bilinen dış bağımlılıklar (kullanıcı aksiyonu gerekir):**
1. Supabase proje bağlantı bilgileri (`.env.local` içine URL + anon key + service role key)
2. Vercel ortam değişkenleri (aynı bilgiler production için)
3. İleride: piyasa verisi, haber API'si ve embedding API anahtarları

**Not:** `git remote -v` çıktısına göre bu repo `RealMrNovember/Ziya` adresine bağlı; paylaşılan `theitmanmike/Ziya` linkiyle örtüşmüyor. Doğru repo olduğunu teyit edin.

---

## Alan Adı Kurulumu — `ziya.cicibyte.com` (Vercel + Cloudflare)

Bu adımlar Vercel ve Cloudflare panellerinde **kullanıcı tarafından** yapılmalıdır (API anahtarı/CLI erişimi olmadan asistan bu paneli değiştiremez):

1. **Vercel tarafı:** `cicibyte/ziya` projesi → **Settings → Domains** → `ziya.cicibyte.com` yazıp **Add**'e tıkla. Vercel sana bir hedef gösterecek: genelde `cname.vercel-dns.com`.
2. **Cloudflare tarafı:** `cicibyte.com` DNS bölgesine git → **Add record**:
   - Type: `CNAME`
   - Name: `ziya`
   - Target: `cname.vercel-dns.com`
   - Proxy status: **DNS only (gri bulut)** — turuncu bulut (proxied) açıksa Vercel'in SSL sertifika doğrulaması ve edge routing'i çakışabilir. Sertifika oturduktan sonra istersen tekrar proxied'e çevirip test edebilirsin, ama başlangıçta gri bulut önerilir.
3. DNS yayılımını bekle (genelde birkaç dakika, bazen 1 saate kadar sürebilir).
4. Vercel **Domains** sekmesinde `ziya.cicibyte.com` yanında **Valid Configuration** ✅ görünmesini bekle — bu an Vercel otomatik olarak Let's Encrypt SSL sertifikası çıkarır.
5. `NEXT_PUBLIC_SITE_URL` (veya benzeri) ortam değişkenini hem Vercel'de hem `.env.local`'de `https://ziya.cicibyte.com` olarak güncelle.
6. Kontrol: `https://ziya.cicibyte.com` tarayıcıda açılmalı, kilit ikonu geçerli sertifika göstermeli.

> Not: Cloudflare'de `cicibyte.com` kök alan adının nameserver'ları zaten Cloudflare'e işaretliyse (yani domain Cloudflare üzerinden yönetiliyorsa) bu yeterlidir. Domain başka bir sağlayıcıda kayıtlıysa ve DNS'i Cloudflare'e taşımadıysan, önce Cloudflare'in nameserver kurulumunu tamamlaman gerekir.
