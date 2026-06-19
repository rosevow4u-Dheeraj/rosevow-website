/* ============================================================
   ROSEVOW — app.js
   Core product data, helpers, rendering, and page initialisation
   ============================================================ */

// ────────────────────────────────────────────────────────────
// 1. PRODUCT CATALOG
// ────────────────────────────────────────────────────────────

const defaultProducts = [
  // ── Rings ──
  {
    id: 1,
    name: 'Rose Gold Infinity Ring',
    slug: 'rose-gold-infinity-ring',
    category: 'rings',
    price: 699,
    originalPrice: 1299,
    discount: 46,
    image: "url('images/ring.png') center/cover no-repeat",
    rating: 4.8,
    reviews: 324,
    description:
      'Elegant infinity design in premium rose gold plating. This timeless ring features a delicate infinity symbol, perfect for everyday wear or special occasions.',
    material: 'Alloy with Rose Gold Plating',
    features: ['Tarnish-Free', 'Anti-Allergic', 'Adjustable'],
    sizes: ['6', '7', '8', '9', '10'],
    inStock: true,
    isNew: true,
    isBestseller: true,
    isTrending: true
  },
  {
    id: 2,
    name: 'Diamond-Cut Crystal Ring',
    slug: 'diamond-cut-crystal-ring',
    category: 'rings',
    price: 899,
    originalPrice: 1599,
    discount: 44,
    image: "url('images/ring.png') center/cover no-repeat",
    rating: 4.6,
    reviews: 189,
    description:
      'Stunning diamond-cut crystals set in a sleek band. Catches light beautifully from every angle.',
    material: '925 Silver Plated with Crystals',
    features: ['Tarnish-Free', 'Anti-Allergic', 'Crystal Stones'],
    sizes: ['6', '7', '8', '9'],
    inStock: true,
    isNew: false,
    isBestseller: false,
    isTrending: true
  },
  {
    id: 3,
    name: 'Floral Pearl Ring',
    slug: 'floral-pearl-ring',
    category: 'rings',
    price: 599,
    originalPrice: 999,
    discount: 40,
    image: "url('images/ring.png') center/cover no-repeat",
    rating: 4.7,
    reviews: 256,
    description:
      'Delicate floral design adorned with lustrous pearls. A perfect blend of elegance and nature.',
    material: 'Alloy with Pearl Accents',
    features: ['Tarnish-Free', 'Anti-Allergic', 'Genuine Pearls'],
    sizes: ['6', '7', '8', '9', '10'],
    inStock: true,
    isNew: false,
    isBestseller: true,
    isTrending: false
  },
  {
    id: 4,
    name: 'Butterfly Charm Ring',
    slug: 'butterfly-charm-ring',
    category: 'rings',
    price: 799,
    originalPrice: 1499,
    discount: 47,
    image: "url('images/ring.png') center/cover no-repeat",
    rating: 4.5,
    reviews: 142,
    description:
      'Whimsical butterfly design with sparkling stone accents. Perfect for the free-spirited soul.',
    material: 'Rose Gold Plated Alloy',
    features: ['Tarnish-Free', 'Anti-Allergic', 'Adjustable'],
    sizes: ['6', '7', '8', '9'],
    inStock: true,
    isNew: true,
    isBestseller: false,
    isTrending: false
  },

  // ── Necklaces ──
  {
    id: 5,
    name: 'Layered Rose Pendant',
    slug: 'layered-rose-pendant',
    category: 'necklaces',
    price: 1299,
    originalPrice: 2499,
    discount: 48,
    image: "url('images/necklace.png') center/cover no-repeat",
    rating: 4.9,
    reviews: 412,
    description:
      'Exquisite layered pendant featuring a delicate rose motif. The multi-layer chain adds depth and sophistication.',
    material: '18K Gold Plated',
    features: ['Tarnish-Free', 'Adjustable Chain', 'Gift Box Included'],
    sizes: [],
    inStock: true,
    isNew: true,
    isBestseller: true,
    isTrending: true
  },
  {
    id: 6,
    name: 'Heart Chain Necklace',
    slug: 'heart-chain-necklace',
    category: 'necklaces',
    price: 999,
    originalPrice: 1899,
    discount: 47,
    image: "url('images/necklace.png') center/cover no-repeat",
    rating: 4.7,
    reviews: 298,
    description:
      'A charming heart pendant on a dainty chain. Symbolizes love and makes a perfect gift.',
    material: 'Rose Gold Plated',
    features: ['Tarnish-Free', 'Anti-Allergic', 'Adjustable'],
    sizes: [],
    inStock: true,
    isNew: false,
    isBestseller: true,
    isTrending: true
  },
  {
    id: 7,
    name: 'Pearl Choker Set',
    slug: 'pearl-choker-set',
    category: 'necklaces',
    price: 1499,
    originalPrice: 2799,
    discount: 46,
    image: "url('images/necklace.png') center/cover no-repeat",
    rating: 4.8,
    reviews: 367,
    description:
      'Classic pearl choker that exudes timeless elegance. Includes matching pearl drop earrings.',
    material: 'Freshwater Pearl with Gold Plating',
    features: ['Tarnish-Free', 'Set of 2', 'Gift Box'],
    sizes: [],
    inStock: true,
    isNew: false,
    isBestseller: false,
    isTrending: false
  },
  {
    id: 8,
    name: 'Crystal Drop Necklace',
    slug: 'crystal-drop-necklace',
    category: 'necklaces',
    price: 1199,
    originalPrice: 2299,
    discount: 48,
    image: "url('images/necklace.png') center/cover no-repeat",
    rating: 4.6,
    reviews: 203,
    description:
      'Mesmerizing crystal drop pendant that sparkles with every movement. A statement piece for special occasions.',
    material: 'Silver Plated with Swarovski-type Crystals',
    features: ['Tarnish-Free', 'Anti-Allergic', 'Crystal Stones'],
    sizes: [],
    inStock: true,
    isNew: true,
    isBestseller: false,
    isTrending: false
  },

  // ── Earrings ──
  {
    id: 9,
    name: 'Rose Gold Stud Earrings',
    slug: 'rose-gold-stud-earrings',
    category: 'earrings',
    price: 499,
    originalPrice: 899,
    discount: 44,
    image: "url('images/earrings.png') center/cover no-repeat",
    rating: 4.8,
    reviews: 534,
    description:
      'Classic rose gold studs with a modern twist. Perfect for everyday elegance.',
    material: 'Rose Gold Plated Alloy',
    features: ['Tarnish-Free', 'Anti-Allergic', 'Push-back Closure'],
    sizes: [],
    inStock: true,
    isNew: false,
    isBestseller: true,
    isTrending: true
  },
  {
    id: 10,
    name: 'Crystal Hoop Earrings',
    slug: 'crystal-hoop-earrings',
    category: 'earrings',
    price: 699,
    originalPrice: 1299,
    discount: 46,
    image: "url('images/earrings.png') center/cover no-repeat",
    rating: 4.6,
    reviews: 278,
    description:
      'Glamorous hoop earrings encrusted with sparkling crystals. Makes any outfit shine.',
    material: 'Gold Plated with Crystal Stones',
    features: ['Tarnish-Free', 'Anti-Allergic', 'Hinged Closure'],
    sizes: [],
    inStock: true,
    isNew: true,
    isBestseller: false,
    isTrending: true
  },
  {
    id: 11,
    name: 'Pearl Drop Earrings',
    slug: 'pearl-drop-earrings',
    category: 'earrings',
    price: 799,
    originalPrice: 1499,
    discount: 47,
    image: "url('images/earrings.png') center/cover no-repeat",
    rating: 4.9,
    reviews: 445,
    description:
      'Sophisticated pearl drop earrings that add a touch of grace. Perfect for weddings and formal events.',
    material: 'Freshwater Pearl with Sterling Silver Hook',
    features: ['Tarnish-Free', 'Genuine Pearl', 'Secure Hook'],
    sizes: [],
    inStock: true,
    isNew: false,
    isBestseller: true,
    isTrending: false
  },
  {
    id: 12,
    name: 'Floral Jhumka Earrings',
    slug: 'floral-jhumka-earrings',
    category: 'earrings',
    price: 899,
    originalPrice: 1699,
    discount: 47,
    image: "url('images/earrings.png') center/cover no-repeat",
    rating: 4.7,
    reviews: 312,
    description:
      'Traditional jhumka design with a contemporary floral twist. Perfect fusion of ethnic and modern.',
    material: 'Oxidized Gold Plating',
    features: ['Tarnish-Free', 'Lightweight', 'Traditional Design'],
    sizes: [],
    inStock: true,
    isNew: false,
    isBestseller: false,
    isTrending: true
  },

  // ── Bracelets ──
  {
    id: 13,
    name: 'Rose Gold Chain Bracelet',
    slug: 'rose-gold-chain-bracelet',
    category: 'bracelets',
    price: 799,
    originalPrice: 1499,
    discount: 47,
    image: "url('images/bracelet.png') center/cover no-repeat",
    rating: 4.7,
    reviews: 267,
    description:
      'Delicate chain bracelet in rose gold with a lobster clasp. Adjustable for the perfect fit.',
    material: 'Rose Gold Plated',
    features: ['Tarnish-Free', 'Adjustable', 'Lobster Clasp'],
    sizes: ['Normal', 'Baby Size'],
    inStock: true,
    isNew: true,
    isBestseller: false,
    isTrending: true
  },
  {
    id: 14,
    name: 'Crystal Tennis Bracelet',
    slug: 'crystal-tennis-bracelet',
    category: 'bracelets',
    price: 1099,
    originalPrice: 2099,
    discount: 48,
    image: "url('images/bracelet.png') center/cover no-repeat",
    rating: 4.8,
    reviews: 389,
    description:
      'Stunning tennis bracelet lined with brilliant crystals. A timeless piece for every occasion.',
    material: 'Silver Plated with CZ Stones',
    features: ['Tarnish-Free', 'Anti-Allergic', 'Box Clasp'],
    sizes: ['Normal', 'Baby Size'],
    inStock: true,
    isNew: false,
    isBestseller: true,
    isTrending: true
  },
  {
    id: 15,
    name: 'Pearl Charm Bracelet',
    slug: 'pearl-charm-bracelet',
    category: 'bracelets',
    price: 899,
    originalPrice: 1699,
    discount: 47,
    image: "url('images/bracelet.png') center/cover no-repeat",
    rating: 4.6,
    reviews: 198,
    description:
      'Charming bracelet with pearl and gold charms. Each charm tells a unique story.',
    material: 'Gold Plated with Pearl Charms',
    features: ['Tarnish-Free', 'Adjustable', 'Pearl Accents'],
    sizes: ['Normal', 'Baby Size'],
    inStock: true,
    isNew: false,
    isBestseller: false,
    isTrending: false
  },
  {
    id: 16,
    name: 'Bangle Set (3 pcs)',
    slug: 'bangle-set-3pcs',
    category: 'bracelets',
    price: 1299,
    originalPrice: 2499,
    discount: 48,
    image: "url('images/bracelet.png') center/cover no-repeat",
    rating: 4.8,
    reviews: 423,
    description:
      'Set of 3 elegant bangles in complementary finishes. Mix, match, and stack for your unique style.',
    material: 'Mixed Metal Plating',
    features: ['Tarnish-Free', 'Set of 3', 'Stackable'],
    sizes: ['Normal', 'Baby Size'],
    inStock: true,
    isNew: true,
    isBestseller: true,
    isTrending: false
  },

  // ── Gifts ──
  {
    id: 17,
    name: 'Complete Jewellery Gift Box',
    slug: 'complete-jewellery-gift-box',
    category: 'gifts',
    price: 2499,
    originalPrice: 4999,
    discount: 50,
    image: "url('images/gifts.png') center/cover no-repeat",
    rating: 4.9,
    reviews: 534,
    description:
      'The ultimate jewellery gift set — includes a necklace, earrings, ring, and bracelet in a premium velvet box. Perfect for birthdays, anniversaries, or just because.',
    material: 'Mixed Premium Materials',
    features: ['Premium Box', '4 Pieces', 'Gift Ready'],
    sizes: [],
    inStock: true,
    isNew: true,
    isBestseller: true,
    isTrending: true
  },
  {
    id: 18,
    name: 'Couple Ring Set',
    slug: 'couple-ring-set',
    category: 'gifts',
    price: 1299,
    originalPrice: 2499,
    discount: 48,
    image: "url('images/gifts.png') center/cover no-repeat",
    rating: 4.7,
    reviews: 298,
    description:
      'Matching couple rings in complementary designs. A symbol of your bond.',
    material: 'Rose Gold & Silver Plated',
    features: ['2 Rings', 'Adjustable', 'Gift Box'],
    sizes: ['6', '7', '8', '9', '10'],
    inStock: true,
    isNew: false,
    isBestseller: true,
    isTrending: true
  },
  {
    id: 19,
    name: 'Bridesmaid Gift Set',
    slug: 'bridesmaid-gift-set',
    category: 'gifts',
    price: 1899,
    originalPrice: 3599,
    discount: 47,
    image: "url('images/gifts.png') center/cover no-repeat",
    rating: 4.8,
    reviews: 167,
    description:
      'Curated set for your bridal party — necklace + earrings in a keepsake box. Make your bridesmaids feel special.',
    material: 'Gold Plated with Pearls',
    features: ['Necklace + Earrings', 'Gift Box', 'Keepsake'],
    sizes: [],
    inStock: true,
    isNew: false,
    isBestseller: false,
    isTrending: false
  },
  {
    id: 20,
    name: 'Birthday Special Combo',
    slug: 'birthday-special-combo',
    category: 'gifts',
    price: 999,
    originalPrice: 1899,
    discount: 47,
    image: "url('images/gifts.png') center/cover no-repeat",
    rating: 4.6,
    reviews: 245,
    description:
      'Celebrate with this birthday special combo — bracelet + earrings set with a personalized birthday card.',
    material: 'Rose Gold Plated',
    features: ['Bracelet + Earrings', 'Birthday Card', 'Gift Wrapped'],
    sizes: [],
    inStock: true,
    isNew: true,
    isBestseller: false,
    isTrending: false
  }
];

