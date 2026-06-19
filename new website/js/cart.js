/* ============================================================
   ROSEVOW — cart.js
   Cart management, checkout (WhatsApp / Email), toast system
   ============================================================ */

const CART_KEY = 'rosevow_cart';
const WHATSAPP_NUMBER = '916239493835';
const EMAIL_ADDRESS = 'rosevow4u@gmail.com';
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_COST = 49;

// ────────────────────────────────────────────────────────────
// 1. CART OPERATIONS
// ────────────────────────────────────────────────────────────

/**
 * Read cart from localStorage.
 * @returns {{ productId: number, quantity: number, size: string }[]}
 */
function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Persist cart array to localStorage.
 * @param {object[]} cart
 */
function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error('Rosevow: could not save cart', e);
  }
}

/**
 * Add a product to the cart (or increment its quantity).
 * @param {number|string} productId
 * @param {number}        quantity
 * @param {string}        size
 */
function addToCart(productId, quantity = 1, size = '') {
  const id = Number(productId);
  const product = window.getProductById(id);
  if (!product) {
    showToast('Product not found.', 'error');
    return;
  }

  const cart = getCart();
  const existing = cart.find(
    (item) => item.productId === id && item.size === size
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId: id, quantity, size });
  }

  saveCart(cart);
  updateCartBadge();
  showToast('Added to cart!', 'success');

  // If we're on the cart page, re-render
  if (typeof renderCart === 'function' && document.getElementById('cartItems')) {
    renderCart();
  }
}

/**
 * Remove an item from the cart entirely.
 * @param {number|string} productId
 * @param {string}        size — optional, used to distinguish same product in different sizes
 */
function removeFromCart(productId, size) {
  const id = Number(productId);
  let cart = getCart();

  if (size !== undefined) {
    cart = cart.filter(
      (item) => !(item.productId === id && item.size === size)
    );
  } else {
    cart = cart.filter((item) => item.productId !== id);
  }

  saveCart(cart);
  updateCartBadge();
  showToast('Removed from cart', 'info');

  if (document.getElementById('cartItems')) {
    renderCart();
  }
}

/**
 * Update the quantity of a specific cart item.
 * If newQuantity <= 0 the item is removed.
 * @param {number|string} productId
 * @param {number}        newQuantity
 * @param {string}        size
 */
function updateQuantity(productId, newQuantity, size) {
  const id = Number(productId);
  const cart = getCart();

  if (newQuantity <= 0) {
    removeFromCart(id, size);
    return;
  }

  const item = cart.find(
    (i) => i.productId === id && (size === undefined || i.size === size)
  );
  if (item) {
    item.quantity = Math.max(1, Math.min(newQuantity, 99));
    saveCart(cart);
    updateCartBadge();
    if (document.getElementById('cartItems')) renderCart();
  }
}

/**
 * Calculate the subtotal of all items in the cart.
 * @returns {number}
 */
