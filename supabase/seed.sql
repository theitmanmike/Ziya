-- Ziya — Demo Seed Verisi
-- Proje Dosyası.md Bölüm 4'teki 5 gerçek hayat senaryosunu gerçek tablo
-- satırlarına döker. NOVA ve XHOLD kurgusal varlıklardır (gerçek şirket
-- değildir) — anomali/yerel piyasa senaryolarını gerçek bir şirkete
-- atfetmemek için bilinçli olarak uydurulmuştur.
--
-- Not: embedding sütunları burada NULL bırakılmıştır; gerçek vektör
-- değerleri Faz 5'te bir embedding API'si (OpenAI vb.) bağlandığında
-- üretilecektir.

-- ============================================================
-- SOURCES
-- ============================================================
insert into sources (id, name, type, trust_score) values
  ('a1111111-1111-1111-1111-111111111101', 'Bloomberg', 'kurumsal_haber_ajansi', 97),
  ('a1111111-1111-1111-1111-111111111102', 'KAP (Kamuyu Aydınlatma Platformu)', 'resmi', 100),
  ('a1111111-1111-1111-1111-111111111103', 'Reddit — r/stocks (anonim kullanıcı)', 'sosyal_forum', 18),
  ('a1111111-1111-1111-1111-111111111104', 'Şirket Bilanço Açıklaması', 'resmi', 95),
  ('a1111111-1111-1111-1111-111111111105', 'Nvidia Resmi Basın Bülteni', 'resmi', 100)
on conflict (id) do nothing;

-- ============================================================
-- ASSETS
-- ============================================================
insert into assets (id, ticker, name, market, currency) values
  ('b2222222-2222-2222-2222-222222222201', 'TSLA', 'Tesla, Inc.', 'NASDAQ', 'USD'),
  ('b2222222-2222-2222-2222-222222222202', 'AAPL', 'Apple Inc.', 'NASDAQ', 'USD'),
  ('b2222222-2222-2222-2222-222222222203', 'NOVA', 'Nova Teknoloji A.Ş. (kurgusal — demo amaçlı)', 'NASDAQ', 'USD'),
  ('b2222222-2222-2222-2222-222222222204', 'XHOLD', 'X Holding A.Ş. (kurgusal — demo amaçlı)', 'BIST', 'TRY'),
  ('b2222222-2222-2222-2222-222222222205', 'NVDA', 'NVIDIA Corporation', 'NASDAQ', 'USD'),
  ('b2222222-2222-2222-2222-222222222206', 'TSM', 'Taiwan Semiconductor Manufacturing Co.', 'NYSE', 'USD'),
  ('b2222222-2222-2222-2222-222222222207', 'AMD', 'Advanced Micro Devices, Inc.', 'NASDAQ', 'USD'),
  ('b2222222-2222-2222-2222-222222222208', 'SMCI', 'Super Micro Computer, Inc.', 'NASDAQ', 'USD')
on conflict (id) do nothing;

-- ============================================================
-- EVENTS
-- ============================================================
insert into events (id, event_code, occurred_at, source_id, category, headline, summary, sentiment_label, sentiment_score, status) values
  (
    'c3333333-3333-3333-3333-333333333301',
    'EVT-2026-0112-004731',
    '2026-01-12 15:31:00+00',
    'a1111111-1111-1111-1111-111111111101',
    'Kapasite Yatırımı',
    'Tesla Hindistan''da Fabrika Kuracağını Açıkladı',
    'Tesla, Hindistan pazarında üretim tesisi kuracağını duyurdu. Yeni pazar yatırımı olarak sınıflandırıldı.',
    'pozitif',
    0.820,
    'confirmed'
  ),
  (
    'c3333333-3333-3333-3333-333333333302',
    'EVT-2026-0206-118842',
    '2026-02-06 21:15:00+00',
    'a1111111-1111-1111-1111-111111111103',
    'Ürün Lansmanı',
    'Reddit''te Apple ''Vision Pro 2'' Sızıntısı İddiası',
    'Anonim bir Reddit kullanıcısı, Apple''ın önümüzdeki ay Vision Pro 2''yi tanıtacağını iddia etti. Başlangıçta hiçbir resmî kaynakta doğrulanmadı.',
    'pozitif',
    0.400,
    'confirmed'
  ),
  (
    'c3333333-3333-3333-3333-333333333303',
    'EVT-2026-0310-227310',
    '2026-03-10 21:05:00+00',
    'a1111111-1111-1111-1111-111111111104',
    'Bilanço Açıklaması',
    'NOVA Beklentinin Altında Bilanço Açıkladı — Hisse Buna Rağmen Yükseldi',
    'Orta ölçekli bir teknoloji şirketi beklentinin altında bilanço açıkladı; normalde düşüş beklenirken hisse ilk yarım saatte belirgin şekilde yükseldi. %38 açık pozisyon oranıyla eşleşen desen, olası bir short squeeze''e işaret ediyor.',
    'negatif',
    -0.600,
    'confirmed'
  ),
  (
    'c3333333-3333-3333-3333-333333333304',
    'EVT-2026-0403-339104',
    '2026-04-03 18:45:00+00',
    'a1111111-1111-1111-1111-111111111102',
    'Sermaye Artırımı',
    'XHOLD %400 Bedelsiz Sermaye Artırımı Bildirdi',
    'Seans sonrası KAP''a düşen bildirimde, holding %400 oranında bedelsiz sermaye artırımı yapacağını duyurdu.',
    'pozitif',
    0.700,
    'confirmed'
  ),
  (
    'c3333333-3333-3333-3333-333333333305',
    'EVT-2026-0520-556213',
    '2026-05-20 14:00:00+00',
    'a1111111-1111-1111-1111-111111111105',
    'Ürün Lansmanı',
    'Nvidia Yeni Nesil Yapay Zekâ Hızlandırıcı Çipini Tanıttı',
    'Nvidia''nın yeni çip lansmanı yalnızca kendi hissesini değil, tüm yarı iletken/AI sunucu ekosistemini ilgilendiriyor.',
    'pozitif',
    0.780,
    'confirmed'
  )
