const PRODUCTS = [
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    price: 1299000,
    // Photo by C D-X on Unsplash - headphones product
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop&auto=format",
    description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions. Perfect for music lovers and remote workers who need to focus.",
    category: "Electronics",
    rating: 4.8,
    reviewCount: 234
  },
  {
    id: 2,
    name: "Smartwatch Pro Series 5",
    price: 2499000,
    // Photo by Artur Łuczka on Unsplash - smartwatch
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop&auto=format",
    description: "Advanced smartwatch with health monitoring, GPS tracking, sleep analysis, and 7-day battery life. Compatible with iOS and Android. Water resistant up to 50 meters.",
    category: "Electronics",
    rating: 4.6,
    reviewCount: 189
  },
  {
    id: 3,
    name: "Batik Tulis Premium Pria",
    price: 450000,
    // Photo by Nimble Made on Unsplash - men's shirt/clothing
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=400&fit=crop&auto=format",
    description: "Kemeja batik tulis premium dengan motif kawung klasik. Dibuat dari kain katun berkualitas tinggi, nyaman dipakai untuk acara formal maupun semi-formal. Tersedia dalam berbagai ukuran.",
    category: "Fashion",
    rating: 4.7,
    reviewCount: 312
  },
  {
    id: 4,
    name: "Sneakers Urban Street Style",
    price: 789000,
    // Photo by Domino on Unsplash - sneakers
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop&auto=format",
    description: "Sepatu sneakers modern dengan desain urban yang stylish. Sol karet anti-slip, bahan canvas premium, dan insole empuk untuk kenyamanan sepanjang hari. Cocok untuk aktivitas kasual.",
    category: "Fashion",
    rating: 4.5,
    reviewCount: 421
  },
  {
    id: 5,
    name: "Kopi Arabika Gayo Single Origin",
    price: 125000,
    // Photo by Nathan Dumlao on Unsplash - coffee beans/cup
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=400&fit=crop&auto=format",
    description: "Kopi arabika single origin dari dataran tinggi Gayo, Aceh. Proses natural dengan profil rasa fruity, floral, dan sedikit cokelat. Sangrai medium untuk cita rasa optimal. Berat 250 gram.",
    category: "Food & Beverage",
    rating: 4.9,
    reviewCount: 567
  },
  {
    id: 6,
    name: "Matcha Latte Premium Grade A",
    price: 89000,
    // Photo by Matcha & CO on Unsplash - matcha powder/drink
    image: "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=600&h=400&fit=crop&auto=format",
    description: "Bubuk matcha ceremonial grade dari Uji, Jepang. Warna hijau cerah, rasa umami yang kaya, dan aroma yang harum. Cocok untuk matcha latte, smoothie, atau baking. Berat 100 gram.",
    category: "Food & Beverage",
    rating: 4.8,
    reviewCount: 398
  },
  {
    id: 7,
    name: "Serum Vitamin C Brightening",
    price: 299000,
    // Photo by Kalos Skincare on Unsplash - skincare serum bottle
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=400&fit=crop&auto=format",
    description: "Serum wajah dengan kandungan Vitamin C 20%, Niacinamide, dan Hyaluronic Acid. Mencerahkan kulit, meratakan warna, dan melembapkan secara intensif. Cocok untuk semua jenis kulit.",
    category: "Beauty",
    rating: 4.6,
    reviewCount: 278
  },
  {
    id: 8,
    name: "Sunscreen SPF 50+ PA++++",
    price: 185000,
    // Photo by Nati Melnychuk on Unsplash - sunscreen/skincare product
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=400&fit=crop&auto=format",
    description: "Tabir surya dengan perlindungan SPF 50+ PA++++ yang ringan dan tidak lengket. Formula hybrid mineral-chemical, tahan air, dan cocok dipakai sebagai base makeup. Tidak meninggalkan white cast.",
    category: "Beauty",
    rating: 4.7,
    reviewCount: 445
  },
  {
    id: 9,
    name: "Yoga Mat Premium Anti-Slip",
    price: 350000,
    // Photo by Dane Wetton on Unsplash - yoga mat rolled up
    image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&h=400&fit=crop&auto=format",
    description: "Matras yoga premium dengan ketebalan 6mm, bahan TPE ramah lingkungan, dan permukaan anti-slip ganda. Ringan, mudah digulung, dan dilengkapi tali pembawa. Tersedia dalam berbagai warna.",
    category: "Sports",
    rating: 4.5,
    reviewCount: 203
  },
  {
    id: 10,
    name: "Dumbbell Set Adjustable 20kg",
    price: 675000,
    // Photo by Danielle Cerullo on Unsplash - dumbbells
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&auto=format",
    description: "Set dumbbell adjustable dengan total berat 20kg (2x10kg). Sistem pengunci putar yang aman, pegangan anti-slip, dan desain kompak. Ideal untuk latihan di rumah. Termasuk panduan latihan.",
    category: "Sports",
    rating: 4.4,
    reviewCount: 156
  },
  {
    id: 11,
    name: "Bluetooth Speaker Waterproof",
    price: 549000,
    // Photo by Soundtrap on Unsplash - bluetooth speaker
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=400&fit=crop&auto=format",
    description: "Speaker bluetooth portabel dengan rating IPX7 waterproof, suara 360 derajat, dan baterai 24 jam. Desain compact dan ringan, cocok untuk outdoor. Mendukung TWS pairing untuk stereo sound.",
    category: "Electronics",
    rating: 4.5,
    reviewCount: 312
  },
  {
    id: 12,
    name: "Tas Ransel Laptop Multifungsi",
    price: 425000,
    // Photo by Mia Baker on Unsplash - backpack
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop&auto=format",
    description: "Ransel multifungsi dengan kompartemen laptop 15.6 inci, port USB charging, bahan anti-air, dan desain ergonomis. Kapasitas 30L dengan banyak kantong organizer. Cocok untuk kerja dan traveling.",
    category: "Fashion",
    rating: 4.6,
    reviewCount: 289
  }
];