function initProductDatabase() {
  if (!localStorage.getItem('ROSEVOW_PRODUCTS')) {
    localStorage.setItem('ROSEVOW_PRODUCTS', JSON.stringify(defaultProducts));
  }
  window.ROSEVOW_PRODUCTS = JSON.parse(localStorage.getItem('ROSEVOW_PRODUCTS'));
}
initProductDatabase();
window.initProductDatabase = initProductDatabase;

window.formatProductImageStyle = function(image) {
  if (!image) return 'none';
  if (image.startsWith('url(') || image.startsWith('linear-gradient(')) {
    return image;
  }
  return `url('${image}') center/cover no-repeat`;
};

// ────────────────────────────────────────────────────────────
// 2. HELPER FUNCTIONS
// ────────────────────────────────────────────────────────────

/**
 * Find a single product by its numeric ID.
 * @param {number|string} id
 * @returns {object|undefined}
 */
function getProductById(id) {
  return window.ROSEVOW_PRODUCTS.find((p) => p.id === Number(id));
}

/**
 * Return every product in the given category.
 * @param {string} category
 * @returns {object[]}
 */
function getProductsByCategory(category) {
  if (!category) return window.ROSEVOW_PRODUCTS;
  return window.ROSEVOW_PRODUCTS.filter(
    (p) => p.category === category.toLowerCase()
  );
}

