document.getElementById('year').textContent = new Date().getFullYear();

/* ── Mobile nav ───────────────────────────────────────────────── */
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav  = document.querySelector('.mobile-nav');
function setMenu(open) {
  document.body.classList.toggle('menu-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileNav.inert = !open;
}
menuToggle.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

/* ── GSAP detection ───────────────────────────────────────────── */
// typeof never throws, even for undeclared identifiers
const _gsap = typeof gsap !== 'undefined' ? gsap : null;
const _ST   = typeof ScrollTrigger !== 'undefined' ? ScrollTrigger : null;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const arrivedViaTransition = sessionStorage.getItem('noir-page-transition') === '1';
if (arrivedViaTransition) {
  sessionStorage.removeItem('noir-page-transition');
  const intro = document.querySelector('.intro');
  if (intro) intro.remove();
}

// Debug — open the browser console (F12) to read these
console.log('[Noir] gsap available:', !!_gsap, '| ScrollTrigger available:', !!_ST);
console.log('[Noir] prefers-reduced-motion:', prefersReducedMotion);

/* ── Safety fallback ──────────────────────────────────────────── */
// If GSAP never fires, remove the intro overlay after 4 s
const introFallback = setTimeout(() => {
  const el = document.querySelector('.intro');
  if (el) {
    el.style.transition = 'opacity .4s';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 420);
    console.warn('[Noir] Intro fallback fired — GSAP may not have loaded.');
  }
}, 4000);

/* ── Animations ───────────────────────────────────────────────── */
if (_gsap && _ST) {
  _gsap.registerPlugin(_ST);
  clearTimeout(introFallback);

  // ── Intro sequence / returning page reveal ─────────────────
  if (arrivedViaTransition) {
    _gsap.set('.page-transition', { autoAlpha: 1, yPercent: 0 });
    _gsap.timeline({ defaults: { ease: 'power4.inOut' } })
      .to('.page-transition', { yPercent: -100, duration: 1.05, onComplete: () => _gsap.set('.page-transition', { autoAlpha: 0 }) })
      .from('.site-header', { y: -25, opacity: 0, duration: .7 }, '-=.62')
      .from('.hero-line > span', { yPercent: 105, duration: .9, stagger: .1 }, '-=.55');
  } else {
    const introTl = _gsap.timeline({ defaults: { ease: 'power3.out' } });
    introTl
      .from('.intro-mark',    { y: 80, opacity: 0, duration: .85 })
      .to('.intro-line',      { width: 90, duration: .55 }, '-=.3')
      .from('.intro-caption', { y: 12, opacity: 0, duration: .5 }, '-=.25')
      .to('.intro-inner',     { y: -32, opacity: 0, duration: .55, ease: 'power2.in' }, '+=.35')
      .to('.intro',           { yPercent: -100, duration: .9, ease: 'power4.inOut' }, '-=.1')
      .from('.site-header',   { y: -30, opacity: 0, duration: .75 }, '-=.45')
      .from('.hero-eyebrow',  { y: 22, opacity: 0, duration: .65 }, '-=.45')
      .from('.hero-line > span', { yPercent: 105, duration: 1.1, stagger: .12, ease: 'power4.out' }, '-=.4')
      .from('.hero-bottom',   { y: 25, opacity: 0, duration: .7 }, '-=.55');
  }

  // ── Scroll animations (skip if user prefers reduced motion) ──
  if (!prefersReducedMotion) {
    _gsap.to('.hero-image', {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    _gsap.to('.space-image', {
      yPercent: 10, ease: 'none',
      scrollTrigger: { trigger: '.space-section', start: 'top bottom', end: 'bottom top', scrub: true }
    });
    _gsap.to('.ritual-texture', {
      scale: 1.1, yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: '.ritual-section', start: 'top bottom', end: 'bottom top', scrub: true }
    });
    _gsap.utils.toArray('.reveal').forEach(el =>
      _gsap.from(el, { y: 70, opacity: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%', once: true } })
    );
    _gsap.utils.toArray('.reveal-image').forEach(el =>
      _gsap.from(el, { y: 70, opacity: 0, duration: 1.15, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
    );
    _gsap.to('.scroll-line', {
      width: '100%', ease: 'none',
      scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: .3 }
    });
  }

} else {
  // GSAP not available — log what's missing and remove intro immediately
  if (!_gsap) console.warn('[Noir] gsap.min.js did not load or did not execute.');
  if (!_ST)   console.warn('[Noir] ScrollTrigger.min.js did not load or did not execute.');
  const el = document.querySelector('.intro');
  if (el) el.remove();
}

/* ── Animated navigation to menu stories ────────────────────── */
document.querySelectorAll('.page-link').forEach(link => {
  link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const destination = link.href;
    const overlay = document.querySelector('.page-transition');
    const name = overlay && overlay.querySelector('.transition-name');
    if (name) name.textContent = link.dataset.transitionName || 'THE EVERYDAY EDIT';
    sessionStorage.setItem('noir-page-transition', '1');
    if (_gsap && overlay && !prefersReducedMotion) {
      _gsap.set(overlay, { autoAlpha: 1, yPercent: 100 });
      _gsap.to(overlay, { yPercent: 0, duration: .9, ease: 'power4.inOut', onComplete: () => { window.location.href = destination; } });
    } else {
      window.location.href = destination;
    }
  });
});
