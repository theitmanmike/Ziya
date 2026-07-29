# Ziya — Yapılacaklar Listesi (TODO)

> Bu dosya, [Proje Dosyası.md](../Proje%20Dosyası.md)'nda tanımlanan mimariyi ve gerçek hayat senaryolarını **çalışan bir ürüne** dönüştürmek için fazlara bölünmüş mühendislik yol haritasıdır. Her madde işaretlenebilir (checkbox) bir iş birimidir. Kapsam dışı / dış bağımlılık gerektiren maddeler `⛔` ile işaretlenmiştir.

**Teknoloji yığını kararı:**

| Katman             | Seçim                                               | Gerekçe                                                                                                                                   |
| ------------------ | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend/Framework | Next.js 16 (App Router, TypeScript, Turbopack)      | Vercel ile birebir entegre, SSR + API routes tek repoda                                                                                   |
| Stil / UI          | Tailwind CSS v4 (elle yazılmış bileşenler)          | shadcn/ui kurulumu non-interaktif ortamda risk taşıdığı için elle, Tailwind üzerine yazılan sade bileşenlerle ilerlendi — bkz. Faz 0 notu |
| Veritabanı         | Supabase (Postgres + `pgvector`)                    | Event Memory'nin vektörel arama ihtiyacını tek serviste karşılar                                                                          |
| Auth               | Supabase Auth                                       | Kurumsal/bireysel kullanıcı ayrımı için hazır altyapı                                                                                     |
| Hosting            | Vercel                                              | Zaten proje bağlı (`cicibyte/ziya`)                                                                                                       |
| Repo               | GitHub (`Ziya`)                                     | Zaten bağlı                                                                                                                               |
| Embedding          | OpenAI `text-embedding-3-small` (veya eşdeğeri)     | ⛔ API anahtarı gerektirir — kullanıcı sağlayacak                                                                                         |
| Piyasa verisi      | Alpha Vantage / Finnhub (ücretsiz kademe ile başla) | ⛔ API anahtarı gerektirir                                                                                                                |
| Haber verisi       | NewsAPI / RSS (MVP) → Bloomberg/Reuters (ileri faz) | ⛔ Ücretli kaynaklar için lisans gerekir                                                                                                  |
| KAP entegrasyonu   | KAP açık veri servisi                               | ⛔ Faz 3'te ele alınacak                                                                                                                  |

---

## Faz 0 — Altyapı Kurulumu

