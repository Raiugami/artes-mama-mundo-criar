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
      stopPointerMotion();
      syncLogoShine();
    });
  });
  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => {
    if (event.target !== lightbox) return;
    const bounds = lightbox.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) lightbox.close();
  });
  lightbox.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('modal-open');
    if (lastCatalogLink) lastCatalogLink.focus({ preventScroll: true });
    syncLogoShine();
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

// Movimento opcional: muda imediatamente se a preferência do sistema mudar.
const progressBar = document.querySelector('.scroll-progress');
const header = document.querySelector('.site-header');
const motionToggles = document.querySelectorAll('.motion-toggle');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const brandScene = document.querySelector('.brand-scene');
const cursor = document.querySelector('.cursor');
let motionPaused = false;
let keyboardMode = false;
let pointerFrame = 0;
let pointerPositioned = false;
let mx = 0, my = 0, cx = 0, cy = 0;
let shineTimer = 0;
let shineDeadline = 0;
let shineRemaining = 8000;

function motionAllowed() {
  return !reducedMotion.matches && !motionPaused && !keyboardMode && !document.hidden && !document.body.classList.contains('modal-open');
}

function stopPointerMotion() {
  cancelAnimationFrame(pointerFrame);
  pointerFrame = 0;
  pointerPositioned = false;
  if (cursor) cursor.classList.remove('is-on', 'is-link');
}

// Uma passagem de luz, depois oito segundos de descanso. O tempo também pausa.
function syncLogoShine() {
  if (!brandScene) return;
  if (reducedMotion.matches) {
    clearTimeout(shineTimer);
    shineTimer = 0;
    shineRemaining = 8000;
    brandScene.classList.remove('shine-active');
    return;
  }
  const allowed = motionAllowed() && !brandScene.classList.contains('scene-idle');
  if (!allowed) {
    if (shineTimer) {
      clearTimeout(shineTimer);
      shineTimer = 0;
      shineRemaining = Math.max(0, shineDeadline - Date.now());
    }
    return;
  }
  if (shineTimer || brandScene.classList.contains('shine-active')) return;
  shineDeadline = Date.now() + shineRemaining;
  shineTimer = setTimeout(() => {
    shineTimer = 0;
    shineRemaining = 0;
    if (motionAllowed() && !brandScene.classList.contains('scene-idle')) brandScene.classList.add('shine-active');
  }, shineRemaining);
}

if (brandScene) brandScene.addEventListener('animationend', event => {
  if (event.animationName !== 'logo-text-shine') return;
  brandScene.classList.remove('shine-active');
  shineRemaining = 8000;
  syncLogoShine();
});

function syncMotionPreference() {
  document.body.classList.toggle('motion-enabled', !reducedMotion.matches);
  document.body.classList.toggle('motion-paused', motionPaused);
  document.body.classList.toggle('page-idle', document.hidden);
  motionToggles.forEach(toggle => {
    toggle.hidden = reducedMotion.matches;
    toggle.textContent = motionPaused ? 'Retomar' : 'Pausar';
    toggle.setAttribute('aria-label', motionPaused ? 'Retomar animações da página' : 'Pausar animações da página');
  });
  if (!motionAllowed() || !finePointer.matches) stopPointerMotion();
  if (!motionAllowed()) {
    header.classList.remove('is-hidden');
    showEverything();
  }
  syncLogoShine();
}

motionToggles.forEach(toggle => toggle.addEventListener('click', () => {
  motionPaused = !motionPaused;
  syncMotionPreference();
}));
reducedMotion.addEventListener('change', syncMotionPreference);
finePointer.addEventListener('change', syncMotionPreference);
document.addEventListener('visibilitychange', syncMotionPreference);
syncMotionPreference();

// Uma atualização por quadro. O cabeçalho volta ao receber foco por teclado.
let lastY = window.scrollY;
let ticking = false;
function onScroll() {
  const y = Math.max(0, window.scrollY);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.setProperty('--progress', max > 0 ? Math.min(1, y / max).toFixed(4) : '0');
  const menuOpen = menuButton.getAttribute('aria-expanded') === 'true';
  const focused = header.contains(document.activeElement);
  if (!motionAllowed() || menuOpen || focused || y < 240) header.classList.remove('is-hidden');
  else if (Math.abs(y - lastY) > 8) header.classList.toggle('is-hidden', y > lastY);
  if (Math.abs(y - lastY) > 8) lastY = y;
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
}, { passive: true });
window.addEventListener('resize', onScroll);
header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
onScroll();

