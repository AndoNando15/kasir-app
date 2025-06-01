import { db } from '../firebase.js';

window.onload = () => {
  const riwayatTbody = document.getElementById('riwayat-tbody');
  const modal = document.getElementById('detailModal');
  const modalContent = document.getElementById('modalDetails');

  // Format angka menjadi Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(number);
  };

  // Format timestamp menjadi tanggal lokal
  const formatDate = (timestamp) => {
    return timestamp && timestamp.seconds ? new Date(timestamp.seconds * 1000).toLocaleString('id-ID') : 'Tanggal tidak tersedia';
  };

  // Ambil semua data transaksi
  db.collection('transaksi')
    .get()
    .then((querySnapshot) => {
      let rowNumber = 1;

      querySnapshot.forEach((doc) => {
        const transaksiData = doc.data();

        if (transaksiData.transaksi && Array.isArray(transaksiData.transaksi) && transaksiData.transaksi.length > 0) {
          const total = transaksiData.total;
          const waktu = transaksiData.waktu;
          const formattedDate = formatDate(waktu);

          const productSummary = transaksiData.transaksi
            .map((produk) => {
              const { nama, harga, jumlah } = produk;
              return `${nama} (${formatRupiah(harga)} x ${jumlah})`;
            })
            .join(', ');

          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td style="text-align: center;">${rowNumber}</td>
            <td>${productSummary}</td>
            <td style="text-align: center;">${formatRupiah(total)}</td>
            <td style="text-align: center;">
              <button class="detail-btn" onclick="showDetail('${doc.id}')">Detail</button>
            </td>
          `;

          riwayatTbody.appendChild(tr);
          rowNumber++;
        } else {
          console.warn('Transaksi tidak valid pada dokumen:', doc.id);
        }
      });
    })
    .catch((error) => {
      console.error('Gagal mengambil dokumen transaksi:', error);
    });

  // Fungsi menampilkan detail transaksi di modal
  window.showDetail = (docId) => {
    db.collection('transaksi')
      .doc(docId)
      .get()
      .then((doc) => {
        const transaksiData = doc.data();

        if (!transaksiData || !transaksiData.transaksi || transaksiData.transaksi.length === 0) {
          modalContent.innerHTML = '<p>Data transaksi tidak tersedia.</p>';
          modal.style.display = 'block';
          return;
        }

        const total = transaksiData.total;
        const waktu = transaksiData.waktu;
        const formattedDate = formatDate(waktu);

        const productDetails = transaksiData.transaksi
          .map((produk, index) => {
            const { nama, harga, jumlah } = produk;
            return `
              <tr>
                <td style="text-align: left;">${nama}</td>
                <td style="text-align: center;">${formatRupiah(harga)}</td>
                <td style="text-align: center;">${jumlah}</td>
                <td style="text-align: center;">${formatRupiah(harga * jumlah)}</td>
              </tr>
            `;
          })
          .join('');

        modalContent.innerHTML = `
          <h2>Detail Transaksi</h2>
          <p><strong>Tanggal:</strong> ${formattedDate}</p>
          <table class="nota-table">
            <thead>
              <tr>
                <th>Produk</th>
                <th>Harga</th>
                <th>Jumlah</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>${productDetails}</tbody>
          </table>
          <p><strong>Total:</strong> ${formatRupiah(total)}</p>
          <button onclick="closeModal()">Tutup</button>
        `;

        modal.style.display = 'block';
      })
      .catch((error) => {
        console.error('Gagal mengambil detail transaksi:', error);
      });
  };

  // Tutup modal
  window.closeModal = () => {
    modal.style.display = 'none';
  };
};