/** Products where isTrending === true */
function getTrendingProducts() {
  return window.ROSEVOW_PRODUCTS.filter((p) => p.isTrending);
}

/** Products where isNew === true */
function getNewArrivals() {
  return window.ROSEVOW_PRODUCTS.filter((p) => p.isNew);
}

/** Products where isBestseller === true */
function getBestsellers() {
  return window.ROSEVOW_PRODUCTS.filter((p) => p.isBestseller);
}

/**
 * Full-text search across name, category, description, and material.
 * @param {string} query
 * @returns {object[]}
 */
function searchProducts(query) {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();
  return window.ROSEVOW_PRODUCTS.filter((p) => {
    const haystack = [p.name, p.category, p.description, p.material]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

/**
 * Sort an array of products (returns a NEW array).
 * @param {object[]} products
 * @param {string}   sortBy — 'price-low' | 'price-high' | 'newest' | 'rating' | 'popularity'
 * @returns {object[]}
 */
function sortProducts(products, sortBy) {
  const sorted = [...products];
  switch (sortBy) {
    case 'price-low':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'popularity':
      sorted.sort((a, b) => b.reviews - a.reviews);
      break;
    default:
      break;
  }
  return sorted;
}

/**
 * Format a number as an INR price string.
 * @param {number} price
 * @returns {string}
 */
function formatPrice(price) {
  return '₹' + price.toLocaleString('en-IN');
}

// Expose helpers globally
window.getProductById = getProductById;
window.getProductsByCategory = getProductsByCategory;
window.getTrendingProducts = getTrendingProducts;
window.getNewArrivals = getNewArrivals;
window.getBestsellers = getBestsellers;
window.searchProducts = searchProducts;
window.sortProducts = sortProducts;
window.formatPrice = formatPrice;

// ────────────────────────────────────────────────────────────
// 3. PRODUCT CARD RENDERER
// ────────────────────────────────────────────────────────────

/**
 * Check whether a product is currently in the wishlist.
 * @param {number} id
 * @returns {boolean}
 */
function isInWishlist(id) {
  try {
    const list = JSON.parse(localStorage.getItem('rosevow_wishlist')) || [];
    return list.includes(Number(id));
  } catch {
    return false;
  }
}

/**
 * Build the HTML string for a single product card.
 * @param {object} product
 * @returns {string}
 */
function renderProductCard(product) {
  const wishlisted = isInWishlist(product.id);
  const heartFill = wishlisted ? 'var(--color-primary, #E85D75)' : 'none';
  const heartStroke = wishlisted
    ? 'var(--color-primary, #E85D75)'
    : 'currentColor';

  // Badges
  let badges = '';
  if (product.isNew) {
    badges += '<span class="product-card__badge product-card__badge--new">New</span>';
  }
  if (product.discount > 0) {
    badges += `<span class="product-card__badge product-card__badge--sale">-${product.discount}%</span>`;
  }
  if (product.isBestseller) {
    badges += '<span class="product-card__badge product-card__badge--bestseller">Bestseller</span>';
  }

  const imgStyle = window.formatProductImageStyle(product.image);
  return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-card__image-wrap" style="background:${imgStyle}">
        <div class="product-card__badges">${badges}</div>
        <button class="product-card__wishlist-btn" data-id="${product.id}" aria-label="Toggle wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${heartFill}" stroke="${heartStroke}" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      <div class="product-card__info">
        <span class="product-card__brand">ROSEVOW</span>
        <a class="product-card__name" href="product.html?id=${product.id}">${product.name}</a>
        <div class="product-card__price-row">
          <span class="product-card__price">${formatPrice(product.price)}</span>
          <span class="product-card__original-price">${formatPrice(product.originalPrice)}</span>
          <span class="product-card__discount">${product.discount}% off</span>
        </div>
        <div class="product-card__rating">
          <span class="product-card__stars">${renderStars(product.rating)}</span>
          <span class="product-card__review-count">(${product.reviews})</span>
        </div>
        <button class="product-card__add-btn" data-id="${product.id}">Add to Cart</button>
      </div>
    </div>`;
}

// Expose globally
window.renderProductCard = renderProductCard;
window.isInWishlist = isInWishlist;

// ────────────────────────────────────────────────────────────
// 4. STAR RENDERER
// ────────────────────────────────────────────────────────────

/**
 * Returns an HTML string of 5 star icons (filled / half / empty).
 * Uses SVG for crisp rendering at any size.
 * @param {number} rating  e.g. 4.7
 * @returns {string}
 */
function renderStars(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      // Full star
      html += `<svg class="star star--filled" width="14" height="14" viewBox="0 0 24 24" fill="#C9A227" stroke="#C9A227" stroke-width="1">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>`;
    } else if (rating >= i - 0.5) {
      // Half star — we use a clipped fill
      html += `<svg class="star star--half" width="14" height="14" viewBox="0 0 24 24" stroke="#C9A227" stroke-width="1">
        <defs><linearGradient id="half${i}"><stop offset="50%" stop-color="#C9A227"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#half${i})"/>
      </svg>`;
    } else {
      // Empty star
      html += `<svg class="star star--empty" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A227" stroke-width="1">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>`;
    }
  }
  return html;
}

window.renderStars = renderStars;

// ────────────────────────────────────────────────────────────
// 5. PAGE INITIALISATION
// ────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const urlPath = window.location.pathname.toLowerCase();
  
  // Page type detection (handles clean URLs, trailing slashes, and local file paths)
  const isHome = urlPath.endsWith('/') || urlPath.endsWith('/index.html') || urlPath.endsWith('/index') || urlPath.split('/').pop() === '';
  const isCategory = urlPath.includes('/category.html') || urlPath.endsWith('/category');
  const isProduct = urlPath.includes('/product.html') || urlPath.endsWith('/product');
  const isCart = urlPath.includes('/cart.html') || urlPath.endsWith('/cart');

  // ── Always update cart badge ──
  if (typeof updateCartBadge === 'function') {
    updateCartBadge();
  }

  // ── INDEX / HOME ──
  if (isHome) {
    initHomePage();
  }

  // ── CATEGORY PAGE ──
  if (isCategory) {
    initCategoryPage();
  }

  // ── PRODUCT PAGE ──
  if (isProduct) {
    initProductPage();
  }

  // ── CART PAGE ──
  if (isCart) {
    if (typeof renderCart === 'function') {
      renderCart();
    }
  }

  // ── SEARCH (all pages) ──
  initSearch();
});

