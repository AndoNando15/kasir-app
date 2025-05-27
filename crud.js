let editId = null;

function showPopup(message) {
  const popup = document.getElementById('notifPopup');
  popup.textContent = message;
  popup.style.display = 'block';
  setTimeout(() => {
    popup.style.display = 'none';
  }, 2000);
}

async function tambahProduk() {
  const nama = document.getElementById('nama').value;
  const harga = parseInt(document.getElementById('harga').value);
  const btn = document.querySelector('#aksi-btn');

  if (!nama || isNaN(harga)) {
    showPopup('⚠️ Isi semua field');
    return;
  }

  if (editId) {
    // MODE EDIT
    await db.collection('produk').doc(editId).update({ nama, harga });
    showPopup('✅ Produk diperbarui');
    editId = null;
    btn.textContent = 'Tambah Produk';
  } else {
    // MODE TAMBAH
    await db.collection('produk').add({ nama, harga });
    showPopup('✅ Produk ditambahkan');
  }

  document.getElementById('nama').value = '';
  document.getElementById('harga').value = '';
  btn.setAttribute('onclick', 'tambahProduk()');
  tampilkanProduk();
}

function mulaiEdit(id, nama, harga) {
  document.getElementById('nama').value = nama;
  document.getElementById('harga').value = harga;

  const btn = document.querySelector('#aksi-btn');
  btn.textContent = 'Simpan Perubahan';
  btn.setAttribute('onclick', 'tambahProduk()');
  editId = id;
}

function mulaiEdit(id, nama, harga) {
  document.getElementById('nama').value = nama;
  document.getElementById('harga').value = harga;
  const btn = document.querySelector('#aksi-btn');
  btn.textContent = 'Simpan Perubahan';
  btn.setAttribute('onclick', 'tambahProduk()');
  editId = id;
}

async function hapusProduk(id) {
  await db.collection('produk').doc(id).delete();
  showPopup('🗑️ Produk dihapus');
  tampilkanProduk();
}

async function tampilkanProduk() {
  const tbody = document.getElementById('produk-tbody');
  tbody.innerHTML = '';

  try {
    const snapshot = await db.collection('produk').get();
    snapshot.forEach((doc) => {
      const data = doc.data();
      const namaSafe = data.nama.replace(/'/g, "\\'").replace(/"/g, '&quot;');

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${data.nama}</td>
        <td>Rp ${data.harga}</td>
        <td>
          <button class="edit-btn" onclick="mulaiEdit('${doc.id}', '${namaSafe}', ${data.harga})">Edit</button>
          <button class="delete-btn" onclick="hapusProduk('${doc.id}')">Hapus</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('❌ Error:', err);
    showPopup('❌ Gagal memuat data');
  }
}

tampilkanProduk();
