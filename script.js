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
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const brandScene = document.querySelector('.brand-scene');
let keyboardMode = false;
let shineTimer = 0;
let shineDeadline = 0;
let shineRemaining = 8000;

function motionAllowed() {
  return !reducedMotion.matches && !keyboardMode && !document.hidden && !document.body.classList.contains('modal-open');
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
  document.body.classList.toggle('page-idle', document.hidden);
  if (!motionAllowed()) {
    header.classList.remove('is-hidden');
    showEverything();
  }
  syncLogoShine();
}

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
  syncLogoShine();
});

// Mexer o mouse sai do modo teclado e retoma as animações. O cursor nativo não é alterado.
window.addEventListener('mousemove', () => {
  if (!finePointer.matches || reducedMotion.matches || document.hidden || document.body.classList.contains('modal-open')) return;
  keyboardMode = false;
  document.body.classList.remove('keyboard-navigation');
  syncLogoShine();
}, { passive: true });

// Congela as camadas da logo quando o hero sai da tela, sem executar um loop em JS.
if (brandScene && 'IntersectionObserver' in window) {
  const sceneObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('scene-idle', !entry.isIntersecting));
    syncLogoShine();
  });
  sceneObserver.observe(brandScene);
}

// Vitrine em baralho: setas, arrastar, teclado e troca automática (que para ao interagir).
const deck = document.getElementById('products-track');
const deckCards = deck ? Array.from(deck.querySelectorAll('.deck-card')) : [];
const deckControls = document.querySelector('.deck-controls');
if (deckCards.length > 1 && deckControls) {
  const deckStatus = deckControls.querySelector('.deck-status');
  let order = deckCards.slice();
  let busy = false;
  let autoTimer = 0;
  let userTookOver = false;
  function layoutDeck() {
    order.forEach((card, pos) => {
      card.dataset.pos = Math.min(pos, 4);
      card.toggleAttribute('inert', pos !== 0);
      card.setAttribute('aria-hidden', pos !== 0 ? 'true' : 'false');
    });
    deckStatus.textContent = `${deckCards.indexOf(order[0]) + 1} / ${deckCards.length}`;
  }
  function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
  async function go(direction, fling) {
    if (busy) return;
    busy = true;
    const animate = motionAllowed();
    if (direction > 0) {
      const front = order[0];
      if (animate) {
        front.style.setProperty('--fly-x', fling ? fling.x : '120%');
        front.style.setProperty('--fly-r', fling ? fling.r : '16deg');
        front.classList.add('is-flying');
        await wait(380);
      }
      front.classList.add('no-transition');
      order.push(order.shift());
      layoutDeck();
      front.classList.remove('is-flying');
      void front.offsetWidth;
      front.classList.remove('no-transition');
    } else {
      const incoming = order[order.length - 1];
      incoming.classList.add('no-transition', 'is-flying');
      incoming.style.setProperty('--fly-x', '-120%');
      incoming.style.setProperty('--fly-r', '-16deg');
      order.unshift(order.pop());
      layoutDeck();
      void incoming.offsetWidth;
      incoming.classList.remove('no-transition');
      incoming.classList.remove('is-flying');
      if (animate) await wait(450);
    }
    busy = false;
  }
  function stopAuto() { clearInterval(autoTimer); autoTimer = 0; }
  function startAuto() {
    stopAuto();
    if (userTookOver || !motionAllowed()) return;
    autoTimer = setInterval(() => {
      if (motionAllowed() && !deck.matches(':hover') && !deck.contains(document.activeElement)) go(1);
    }, 5500);
  }
  function takeOver() { userTookOver = true; stopAuto(); }
  deckControls.querySelector('.deck-next').addEventListener('click', () => { takeOver(); go(1); });
  deckControls.querySelector('.deck-prev').addEventListener('click', () => { takeOver(); go(-1); });
  deck.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    takeOver();
    go(event.key === 'ArrowRight' ? 1 : -1);
  });
  // Arrastar a carta da frente: solta além de 80px e ela vai para o fundo do baralho.
  let startX = 0, dragX = 0, dragging = null;
  deck.addEventListener('pointerdown', event => {
    const front = order[0];
    if (busy || event.button !== 0 || !front.contains(event.target) || event.target.closest('a, button')) return;
    dragging = front; startX = event.clientX; dragX = 0;
    front.classList.add('is-dragging');
    front.setPointerCapture(event.pointerId);
  });
  deck.addEventListener('pointermove', event => {
    if (!dragging) return;
    dragX = event.clientX - startX;
    dragging.style.transform = `translateX(${dragX}px) rotate(${dragX / 22}deg)`;
  });
  function endDrag() {
    if (!dragging) return;
    const card = dragging;
    dragging = null;
    card.classList.remove('is-dragging');
    card.style.transform = '';
    if (Math.abs(dragX) > 80) {
      takeOver();
      go(1, { x: dragX > 0 ? '120%' : '-120%', r: dragX > 0 ? '16deg' : '-16deg' });
    }
  }
  deck.addEventListener('pointerup', endDrag);
  deck.addEventListener('pointercancel', endDrag);
  document.documentElement.classList.add('deck-enhanced');
  deck.setAttribute('tabindex', '0');
  deck.setAttribute('aria-roledescription', 'baralho de cartas');
  deck.setAttribute('aria-label', 'Produtos em destaque. Use as setas do teclado para trocar de carta.');
  deckControls.hidden = false;
  layoutDeck();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => entries[0].isIntersecting ? startAuto() : stopAuto(), { threshold: 0.5 }).observe(deck);
  }
  document.addEventListener('visibilitychange', () => document.hidden ? stopAuto() : startAuto());
}