function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => {
    const product = window.getProductById(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
}

/**
 * Total number of items in the cart.
 * @returns {number}
 */
function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Empty the entire cart.
 */
function clearCart() {
  saveCart([]);
  updateCartBadge();
  if (document.getElementById('cartItems')) renderCart();
}

// Expose globally
window.getCart = getCart;
window.saveCart = saveCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.getCartTotal = getCartTotal;
window.getCartCount = getCartCount;
window.clearCart = clearCart;

// ────────────────────────────────────────────────────────────
// 2. CART PAGE RENDERING
// ────────────────────────────────────────────────────────────

/**
 * Render the entire cart page. Only runs when #cartItems exists.
 */
function renderCart() {
  const cartItemsEl = document.getElementById('cartItems');
  const emptyCartEl = document.getElementById('emptyCart');
  const cartSummaryEl = document.getElementById('cartSummary');
  const cartActionsEl = document.getElementById('cartActions');

  if (!cartItemsEl) return; // not on cart page

  const cart = getCart();
  const checkoutSectionEl = document.getElementById('checkoutFormSection');

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '';
    if (emptyCartEl) emptyCartEl.style.display = 'flex';
    if (cartSummaryEl) cartSummaryEl.style.display = 'none';
    if (cartActionsEl) cartActionsEl.style.display = 'none';
    if (checkoutSectionEl) checkoutSectionEl.style.display = 'none';
    return;
  }

  if (emptyCartEl) emptyCartEl.style.display = 'none';
  if (cartSummaryEl) cartSummaryEl.style.display = 'block';
  if (cartActionsEl) cartActionsEl.style.display = 'flex';
  if (checkoutSectionEl) checkoutSectionEl.style.display = 'block';

  // Build item rows
  let itemsHtml = '';
  let subtotal = 0;

  cart.forEach((item) => {
    const product = window.getProductById(item.productId);
    if (!product) return;

    const lineTotal = product.price * item.quantity;
    subtotal += lineTotal;

    const imgStyle = window.formatProductImageStyle ? window.formatProductImageStyle(product.image) : product.image;
    itemsHtml += `
      <div class="cart-item" data-product-id="${product.id}" data-size="${item.size}">
        <div class="cart-item__image" style="background:${imgStyle}"></div>
        <div class="cart-item__info">
          <a href="product.html?id=${product.id}" class="cart-item__name">${product.name}</a>
          <span class="cart-item__material">${product.material}</span>
          ${item.size ? `<span class="cart-item__size">Size: ${item.size}</span>` : ''}
          <span class="cart-item__price">${window.formatPrice(product.price)}</span>
        </div>
        <div class="cart-item__actions">
          <div class="cart-item__qty">
            <button class="cart-item__qty-btn cart-item__qty-minus" data-id="${product.id}" data-size="${item.size}" aria-label="Decrease quantity">−</button>
            <span class="cart-item__qty-value">${item.quantity}</span>
            <button class="cart-item__qty-btn cart-item__qty-plus" data-id="${product.id}" data-size="${item.size}" aria-label="Increase quantity">+</button>
          </div>
          <span class="cart-item__line-total">${window.formatPrice(lineTotal)}</span>
          <button class="cart-item__remove" data-id="${product.id}" data-size="${item.size}" aria-label="Remove item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>`;
  });

  cartItemsEl.innerHTML = itemsHtml;

  // Summary
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const subtotalEl = document.getElementById('cartSubtotal');
  const shippingEl = document.getElementById('cartShipping');
  const totalEl = document.getElementById('cartTotal');
  const savingsEl = document.getElementById('cartSavings');

  if (subtotalEl) subtotalEl.textContent = window.formatPrice(subtotal);
  if (shippingEl) {
    shippingEl.textContent = shipping === 0 ? 'FREE' : window.formatPrice(shipping);
    if (shipping === 0) shippingEl.classList.add('free');
    else shippingEl.classList.remove('free');
  }
  if (totalEl) totalEl.textContent = window.formatPrice(total);

  // Total savings
  if (savingsEl) {
    const totalOriginal = cart.reduce((sum, item) => {
      const p = window.getProductById(item.productId);
      return sum + (p ? p.originalPrice * item.quantity : 0);
    }, 0);
    const savings = totalOriginal - subtotal;
    savingsEl.textContent = window.formatPrice(savings);
  }

  if (typeof recalculateCartSummary === 'function') {
    recalculateCartSummary();
  }
}

window.renderCart = renderCart;

// ────────────────────────────────────────────────────────────
// 3. CART BADGE
// ────────────────────────────────────────────────────────────

/**
 * Update the header cart badge count on every page.
 */
function updateCartBadge() {
  const badge = document.getElementById('cartCount');
  if (!badge) return;
  const count = getCartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}

window.updateCartBadge = updateCartBadge;

// ────────────────────────────────────────────────────────────
// 4. CHECKOUT — WHATSAPP
// ────────────────────────────────────────────────────────────

