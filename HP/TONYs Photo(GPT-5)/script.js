// TONY's Photo - Scripts

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile nav toggle
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
if (nav && navToggle) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
  // Close nav on link click (mobile)
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
}

// Smooth scroll for in-page links
const internalLinks = document.querySelectorAll('a[href^="#"]');
internalLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
    }
  });
});

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section, .card, .gallery-item, .about-photo img, .about-text, .price-card').forEach(el => {
  el.classList.add('reveal');
  io.observe(el);
});

// Lightbox for gallery
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
if (lightbox && lightboxImg) {
  document.getElementById('gallery')?.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.tagName === 'IMG') {
      lightboxImg.src = target.src;
      lightbox.classList.add('show');
      lightbox.setAttribute('aria-hidden', 'false');
    }
  });
  const close = () => {
    lightbox.classList.remove('show');
    lightbox.setAttribute('aria-hidden', 'true');
  };
  lightboxClose?.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

// Contact form basic validation
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (!data.name || !data.email || !data.type) {
      setNote('必須項目を入力してください。', true);
      return;
    }
    // Simulate async submit
    setNote('送信中...', false);
    await new Promise(r => setTimeout(r, 700));
    setNote('送信が完了しました。折り返しご連絡いたします。', false);
    form.reset();
  });
}

function setNote(msg, isError) {
  if (!formNote) return;
  formNote.textContent = msg;
  formNote.style.color = isError ? '#b91c1c' : '#6b7280';
}