// Ilustrações dos serviços só animam enquanto o cartão está na tela.
const serviceCards = document.querySelectorAll('.svc-card');
if (serviceCards.length) {
  if ('IntersectionObserver' in window) {
    const liveObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('is-live', entry.isIntersecting));
    }, { threshold: 0.3 });
    serviceCards.forEach(card => liveObserver.observe(card));
  } else serviceCards.forEach(card => card.classList.add('is-live'));
}

// Inclinação suave da logo seguindo o mouse sobre o hero. Só atualiza variáveis CSS.
const heroSection = document.getElementById('inicio');
if (heroSection && brandScene) {
  let tiltQueued = false;
  function setTilt(x, y, r) {
    brandScene.style.setProperty('--tx', x + 'px');
    brandScene.style.setProperty('--ty', y + 'px');
    brandScene.style.setProperty('--tr', r + 'deg');
  }
  heroSection.addEventListener('mousemove', event => {
    if (!finePointer.matches || !motionAllowed() || tiltQueued) return;
    tiltQueued = true;
    requestAnimationFrame(() => {
      tiltQueued = false;
      const box = heroSection.getBoundingClientRect();
      const dx = (event.clientX - box.left) / box.width - 0.5;
      const dy = (event.clientY - box.top) / box.height - 0.5;
      setTilt((dx * 22).toFixed(1), (dy * 16).toFixed(1), (dx * 4).toFixed(2));
    });
  }, { passive: true });
  heroSection.addEventListener('mouseleave', () => setTilt(0, 0, 0));
}

