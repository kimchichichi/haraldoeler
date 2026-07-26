/* HARALD OELER — shared site scripts */
(function () {
  'use strict';

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

    function navAnchor() {
      var headerInner = document.querySelector('.header-inner');
      if (!headerInner) return null;
      return { parent: headerInner, before: toggle };
    }

    function mountNav() {
      if (nav.parentElement === document.body) return;
      var anchor = navAnchor();
      if (!anchor) return;
      nav.__hoAnchor = anchor;
      document.body.appendChild(nav);
    }

    function restoreNav() {
      var anchor = nav.__hoAnchor;
      if (!anchor || nav.parentElement !== document.body) return;
      anchor.parent.insertBefore(nav, anchor.before || null);
    }

    function close() {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
      document.body.style.overflow = '';
      toggle.innerHTML = CLOSED;
      restoreNav();
    }

    function open() {
      mountNav();
      nav.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-open');
      document.body.style.overflow = 'hidden';
      toggle.innerHTML = OPEN;
    }

    toggle.addEventListener('click', function () {
      nav.classList.contains('open') ? close() : open();
    });

    var navLinkTouched = false;

    document.addEventListener('click', function (e) {
      if (!document.body.classList.contains('nav-open')) return;
      var link = e.target.closest && e.target.closest('nav.primary.open a[href]');
      if (!link) return;
      if (navLinkTouched) {
        e.preventDefault();
        return;
      }
      close();
    });

    /* iOS/iPadOS: synthesized click often fails after menu DOM changes — navigate on touchend */
    document.addEventListener('touchend', function (e) {
      if (!document.body.classList.contains('nav-open')) return;
      var link = e.target.closest && e.target.closest('nav.primary.open a[href]');
      if (!link) return;
      navLinkTouched = true;
      setTimeout(function () { navLinkTouched = false; }, 500);
      var url = link.href;
      close();
      window.location.assign(url);
    }, { passive: true });

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
    var ticking = false;
    function sync() {
      var show = window.scrollY > showAt;
      if (btn.classList.contains('is-visible') !== show) {
        btn.classList.toggle('is-visible', show);
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(sync);
      }
    }, { passive: true });
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
    var ticking = false;
    function onScroll() {
      var scrolled = window.scrollY > 60;
      if (header.classList.contains('scrolled') !== scrolled) {
        header.classList.toggle('scrolled', scrolled);
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    }, { passive: true });
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
  window.HOSite = { initNav: initNav };
})();