on conflict (id) do nothing;

-- ============================================================
-- EVENT_ASSETS
-- ============================================================
insert into event_assets (event_id, asset_id, relation) values
  ('c3333333-3333-3333-3333-333333333301', 'b2222222-2222-2222-2222-222222222201', 'birincil'),
  ('c3333333-3333-3333-3333-333333333302', 'b2222222-2222-2222-2222-222222222202', 'birincil'),
  ('c3333333-3333-3333-3333-333333333303', 'b2222222-2222-2222-2222-222222222203', 'birincil'),
  ('c3333333-3333-3333-3333-333333333304', 'b2222222-2222-2222-2222-222222222204', 'birincil'),
  ('c3333333-3333-3333-3333-333333333305', 'b2222222-2222-2222-2222-222222222205', 'birincil'),
  ('c3333333-3333-3333-3333-333333333305', 'b2222222-2222-2222-2222-222222222206', 'tedarikci'),
  ('c3333333-3333-3333-3333-333333333305', 'b2222222-2222-2222-2222-222222222207', 'rakip'),
  ('c3333333-3333-3333-3333-333333333305', 'b2222222-2222-2222-2222-222222222208', 'sektor_paydasi')
on conflict (event_id, asset_id) do nothing;

-- ============================================================
-- MARKET_CONTEXT
-- ============================================================

