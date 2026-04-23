// Checkout module

function renderCheckoutSummary() {
  const cart = getCart();
  const summaryEl = document.getElementById('checkoutSummary');
  if (!summaryEl || cart.length === 0) return;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 100000 ? 0 : 15000;
  const total = subtotal + shipping;

  summaryEl.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 class="text-lg font-bold text-gray-800 dark:text-white mb-4">Ringkasan Pesanan</h2>

      <!-- Items list -->
      <div class="space-y-3 mb-4 max-h-64 overflow-y-auto">
        ${cart.map(item => `
          <div class="flex items-center gap-3">
            <img
              src="${item.image}"
              alt="${item.name}"
              class="w-12 h-12 object-cover rounded-lg flex-shrink-0"
              onerror="this.src='https://picsum.photos/seed/${item.id}/100/100'"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-800 dark:text-white line-clamp-1">${item.name}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">x${item.quantity}</p>
            </div>
            <p class="text-sm font-semibold text-matcha-600 dark:text-matcha-400 flex-shrink-0">${formatRupiah(item.price * item.quantity)}</p>
          </div>
        `).join('')}
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2">
        <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Subtotal</span>
          <span>${formatRupiah(subtotal)}</span>
        </div>
        <div class="flex justify-between text-sm ${shipping === 0 ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'}">
          <span>Ongkos Kirim</span>
          <span>${shipping === 0 ? 'GRATIS' : formatRupiah(shipping)}</span>
        </div>
        <div class="flex justify-between font-bold text-gray-800 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
          <span>Total Pembayaran</span>
          <span class="text-matcha-600 dark:text-matcha-400 text-lg">${formatRupiah(total)}</span>
        </div>
      </div>
    </div>
  `;

  // Store total for form submission
  window._checkoutTotal = total;
  window._checkoutSubtotal = subtotal;
  window._checkoutShipping = shipping;
}

function initCheckoutPage() {
  if (!requireAuth()) return;

  renderNavbar('checkout');
  initDarkMode();

  const cart = getCart();

  // Redirect if cart is empty
  if (cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  renderCheckoutSummary();

  // Pre-fill user info
  const user = getCurrentUser();
  if (user) {
    const nameInput = document.getElementById('fullName');
    if (nameInput) nameInput.value = user.name;
  }

  // Handle form submission
  const form = document.getElementById('checkoutForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const address = document.getElementById('address').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const paymentMethod = document.querySelector('input[name="payment"]:checked');

    // Validation
    if (!fullName || fullName.length < 3) {
      toast.error('Nama lengkap harus diisi (minimal 3 karakter)');
      return;
    }
    if (!address || address.length < 10) {
      toast.error('Alamat lengkap harus diisi (minimal 10 karakter)');
      return;
    }
    if (!phone || !/^[0-9+\-\s]{8,15}$/.test(phone)) {
      toast.error('Nomor HP tidak valid');
      return;
    }
    if (!paymentMethod) {
      toast.error('Pilih metode pembayaran');
      return;
    }

    const btn = document.getElementById('submitOrderBtn');
    btn.disabled = true;
    btn.innerHTML = `
      <svg class="animate-spin w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      Memproses Pesanan...
    `;

    setTimeout(() => {
      // Create order
      const order = {
        id: generateId(),
        userId: user.email,
        items: [...cart],
        fullName,
        address,
        phone,
        paymentMethod: paymentMethod.value,
        subtotal: window._checkoutSubtotal,
        shipping: window._checkoutShipping,
        total: window._checkoutTotal,
        status: 'Diproses',
        createdAt: new Date().toISOString()
      };

      const orders = getOrders();
      orders.unshift(order);
      setOrders(orders);

      // Clear cart
      setCart([]);
      updateNavCounts();

      // Show success modal
      showOrderSuccessModal(order);
    }, 1500);
  });
}

function showOrderSuccessModal(order) {
  const modal = document.getElementById('successModal');
  const modalContent = document.getElementById('successModalContent');

  if (!modal || !modalContent) {
    toast.success('Pesanan berhasil dibuat! 🎉');
    setTimeout(() => window.location.href = 'orders.html', 1500);
    return;
  }

  modalContent.innerHTML = `
    <div class="text-center">
      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Pesanan Berhasil! 🎉</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">Terima kasih atas pesanan Anda</p>

      <div class="bg-matcha-50 dark:bg-matcha-900 rounded-xl p-4 mb-6 text-left">
        <div class="flex justify-between text-sm mb-2">
          <span class="text-gray-600 dark:text-gray-400">ID Transaksi</span>
          <span class="font-mono font-semibold text-matcha-700 dark:text-matcha-300 text-xs">${order.id}</span>
        </div>
        <div class="flex justify-between text-sm mb-2">
          <span class="text-gray-600 dark:text-gray-400">Total Pembayaran</span>
          <span class="font-bold text-matcha-600 dark:text-matcha-400">${formatRupiah(order.total)}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">Metode Pembayaran</span>
          <span class="font-medium text-gray-800 dark:text-white">${order.paymentMethod}</span>
        </div>
      </div>

      <div class="flex gap-3">
        <a href="orders.html" class="flex-1 bg-matcha-600 hover:bg-matcha-700 text-white font-semibold py-3 rounded-xl text-center transition">
          Lihat Pesanan
        </a>
        <a href="home.html" class="flex-1 border border-matcha-600 text-matcha-600 hover:bg-matcha-50 font-semibold py-3 rounded-xl text-center transition">
          Lanjut Belanja
        </a>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}
