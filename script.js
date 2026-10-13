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
if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
  gsap.registerPlugin(ScrollTrigger);
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro.from('.intro-mark', { y: 80, opacity: 0, duration: .85 })
    .to('.intro-line', { width: 90, duration: .55 }, '-=.3')
    .from('.intro-caption', { y: 12, opacity: 0, duration: .5 }, '-=.25')
    .to('.intro-inner', { y: -32, opacity: 0, duration: .55, ease: 'power2.in' }, '+=.35')
    .to('.intro', { yPercent: -100, duration: .9, ease: 'power4.inOut' }, '-=.1')
    .from('.site-header', { y: -30, opacity: 0, duration: .75 }, '-=.45')
    .from('.hero-eyebrow', { y: 22, opacity: 0, duration: .65 }, '-=.45')
    .from('.hero-line > span', { yPercent: 105, duration: 1.1, stagger: .12, ease: 'power4.out' }, '-=.4')
    .from('.hero-bottom', { y: 25, opacity: 0, duration: .7 }, '-=.55');

  gsap.to('.hero-image', { scale: 1, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.space-image', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.space-section', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.utils.toArray('.reveal').forEach(el => gsap.from(el, { y: 70, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%', once: true } }));
  gsap.utils.toArray('.reveal-image').forEach(el => gsap.from(el, { y: 70, opacity: 0, duration: 1.15, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
  gsap.to('.scroll-line', { width: '100%', ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: .3 } });
} else {
  document.querySelector('.intro').remove();
}