/**
 * Build a WhatsApp message with the full cart and open the link.
 */
function checkoutWhatsApp() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Your cart is empty.', 'error');
    return;
  }

  const subtotal = getCartTotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  let message = '🛒 *New Order from Rosevow Website*\n\n';

  cart.forEach((item) => {
    const product = window.getProductById(item.productId);
    if (!product) return;
    const lineTotal = product.price * item.quantity;
    message += `📦 *${product.name}*\n`;
    message += `   Qty: ${item.quantity} | Size: ${item.size || 'N/A'}\n`;
    message += `   Price: ₹${product.price.toLocaleString('en-IN')} × ${item.quantity} = ₹${lineTotal.toLocaleString('en-IN')}\n\n`;
  });

  message += '---\n';
  message += `💰 *Subtotal:* ₹${subtotal.toLocaleString('en-IN')}\n`;
  message += `🚚 *Shipping:* ${shipping === 0 ? 'Free' : '₹' + shipping}\n`;
  message += `✨ *Total:* ₹${total.toLocaleString('en-IN')}\n\n`;
  message += 'Please confirm this order. Thank you! 🙏';

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

window.checkoutWhatsApp = checkoutWhatsApp;

// ────────────────────────────────────────────────────────────
// 5. CHECKOUT — EMAIL
// ────────────────────────────────────────────────────────────

/**
 * Build a mailto link with the full cart and open it.
 */
function checkoutEmail() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Your cart is empty.', 'error');
    return;
  }

  const subtotal = getCartTotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  let body = 'New Order from Rosevow Website\n\n';

  cart.forEach((item) => {
    const product = window.getProductById(item.productId);
    if (!product) return;
    const lineTotal = product.price * item.quantity;
    body += `${product.name}\n`;
    body += `  Qty: ${item.quantity} | Size: ${item.size || 'N/A'}\n`;
    body += `  Price: Rs.${product.price.toLocaleString('en-IN')} x ${item.quantity} = Rs.${lineTotal.toLocaleString('en-IN')}\n\n`;
  });

  body += '---\n';
  body += `Subtotal: Rs.${subtotal.toLocaleString('en-IN')}\n`;
  body += `Shipping: ${shipping === 0 ? 'Free' : 'Rs.' + shipping}\n`;
  body += `Total: Rs.${total.toLocaleString('en-IN')}\n\n`;
  body += 'Please confirm this order. Thank you!';

  const subject = encodeURIComponent('New Order from Rosevow Website');
  const mailBody = encodeURIComponent(body);
  window.location.href = `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${mailBody}`;
}

window.checkoutEmail = checkoutEmail;

// ────────────────────────────────────────────────────────────
// 6. SINGLE PRODUCT BUY NOW (WhatsApp)
// ────────────────────────────────────────────────────────────

/**
 * Instantly send a single product order via WhatsApp.
 * @param {number|string} productId
 * @param {number}        quantity
 * @param {string}        size
 */
