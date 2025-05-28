// firebase.js

const firebaseConfig = {
  apiKey: 'AIzaSyBEhNtFQVPRn6qYs-vuCgVv0SuMQlWalOQ',
  authDomain: 'kasir-app-154ae.firebaseapp.com',
  projectId: 'kasir-app-154ae',
  storageBucket: 'kasir-app-154ae.appspot.com',
  messagingSenderId: '816488147415',
  appId: '1:816488147415:web:f3e565ebbada63a211c392',
  measurementId: 'G-FEP983FGMJ',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Export db to be used in other files
export { db };
