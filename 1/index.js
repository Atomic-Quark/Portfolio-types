// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navbar = document.querySelector('.navbar');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navbar.classList.toggle('active'); // CSS should show/hide based on this class
    });
  }

  // Cart management using localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || {};

  // Add to Cart function
  window.addToCart = function(productId) {
    if (cart[productId]) {
      cart[productId] += 1;
    } else {
      cart[productId] = 1;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
    // Update cart UI if needed (e.g. cart count)
  };

  // Update quantity
  window.updateQuantity = function(productId, qty) {
    if (qty <= 0) {
      delete cart[productId];
    } else {
      cart[productId] = parseInt(qty);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    // Optionally update cart summary
  };

  // Remove from cart
  window.removeFromCart = function(productId) {
    delete cart[productId];
    localStorage.setItem('cart', JSON.stringify(cart));
    // Optionally remove the row from the table
    alert('Product removed from cart.');
  };

  // Load cart on the Cart page
  if (document.querySelector('.cart-table')) {
    // Example of populating cart table (simplified)
    const tbody = document.querySelector('.cart-table tbody');
    for (let id in cart) {
      // Fetch product info via API or have it available
      // Here we use placeholder data
      let productName = 'Product ' + id;
      let price = 29.99; // placeholder
      let quantity = cart[id];
      let subtotal = (price * quantity).toFixed(2);

      let row = document.createElement('tr');
      row.innerHTML = `
        <td class="product-cell">
          <img src="img/product${id}.jpg" alt="${productName}" width="50">
          <span>${productName}</span>
        </td>
        <td>$${price}</td>
        <td><input type="number" value="${quantity}" min="1" onchange="updateQuantity(${id}, this.value)"></td>
        <td>$${subtotal}</td>
        <td><button onclick="removeFromCart(${id})">X</button></td>
      `;
      tbody.appendChild(row);
    }
    // Calculate totals (simple sum)
    let total = Object.values(cart).reduce((sum, qty) => sum + qty*29.99, 0);
    let cartSummary = document.querySelector('.cart-summary');
    if (cartSummary) {
      cartSummary.querySelector('p strong').textContent = `$${total.toFixed(2)}`;
    }
  }

  // Form validation example for registration
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      const pwd = document.getElementById('reg-password').value;
      const confirm = document.getElementById('confirm-password').value;
      if (pwd !== confirm) {
        e.preventDefault();
        alert('Passwords do not match!');
      }
    });
  }

  // Dark mode toggle (if there is a button or switch)
  const darkToggle = document.getElementById('darkModeToggle');
  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      // Optionally store preference in localStorage
    });
  }
});
