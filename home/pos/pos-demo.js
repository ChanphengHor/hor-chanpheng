// Initialize Firebase (v8 SDK style)
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

let products = [];
let order = [];

// Fetch products from Firestore
async function fetchProducts() {
  try {
    const snapshot = await db.collection('products').get();
    products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    $('#productGrid').html('<p style="color:#888;text-align:center;margin-top:30px;">Error loading products. Please try again later.</p>');
  }
}

function renderProducts(list) {
  $('#productGrid').html(list.map(product => `
    <div class="product-card" data-id="${product.id}">
      <img src="${product.img}" alt="${product.name}">
      <div class="name">${product.name}</div>
      <div class="price">$${product.price.toFixed(2)}</div>
    </div>
  `).join(''));
}

function renderOrder() {
  if (order.length === 0) {
    $('#orderList').html('<p style="color:#888;text-align:center;margin-top:30px;">No items in order.</p>');
    $('#orderSummary').html('');
    return;
  }
  $('#orderList').html(order.map((item, idx) => `
    <div class="order-item" data-id="${item.id}">
      <div class="item-info">
        <div class="item-name">${item.name}</div>
        <div class="item-price">$${item.price.toFixed(2)}</div>
        <div class="item-qty">
          <button class="qty-btn" data-action="dec">-</button>
          <input type="number" min="1" value="${item.qty}" readonly>
          <button class="qty-btn" data-action="inc">+</button>
        </div>
      </div>
      <button class="remove-btn" title="Remove">×</button>
    </div>
  `).join(''));
  // Order summary
  const subtotal = order.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.225;
  const total = subtotal + tax;
  $('#orderSummary').html(`
    <div class="row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
    <div class="row"><span>Tax</span><span>$${tax.toFixed(2)}</span></div>
    <div class="row total"><span>Payable Amount</span><span>$${total.toFixed(2)}</span></div>
  `);
}

// Product click
$(document).on('click', '.product-card', function() {
  const id = $(this).data('id');
  const product = products.find(p => p.id === id);
  const existing = order.find(item => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    order.push({ ...product, qty: 1 });
  }
  renderOrder();
});

// Quantity buttons
$(document).on('click', '.qty-btn', function() {
  const action = $(this).data('action');
  const id = $(this).closest('.order-item').data('id');
  const item = order.find(i => i.id === id);
  if (action === 'inc') item.qty++;
  if (action === 'dec' && item.qty > 1) item.qty--;
  renderOrder();
});

// Remove item
$(document).on('click', '.remove-btn', function() {
  const id = $(this).closest('.order-item').data('id');
  order = order.filter(i => i.id !== id);
  renderOrder();
});

// Menu tab click
$(document).on('click', '.menu-tabs .tab', function() {
  $('.menu-tabs .tab').removeClass('active');
  $(this).addClass('active');
  // For demo, just highlight tab
});

// Sidebar icon click
$(document).on('click', '.sidebar .icon', function() {
  $('.sidebar .icon').removeClass('active');
  $(this).addClass('active');
});

// Search
$('#searchInput').on('input', function() {
  const val = $(this).val().toLowerCase();
  renderProducts(products.filter(p => p.name.toLowerCase().includes(val)));
});

// Hold/Proceed buttons
$('.order-actions .hold').on('click', function() {
  alert('Order is on hold!');
});
$('.order-actions .proceed').on('click', function() {
  alert('Proceed to payment!');
});

// Login modal logic
$(function() {
  // If user is already logged in, skip login modal
  if (localStorage.getItem('posUser')) {
    $('#loginModal').hide();
    $('.pos-container').show();
    $('body').removeClass('login-bg');
  } else {
    $('.pos-container').hide();
    $('#loginModal').show();
  }

  $('#loginBtn').on('click', function() {
    const user = $('#loginUser').val();
    const pass = $('#loginPass').val();
    if (user === 'admin' && pass === 'Qwer1234!') {
      localStorage.setItem('posUser', user);
      $('#loginModal').fadeOut(200, function() {
        $('.pos-container').fadeIn(200);
        $('body').removeClass('login-bg');
      });
    } else {
      $('#loginError').text('Invalid username or password.');
    }
  });
  $('#loginPass').on('keypress', function(e) {
    if (e.which === 13) $('#loginBtn').click();
  });

  // Logout handler
  $('.sidebar .icon[title="Logout"]').on('click', function() {
    localStorage.removeItem('posUser');
    $('.pos-container').hide();
    $('#loginModal').fadeIn(200);
    $('body').addClass('login-bg');
    $('#loginUser').val('');
    $('#loginPass').val('');
    $('#loginError').text('');
  });
});

// Initial load
fetchProducts();
renderOrder(); 