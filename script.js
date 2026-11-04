/*
 * Victor William — Personal Trainer
 * JS puro: menu mobile, revelação ao rolar, barra de progresso
 * e destaque do link ativo no menu — tudo respeitando
 * prefers-reduced-motion.
 */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // --- MENU MOBILE ---
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  const desktopWidth = window.matchMedia('(min-width: 761px)');

  if (menuButton && mobileNav) {
    const setMenuOpen = (open) => {
      mobileNav.hidden = !open;
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };

    menuButton.addEventListener('click', () => setMenuOpen(mobileNav.hidden));

    mobileNav.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenuOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !mobileNav.hidden) setMenuOpen(false);
    });

    desktopWidth.addEventListener('change', (event) => {
      if (event.matches) setMenuOpen(false);
    });
  }

  // --- BARRA DE PROGRESSO DE LEITURA ---
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = percent + '%';
    };
    updateProgress();
    window.addEventListener('scroll', () => window.requestAnimationFrame(updateProgress), { passive: true });
    window.addEventListener('resize', updateProgress);
  }

  // --- DESTAQUE DO LINK ATIVO NO MENU ---
  if ('IntersectionObserver' in window) {
    const navLinks = [...document.querySelectorAll('.desktop-nav a')];
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (!visible) return;
      navLinks.forEach((link) => {
        if (link.hash === '#' + visible.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

    navLinks.forEach((link) => {
      const section = document.querySelector(link.hash);
      if (section) sectionObserver.observe(section);
    });
  }

  // --- ANIMAÇÃO REVEAL ON SCROLL ---
  document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal');

    // Sem suporte a IntersectionObserver ou com movimento reduzido:
    // mostra tudo de uma vez, sem animar.
    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      revealElements.forEach((el) => el.classList.add('visible'));
      return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Anima uma vez só; depois para de observar (menos trabalho pro navegador).
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.15,
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  });
})();
