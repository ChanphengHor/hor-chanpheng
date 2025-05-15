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

// Function to update the user indicator
function updateUserIndicator(user) {
  if (!user) {
    $('#userIndicator').html('');
    return;
  }
  
  let roleClass = '';
  switch(user.role.toLowerCase()) {
    case 'admin': roleClass = 'admin'; break;
    case 'manager': roleClass = 'manager'; break;
    case 'cashier': roleClass = 'cashier'; break;
  }
  
  $('#userIndicator').html(`
    <span class="username">${user.username}</span>
    <span class="role ${roleClass}">${user.role}</span>
  `);
}

// Function to apply role-based access control
function applyRoleBasedAccess(user) {
  // Update user indicator
  updateUserIndicator(user);

  // Hide all restricted sections first
  $('.sidebar .icon[title="Products"]').hide();
  $('.sidebar .icon[title="Reports"]').hide();
  $('.sidebar .icon[title="Settings"]').hide();
  $('.sidebar .icon[title="Customers"]').hide();
  
  // Always show these icons for all users
  $('.sidebar .icon[title="Home"]').show();
  $('.sidebar .icon[title="Logout"]').show();
  
  // Apply permissions based on role
  switch(user.role) {
    case 'Admin':
      // Admin has full access
      $('.sidebar .icon[title="Products"]').show();
      $('.sidebar .icon[title="Reports"]').show();
      $('.sidebar .icon[title="Settings"]').show();
      $('.sidebar .icon[title="Customers"]').show();
      break;
    case 'Manager':
      // Manager can see reports
      $('.sidebar .icon[title="Reports"]').show();
      break;
    case 'Cashier':
      // Cashier only has access to sales (which is default)
      break;
  }
}