- [x] GitHub reposu bağlantısı doğrulandı ve düzeltildi (`origin` → [theitmanmike/Ziya](https://github.com/theitmanmike/Ziya), eski `RealMrNovember/Ziya` clone artık `origin-realmrnovember` remote'u olarak duruyor)
- [x] Next.js + TypeScript + Tailwind proje iskeletini oluştur
- [x] ~~shadcn/ui bileşen kütüphanesini kur~~ — **karardan vazgeçildi.** Non-interaktif ortamda CLI kurulumu risk taşıdığından, `src/components/` altında Tailwind ile elle yazılmış sade bileşenler (Badge, TrustBadge, StatusBadge, ChangeValue, EventCard, PredictionSummary, MarketContextTable, RumorTimeline) kullanıldı.
- [x] ESLint yapılandırması (create-next-app varsayılanı, `npx eslint .` temiz geçiyor)
- [x] Prettier kurulumu (`.prettierrc.json`, `npm run format` / `format:check`, tüm kod tabanına uygulandı)
- [x] `tsconfig` strict mod (scaffold varsayılanı, `strict: true`)
- [x] `.env.example` dosyasını oluştur (Supabase URL/anon key/service key, embedding API key placeholder'ları)
- [x] Supabase projesini yerel `lib/supabase` client'larıyla (browser + server + admin) bağla
- [x] Supabase proje URL + anon/service key'lerini `.env.local`'a ekle (Personal Access Token ile CLI üzerinden alındı, proje: `piuhezrgmoheoaosgmot`)
- [x] Vercel projesiyle environment variable eşlemesini yap (`cicibyte/ziya` — 4 değişken × 3 ortam, CLI ile eklendi)
- [x] Özel alan adı: `ziya.cicibyte.com` → Vercel'e eklendi, Cloudflare CNAME kuruldu, canlı ve SSL geçerli (bkz. "Alan Adı Kurulumu" notu — bu adımı kullanıcı kendisi tamamladı)
- [x] README.md'yi kurulum talimatlarıyla güncelle

## Faz 1 — MVP: Event Memory + Dashboard (Mühürlenmiş Demo Veri)

Hedef: Gerçek API'ler bağlanmadan önce, **Proje Dosyası'ndaki 5 senaryonun** gerçek verisiyle uçtan uca çalışan bir ürün.

- [x] `pgvector` uzantısını aktif eden migration
- [x] Tablo şeması: `sources`, `assets`, `events`, `event_assets`, `market_context`, `predictions`, `outcomes`, `rumor_tracking`
- [x] Row Level Security (RLS) politikaları (okuma herkese açık demo, yazma yalnız servis rolü) — migration'da tanımlı, `supabase db push` ile canlı projeye uygulandı
- [x] Seed script: Bölüm 4'teki 5 senaryoyu (Tesla, Apple söylentisi, short squeeze, KAP bedelsiz sermaye, Nvidia zincirleme etki) gerçek tablo satırlarına dök — **canlı veritabanına yüklendi ve tarayıcıda doğrulandı**
- [x] Ana Dashboard sayfası: olay akışı (event feed) — kart bazlı, güven skoru rozetli, kategori etiketli
- [ ] Olay Detay sayfası — piyasa bağlamı matrisi ve tahmin aralığı **var**; "benzer olay listesi" kısmı **yok**, şu an sadece bir bilgi notu gösteriyor (embedding üretilmediği için `match_events` fonksiyonu hiç çağrılmıyor)
- [x] Söylenti (Rumor) durum rozetleri: `Rumor` / `Unverified` / `Confirmed` / `False` renk kodlaması
- [x] "Benzer olay ortalaması" tahmin fonksiyonu — `compute_category_prediction` (Postgres, `0003_prediction_engine.sql`) + `src/lib/predictions.ts`. Kategori eşleşmesiyle gerçekten hesaplıyor (embedding yok, vektörel değil); örnek sayısı 2'nin altındaysa uydurma aralık yerine "yeterli veri yok" gösteriyor. Olay detay sayfasında canlı RPC çağrısıyla doğrulandı (Tesla/NOVA/XHOLD: 0 örnek, Apple: Nvidia'dan 1 örnek — ikisi de doğru şekilde "yetersiz" işaretleniyor).
- [x] Responsive tasarım (Tailwind `sm:` breakpoint'leri ile) — 375px mobil viewport'ta tarayıcıda test edildi, konsol hatası yok
- [x] Boş durum ekranı ("Henüz kayıtlı olay yok...")
- [x] Hata/kurulum eksik durumu ekranı (env değişkeni veya DB bağlantı hatası için)
- [x] Yükleme durumu ekranı (`src/app/loading.tsx`, `src/app/events/[code]/loading.tsx` — iskelet/skeleton UI)
- [x] Yasal uyarı bileşeni: layout footer'ında ve her sayfada "yatırım tavsiyesi değildir" ibaresi

## Faz 2 — Söylenti Motoru (Rumor Engine)

- [ ] `rumor_tracking` durum makinesi — tablo ve seed verisi 3 aşamayı (rumor→unverified→confirmed) **gösteriyor**, ama geçişleri uygulayan/doğrulayan bir kod yok; sadece statik kayıtlar okunuyor. **Bilinçli olarak ertelendi:** gerçek bir geçiş mekanizması (admin aksiyonu mu, zamanlanmış job mı?) auth/admin yüzeyi gerektiriyor, o olmadan yapılırsa uydurma olur.
- [x] Kaynak doğruluk oranı hesaplama fonksiyonu — `compute_source_accuracy` (Postgres, `0004_source_accuracy.sql`) + `src/lib/sources.ts`. Kaynağın sonuçlanmış (confirmed/false) olaylarındaki gerçek doğruluk yüzdesini hesaplıyor; 3'ten az sonuçlanmış olay varsa "yeterli veri yok" gösteriyor (uydurma seed değeri değil). Reddit (18/100 güven, 1 sonuçlanmış olay) ve Bloomberg (97/100, 1 sonuçlanmış olay) ile tarayıcıda doğrulandı.
- [ ] ⛔ Sosyal medya kaynak entegrasyonları (Reddit API, X API, Telegram) — API erişim onayı gerekir
- [x] Gürültü filtresi: `isNoiseFlagged` (`src/lib/sources.ts`) — güven skoru <30 VE (doğruluk verisi yok ya da <%50) olan kaynakları "Yüksek Yanlış Olasılığı" ile işaretliyor. Reddit'te (güven 18) doğru şekilde tetikleniyor, Bloomberg'de (güven 97) tetiklenmiyor — tarayıcıda doğrulandı.
- [x] Söylenti yaşam döngüsü zaman çizelgesi UI bileşeni (`RumorTimeline`, olay detay sayfasında) — canlı veriyle doğrulandı (Apple senaryosu)

## Faz 3 — Yerel Piyasa (KAP / BIST)

- [ ] ⛔ KAP açık veri servisi entegrasyonu (bildirim polling) — **yapılmadı**
- [ ] Seans içi/seans dışı bildirim zamanlama mantığı — **yapılmadı** (KAP senaryosu seed'de statik olarak var, otomatik mantık yok)
- [x] BIST varlık evreni — şema `market`/`currency` alanlarını destekliyor, seed'de tek bir kurgusal BIST hissesi (XHOLD/TRY) var; gerçek BIST evreni henüz yok
- [x] Çoklu para birimi gösterimi (USD/TRY `formatPrice` ile çalışıyor) — çoklu borsa filtreleme/gruplama UI'da henüz yok

## Faz 4 — Zincirleme Etki ve Portföy Perspektifi

- [x] `event_assets` ilişki tablosu (`birincil`/`rakip`/`tedarikci`/`sektor_paydasi`) — planlanan `related_assets` yerine olay bazlı ilişki olarak modellendi
- [ ] Zincirleme etki **hesaplama** — görselleştirme var (Nvidia senaryosu, olay detay sayfasında NVDA/TSM/AMD/SMCI tablosu canlı veriyle doğrulandı), ama hesaplayan bir algoritma yok, veriler statik seed
- [ ] Kullanıcı portföyü (izleme listesi) ve portföye özel bildirim filtresi — **yapılmadı**

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

**Faz 0 tamamlandı.** **Faz 1 tamamlandı** — tahmin hesaplaması artık gerçek kod (kategori eşleşmesi, `compute_category_prediction`), yükleme/boş/hata durumları var, mobilde test edildi. Kalan tek gerçek boşluk: benzer olay araması hâlâ vektörel değil, kategori bazlı (embedding Faz 5'i bekliyor) — bu bilinçli bir ara adım, olay detay sayfasında açıkça etiketleniyor.

**Faz 2** artık büyük ölçüde tamamlandı — kaynak doğruluk hesaplaması ve gürültü filtresi gerçek kod, tarayıcıda doğrulandı. Kalan tek parça (bilinçli olarak ertelendi): `rumor_tracking` durum geçişlerini tetikleyen bir yazma mekanizması — bunun için auth/admin yüzeyi gerekiyor. **Faz 3/5** büyük ölçüde başlanmadı; **Faz 4**'te sadece statik görselleştirme var, hesaplama yok.

**Canlı durum:** https://ziya.cicibyte.com — gerçek Supabase verisiyle çalışıyor, GitHub'a push edildi, Vercel env değişkenleri ayarlı, `compute_category_prediction` ve `compute_source_accuracy` migration'ları uygulandı.

**Sıradaki en anlamlı iş:** Faz 4 — zincirleme etki hesaplaması (aynı istatistiksel desenin `event_assets.relation` üzerinden genişletilmesi: rakip/tedarikçi/sektör paydaşının geçmişte benzer olaylarda ortalama nasıl tepki verdiğini hesaplamak).

---

## Alan Adı Kurulumu — `ziya.cicibyte.com` (Vercel + Cloudflare) ✅ Tamamlandı

Referans için bırakıldı — bu adımlar kullanıcı tarafından tamamlandı, domain canlı ve SSL geçerli.

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
