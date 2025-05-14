// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore, collection, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const firebaseConfig = {
  // Your Firebase config will be here
  apiKey: "AIzaSyDxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",
  authDomain: "hor-chanpheng.firebaseapp.com",
  projectId: "hor-chanpheng",
  storageBucket: "hor-chanpheng.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

// Function to initialize products in Firestore
export async function initializeProducts() {
  try {
    const productsCollection = collection(db, 'products');
    
    // Add each product to Firestore
    for (const product of products) {
      const docRef = doc(productsCollection);
      await setDoc(docRef, product);
      console.log(`Added product: ${product.name}`);
    }
    
    console.log('All products added successfully!');
  } catch (error) {
    console.error("Error adding products:", error);
    throw error;
  }
} 