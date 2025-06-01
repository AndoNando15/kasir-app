import { db } from './firebase.js';

let editId = null;

function showPopup(message) {
  const popup = document.getElementById('notifPopup');
  popup.textContent = message;
  popup.style.display = 'block';
  setTimeout(() => {
    popup.style.display = 'none';
  }, 2000);
}

// Add or update product
async function tambahProduk() {
  const nama = document.getElementById('nama').value;
  const harga = parseInt(document.getElementById('harga').value);
  const btn = document.querySelector('#aksi-btn');

  if (!nama || isNaN(harga)) {
    showPopup('⚠️ Isi semua field');
    return;
  }

  if (editId) {
    // MODE EDIT: Update existing product
    await db.collection('produk').doc(editId).update({ nama, harga });
    showPopup('✅ Produk diperbarui');
    editId = null;
    btn.textContent = 'Tambah Produk'; // Reset button text to 'Tambah Produk'
  } else {
    // MODE TAMBAH: Add new product
    await db.collection('produk').add({ nama, harga });
    showPopup('✅ Produk ditambahkan');
  }

  document.getElementById('nama').value = ''; // Clear input fields
  document.getElementById('harga').value = '';
  btn.setAttribute('onclick', 'tambahProduk()'); // Reset button's onclick attribute to call `tambahProduk`
  tampilkanProduk(); // Refresh the product list
}

// Prepare for editing a product
function mulaiEdit(id, nama, harga) {
  document.getElementById('nama').value = nama;
  document.getElementById('harga').value = harga;

  const btn = document.querySelector('#aksi-btn');
  btn.textContent = 'Simpan Perubahan'; // Change button text to 'Simpan Perubahan'
  btn.setAttribute('onclick', 'tambahProduk()'); // Keep the same function for saving the product
  editId = id; // Store the product id for editing
}

// Delete a product
async function hapusProduk(id) {
  await db.collection('produk').doc(id).delete(); // Delete product from Firestore
  showPopup('🗑️ Produk dihapus'); // Show a popup to indicate product was deleted
  tampilkanProduk(); // Refresh the product list
}

// Display all products in the table
async function tampilkanProduk() {
  const tbody = document.getElementById('produk-tbody');
  tbody.innerHTML = ''; // Clear the existing table content

  try {
    const snapshot = await db.collection('produk').get(); // Get all products from Firestore
    let no = 1;

    snapshot.forEach((doc) => {
      const data = doc.data(); // Get product data
      const namaSafe = data.nama.replace(/'/g, "\\'").replace(/"/g, '&quot;'); // Escape special characters in product name

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="text-align: center">${no++}</td> <!-- Auto increment the row number -->
        <td>${data.nama}</td> <!-- Display product name -->
        <td style="text-align: center">Rp ${data.harga}</td> <!-- Display product price -->
        <td style="text-align: center">
          <button class="edit-btn" onclick="mulaiEdit('${doc.id}', '${namaSafe}', ${data.harga})">Edit</button>
          <button class="delete-btn" onclick="hapusProduk('${doc.id}')">Hapus</button>
        </td>
      `;
      tbody.appendChild(tr); // Append the new row to the table body
    });
  } catch (err) {
    console.error('❌ Error:', err);
    showPopup('❌ Gagal memuat data'); // Show error popup if fetching fails
  }
}

tampilkanProduk(); // Load products when the page is loaded

// Expose all required functions to the global scope
window.tambahProduk = tambahProduk;
window.mulaiEdit = mulaiEdit;
window.hapusProduk = hapusProduk;
window.tampilkanProduk = tampilkanProduk;