// Logo: ondulação de aquarela ao passar o mouse e explosão de corações e confetes ao clicar ou tocar.
const logoBurst = brandScene ? brandScene.querySelector('.logo-burst') : null;
const rippleMap = document.getElementById('ripple-map');
const rippleNoise = document.getElementById('ripple-noise');
if (brandScene && logoBurst && rippleMap && rippleNoise) {
  let rippling = false;
  let rippleCooldown = 0;
  function ripple() {
    if (rippling || !motionAllowed() || Date.now() < rippleCooldown) return;
    rippling = true;
    brandScene.classList.add('rippling');
    const start = performance.now();
    (function step(now) {
      const p = Math.min(1, (now - start) / 1200);
      rippleMap.setAttribute('scale', (10 * Math.sin(Math.PI * p)).toFixed(2));
      rippleNoise.setAttribute('baseFrequency', `0.01 ${(0.026 + 0.016 * p).toFixed(4)}`);
      if (p < 1) requestAnimationFrame(step);
      else {
        rippleMap.setAttribute('scale', '0');
        brandScene.classList.remove('rippling');
        rippling = false;
        rippleCooldown = Date.now() + 3000;
      }
    })(start);
  }
  brandScene.addEventListener('mouseenter', () => { if (finePointer.matches) ripple(); });

  const burstColors = ['#e0306f', '#fbb92a', '#17a6b5', '#3db56d', '#8a5bc8'];
  brandScene.addEventListener('click', event => {
    if (!motionAllowed() || logoBurst.childElementCount > 30) return;
    const box = brandScene.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    for (let i = 0; i < 14; i++) {
      const piece = document.createElement('span');
      const heart = i % 3 === 0;
      piece.className = heart ? 'burst-piece burst-heart' : 'burst-piece';
      const color = burstColors[i % burstColors.length];
      if (heart) { piece.textContent = '♥'; piece.style.color = color; } else piece.style.background = color;
      piece.style.left = x + 'px';
      piece.style.top = y + 'px';
      const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
      const distance = 70 + Math.random() * 90;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - 30;
      logoBurst.appendChild(piece);
      piece.animate([
        { transform: 'translate(-50%, -50%) scale(.3)', opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1) rotate(${Math.round(Math.random() * 120 - 60)}deg)`, opacity: 1, offset: .65 },
        { transform: `translate(calc(-50% + ${dx * 1.15}px), calc(-50% + ${dy + 24}px)) scale(.8)`, opacity: 0 }
      ], { duration: 1000 + Math.random() * 400, easing: 'cubic-bezier(.2, .8, .3, 1)' }).onfinish = () => piece.remove();
    }
  });
}

// Montador de botton: tamanho, kit e estampa atualizam a prévia, o total e a mensagem do WhatsApp.
const builder = document.querySelector('.builder');
if (builder) {
  const stage = builder.querySelector('.builder-stage');
  const pins = Array.from(builder.querySelectorAll('.bpin'));
  const ruler = builder.querySelector('.builder-ruler');
  const rulerLabel = builder.querySelector('.builder-ruler-label');
  const priceOutput = builder.querySelector('.builder-price');
  const saveBadge = builder.querySelector('.builder-save');
  const cta = builder.querySelector('.builder-cta');
  const sparks = builder.querySelector('.builder-sparks');
  const sizes = {
    P: { cm: 3.2, label: '3,2', unit: 5, kit: 12 },
    M: { cm: 4.4, label: '4,4', unit: 7, kit: 16 },
    G: { cm: 5.8, label: '5,8', unit: 9, kit: 20 }
  };
  const themeNames = { flower: 'flor', heart: 'coração', star: 'estrela', car: 'carrinho', girl: 'menina' };
  let shownPrice = 7;
  let countFrame = 0;
  let flipTimer = 0;
  const money = value => 'R$ ' + value.toFixed(2).replace('.', ',');
  const choice = name => builder.querySelector(`input[name="${name}"]:checked`).value;

  function showPrice(target) {
    cancelAnimationFrame(countFrame);
    if (!motionAllowed()) { shownPrice = target; priceOutput.textContent = money(target); return; }
    const from = shownPrice;
    const start = performance.now();
    (function step(now) {
      const p = Math.min(1, (now - start) / 450);
      shownPrice = from + (target - from) * (1 - Math.pow(1 - p, 3));
      priceOutput.textContent = money(p < 1 ? shownPrice : target);
      if (p < 1) countFrame = requestAnimationFrame(step); else shownPrice = target;
    })(start);
  }

  function burst() {
    if (!motionAllowed() || sparks.childElementCount > 24) return;
    const colors = ['#e0306f', '#fbb92a', '#17a6b5', '#3db56d', '#8a5bc8'];
    const box = stage.getBoundingClientRect();
    const cx = box.width / 2;
    const cy = (box.height - 34) / 2;
    for (let i = 0; i < 10; i++) {
      const dot = document.createElement('span');
      dot.className = 'spark-dot';
      dot.style.background = colors[i % colors.length];
      dot.style.left = cx + 'px';
      dot.style.top = cy + 'px';
      sparks.appendChild(dot);
      const angle = (Math.PI * 2 * i) / 10;
      const dist = 80 + Math.random() * 40;
      dot.animate([
        { transform: 'translate(-50%, -50%) scale(.4)', opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px)) scale(1)`, opacity: 0 }
      ], { duration: 650, easing: 'cubic-bezier(.2, .8, .3, 1)' }).onfinish = () => dot.remove();
    }
  }

  function update(changed) {
    const size = sizes[choice('b-size')];
    const kit = choice('b-qty') === '3';
    const theme = choice('b-theme');
    const total = kit ? size.kit : size.unit;
    pins.forEach(pin => pin.style.setProperty('--cm', size.cm));
    stage.dataset.qty = kit ? '3' : '1';
    ruler.style.setProperty('--ruler', `calc(${size.cm} * var(--px-cm))`);
    rulerLabel.textContent = size.label + ' cm';
    showPrice(total);
    const saving = size.unit * 3 - size.kit;
    saveBadge.hidden = !kit;
    if (kit) {
      saveBadge.textContent = 'Economize ' + money(saving);
      saveBadge.style.animation = 'none';
      void saveBadge.offsetWidth;
      saveBadge.style.animation = '';
    }
    const quantity = kit ? 'um kit com 3 bottons' : '1 botton';
    const message = `Olá! Gostaria de pedir ${quantity} tamanho ${choice('b-size')} (${size.label} cm), inspirado na estampa de ${themeNames[theme]}. Pode me passar o orçamento?`;
    cta.href = 'https://wa.me/5511970529778?text=' + encodeURIComponent(message);
    cta.lastChild.textContent = kit ? ' Pedir este kit' : ' Pedir este botton';
    if (changed === 'b-theme') {
      clearTimeout(flipTimer);
      if (motionAllowed()) {
        stage.classList.remove('is-flip');
        void stage.offsetWidth;
        stage.classList.add('is-flip');
        flipTimer = setTimeout(() => {
          pins.forEach(pin => pin.querySelector('use').setAttribute('href', `#m-${theme}`));
          stage.classList.remove('is-flip');
        }, 260);
      } else pins.forEach(pin => pin.querySelector('use').setAttribute('href', `#m-${theme}`));
    }
    if (changed === 'b-size' || changed === 'b-qty') {
      if (motionAllowed()) {
        stage.classList.remove('is-press');
        void stage.offsetWidth;
        stage.classList.add('is-press');
        burst();
      }
    }
  }

  builder.addEventListener('change', event => update(event.target.name));
  document.documentElement.classList.add('builder-enhanced');
  builder.hidden = false;
  update('init');
}

