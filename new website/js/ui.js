/* ============================================================
   ROSEVOW — ui.js
   UI interactions, animations, and page behaviour
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initSearchOverlay();
  initHeroCarousel();
  initScrollAnimations();
  initProductGallery();
  initProductTabs();
  initSizeSelector();
  initProductQuantity();
  initWishlist();
  initNewsletterForm();
  initContactForm();
  initFaqAccordion();
  initFilterSidebar();
  initSmoothScroll();
  initBackToTop();
  initPageLoad();
  updateWishlistBadge();
});

// ────────────────────────────────────────────────────────────
// 1. STICKY HEADER
// ────────────────────────────────────────────────────────────

function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
          header.classList.add('header--scrolled');
        } else {
          header.classList.remove('header--scrolled');
        }
        // Optional: hide header on scroll-down, show on scroll-up
        if (scrollY > lastScroll && scrollY > 200) {
          header.classList.add('header--hidden');
        } else {
          header.classList.remove('header--hidden');
        }
        lastScroll = scrollY;
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ────────────────────────────────────────────────────────────
// 2. MOBILE MENU
// ────────────────────────────────────────────────────────────

function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const overlay = document.getElementById('navOverlay');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('active');
    toggle.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
    document.body.classList.toggle('menu-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close on overlay click
  if (overlay) {
    overlay.addEventListener('click', closeMobileMenu);
  }

  // Close on nav link click
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  function closeMobileMenu() {
    nav.classList.remove('active');
    toggle.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
}

// ────────────────────────────────────────────────────────────
// 3. SEARCH OVERLAY
// ────────────────────────────────────────────────────────────

function initSearchOverlay() {
  const searchToggle = document.getElementById('searchToggle');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');

  if (!searchToggle || !searchOverlay) return;

  searchToggle.addEventListener('click', (e) => {
    e.preventDefault();
    searchOverlay.classList.add('active');
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 200);
    }
  });

  if (searchClose) {
    searchClose.addEventListener('click', () => {
      closeSearch();
    });
  }

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
      closeSearch();
    }
  });

  // Close on overlay background click
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
      closeSearch();
    }
  });

  function closeSearch() {
    searchOverlay.classList.remove('active');
    const searchResults = document.getElementById('searchResults');
    if (searchResults) searchResults.classList.remove('active');
    if (searchInput) searchInput.value = '';
  }
}

// ────────────────────────────────────────────────────────────
// 4. HERO CAROUSEL
// ────────────────────────────────────────────────────────────

function initHeroCarousel() {
  const carousel = document.querySelector('.hero-carousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.hero-slide');
  const dotsContainer = carousel.querySelector('.hero-dots');
  if (slides.length === 0) return;

  let currentIndex = 0;
  let autoPlayTimer = null;
  const INTERVAL = 5000;

  // Build dots
  if (dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `hero-dot${i === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(index) {
    slides[currentIndex].classList.remove('active');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.hero-dot') : [];
    if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

    currentIndex = index;

    slides[currentIndex].classList.add('active');
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');
  }

  function nextSlide() {
    goToSlide((currentIndex + 1) % slides.length);
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(nextSlide, INTERVAL);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  // Pause on hover
  carousel.addEventListener('mouseenter', stopAutoPlay);
  carousel.addEventListener('mouseleave', startAutoPlay);

  // Touch support
  let touchStartX = 0;
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff < 0) {
        goToSlide((currentIndex + 1) % slides.length);
      } else {
        goToSlide((currentIndex - 1 + slides.length) % slides.length);
      }
    }
    startAutoPlay();
  }, { passive: true });

  // Start
  startAutoPlay();
}

// ────────────────────────────────────────────────────────────
// 5. SCROLL ANIMATIONS
// ────────────────────────────────────────────────────────────

function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  elements.forEach((el) => observer.observe(el));
}

// ────────────────────────────────────────────────────────────
// 6. PRODUCT IMAGE GALLERY
// ────────────────────────────────────────────────────────────

function initProductGallery() {
  const mainImage = document.getElementById('productMainImage');
  const thumbnails = document.querySelectorAll('.product-thumbnail');
  if (!mainImage || thumbnails.length === 0) return;

  thumbnails.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      // Update main image
      const bg = thumb.style.background || thumb.dataset.bg;
      if (bg) mainImage.style.background = bg;

      // Toggle active class
      thumbnails.forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  // Zoom on hover
  mainImage.addEventListener('mousemove', (e) => {
    const rect = mainImage.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    mainImage.style.transformOrigin = `${x}% ${y}%`;
    mainImage.style.transform = 'scale(1.5)';
  });

  mainImage.addEventListener('mouseleave', () => {
    mainImage.style.transform = 'scale(1)';
  });
}

// ────────────────────────────────────────────────────────────
// 7. PRODUCT TABS
// ────────────────────────────────────────────────────────────

function initProductTabs() {
  const tabButtons = document.querySelectorAll('.product-tab-btn');
  const tabPanes = document.querySelectorAll('.product-tab-pane');
  if (tabButtons.length === 0) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      // Deactivate all
      tabButtons.forEach((b) => b.classList.remove('active'));
      tabPanes.forEach((p) => p.classList.remove('active'));

      // Activate clicked
      btn.classList.add('active');
      const pane = document.getElementById(target);
      if (pane) pane.classList.add('active');
    });
  });
}

// ────────────────────────────────────────────────────────────
// 8. SIZE SELECTOR
// ────────────────────────────────────────────────────────────

function initSizeSelector() {
  const sizeContainer = document.getElementById('productSizes');
  if (!sizeContainer) return;

  sizeContainer.addEventListener('click', (e) => {
    const sizeBtn = e.target.closest('.size-option');
    if (!sizeBtn) return;

    // Toggle active
    sizeContainer.querySelectorAll('.size-option').forEach((s) => s.classList.remove('active'));
    sizeBtn.classList.add('active');
  });
}

// ────────────────────────────────────────────────────────────
// 9. PRODUCT QUANTITY
// ────────────────────────────────────────────────────────────

function initProductQuantity() {
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  const qtyDisplay = document.getElementById('productQuantity');

  if (!qtyMinus || !qtyPlus || !qtyDisplay) return;

  qtyMinus.addEventListener('click', () => {
    let qty = parseInt(qtyDisplay.textContent, 10) || 1;
    qty = Math.max(1, qty - 1);
    qtyDisplay.textContent = qty;
  });

  qtyPlus.addEventListener('click', () => {
    let qty = parseInt(qtyDisplay.textContent, 10) || 1;
    qty = Math.min(10, qty + 1);
    qtyDisplay.textContent = qty;
  });
}

// ────────────────────────────────────────────────────────────
// 10. WISHLIST
// ────────────────────────────────────────────────────────────

function initWishlist() {
  document.addEventListener('click', (e) => {
    const wishBtn =
      e.target.closest('.product-card__wishlist-btn') ||
      e.target.closest('#productWishlistBtn');
    if (!wishBtn) return;

    e.preventDefault();
    e.stopPropagation();

    const productId = Number(wishBtn.dataset.id);
    if (!productId) return;

    let wishlist = [];
    try {
      wishlist = JSON.parse(localStorage.getItem('rosevow_wishlist')) || [];
    } catch {
      wishlist = [];
    }

    const index = wishlist.indexOf(productId);
    const svg = wishBtn.querySelector('svg');

    if (index > -1) {
      // Remove from wishlist
      wishlist.splice(index, 1);
      if (svg) {
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
      }
      wishBtn.classList.remove('active');
      if (typeof showToast === 'function') showToast('Removed from wishlist', 'info');
    } else {
      // Add to wishlist
      wishlist.push(productId);
      if (svg) {
        svg.setAttribute('fill', 'var(--color-primary, #E85D75)');
        svg.setAttribute('stroke', 'var(--color-primary, #E85D75)');
      }
      wishBtn.classList.add('active');
      if (typeof showToast === 'function') showToast('Added to wishlist! ❤️', 'success');
    }

    try {
      localStorage.setItem('rosevow_wishlist', JSON.stringify(wishlist));
    } catch {
      // silently fail
    }
    updateWishlistBadge();
  });
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlistCount');
  if (!badge) return;
  try {
    const list = JSON.parse(localStorage.getItem('rosevow_wishlist')) || [];
    badge.textContent = list.length;
    badge.style.display = list.length > 0 ? 'flex' : 'none';
  } catch {
    badge.style.display = 'none';
  }
}
window.updateWishlistBadge = updateWishlistBadge;

// ────────────────────────────────────────────────────────────
// 11. NEWSLETTER FORM
// ────────────────────────────────────────────────────────────

function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (typeof showToast === 'function') {
      showToast('Thank you for subscribing! 💌', 'success');
    }
    form.reset();
  });
}

// ────────────────────────────────────────────────────────────
// 12. CONTACT FORM
// ────────────────────────────────────────────────────────────

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]')?.value || '';
    const email = form.querySelector('[name="email"]')?.value || '';
    const phone = form.querySelector('[name="phone"]')?.value || '';
    const subject = form.querySelector('[name="subject"]')?.value || '';
    const message = form.querySelector('[name="message"]')?.value || '';

    // Build WhatsApp message
    let waMessage = `📩 *Contact from Rosevow Website*\n\n`;
    waMessage += `👤 *Name:* ${name}\n`;
    if (email) waMessage += `📧 *Email:* ${email}\n`;
    if (phone) waMessage += `📱 *Phone:* ${phone}\n`;
    if (subject) waMessage += `📋 *Subject:* ${subject}\n`;
    waMessage += `\n💬 *Message:*\n${message}`;

    const url = `https://wa.me/916239493835?text=${encodeURIComponent(waMessage)}`;
    window.open(url, '_blank');

    if (typeof showToast === 'function') {
      showToast('Message sent! Redirecting to WhatsApp...', 'success');
    }
    form.reset();
  });
}

// ────────────────────────────────────────────────────────────
// 13. FAQ ACCORDION
// ────────────────────────────────────────────────────────────

function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all others (optional accordion behaviour)
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherAnswer) {
            otherAnswer.style.maxHeight = null;
          }
        }
      });

      // Toggle this one
      item.classList.toggle('active');
      if (!isOpen) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = null;
      }
    });
  });
}

// ────────────────────────────────────────────────────────────
// 14. FILTER SIDEBAR (Category page)
// ────────────────────────────────────────────────────────────

function initFilterSidebar() {
  const filterToggle = document.getElementById('filterToggle');
  const filterSidebar = document.getElementById('filterSidebar');
  const filterClose = document.getElementById('filterClose');

  if (!filterToggle || !filterSidebar) return;

  filterToggle.addEventListener('click', () => {
    filterSidebar.classList.toggle('active');
    document.body.classList.toggle('filter-open');
  });

  if (filterClose) {
    filterClose.addEventListener('click', () => {
      filterSidebar.classList.remove('active');
      document.body.classList.remove('filter-open');
    });
  }

  // Close on clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (
      filterSidebar.classList.contains('active') &&
      !filterSidebar.contains(e.target) &&
      !filterToggle.contains(e.target)
    ) {
      filterSidebar.classList.remove('active');
      document.body.classList.remove('filter-open');
    }
  });
}

// ────────────────────────────────────────────────────────────
// 15. SMOOTH SCROLL
// ────────────────────────────────────────────────────────────

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId.length <= 1) return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ────────────────────────────────────────────────────────────
// 16. BACK TO TOP
// ────────────────────────────────────────────────────────────

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ────────────────────────────────────────────────────────────
// 17. PAGE LOAD TRANSITION
// ────────────────────────────────────────────────────────────

function initPageLoad() {
  document.body.classList.add('loaded');
}
