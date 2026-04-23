// Products module

let currentProducts = [];
let filteredProducts = [];
let activeCategory = 'all';
let searchQuery = '';
let priceRange = { min: 0, max: Infinity };

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  let stars = '';
  for (let i = 0; i < full; i++) stars += '<span class="text-yellow-400">★</span>';
  if (half) stars += '<span class="text-yellow-400">½</span>';
  for (let i = 0; i < empty; i++) stars += '<span class="text-gray-300">★</span>';
  return stars;
}

function getCategoryColor(category) {
  const colors = {
    'Electronics': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    'Fashion': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    'Food & Beverage': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    'Beauty': 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
    'Sports': 'bg-matcha-100 text-matcha-700 dark:bg-matcha-900 dark:text-matcha-300',
  };
  return colors[category] || 'bg-gray-100 text-gray-700';
}

function isInWishlist(productId) {
  const wishlist = getWishlist();
  return wishlist.some(item => item.id === productId);
}

function renderProductCard(product) {
  const inWishlist = isInWishlist(product.id);
  return `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group flex flex-col" data-product-id="${product.id}">
      <!-- Image -->
      <div class="relative overflow-hidden">
        <a href="product-detail.html?id=${product.id}">
          <img
            src="${product.image}"
            alt="${product.name}"
            class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onerror="this.src='https://picsum.photos/seed/${product.id}/600/400'"
          />
        </a>
        <!-- Wishlist button -->
        <button
          class="wishlist-btn absolute top-3 right-3 w-9 h-9 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
          data-product-id="${product.id}"
          title="${inWishlist ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}"
        >
          <svg class="w-5 h-5 transition-colors ${inWishlist ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-400'}" fill="${inWishlist ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
        <!-- Category badge -->
        <span class="absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${getCategoryColor(product.category)}">
          ${product.category}
        </span>
      </div>

      <!-- Content -->
      <div class="p-4 flex flex-col flex-1">
        <a href="product-detail.html?id=${product.id}" class="hover:text-matcha-600 transition-colors">
          <h3 class="font-semibold text-gray-800 dark:text-white text-sm leading-tight mb-1 line-clamp-2">${product.name}</h3>
        </a>

        <!-- Rating -->
        <div class="flex items-center gap-1 mb-2">
          <div class="text-sm">${renderStars(product.rating)}</div>
          <span class="text-xs text-gray-500 dark:text-gray-400">${product.rating} (${product.reviewCount})</span>
        </div>

        <div class="mt-auto">
          <!-- Price -->
          <p class="text-matcha-600 dark:text-matcha-400 font-bold text-lg mb-3">${formatRupiah(product.price)}</p>

          <!-- Add to Cart -->
          <button
            class="add-to-cart-btn w-full bg-matcha-600 hover:bg-matcha-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm active:scale-95"
            data-product-id="${product.id}"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            Tambah ke Keranjang
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderProducts(products) {
  const grid = document.getElementById('productGrid');
  const emptyState = document.getElementById('emptyState');
  const productCount = document.getElementById('productCount');

  if (!grid) return;

  if (productCount) {
    productCount.textContent = `${products.length} produk ditemukan`;
  }

  if (products.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  grid.innerHTML = products.map(renderProductCard).join('');

  // Attach event listeners
  grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const productId = parseInt(this.dataset.productId);
      addToCartById(productId);
    });
  });

  grid.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const productId = parseInt(this.dataset.productId);
      toggleWishlistById(productId);
    });
  });
}

function addToCartById(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  setCart(cart);
  updateNavCounts();
  toast.success(`${product.name} ditambahkan ke keranjang! 🛒`);
}

function toggleWishlistById(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const wishlist = getWishlist();
  const index = wishlist.findIndex(item => item.id === productId);

  if (index > -1) {
    wishlist.splice(index, 1);
    setWishlist(wishlist);
    toast.info(`${product.name} dihapus dari wishlist`);
  } else {
    wishlist.push(product);
    setWishlist(wishlist);
    toast.success(`${product.name} ditambahkan ke wishlist! ❤️`);
  }

  updateNavCounts();

  // Update button UI
  const btn = document.querySelector(`.wishlist-btn[data-product-id="${productId}"]`);
  if (btn) {
    const inWishlist = index === -1; // was added
    const svg = btn.querySelector('svg');
    if (inWishlist) {
      svg.setAttribute('fill', 'currentColor');
      svg.className = 'w-5 h-5 transition-colors text-red-500 fill-red-500';
      btn.title = 'Hapus dari wishlist';
    } else {
      svg.setAttribute('fill', 'none');
      svg.className = 'w-5 h-5 transition-colors text-gray-400 hover:text-red-400';
      btn.title = 'Tambah ke wishlist';
    }
  }
}

function applyFilters() {
  filteredProducts = currentProducts.filter(product => {
    const matchCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchSearch = !searchQuery || product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPrice = product.price >= priceRange.min && product.price <= priceRange.max;
    return matchCategory && matchSearch && matchPrice;
  });

  renderProducts(filteredProducts);
}

function initHomePage() {
  if (!requireAuth()) return;

  currentProducts = [...PRODUCTS];
  filteredProducts = [...PRODUCTS];

  renderNavbar('home');
  initDarkMode();

  // Check for search query in URL
  const urlParams = new URLSearchParams(window.location.search);
  const urlSearch = urlParams.get('search');
  if (urlSearch) {
    searchQuery = urlSearch;
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = urlSearch;
    // Also update navbar search
    setTimeout(() => {
      const navSearch = document.getElementById('navSearch');
      if (navSearch) navSearch.value = urlSearch;
    }, 100);
  }

  applyFilters();

  // Category filters
  const categoryBtns = document.querySelectorAll('.category-btn');
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      categoryBtns.forEach(b => {
        b.classList.remove('bg-matcha-600', 'text-white');
        b.classList.add('bg-white', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300');
      });
      this.classList.add('bg-matcha-600', 'text-white');
      this.classList.remove('bg-white', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300');
      activeCategory = this.dataset.category;
      applyFilters();
    });
  });

  // Search input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      searchQuery = this.value.trim();
      applyFilters();
    });
  }

  // Price range
  const priceMin = document.getElementById('priceMin');
  const priceMax = document.getElementById('priceMax');
  const priceMinDisplay = document.getElementById('priceMinDisplay');
  const priceMaxDisplay = document.getElementById('priceMaxDisplay');

  if (priceMin) {
    priceMin.addEventListener('input', function() {
      priceRange.min = parseInt(this.value) || 0;
      if (priceMinDisplay) priceMinDisplay.textContent = formatRupiah(priceRange.min);
      applyFilters();
    });
  }

  if (priceMax) {
    priceMax.addEventListener('input', function() {
      const val = parseInt(this.value);
      const maxVal = parseInt(this.max);
      priceRange.max = (val >= maxVal) ? Infinity : val;
      if (priceMaxDisplay) priceMaxDisplay.textContent = priceRange.max === Infinity ? '∞' : formatRupiah(priceRange.max);
      applyFilters();
    });
  }

  // Sort
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      const val = this.value;
      if (val === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
      } else if (val === 'price-desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
      } else if (val === 'rating') {
        filteredProducts.sort((a, b) => b.rating - a.rating);
      } else if (val === 'name') {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        // Reset to default order (apply current filters again)
        applyFilters();
        return;
      }
      renderProducts(filteredProducts);
    });
  }
}

function initProductDetailPage() {
  if (!requireAuth()) return;

  renderNavbar('product-detail');
  initDarkMode();

  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id'));
  const product = PRODUCTS.find(p => p.id === productId);

  if (!product) {
    document.getElementById('productDetail').innerHTML = `
      <div class="text-center py-20">
        <p class="text-gray-500 text-xl">Produk tidak ditemukan</p>
        <a href="home.html" class="mt-4 inline-block text-matcha-600 hover:underline">← Kembali ke Beranda</a>
      </div>
    `;
    return;
  }

  const inWishlist = isInWishlist(product.id);
  const container = document.getElementById('productDetail');

  container.innerHTML = `
    <div class="max-w-5xl mx-auto px-4 py-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <a href="home.html" class="hover:text-matcha-600 transition-colors">Beranda</a>
        <span>/</span>
        <span class="text-gray-400">${product.category}</span>
        <span>/</span>
        <span class="text-gray-700 dark:text-gray-200 font-medium truncate">${product.name}</span>
      </nav>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Image -->
        <div class="rounded-2xl overflow-hidden shadow-lg">
          <img
            src="${product.image}"
            alt="${product.name}"
            class="w-full h-80 md:h-96 object-cover"
            onerror="this.src='https://picsum.photos/seed/${product.id}/600/400'"
          />
        </div>

        <!-- Details -->
        <div class="flex flex-col">
          <span class="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 w-fit ${getCategoryColor(product.category)}">${product.category}</span>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">${product.name}</h1>

          <!-- Rating -->
          <div class="flex items-center gap-2 mb-4">
            <div class="text-lg">${renderStars(product.rating)}</div>
            <span class="text-gray-600 dark:text-gray-400 text-sm">${product.rating} dari 5 (${product.reviewCount} ulasan)</span>
          </div>

          <!-- Price -->
          <div class="bg-matcha-50 dark:bg-matcha-900 rounded-xl p-4 mb-4">
            <p class="text-3xl font-bold text-matcha-600 dark:text-matcha-400">${formatRupiah(product.price)}</p>
            <p class="text-sm text-matcha-700 dark:text-matcha-300 mt-1">✓ Gratis ongkir untuk pembelian di atas Rp 100.000</p>
          </div>

          <!-- Description -->
          <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">${product.description}</p>

          <!-- Quantity -->
          <div class="flex items-center gap-4 mb-6">
            <span class="text-gray-700 dark:text-gray-300 font-medium">Jumlah:</span>
            <div class="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
              <button id="qtyMinus" class="px-3 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold transition">−</button>
              <span id="qtyDisplay" class="px-4 py-2 font-semibold text-gray-800 dark:text-white min-w-[3rem] text-center">1</span>
              <button id="qtyPlus" class="px-3 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold transition">+</button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button id="addToCartBtn" class="flex-1 bg-matcha-600 hover:bg-matcha-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-95">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              Tambah ke Keranjang
            </button>
            <button id="wishlistBtn" class="w-12 h-12 rounded-xl border-2 ${inWishlist ? 'border-red-400 bg-red-50 dark:bg-red-900' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'} flex items-center justify-center transition-all duration-200 hover:scale-105" title="${inWishlist ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}">
              <svg class="w-6 h-6 ${inWishlist ? 'text-red-500 fill-red-500' : 'text-gray-400'}" fill="${inWishlist ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Quantity controls
  let qty = 1;
  document.getElementById('qtyMinus').addEventListener('click', () => {
    if (qty > 1) {
      qty--;
      document.getElementById('qtyDisplay').textContent = qty;
    }
  });
  document.getElementById('qtyPlus').addEventListener('click', () => {
    qty++;
    document.getElementById('qtyDisplay').textContent = qty;
  });

  // Add to cart
  document.getElementById('addToCartBtn').addEventListener('click', () => {
    const cart = getCart();
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({ ...product, quantity: qty });
    }
    setCart(cart);
    updateNavCounts();
    toast.success(`${product.name} (x${qty}) ditambahkan ke keranjang! 🛒`);
  });

  // Wishlist toggle
  const wishlistBtn = document.getElementById('wishlistBtn');
  wishlistBtn.addEventListener('click', () => {
    const wishlist = getWishlist();
    const index = wishlist.findIndex(item => item.id === product.id);
    const svg = wishlistBtn.querySelector('svg');

    if (index > -1) {
      wishlist.splice(index, 1);
      setWishlist(wishlist);
      svg.setAttribute('fill', 'none');
      svg.className = 'w-6 h-6 text-gray-400';
      wishlistBtn.className = wishlistBtn.className.replace('border-red-400 bg-red-50 dark:bg-red-900', 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800');
      toast.info(`${product.name} dihapus dari wishlist`);
    } else {
      wishlist.push(product);
      setWishlist(wishlist);
      svg.setAttribute('fill', 'currentColor');
      svg.className = 'w-6 h-6 text-red-500 fill-red-500';
      wishlistBtn.className = wishlistBtn.className.replace('border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800', 'border-red-400 bg-red-50 dark:bg-red-900');
      toast.success(`${product.name} ditambahkan ke wishlist! ❤️`);
    }
    updateNavCounts();
  });
}
