# 🍵 MatchaShop — Online Shop

Aplikasi online shop fullstack berbasis JavaScript Vanilla, Tailwind CSS, dan LocalStorage. Dibangun sebagai proyek UTS Pemrograman Web 2.

## 🌐 Demo

> [Link GitHub Pages akan diisi setelah deploy]

---

## ✨ Fitur

### Fitur Wajib
- **Authentication** — Login & Register dengan validasi (email unik, password min. 6 karakter), akun demo tersedia
- **Product Management** — 12 produk dari 5 kategori, ditampilkan dari data JSON (embedded JS)
- **Search & Filter** — Cari produk berdasarkan nama, filter kategori, filter rentang harga, dan sorting
- **Cart (Keranjang)** — Tambah, hapus, update jumlah item, total harga otomatis, gratis ongkir > Rp 100.000
- **Checkout** — Form nama, alamat, no HP, pilihan metode pembayaran (Transfer Bank / COD / E-Wallet), generate ID transaksi
- **Order History** — Riwayat pembelian per user dengan detail transaksi yang bisa di-expand
- **UI/UX Responsive** — Navbar, product grid, cart page, checkout page — mobile & desktop
- **State Management** — LocalStorage untuk user session, cart, dan orders (per user)

### Fitur Bonus
- 🌙 **Dark Mode** — Toggle dark/light mode, tersimpan di localStorage
- ❤️ **Wishlist** — Tambah/hapus produk ke wishlist, tampil di halaman tersendiri
- 🔔 **Toast Notifications** — Notifikasi slide-in untuk setiap aksi (tambah cart, checkout, dll.)
- ⭐ **Rating Produk** — Tampil bintang rating dan jumlah ulasan di setiap produk
- 🔐 **Password Strength Meter** — Indikator kekuatan password saat register

---

## 🛠️ Teknologi

| Teknologi | Keterangan |
|-----------|------------|
| HTML5 | Struktur halaman |
| JavaScript ES6+ | Logic aplikasi (Vanilla JS) |
| Tailwind CSS (CDN) | Styling dengan tema matcha hijau |
| LocalStorage | Simulasi database (user, cart, orders, wishlist) |
| JSON (embedded JS) | Data produk dummy |

---

## 📁 Struktur Proyek

```
MatchaShop/
├── index.html              # Entry point (redirect ke login/home)
├── README.md
├── data/
│   └── products.js         # 12 produk dummy (5 kategori)
├── js/
│   ├── utils.js            # Utility functions + navbar renderer
│   ├── toast.js            # Sistem notifikasi toast
│   ├── auth.js             # Login & Register logic
│   ├── products.js         # Product listing & detail
│   ├── cart.js             # Cart management
│   ├── checkout.js         # Checkout & order creation
│   ├── orders.js           # Order history
│   └── wishlist.js         # Wishlist management
└── pages/
    ├── login.html          # Halaman login
    ├── register.html       # Halaman register
    ├── home.html           # Beranda (product listing)
    ├── product-detail.html # Detail produk
    ├── cart.html           # Keranjang belanja
    ├── checkout.html       # Halaman checkout
    ├── orders.html         # Riwayat pesanan
    └── wishlist.html       # Wishlist
```

---

## 🚀 Cara Menjalankan

### Lokal
1. Clone repository ini:
   ```bash
   git clone https://github.com/username/NamaDepan_NamaBelakang_UTS_Web2.git
   ```
2. Buka folder project
3. Buka `index.html` di browser (atau gunakan Live Server di VS Code)
4. Tidak perlu instalasi apapun — semua dependency via CDN

### Akun Demo
Klik tombol **"Coba dengan Akun Demo"** di halaman login, lalu klik **Masuk**.

---

## 📊 Penilaian

| Aspek | Implementasi |
|-------|-------------|
| Fungsionalitas (35%) | Auth, Product, Cart, Checkout, Orders, Wishlist |
| UI/UX Tailwind (20%) | Tema matcha hijau, responsive, dark mode |
| Struktur Kode (15%) | Modular JS, pemisahan concerns per file |
| Logic JavaScript (20%) | ES6+, LocalStorage, filter/search/sort |
| Deployment (10%) | GitHub Pages |

---

## 🎨 Tema Warna

Warna primary menggunakan **Matcha Green**:
- Primary: `#5C7A3E`
- Light: `#8AAD5A`
- Dark: `#3D5229`
- Accent: `#C8E6A0`
