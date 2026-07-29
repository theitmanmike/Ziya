# Ziya — Yapılacaklar Listesi (TODO)

> Bu dosya, [Proje Dosyası.md](../Proje%20Dosyası.md)'nda tanımlanan mimariyi ve gerçek hayat senaryolarını **çalışan bir ürüne** dönüştürmek için fazlara bölünmüş mühendislik yol haritasıdır. Her madde işaretlenebilir (checkbox) bir iş birimidir. Kapsam dışı / dış bağımlılık gerektiren maddeler `⛔` ile işaretlenmiştir.

**Teknoloji yığını kararı:**

| Katman | Seçim | Gerekçe |
|---|---|---|
| Frontend/Framework | Next.js 16 (App Router, TypeScript, Turbopack) | Vercel ile birebir entegre, SSR + API routes tek repoda |
| Stil / UI | Tailwind CSS v4 (elle yazılmış bileşenler) | shadcn/ui kurulumu non-interaktif ortamda risk taşıdığı için elle, Tailwind üzerine yazılan sade bileşenlerle ilerlendi — bkz. Faz 0 notu |
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

- [x] GitHub reposu bağlantısı doğrulandı ve düzeltildi (`origin` → [theitmanmike/Ziya](https://github.com/theitmanmike/Ziya), eski `RealMrNovember/Ziya` clone artık `origin-realmrnovember` remote'u olarak duruyor)
- [x] Next.js + TypeScript + Tailwind proje iskeletini oluştur
- [x] ~~shadcn/ui bileşen kütüphanesini kur~~ — **karardan vazgeçildi.** Non-interaktif ortamda CLI kurulumu risk taşıdığından, `src/components/` altında Tailwind ile elle yazılmış sade bileşenler (Badge, TrustBadge, StatusBadge, ChangeValue, EventCard, PredictionSummary, MarketContextTable, RumorTimeline) kullanıldı.
- [x] ESLint yapılandırması (create-next-app varsayılanı, `npx eslint .` temiz geçiyor)
- [ ] Prettier kurulumu — **yapılmadı**, henüz proje genelinde format standardı yok
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
- [ ] "Benzer olay ortalaması" tahmin fonksiyonu — **yapılmadı.** `predictions` tablosundaki değerler şu an sabit seed verisi; hiçbir kod bunları hesaplamıyor. Gerçek bir "motor" değil, statik gösterim.
- [x] Responsive tasarım (Tailwind `sm:` breakpoint'leri ile) — mobil görünüm tarayıcıda görsel olarak test edilmedi, sadece kod seviyesinde uygulandı
- [x] Boş durum ekranı ("Henüz kayıtlı olay yok...")
- [x] Hata/kurulum eksik durumu ekranı (env değişkeni veya DB bağlantı hatası için)
- [ ] Yükleme durumu ekranı (`loading.tsx`) — **yapılmadı**
- [x] Yasal uyarı bileşeni: layout footer'ında ve her sayfada "yatırım tavsiyesi değildir" ibaresi

## Faz 2 — Söylenti Motoru (Rumor Engine)

- [ ] `rumor_tracking` durum makinesi — tablo ve seed verisi 3 aşamayı (rumor→unverified→confirmed) **gösteriyor**, ama geçişleri uygulayan/doğrulayan bir kod yok; sadece statik kayıtlar okunuyor
- [ ] Kaynak doğruluk oranı hesaplama fonksiyonu — **yapılmadı**, `source_accuracy_score` seed'de elle girilmiş sabit değer
- [ ] ⛔ Sosyal medya kaynak entegrasyonları (Reddit API, X API, Telegram) — API erişim onayı gerekir
- [ ] Gürültü filtresi: düşük güven skorlu kaynaklardan gelen olaylar için "Yüksek Yanlış Olasılığı" etiketi — **yapılmadı**
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

**Faz 0 tamamlandı** (Prettier hariç — bkz. yukarı). **Faz 1'in çoğu tamamlandı**; kalan gerçek boşluk: benzer olay araması UI'da pasif (embedding yok) ve tahminler statik seed veri, hesaplayan bir kod yok. **Faz 2**'den yalnızca UI kısmı (zaman çizelgesi) var, motor mantığı (durum makinesi, doğruluk hesaplama, gürültü filtresi) yok. **Faz 3/4/5** büyük ölçüde başlanmadı; Faz 4'te sadece görselleştirme var, hesaplama yok.

**Canlı durum:** https://ziya.cicibyte.com — gerçek Supabase verisiyle çalışıyor, GitHub'a push edildi, Vercel env değişkenleri ayarlı.

**Sıradaki en anlamlı iş:** Faz 1'i gerçekten bitirmek —
1. `loading.tsx` ekle
2. Tahmin hesaplama fonksiyonunu gerçek koda dönüştür (şu an tamamen statik)
3. Prettier kurulumu
4. Mobil görünümü tarayıcıda gerçekten test et

— Faz 2/4'ün "motor" kısımlarına (hesaplama, durum makinesi) geçmeden önce.

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