// Sobre: ilustração só anima à vista, pilares acendem em sequência e números contam até o valor real.
const aboutArt = document.querySelector('.about-art');
const pillarItems = Array.from(document.querySelectorAll('.pillar'));
const statNumbers = Array.from(document.querySelectorAll('.stat-num'));
if (aboutArt && 'IntersectionObserver' in window) {
  new IntersectionObserver(entries => aboutArt.classList.toggle('is-live', entries[0].isIntersecting), { threshold: 0.25 }).observe(aboutArt);
}
function litAll() { pillarItems.forEach(item => item.classList.add('is-lit')); }
if (pillarItems.length && 'IntersectionObserver' in window) {
  const pillarObserver = new IntersectionObserver((entries, observer) => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    pillarItems.forEach((item, index) => setTimeout(() => item.classList.add('is-lit'), motionAllowed() ? index * 350 : 0));
  }, { threshold: 0.3 });
  pillarObserver.observe(pillarItems[0].parentElement);
} else litAll();
function formatStat(value, decimals, prefix) {
  return prefix + value.toFixed(decimals).replace('.', ',');
}
if (statNumbers.length && 'IntersectionObserver' in window) {
  const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals, 10) || 0;
      const prefix = el.textContent.trim().startsWith('+') ? '+' : '';
      const finalText = el.textContent;
      if (!motionAllowed()) return;
      const start = performance.now();
      (function step(now) {
        const p = Math.min(1, (now - start) / 1400);
        el.textContent = p < 1 ? formatStat(target * (1 - Math.pow(1 - p, 3)), decimals, prefix) : finalText;
        if (p < 1) requestAnimationFrame(step);
      })(start);
    });
  }, { threshold: 0.6 });
  statNumbers.forEach(el => statObserver.observe(el));
}