// Sidebar icon click
$(document).on('click', '.sidebar .icon', function() {
  // First check if the user is logged in
  try {
    const posUserStr = localStorage.getItem('posUser');
    if (!posUserStr) {
      console.log('Security check: User not logged in but trying to access sidebar functions.');
      $('.pos-container').addClass('blur');
      $('#loginModal').fadeIn(200);
      $('body').addClass('login-bg');
      return;
    }
    
    // Verify user permissions
    const posUser = JSON.parse(posUserStr);
    const title = $(this).attr('title');
    
    // Restricted sections based on role
    if ((title === 'Products' || title === 'Customers' || title === 'Settings') && posUser.role !== 'Admin') {
      console.log('Security check: Unauthorized access attempt to ' + title);
      alert('You do not have permission to access this section.');
      return;
    }
    
    if (title === 'Reports' && posUser.role !== 'Admin' && posUser.role !== 'Manager') {
      console.log('Security check: Unauthorized access attempt to Reports');
      alert('You do not have permission to access reports.');
      return;
    }
  } catch (e) {
    console.error('Security check error:', e);
    // Show login modal if there's an error with user data
    $('.pos-container').addClass('blur');
    $('#loginModal').fadeIn(200);
    $('body').addClass('login-bg');
    return;
  }
  
  // Proceed with normal sidebar functionality if permissions check passes
  $('.sidebar .icon').removeClass('active');
  $(this).addClass('active');
  const title = $(this).attr('title');
  
  if (title === 'Products') {
    $('.main-content').hide();
    $('#productCrudPanel').show();
    $('#userManagementPanel').hide();
    renderProductsAdmin();
  } else if (title === 'Customers') {
    $('.main-content').hide();
    $('#productCrudPanel').hide();
    $('#userManagementPanel').show();
    renderUserManagement();
  } else if (title === 'Logout') {
    // Handle logout
    localStorage.removeItem('posUser');
    $('.pos-container').addClass('blur');
    $('#loginModal').fadeIn(200);
    $('body').addClass('login-bg');
    $('#loginUser').val('');
    $('#loginPass').val('');
    $('#loginError').text('');
    // Clear user indicator
    updateUserIndicator(null);
    return; // Return early to avoid other actions
  } else {
    $('.main-content').show();
    $('#productCrudPanel').hide();
    $('#userManagementPanel').hide();
    
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

// Function to check login status
function checkLoginStatus() {
  try {
    const posUser = localStorage.getItem('posUser');
    
    // If loginModal is not showing but user is not logged in
    if ($('#loginModal').css('display') === 'none' && !posUser) {
      console.log('Login check: User not logged in but login modal is hidden. Showing login modal.');
      $('.pos-container').addClass('blur');
      $('#loginModal').fadeIn(200);
      $('body').addClass('login-bg');
    }
    
    // If there is user data, validate it's proper JSON
    if (posUser) {
      try {
        const userInfo = JSON.parse(posUser);
        if (!userInfo || !userInfo.username || !userInfo.role) {
          console.log('Login check: Invalid user data. Showing login modal.');
          localStorage.removeItem('posUser');
          $('.pos-container').addClass('blur');
          $('#loginModal').fadeIn(200);
          $('body').addClass('login-bg');
        }
      } catch (e) {
        console.log('Login check: Invalid JSON in localStorage. Showing login modal.');
        localStorage.removeItem('posUser');
        $('.pos-container').addClass('blur');
        $('#loginModal').fadeIn(200);
        $('body').addClass('login-bg');
      }
    }
  } catch (e) {
    console.error('Error in login status check:', e);
  }
  
  // Set timeout for next check (5 seconds)
  setTimeout(checkLoginStatus, 5000);
}

// Call when app initializes
$(document).ready(function() {
  // Initialize - fetch products on page load
  fetchProducts();
  renderOrder();
  
  // Set Home icon as active by default
  $('.sidebar .icon[title="Home"]').addClass('active');
  
  // Check if there are users, create default if none
  checkAndCreateDefaultAdmin();
  
  // Handle login status
  if (localStorage.getItem('posUser')) {
    try {
      // Try to parse the stored value as JSON
      const userInfo = JSON.parse(localStorage.getItem('posUser'));
      
      // Make sure it's a valid user object with required properties
      if (userInfo && userInfo.username && userInfo.role) {
        $('#loginModal').hide();
        $('.pos-container').show().removeClass('blur');
        $('body').removeClass('login-bg');
        
        // Apply role-based access control
        applyRoleBasedAccess(userInfo);
      } else {
        // User info is not valid, clear it and show login
        localStorage.removeItem('posUser');
        $('.pos-container').show().addClass('blur');
        $('#loginModal').show();
      }
    } catch (e) {
      // JSON parsing failed, clear localStorage and show login
      console.error('Invalid user data in localStorage:', e);
      localStorage.removeItem('posUser');
      $('.pos-container').show().addClass('blur');
      $('#loginModal').show();
    }
  } else {
    $('.pos-container').show().addClass('blur');
    $('#loginModal').show();
  }
  
  // Start periodic login status check
  setTimeout(checkLoginStatus, 5000);
});

// Login modal logic - defined once at global scope
$(function() {
  // Login button event
  $('#loginBtn').on('click', function() {
    const username = $('#loginUser').val().trim();
    const password = $('#loginPass').val().trim();
    
    // Validation
    if (!username || !password) {
      $('#loginError').text('Please enter both username and password.');
      return;
    }
    
    // Show loading state
    $('#loginBtn').prop('disabled', true).text('Logging in...');
    $('#loginError').text('');
    
    // Check against Firestore users collection
    db.collection('users')
      .where('username', '==', username)
      .where('status', '==', 'Active')
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          $('#loginError').text('User not found or inactive.');
          $('#loginBtn').prop('disabled', false).text('Login');
          return;
        }
        
        const user = snapshot.docs[0].data();
        
        // Password validation
        if (user.password === password) {
          // Store user info in localStorage with role
          const userInfo = {
            username: user.username,
            role: user.role,
            id: snapshot.docs[0].id
          };
          
          localStorage.setItem('posUser', JSON.stringify(userInfo));
          
          $('#loginModal').fadeOut(200, function() {
            $('.pos-container').removeClass('blur').fadeIn(200);
            $('body').removeClass('login-bg');
          });
          
          // Apply role-based access restrictions
          applyRoleBasedAccess(userInfo);
        } else {
          $('#loginError').text('Invalid password.');
          $('#loginBtn').prop('disabled', false).text('Login');
        }
      })
      .catch(error => {
        console.error("Error during login:", error);
        $('#loginError').text('An error occurred during login. Please try again.');
        $('#loginBtn').prop('disabled', false).text('Login');
      });
  });
  
  $('#loginPass').on('keypress', function(e) {
    if (e.which === 13) $('#loginBtn').click();
  });
});

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

// Check if there are any users in the database, if not create a default admin
function checkAndCreateDefaultAdmin() {
  db.collection('users').get().then(snapshot => {
    if (snapshot.empty) {
      // No users found, create default admin
      const defaultAdmin = {
        username: 'admin',
        password: 'Qwer1234!',
        role: 'Admin',
        status: 'Active'
      };
      
      db.collection('users').add(defaultAdmin)
        .then(() => {
          console.log('Default admin user created');
        })
        .catch(error => {
          console.error('Error creating default admin:', error);
        });
    }
  }).catch(error => {
    console.error('Error checking users:', error);
  });
}

