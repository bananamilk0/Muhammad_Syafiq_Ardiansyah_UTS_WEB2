// Utility functions for the Online Shop

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
}

function generateId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `TXN-${timestamp}-${random}`;
}

function getCurrentUser() {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = getBasePath() + 'pages/login.html';
}

function getBasePath() {
  // Determine base path for navigation
  const path = window.location.pathname;
  if (path.includes('/pages/')) {
    return '../';
  }
  return '';
}

function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = getBasePath() + 'pages/login.html';
    return false;
  }
  return true;
}

function getCart() {
  const user = getCurrentUser();
  if (!user) return [];
  const cart = localStorage.getItem(`cart_${user.email}`);
  return cart ? JSON.parse(cart) : [];
}

function setCart(cart) {
  const user = getCurrentUser();
  if (!user) return;
  localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));
}

function getOrders() {
  const user = getCurrentUser();
  if (!user) return [];
  const orders = localStorage.getItem(`orders_${user.email}`);
  return orders ? JSON.parse(orders) : [];
}

function setOrders(orders) {
  const user = getCurrentUser();
  if (!user) return;
  localStorage.setItem(`orders_${user.email}`, JSON.stringify(orders));
}

function getWishlist() {
  const user = getCurrentUser();
  if (!user) return [];
  const wishlist = localStorage.getItem(`wishlist_${user.email}`);
  return wishlist ? JSON.parse(wishlist) : [];
}

function setWishlist(wishlist) {
  const user = getCurrentUser();
  if (!user) return;
  localStorage.setItem(`wishlist_${user.email}`, JSON.stringify(wishlist));
}

function getDarkMode() {
  return localStorage.getItem('darkMode') === 'true';
}

function setDarkMode(value) {
  localStorage.setItem('darkMode', value);
  if (value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function initDarkMode() {
  if (getDarkMode()) {
    document.documentElement.classList.add('dark');
  }
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getWishlistCount() {
  return getWishlist().length;
}

function updateNavCounts() {
  const cartCountEl = document.getElementById('cartCount');
  const wishlistCountEl = document.getElementById('wishlistCount');
  if (cartCountEl) {
    const count = getCartCount();
    cartCountEl.textContent = count;
    cartCountEl.style.display = count > 0 ? 'flex' : 'none';
  }
  if (wishlistCountEl) {
    const count = getWishlistCount();
    wishlistCountEl.textContent = count;
    wishlistCountEl.style.display = count > 0 ? 'flex' : 'none';
  }
}

function renderNavbar(activePage) {
  const user = getCurrentUser();
  const basePath = getBasePath();
  const navHtml = `
    <nav class="bg-matcha-600 text-white sticky top-0 z-50 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a href="${basePath}pages/home.html" class="flex items-center space-x-2 flex-shrink-0">
            <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span class="text-matcha-600 font-bold text-sm">🍵</span>
            </div>
            <span class="font-bold text-xl tracking-tight">MatchaShop</span>
          </a>

          <!-- Search Bar -->
          <div class="flex-1 max-w-lg mx-4 hidden sm:block">
            <div class="relative">
              <input
                type="text"
                id="navSearch"
                placeholder="Cari produk..."
                class="w-full bg-matcha-700 text-white placeholder-matcha-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-white focus:bg-matcha-800 transition"
              />
              <svg class="absolute left-3 top-2.5 w-4 h-4 text-matcha-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- Right Icons -->
          <div class="flex items-center space-x-2">
            <!-- Dark Mode Toggle -->
            <button id="darkModeToggle" class="p-2 rounded-lg hover:bg-matcha-700 transition" title="Toggle dark mode">
              <svg id="sunIcon" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
              <svg id="moonIcon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
            </button>

            <!-- Wishlist -->
            <a href="${basePath}pages/wishlist.html" class="relative p-2 rounded-lg hover:bg-matcha-700 transition" title="Wishlist">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              <span id="wishlistCount" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 items-center justify-center font-bold" style="display:none">0</span>
            </a>

            <!-- Cart -->
            <a href="${basePath}pages/cart.html" class="relative p-2 rounded-lg hover:bg-matcha-700 transition" title="Keranjang">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <span id="cartCount" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 items-center justify-center font-bold" style="display:none">0</span>
            </a>

            <!-- User Dropdown -->
            <div class="relative" id="userDropdown">
              <button id="userMenuBtn" class="flex items-center space-x-1 p-2 rounded-lg hover:bg-matcha-700 transition">
                <div class="w-7 h-7 bg-matcha-400 rounded-full flex items-center justify-center text-sm font-bold">
                  ${user ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span class="hidden md:block text-sm font-medium">${user ? user.name.split(' ')[0] : 'User'}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <div id="userMenu" class="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2 z-50 border border-gray-100 dark:border-gray-700">
                <div class="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                  <p class="text-sm font-semibold text-gray-800 dark:text-white">${user ? user.name : ''}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">${user ? user.email : ''}</p>
                </div>
                <a href="${basePath}pages/orders.html" class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-matcha-50 dark:hover:bg-gray-700 transition">
                  <svg class="w-4 h-4 mr-2 text-matcha-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  Pesanan Saya
                </a>
                <a href="${basePath}pages/wishlist.html" class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-matcha-50 dark:hover:bg-gray-700 transition">
                  <svg class="w-4 h-4 mr-2 text-matcha-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                  Wishlist
                </a>
                <hr class="my-1 border-gray-100 dark:border-gray-700">
                <button onclick="logout()" class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 transition">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  Keluar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Search -->
        <div class="sm:hidden pb-3">
          <div class="relative">
            <input
              type="text"
              id="navSearchMobile"
              placeholder="Cari produk..."
              class="w-full bg-matcha-700 text-white placeholder-matcha-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-white transition"
            />
            <svg class="absolute left-3 top-2.5 w-4 h-4 text-matcha-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
      </div>
    </nav>
  `;

  const navContainer = document.getElementById('navbar');
  if (navContainer) {
    navContainer.innerHTML = navHtml;
    initNavbar();
  }
}

function initNavbar() {
  // Dark mode toggle
  const toggle = document.getElementById('darkModeToggle');
  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');

  function updateDarkModeIcons() {
    if (getDarkMode()) {
      sunIcon.classList.remove('hidden');
      moonIcon.classList.add('hidden');
    } else {
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    }
  }

  updateDarkModeIcons();

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = getDarkMode();
      setDarkMode(!current);
      updateDarkModeIcons();
    });
  }

  // User dropdown
  const userMenuBtn = document.getElementById('userMenuBtn');
  const userMenu = document.getElementById('userMenu');
  if (userMenuBtn && userMenu) {
    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userMenu.classList.toggle('hidden');
    });
    document.addEventListener('click', () => {
      userMenu.classList.add('hidden');
    });
  }

  // Search
  const navSearch = document.getElementById('navSearch');
  const navSearchMobile = document.getElementById('navSearchMobile');
  function handleSearch(e) {
    if (e.key === 'Enter') {
      const query = e.target.value.trim();
      if (query) {
        const basePath = getBasePath();
        window.location.href = `${basePath}pages/home.html?search=${encodeURIComponent(query)}`;
      }
    }
  }
  if (navSearch) navSearch.addEventListener('keydown', handleSearch);
  if (navSearchMobile) navSearchMobile.addEventListener('keydown', handleSearch);

  updateNavCounts();
}
