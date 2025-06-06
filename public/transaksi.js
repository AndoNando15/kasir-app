import { db } from '../firebase.js'; // Import db from firebase.js

let semuaProduk = [];
let transaksi = [];

// Load products from Firestore
async function loadProduk() {
  const snapshot = await db.collection('produk').get();
  semuaProduk = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  filterProduk(); // After products are loaded, filter them
}

// Filter products based on the search input
function filterProduk() {
  const search = document.getElementById('search').value.toLowerCase();
  const list = document.getElementById('produk-list');
  list.innerHTML = ''; // Clear existing list

  if (!search) return; // If there's no search text, return

  semuaProduk
    .filter((p) => p.nama.toLowerCase().includes(search)) // Filter products
    .forEach((p) => {
      const div = document.createElement('div');
      div.className = 'produk-box';
      div.innerHTML = `
        <div class="produk-boxx">
          <div class="produk-info">
            <strong>${p.nama}</strong> - Rp ${p.harga.toLocaleString()}
          </div>
          <div class="produk-aksi">
            <input type="number" min="1" placeholder="Jumlah" id="jml-${p.id}" class="jumlah-input" />
            <button onclick="tambahKeNota('${p.id}')">Tambah</button>
          </div>
        </div>
      `;
      list.appendChild(div); // Add filtered products to the list
    });
}

// Add product to the transaction list
function tambahKeNota(id) {
  const produk = semuaProduk.find((p) => p.id === id); // Find selected product
  const jumlahInput = document.getElementById(`jml-${id}`);
  const jumlah = parseInt(jumlahInput.value);

  if (!jumlah || jumlah <= 0) {
    showPopup('⚠️ Jumlah tidak valid');
    return;
  }

  const existing = transaksi.find((item) => item.nama === produk.nama);
  if (existing) {
    existing.jumlah += jumlah;
    existing.total = existing.harga * existing.jumlah;
  } else {
    transaksi.push({
      nama: produk.nama,
      harga: produk.harga,
      jumlah,
      total: produk.harga * jumlah,
    });
  }

  jumlahInput.value = ''; // Clear the quantity input after adding
  showPopup('✅ Produk ditambahkan');
  renderTotal();
}

// Render total amount of the transaction
function renderTotal() {
  const total = transaksi.reduce((acc, t) => acc + t.total, 0);
  document.getElementById('totalNota').textContent = `Total: Rp ${total.toLocaleString()}`;
}

// Display the transaction receipt in a modal
function tampilkanNota() {
  const modal = document.getElementById('notaModal');
  const isi = document.getElementById('notaIsi');
  modal.style.display = 'block';
  isi.innerHTML = '';

  if (transaksi.length === 0) {
    isi.innerHTML = '<p>Belum ada produk ditambahkan.</p>';
    return;
  }

  const table = document.createElement('table');
  table.className = 'nota-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th>No</th>
        <th>Produk</th>
        <th>Harga</th>
        <th>Jumlah</th>
        <th>Total</th>
        <th class="no-print">Aksi</th>
      </tr>
    </thead>
    <tbody>
      ${transaksi
        .map(
          (t, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${t.nama}</td>
          <td>Rp ${t.harga.toLocaleString()}</td>
          <td>${t.jumlah}</td>
          <td>Rp ${t.total.toLocaleString()}</td>
          <td><button class="delete-btn" onclick="hapusDariNota(${i})">Batal</button></td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  `;
  isi.appendChild(table);

  const total = transaksi.reduce((acc, t) => acc + t.total, 0);
  const totalP = document.createElement('p');
  totalP.style.fontWeight = 'bold';
  totalP.style.marginTop = '10px';
  totalP.textContent = `Total: Rp ${total.toLocaleString()}`;
  isi.appendChild(totalP);
}

// Remove an item from the transaction list
function hapusDariNota(index) {
  transaksi.splice(index, 1);
  showPopup('❌ Item dibatalkan');
  tampilkanNota();
  renderTotal();
}

// Close the modal
function tutupModal() {
  document.getElementById('notaModal').style.display = 'none';
}

// Save the transaction to Firestore
async function simpanTransaksi() {
  if (transaksi.length === 0) {
    showPopup('⚠️ Belum ada transaksi');
    return;
  }

  await db.collection('transaksi').add({
    transaksi,
    waktu: new Date(),
    total: transaksi.reduce((acc, t) => acc + t.total, 0),
  });

  showPopup('✅ Transaksi disimpan!');

  setTimeout(() => {
    window.print(); // Print the receipt
  }, 2000);
}

// Show a notification popup
function showPopup(message) {
  const popup = document.getElementById('notifPopup');
  popup.textContent = message;
  popup.style.display = 'block';
  setTimeout(() => {
    popup.style.display = 'none';
  }, 2000);
}

// Initialize products when the page loads
loadProduk();

// Make filterProduk, tambahKeNota, tampilkanNota, hapusDariNota, simpanTransaksi, and tutupModal global
window.filterProduk = filterProduk;
window.tambahKeNota = tambahKeNota;
window.tampilkanNota = tampilkanNota;
window.hapusDariNota = hapusDariNota;
window.simpanTransaksi = simpanTransaksi;
window.tutupModal = tutupModal;
