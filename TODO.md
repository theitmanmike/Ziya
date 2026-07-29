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
- [x] Zincirleme etki **hesaplama** — `compute_category_relation_prediction` (Postgres, `0005_chain_effect.sql`) + `src/lib/chainEffect.ts`, `compute_category_prediction`'ın ilişki tipine (rakip/tedarikçi/sektör paydaşı) göre genelleştirilmiş hali. Ortak istatistik/güven formülü `src/lib/statUtils.ts`'e çıkarıldı (predictions.ts ile paylaşılıyor). Nvidia senaryosunda TSM ("Tedarikçi") ve AMD ("Rakip") için tarayıcıda doğrulandı — her ikisi de doğru şekilde "0 örnek" gösteriyor (bu ilişki tipleri Event Memory'de henüz tek örnekli).
- [ ] Kullanıcı portföyü (izleme listesi) ve portföye özel bildirim filtresi — **yapılmadı**

## Faz 5 — Gerçek Veri Entegrasyonu ve Kurumsal API

- [ ] ⛔ Piyasa verisi sağlayıcı entegrasyonu (Alpha Vantage/Finnhub) — API anahtarı ile
- [ ] ⛔ Haber akışı entegrasyonu (NewsAPI/RSS) — API anahtarı ile
- [x] ⛔→🟡 Embedding üretimi — `OPENAI_API_KEY` alındı, `scripts/backfill-embeddings.ts` (`npm run embeddings:backfill`) yazıldı ve test edildi. **Bloke:** OpenAI hesabında kota/billing yok (`insufficient_quota` hatası) — kullanıcı platform.openai.com/account/billing'den bakiye/ödeme yöntemi eklemeli. Eklendiğinde tek komutla (`npm run embeddings:backfill`) 5 olay için embedding üretilip `match_events` aktif olacak.
- [ ] Cron/Edge Function ile periyodik olay yakalama (Supabase Edge Functions veya Vercel Cron)
- [ ] Gerçekleşme takibi job'ı: T0+1s / T0+24s / T0+1h fiyatlarını otomatik çek ve `outcomes` tablosunu güncelle
- [ ] Model güncelleme döngüsü: tahmin hatası (MAE) hesaplama ve zaman içi izleme
- [ ] Genel Kullanıma Açık API (REST) + API key yönetimi
- [ ] Webhook desteği (kurumsal müşteriler için)

## Faz 6 — Üyelik, Admin Panel ve Paket Sistemi (Platform Katmanı)

Kullanıcı talebi üzerine 2026-07-29'da eklendi: bir "platform" için üyelik/admin/paket
sistemi olmadan bitmiş sayılamayacağı belirtildi. Faz 2'de "auth yüzeyi yok" diye
ertelenen rumor durum geçişi de burada gerçek karşılığını buldu.

- [x] Supabase Auth (e-posta/şifre) + oturum yönetimi — `src/proxy.ts` (Next.js 16'da `middleware.ts` → `proxy.ts`), her istekte token yeniler
- [x] `profiles` tablosu (`role`: member/admin, `subscription_tier`: free/pro/kurumsal) — `0006_profiles_and_roles.sql`, `auth.users` insert'inde otomatik oluşturan trigger, `is_admin()` security-definer fonksiyonuyla özyinelemesiz RLS
- [x] Giriş/Kayıt sayfaları (`/login`, `/signup`) — **uçtan uca canlı doğrulandı:** gerçek kullanıcı oluşturuldu, trigger ile `profiles` satırı otomatik oluştuğu doğrulandı, giriş yapıldı, header state'i doğru güncellendi, yanlış şifre/geçersiz e-posta/rate-limit hata mesajları doğru gösterildi
- [x] Header'da auth durumu (`AuthNav`) — giriş yapılmamışsa "Giriş Yap", yapılmışsa e-posta + "Çıkış Yap" + (admin ise) "Admin" linki
- [x] Admin paneli (`/admin`) — `role=admin` ile korumalı, **deny yolu canlıda doğrulandı** (member kullanıcı erişemiyor). Allow yolu (gerçek admin kullanıcıyla) kod incelemesiyle doğru ama otomatik test edilemedi — DB'ye rol yazan komut güvenlik sınıflandırıcısı tarafından bloklandı; kullanıcı kendi hesabını SQL Editor'de `update profiles set role='admin' where email='...'` ile admin yapıp test edebilir
  - [x] İlk gerçek admin yeteneği: **rumor durum geçişi ekleme** (`src/app/admin/actions.ts`) — Faz 2'de ertelenen "auth/admin yüzeyi" burada çözüldü
  - [ ] Kaynak yönetimi (sources CRUD) — yapılmadı
  - [ ] Kullanıcı listesi / rol değiştirme UI'ı — yapılmadı, şu an rol değişikliği yalnızca doğrudan SQL ile
- [x] Fiyatlandırma sayfası (`/pricing`) — Free/Pro/Kurumsal, Proje Dosyası Bölüm 2.3'teki hedef kitleye göre
- [ ] ⛔ Stripe entegrasyonu (gerçek ödeme) — API anahtarı gerektirir. Şema (`profiles.subscription_tier`) ve UI hazır, **feature gating (paket seviyesine göre erişim kısıtlama) henüz uygulanmadı** — Free kullanıcı da şu an Pro özelliklerini görebiliyor, bu dürüstçe fiyatlandırma sayfasında belirtildi

## ⭐ Showcase / Karşılama Sayfası — ✅ Tamamlandı (2026-07-29)

`/` artık bir showcase/landing sayfası; olay akışı `/dashboard`'a taşındı. Tamamı
tarayıcıda canlı doğrulandı (giriş yapmamış kullanıcı showcase görüyor, giriş yapmış
kullanıcı `/`'ye gidince otomatik `/dashboard`'a yönleniyor, login/signup doğrudan
`/dashboard`'a düşüyor).

- [x] Hero bölümü: logo, değer önerisi başlığı, CTA'lar (`Ücretsiz Kayıt Ol`, `Olay Akışını İncele`)
- [x] "Nasıl Çalışır" — 4 adımlı döngü (Proje Dosyası Bölüm 5/7'ye dayalı)
- [x] Gerçek hayat senaryolarından örnekler — Tesla/Apple/Nvidia, **canlı veritabanından** (statik mockup değil, `getEvents()` ile gerçek `EventCard`'lar)
- [x] Özellik vitrini: Event Memory, Rumor Engine, Zincirleme Etki, canlı hesaplanan tahmin
- [x] Paketler özeti → `/pricing`'e link
- [x] Net CTA: "Ücretsiz Kayıt Ol" → `/signup`
- [x] Giriş yapmış kullanıcı `/`'ye geldiğinde `/dashboard`'a yönleniyor (`redirect()`, `getCurrentUser()` ile), showcase yalnızca ziyaretçiler için
- [x] Olay akışı `/dashboard`'a taşındı; header'daki "Olay Akışı" linki güncellendi; login/signup sonrası yönlendirme de `/dashboard`'a düzeltildi

## Faz 7 — Profesyonel Admin & Müşteri Paneli (kullanıcı talebi 2026-07-29)

Kullanıcı, mevcut admin panelinin (yalnızca rumor durumu ekleme) yetersiz olduğunu,
sistemi **gerçekten yöneten** bir admin paneli istediğini belirtti: akış ayarları,
API adresleri, haber kanalları, müşteriler, paketler. Ayrıca müşteri girişinde de
benzer kalitede bir panel istendi.

- [ ] Ortak admin layout (`/admin/layout.tsx`) — auth+rol kontrolü tek yerde, sol nav (Genel Bakış/Kaynaklar/Müşteriler/Paketler/Entegrasyonlar)
- [ ] **Kaynaklar (haber kanalları)** — `/admin/sources`: ekle/düzenle/sil, `trust_score` yönetimi. Bu tablo zaten `compute_source_accuracy` ve gürültü filtresinin girdisi — gerçek etkisi var.
- [ ] **Müşteriler** — `/admin/customers`: tüm `profiles` listesi (RLS zaten `is_admin()` ile admin'e tüm satırları açıyor), rol (member/admin) ve paket seviyesi (free/pro/kurumsal) değiştirme.
- [ ] **Paketler** — `/admin/pricing`: `pricing_tiers` + `pricing_tier_features` tabloları (yeni migration), admin'den düzenlenebilir. `/pricing` sayfası artık DB'den okuyor (statik dizi değil).
- [ ] **Entegrasyon Durumu** — `/admin/integrations`: hangi API anahtarlarının (OpenAI/Finnhub/Alpha Vantage/NewsAPI/GNews/Guardian/Marketaux/Currents) ortamda tanımlı olduğunu gösteren **salt okunur** durum sayfası.
- [ ] **"API adresleri" — bilinçli olarak sınırlı tutuldu.** Gerçek API anahtarları asla veritabanına/admin panelinden düzenlenebilir bir alana taşınmamalı (env var'lar zaten doğru yer — sızıntı riski). Admin panelinde sadece _durum_ gösteriliyor, anahtarların kendisi değil. Anahtarları değiştirmek isteyen kullanıcı `.env.local` + Vercel env değişkenlerini güncellemeli.
- [ ] **"Akış ayarları" — kapsamı netleştirilmedi.** Şu an gerçek bir ingestion pipeline (Faz 5) olmadığı için "akış ayarı" (örn. sayfa başına olay sayısı, otomatik güncelleme sıklığı) gibi ayarların gerçek bir karşılığı yok — spekülatif bir ayarlar sayfası kurmak yerine, Faz 5'in ilk gerçek entegrasyonu yazılınca birlikte ele alınacak.
- [ ] **Müşteri Paneli** — `/account`: profil bilgisi (e-posta, kayıt tarihi), paket seviyesi rozeti, ad-soyad düzenleme (kendi profilini güncelleyen tek self-service alan — `role`/`subscription_tier` kasıtlı olarak kullanıcıya kapalı, yalnızca admin değiştirebilir).

## Sürekli / Yatay Konular

- [x] Kimlik doğrulama (Supabase Auth — e-posta + OAuth) — bkz. Faz 6, e-posta/şifre tamamlandı; OAuth (Google vb.) henüz yok
- [ ] Kullanıcı ayarları: izlenen varlıklar, bildirim tercihleri — auth artık var ama bu özellik henüz yapılmadı
- [x] Test altyapısı: birim testleri (Vitest) — `statUtils.ts`'teki gerçek hesaplama mantığı (`toLivePrediction`, `isNoiseFlagged`) için 11 test, hepsi geçiyor. Uçtan uca testler (Playwright) **henüz yok**.
- [x] CI/CD: GitHub Actions (`.github/workflows/ci.yml`) — her push/PR'da format kontrolü + lint + test + build; hiçbir secret gerektirmiyor (doğrulandı: `.env.local` olmadan build başarılı). Vercel zaten GitHub entegrasyonu üzerinden otomatik deploy ediyor. **Bloke:** bu dosyayı push etmek için GitHub token'ının `workflow` scope'u gerekiyor, kullanıcının bir device-code onayı bekleniyor (bkz. "Şu An Neredeyiz").
- [ ] Hata izleme (Sentry veya eşdeğeri) — ⛔ Sentry DSN/API anahtarı gerektirir
- [ ] Performans: sayfa yükleme, veritabanı sorgu indeksleri (`pgvector` ANN indeksi zaten `0002`'de var, veri arttıkça `REINDEX` gerekebilir)
- [x] Erişilebilirlik (a11y) hızlı geçiş — skip-to-content linki, semantik landmark'lar (header/nav/main/footer), form label'ları, auth hata/bilgi mesajlarında `aria-live="polite"`. Kapsamlı bir a11y denetimi (axe/Lighthouse) **yapılmadı**.
- [x] Yasal/uyumluluk metinleri: `/terms` ve `/privacy` sayfaları (Proje Dosyası Bölüm 10'a dayalı), footer'da linkli
- [ ] Çoklu dil desteği (TR/EN) — opsiyonel
- [x] Olay kartlarında canlı göreli süre ("5 dk önce") — `RelativeTime` bileşeni, 30 saniyede bir kendini güncelliyor, dashboard ve olay detay sayfasında
- [x] Ek ücretsiz haber API anahtarları alındı ve `.env.local`/Vercel'e eklendi: GNews, The Guardian, Marketaux, Currents — **henüz hiçbiri kodda kullanılmıyor**, sadece yapılandırıldı (Faz 5'in haber akışı entegrasyonu adımını bekliyor)

---

## Şu An Neredeyiz?

**Faz 0, 1, 2 (motor kısmı), 4 (hesaplama kısmı) tamamlandı.** **Faz 6 (Üyelik/Admin/Paket) büyük ölçüde tamamlandı** ve canlıda uçtan uca doğrulandı. **Showcase/landing sayfası tamamlandı** ve doğrulandı. **Marka/logo** tasarlandı (bkz. aşağıdaki "Marka Kimliği" notu). **Faz 3 ve Faz 5'in çoğu** hâlâ başlanmadı (⛔ dış servisler).

**API anahtarları:** OpenAI, Finnhub, Alpha Vantage, NewsAPI, GNews, Guardian, Marketaux, Currents — hepsi alındı ve `.env.local` + Vercel'e eklendi. Embedding backfill scripti (`npm run embeddings:backfill`) yazıldı ama **OpenAI hesabında billing/kota olmadığı için çalışmıyor** (`insufficient_quota`). Diğer 7 anahtar henüz hiçbir kodda kullanılmıyor — sadece yapılandırıldı.

**Tek blokaj:** OpenAI billing — platform.openai.com/account/billing'den ödeme yöntemi eklenmeli, sonra `npm run embeddings:backfill` çalıştırılıp `match_events` aktif edilecek. (GitHub `workflow` scope onaylandı, push'lar artık sorunsuz.)

**Sıradaki en anlamlı iş:** README.md tamamlandıktan sonra — Faz 3 (KAP/BIST) ya da Faz 5 (gerçek veri) arasında kullanıcıya sorulmalı, ya da OpenAI billing eklenirse embedding/benzer olay araması tamamlanabilir.

---

## Marka Kimliği

**Logo** — `public/logo.svg` / `src/app/icon.svg` (favicon, isimsiz) / `src/components/Logo.tsx` (header lockup: ikon + "Ziya" yazısı). Konsept, kullanıcıyla 3 iterasyonda netleşti:

1. İlk deneme (genel güneş/ışın ikonu) reddedildi — "Ziya ile alakası yok" geri bildirimi alındı
2. "Mum grafiği" (candlestick chart) + alev — Türkçe'de "mum" hem kandil hem borsa mum grafiği anlamına geliyor
3. **Final:** Şüpheci bir göz (kalkık kaş) + göz bebeğinde küçük bir mum. İki Türkçe deyimi birleştiriyor: **"Sallama Ziya"** (abartılı/inanılmaz iddialara karşı şüphecilik — tam olarak Rumor Engine'in işlevi) ve **"yalancının mumu yatsıya kadar yanar"** (Ziya'nın mumu sönmez — sürekli, güvenilir aydınlatma). Tüm elemanlar (kaş/göz/mum) gradyan, parıltı ve gölgeyle 3D/cilalı bir yüzey hissi taşıyor.

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