// Contato: a conversa de exemplo só anima enquanto o painel está na tela.
const contactPanel = document.querySelector('.contact-panel');
if (contactPanel && 'IntersectionObserver' in window) {
  new IntersectionObserver(entries => contactPanel.classList.toggle('is-live', entries[0].isIntersecting), { threshold: 0.3 }).observe(contactPanel);
}

// Avaliações: estrelas acendem em sequência e o mapa do Google só carrega quando a pessoa pede.
const ratingMedal = document.querySelector('.rating-medal');
if (ratingMedal) {
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries, observer) => {
      if (!entries[0].isIntersecting) return;
      ratingMedal.classList.add('is-lit');
      observer.disconnect();
    }, { threshold: 0.6 }).observe(ratingMedal);
  } else ratingMedal.classList.add('is-lit');
}
const mapFacade = document.querySelector('.map-facade');
const mapLoadButton = mapFacade ? mapFacade.querySelector('button.map-load') : null;
if (mapFacade && mapLoadButton) {
  mapLoadButton.hidden = false;
  mapLoadButton.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.title = 'Mapa com a localização da Artes Mamãe Mundo Criar, em Mauá – SP';
    frame.src = 'https://maps.google.com/maps?q=-23.6263387,-46.4783938&z=16&output=embed';
    frame.referrerPolicy = 'no-referrer-when-downgrade';
    frame.width = '560';
    frame.height = '420';
    mapFacade.appendChild(frame);
    mapFacade.classList.add('is-loaded');
    frame.focus();
  });
}

// Divisores: as decorações flutuam em ritmos diferentes ao rolar (parallax leve), só enquanto estão à vista.
const dividerList = Array.from(document.querySelectorAll('.divider'));
if (dividerList.length && 'IntersectionObserver' in window) {
  const visibleDividers = new Set();
  let dividerFrame = 0;
  function resetDecos() {
    dividerList.forEach(divider => divider.querySelectorAll('.deco').forEach(deco => deco.style.setProperty('--py', '0px')));
  }
  function updateDividers() {
    dividerFrame = 0;
    if (!motionAllowed()) { resetDecos(); return; }
    visibleDividers.forEach(divider => {
      const box = divider.getBoundingClientRect();
      const offset = box.top + box.height / 2 - window.innerHeight / 2;
      divider.querySelectorAll('.deco').forEach(deco => {
        const speed = parseFloat(deco.style.getPropertyValue('--speed')) || 0.1;
        deco.style.setProperty('--py', (-offset * speed).toFixed(1) + 'px');
      });
    });
  }
  function queueDividers() {
    if (!dividerFrame) dividerFrame = requestAnimationFrame(updateDividers);
  }
  const dividerObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? visibleDividers.add(entry.target) : visibleDividers.delete(entry.target));
    queueDividers();
  }, { rootMargin: '200px 0px' });
  dividerList.forEach(divider => dividerObserver.observe(divider));
  window.addEventListener('scroll', queueDividers, { passive: true });
  window.addEventListener('resize', queueDividers);
  reducedMotion.addEventListener('change', queueDividers);
}

// Botão flutuante: compacto, expande o rótulo uma vez depois de alguns segundos e some junto do painel de contato.
const fab = document.querySelector('.floating-whatsapp');
if (fab) {
  fab.classList.add('is-compact');
  setTimeout(() => {
    if (!motionAllowed()) return;
    fab.classList.add('is-expanded');
    setTimeout(() => fab.classList.remove('is-expanded'), 5000);
  }, 6000);
  const fabHideTarget = document.querySelector('.contact-panel');
  if (fabHideTarget && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => fab.classList.toggle('is-hidden', entries[0].isIntersecting), { threshold: 0.35 }).observe(fabHideTarget);
  }
}

// Cada seção, o letreiro e os divisores só animam enquanto estão perto da área visível.
const viewTargets = Array.from(document.querySelectorAll('main > section, main > .marquee, main > .divider'));
if (viewTargets.length && 'IntersectionObserver' in window) {
  const viewObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('in-view', entry.isIntersecting));
  }, { rootMargin: '120px 0px' });
  viewTargets.forEach(target => viewObserver.observe(target));
  document.documentElement.classList.add('view-aware');
}
