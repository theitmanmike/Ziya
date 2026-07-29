# Ziya — Proje Dosyası

**Olay Odaklı Hisse Senedi Etki Tahmin Ajanı**

| | |
|---|---|
| **Proje Adı** | Ziya |
| **Doküman Türü** | Proje Tanım Dosyası (Project Definition Document) |
| **Sürüm** | v2.0 |
| **Tarih** | 28 Temmuz 2026 |
| **Durum** | Taslak — İç Değerlendirme |
| **Gizlilik** | Şirket İçi Kullanım |

---

## İçindekiler

1. [Yönetici Özeti](#1-yönetici-özeti)
2. [Problem Tanımı](#2-problem-tanımı)
3. [Çözüm Yaklaşımı ve Değer Önerisi](#3-çözüm-yaklaşımı-ve-değer-önerisi)
4. [Gerçek Hayat Senaryoları](#4-gerçek-hayat-senaryoları)
5. [Veri Modeli: Olay Kaydı (Event Object)](#5-veri-modeli-olay-kaydı-event-object)
6. [Temel Modüller](#6-temel-modüller)
7. [Sürekli Öğrenme Döngüsü](#7-sürekli-öğrenme-döngüsü)
8. [Sistem Mimarisi](#8-sistem-mimarisi)
9. [Başarı Kriterleri ve KPI'lar](#9-başarı-kriterleri-ve-kpılar)
10. [Riskler ve Yasal Uyumluluk](#10-riskler-ve-yasal-uyumluluk)
11. [Yol Haritası](#11-yol-haritası)
12. [Sözlük](#12-sözlük)

---

## 1. Yönetici Özeti

**Ziya**, hisse senedi fiyat hareketlerinin yalnızca teknik verilerden değil; haberler, söylentiler, sosyal medya dinamikleri, şirket olayları ve yatırımcı psikolojisinden kaynaklandığı tezi üzerine inşa edilmiş **otonom bir yapay zekâ ajanıdır**.

Sistem üç temel yetenek üzerine kuruludur:

1. **Olay Hafızası (Event Memory):** Dünya çapındaki finansal olayları, gerçekleştikleri andaki piyasa koşullarıyla birlikte kronolojik ve vektörel bir belleğe kaydeder.
2. **Benzer Olay Eşleştirme (Similar Event Retrieval):** Anlık gelen her haberi, geçmişteki binlerce benzer olayla vektörel benzerlik üzerinden karşılaştırır.
3. **Etki Tahmini (Impact Forecasting):** Haberin ilgili hisse üzerindeki olası **kısa (saatlik), orta (günlük) ve uzun (haftalık) vadeli** etkisini, güven skoru ile birlikte tahmin eder.

> **Önemli Not:** Ziya bir **karar destek sistemidir**; yatırım tavsiyesi vermez. Çıktılar, geçmiş olayların istatistiksel analizine dayalı olasılıksal tahminlerdir (bkz. Bölüm 10).

---

## 2. Problem Tanımı

### 2.1. Mevcut Durum

Günümüz finansal ekosisteminde yatırımcılar fiyat grafiklerine, işlem hacimlerine ve teknik indikatörlere saniyeler içinde erişebilmektedir. Ancak asıl fiyat hareketlerini tetikleyen **olayların etkisini ölçen** yaygın bir araç bulunmamaktadır.

### 2.2. Cevapsız Kalan Soru

Piyasaya yeni bir haber düştüğünde yatırımcının karşılaştığı temel belirsizlik şudur:

> *"Bu haber gerçekten önemli mi? Fiyatı %0,4 mü etkiler, %15 mi? Geçmişte benzer durumlarda piyasa nasıl tepki verdi?"*

Bu soruyu bugün yanıtlamak için yatırımcının:

- Haberin kaynağının güvenilirliğini kendisinin değerlendirmesi,
- Geçmişteki benzer olayları hafızasından hatırlaması,
- O olayların fiyat etkilerini manuel olarak araştırması

gerekmektedir. Bu süreç **saatler sürer**; oysa piyasa tepkisi **dakikalar içinde** fiyatlanır.

### 2.3. Hedef Kitle

| Segment | İhtiyaç |
|---|---|
| Bireysel yatırımcılar | Haber akışını hızlı ve veriye dayalı yorumlama |
| Portföy yöneticileri / fon ekipleri | Olay bazlı risk ve fırsat taraması |
| Algoritmik trading ekipleri | Yapılandırılmış olay-etki verisi (API) |
| Finansal medya ve araştırma kuruluşları | Olay etki arşivi ve raporlama |

---

## 3. Çözüm Yaklaşımı ve Değer Önerisi

Ziya, her haberi izole bir metin olarak değil; **bağlamıyla birlikte mühürlenmiş bir olay** olarak ele alır. Sistemin değer önerisi tek cümleyle:

> **"Piyasaya düşen her haberi, geçmişteki binlerce benzeriyle saniyeler içinde karşılaştırır ve olası fiyat etkisini güven skoruyla birlikte sunar."**

| Geleneksel Yaklaşım | Ziya |
|---|---|
| Haber okunur, etki tahmini sezgiseldir | Etki tahmini geçmiş verilere dayalıdır |
| Kaynak güvenilirliği öznel değerlendirilir | Kaynaklar hiyerarşik güven skoruyla puanlanır |
| Söylentiler ya yok sayılır ya körce takip edilir | Söylentiler etiketlenir ve doğruluk oranı izlenir |
| Geçmiş olaylar unutulur | Her olay kalıcı hafızaya yazılır ve referans olur |
| Tahmin sonrası öğrenme yoktur | Gerçekleşen sonuçla tahmin karşılaştırılır, model güncellenir |

---

## 4. Gerçek Hayat Senaryoları

Aşağıdaki senaryolar, sistemin farklı olay türlerinde uçtan uca nasıl çalıştığını göstermektedir.

### Senaryo 1 — Resmî Kurumsal Haber: "Tesla, Hindistan'da Fabrika Kuruyor"

**Bağlam:** 12 Ocak 2026, saat 15:31'de Bloomberg, Tesla'nın Hindistan'da üretim tesisi kuracağını duyurur.

**Sistemin işleyişi:**

1. **Algılama (T0 + 2 sn):** Haber, Bloomberg API akışından yakalanır. Kaynak güven skoru: **97/100**.
2. **Sınıflandırma:** NLP motoru haberi `Kategori: Kapasite Yatırımı / Yeni Pazar`, `Duygu: Pozitif` olarak etiketler.
3. **Benzer olay taraması (T0 + 5 sn):** Event Memory'de 14 benzer olay bulunur — aralarında Tesla'nın 2019 Şanghay Gigafactory duyurusu ve 2021 Berlin fabrika açılışı da vardır. Benzer olaylarda ortalama 24 saatlik etki: **+%4,1**.
4. **Tahmin yayını (T0 + 8 sn):** Kullanıcıya bildirim gider:

   > 📈 **TSLA — Yeni Pazar Yatırımı** | Beklenti (24s): **+%3,5 ile +%5,5** | Güven: **%84** | Dayanak: 14 benzer olay

5. **Gerçekleşme takibi:**

| Zaman Dilimi | Fiyat | Değişim | Piyasa Durumu |
|---|---|---|---|
| Haberden 1 saat önce | 241,12 $ | — | Stabil |
| Haber anı (T0) | 247,54 $ | +%2,67 | Ani hacim artışı |
| 24 saat sonra | 255,00 $ | +%5,76 | Yüksek hacim |
| 1 hafta sonra | 267,00 $ | +%10,71 | Trend oluşumu |

6. **Öğrenme:** Tahmin (+%3,5 / +%5,5) ile gerçekleşme (+%5,76) karşılaştırılır; sapma hesaplanıp modele geri beslenir ve olay, gelecekteki "yeni pazar yatırımı" haberleri için referans olarak hafızaya mühürlenir.

---

### Senaryo 2 — Söylenti Yönetimi: "Reddit'te Apple Sızıntısı"

**Bağlam:** Bir Cuma akşamı, r/stocks üzerinde anonim bir kullanıcı Apple'ın önümüzdeki ay "Vision Pro 2"yi tanıtacağını iddia eder. Haber hiçbir resmî kaynakta yoktur.

**Sistemin işleyişi:**

1. **Tespit:** Rumor Engine gönderiyi yakalar. Kaynak: anonim forum → güven skoru **10–30 bandı**. Olay `Rumor (Söylenti)` etiketiyle kaydedilir; kullanıcıya **tahmin değil, izleme bildirimi** gider:

   > ⚠️ **AAPL — Doğrulanmamış Söylenti** | Ürün lansmanı iddiası | Kaynak güveni: 18/100 | Geçmişte bu kaynak tipinden çıkan Apple ürün söylentilerinin doğrulanma oranı: **%87**

2. **Yayılım izleme:** Takip eden 48 saatte söylenti X (Twitter) üzerinde doğrulanmış teknoloji muhabirlerince paylaşılır → etiket `Unverified (Doğrulanmamış)` seviyesine, birleşik güven skoru 55'e yükselir.
3. **Doğrulanma:** 9 gün sonra Apple resmî davetiye gönderir → etiket `Confirmed (Doğrulanmış)` olur. Söylentinin ilk tespitinden resmî doğrulamaya kadar geçen sürede hisse **+%6,2** hareket etmiştir.
4. **Kalıcı kazanım:** Sistem, bu kaynak zincirinin (Reddit → doğrulanmış muhabir → resmî duyuru) doğruluk oranını günceller. Bir sonraki benzer söylentide, doğrulama gelmeden önce kullanıcıya daha isabetli bir erken sinyal sunulabilir.

**Karşı örnek:** Aynı hafta Telegram'da yayılan "Apple, Netflix'i satın alıyor" iddiası, geçmişte %96 oranında yanlış çıkmış kaynak profiline sahiptir. Sistem bunu `Yüksek Yanlış Olasılığı` olarak işaretler ve kullanıcının gürültüye tepki vermesini önler.

---

### Senaryo 3 — Psikoloji Analizi: "Kötü Habere Rağmen Yükselen Hisse"

**Bağlam:** Orta ölçekli bir teknoloji şirketi beklentinin altında bilanço açıklar. Normal şartlarda düşüş beklenirken hisse ilk yarım saatte **+%8** yükselir.

**Sistemin işleyişi:**

1. **Anomali tespiti:** Haber duygusu (negatif) ile fiyat tepkisi (pozitif) arasındaki uyumsuzluk otomatik işaretlenir.
2. **Bağlam analizi:** Sistem, hissedeki açık pozisyon (short interest) oranının %38 gibi aşırı yüksek seviyede olduğunu tespit eder ve geçmiş hafızada benzer örüntüleri arar — 2021 GameStop ve AMC vakalarında görülen desene benzerlik bulunur.
3. **Etiketleme ve uyarı:**

   > 🔄 **Anomali: Short Squeeze Potansiyeli** | Negatif haber + pozitif fiyat tepkisi + %38 açık pozisyon | Geçmişte bu desendeki 11 olayın 8'inde hareket 48 saat içinde sert şekilde tersine döndü.

4. **Psikoloji etiketleri:** Olay; `FOMO`, `Kısa Pozisyon Kapatma`, `Spekülatif Momentum` etiketleriyle hafızaya yazılır. Kullanıcı, yükselişin **temel değil teknik/psikolojik kaynaklı** olduğunu bilerek karar verir.

---

### Senaryo 4 — Yerel Piyasa (BIST): "KAP'a Düşen Bedelsiz Sermaye Artırımı"

**Bağlam:** BIST'te işlem gören bir holding, saat 18:45'te (seans sonrası) KAP'a %400 bedelsiz sermaye artırımı bildirimi gönderir.

**Sistemin işleyişi:**

1. **Algılama:** KAP resmî akışından bildirim yakalanır. Kaynak: **KAP → güven skoru 100/100** (en yüksek kademe).
2. **Zamanlama farkındalığı:** Sistem, bildirimin seans dışı geldiğini tespit eder; tahmin ufkunu "ertesi gün açılış + ilk 1 saat" olarak kurgular.
3. **Benzer olay taraması:** Event Memory'de son 5 yılda BIST'te gerçekleşen %200 üzeri bedelsiz sermaye artırımı bildirimleri taranır. Bulgular: açılışta ortalama **+%7,4** tepki; ancak izleyen 2 haftada olayların %60'ında kâr satışı ile geri çekilme.
4. **İki vadeli tahmin:**

   > 📊 **XHOLD — Bedelsiz Sermaye Artırımı (%400)** | Açılış beklentisi: **pozitif, tavan yakını** (Güven: %91) | 2 hafta görünümü: **kâr satışı riski yüksek** (benzer olayların %60'ında geri çekilme)

Bu senaryo, sistemin yalnızca ABD piyasalarına değil; **KAP entegrasyonu üzerinden BIST'e ve yerel piyasa dinamiklerine** de uyarlanabildiğini gösterir.

---

### Senaryo 5 — Sektörel Zincirleme Etki: "Nvidia Yeni AI Çipini Tanıttı"

**Bağlam:** Nvidia, yeni nesil yapay zekâ hızlandırıcısını tanıtır. Haber tek bir hisseyi değil, tüm yarı iletken ekosistemini ilgilendirmektedir.

**Sistemin işleyişi:**

1. **Birincil analiz:** Nvidia için geçmiş çip lansmanları taranır (kendi geçmiş lansmanları + AMD, Intel, Google ve Apple'ın benzer tanıtımları). Ortalama 1 haftalık etki hesaplanır.
2. **Zincirleme etki haritası:** Sistem, olayın **ilişkili varlıklar** üzerindeki geçmiş etkilerini de çıkarır:

| Varlık | İlişki | Geçmiş Benzer Olaylardaki Ortalama Tepki (1 hafta) |
|---|---|---|
| NVDA | Birincil | +%5,2 |
| TSM | Üretici (foundry) | +%2,1 |
| AMD | Rakip | −%1,8 |
| SMCI | Sunucu entegratörü | +%3,4 |

3. **Portföy perspektifi:** Kullanıcı yalnızca "Nvidia ne yapar?" sorusunun değil, "elimdeki AMD bu haberden nasıl etkilenir?" sorusunun da cevabını tek ekranda görür.

---

## 5. Veri Modeli: Olay Kaydı (Event Object)

Her haber, sisteme düştüğü anda çevresindeki piyasa koşullarıyla birlikte **tekil ve değiştirilemez bir olay kaydı** olarak mühürlenir.

### 5.1. Olay Kaydı Alanları

| Alan | Açıklama | Örnek |
|---|---|---|
| `event_id` | Benzersiz olay kimliği | `EVT-2026-0112-004731` |
| `timestamp` | Olayın algılanma zamanı (UTC) | `2026-01-12T15:31:04Z` |
| `source` | Haber kaynağı | Bloomberg |
| `trust_score` | Kaynak güven skoru (0–100) | 97 |
| `asset` | İlgili varlık(lar) | TSLA |
| `category` | Olay kategorisi | Kapasite Yatırımı |
| `sentiment` | Duygu analizi sonucu | Pozitif (0,82) |
| `status` | Doğrulama durumu | Confirmed |
| `market_context` | Olay anındaki fiyat/hacim/volatilite penceresi | Aşağıdaki matris |
| `embedding` | Vektör temsili (benzerlik araması için) | `float[1536]` |

### 5.2. Piyasa Bağlamı Matrisi (Örnek: Tesla Fabrika Duyurusu)

| Zaman Dilimi | Fiyat | Değişim | Hacim / Volatilite |
|---|---|---|---|
| T0 − 1 saat | 241,12 $ | — | Stabil |
| T0 (haber anı) | 247,54 $ | +%2,67 | Ani hacim artışı |
| T0 + 24 saat | 255,00 $ | +%5,76 | Yüksek |
| T0 + 1 hafta | 267,00 $ | +%10,71 | Trend oluşumu |

Bu matris, olayla birlikte kalıcı hafızaya yazılır ve gelecekteki benzer haberler için **referans noktası** olur.

---

## 6. Temel Modüller

### 6.1. Etki Skorlama Motoru (Impact Engine)

Her habere 100 üzerinden bir **etki skoru** ve bir **güven skoru** atanır.

**Etki metrikleri:**

- Fiyat değişim hızı (haber sonrası ilk dakikalardaki ivme)
- Hacim artışı (normalin katı cinsinden)
- Volatilite endeksi değişimi
- Sosyal medya etkileşim yoğunluğu

**Kaynak güven hiyerarşisi:**

| Kademe | Kaynak Türü | Güven Skoru |
|---|---|---|
| 1 | KAP / SEC / resmî şirket bildirimi | 100 |
| 2 | Reuters / Bloomberg | 97–98 |
| 3 | Doğrulanmış X (Twitter) hesapları | 50–70 |
| 4 | Reddit / Discord / Telegram / anonim forumlar | 10–30 |

### 6.2. Söylenti Motoru (Rumor Engine)

Projenin en yenilikçi bileşenidir. Reddit, Discord, Telegram, X ve Stocktwits gibi kaynakları tarayarak **henüz resmiyet kazanmamış bilgileri** tespit eder.

- **Yaşam döngüsü etiketleri:** `Rumor` → `Unverified` → `Confirmed` / `False`
- **Doğruluk puanı:** Her kaynak ve söylenti tipi için, söylentinin zamanla gerçeğe dönüşme oranı hesaplanır (örn. belirli bir sızıntı hesabının Apple ürün söylentilerinde doğruluk oranı: **%87**).
- **Gürültü filtresi:** Tarihsel olarak düşük doğruluk oranına sahip kaynak profillerinden gelen iddialar `Yüksek Yanlış Olasılığı` olarak işaretlenir (bkz. Senaryo 2).

### 6.3. Benzer Olay Arama (Similar Event Retrieval)

Yeni bir olay gerçekleştiğinde sistem, vektör veri tabanındaki geçmiş olaylar arasında **anlamsal benzerlik araması** yapar:

1. Olay metni ve bağlamı vektöre dönüştürülür.
2. Aynı kategori, sektör ve piyasa koşulundaki geçmiş olaylar sıralanır.
3. Benzer olayların gerçekleşmiş fiyat tepkilerinin dağılımı çıkarılır (ortalama, medyan, aralık).
4. Bu dağılım, tahmin motorunun temel girdisini oluşturur.

### 6.4. Yatırımcı Psikolojisi ve Duygu Analizi

Ajan, piyasa genelindeki duyguyu (sentiment) sürekli izler ve **haber–fiyat uyumsuzluklarını** anomali olarak işaretler:

- Kötü habere rağmen yükseliş → `Short Squeeze` potansiyeli (bkz. Senaryo 3)
- İyi habere rağmen düşüş → `Sat-haberi-al-söylentiyi` (sell-the-news) deseni
- Aşırı sosyal medya yoğunluğu → `FOMO` / `Spekülatif Momentum` etiketi
- Panik satışı desenleri → `Kapitülasyon` etiketi

Bu etiketler olay kaydına eklenir ve gelecekteki benzer psikolojik desenlerin erken tespitini sağlar.

---

## 7. Sürekli Öğrenme Döngüsü

Ajan statiktir değil; her yeni olayla kendini günceller. Döngü yedi adımdan oluşur:

```
┌─────────────────────────────────────────────────────────────┐
│  1. Algılama ve Doğrulama                                   │
│     Haber metni, kaynağı ve saati yakalanır;                │
│     kaynağa göre güven skoru atanır (KAP=100, Reddit=10-30) │
│                          ▼                                  │
│  2. Sınıflandırma ve NLP Analizi                            │
│     Olay türü (temettü, CEO değişimi, dava, regülasyon...)  │
│     ve duygu (pozitif/negatif) etiketlenir                  │
│                          ▼                                  │
│  3. Piyasa Bağlamının Çekilmesi                             │
│     Haber öncesi 15 dk / 30 dk / 1 saatlik fiyat, hacim     │
│     ve volatilite verileri anlık toplanır                   │
│                          ▼                                  │
│  4. Benzer Olay Taraması (Event Retrieval)                  │
│     Vektör veri tabanında benzer bağlamlı geçmiş            │
│     olaylar aranır ve listelenir                            │
│                          ▼                                  │
│  5. Tahmin Üretimi ve Yayın                                 │
│     "24 saat içinde +%4,8 beklenti, güven: %87"             │
│     formatında kullanıcıya sunulur                          │
│                          ▼                                  │
│  6. Gerçek Sonuçların İzlenmesi                             │
│     T0+1 saat, T0+24 saat ve T0+1 hafta gerçekleşen         │
│     fiyat hareketleri kaydedilir                            │
│                          ▼                                  │
│  7. Model Güncelleme ve Hafıza Kaydı (RL)                   │
│     Tahmin ile gerçekleşme karşılaştırılır; hata payı       │
│     hesaplanır, ajan güncellenir, olay Event Memory'ye      │
│     kalıcı olarak yazılır ──────────────► (1'e geri döner)  │
└─────────────────────────────────────────────────────────────┘
```

Bu döngü sayesinde sistemin tahmin isabeti, işlediği her olayla birlikte **ölçülebilir şekilde** artar.

---

## 8. Sistem Mimarisi

Mimari beş katmandan oluşur:

| # | Katman | Sorumluluk | Örnek Bileşenler |
|---|---|---|---|
| 1 | **Veri Toplama Katmanı** | Ham verinin dış kaynaklardan çekilmesi | Haber API'leri, KAP/SEC akışları, sosyal medya toplayıcıları |
| 2 | **Olay Normalizasyon Katmanı** | Dağınık verinin standart yapıya dönüştürülmesi | Tarih/saat, şirket, varlık ve kategori alanlarıyla yapısal JSON |
| 3 | **Event Memory (Vektör Veri Tabanı)** | Olayların vektörel saklanması ve hızlı benzerlik araması | Embedding üretimi, ANN indeksleme |
| 4 | **Birleşik Analiz Motorları** | Piyasa ve metin analizinin paralel yürütülmesi | Piyasa Veri Motoru (OHLCV, hacim, volatilite) • NLP Motoru (duygu, varlık, konu çıkarımı) |
| 5 | **Tahmin ve Karar Motoru (AI Engine)** | Nihai raporun üretilmesi | Kısa/orta/uzun vade senaryoları; güven skoru, beklenen tepki, risk durumu |

**Veri akışı:** Dış kaynaklar → (1) Toplama → (2) Normalizasyon → (3) Hafızaya yazma + (4) Analiz motorları → (5) Tahmin → Kullanıcı arayüzü / API → Gerçekleşme takibi → (3) Hafıza güncelleme.

---

## 9. Başarı Kriterleri ve KPI'lar

| KPI | Tanım | Hedef (v1) |
|---|---|---|
| **Tahmin isabet oranı** | 24 saatlik yön tahmininin doğruluk yüzdesi | ≥ %70 |
| **Tepki süresi** | Haberin algılanmasından tahmin yayınına kadar geçen süre | ≤ 10 saniye |
| **Söylenti doğrulama başarısı** | `Confirmed` olan söylentilerin erken tespit oranı | ≥ %60 |
| **Yanlış alarm oranı** | `False` çıkan olaylara verilen yüksek etki skorlarının oranı | ≤ %15 |
| **Hafıza kapsamı** | Event Memory'deki etiketlenmiş olay sayısı | 100.000+ olay (ilk yıl) |
| **Model iyileşme eğrisi** | Aylık ortalama tahmin hatasındaki (MAE) azalma | Çeyreklik bazda ölçülebilir düşüş |

---

## 10. Riskler ve Yasal Uyumluluk

### 10.1. Yasal Çerçeve

- **Yatırım tavsiyesi değildir:** Tüm çıktılar "Bu bir yatırım tavsiyesi değildir" ibaresiyle sunulur. Sistem alım/satım emri **vermez ve öneremez**; yalnızca geçmiş olay istatistiklerini raporlar.
- **SPK / SEC uyumu:** Yatırım danışmanlığı lisansı gerektiren ifadelerden kaçınılır; ürün "finansal bilgi ve analiz platformu" olarak konumlandırılır.
- **Veri lisansları:** Haber ve piyasa verisi sağlayıcılarıyla (Bloomberg, Reuters, borsa veri satıcıları) kullanım lisansları ticari yayından önce tamamlanır.
- **KVKK / GDPR:** Sosyal medya verisi yalnızca kamuya açık içerikten, kişisel veri minimizasyonu ilkesiyle toplanır.

### 10.2. Risk Matrisi

| Risk | Olasılık | Etki | Azaltım |
|---|---|---|---|
| Manipülatif söylentilerin (pump & dump) sisteme sızması | Yüksek | Yüksek | Kaynak doğruluk geçmişi + düşük güven skorlu kaynakların tahmin üretmemesi |
| Geçmiş desenlerin tekrar etmemesi (rejim değişikliği) | Orta | Yüksek | Güven skorunun piyasa rejimi değişkenlerine duyarlı hale getirilmesi |
| Veri sağlayıcı kesintisi | Orta | Orta | Çoklu kaynak yedekliliği |
| Aşırı kullanıcı güveni (tahminlerin kesinlik sanılması) | Yüksek | Orta | Her tahminin aralık + güven skoru + dayanak olay sayısıyla sunulması |
| Sosyal medya API erişim politikalarının değişmesi | Orta | Orta | Kaynak çeşitliliği; tek platforma bağımlılığın önlenmesi |

---

## 11. Yol Haritası

| Faz | Kapsam | Süre (tahmini) |
|---|---|---|
| **Faz 1 — MVP** | Tek piyasa (ABD büyük hisseleri), resmî kaynaklar (Tier 1–2), temel Event Memory ve benzer olay araması | 3 ay |
| **Faz 2 — Rumor Engine** | Sosyal medya kaynakları, söylenti yaşam döngüsü, doğruluk puanlama | +2 ay |
| **Faz 3 — Yerel Piyasa** | KAP entegrasyonu, BIST kapsamı, seans dışı bildirim mantığı | +2 ay |
| **Faz 4 — Zincirleme Etki** | İlişkili varlık haritası, sektörel etki analizi, portföy perspektifi | +3 ay |
| **Faz 5 — API ve Kurumsal** | Kurumsal API, gerçek zamanlı webhook, raporlama modülü | +2 ay |

---

## 12. Sözlük

| Terim | Açıklama |
|---|---|
| **Event Object** | Bir haberin, algılandığı andaki piyasa bağlamıyla birlikte mühürlenmiş kalıcı kaydı |
| **Event Memory** | Tüm olay kayıtlarının vektörel olarak saklandığı, benzerlik aramasına açık veri tabanı |
| **T0** | Haberin sisteme düştüğü an (referans zaman noktası) |
| **Trust Score** | Kaynağın tarihsel güvenilirliğine dayalı 0–100 arası puan |
| **Rumor Accuracy** | Bir kaynağın/söylenti tipinin zamanla gerçeğe dönüşme oranı |
| **Short Squeeze** | Yüksek açık pozisyonların zorunlu kapatılmasıyla oluşan sert yükseliş |
| **OHLCV** | Açılış, En Yüksek, En Düşük, Kapanış fiyatları ve Hacim verisi |
| **Sentiment** | Metnin veya piyasanın duygu yönü (pozitif/negatif/nötr) |

---

*Bu doküman Ziya projesinin tanım dosyasıdır; teknik tasarım detayları ayrı bir Teknik Tasarım Dokümanı (TDD) kapsamında ele alınacaktır.*
