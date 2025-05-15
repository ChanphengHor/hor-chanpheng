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
    
    // Generate menu tabs from unique categories
    renderMenuTabs();
  } catch (error) {
    console.error("Error fetching products:", error);
    $('#productGrid').html('<p style="color:#888;text-align:center;margin-top:30px;">Error loading products. Please try again later.</p>');
  }
}

function renderProducts(list) {
  $('#productGrid').html(list.map(product => `
    <div class="product-card" data-id="${product.id}">
      <img src="${product.img || ''}" alt="${product.name}" onerror="this.style.display='block'; this.src='data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='">
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
  const category = $(this).data('category');
  if (category === 'All') {
    renderProducts(products);
  } else {
    const filtered = products.filter(product => product.category === category);
    renderProducts(filtered);
  }
});

// Sidebar icon click
$(document).on('click', '.sidebar .icon', function() {
  $('.sidebar .icon').removeClass('active');
  $(this).addClass('active');
  const title = $(this).attr('title');
  
  if (title === 'Products') {
    $('.main-content').hide();
    $('#productCrudPanel').show();
    renderProductsAdmin();
  } else {
    $('.main-content').show();
    $('#productCrudPanel').hide();
    
    // If Home is clicked, reset menu-tabs and fetch all products
    if (title === 'Home') {
      // Set "All" tab as active
      $('.menu-tabs .tab').removeClass('active');
      $('.menu-tabs .tab').each(function() {
        if ($(this).text() === 'All') {
          $(this).addClass('active');
        }
      });
      fetchProducts();
    }
  }
});

// Function to render product admin panel
function renderProductsAdmin() {
  let html = `
    <div class="product-admin">
      <div class="admin-header">
        <h2>Product Management</h2>
        <button id="addProductBtn" class="admin-btn">+ Add Product</button>
      </div>
      <div class="product-list-container">
        <table class="product-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="productTableBody">
            <tr><td colspan="5" class="loading-text">Loading products...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <div id="productFormModal" class="modal">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h3 id="formTitle">Add Product</h3>
        <form id="productForm">
          <input type="hidden" id="productId">
          <div class="form-group">
            <label for="productName">Product Name</label>
            <input type="text" id="productName" required>
          </div>
          <div class="form-group">
            <label for="productPrice">Price</label>
            <input type="number" id="productPrice" step="0.01" min="0" required>
          </div>
          <div class="form-group">
            <label for="productCategory">Category</label>
            <select id="productCategory" required>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Supper">Supper</option>
              <option value="Deserts">Deserts</option>
              <option value="Beverages">Beverages</option>
            </select>
          </div>
          <div class="form-group">
            <label for="productImage">Image URL</label>
            <input type="text" id="productImage" placeholder="https://example.com/image.jpg">
          </div>
          <div class="form-actions">
            <button type="button" class="cancel-btn">Cancel</button>
            <button type="submit" class="submit-btn">Save Product</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  $('#productCrudPanel').html(html);
  
  // Load products from Firestore
  loadProductsTable();
  
  // Set up event listeners
  $('#addProductBtn').on('click', showAddProductForm);
  $(document).on('click', '.edit-product', handleEditProduct);
  $(document).on('click', '.delete-product', handleDeleteProduct);
  $(document).on('click', '.close-modal, .cancel-btn', closeProductModal);
  $('#productForm').on('submit', handleProductSubmit);
}

// Load products into table
function loadProductsTable() {
  db.collection('products').get().then(snapshot => {
    if (snapshot.empty) {
      $('#productTableBody').html('<tr><td colspan="5" class="empty-text">No products found</td></tr>');
      return;
    }
    
    let html = '';
    snapshot.forEach(doc => {
      const product = doc.data();
      const id = doc.id;
      html += `
        <tr data-id="${id}">
          <td><img src="${product.img || ''}" alt="${product.name}" class="product-thumb" onerror="this.style.display='block'; this.src='data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='"></td>
          <td>${product.name}</td>
          <td>$${product.price.toFixed(2)}</td>
          <td>${product.category || 'N/A'}</td>
          <td class="action-cell">
            <button class="edit-product" data-id="${id}">Edit</button>
            <button class="delete-product" data-id="${id}">Delete</button>
          </td>
        </tr>
      `;
    });
    
    $('#productTableBody').html(html);
  }).catch(error => {
    console.error("Error getting products: ", error);
    $('#productTableBody').html('<tr><td colspan="5" class="error-text">Error loading products</td></tr>');
  });
}

// Show add product form
function showAddProductForm() {
  $('#formTitle').text('Add Product');
  $('#productId').val('');
  $('#productForm')[0].reset();
  $('#productFormModal').show();
}

// Handle edit product
function handleEditProduct() {
  const id = $(this).data('id');
  $('#formTitle').text('Edit Product');
  
  db.collection('products').doc(id).get().then(doc => {
    if (doc.exists) {
      const product = doc.data();
      $('#productId').val(id);
      $('#productName').val(product.name);
      $('#productPrice').val(product.price);
      $('#productCategory').val(product.category || 'Starters');
      $('#productImage').val(product.img || '');
      $('#productFormModal').show();
    } else {
      alert('Product not found!');
    }
  }).catch(error => {
    console.error("Error getting product: ", error);
    alert('Error loading product');
  });
}

// Handle delete product
function handleDeleteProduct() {
  if (confirm('Are you sure you want to delete this product?')) {
    const id = $(this).data('id');
    
    db.collection('products').doc(id).delete()
      .then(() => {
        loadProductsTable();
      })
      .catch(error => {
        console.error("Error deleting product: ", error);
        alert('Error deleting product');
      });
  }
}

// Close product modal
function closeProductModal() {
  $('#productFormModal').hide();
}

// Handle product form submission
function handleProductSubmit(e) {
  e.preventDefault();
  
  const productData = {
    name: $('#productName').val().trim(),
    price: parseFloat($('#productPrice').val()),
    category: $('#productCategory').val(),
    img: $('#productImage').val().trim() || ''
  };
  
  const id = $('#productId').val();
  
  if (id) {
    // Update existing product
    db.collection('products').doc(id).update(productData)
      .then(() => {
        closeProductModal();
        loadProductsTable();
        // Refresh the main product display if we're on the home tab
        if (!$('.sidebar .icon[title="Products"]').hasClass('active')) {
          fetchProducts();
        }
      })
      .catch(error => {
        console.error("Error updating product: ", error);
        alert('Error updating product');
      });
  } else {
    // Add new product
    db.collection('products').add(productData)
      .then(() => {
        closeProductModal();
        loadProductsTable();
        // Refresh the main product display if we're on the home tab
        if (!$('.sidebar .icon[title="Products"]').hasClass('active')) {
          fetchProducts();
        }
      })
      .catch(error => {
        console.error("Error adding product: ", error);
        alert('Error adding product');
      });
  }
}

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

// Login modal logic 동구
$(function() {
  // If user is already logged in, skip login modal
  if (localStorage.getItem('posUser')) {
    $('#loginModal').hide();
    $('.pos-container').show().removeClass('blur');
    $('body').removeClass('login-bg');
  } else {
    $('.pos-container').show().addClass('blur');
    $('#loginModal').show();
  }

  $('#loginBtn').on('click', function() {
    const user = $('#loginUser').val();
    const pass = $('#loginPass').val();
    if (user === 'admin' && pass === 'Qwer1234!') {
      localStorage.setItem('posUser', user);
      $('#loginModal').fadeOut(200, function() {
        $('.pos-container').removeClass('blur').fadeIn(200);
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
    $('.pos-container').addClass('blur');
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

// Add this new function to render menu tabs
function renderMenuTabs() {
  // Start with "All" tab
  let tabsHtml = '<div class="tab active" data-category="All">All</div>';
  
  // Get unique categories from products
  const categories = [...new Set(products.map(product => product.category))].filter(Boolean);
  
  // Add a tab for each category
  categories.forEach(category => {
    tabsHtml += `<div class="tab" data-category="${category}">${category}</div>`;
  });
  
  // Update the menu tabs
  $('.menu-tabs').html(tabsHtml);
}

$(document).ready(function() {
  // Initialize - fetch products on page load
  fetchProducts();
  renderOrder();
  
  // Set Home icon as active by default
  $('.sidebar .icon[title="Home"]').addClass('active');
  
  // Handle login status
  if (localStorage.getItem('posUser')) {
    $('#loginModal').hide();
    $('.pos-container').show().removeClass('blur');
    $('body').removeClass('login-bg');
  } else {
    $('.pos-container').show().addClass('blur');
    $('#loginModal').show();
  }
  
  // Login button event
  $('#loginBtn').on('click', function() {
    const user = $('#loginUser').val();
    const pass = $('#loginPass').val();
    if (user === 'admin' && pass === 'Qwer1234!') {
      localStorage.setItem('posUser', user);
      $('#loginModal').fadeOut(200, function() {
        $('.pos-container').removeClass('blur').fadeIn(200);
        $('body').removeClass('login-bg');
      });
    } else {
      $('#loginError').text('Invalid username or password.');
    }
  });
}); 