// Data 10 Produk Kantin
let products = [
  { id: 1, name: 'Nasi Goreng', category: 'MAKANAN', sold: 38, revenue: 380000 },
  { id: 2, name: 'Mie Ayam', category: 'MAKANAN', sold: 23, revenue: 184000 },
  { id: 3, name: 'Nasi Uduk', category: 'MAKANAN', sold: 23, revenue: 161000 },
  { id: 4, name: 'Air Mineral', category: 'MINUMAN', sold: 34, revenue: 136000 },
  { id: 5, name: 'Es Teh Manis', category: 'MINUMAN', sold: 42, revenue: 126000 },
  { id: 6, name: 'Es Jeruk', category: 'MINUMAN', sold: 28, revenue: 112000 },
  { id: 7, name: 'Pisang Goreng Coklat', category: 'SNACK', sold: 25, revenue: 125000 },
  { id: 8, name: 'Tahu Crispy', category: 'SNACK', sold: 20, revenue: 80000 },
  { id: 9, name: 'Risol Mayo', category: 'SNACK', sold: 16, revenue: 64000 },
  { id: 10, name: 'Susu Kotak', category: 'MINUMAN', sold: 12, revenue: 42000 }
];

let activeCategories = ['MAKANAN', 'MINUMAN', 'SNACK'];
let sortDirection = 1;

const formatRupiah = (num) => 'Rp' + num.toLocaleString('id-ID');

// --- NAVIGASI SIDEBAR ---
const menuItems = document.querySelectorAll('.menu-item');
const pages = document.querySelectorAll('.page-section');

menuItems.forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();

    // Hapus class active dari semua menu dan halaman
    menuItems.forEach((m) => m.classList.remove('active'));
    pages.forEach((p) => p.classList.remove('active'));

    // Aktifkan menu dan halaman yang diklik
    item.classList.add('active');
    const targetPage = item.getAttribute('data-page');
    document.getElementById(`page-${targetPage}`).classList.add('active');
  });
});

// --- RENDER DASHBOARD & KELOLA PRODUK ---
function renderDashboard() {
  const keyword = document.getElementById('search-product').value.toLowerCase();

  const filtered = products.filter(
    (p) =>
      activeCategories.includes(p.category) &&
      p.name.toLowerCase().includes(keyword)
  );

  // Update KPI
  const totalRevenue = filtered.reduce((sum, item) => sum + item.revenue, 0);
  const totalSold = filtered.reduce((sum, item) => sum + item.sold, 0);

  document.getElementById('kpi-omzet').textContent = formatRupiah(totalRevenue);
  document.getElementById('kpi-avg').textContent = `Rata-rata ${formatRupiah(
    Math.round(totalRevenue / 7)
  )} per hari`;
  document.getElementById('kpi-items').textContent = totalSold;
  document.getElementById('kpi-prod-count').textContent = `Dari ${filtered.length} produk yang laku`;
  document.getElementById('table-count').textContent = `${filtered.length} produk`;

  // Render Tabel di Dashboard
  const tbody = document.getElementById('product-tbody');
  tbody.innerHTML = filtered
    .map(
      (item) => `
    <tr>
      <td><strong>${item.name}</strong></td>
      <td><span class="cat-pill cat-${item.category}">${item.category}</span></td>
      <td>${item.sold}</td>
      <td>${formatRupiah(item.revenue)}</td>
      <td><button class="delete-btn" onclick="deleteProduct(${item.id})">🗑️</button></td>
    </tr>
  `
    )
    .join('');

  // Render Tabel di Halaman Kelola Produk
  const manageTbody = document.getElementById('manage-product-tbody');
  manageTbody.innerHTML = products
    .map(
      (item) => `
    <tr>
      <td><strong>${item.name}</strong></td>
      <td><span class="cat-pill cat-${item.category}">${item.category}</span></td>
      <td>${item.sold}</td>
      <td>${formatRupiah(item.revenue)}</td>
      <td><button class="delete-btn" onclick="deleteProduct(${item.id})">🗑️ Hapus</button></td>
    </tr>
  `
    )
    .join('');
}

// Tambah Produk Baru
document.getElementById('add-product-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('new-name').value;
  const category = document.getElementById('new-category').value;
  const sold = Number(document.getElementById('new-sold').value);
  const revenue = Number(document.getElementById('new-revenue').value);

  products.push({
    id: Date.now(),
    name,
    category,
    sold,
    revenue
  });

  e.target.reset();
  renderDashboard();
});

// Simpan Pengaturan
document.getElementById('settings-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const newName = document.getElementById('setting-name').value;
  const newSub = document.getElementById('setting-sub').value;

  document.querySelector('.brand h2').textContent = newName;
  document.querySelector('.brand p').textContent = newSub;

  const msg = document.getElementById('settings-msg');
  msg.style.display = 'block';
  setTimeout(() => (msg.style.display = 'none'), 2500);
});

// Filter Kategori
function toggleCategory(cat) {
  const tagEl = document.querySelector(`.tag[data-cat="${cat}"]`);
  if (activeCategories.includes(cat)) {
    activeCategories = activeCategories.filter((c) => c !== cat);
    tagEl.classList.add('inactive');
  } else {
    activeCategories.push(cat);
    tagEl.classList.remove('inactive');
  }
  renderDashboard();
}

// Hapus Produk
function deleteProduct(id) {
  products = products.filter((p) => p.id !== id);
  renderDashboard();
}

// Sortir Tabel
function sortTable(key) {
  sortDirection *= -1;
  products.sort((a, b) => (a[key] - b[key]) * sortDirection);
  renderDashboard();
}

document.getElementById('search-product').addEventListener('input', renderDashboard);
document.getElementById('toggle-dark').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// --- GRAFIK CHART.JS ---
new Chart(document.getElementById('barChart'), {
  type: 'bar',
  data: {
    labels: ['Sab, 17', 'Min, 18', 'Sen, 19', 'Sel, 20', 'Rab, 21', 'Kam, 22', 'Jum, 23'],
    datasets: [
      {
        data: [220000, 165000, 198000, 220000, 195000, 154000, 258000],
        backgroundColor: '#2563eb',
        borderRadius: 6,
        barThickness: 28
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        max: 300000,
        ticks: {
          stepSize: 50000,
          callback: (val) => val / 1000 + 'rb'
        }
      },
      x: { grid: { display: false } }
    }
  }
});

new Chart(document.getElementById('donutChart'), {
  type: 'doughnut',
  data: {
    labels: ['Makanan', 'Minuman', 'Snack'],
    datasets: [
      {
        data: [84, 116, 61],
        backgroundColor: ['#2563eb', '#7cb518', '#a855f7'],
        borderWidth: 2
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: { legend: { display: false } }
  }
});

renderDashboard();