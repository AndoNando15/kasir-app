let semuaProduk = [];
let transaksi = [];

async function loadProduk() {
  const snapshot = await db.collection('produk').get();
  semuaProduk = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

function filterProduk() {
  const search = document.getElementById('search').value.toLowerCase();
  const list = document.getElementById('produk-list');
  list.innerHTML = '';

  if (!search) return;

  semuaProduk
    .filter((p) => p.nama.toLowerCase().includes(search))
    .forEach((p) => {
      const div = document.createElement('div');
      div.innerHTML = `
      ${p.nama} - Rp ${p.harga}
      <input type="number" min="1" placeholder="Jumlah" id="jml-${p.id}" />
      <button onclick="tambahKeNota('${p.id}')">Tambah</button>
      <hr/>
    `;
      list.appendChild(div);
    });
}

function tambahKeNota(id) {
  const produk = semuaProduk.find((p) => p.id === id);
  const jumlah = parseInt(document.getElementById(`jml-${id}`).value);
  if (!jumlah) return alert('Jumlah tidak valid');

  transaksi.push({
    nama: produk.nama,
    harga: produk.harga,
    jumlah,
    total: produk.harga * jumlah,
  });

  renderTotal();
}

function renderTotal() {
  const total = transaksi.reduce((acc, t) => acc + t.total, 0);
  document.getElementById('totalNota').textContent = `Total: Rp ${total.toLocaleString()}`;
}

function tampilkanNota() {
  const modal = document.getElementById('notaModal');
  const isi = document.getElementById('notaIsi');
  modal.style.display = 'block';
  isi.innerHTML = '';

  transaksi.forEach((t) => {
    const p = document.createElement('p');
    p.textContent = `${t.nama} - ${t.jumlah} x Rp ${t.harga} = Rp ${t.total}`;
    isi.appendChild(p);
  });

  const total = transaksi.reduce((acc, t) => acc + t.total, 0);
  const totalP = document.createElement('p');
  totalP.style.fontWeight = 'bold';
  totalP.textContent = `Total: Rp ${total.toLocaleString()}`;
  isi.appendChild(totalP);
}

function tutupModal() {
  document.getElementById('notaModal').style.display = 'none';
}

async function simpanTransaksi() {
  await db.collection('transaksi').add({
    transaksi,
    waktu: new Date(),
    total: transaksi.reduce((acc, t) => acc + t.total, 0),
  });

  alert('Transaksi disimpan!');
  window.print();
}

loadProduk();
