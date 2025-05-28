import { db } from './firebase.js';

window.onload = () => {
  const riwayatTbody = document.getElementById('riwayat-tbody'); // Corrected reference to tbody

  // Fetch transactions from Firestore
  db.collection('transaksi')
    .get()
    .then((querySnapshot) => {
      let rowNumber = 1; // Initialize row number for each document

      querySnapshot.forEach((doc) => {
        const transaksiData = doc.data();

        // Log the document data to see if it's correct
        console.log('Transaction Data: ', transaksiData);

        // Check if 'transaksi' exists and is an array with at least one item
        if (transaksiData.transaksi && Array.isArray(transaksiData.transaksi) && transaksiData.transaksi.length > 0) {
          // Extract the first element of the 'transaksi' array (assuming only one item per transaction)
          const transaksi = transaksiData.transaksi[0];

          // Destructure the necessary fields, with additional checks for each property
          const { harga, jumlah, nama } = transaksi;
          const total = transaksiData.total;
          const waktu = transaksiData.waktu;

          // Check if 'waktu' is a valid timestamp before accessing its 'seconds' property
          let formattedDate = 'Tanggal tidak tersedia';
          if (waktu && waktu.seconds) {
            formattedDate = new Date(waktu.seconds * 1000).toLocaleString();
          }

          // Check if the necessary data exists and is valid before proceeding
          if (harga && jumlah && nama && total !== undefined) {
            // Create a table row for each transaction
            const tr = document.createElement('tr');

            tr.innerHTML = `
              <td style="text-align: center">${rowNumber}</td>
              <td>${nama}</td>
              <td style="text-align: center">Rp ${harga}</td>
              <td style="text-align: center">${jumlah}</td>
              <td style="text-align: center">Rp ${total}</td>
              <td style="text-align: center">${formattedDate}</td>
            `;

            // Append the transaction row to the table body
            riwayatTbody.appendChild(tr);

            rowNumber++; // Increment the row number for the next iteration
          } else {
            console.error('Missing or invalid data in transaction for document:', doc.id);
          }
        } else {
          console.error('No valid transaction data for document:', doc.id);
        }
      });
    })
    .catch((error) => {
      console.error('Error getting documents: ', error);
    });
};
