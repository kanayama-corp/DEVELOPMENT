/* =========================================================
   株式会社カナヤマ — Monochrome Minimal
   ========================================================= */

(() => {
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const heroBgType = document.querySelector('.hero-bg-type');

    // --- Smooth scroll for in-page anchors ---
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#' || anchor.getAttribute('target') === '_blank') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const headerOffset = 72;
            const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            window.scrollTo({ top, behavior: 'smooth' });

            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle && navToggle.classList.remove('active');
            }
        });
    });

    // --- Header scrolled state + hero parallax ---
    let ticking = false;
    const onScroll = () => {
        const y = window.scrollY;
        if (header) header.classList.toggle('scrolled', y > 40);
        if (heroBgType && y < window.innerHeight) {
            heroBgType.style.transform = `translate(-50%, calc(-50% + ${y * 0.18}px))`;
        }
        ticking = false;
    };
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });
    onScroll();

    // --- Mobile nav toggle ---
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // --- Intersection observer scroll reveal ---
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && reveals.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || Math.min(i * 40, 240);
                    setTimeout(() => entry.target.classList.add('is-visible'), Number(delay));
                    io.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });
        reveals.forEach((el) => io.observe(el));
    } else {
        reveals.forEach((el) => el.classList.add('is-visible'));
    }

    // --- Hero initial stagger ---
    window.addEventListener('load', () => {
        const heroReveals = document.querySelectorAll('.hero .reveal');
        heroReveals.forEach((el, i) => {
            setTimeout(() => el.classList.add('is-visible'), 80 + i * 120);
        });
    });
})();
