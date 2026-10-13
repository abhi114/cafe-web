document.getElementById('year').textContent = new Date().getFullYear();

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
function setMenu(open) {
  document.body.classList.toggle('menu-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileNav.inert = !open;
}
menuToggle.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Safety fallback: if GSAP fails to load, remove the intro overlay after 4 seconds
// so it never blocks the page content.
const introFallbackTimer = setTimeout(() => {
  const intro = document.querySelector('.intro');
  if (intro && intro.parentNode) {
    intro.style.transition = 'opacity 0.4s ease';
    intro.style.opacity = '0';
    setTimeout(() => intro.remove(), 420);
    console.warn('[Noir Café] Intro fallback triggered — GSAP animation did not complete in time.');
  }
}, 4000);

// Detect GSAP globals — the CDN UMD build exposes `gsap` and `ScrollTrigger`
// as top-level globals, not necessarily as window.gsap / window.ScrollTrigger.
const _gsap = typeof gsap !== 'undefined' ? gsap : (typeof window.gsap !== 'undefined' ? window.gsap : null);
const _ST = typeof ScrollTrigger !== 'undefined' ? ScrollTrigger : (typeof window.ScrollTrigger !== 'undefined' ? window.ScrollTrigger : null);

if (_gsap && _ST && !prefersReducedMotion) {
  _gsap.registerPlugin(_ST);
  clearTimeout(introFallbackTimer); // Cancel the fallback; GSAP is running normally
  const intro = _gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro.from('.intro-mark', { y: 80, opacity: 0, duration: .85 })
    .to('.intro-line', { width: 90, duration: .55 }, '-=.3')
    .from('.intro-caption', { y: 12, opacity: 0, duration: .5 }, '-=.25')
    .to('.intro-inner', { y: -32, opacity: 0, duration: .55, ease: 'power2.in' }, '+=.35')
    .to('.intro', { yPercent: -100, duration: .9, ease: 'power4.inOut' }, '-=.1')
    .from('.site-header', { y: -30, opacity: 0, duration: .75 }, '-=.45')
    .from('.hero-eyebrow', { y: 22, opacity: 0, duration: .65 }, '-=.45')
    .from('.hero-line > span', { yPercent: 105, duration: 1.1, stagger: .12, ease: 'power4.out' }, '-=.4')
    .from('.hero-bottom', { y: 25, opacity: 0, duration: .7 }, '-=.55');

  _gsap.to('.hero-image', { scale: 1, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  _gsap.to('.space-image', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.space-section', start: 'top bottom', end: 'bottom top', scrub: true } });
  _gsap.utils.toArray('.reveal').forEach(el => _gsap.from(el, { y: 70, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%', once: true } }));
  _gsap.utils.toArray('.reveal-image').forEach(el => _gsap.from(el, { y: 70, opacity: 0, duration: 1.15, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
  _gsap.to('.scroll-line', { width: '100%', ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: .3 } });
} else {
  if (!_gsap) {
    console.warn('[Noir Café] GSAP did not load — animations are disabled. Check CDN/network connectivity.');
  } else if (!_ST) {
    console.warn('[Noir Café] ScrollTrigger did not load — scroll animations are disabled.');
  }
  const introEl = document.querySelector('.intro');
  if (introEl) introEl.remove();
}
