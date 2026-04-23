// Orders module

function getStatusColor(status) {
  const colors = {
    'Diproses': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    'Dikirim': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    'Selesai': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    'Dibatalkan': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

function getPaymentIcon(method) {
  const icons = {
    'Transfer Bank': '🏦',
    'COD': '💵',
    'E-Wallet': '📱',
  };
  return icons[method] || '💳';
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function renderOrderCard(order) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const previewItems = order.items.slice(0, 3);

  return `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden order-card" data-order-id="${order.id}">
      <!-- Order Header -->
      <div class="p-4 border-b border-gray-100 dark:border-gray-700">
        <div class="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">ID Transaksi</p>
            <p class="font-mono text-sm font-semibold text-matcha-700 dark:text-matcha-300">${order.id}</p>
          </div>
          <span class="text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(order.status)}">${order.status}</span>
        </div>
        <div class="flex flex-wrap gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>📅 ${formatDate(order.createdAt)}</span>
          <span>${getPaymentIcon(order.paymentMethod)} ${order.paymentMethod}</span>
          <span>📦 ${itemCount} item</span>
        </div>
      </div>

      <!-- Items Preview -->
      <div class="p-4">
        <div class="flex gap-2 mb-3">
          ${previewItems.map(item => `
            <img
              src="${item.image}"
              alt="${item.name}"
              class="w-14 h-14 object-cover rounded-lg border border-gray-100 dark:border-gray-700"
              onerror="this.src='https://picsum.photos/seed/${item.id}/100/100'"
            />
          `).join('')}
          ${order.items.length > 3 ? `
            <div class="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-gray-600 dark:text-gray-400">
              +${order.items.length - 3}
            </div>
          ` : ''}
        </div>

        <!-- Total & Toggle -->
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Total Pembayaran</p>
            <p class="font-bold text-matcha-600 dark:text-matcha-400 text-lg">${formatRupiah(order.total)}</p>
          </div>
          <button
            class="toggle-detail-btn text-sm text-matcha-600 dark:text-matcha-400 hover:underline flex items-center gap-1 transition"
            data-order-id="${order.id}"
          >
            <span class="toggle-text">Lihat Detail</span>
            <svg class="toggle-icon w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Expandable Detail -->
      <div class="order-detail hidden border-t border-gray-100 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900" data-order-id="${order.id}">
        <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-sm">Detail Pesanan</h4>

        <!-- Items -->
        <div class="space-y-2 mb-4">
          ${order.items.map(item => `
            <div class="flex items-center gap-3">
              <img
                src="${item.image}"
                alt="${item.name}"
                class="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                onerror="this.src='https://picsum.photos/seed/${item.id}/100/100'"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800 dark:text-white line-clamp-1">${item.name}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">${formatRupiah(item.price)} × ${item.quantity}</p>
              </div>
              <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex-shrink-0">${formatRupiah(item.price * item.quantity)}</p>
            </div>
          `).join('')}
        </div>

        <!-- Shipping Info -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3 text-sm">
          <p class="font-semibold text-gray-700 dark:text-gray-300 mb-2">Informasi Pengiriman</p>
          <p class="text-gray-600 dark:text-gray-400"><span class="font-medium">Nama:</span> ${order.fullName}</p>
          <p class="text-gray-600 dark:text-gray-400"><span class="font-medium">Alamat:</span> ${order.address}</p>
          <p class="text-gray-600 dark:text-gray-400"><span class="font-medium">No HP:</span> ${order.phone}</p>
        </div>

        <!-- Price Breakdown -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-3 text-sm">
          <div class="flex justify-between text-gray-600 dark:text-gray-400 mb-1">
            <span>Subtotal</span>
            <span>${formatRupiah(order.subtotal)}</span>
          </div>
          <div class="flex justify-between ${order.shipping === 0 ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'} mb-1">
            <span>Ongkos Kirim</span>
            <span>${order.shipping === 0 ? 'GRATIS' : formatRupiah(order.shipping)}</span>
          </div>
          <div class="flex justify-between font-bold text-gray-800 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-700">
            <span>Total</span>
            <span class="text-matcha-600 dark:text-matcha-400">${formatRupiah(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initOrdersPage() {
  if (!requireAuth()) return;

  renderNavbar('orders');
  initDarkMode();

  const orders = getOrders();
  const container = document.getElementById('ordersContainer');
  const emptyState = document.getElementById('emptyOrders');
  const orderCount = document.getElementById('orderCount');

  if (!container) return;

  if (orderCount) {
    orderCount.textContent = `${orders.length} pesanan`;
  }

  if (orders.length === 0) {
    if (emptyState) emptyState.classList.remove('hidden');
    container.innerHTML = '';
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  container.innerHTML = orders.map(renderOrderCard).join('');

  // Toggle detail
  container.querySelectorAll('.toggle-detail-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const orderId = this.dataset.orderId;
      const detail = container.querySelector(`.order-detail[data-order-id="${orderId}"]`);
      const icon = this.querySelector('.toggle-icon');
      const text = this.querySelector('.toggle-text');

      if (detail) {
        detail.classList.toggle('hidden');
        if (detail.classList.contains('hidden')) {
          icon.style.transform = 'rotate(0deg)';
          text.textContent = 'Lihat Detail';
        } else {
          icon.style.transform = 'rotate(180deg)';
          text.textContent = 'Sembunyikan';
        }
      }
    });
  });
}
