// This script populates Firestore with sample product data using Firebase v8 SDK
// Add Firebase App and Firestore scripts in your HTML before this script
// <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"></script>

const firebaseConfig = {
  apiKey: "AIzaSyDxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",
  authDomain: "hor-chanpheng.firebaseapp.com",
  projectId: "hor-chanpheng",
  storageBucket: "hor-chanpheng.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// Sample product data
const products = [
  { name: 'Schezwan Egg Noodles', price: 24, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=400&h=400&q=80' },
  { name: 'Stir Egg Fry Udon Noodles', price: 24, img: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=facearea&w=400&h=400&q=80' },
  { name: 'Thai Style Fried Noodles', price: 24, img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=400&h=400&q=80' },
  { name: 'Chinese Prawn Spaghetti', price: 24, img: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=facearea&w=400&h=400&q=80' },
  { name: 'Japanese Soba Noodles', price: 24, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=400&h=400&q=80' },
  { name: 'Chinese Prawn Spaghetti', price: 24, img: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=facearea&w=400&h=400&q=80' },
  { name: 'Chilli Garlic Thai Noodles', price: 24, img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=400&h=400&q=80' },
  { name: 'Schezwan Egg Noodles', price: 24, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=400&h=400&q=80' },
  { name: 'Thai Style Fried Noodles', price: 24, img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=400&h=400&q=80' },
  { name: 'Schezwan Egg Noodles', price: 24, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=400&h=400&q=80' },
  { name: 'Stir Egg Fry Udon Noodles', price: 24, img: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=facearea&w=400&h=400&q=80' },
  { name: 'Chilli Garlic Thai Noodles', price: 24, img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=400&h=400&q=80' }
];

// Function to populate Firestore with products
function setupProducts() {
  document.getElementById('status').textContent = 'Setting up products...';
  const batch = db.batch();
  const productsCollection = db.collection('products');

  products.forEach(product => {
    const docRef = productsCollection.doc();
    batch.set(docRef, product);
  });

  batch.commit()
    .then(() => {
      document.getElementById('status').textContent = 'Products successfully uploaded to Firestore!';
      document.getElementById('done').style.display = 'block';
    })
    .catch((error) => {
      document.getElementById('status').textContent = `Error setting up products: ${error}`;
    });
} 