function buyNowWhatsApp(productId, quantity = 1, size = '') {
  const product = window.getProductById(Number(productId));
  if (!product) {
    showToast('Product not found.', 'error');
    return;
  }

  const lineTotal = product.price * quantity;
  const shipping = lineTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = lineTotal + shipping;

  let message = '🛒 *Order from Rosevow Website*\n\n';
  message += `📦 *${product.name}*\n`;
  message += `   Qty: ${quantity} | Size: ${size || 'N/A'}\n`;
  message += `   Price: ₹${product.price.toLocaleString('en-IN')} × ${quantity} = ₹${lineTotal.toLocaleString('en-IN')}\n\n`;
  message += '---\n';
  message += `💰 *Subtotal:* ₹${lineTotal.toLocaleString('en-IN')}\n`;
  message += `🚚 *Shipping:* ${shipping === 0 ? 'Free' : '₹' + shipping}\n`;
  message += `✨ *Total:* ₹${total.toLocaleString('en-IN')}\n\n`;
  message += 'Please confirm this order. Thank you! 🙏';

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

/**
 * Instantly send a single product inquiry via Email.
 * @param {number|string} productId
 * @param {number}        quantity
 * @param {string}        size
 */
function buyNowEmail(productId, quantity = 1, size = '') {
  const product = window.getProductById(Number(productId));
  if (!product) {
    showToast('Product not found.', 'error');
    return;
  }

  const lineTotal = product.price * quantity;
  const shipping = lineTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = lineTotal + shipping;

  let body = 'Order from Rosevow Website\n\n';
  body += `${product.name}\n`;
  body += `  Qty: ${quantity} | Size: ${size || 'N/A'}\n`;
  body += `  Price: Rs.${product.price.toLocaleString('en-IN')} x ${quantity} = Rs.${lineTotal.toLocaleString('en-IN')}\n\n`;
  body += '---\n';
  body += `Subtotal: Rs.${lineTotal.toLocaleString('en-IN')}\n`;
  body += `Shipping: ${shipping === 0 ? 'Free' : 'Rs.' + shipping}\n`;
  body += `Total: Rs.${total.toLocaleString('en-IN')}\n\n`;
  body += 'Please confirm this order. Thank you!';

  const subject = encodeURIComponent(`Order: ${product.name} — Rosevow`);
  const mailBody = encodeURIComponent(body);
  window.location.href = `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${mailBody}`;
}

window.buyNowWhatsApp = buyNowWhatsApp;
window.buyNowEmail = buyNowEmail;

// ────────────────────────────────────────────────────────────
// 7. EVENT LISTENERS (delegated)
// ────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Update cart badge on load
  updateCartBadge();
});

document.addEventListener('click', (e) => {
  // ── Add to cart (product cards) ──
  const addBtn = e.target.closest('.product-card__add-btn');
  if (addBtn) {
    e.preventDefault();
    const id = addBtn.dataset.id;
    addToCart(id);
    return;
  }

  // ── Add to cart (product detail page) ──
  const addDetailBtn = e.target.closest('#addToCartBtn');
  if (addDetailBtn) {
    e.preventDefault();
    const id = addDetailBtn.dataset.id;
    const qtyEl = document.getElementById('productQuantity');
    const qty = qtyEl ? parseInt(qtyEl.textContent, 10) || 1 : 1;
    const activeSize = document.querySelector('.size-option.active');
    const size = activeSize ? activeSize.dataset.size : '';
    
    // Size selection validation
    const product = window.getProductById(Number(id));
    if (product && product.sizes && product.sizes.length > 0 && !size) {
      showToast('Please select your preferred size first!', 'error');
      return;
    }
    
    addToCart(id, qty, size);
    return;
  }

  // ── Buy Now WhatsApp (product detail page) ──
  const buyWA = e.target.closest('#buyNowWhatsApp');
  if (buyWA) {
    e.preventDefault();
    const id = buyWA.dataset.id;
    const qtyEl = document.getElementById('productQuantity');
    const qty = qtyEl ? parseInt(qtyEl.textContent, 10) || 1 : 1;
    const activeSize = document.querySelector('.size-option.active');
    const size = activeSize ? activeSize.dataset.size : '';
    
    // Size selection validation
    const product = window.getProductById(Number(id));
    if (product && product.sizes && product.sizes.length > 0 && !size) {
      showToast('Please select your preferred size first!', 'error');
      return;
    }
    
    buyNowWhatsApp(id, qty, size);
    return;
  }

  // ── Buy Now Email (product detail page) ──
  const buyEM = e.target.closest('#buyNowEmail');
  if (buyEM) {
    e.preventDefault();
    const id = buyEM.dataset.id;
    const qtyEl = document.getElementById('productQuantity');
    const qty = qtyEl ? parseInt(qtyEl.textContent, 10) || 1 : 1;
    const activeSize = document.querySelector('.size-option.active');
    const size = activeSize ? activeSize.dataset.size : '';
    
    // Size selection validation
    const product = window.getProductById(Number(id));
    if (product && product.sizes && product.sizes.length > 0 && !size) {
      showToast('Please select your preferred size first!', 'error');
      return;
    }
    
    buyNowEmail(id, qty, size);
    return;
  }

  // ── Cart item remove ──
  const removeBtn = e.target.closest('.cart-item__remove');
  if (removeBtn) {
    e.preventDefault();
    removeFromCart(removeBtn.dataset.id, removeBtn.dataset.size);
    return;
  }

  // ── Cart quantity minus ──
  const minusBtn = e.target.closest('.cart-item__qty-minus');
  if (minusBtn) {
    e.preventDefault();
    const id = minusBtn.dataset.id;
    const size = minusBtn.dataset.size;
    const cart = getCart();
    const item = cart.find(
      (i) => i.productId === Number(id) && (size === undefined || i.size === size)
    );
    if (item) updateQuantity(id, item.quantity - 1, size);
    return;
  }

  // ── Cart quantity plus ──
  const plusBtn = e.target.closest('.cart-item__qty-plus');
  if (plusBtn) {
    e.preventDefault();
    const id = plusBtn.dataset.id;
    const size = plusBtn.dataset.size;
    const cart = getCart();
    const item = cart.find(
      (i) => i.productId === Number(id) && (size === undefined || i.size === size)
    );
    if (item) updateQuantity(id, item.quantity + 1, size);
    return;
  }

  // ── Checkout WhatsApp ──
  if (e.target.closest('#checkoutWhatsApp')) {
    e.preventDefault();
    checkoutWhatsApp();
    return;
  }

  // ── Checkout Email ──
  if (e.target.closest('#checkoutEmail')) {
    e.preventDefault();
    checkoutEmail();
    return;
  }

  // ── Clear cart ──
  if (e.target.closest('#clearCart')) {
    e.preventDefault();
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      showToast('Cart cleared', 'info');
    }
    return;
  }
});