document.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  keyboardMode = true;
  document.body.classList.add('keyboard-navigation');
  header.classList.remove('is-hidden');
  stopPointerMotion();
  syncLogoShine();
});

// O cursor nativo permanece disponível. Nenhum quadro é executado em repouso.
function pointerStep() {
  if (!motionAllowed() || !finePointer.matches) { stopPointerMotion(); return; }
  cx += (mx - cx) * 0.24;
  cy += (my - cy) * 0.24;
  cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
  pointerFrame = Math.abs(mx - cx) + Math.abs(my - cy) > 0.5 ? requestAnimationFrame(pointerStep) : 0;
}

if (cursor) {
  window.addEventListener('mousemove', event => {
    if (!finePointer.matches || reducedMotion.matches || motionPaused || document.hidden || document.body.classList.contains('modal-open')) return;
    keyboardMode = false;
    document.body.classList.remove('keyboard-navigation');
    syncLogoShine();
    mx = event.clientX;
    my = event.clientY;
    if (!pointerPositioned) { cx = mx; cy = my; pointerPositioned = true; }
    cursor.classList.add('is-on');
    cursor.classList.toggle('is-link', !!event.target.closest('a, button, summary'));
    if (!pointerFrame) pointerFrame = requestAnimationFrame(pointerStep);
  }, { passive: true });
  document.addEventListener('mouseleave', stopPointerMotion);
}

// Congela as camadas da logo quando o hero sai da tela, sem executar um loop em JS.
if (brandScene && 'IntersectionObserver' in window) {
  const sceneObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('scene-idle', !entry.isIntersecting));
    syncLogoShine();
  });
  sceneObserver.observe(brandScene);
}

// Carrossel nativo: setas, toque, teclado e links continuam disponíveis.
const productTrack = document.getElementById('products-track');
const productCards = productTrack ? Array.from(productTrack.querySelectorAll('.product-card')) : [];
const carouselToolbar = document.querySelector('.carousel-toolbar');
const previousProduct = document.querySelector('.carousel-prev');
const nextProduct = document.querySelector('.carousel-next');
const carouselStatus = document.querySelector('.carousel-status');

if (productCards.length > 1 && typeof productTrack.scrollTo === 'function') {
  let statusTimer;
  function updateCarousel() {
    const max = Math.max(0, productTrack.scrollWidth - productTrack.clientWidth);
    previousProduct.disabled = productTrack.scrollLeft <= 2;
    nextProduct.disabled = productTrack.scrollLeft >= max - 2;
    const visible = productCards.map((card, index) => {
      const overlap = Math.max(0, Math.min(card.offsetLeft + card.offsetWidth, productTrack.scrollLeft + productTrack.clientWidth) - Math.max(card.offsetLeft, productTrack.scrollLeft));
      return overlap > card.offsetWidth / 2 ? index + 1 : null;
    }).filter(Boolean);
    if (visible.length) carouselStatus.textContent = `${visible[0]}${visible.length > 1 ? '–' + visible[visible.length - 1] : ''} / ${productCards.length}`;
  }
  function moveProducts(direction, keyboard = false) {
    const step = productCards[1].offsetLeft - productCards[0].offsetLeft;
    const max = Math.max(0, productTrack.scrollWidth - productTrack.clientWidth);
    const left = Math.max(0, Math.min(max, productTrack.scrollLeft + direction * step));
    productTrack.scrollTo({ left, behavior: !keyboard && motionAllowed() ? 'smooth' : 'auto' });
    updateCarousel();
  }
  previousProduct.addEventListener('click', () => moveProducts(-1));
  nextProduct.addEventListener('click', () => moveProducts(1));
  productTrack.addEventListener('keydown', event => {
    if (event.target !== productTrack || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home' || event.key === 'End') {
      productTrack.scrollTo({ left: event.key === 'Home' ? 0 : productTrack.scrollWidth, behavior: 'auto' });
      updateCarousel();
    } else moveProducts(event.key === 'ArrowRight' ? 1 : -1, true);
  });
  productTrack.addEventListener('scroll', () => {
    clearTimeout(statusTimer);
    statusTimer = setTimeout(updateCarousel, 120);
  }, { passive: true });
  document.documentElement.classList.add('carousel-enhanced');
  productTrack.setAttribute('tabindex', '0');
  productTrack.setAttribute('aria-roledescription', 'carrossel');
  productTrack.setAttribute('aria-describedby', 'carousel-help');
  carouselToolbar.hidden = false;
  window.addEventListener('resize', updateCarousel);
  if ('ResizeObserver' in window) new ResizeObserver(updateCarousel).observe(productTrack);
  updateCarousel();
}

