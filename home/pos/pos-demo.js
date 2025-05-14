// Sample product data
const products = [
  { id: 1, name: 'Schezwan Egg Noodles', price: 24, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=400&h=400&q=80' },
  { id: 2, name: 'Stir Egg Fry Udon Noodles', price: 24, img: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=facearea&w=400&h=400&q=80' },
  { id: 3, name: 'Thai Style Fried Noodles', price: 24, img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=400&h=400&q=80' },
  { id: 4, name: 'Chinese Prawn Spaghetti', price: 24, img: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=facearea&w=400&h=400&q=80' },
  { id: 5, name: 'Japanese Soba Noodles', price: 24, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=400&h=400&q=80' },
  { id: 6, name: 'Chinese Prawn Spaghetti', price: 24, img: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=facearea&w=400&h=400&q=80' },
  { id: 7, name: 'Chilli Garlic Thai Noodles', price: 24, img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=400&h=400&q=80' },
  { id: 8, name: 'Schezwan Egg Noodles', price: 24, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=400&h=400&q=80' },
  { id: 9, name: 'Thai Style Fried Noodles', price: 24, img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=400&h=400&q=80' },
  { id: 10, name: 'Schezwan Egg Noodles', price: 24, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=400&h=400&q=80' },
  { id: 11, name: 'Stir Egg Fry Udon Noodles', price: 24, img: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=facearea&w=400&h=400&q=80' },
  { id: 12, name: 'Chilli Garlic Thai Noodles', price: 24, img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=400&h=400&q=80' }
];

let order = [];

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
  const id = Number($(this).data('id'));
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
  const id = Number($(this).closest('.order-item').data('id'));
  const item = order.find(i => i.id === id);
  if (action === 'inc') item.qty++;
  if (action === 'dec' && item.qty > 1) item.qty--;
  renderOrder();
});

// Remove item
$(document).on('click', '.remove-btn', function() {
  const id = Number($(this).closest('.order-item').data('id'));
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

// Initial render
renderProducts(products);
renderOrder(); 