// Cart module

const SHIPPING_THRESHOLD = 100000;
const SHIPPING_COST = 15000;

function calculateCartTotals(cart) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
}

function renderCartItem(item) {
  return `
    <div class="cart-item flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700" data-item-id="${item.id}">
      <!-- Image -->
      <div class="flex-shrink-0">
        <a href="product-detail.html?id=${item.id}">
          <img
            src="${item.image}"
            alt="${item.name}"
            class="w-20 h-20 object-cover rounded-lg"
            onerror="this.src='https://picsum.photos/seed/${item.id}/200/200'"
          />
        </a>
      </div>

      <!-- Details -->
      <div class="flex-1 min-w-0">
        <a href="product-detail.html?id=${item.id}" class="hover:text-matcha-600 transition-colors">
          <h3 class="font-semibold text-gray-800 dark:text-white text-sm leading-tight mb-1 line-clamp-2">${item.name}</h3>
        </a>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">${item.category}</p>
        <p class="text-matcha-600 dark:text-matcha-400 font-bold">${formatRupiah(item.price)}</p>
      </div>

      <!-- Quantity & Remove -->
      <div class="flex flex-col items-end justify-between flex-shrink-0">
        <!-- Remove button -->
        <button
          class="remove-item-btn text-gray-400 hover:text-red-500 transition-colors p-1"
          data-item-id="${item.id}"
          title="Hapus dari keranjang"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>

        <!-- Quantity controls -->
        <div class="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
          <button
            class="qty-minus-btn px-2 py-1 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold transition text-sm"
            data-item-id="${item.id}"
          >−</button>
          <span class="qty-display px-3 py-1 font-semibold text-gray-800 dark:text-white text-sm min-w-[2.5rem] text-center">${item.quantity}</span>
          <button
            class="qty-plus-btn px-2 py-1 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold transition text-sm"
            data-item-id="${item.id}"
          >+</button>
        </div>

        <!-- Item total -->
        <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">${formatRupiah(item.price * item.quantity)}</p>
      </div>
    </div>
  `;
}

function renderOrderSummary(cart) {
  const { subtotal, shipping, total } = calculateCartTotals(cart);
  const summaryEl = document.getElementById('orderSummary');
  if (!summaryEl) return;

  summaryEl.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24">
      <h2 class="text-lg font-bold text-gray-800 dark:text-white mb-4">Ringkasan Pesanan</h2>

      <div class="space-y-3 mb-4">
        <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Subtotal (${cart.reduce((s, i) => s + i.quantity, 0)} item)</span>
          <span>${formatRupiah(subtotal)}</span>
        </div>
        <div class="flex justify-between text-sm ${shipping === 0 ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'}">
          <span>Ongkos Kirim</span>
          <span>${shipping === 0 ? 'GRATIS 🎉' : formatRupiah(shipping)}</span>
        </div>
        ${shipping > 0 ? `
        <div class="text-xs text-gray-500 dark:text-gray-400 bg-matcha-50 dark:bg-matcha-900 rounded-lg p-2">
          Belanja ${formatRupiah(SHIPPING_THRESHOLD - subtotal)} lagi untuk gratis ongkir!
        </div>
        ` : ''}
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700 pt-3 mb-6">
        <div class="flex justify-between font-bold text-gray-800 dark:text-white">
          <span>Total</span>
          <span class="text-matcha-600 dark:text-matcha-400 text-lg">${formatRupiah(total)}</span>
        </div>
      </div>

      <a
        href="checkout.html"
        class="block w-full bg-matcha-600 hover:bg-matcha-700 text-white font-semibold py-3 px-6 rounded-xl text-center transition-all duration-200 active:scale-95"
      >
        Lanjut ke Checkout
      </a>

      <a
        href="home.html"
        class="block w-full mt-3 text-center text-matcha-600 dark:text-matcha-400 hover:underline text-sm"
      >
        ← Lanjut Belanja
      </a>
    </div>
  `;
}

function renderCart() {
  const cart = getCart();
  const cartContainer = document.getElementById('cartItems');
  const emptyCart = document.getElementById('emptyCart');
  const cartContent = document.getElementById('cartContent');

  if (!cartContainer) return;

  if (cart.length === 0) {
    if (emptyCart) emptyCart.classList.remove('hidden');
    if (cartContent) cartContent.classList.add('hidden');
    return;
  }

  if (emptyCart) emptyCart.classList.add('hidden');
  if (cartContent) cartContent.classList.remove('hidden');

  cartContainer.innerHTML = cart.map(renderCartItem).join('');
  renderOrderSummary(cart);

  // Attach event listeners
  cartContainer.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const itemId = parseInt(this.dataset.itemId);
      removeFromCart(itemId);
    });
  });

  cartContainer.querySelectorAll('.qty-minus-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const itemId = parseInt(this.dataset.itemId);
      updateCartQuantity(itemId, -1);
    });
  });

  cartContainer.querySelectorAll('.qty-plus-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const itemId = parseInt(this.dataset.itemId);
      updateCartQuantity(itemId, 1);
    });
  });
}

function removeFromCart(itemId) {
  let cart = getCart();
  const item = cart.find(i => i.id === itemId);
  cart = cart.filter(i => i.id !== itemId);
  setCart(cart);
  updateNavCounts();
  if (item) toast.info(`${item.name} dihapus dari keranjang`);
  renderCart();
}

function updateCartQuantity(itemId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === itemId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(itemId);
    return;
  }

  setCart(cart);
  updateNavCounts();
  renderCart();
}

function initCartPage() {
  if (!requireAuth()) return;

  renderNavbar('cart');
  initDarkMode();
  renderCart();
}