// Painéis de detalhes inspirados na navegação de serviços do portfólio.
const serviceDialog = document.getElementById('service-dialog');
const serviceInformation = {
  print: {
    title: 'Impressão e acabamento',
    intro: 'Conte o que precisa imprimir. Assim podemos conversar sobre o formato, o acabamento e o orçamento.',
    steps: [
      ['Envie o material', 'Mande o arquivo ou explique o documento que precisa copiar.'],
      ['Escolha os detalhes', 'Informe quantidade, preto e branco ou colorido e se precisa de encadernação ou plastificação.'],
      ['Combine o pedido', 'Consulte os valores, a disponibilidade e o prazo pelo WhatsApp.']
    ]
  },
  education: {
    title: 'Papelaria e educação',
    intro: 'Material para o dia a dia e ideias para aprender. Consulte os itens e arquivos pedagógicos disponíveis.',
    steps: [
      ['Conte a necessidade', 'Envie sua lista de materiais ou diga qual atividade procura.'],
      ['Dê o contexto', 'Para arquivos pedagógicos, conte o tema e a etapa escolar.'],
      ['Confira as opções', 'Converse com a gente sobre produtos, quantidades e valores.']
    ]
  },
  gifts: {
    title: 'Presentes e personalizados',
    intro: 'Um presente, uma lembrancinha ou um detalhe para a festa. Vamos entender sua ideia e as possibilidades de personalização.',
    steps: [
      ['Escolha o produto', 'Conte se procura bottons, canecas, caixinhas, tags ou outro item do catálogo.'],
      ['Compartilhe sua ideia', 'Informe o tema, a mensagem, a quantidade e a data que tem em mente.'],
      ['Combine os detalhes', 'Consulte materiais, disponibilidade, orçamento e prazos antes de confirmar.']
    ]
  }
};

if (serviceDialog && typeof serviceDialog.showModal === 'function') {
  let lastServiceButton;
  document.querySelectorAll('[data-service]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      const info = serviceInformation[button.dataset.service];
      if (!info) return;
      document.getElementById('service-dialog-title').textContent = info.title;
      document.getElementById('service-dialog-intro').textContent = info.intro;
      const steps = info.steps.map(([title, description], index) => {
        const item = document.createElement('li');
        const number = document.createElement('span');
        number.className = 'step-number';
        number.textContent = String(index + 1).padStart(2, '0');
        number.setAttribute('aria-hidden', 'true');
        const heading = document.createElement('h3');
        heading.textContent = title;
        const text = document.createElement('p');
        text.textContent = description;
        item.append(number, heading, text);
        return item;
      });
      serviceDialog.querySelector('.service-dialog-steps').replaceChildren(...steps);
      serviceDialog.querySelector('.service-dialog-contact').href = 'https://wa.me/5511970529778?text=' + encodeURIComponent(`Olá! Gostaria de conversar sobre ${info.title.toLowerCase()}.`);
      lastServiceButton = button;
      serviceDialog.showModal();
      document.body.classList.add('modal-open');
      stopPointerMotion();
      syncLogoShine();
    });
  });
  serviceDialog.querySelector('.service-dialog-close').addEventListener('click', () => serviceDialog.close());
  serviceDialog.addEventListener('click', event => {
    if (event.target !== serviceDialog) return;
    const box = serviceDialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) serviceDialog.close();
  });
  serviceDialog.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('modal-open');
    if (lastServiceButton) lastServiceButton.focus({ preventScroll: true });
    syncLogoShine();
  });
}
