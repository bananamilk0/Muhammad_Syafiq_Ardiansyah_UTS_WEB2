// Wishlist module

function renderWishlistCard(product) {
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
        <!-- Remove from wishlist -->
        <button
          class="remove-wishlist-btn absolute top-3 right-3 w-9 h-9 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-red-50"
          data-product-id="${product.id}"
          title="Hapus dari wishlist"
        >
          <svg class="w-5 h-5 text-red-500 fill-red-500" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
        <!-- Category badge -->
        <span class="absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${getCategoryColorWishlist(product.category)}">
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
          <div class="text-sm">${renderStarsWishlist(product.rating)}</div>
          <span class="text-xs text-gray-500 dark:text-gray-400">${product.rating} (${product.reviewCount})</span>
        </div>

        <div class="mt-auto">
          <p class="text-matcha-600 dark:text-matcha-400 font-bold text-lg mb-3">${formatRupiah(product.price)}</p>

          <button
            class="add-to-cart-from-wishlist w-full bg-matcha-600 hover:bg-matcha-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm active:scale-95"
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

function getCategoryColorWishlist(category) {
  const colors = {
    'Electronics': 'bg-blue-100 text-blue-700',
    'Fashion': 'bg-purple-100 text-purple-700',
    'Food & Beverage': 'bg-orange-100 text-orange-700',
    'Beauty': 'bg-pink-100 text-pink-700',
    'Sports': 'bg-matcha-100 text-matcha-700',
  };
  return colors[category] || 'bg-gray-100 text-gray-700';
}

function renderStarsWishlist(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  let stars = '';
  for (let i = 0; i < full; i++) stars += '<span class="text-yellow-400">★</span>';
  if (half) stars += '<span class="text-yellow-400">½</span>';
  for (let i = 0; i < empty; i++) stars += '<span class="text-gray-300">★</span>';
  return stars;
}

function renderWishlist() {
  const wishlist = getWishlist();
  const grid = document.getElementById('wishlistGrid');
  const emptyState = document.getElementById('emptyWishlist');
  const wishlistCount = document.getElementById('wishlistItemCount');

  if (!grid) return;

  if (wishlistCount) {
    wishlistCount.textContent = `${wishlist.length} item`;
  }

  if (wishlist.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  grid.innerHTML = wishlist.map(renderWishlistCard).join('');

  // Remove from wishlist
  grid.querySelectorAll('.remove-wishlist-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const productId = parseInt(this.dataset.productId);
      removeFromWishlist(productId);
    });
  });

  // Add to cart from wishlist
  grid.querySelectorAll('.add-to-cart-from-wishlist').forEach(btn => {
    btn.addEventListener('click', function() {
      const productId = parseInt(this.dataset.productId);
      addToCartFromWishlist(productId);
    });
  });
}

function removeFromWishlist(productId) {
  const wishlist = getWishlist();
  const item = wishlist.find(i => i.id === productId);
  const newWishlist = wishlist.filter(i => i.id !== productId);
  setWishlist(newWishlist);
  updateNavCounts();
  if (item) toast.info(`${item.name} dihapus dari wishlist`);
  renderWishlist();
}

function addToCartFromWishlist(productId) {
  const wishlist = getWishlist();
  const product = wishlist.find(i => i.id === productId);
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

function initWishlistPage() {
  if (!requireAuth()) return;

  renderNavbar('wishlist');
  initDarkMode();
  renderWishlist();
}
