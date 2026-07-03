/* HARALD OELER — shared site scripts */
(function () {
  'use strict';

  /* Theme */
  function initTheme() {
    var btn = document.getElementById('theme-toggle');
    if (!btn || btn.__themeBound || window.__HO_THEME_CUSTOM) return !!btn;
    btn.__themeBound = true;

    function syncPressed() {
      btn.setAttribute('aria-pressed', document.body.classList.contains('dark') ? 'true' : 'false');
    }
    syncPressed();

    btn.addEventListener('click', function () {
      var dark = document.body.classList.toggle('dark');
      localStorage.setItem('ho-theme', dark ? 'dark' : 'light');
      syncPressed();
    });
    return true;
  }

  /* Mobile nav */
  function initNav() {
    var toggle = document.getElementById('navToggle');
    var nav = document.querySelector('nav.primary');
    if (!toggle || !nav) return false;
    if (toggle.__navBound || window.__HO_NAV_CUSTOM) return true;
    toggle.__navBound = true;

    var backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('button');
      backdrop.className = 'nav-backdrop';
      backdrop.type = 'button';
      backdrop.setAttribute('aria-label', 'Menü schließen');
      document.body.appendChild(backdrop);
    }

    var OPEN = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><line x1="1" y1="1" x2="15" y2="15"/><line x1="15" y1="1" x2="1" y2="15"/></svg>';
    var CLOSED = '<svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><line x1="0" y1="1" x2="22" y2="1"/><line x1="0" y1="7" x2="22" y2="7"/><line x1="0" y1="13" x2="22" y2="13"/></svg>';

    function close() {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
      document.body.style.overflow = '';
      toggle.innerHTML = CLOSED;
    }

    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('nav-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      toggle.innerHTML = open ? OPEN : CLOSED;
    });

    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });
    backdrop.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
    return true;
  }

  /* Scroll to top */
  function initScrollTop() {
    var btn = document.getElementById('scrollTopBtn');
    if (!btn || btn.__scrollBound) return;
    btn.__scrollBound = true;
    var showAt = 500;
    function sync() {
      btn.classList.toggle('is-visible', window.scrollY > showAt);
    }
    window.addEventListener('scroll', sync, { passive: true });
    sync();
    btn.addEventListener('click', function () {
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  /* Hero header scroll state */
  function initHeroHeader() {
    var header = document.querySelector('.site-header.hero-header');
    if (!header) return;
    function onScroll() {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Footer next concert teaser */
  function initFooterConcert() {
    var el = document.getElementById('footer-next-concert');
    if (!el || !window.fetch) return;
    fetch('termine.html', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.text() : Promise.reject(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var items = Array.from(doc.querySelectorAll('.concert-item'));
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          if (item.querySelector('.badge-abgesagt')) continue;
          var dateEl = item.querySelector('.c-date');
          if (!dateEl) continue;
          var m = dateEl.textContent.trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
          if (!m) continue;
          var d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
          if (d < today) continue;
          var titleEl = item.querySelector('.c-title');
          var locEl = item.querySelector('.c-location a') || item.querySelector('.c-location');
          var title = titleEl ? titleEl.childNodes[0].textContent.trim() : '';
          var loc = locEl ? locEl.textContent.replace(/\s+/g, ' ').trim() : '';
          var anchor = item.id ? '#' + item.id : 'termine.html';
          el.innerHTML = '<a href="termine.html' + anchor + '">Nächstes Konzert: ' + dateEl.textContent.trim() + ' — ' + title + (loc ? ' · ' + loc : '') + '</a>';
          return;
        }
      })
      .catch(function () {});
  }

  function boot() {
    initTheme();
    initNav();
    initScrollTop();
    initHeroHeader();
    initFooterConcert();
    bootReactPages();
  }

  function bootReactPages() {
    if (!document.getElementById('root')) return;
    var tries = 0;
    var iv = setInterval(function () {
      tries++;
      initTheme();
      initNav();
      if (tries > 80) clearInterval(iv);
    }, 50);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* Re-init for React-hydrated pages (projekte.html) */
  window.HOSite = { initTheme: initTheme, initNav: initNav };
})();