-- Senaryo 1 — Tesla (Proje Dosyası Bölüm 5.2'deki matrisle birebir)
insert into market_context (event_id, asset_id, offset_label, captured_at, price, change_pct, volume_state) values
  ('c3333333-3333-3333-3333-333333333301', 'b2222222-2222-2222-2222-222222222201', 'T0-1h', '2026-01-12 14:31:00+00', 241.12, 0.00, 'stabil'),
  ('c3333333-3333-3333-3333-333333333301', 'b2222222-2222-2222-2222-222222222201', 'T0',    '2026-01-12 15:31:00+00', 247.54, 2.67, 'ani_hacim_artisi'),
  ('c3333333-3333-3333-3333-333333333301', 'b2222222-2222-2222-2222-222222222201', 'T0+24h','2026-01-13 15:31:00+00', 255.00, 5.76, 'yuksek'),
  ('c3333333-3333-3333-3333-333333333301', 'b2222222-2222-2222-2222-222222222201', 'T0+1w', '2026-01-19 15:31:00+00', 267.00, 10.71, 'trend_olusumu');

-- Senaryo 3 — NOVA (short squeeze deseni; T0+24h ilk yarım saatteki +%8 tepkiyi ve devamını temsil eder)
insert into market_context (event_id, asset_id, offset_label, captured_at, price, change_pct, volume_state) values
  ('c3333333-3333-3333-3333-333333333303', 'b2222222-2222-2222-2222-222222222203', 'T0-1h', '2026-03-10 20:05:00+00', 54.20, 0.00, 'stabil'),
  ('c3333333-3333-3333-3333-333333333303', 'b2222222-2222-2222-2222-222222222203', 'T0',    '2026-03-10 21:05:00+00', 58.54, 8.00, 'ani_hacim_artisi'),
  ('c3333333-3333-3333-3333-333333333303', 'b2222222-2222-2222-2222-222222222203', 'T0+24h','2026-03-11 21:05:00+00', 59.80, 10.33, 'yuksek'),
  ('c3333333-3333-3333-3333-333333333303', 'b2222222-2222-2222-2222-222222222203', 'T0+1w', '2026-03-17 21:05:00+00', 51.90, -4.24, 'trend_olusumu');

-- Senaryo 4 — XHOLD (KAP bildirimi seans dışı geldiği için T0 fiyatı T0-1h ile aynı)
insert into market_context (event_id, asset_id, offset_label, captured_at, price, change_pct, volume_state) values
  ('c3333333-3333-3333-3333-333333333304', 'b2222222-2222-2222-2222-222222222204', 'T0-1h', '2026-04-03 17:45:00+00', 88.50, 0.00, 'stabil'),
  ('c3333333-3333-3333-3333-333333333304', 'b2222222-2222-2222-2222-222222222204', 'T0',    '2026-04-03 18:45:00+00', 88.50, 0.00, 'stabil'),
  ('c3333333-3333-3333-3333-333333333304', 'b2222222-2222-2222-2222-222222222204', 'T0+24h','2026-04-06 10:15:00+00', 95.07, 7.42, 'yuksek'),
  ('c3333333-3333-3333-3333-333333333304', 'b2222222-2222-2222-2222-222222222204', 'T0+1w', '2026-04-13 18:45:00+00', 90.20, 1.92, 'trend_olusumu');

-- Senaryo 5 — Nvidia zincirleme etki (T0 baz alınarak 1 haftalık ortalama tepkiler)
insert into market_context (event_id, asset_id, offset_label, captured_at, price, change_pct, volume_state) values
  ('c3333333-3333-3333-3333-333333333305', 'b2222222-2222-2222-2222-222222222205', 'T0',    '2026-05-20 14:00:00+00', 875.00, 0.00, 'ani_hacim_artisi'),
  ('c3333333-3333-3333-3333-333333333305', 'b2222222-2222-2222-2222-222222222205', 'T0+1w', '2026-05-27 14:00:00+00', 920.50, 5.20, 'trend_olusumu'),
  ('c3333333-3333-3333-3333-333333333305', 'b2222222-2222-2222-2222-222222222206', 'T0',    '2026-05-20 14:00:00+00', 145.00, 0.00, 'stabil'),
  ('c3333333-3333-3333-3333-333333333305', 'b2222222-2222-2222-2222-222222222206', 'T0+1w', '2026-05-27 14:00:00+00', 148.05, 2.10, 'yuksek'),
  ('c3333333-3333-3333-3333-333333333305', 'b2222222-2222-2222-2222-222222222207', 'T0',    '2026-05-20 14:00:00+00', 178.00, 0.00, 'stabil'),
  ('c3333333-3333-3333-3333-333333333305', 'b2222222-2222-2222-2222-222222222207', 'T0+1w', '2026-05-27 14:00:00+00', 174.80, -1.80, 'yuksek'),
  ('c3333333-3333-3333-3333-333333333305', 'b2222222-2222-2222-2222-222222222208', 'T0',    '2026-05-20 14:00:00+00', 42.00, 0.00, 'stabil'),
  ('c3333333-3333-3333-3333-333333333305', 'b2222222-2222-2222-2222-222222222208', 'T0+1w', '2026-05-27 14:00:00+00', 43.43, 3.40, 'yuksek');

-- ============================================================
-- PREDICTIONS
-- ============================================================
insert into predictions (id, event_id, asset_id, horizon, expected_change_low, expected_change_high, confidence, basis_event_count, method) values
  ('d4444444-4444-4444-4444-444444444401', 'c3333333-3333-3333-3333-333333333301', 'b2222222-2222-2222-2222-222222222201', '24s', 3.500, 5.500, 84, 14, 'benzer_olay_ortalamasi'),
  ('d4444444-4444-4444-4444-444444444402', 'c3333333-3333-3333-3333-333333333305', 'b2222222-2222-2222-2222-222222222205', '1h', 3.800, 6.600, 79, 9, 'zincirleme_etki_ortalamasi')
on conflict (id) do nothing;

-- ============================================================
-- OUTCOMES
-- ============================================================
insert into outcomes (prediction_id, actual_change_pct, measured_at, absolute_error) values
  ('d4444444-4444-4444-4444-444444444401', 5.760, '2026-01-13 15:31:00+00', 1.260),
  ('d4444444-4444-4444-4444-444444444402', 5.200, '2026-05-27 14:00:00+00', 0.000);

-- ============================================================
-- RUMOR_TRACKING — Senaryo 2 (Apple Vision Pro 2) yaşam döngüsü
-- ============================================================
insert into rumor_tracking (event_id, stage, source_accuracy_score, note, updated_at) values
  ('c3333333-3333-3333-3333-333333333302', 'rumor', 18.00, 'Reddit r/stocks üzerinde anonim kullanıcı iddiası — hiçbir resmî kaynakta yok.', '2026-02-06 21:15:00+00'),
  ('c3333333-3333-3333-3333-333333333302', 'unverified', 55.00, 'Doğrulanmış bir X (Twitter) teknoloji muhabiri iddiayı paylaştı; birleşik güven skoru yükseldi.', '2026-02-08 21:15:00+00'),
  ('c3333333-3333-3333-3333-333333333302', 'confirmed', 87.00, 'Apple resmî lansman davetiyesi gönderdi. Bu kaynak zincirinin (Reddit → doğrulanmış muhabir → resmî duyuru) tarihsel doğruluk oranı: %87.', '2026-02-15 09:00:00+00');
