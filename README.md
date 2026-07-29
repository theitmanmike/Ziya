# Ziya

**Olay Odaklı Hisse Senedi Etki Tahmin Ajanı**

Ziya, piyasaya düşen her haberi geçmişteki binlerce benzer olayla karşılaştırıp
olası fiyat etkisini güven skoruyla birlikte sunan bir karar destek uygulamasıdır.
Mimari ve ürün vizyonu için [Proje Dosyası.md](../Proje%20Dosyası.md), yol haritası
için [TODO.md](TODO.md) dosyasına bakın.

> Sunulan tüm tahminler geçmiş olayların istatistiksel analizine dayanır ve
> **yatırım tavsiyesi değildir**.

## Teknoloji Yığını

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS v4**
- **Supabase** (Postgres + `pgvector` + Auth) — Event Memory ve benzer olay araması
- **Vercel** — hosting

## Kurulum

1. Bağımlılıkları yükleyin:

   ```bash
   npm install
   ```

2. `.env.example` dosyasını `.env.local` olarak kopyalayın ve Supabase
   Dashboard → **Settings → API** sayfasındaki bilgileri girin:

   ```bash
   cp .env.example .env.local
   ```

3. Supabase projesinde şemayı oluşturun — **SQL Editor**'de sırasıyla çalıştırın:
   - `supabase/migrations/0001_init_schema.sql`
   - `supabase/migrations/0002_similarity_search.sql`
   - `supabase/seed.sql` (Proje Dosyası'ndaki 5 gerçek hayat senaryosunu demo veri olarak yükler)

   (Supabase CLI kurulduysa alternatif olarak `supabase db push` kullanılabilir.)

4. Geliştirme sunucusunu başlatın:

   ```bash
   npm run dev
   ```

   [http://localhost:3000](http://localhost:3000) adresini açın.

## Komutlar

| Komut                  | Açıklama                         |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Geliştirme sunucusu (Turbopack)  |
| `npm run build`        | Prodüksiyon derlemesi            |
| `npm run start`        | Prodüksiyon sunucusu             |
| `npm run lint`         | ESLint kontrolü                  |
| `npm run format`       | Prettier ile kodu formatla       |
| `npm run format:check` | Formatı değiştirmeden kontrol et |

## Proje Yapısı

```
src/
  app/                # App Router sayfaları (dashboard, olay detay)
  components/         # UI bileşenleri (rozetler, tablolar, kartlar)
  lib/
    supabase/          # Browser/server Supabase client'ları + DB tipleri
    events.ts          # Olay verisi erişim katmanı
    format.ts           # Görüntüleme formatlayıcıları
supabase/
  migrations/          # SQL şema tanımları
  seed.sql             # Demo veri (5 gerçek hayat senaryosu)
```

## Dağıtım

Proje Vercel'e bağlıdır (`cicibyte/ziya`). Ortam değişkenlerini Vercel
proje ayarlarında da tanımlamayı unutmayın. Özel alan adı kurulumu için
[TODO.md](TODO.md) içindeki "Alan Adı Kurulumu" bölümüne bakın.
