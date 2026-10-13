if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

const gsapReady = typeof gsap !== 'undefined';
const triggerReady = typeof ScrollTrigger !== 'undefined';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

if (gsapReady && triggerReady) {
  gsap.registerPlugin(ScrollTrigger);
  if (!reduceMotion) {
    const entrance = gsap.timeline({ defaults: { ease: 'power4.inOut' } });
    entrance.to('.page-transition', { yPercent: -100, duration: 1.05, onComplete: () => gsap.set('.page-transition', { autoAlpha: 0 }) })
      .from('.detail-header', { y: -30, opacity: 0, duration: .7 }, '-=.6')
      .from('.title-line span', { yPercent: 110, duration: 1, stagger: .1 }, '-=.55')
      .from('.detail-deck, .detail-meta', { y: 30, opacity: 0, duration: .75, stagger: .08, ease: 'power3.out' }, '-=.55')
      .from('.detail-number', { xPercent: 20, opacity: 0, duration: 1 }, '-=.85');
    gsap.to('.detail-image', { scale: 1, yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.detail-hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.utils.toArray('.reveal').forEach(el => gsap.from(el, { y: 65, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 84%', once: true } }));
  } else {
    document.querySelector('.page-transition')?.remove();
  }
} else {
  document.querySelector('.page-transition')?.remove();
  console.warn('[Noir] GSAP or ScrollTrigger is unavailable on this page.');
}

document.querySelectorAll('.detail-link').forEach(link => {
  link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const destination = link.href;
    const overlay = document.querySelector('.page-transition');
    const name = overlay?.querySelector('.transition-name');
    if (name) name.textContent = link.dataset.transitionName || 'NOIR CAFÉ';
    sessionStorage.setItem('noir-page-transition', '1');
    if (gsapReady && overlay && !reduceMotion) {
      gsap.set(overlay, { autoAlpha: 1, yPercent: 100 });
      gsap.to(overlay, { yPercent: 0, duration: .9, ease: 'power4.inOut', onComplete: () => { window.location.href = destination; } });
    } else {
      window.location.href = destination;
    }
  });
});
