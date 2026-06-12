import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Şifreler hash'leme
  const hashedPassword = await bcrypt.hash('password123', 10);

  // ============ KATEGORİLER ============
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'kask' }, update: {}, create: { name: 'Kask', slug: 'kask', iconKey: 'helmet', sortOrder: 1 } }),
    prisma.category.upsert({ where: { slug: 'mont' }, update: {}, create: { name: 'Mont', slug: 'mont', iconKey: 'jacket', sortOrder: 2 } }),
    prisma.category.upsert({ where: { slug: 'eldiven' }, update: {}, create: { name: 'Eldiven', slug: 'eldiven', iconKey: 'gloves', sortOrder: 3 } }),
    prisma.category.upsert({ where: { slug: 'bot' }, update: {}, create: { name: 'Bot', slug: 'bot', iconKey: 'boot', sortOrder: 4 } }),
    prisma.category.upsert({ where: { slug: 'koruyucu' }, update: {}, create: { name: 'Koruyucu', slug: 'koruyucu', iconKey: 'shield', sortOrder: 5 } }),
    prisma.category.upsert({ where: { slug: 'aksesuar' }, update: {}, create: { name: 'Aksesuar', slug: 'aksesuar', iconKey: 'gear', sortOrder: 6 } }),
    prisma.category.upsert({ where: { slug: 'yagmurluk' }, update: {}, create: { name: 'Yağmurluk', slug: 'yagmurluk', iconKey: 'rain', sortOrder: 7 } }),
  ]);

  // ============ MARKALAR ============
  const brands = await Promise.all([
    prisma.brand.upsert({ where: { slug: 'shoei' }, update: {}, create: { name: 'Shoei', slug: 'shoei' } }),
    prisma.brand.upsert({ where: { slug: 'agv' }, update: {}, create: { name: 'AGV', slug: 'agv' } }),
    prisma.brand.upsert({ where: { slug: 'arai' }, update: {}, create: { name: 'Arai', slug: 'arai' } }),
    prisma.brand.upsert({ where: { slug: 'alpinestars' }, update: {}, create: { name: 'Alpinestars', slug: 'alpinestars' } }),
    prisma.brand.upsert({ where: { slug: 'dainese' }, update: {}, create: { name: 'Dainese', slug: 'dainese' } }),
    prisma.brand.upsert({ where: { slug: 'held' }, update: {}, create: { name: 'Held', slug: 'held' } }),
    prisma.brand.upsert({ where: { slug: 'rev-it' }, update: {}, create: { name: "Rev'it", slug: 'rev-it' } }),
    prisma.brand.upsert({ where: { slug: 'nolan' }, update: {}, create: { name: 'Nolan', slug: 'nolan' } }),
    prisma.brand.upsert({ where: { slug: 'ls2' }, update: {}, create: { name: 'LS2', slug: 'ls2' } }),
    prisma.brand.upsert({ where: { slug: 'hjc' }, update: {}, create: { name: 'HJC', slug: 'hjc' } }),
  ]);

  // ============ KULLANICILAR ============
  const adminPassword = await bcrypt.hash('admin123!', 10);

  const users = await Promise.all([
    // Admin kullanıcısı
    prisma.user.upsert({
      where: { email: 'admin@motorya.com.tr' },
      update: {},
      create: {
        email: 'admin@motorya.com.tr',
        displayName: 'Motorya Admin',
        passwordHash: adminPassword,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        emailVerifiedAt: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: 'ahmet@example.com' },
      update: {},
      create: {
        email: 'ahmet@example.com',
        displayName: 'Ahmet Yılmaz',
        passwordHash: hashedPassword,
        status: 'ACTIVE',
        city: 'İstanbul',
        phoneVerifiedAt: new Date(),
        emailVerifiedAt: new Date(),
        identityVerifiedAt: new Date(),
        ratingAvg: 4.9,
        ratingCount: 47,
        salesCount: 132,
        isFounder: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'selin@example.com' },
      update: {},
      create: {
        email: 'selin@example.com',
        displayName: 'Selin Korkmaz',
        passwordHash: hashedPassword,
        status: 'ACTIVE',
        city: 'İzmir',
        phoneVerifiedAt: new Date(),
        emailVerifiedAt: new Date(),
        ratingAvg: 4.8,
        ratingCount: 24,
        salesCount: 48,
        isFounder: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'burak@example.com' },
      update: {},
      create: {
        email: 'burak@example.com',
        displayName: 'Burak Tan',
        passwordHash: hashedPassword,
        status: 'ACTIVE',
        city: 'Ankara',
        phoneVerifiedAt: new Date(),
        emailVerifiedAt: new Date(),
        ratingAvg: 5.0,
        ratingCount: 8,
        salesCount: 12,
      },
    }),
  ]);

  // ============ İLANLAR ============
  const sellers = [users[1], users[2], users[3]];
  const cities = ['İstanbul', 'İzmir', 'Ankara', 'Bursa', 'Antalya'];

  const listings = [
    // ── KASK (categories[0]) ──
    { id: 'listing-k1', title: 'Shoei GT-Air II Tam Yüz Kask — Mat Siyah', description: 'Yaklaşık 8 ay kullanıldı, hiç düşürülmedi. Pinlock vizör dahil, orijinal kutu ve fatura mevcut. Beden uymadığı için satıyorum.', condition: 'LIKE_NEW', sizeLabel: 'M', price: 7250, originalPrice: 10900, city: 'İstanbul', categoryId: categories[0].id, brandId: brands[0].id, sellerId: sellers[0].id },
    { id: 'listing-k2', title: 'AGV Pista GP RR Carbonio Forged — Sertifikalı', description: 'Pistçi arkadaştan alındı, 3 pist günü kullanımı var. ECE 22.06 sertifikalı, kese ve stand dahil. Hasar kaydı kesinlikle yoktur.', condition: 'GOOD', sizeLabel: 'S', price: 18500, originalPrice: 26000, city: 'İzmir', categoryId: categories[0].id, brandId: brands[1].id, sellerId: sellers[1].id },
    { id: 'listing-k3', title: 'Arai RX-7V Evo Beyaz — Kutusunda', description: 'Hatalı sipariş, hiç açılmadı. Fatura mevcut, garanti kapsamında. Nakliyeli satış yapılabilir.', condition: 'NEW', sizeLabel: 'L', price: 14900, originalPrice: 16800, city: 'Ankara', categoryId: categories[0].id, brandId: brands[2].id, sellerId: sellers[2].id },
    { id: 'listing-k4', title: 'Nolan N87 Modüler Kask Gri — Güneş Vizörlü', description: 'İki yıl şehir içi kullanımı. Güneş vizörü çalışıyor, iç astarı yıkandı. Küçük yüzeysel çizik dışında kusuru yoktur.', condition: 'GOOD', sizeLabel: 'XL', price: 2800, originalPrice: 4200, city: 'Bursa', categoryId: categories[0].id, brandId: brands[7].id, sellerId: sellers[0].id },
    { id: 'listing-k5', title: 'LS2 FF800 Storm II Motosiklet Kaskı', description: 'Altı aylık kullanım, scratches yok. HPFC lifi ile üretilmiş hafif kask. Fatura mevcut. Renk: Siyah-Kırmızı.', condition: 'LIKE_NEW', sizeLabel: 'M', price: 3600, originalPrice: 5100, city: 'Antalya', categoryId: categories[0].id, brandId: brands[8].id, sellerId: sellers[1].id },

    // ── MONT (categories[1]) ──
    { id: 'listing-m1', title: 'Alpinestars T-GP Plus R V3 Deri Mont', description: 'Track-use deri mont, perfe durumdadır. Sırt koruyucusu dahil, omuz-dirsek CE-2 sertifikalı. Beden büyük geldi.', condition: 'GOOD', sizeLabel: '52', price: 4900, originalPrice: 7800, city: 'İzmir', categoryId: categories[1].id, brandId: brands[3].id, sellerId: sellers[1].id },
    { id: 'listing-m2', title: 'Dainese Super Speed 4 Deri Kombin Mont', description: 'İtalyan deri, bir sezon yarış kullanımı. Tüm koruyucular orijinal. Pantolon ile kombinleyebilirsiniz (bağlantı fermuarı var).', condition: 'GOOD', sizeLabel: '50', price: 6200, originalPrice: 9500, city: 'İstanbul', categoryId: categories[1].id, brandId: brands[4].id, sellerId: sellers[2].id },
    { id: 'listing-m3', title: "Rev'it! Torque 3 Tekstil Tur Montu — Kırmızı", description: "Şehir ve uzun tur için ideal 3-in-1 tekstil mont. Çıkarılabilir su geçirmez astar, hava kanalları açılabilir. Sadece 2 ay kullanıldı.", condition: 'LIKE_NEW', sizeLabel: 'L', price: 5500, originalPrice: 8200, city: 'Ankara', categoryId: categories[1].id, brandId: brands[6].id, sellerId: sellers[0].id },
    { id: 'listing-m4', title: 'Held Caprino 2 Deri Mont — Siyah', description: 'Alman yapımı, çok sağlam. Omuz ve dirsek koruyucuları var, sırt koruyucusu soketi mevcut. 3 yıl kullanıldı ama bakımlı.', condition: 'FAIR', sizeLabel: '54', price: 2200, originalPrice: 5600, city: 'Bursa', categoryId: categories[1].id, brandId: brands[5].id, sellerId: sellers[1].id },
    { id: 'listing-m5', title: 'Alpinestars Andes V3 Drystar Yağmurluk Mont', description: 'Tüm hava koşulları için 3 katmanlı tekstil mont. Diz altı uzunlukta, iç astarlı. Sıfır — kargo ile geldi, bedenim yoktu.', condition: 'NEW', sizeLabel: 'XL', price: 7100, originalPrice: 9400, city: 'Antalya', categoryId: categories[1].id, brandId: brands[3].id, sellerId: sellers[2].id },

    // ── ELDİVEN (categories[2]) ──
    { id: 'listing-e1', title: 'Dainese Carbon 4 Long Eldiven — S Beden', description: 'Sıfır, etiket açılmadı. Hatalı sipariş, bedenim küçük geldi. Fatura mevcut.', condition: 'NEW', sizeLabel: 'S', price: 2150, originalPrice: 3200, city: 'Ankara', categoryId: categories[2].id, brandId: brands[4].id, sellerId: sellers[2].id },
    { id: 'listing-e2', title: 'Alpinestars GP Pro R3 Deri Yarış Eldiveni', description: 'Bir sezon pist kullanımı, palm sliders hafif yıpranmış, elde güvenlik problemi yok. CE kategori 2 sertifikalı.', condition: 'GOOD', sizeLabel: 'L', price: 1800, originalPrice: 3400, city: 'İstanbul', categoryId: categories[2].id, brandId: brands[3].id, sellerId: sellers[0].id },
    { id: 'listing-e3', title: "Rev'it! Mosca 2 Yazlık Eldiven", description: 'Şehir içi kullanım için ferah yazlık eldiven. Eklem koruyucu içeriyor, perforasyonlu. 4 ay kullanım.', condition: 'LIKE_NEW', sizeLabel: 'M', price: 750, originalPrice: 1200, city: 'İzmir', categoryId: categories[2].id, brandId: brands[6].id, sellerId: sellers[1].id },
    { id: 'listing-e4', title: 'Held Air Stream 3 Yaz Eldiveni', description: 'Maksimum hava akışı sağlayan mesh yapı. Parmak ucu ve bilek koruması var. İki sezon kullanıldı.', condition: 'GOOD', sizeLabel: 'XL', price: 1100, originalPrice: 1900, city: 'Bursa', categoryId: categories[2].id, brandId: brands[5].id, sellerId: sellers[2].id },
    { id: 'listing-e5', title: 'Alpinestars C-1 V2 Gore-Tex Kışlık Eldiven', description: 'Su geçirmez Gore-Tex membran, su geçirmezliği hâlâ tam. Termal astar dahil. Kış aylarında harika.', condition: 'GOOD', sizeLabel: 'M', price: 2400, originalPrice: 3800, city: 'Antalya', categoryId: categories[2].id, brandId: brands[3].id, sellerId: sellers[0].id },

    // ── BOT (categories[3]) ──
    { id: 'listing-b1', title: 'Alpinestars SMX-6 V2 Deri Bot — 43', description: 'Bir yıllık kullanım, taban aşınması normal. Bilek koruması, CE sertifikalı. Boyalı alan yoktur.', condition: 'GOOD', sizeLabel: '43', price: 2600, originalPrice: 4200, city: 'İstanbul', categoryId: categories[3].id, brandId: brands[3].id, sellerId: sellers[1].id },
    { id: 'listing-b2', title: 'Dainese Nexus 2 Tur Botu — 44', description: 'Gore-Tex su geçirmez, iki yıllık şehir-tur kullanımı. Reflektif detaylar eksiksiz, taban iyi durumda.', condition: 'GOOD', sizeLabel: '44', price: 3100, originalPrice: 5400, city: 'İzmir', categoryId: categories[3].id, brandId: brands[4].id, sellerId: sellers[2].id },
    { id: 'listing-b3', title: "Rev'it! Flux H2O Tekstil Bot — 42 — Sıfır", description: 'Hediye geldi, numaram 41. Hiç giyilmedi, etiket yerinde. Renk: Siyah. Nakliye ile gönderilebilir.', condition: 'NEW', sizeLabel: '42', price: 3400, originalPrice: 4600, city: 'Ankara', categoryId: categories[3].id, brandId: brands[6].id, sellerId: sellers[0].id },
    { id: 'listing-b4', title: 'Held Gründberg GTX Bot — 45', description: 'Gore-Tex membran, deri üst. Üç yıl kullanım, tabana ince yama yapıldı, fotoğrafta görünüyor. Fiyata yansıtıldı.', condition: 'FAIR', sizeLabel: '45', price: 1400, originalPrice: 4800, city: 'Bursa', categoryId: categories[3].id, brandId: brands[5].id, sellerId: sellers[1].id },
    { id: 'listing-b5', title: 'TCX Infinity 3 Waterproof Bot — 41', description: 'Su geçirmez, kısa bilekli kentsel bot. Renk: Siyah-Gri. Altı ay kullanım, temiz.', condition: 'LIKE_NEW', sizeLabel: '41', price: 2900, originalPrice: 4100, city: 'Antalya', categoryId: categories[3].id, brandId: null, sellerId: sellers[2].id },

    // ── KORUYUCU (categories[4]) ──
    { id: 'listing-p1', title: 'Alpinestars Nucleon KR-Ri Sırt Koruyucusu', description: 'CE Level 2 sırt koruyucusu, çoğu mont ile uyumlu. Hiç kullanılmadı, poşetinde duruyor. Beden: Standart.', condition: 'NEW', sizeLabel: 'Standart', price: 1850, originalPrice: 2800, city: 'İstanbul', categoryId: categories[4].id, brandId: brands[3].id, sellerId: sellers[0].id },
    { id: 'listing-p2', title: 'Dainese Pro-Speed Diz Koruyucu Seti', description: 'CE Level 2 diz koruyucu çifti. Pantolon içine takılıyor, beden L. Bir sezon kullanıldı.', condition: 'GOOD', sizeLabel: 'L', price: 950, originalPrice: 1600, city: 'İzmir', categoryId: categories[4].id, brandId: brands[4].id, sellerId: sellers[1].id },
    { id: 'listing-p3', title: 'Forcefield Pro Sub 4 Body Armour', description: 'Tüm vücut koruma için alt giysi tipi koruyucu. Omuz, dirsek, diz CE-2. İki yıl kullanım, esnek yapı bozulmamış.', condition: 'GOOD', sizeLabel: 'M', price: 2400, originalPrice: 4200, city: 'Ankara', categoryId: categories[4].id, brandId: null, sellerId: sellers[2].id },
    { id: 'listing-p4', title: 'Alpinestars Bionic Action Koruyucu Yelek', description: 'Sırt + göğüs kombinasyonu CE Level 2 yelek. Motosiklet üstü veya mont altı giyilebilir. Bir sezon.', condition: 'LIKE_NEW', sizeLabel: 'L', price: 3200, originalPrice: 4900, city: 'Bursa', categoryId: categories[4].id, brandId: brands[3].id, sellerId: sellers[0].id },
    { id: 'listing-p5', title: "Rev'it! Seeflex RV-1 Dirsek Koruyucu Çifti", description: 'Viskoelastik malzeme, CE-2 sertifikalı. Rev\'it mont ile birebir uyumlu ama evrensel bağlantı mevcut. Sıfır.', condition: 'NEW', sizeLabel: 'Standart', price: 680, originalPrice: 1100, city: 'Antalya', categoryId: categories[4].id, brandId: brands[6].id, sellerId: sellers[1].id },

    // ── AKSESUAR (categories[5]) ──
    { id: 'listing-a1', title: 'Interphone U-COM 8R İkili Bluetooth Kask İnterkomu', description: 'Çift set, şarj kabloları dahil. 1.6 km konuşma menzili, müzik ve GPS yönlendirmesi destekler. 1 yıl kullanım.', condition: 'GOOD', sizeLabel: null, price: 3800, originalPrice: 6200, city: 'İstanbul', categoryId: categories[5].id, brandId: null, sellerId: sellers[2].id },
    { id: 'listing-a2', title: 'Oxford HotGrips Advance Touring Isıtmalı Gidon Sarması', description: 'Evrensel uyum, 5 kademeli ısı ayarı. Oxford kontrol ünitesi ile birlikte. İki sezon kullanıldı, ısı elementleri tam çalışıyor.', condition: 'GOOD', sizeLabel: null, price: 1100, originalPrice: 2200, city: 'İzmir', categoryId: categories[5].id, brandId: null, sellerId: sellers[0].id },
    { id: 'listing-a3', title: 'Kriega US-20 Sele Çantası', description: 'Harness sistemi ile 20L su geçirmez çanta. Siyah, tüm vidalar eksiksiz. Üç yıl tur kullanımı, baskı noktaları sağlam.', condition: 'GOOD', sizeLabel: null, price: 2600, originalPrice: 4400, city: 'Ankara', categoryId: categories[5].id, brandId: null, sellerId: sellers[1].id },
    { id: 'listing-a4', title: 'Moto-Skiveez Motosiklet Altlığı (Pantolon)', description: 'Padding\'li inner pantolon, uzun tur konforunu artırıyor. Beden L, sıfır paketinde. Motosiklet değişince beden uymadı.', condition: 'NEW', sizeLabel: 'L', price: 890, originalPrice: 1400, city: 'Bursa', categoryId: categories[5].id, brandId: null, sellerId: sellers[2].id },
    { id: 'listing-a5', title: 'Topeak RideCase Telefon Tutacağı (iPhone 15 Pro)', description: 'iPhone 15 Pro uyumlu, titreşim sönümleme yaylı bağlantı. Kılıf dahil. Telefon değişince lazım olmadı.', condition: 'LIKE_NEW', sizeLabel: null, price: 950, originalPrice: 1600, city: 'Antalya', categoryId: categories[5].id, brandId: null, sellerId: sellers[0].id },

    // ── YAĞMURLUK (categories[6]) ──
    { id: 'listing-y1', title: 'Tucano Urbano Diluvio Plus Yağmurluk Tulum', description: 'Tam tulum, çanta içinde taşınıyor. XXL beden, reflektif bantlar. Çok az kullanıldı, birkaç kez giyildi.', condition: 'LIKE_NEW', sizeLabel: 'XXL', price: 680, originalPrice: 1100, city: 'İstanbul', categoryId: categories[6].id, brandId: null, sellerId: sellers[1].id },
    { id: 'listing-y2', title: 'Dainese D-Crust Plus Yağmurluk Pantolon', description: 'Tulum değil sadece pantolon, üst giysinin üzerine giyiliyor. Beden XL. Sıfır, kutusunda duruyor.', condition: 'NEW', sizeLabel: 'XL', price: 1200, originalPrice: 1800, city: 'İzmir', categoryId: categories[6].id, brandId: brands[4].id, sellerId: sellers[2].id },
    { id: 'listing-y3', title: 'Alpinestars Hurricane 3 Yağmurluk Set (Üst + Alt)', description: 'Üst ve alt parçadan oluşan set. Çanta içinde seleye bağlanıyor. Beden M. İki sezon kullanım.', condition: 'GOOD', sizeLabel: 'M', price: 1450, originalPrice: 2600, city: 'Ankara', categoryId: categories[6].id, brandId: brands[3].id, sellerId: sellers[0].id },
    { id: 'listing-y4', title: 'Held Rainblock Top Yağmurluk Mont', description: 'Tüm tekstil montların üzerine giyilen yağmurluk üst. Beden L, sarı renk görünürlük katkısı sağlıyor. Temiz.', condition: 'GOOD', sizeLabel: 'L', price: 890, originalPrice: 1600, city: 'Bursa', categoryId: categories[6].id, brandId: brands[5].id, sellerId: sellers[1].id },
    { id: 'listing-y5', title: "Rev'it! Nitric H2O Yağmurluk Pantolon — S", description: 'Hafif, kompakt katlanabilen su geçirmez pantolon. Reflektif detaylar. Beden S, sıfır.', condition: 'NEW', sizeLabel: 'S', price: 1650, originalPrice: 2400, city: 'Antalya', categoryId: categories[6].id, brandId: brands[6].id, sellerId: sellers[2].id },
  ];

  await Promise.all(
    listings.map((l) =>
      prisma.listing.upsert({
        where: { id: l.id },
        update: {},
        create: {
          id: l.id,
          title: l.title,
          description: l.description,
          condition: l.condition as any,
          sizeLabel: l.sizeLabel,
          price: l.price,
          originalPrice: l.originalPrice ?? null,
          city: l.city,
          status: 'ACTIVE',
          sellerId: l.sellerId,
          categoryId: l.categoryId,
          brandId: l.brandId ?? null,
          publishedAt: new Date(),
          viewCount: Math.floor(Math.random() * 200) + 10,
          favoriteCount: Math.floor(Math.random() * 30),
        },
      })
    )
  );

  // ============ ÜYELIK PLANLARI ============
  const plans = await Promise.all([
    prisma.plan.upsert({
      where: { slug: 'driver' },
      update: {},
      create: {
        name: 'Sürücü',
        slug: 'driver',
        priceMonthly: 0,
        commissionRate: 0.08,
        maxActiveListings: 5,
        featuredCredits: 0,
        isActive: true,
        sortOrder: 1,
      },
    }),
    prisma.plan.upsert({
      where: { slug: 'driver-plus' },
      update: {},
      create: {
        name: 'Sürücü+',
        slug: 'driver-plus',
        priceMonthly: 149,
        commissionRate: 0.04,
        maxActiveListings: null, // sınırsız
        featuredCredits: 3,
        isActive: true,
        sortOrder: 2,
      },
    }),
    prisma.plan.upsert({
      where: { slug: 'shop' },
      update: {},
      create: {
        name: 'Mağaza',
        slug: 'shop',
        priceMonthly: 499,
        commissionRate: 0.025,
        maxActiveListings: null,
        featuredCredits: 10,
        isActive: true,
        sortOrder: 3,
      },
    }),
  ]);

  // ============ SUBSKRİPSİYONLAR ============
  await Promise.all([
    prisma.subscription.upsert({
      where: { userId: users[1].id },
      update: {},
      create: { userId: users[1].id, planId: plans[1].id, status: 'ACTIVE', founderDiscount: true },
    }),
    prisma.subscription.upsert({
      where: { userId: users[2].id },
      update: {},
      create: { userId: users[2].id, planId: plans[0].id, status: 'ACTIVE' },
    }),
    prisma.subscription.upsert({
      where: { userId: users[3].id },
      update: {},
      create: { userId: users[3].id, planId: plans[0].id, status: 'ACTIVE' },
    }),
  ]);

  // ============ PLATFORM AYARLARI ============
  await prisma.platformSetting.upsert({
    where: { key: 'launch_mode' },
    update: { value: true },
    create: {
      key: 'launch_mode',
      value: true, // lansman dönemi: komisyonsuz
    },
  });

  await prisma.platformSetting.upsert({
    where: { key: 'commission_enabled' },
    update: { value: false },
    create: {
      key: 'commission_enabled',
      value: false, // lansmanda kapalı
    },
  });

  console.log('✅ Seeding completed!');
  console.log('\n🔐 Test hesapları:');
  console.log('  - Email: admin@motorya.com.tr     / Şifre: admin123!   (SUPER_ADMIN)');
  console.log('  - Email: ahmet@example.com   / Şifre: password123');
  console.log('  - Email: selin@example.com   / Şifre: password123');
  console.log('  - Email: burak@example.com   / Şifre: password123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