// Function to render user management panel
function renderUserManagement() {
  let html = `
    <div class="user-admin">
      <div class="admin-header">
        <h2>User Management</h2>
        <button id="addUserBtn" class="admin-btn">+ Add User</button>
      </div>
      <div class="user-list-container">
        <table class="user-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="userTableBody">
            <tr><td colspan="4" class="loading-text">Loading users...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <div id="userFormModal" class="modal">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h3 id="userFormTitle">Add User</h3>
        <form id="userForm">
          <input type="hidden" id="userId">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" required>
          </div>
          <div class="form-group">
            <label for="userRole">Role</label>
            <select id="userRole" required>
              <option value="Cashier">Cashier</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div class="form-group">
            <label for="userStatus">Status</label>
            <select id="userStatus" required>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" class="cancel-btn">Cancel</button>
            <button type="submit" class="submit-btn">Save User</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  // Check if panel exists, if not create it
  if ($('#userManagementPanel').length === 0) {
    $('<div id="userManagementPanel" style="display:none;"></div>').insertAfter('#productCrudPanel');
  }
  
  $('#userManagementPanel').html(html);
  
  // Load users from Firestore
  loadUsersTable();
  
  // Set up event listeners
  $('#addUserBtn').on('click', showAddUserForm);
  $(document).on('click', '.edit-user', handleEditUser);
  $(document).on('click', '.delete-user', handleDeleteUser);
  $(document).on('click', '.close-modal, .cancel-btn', closeUserModal);
  $('#userForm').on('submit', handleUserSubmit);
}

// Load users into table
function loadUsersTable() {
  db.collection('users').get().then(snapshot => {
    if (snapshot.empty) {
      $('#userTableBody').html('<tr><td colspan="4" class="empty-text">No users found</td></tr>');
      return;
    }
    
    let html = '';
    snapshot.forEach(doc => {
      const user = doc.data();
      const id = doc.id;
      html += `
        <tr data-id="${id}">
          <td>${user.username}</td>
          <td>${user.role}</td>
          <td><span class="status-badge ${user.status.toLowerCase()}">${user.status}</span></td>
          <td class="action-cell">
            <button class="edit-user" data-id="${id}">Edit</button>
            <button class="delete-user" data-id="${id}">Delete</button>
          </td>
        </tr>
      `;
    });
    
    $('#userTableBody').html(html);
  }).catch(error => {
    console.error("Error getting users: ", error);
    $('#userTableBody').html('<tr><td colspan="4" class="error-text">Error loading users</td></tr>');
  });
}

// Show add user form
function showAddUserForm() {
  $('#userFormTitle').text('Add User');
  $('#userId').val('');
  $('#userForm')[0].reset();
  $('#userRole').val('Cashier'); // Default role
  $('#userStatus').val('Active'); // Default status
  $('#userFormModal').show();
}

// Handle edit user
function handleEditUser() {
  const id = $(this).data('id');
  $('#userFormTitle').text('Edit User');
  
  db.collection('users').doc(id).get().then(doc => {
    if (doc.exists) {
      const user = doc.data();
      $('#userId').val(id);
      $('#username').val(user.username);
      $('#password').val(''); // For security, don't show the password
      $('#userRole').val(user.role);
      $('#userStatus').val(user.status);
      $('#userFormModal').show();
    } else {
      alert('User not found!');
    }
  }).catch(error => {
    console.error("Error getting user: ", error);
    alert('Error loading user');
  });
}

// Handle delete user
function handleDeleteUser() {
  if (confirm('Are you sure you want to delete this user?')) {
    const id = $(this).data('id');
    
    db.collection('users').doc(id).delete()
      .then(() => {
        loadUsersTable();
      })
      .catch(error => {
        console.error("Error deleting user: ", error);
        alert('Error deleting user');
      });
  }
}

// Close user modal
function closeUserModal() {
  $('#userFormModal').hide();
}

// Handle user form submission
function handleUserSubmit(e) {
  e.preventDefault();
  
  const userData = {
    username: $('#username').val().trim(),
    role: $('#userRole').val(),
    status: $('#userStatus').val()
  };
  
  // Only update password if provided (for editing existing users)
  const password = $('#password').val().trim();
  if (password) {
    userData.password = password;
  }
  
  const id = $('#userId').val();
  
  if (id) {
    // Update existing user
    db.collection('users').doc(id).update(userData)
      .then(() => {
        closeUserModal();
        loadUsersTable();
      })
      .catch(error => {
        console.error("Error updating user: ", error);
        alert('Error updating user');
      });
  } else {
    // Add new user - password is required for new users
    if (!password) {
      alert('Password is required');
      return;
    }
    
    // Check if username already exists
    db.collection('users').where('username', '==', userData.username).get()
      .then(snapshot => {
        if (!snapshot.empty) {
          alert('Username already exists');
          return;
        }
        
        // Add the new user with password
        db.collection('users').add(userData)
          .then(() => {
            closeUserModal();
            loadUsersTable();
          })
          .catch(error => {
            console.error("Error adding user: ", error);
            alert('Error adding user');
          });
      })
      .catch(error => {
        console.error("Error checking username: ", error);
        alert('Error checking username');
      });
  }
}

// Initial load to ensure products are available
fetchProducts();
renderOrder(); 