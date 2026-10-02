'use strict';

document.getElementById('ano').textContent = new Date().getFullYear();

// A navegação permanece acessível mesmo quando JavaScript está desativado.
const menuButton = document.querySelector('.menu-button');
const menu = document.getElementById('menu');
const mobile = window.matchMedia('(max-width: 860px)');

function setMenu(open) {
  menu.classList.toggle('is-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  menuButton.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
}

function updateMenuLayout() {
  menuButton.hidden = !mobile.matches;
  setMenu(false);
}

menuButton.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});
menu.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});
updateMenuLayout();
document.documentElement.classList.add('menu-enhanced');
mobile.addEventListener('change', updateMenuLayout);

// Dialog nativo: foco contido, fechamento com Esc e retorno à imagem acionada.
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxTitle = document.getElementById('lightbox-title');
let lastCatalogLink = null;

if (typeof lightbox.showModal === 'function') {
  document.querySelectorAll('.catalog-open').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      const thumbnail = link.querySelector('img');
      lastCatalogLink = link;
      lightboxImage.src = thumbnail.src;
      lightboxImage.alt = thumbnail.alt;
      lightboxTitle.textContent = link.dataset.caption;
      lightbox.showModal();
      document.body.classList.add('modal-open');
    });
  });
  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => {
    if (event.target !== lightbox) return;
    const bounds = lightbox.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) lightbox.close();
  });
  lightbox.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (lastCatalogLink) lastCatalogLink.focus({ preventScroll: true });
  });
}

// Entrada curta de 8px, uma vez por bloco. Sem esconder a primeira tela.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealElements = document.querySelectorAll('[data-reveal]');
let observer;

function showEverything() {
  if (observer) observer.disconnect();
  revealElements.forEach(element => {
    element.classList.remove('reveal-pending', 'reveal-ready');
    element.classList.add('reveal-visible');
  });
}

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealElements.forEach(element => {
    if (element.getBoundingClientRect().top < window.innerHeight) return;
    element.classList.add('reveal-pending');
    requestAnimationFrame(() => {
      element.classList.add('reveal-ready');
      observer.observe(element);
    });
  });
}
reducedMotion.addEventListener('change', showEverything);
// Navegação por teclado dispensa animações e deixa o próximo destino visível.
document.addEventListener('keydown', event => {
  if (event.key === 'Tab') showEverything();
});
window.addEventListener('beforeprint', showEverything);
