(function () {
  'use strict';

  /* ---------- Год в футере ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Рендер кейсов ---------- */
  const grid = document.getElementById('casesGrid');
  const filtersBox = document.getElementById('filters');
  const dotsBox = document.getElementById('casesDots');

  function tagsHtml(tags) {
    return tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('');
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function cardHtml(c) {
    var cover = c.coverImg
      ? '<img src="' + c.coverImg + '" alt="' + esc(c.title) + '" loading="lazy" />'
      : ((typeof makeCover !== 'undefined') ? makeCover(c) : '');
    return (
      '<button class="case-card" data-id="' + c.id + '" data-reveal>' +
        '<div class="case-card__cover">' + cover + '</div>' +
        '<div class="case-card__body">' +
          '<h3 class="case-card__title">' + c.title + '</h3>' +
          '<p class="case-card__summary">' + c.summary + '</p>' +
          '<div class="case-card__tags">' + tagsHtml(c.tags) + '</div>' +
          '<span class="case-card__more">Открыть кейс</span>' +
        '</div>' +
      '</button>'
    );
  }

  function renderCases(list) {
    grid.innerHTML = list.map(cardHtml).join('');
    buildDots(list.length);
    grid.scrollLeft = 0;
    observeReveals();
  }

  /* ---------- Точки-индикаторы слайдера (моб.) ---------- */
  function buildDots(count) {
    if (!dotsBox) return;
    if (count <= 1) { dotsBox.innerHTML = ''; return; }
    var html = '';
    for (var i = 0; i < count; i++) {
      html += '<button class="cases__dot' + (i === 0 ? ' is-active' : '') +
        '" data-i="' + i + '" aria-label="Кейс ' + (i + 1) + '"></button>';
    }
    dotsBox.innerHTML = html;
  }

  function activeCardIndex() {
    var cards = grid.children, best = 0, min = Infinity;
    for (var i = 0; i < cards.length; i++) {
      var d = Math.abs((cards[i].offsetLeft - grid.offsetLeft) - grid.scrollLeft);
      if (d < min) { min = d; best = i; }
    }
    return best;
  }

  function syncDots() {
    if (!dotsBox) return;
    var active = activeCardIndex();
    var ds = dotsBox.children;
    for (var i = 0; i < ds.length; i++) {
      ds[i].classList.toggle('is-active', i === active);
    }
  }

  if (dotsBox) {
    dotsBox.addEventListener('click', function (e) {
      var dot = e.target.closest('.cases__dot');
      if (!dot) return;
      var card = grid.children[Number(dot.dataset.i)];
      if (card) grid.scrollTo({ left: card.offsetLeft - grid.offsetLeft, behavior: 'smooth' });
    });
    var ticking = false;
    grid.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { syncDots(); ticking = false; });
    }, { passive: true });
  }

  /* ---------- Фильтры по тегам ---------- */
  var allTags = ['Все'];
  CASES.forEach(function (c) {
    c.tags.forEach(function (t) { if (allTags.indexOf(t) === -1) allTags.push(t); });
  });

  filtersBox.innerHTML = allTags.map(function (t, i) {
    return '<button class="filter' + (i === 0 ? ' is-active' : '') + '" data-tag="' + t + '">' + t + '</button>';
  }).join('');

  filtersBox.addEventListener('click', function (e) {
    var btn = e.target.closest('.filter');
    if (!btn) return;
    filtersBox.querySelectorAll('.filter').forEach(function (f) { f.classList.remove('is-active'); });
    btn.classList.add('is-active');
    var tag = btn.dataset.tag;
    var filtered = tag === 'Все' ? CASES : CASES.filter(function (c) { return c.tags.indexOf(tag) !== -1; });
    renderCases(filtered);
  });

  renderCases(CASES);

  /* ---------- Рендер услуг ---------- */
  var servicesGrid = document.getElementById('servicesGrid');
  if (servicesGrid && typeof SERVICES !== 'undefined') {
    servicesGrid.innerHTML = SERVICES.map(function (s) {
      return (
        '<a class="service-row" href="https://t.me/tvngler" target="_blank" rel="noopener" data-reveal>' +
          '<div class="service-row__main">' +
            '<h3 class="service-row__title">' + s.title + '</h3>' +
            '<p class="service-row__desc">' + s.desc + '</p>' +
          '</div>' +
          '<div class="service-row__price">' +
            '<span class="service-row__amount">' + s.price + '</span>' +
            '<span class="service-row__unit">' + s.unit + '</span>' +
          '</div>' +
        '</a>'
      );
    }).join('');
    observeReveals();
  }

  /* ---------- Логотипы AI-инструментов ---------- */
  var aiLogos = document.getElementById('aiLogos');
  if (aiLogos && typeof AI_TOOLS !== 'undefined') {
    aiLogos.innerHTML = AI_TOOLS.map(function (t) {
      return '<span class="ai-logo">' +
        '<span class="ai-logo__mark"><img src="' + t.file + '" alt="' + esc(t.name) + '" loading="lazy" /></span>' +
        '<span class="ai-logo__name">' + esc(t.name) + '</span>' +
      '</span>';
    }).join('');
  }

  /* ---------- Модальное окно ---------- */
  var modal = document.getElementById('modal');
  var modalContent = document.getElementById('modalContent');
  var TG = 'https://t.me/tvngler';

  function detailHtml(blocks) {
    var html = '', inList = false;
    blocks.forEach(function (b) {
      var t = b[0], raw = b[1];
      if (t === 'li') {
        if (!inList) { html += '<ul>'; inList = true; }
        html += '<li>' + esc(raw) + '</li>';
        return;
      }
      if (inList) { html += '</ul>'; inList = false; }
      if (t === 'img') html += '<img class="modal__shot" src="' + raw + '" alt="" loading="lazy" />';
      else if (t === 'h') html += '<h4>' + esc(raw) + '</h4>';
      else html += '<p>' + esc(raw) + '</p>';
    });
    if (inList) html += '</ul>';
    return html;
  }

  function openModal(c) {
    var detail = (typeof CASE_DETAILS !== 'undefined' && CASE_DETAILS[c.id]) ? CASE_DETAILS[c.id] : null;
    var body = detail
      ? detailHtml(detail)
      : '<p>' + esc(c.summary) + '</p>';
    modalContent.innerHTML =
      '<div class="modal__inner">' +
        '<h3>' + c.title + '</h3>' +
        '<div class="modal__industry">' + c.industry + '</div>' +
        '<span class="modal__metric">' + c.metric + '</span>' +
        '<div class="modal__tags">' + tagsHtml(c.tags) + '</div>' +
        '<div class="modal__body">' + body + '</div>' +
        '<div class="modal__cta"><a class="btn" href="' + TG + '" target="_blank" rel="noopener">Хочу такой же результат</a></div>' +
      '</div>';
    modal.scrollTop = 0;
    var dlg = modal.querySelector('.modal__dialog');
    if (dlg) dlg.scrollTop = 0;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  grid.addEventListener('click', function (e) {
    var card = e.target.closest('.case-card');
    if (!card) return;
    var c = CASES.find(function (x) { return x.id === Number(card.dataset.id); });
    if (c) openModal(c);
  });

  modal.addEventListener('click', function (e) {
    if (e.target.classList && e.target.classList.contains('modal__shot')) {
      openLightbox(e.target.getAttribute('src'));
      return;
    }
    if (e.target.hasAttribute('data-close')) closeModal();
  });

  /* ---------- Лайтбокс для картинок в кейсах ---------- */
  var lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = '<button class="lightbox__close" aria-label="Закрыть">&times;</button><img alt="" />';
  document.body.appendChild(lightbox);
  var lightboxImg = lightbox.querySelector('img');

  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('is-open');
  }
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightboxImg.src = '';
  }
  lightbox.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (lightbox.classList.contains('is-open')) closeLightbox();
    else closeModal();
  });

  /* ---------- Анимации появления ---------- */
  var io;
  function observeReveals() {
    var items = document.querySelectorAll('[data-reveal]:not(.is-visible)');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var delay = entry.target.dataset.revealDelay || 0;
            setTimeout(function () { entry.target.classList.add('is-visible'); }, delay);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    }
    items.forEach(function (el) { io.observe(el); });
  }
  observeReveals();

  /* ---------- Подсветка навбара при скролле ---------- */
  var nav = document.getElementById('nav');
  var progress = document.getElementById('scrollProgress');
  var toTop = document.getElementById('toTop');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    nav.classList.toggle('is-scrolled', y > 8);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
    if (toTop) toTop.classList.toggle('is-visible', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Мобильное меню (бургер) ---------- */
  var burger = document.getElementById('navBurger');
  if (burger && nav) {
    function setMenu(open) {
      nav.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    burger.addEventListener('click', function (e) {
      e.stopPropagation();
      setMenu(!nav.classList.contains('is-open'));
    });
    // закрыть при клике по ссылке (переход к якорю)
    nav.querySelectorAll('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    // закрыть по клику вне шапки
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !nav.contains(e.target)) setMenu(false);
    });
    // закрыть по Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) setMenu(false);
    });
  }

  /* ---------- Анимация счётчиков в hero ---------- */
  var counterDone = false;
  function animateCounters() {
    if (counterDone) return;
    counterDone = true;
    document.querySelectorAll('.stat__num[data-count]').forEach(function (el) {
      var target = Number(el.dataset.count);
      var suffix = el.textContent.replace(/[0-9]/g, '');
      var start = 0, dur = 1100, t0 = performance.now();
      function tick(now) {
        var p = Math.min((now - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(start + (target - start) * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }
  var statsEl = document.querySelector('.stats');
  if (statsEl && 'IntersectionObserver' in window) {
    var statsIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { animateCounters(); statsIo.disconnect(); } });
    }, { threshold: 0.5 });
    statsIo.observe(statsEl);
  } else {
    animateCounters();
  }
})();