// ────────────────────────────────────────────────────────────
// 5a. HOME PAGE
// ────────────────────────────────────────────────────────────

function initHomePage() {
  const trendingContainer = document.getElementById('trendingProducts');
  const newArrivalsContainer = document.getElementById('newArrivals');

  if (trendingContainer) {
    const trending = getTrendingProducts();
    trendingContainer.innerHTML = trending.map(renderProductCard).join('');
  }

  if (newArrivalsContainer) {
    const arrivals = getNewArrivals();
    newArrivalsContainer.innerHTML = arrivals.map(renderProductCard).join('');
  }
}

// ────────────────────────────────────────────────────────────
// 5b. CATEGORY PAGE
// ────────────────────────────────────────────────────────────

/** Current state for category page (kept in closure-like globals) */
let _catCurrentProducts = [];
let _catCurrentSort = 'popularity';
let _catCurrentFilters = {};

function initCategoryPage() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('cat') || '';
  const container = document.getElementById('categoryProducts');
  const titleEl = document.getElementById('categoryTitle');
  const breadcrumbEl = document.getElementById('categoryBreadcrumb');
  const countEl = document.getElementById('productCount');
  const sortSelect = document.getElementById('sortSelect');

  // Pretty name map
  const categoryNames = {
    rings: 'Rings',
    necklaces: 'Necklaces',
    earrings: 'Earrings',
    bracelets: 'Bracelets',
    gifts: 'Gifts & Sets',
    '': 'All Products'
  };

  const prettyName = categoryNames[category] || 'All Products';
  if (titleEl) titleEl.textContent = prettyName;
  if (breadcrumbEl) breadcrumbEl.textContent = prettyName;
  document.title = `${prettyName} — Rosevow Premium Jewellery`;

  // Set category hero background image dynamically
  const heroEl = document.getElementById('categoryHero');
  if (heroEl) {
    const categoryImages = {
      rings: 'images/ring.png',
      necklaces: 'images/necklace.png',
      earrings: 'images/earrings.png',
      bracelets: 'images/bracelet.png',
      gifts: 'images/gifts.png',
      '': 'images/hero1.png'
    };
    const bgImg = categoryImages[category] || categoryImages[''];
    heroEl.style.backgroundImage = `url('${bgImg}')`;
  }

  // Load products
  _catCurrentProducts = category
    ? getProductsByCategory(category)
    : [...window.ROSEVOW_PRODUCTS];

  applyFilters(); // Parse default checked states (like In Stock)
  renderCategoryProducts(container, countEl);

  // Sort handler
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      _catCurrentSort = sortSelect.value;
      renderCategoryProducts(container, countEl);
    });
  }

  // Filter checkboxes (price ranges, features, etc.)
  document.querySelectorAll('.filter-checkbox input').forEach((input) => {
    input.addEventListener('change', () => {
      applyFilters();
      renderCategoryProducts(container, countEl);
    });
  });
}