// ────────────────────────────────────────────────────────────
// 8. TOAST NOTIFICATIONS
// ────────────────────────────────────────────────────────────

/**
 * Show a temporary toast notification.
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 */
function showToast(message, type = 'success') {
  // Remove existing toast if any
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const icons = {
    success:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span class="toast__icon">${icons[type] || icons.info}</span>
    <span class="toast__message">${message}</span>
    <button class="toast__close" aria-label="Close">×</button>
  `;

  document.body.appendChild(toast);

  // Trigger reflow for animation
  requestAnimationFrame(() => {
    toast.classList.add('toast--visible');
  });

  // Auto-dismiss
  const timer = setTimeout(() => dismissToast(toast), 3000);

  // Manual close
  toast.querySelector('.toast__close').addEventListener('click', () => {
    clearTimeout(timer);
    dismissToast(toast);
  });
}

function dismissToast(toast) {
  toast.classList.remove('toast--visible');
  toast.classList.add('toast--hiding');
  setTimeout(() => toast.remove(), 300);
}

window.showToast = showToast;

// ────────────────────────────────────────────────────────────
// 9. PROMO CODES, GIFT WRAPPING & CHECKOUT FORM HANDLING
// ────────────────────────────────────────────────────────────

let activeCouponCode = null;
let activeDiscount = 0;
let isGiftWrapSelected = false;
const GIFT_WRAP_FEE = 50;

function recalculateCartSummary() {
  const subtotal = getCartTotal();
  if (subtotal === 0) return;

  // Coupon discount calculation
  activeDiscount = 0;
  if (activeCouponCode === 'ROSEVOW10') {
    activeDiscount = Math.round(subtotal * 0.1);
  } else if (activeCouponCode === 'WELCOME100') {
    if (subtotal >= 999) {
      activeDiscount = 100;
    } else {
      activeCouponCode = null;
      activeDiscount = 0;
      showToast('WELCOME100 requires a minimum order of ₹999.', 'error');
      const couponInput = document.getElementById('couponCodeInput');
      if (couponInput) couponInput.value = '';
    }
  }

  // Gift wrap calculation
  const giftWrapFee = isGiftWrapSelected ? GIFT_WRAP_FEE : 0;

  // Shipping calculation
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

  // Final Total
  const total = subtotal - activeDiscount + giftWrapFee + shipping;

  // Update Summary DOM
  const subtotalEl = document.getElementById('cartSubtotal');
  const shippingEl = document.getElementById('cartShipping');
  const discountEl = document.getElementById('summaryDiscountRow');
  const giftWrapEl = document.getElementById('summaryGiftWrapRow');
  const totalEl = document.getElementById('cartTotal');

  if (subtotalEl) subtotalEl.textContent = window.formatPrice(subtotal);
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : window.formatPrice(shipping);
  
  if (discountEl) {
    if (activeDiscount > 0) {
      discountEl.style.display = 'flex';
      document.getElementById('summaryDiscountAmount').textContent = `-${window.formatPrice(activeDiscount)}`;
    } else {
      discountEl.style.display = 'none';
    }
  }

  if (giftWrapEl) {
    if (giftWrapFee > 0) {
      giftWrapEl.style.display = 'flex';
      document.getElementById('summaryGiftWrapAmount').textContent = window.formatPrice(giftWrapFee);
    } else {
      giftWrapEl.style.display = 'none';
    }
  }

  if (totalEl) totalEl.textContent = window.formatPrice(total);
}

document.addEventListener('DOMContentLoaded', () => {
  // Listeners for checkout actions
  const cartLayout = document.querySelector('.cart-layout');
  if (!cartLayout) return;

  // 1. Coupon Apply
  document.addEventListener('click', (e) => {
    const applyBtn = e.target.closest('#applyCouponBtn');
    if (applyBtn) {
      e.preventDefault();
      const code = document.getElementById('couponCodeInput').value.trim().toUpperCase();
      if (!code) {
        showToast('Please enter a coupon code.', 'error');
        return;
      }
      if (code === 'ROSEVOW10' || code === 'WELCOME100') {
        activeCouponCode = code;
        recalculateCartSummary();
        showToast(`Promo code ${code} applied successfully!`, 'success');
      } else {
        showToast('Invalid coupon code.', 'error');
      }
    }
  });

  // 2. Gift Wrap Toggle
  document.addEventListener('change', (e) => {
    const wrapCheck = e.target.closest('#giftWrapCheckbox');
    if (wrapCheck) {
      isGiftWrapSelected = wrapCheck.checked;
      const messageField = document.getElementById('giftMessageGroup');
      if (messageField) {
        messageField.style.display = isGiftWrapSelected ? 'block' : 'none';
      }
      recalculateCartSummary();
    }
  });

  // 3. Place Order Submit
  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const cart = getCart();
      if (cart.length === 0) {
        showToast('Your shopping cart is empty.', 'error');
        return;
      }

      // Gather Details
      const name = document.getElementById('checkoutName').value.trim();
      const phone = document.getElementById('checkoutPhone').value.trim();
      const email = document.getElementById('checkoutEmail').value.trim();
      const address = document.getElementById('checkoutAddress').value.trim();
      const pincode = document.getElementById('checkoutPin').value.trim();
      const ringSizingPref = document.getElementById('checkoutRingSize').value.trim();
      const giftMessage = document.getElementById('checkoutGiftMessage').value.trim();

      const subtotal = getCartTotal();
      const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
      const discount = activeDiscount;
      const giftWrapFee = isGiftWrapSelected ? GIFT_WRAP_FEE : 0;
      const total = subtotal - discount + giftWrapFee + shipping;
      const totalFormatted = window.formatPrice(total);

      // Map cart items details
      const orderItems = cart.map(item => {
        const product = window.getProductById(item.productId);
        return {
          productId: item.productId,
          name: product ? product.name : 'Unknown Product',
          quantity: item.quantity,
          size: item.size || 'N/A',
          price: product ? window.formatPrice(product.price) : 'N/A'
        };
      });

      // Construct detailed products message for email
      const itemsDetailText = orderItems.map(i => 
        `- ${i.name} (Qty: ${i.quantity} | Size: ${i.size} | Price: ${i.price})`
      ).join('\n');

      const submitBtn = checkoutForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing Order...';
      }

      // Generate unique reference
      const orderId = `#RV-${Math.floor(10000 + Math.random() * 90000)}`;
      const dateStr = new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Build Checkout Payload
      const payload = {
        orderId: orderId,
        date: dateStr,
        name: name,
        email: email,
        phone: phone,
        address: `${address}, PIN: ${pincode}`,
        coupon_applied: activeCouponCode || 'None',
        savings: window.formatPrice(discount),
        gift_wrap_packaging: isGiftWrapSelected ? 'Yes' : 'No',
        gift_message_card: giftMessage || 'None',
        customer_ring_size_preferences: ringSizingPref || 'None',
        ordered_products: itemsDetailText,
        delivery_shipping_charge: shipping === 0 ? 'FREE' : window.formatPrice(shipping),
        final_payable_amount: totalFormatted
      };

      // Helper function for order success actions
      const handleOrderSuccess = () => {
        // Log order locally for Dashboard CRUD
        const orders = JSON.parse(localStorage.getItem('rosevow_orders')) || [];
        const newOrderObj = {
          orderId,
          date: dateStr,
          name,
          phone,
          email,
          address: `${address}, PIN: ${pincode}`,
          items: orderItems,
          giftWrap: isGiftWrapSelected ? 'Yes' : 'No',
          giftMessage: giftMessage || '',
          totalAmount: totalFormatted,
          status: 'pending'
        };
        orders.push(newOrderObj);
        localStorage.setItem('rosevow_orders', JSON.stringify(orders));

        // Save last order details for confirmation landing
        localStorage.setItem('rosevow_last_order', JSON.stringify(newOrderObj));

        // Clear cart
        clearCart();

        // Redirect to success confirmation
        window.location.href = 'order-success.html';
      };

      // Check if browsed locally via file:// protocol
      if (window.location.protocol === 'file:') {
        showToast('Simulating offline checkout for local file...', 'info');
        setTimeout(() => {
          handleOrderSuccess();
        }, 1500);
        return;
      }

      // Fallback checkout handler (FormSubmit)
      const callFormSubmitFallback = () => {
        fetch('https://formsubmit.co/ajax/rosevow4u@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
          if (data.success === 'true') {
            handleOrderSuccess();
          } else {
            showToast('Order processing failed. Please try again.', 'error');
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Place Order';
            }
          }
        })
        .catch(error => {
          console.error('Checkout fallback error:', error);
          showToast('Checkout connection error. Please try again.', 'error');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Place Order';
          }
        });
      };

      // Try the Netlify Serverless Function first
      fetch('/.netlify/functions/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(response => {
        // If function doesn't exist (e.g. 404 on local dev servers) or fails (500), fall back to FormSubmit
        if (!response.ok || response.status === 404) {
          console.warn(`Netlify function returned status ${response.status}. Falling back to FormSubmit...`);
          callFormSubmitFallback();
          return;
        }
        return response.json();
      })
      .then(data => {
        if (!data) return; // Already handled by status check / catch
        if (data.success === 'true') {
          handleOrderSuccess();
        } else {
          console.warn('Netlify function returned success=false. Falling back to FormSubmit...');
          callFormSubmitFallback();
        }
      })
      .catch(error => {
        console.warn('Netlify function connection failed. Falling back to FormSubmit...', error);
        callFormSubmitFallback();
      });
    });
  }
});
