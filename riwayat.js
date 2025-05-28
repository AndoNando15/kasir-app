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

        // Extract the 'transaksi' array, 'total', and 'waktu'
        const transaksi = transaksiData.transaksi[0]; // Assuming transaksi is an array
        const { harga, jumlah, nama } = transaksi;
        const total = transaksiData.total;
        const waktu = transaksiData.waktu;

        // Format the timestamp to a readable date
        const formattedDate = new Date(waktu.seconds * 1000).toLocaleString();

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
      });
    })
    .catch((error) => {
      console.error('Error getting documents: ', error);
    });
};