function applyFilters() {
  const checked = document.querySelectorAll('.filter-checkbox input:checked');
  _catCurrentFilters = {};
  checked.forEach((cb) => {
    const group = cb.name; // e.g. "price", "material", "availability", "rating"
    const value = cb.value; // e.g. "rose-gold", "0-500"
    if (!_catCurrentFilters[group]) _catCurrentFilters[group] = [];
    _catCurrentFilters[group].push(value);
  });
}

function renderCategoryProducts(container, countEl) {
  if (!container) return;

  let products = [..._catCurrentProducts];

  // Apply price filter
  if (_catCurrentFilters.price && _catCurrentFilters.price.length) {
    products = products.filter((p) => {
      return _catCurrentFilters.price.some((range) => {
        let min, max;
        if (range.includes('-')) {
          [min, max] = range.split('-').map(Number);
        } else if (range.includes('+')) {
          min = parseInt(range, 10);
        }
        if (max) return p.price >= min && p.price <= max;
        return p.price >= min;
      });
    });
  }

  // Apply material filter
  if (_catCurrentFilters.material && _catCurrentFilters.material.length) {
    products = products.filter((p) =>
      _catCurrentFilters.material.some((m) =>
        p.material.toLowerCase().includes(m.toLowerCase())
      )
    );
  }

  // Apply availability filter
  if (_catCurrentFilters.availability && _catCurrentFilters.availability.length) {
    if (_catCurrentFilters.availability.includes('in-stock') && !_catCurrentFilters.availability.includes('all')) {
      products = products.filter((p) => p.inStock);
    }
  }

  // Apply rating filter
  if (_catCurrentFilters.rating && _catCurrentFilters.rating.length) {
    const minRating = Math.min(..._catCurrentFilters.rating.map(Number));
    products = products.filter((p) => p.rating >= minRating);
  }

  // Sort
  products = sortProducts(products, _catCurrentSort);

  if (countEl) countEl.textContent = products.length;

  if (products.length === 0) {
    container.innerHTML =
      '<div class="no-products"><p>No products found matching your filters.</p></div>';
    return;
  }

  container.innerHTML = products.map(renderProductCard).join('');
}

