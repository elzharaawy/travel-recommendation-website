/**
 * TravelVista - Main JavaScript
 * Handles: mobile nav, search, active nav links, scroll effects
 */

/* ============================================================
   DATA - All destinations
   ============================================================ */
const destinations = [
  {
    id: 1,
    name: "Bali Beach, Indonesia",
    category: "beach",
    tag: "Beach",
    description: "Relax on the pristine beaches of Bali with crystal clear waters and lush tropical scenery.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80"
  },
  {
    id: 2,
    name: "Maldives",
    category: "beach",
    tag: "Beach",
    description: "Experience paradise on earth with stunning ocean views, overwater bungalows and white sand.",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80"
  },
  {
    id: 3,
    name: "Wat Phra Kaew, Thailand",
    category: "temple",
    tag: "Temple",
    description: "The Temple of the Emerald Buddha, Bangkok — Thailand's most sacred Buddhist shrine.",
    image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=600&q=80"
  },
  {
    id: 4,
    name: "Angkor Wat, Cambodia",
    category: "temple",
    tag: "Temple",
    description: "The magnificent temple complex and UNESCO World Heritage Site, the world's largest religious monument.",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 5,
    name: "Switzerland",
    category: "country",
    tag: "Country",
    description: "Explore breathtaking Alpine landscapes, charming cities, and world-class cuisine.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"
  },
  {
    id: 6,
    name: "Japan",
    category: "country",
    tag: "Country",
    description: "A perfect blend of ancient tradition, vibrant culture, and cutting-edge modernity.",
    image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80"
  }
];

/* ============================================================
   MOBILE NAV TOGGLE
   ============================================================ */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });
}

/* ============================================================
   ACTIVE NAV LINK (highlight current page)
   ============================================================ */
function setActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ============================================================
   SEARCH FUNCTIONALITY
   ============================================================ */
function initSearch() {
  // Hero search
  const heroInput  = document.getElementById('heroSearch');
  const heroBtn    = document.getElementById('heroSearchBtn');
  // Navbar search
  const navInput   = document.getElementById('navSearch');
  const navBtn     = document.getElementById('navSearchBtn');

  const resultsSection = document.getElementById('searchResultsSection');
  const resultsTitle   = document.getElementById('searchResultsTitle');
  const resultsGrid    = document.getElementById('resultsGrid');

  function doSearch(query) {
    query = query.trim().toLowerCase();
    if (!query || !resultsSection) return;

    const matches = destinations.filter(d =>
      d.name.toLowerCase().includes(query) ||
      d.category.includes(query) ||
      d.tag.toLowerCase().includes(query) ||
      d.description.toLowerCase().includes(query)
    );

    resultsTitle.textContent = matches.length > 0
      ? `Search Results for "${query}" (${matches.length} found)`
      : `No results for "${query}"`;

    if (matches.length === 0) {
      resultsGrid.innerHTML = `<p class="no-results">Try searching for "beach", "temple", "country", or a destination name.</p>`;
    } else {
      resultsGrid.innerHTML = matches.map(d => `
        <div class="result-card fade-in">
          <img src="${d.image}" alt="${d.name}" loading="lazy">
          <div class="result-card-body">
            <div class="tag">${d.tag}</div>
            <h3>${d.name}</h3>
            <p>${d.description}</p>
          </div>
        </div>
      `).join('');
    }

    resultsSection.classList.add('visible');
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (heroBtn) heroBtn.addEventListener('click', () => doSearch(heroInput.value));
  if (heroInput) heroInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(heroInput.value); });

  if (navBtn) navBtn.addEventListener('click', () => doSearch(navInput.value));
  if (navInput) navInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(navInput.value); });

  // Sync inputs for UX
  if (heroInput && navInput) {
    heroInput.addEventListener('input', () => { navInput.value = heroInput.value; });
    navInput.addEventListener('input', () => { heroInput.value = navInput.value; });
  }
}

/* ============================================================
   CONTACT FORM VALIDATION
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  function validate(field, errorId, condition, msg) {
    const err = document.getElementById(errorId);
    if (condition) {
      field.classList.add('error');
      err.textContent = msg;
      err.classList.add('show');
      return false;
    } else {
      field.classList.remove('error');
      err.classList.remove('show');
      return true;
    }
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('fullName');
    const email   = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');

    const v1 = validate(name, 'nameErr', name.value.trim().length < 2, 'Please enter your full name.');
    const v2 = validate(email, 'emailErr', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value), 'Please enter a valid email address.');
    const v3 = validate(subject, 'subjectErr', subject.value === '', 'Please select a subject.');
    const v4 = validate(message, 'msgErr', message.value.trim().length < 10, 'Message must be at least 10 characters.');

    if (v1 && v2 && v3 && v4) {
      document.getElementById('successBanner').classList.add('show');
      form.reset();
      setTimeout(() => document.getElementById('successBanner').classList.remove('show'), 5000);
    }
  });

  // Live validation on blur
  ['fullName','email','message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('blur', () => el.dispatchEvent(new Event('input')));
  });
}

/* ============================================================
   SCROLL ANIMATIONS (simple Intersection Observer)
   ============================================================ */
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.dest-card, .mission-card, .team-card, .result-card, .contact-info-card').forEach(el => {
    obs.observe(el);
  });
}

/* ============================================================
   COUNTER ANIMATION (About page stats)
   ============================================================ */
function animateCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString() + suffix;
      if (current >= target) clearInterval(timer);
    }, 25);
  });
}

function initCounters() {
  const statsBar = document.querySelector('.stats-bar');
  if (!statsBar) return;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCounters();
      obs.disconnect();
    }
  }, { threshold: 0.5 });
  obs.observe(statsBar);
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  setActiveNavLink();
  initSearch();
  initContactForm();
  initScrollAnimations();
  initCounters();
});