async function filterTransaksi() {
  const list = document.getElementById('daftar-transaksi');
  list.innerHTML = '';
  const tanggalInput = document.getElementById('filterTanggal').value;

  const snapshot = await db.collection('transaksi').orderBy('waktu', 'desc').get();

  snapshot.forEach((doc) => {
    const data = doc.data();
    const waktu = data.waktu.toDate ? data.waktu.toDate() : new Date(data.waktu.seconds * 1000);
    const tanggal = waktu.toISOString().split('T')[0];

    if (!tanggalInput || tanggal === tanggalInput) {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${tanggal}</strong><br/>
        ${data.transaksi.map((t) => `${t.nama} (${t.jumlah})`).join(', ')}<br/>
        Total: Rp ${data.total.toLocaleString()}
        <hr/>
      `;
      list.appendChild(li);
    }
  });
}

filterTransaksi();