// ────────────────────────────────────────────────────────────
// 5c. PRODUCT PAGE
// ────────────────────────────────────────────────────────────

function initProductPage() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  const product = getProductById(productId);

  if (!product) {
    const main = document.querySelector('.product-detail') || document.querySelector('main');
    if (main) {
      main.innerHTML = `
        <div class="product-not-found">
          <h2>Product Not Found</h2>
          <p>Sorry, the product you're looking for doesn't exist or has been removed.</p>
          <a href="index.html" class="btn btn--primary">Back to Home</a>
        </div>`;
    }
    return;
  }

  // Update page title
  document.title = `${product.name} — Rosevow Premium Jewellery`;

  // Populate detail elements
  setTextIfExists('productName', product.name);
  setTextIfExists('productBrand', 'ROSEVOW');
  setHtmlIfExists('productPrice', formatPrice(product.price));
  setHtmlIfExists(
    'productOriginalPrice',
    formatPrice(product.originalPrice)
  );
  setHtmlIfExists('productDiscount', `${product.discount}% off`);
  setHtmlIfExists('productDescription', product.description);
  setTextIfExists('productMaterial', product.material);
  setHtmlIfExists('productRating', renderStars(product.rating));
  setTextIfExists('productReviewCount', `(${product.reviews} reviews)`);
  setTextIfExists('productRatingValue', product.rating);

  // Main image
  const mainImg = document.getElementById('productMainImage');
  if (mainImg) {
    mainImg.style.background = window.formatProductImageStyle(product.image);
  }

  // Badges
  const badgeWrap = document.getElementById('productBadges');
  if (badgeWrap) {
    let html = '';
    if (product.isNew) html += '<span class="badge badge--new">New Arrival</span>';
    if (product.isBestseller) html += '<span class="badge badge--bestseller">Bestseller</span>';
    if (product.discount > 0)
      html += `<span class="badge badge--sale">${product.discount}% OFF</span>`;
    badgeWrap.innerHTML = html;
  }

  // Features
  const featList = document.getElementById('productFeatures');
  if (featList) {
    featList.innerHTML = product.features
      .map(
        (f) =>
          `<li class="product-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary, #E85D75)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> ${f}</li>`
      )
      .join('');
  }

  // Sizes
  const sizeWrap = document.getElementById('productSizes');
  if (sizeWrap) {
    if (product.sizes && product.sizes.length > 0) {
      sizeWrap.innerHTML = product.sizes
        .map(
          (s) =>
            `<button class="size-option" data-size="${s}">${s}</button>`
        )
        .join('');
      sizeWrap.closest('.product-detail__sizes')?.classList.remove('hidden');
    } else {
      const sizeSection = sizeWrap.closest('.product-detail__sizes');
      if (sizeSection) sizeSection.classList.add('hidden');
    }
  }

  // Tabs content
  setHtmlIfExists(
    'tabDescription',
    `<p>${product.description}</p>
     <ul class="tab-features">${product.features.map((f) => `<li>${f}</li>`).join('')}</ul>`
  );
  setHtmlIfExists(
    'tabDetails',
    `<table class="details-table">
      <tr><th>Material</th><td>${product.material}</td></tr>
      <tr><th>Category</th><td>${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</td></tr>
      <tr><th>Rating</th><td>${product.rating} / 5 (${product.reviews} reviews)</td></tr>
      <tr><th>Availability</th><td>${product.inStock ? 'In Stock' : 'Out of Stock'}</td></tr>
      ${product.sizes.length ? `<tr><th>Available Sizes</th><td>${product.sizes.join(', ')}</td></tr>` : ''}
    </table>`
  );
  setHtmlIfExists(
    'tabShipping',
    `<div class="shipping-info">
      <p><strong>Free Shipping</strong> on orders above ₹999</p>
      <p>Standard delivery: 5-7 business days</p>
      <p>Express delivery: 2-3 business days (additional charges apply)</p>
      <p>We ship across India. Cash on Delivery available on select pin codes.</p>
    </div>`
  );

  // Buy-now & add-to-cart buttons — store product ID for handlers
  const addBtn = document.getElementById('addToCartBtn');
  if (addBtn) addBtn.dataset.id = product.id;

  const buyWABtn = document.getElementById('buyNowWhatsApp');
  if (buyWABtn) buyWABtn.dataset.id = product.id;

  const buyEmailBtn = document.getElementById('buyNowEmail');
  if (buyEmailBtn) buyEmailBtn.dataset.id = product.id;

  // Wishlist button on product page
  const wishBtn = document.getElementById('productWishlistBtn');
  if (wishBtn) {
    wishBtn.dataset.id = product.id;
    if (isInWishlist(product.id)) wishBtn.classList.add('active');
  }

  // Related products
  const relatedContainer = document.getElementById('relatedProducts');
  if (relatedContainer) {
    const related = getProductsByCategory(product.category)
      .filter((p) => p.id !== product.id)
      .slice(0, 4);
    relatedContainer.innerHTML = related.map(renderProductCard).join('');
  }

  // Dynamic JSON-LD SEO Schema
  const schemaId = 'productSeoSchema';
  let schemaScript = document.getElementById(schemaId);
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = schemaId;
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }
  const cleanImgUrl = product.image.includes("url('") 
    ? product.image.replace(/url\('([^']+)'\).*/, '$1') 
    : product.image;
  const schemaObj = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": [
      window.location.origin + '/' + cleanImgUrl
    ],
    "description": product.description,
    "sku": `RV-PROD-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": "Rosevow"
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "INR",
      "price": product.price,
      "priceValidUntil": "2028-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviews
    }
  };
  schemaScript.textContent = JSON.stringify(schemaObj);

  // Free size label box for Rings
  const actionsContainer = document.querySelector('.product-actions');
  if (actionsContainer) {
    const existingNote = document.getElementById('freeSizeNote');
    if (existingNote) existingNote.remove();

    if (product.category === 'rings') {
      const freeSizeNote = document.createElement('div');
      freeSizeNote.id = 'freeSizeNote';
      freeSizeNote.style.marginTop = '16px';
      freeSizeNote.style.padding = '10px 14px';
      freeSizeNote.style.background = 'var(--color-neutral, #FFF8F5)';
      freeSizeNote.style.border = '1px dashed var(--color-accent, #C9A227)';
      freeSizeNote.style.borderRadius = 'var(--radius-sm, 4px)';
      freeSizeNote.style.fontSize = '0.85rem';
      freeSizeNote.style.color = 'var(--color-secondary, #6D214F)';
      freeSizeNote.style.fontWeight = '500';
      freeSizeNote.style.textAlign = 'center';
      freeSizeNote.innerHTML = '✨ <strong>Free Size (adjustable)</strong> option available. Select a size above or specify at checkout.';
      actionsContainer.appendChild(freeSizeNote);
    }
  }
}

/** Tiny DOM helpers for product page population */
function setTextIfExists(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
function setHtmlIfExists(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

// ────────────────────────────────────────────────────────────
// 6. SEARCH FUNCTIONALITY
// ────────────────────────────────────────────────────────────

function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  if (!searchInput || !searchResults) return;

  let debounceTimer = null;

  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = searchInput.value.trim();
      if (query.length < 2) {
        searchResults.innerHTML = '';
        searchResults.classList.remove('active');
        return;
      }

      const results = searchProducts(query);
      if (results.length === 0) {
        searchResults.innerHTML =
          '<div class="search-result__empty">No products found</div>';
        searchResults.classList.add('active');
        return;
      }

      searchResults.innerHTML = results
        .slice(0, 8) // cap visible results
        .map(
          (p) => `
          <a class="search-result__item" href="product.html?id=${p.id}">
            <div class="search-result__image" style="background:${p.image}"></div>
            <div class="search-result__info">
              <span class="search-result__name">${p.name}</span>
              <span class="search-result__price">${formatPrice(p.price)}</span>
            </div>
          </a>`
        )
        .join('');
      searchResults.classList.add('active');
    }, 300);
  });

  // Close results when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper') && !e.target.closest('#searchOverlay')) {
      searchResults.classList.remove('active');
    }
  });
}
