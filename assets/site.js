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

    var backdrop = null;

    function ensureBackdrop() {
      if (backdrop && backdrop.isConnected) return backdrop;
      backdrop = document.querySelector('.nav-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('button');
        backdrop.className = 'nav-backdrop';
        backdrop.type = 'button';
        backdrop.setAttribute('aria-label', 'Menü schließen');
        document.body.appendChild(backdrop);
        backdrop.addEventListener('click', close);
      }
      return backdrop;
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
      ensureBackdrop();
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
        btn.tabIndex = show ? 0 : -1;
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

  /* Loaded last so it beats the nav/footer rules copied into each page. */
  function injectChromeCss() {
    if (document.getElementById('ho-chrome')) return;
    var link = document.createElement('link');
    link.id = 'ho-chrome';
    link.rel = 'stylesheet';
    link.href = sitePrefix() + 'assets/chrome.css?v=1';
    (document.body || document.head).appendChild(link);
  }

  function enhanceFooter(footer) {
    if (!footer || footer.getAttribute('data-chrome') === '1') return;
    var left = footer.querySelector(':scope > .left');
    if (left && !left.querySelector('.footer-social')) {
      var social = document.createElement('div');
      social.className = 'footer-social';
      social.innerHTML = [
        '<a href="https://www.instagram.com/haraldoeler/" target="_blank" rel="noopener">Instagram</a>',
        '<a href="https://www.youtube.com/@HO-yg4ur/videos" target="_blank" rel="noopener">YouTube</a>',
        '<a href="https://open.spotify.com/artist/1Oe30Bgo655dNTk0OEqmIA" target="_blank" rel="noopener">Spotify</a>'
      ].join('');
      left.appendChild(social);
    }
    var center = footer.querySelector(':scope > .center');
    if (center && !center.id && !cleanText(center.textContent)) {
      center.id = 'footer-next-concert';
    }
    footer.setAttribute('data-chrome', '1');
  }

  function watchChrome() {
    enhanceFooter(document.querySelector('.site-footer'));
    var root = document.getElementById('root');
    if (!root || typeof MutationObserver !== 'function') return;
    if (document.querySelector('.site-footer')) return;
    var obs = new MutationObserver(function () {
      var footer = document.querySelector('.site-footer');
      if (!footer) return;
      enhanceFooter(footer);
      obs.disconnect();
      initConcertTeasers();
    });
    obs.observe(root, { childList: true, subtree: true });
  }

  function shortDate(date) {
    var match = String(date || '').match(/^(\d{2})\.(\d{2})\./);
    return match ? match[1] + '.' + match[2] + '.' : date;
  }

  function shortPlace(location) {
    var raw = cleanText(location);
    if (!raw) return '';
    var parts = raw.split('·').map(function (part) { return part.trim(); }).filter(Boolean);
    var last = parts.length ? parts[parts.length - 1] : raw;
    if (/\d/.test(last) && parts.length > 1) last = parts[parts.length - 2];
    if (last.indexOf(',') !== -1) {
      var tail = last.split(',').pop().trim();
      if (tail) last = tail;
    }
    var words = last.split(' ');
    var small = { an: 1, der: 1, am: 1, im: 1, 'in': 1, bei: 1, und: 1 };
    if (words.length > 1 && parts.length === 1 && !small[words[words.length - 2].toLowerCase()]) {
      last = words[words.length - 1];
    }
    return last;
  }

  /* Resolve ../ relative to how assets/site.js was loaded */
  function sitePrefix() {
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].getAttribute('src') || '';
      var m = src.match(/^(.*\/)?assets\/site\.js/);
      if (m) return m[1] || '';
    }
    return '';
  }

  function cleanText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  var termineHtmlPromise = null;
  function fetchTermineHtml() {
    if (!window.fetch) return Promise.reject();
    if (!termineHtmlPromise) {
      termineHtmlPromise = fetch(sitePrefix() + 'termine.html').then(function (r) {
        if (!r.ok) throw new Error('termine');
        return r.text();
      });
    }
    return termineHtmlPromise;
  }

  function stripTags(value) {
    return cleanText(String(value || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&(?:amp|#38);/g, '&')
      .replace(/&(?:nbsp|#160);/g, ' ')
      .replace(/&(?:quot|#34);/g, '"')
      .replace(/&#39;|&apos;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>'));
  }

  function classBlock(html, className) {
    var at = html.indexOf('class="' + className + '"');
    if (at === -1) return '';
    var open = html.lastIndexOf('<', at);
    var gt = html.indexOf('>', at);
    if (open === -1 || gt === -1) return '';
    var tag = html.slice(open + 1, html.indexOf(' ', open));
    var end = html.indexOf('</' + tag + '>', gt);
    if (end === -1) return '';
    return html.slice(gt + 1, end);
  }

  /* String scan instead of DOMParser: termine.html is large, and building a
     document for the footer teaser was a long main-thread task. */
  function upcomingConcerts(html) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var chunks = html.split('<li class="concert-item"');
    var events = [];
    for (var i = 1; i < chunks.length; i++) {
      var chunk = chunks[i];
      var itemEnd = chunk.indexOf('</li>');
      if (itemEnd !== -1) chunk = chunk.slice(0, itemEnd);
      var gt = chunk.indexOf('>');
      var attrs = gt === -1 ? '' : chunk.slice(0, gt);
      var body = gt === -1 ? chunk : chunk.slice(gt + 1);
      var date = stripTags(classBlock(body, 'c-date'));
      var match = date.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
      var titleHtml = classBlock(body, 'c-title').replace(/<small\b[\s\S]*?<\/small>/gi, '');
      var idMatch = attrs.match(/\bid="([^"]*)"/);
      events.push({
        date: date,
        day: stripTags(classBlock(body, 'c-day')),
        title: stripTags(titleHtml),
        location: stripTags(classBlock(body, 'c-location')),
        parsedDate: match ? new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1])) : null,
        terminId: (idMatch && idMatch[1]) || (match ? 'termin-' + match[3] + '-' + match[2] + '-' + match[1] : ''),
        cancelled: body.indexOf('badge-abgesagt') !== -1,
        incomplete: /badge-abgesagt|\bc-tba\b|Uhrzeit folgt|Terminzeit TBA|Details TBA|Ort folgt/i.test(body)
      });
    }
    return events.filter(function (event) {
      return event.parsedDate && event.parsedDate >= today && event.title;
    }).sort(function (a, b) {
      return a.parsedDate - b.parsedDate;
    });
  }

  /* One termine.html fetch feeds the footer teaser and the homepage list. */
  function initConcertTeasers() {
    var footer = document.getElementById('footer-next-concert');
    var list = document.getElementById('home-concert-list');
    if ((!footer && !list) || !window.fetch) return;
    fetchTermineHtml().then(function (html) {
      var events = upcomingConcerts(html);
      if (footer) {
        var next = null;
        for (var i = 0; i < events.length; i++) {
          if (!events[i].incomplete) { next = events[i]; break; }
        }
        if (next) {
          var href = '/termine' + (next.terminId ? '#' + next.terminId : '');
          var place = shortPlace(next.location);
          footer.textContent = '';
          var link = document.createElement('a');
          link.href = href;
          link.textContent = 'Nächster Termin · ' + shortDate(next.date) + (place ? ' · ' + place : '');
          link.title = next.title + (next.location ? ' · ' + next.location : '');
          footer.appendChild(link);
        }
      }
      if (!list) return;
      var home = events.filter(function (event) { return !event.cancelled; }).slice(0, 3);
      if (!home.length) return;
      var key = home.map(function (event) { return event.date + '|' + event.title; }).join('||');
      if (list.getAttribute('data-concerts') === key) return;
      var markup = home.map(function (event) {
        var itemHref = '/termine' + (event.terminId ? '#' + event.terminId : '');
        return [
          '<li>',
            '<a class="hc-item-link" href="' + itemHref + '">',
              '<div class="hc-date">',
                escapeHtml(event.date),
                '<small>' + escapeHtml(event.day) + '</small>',
              '</div>',
              '<div>',
                '<div class="hc-title">' + escapeHtml(event.title) + '</div>',
                '<div class="hc-location">' + escapeHtml(event.location) + '</div>',
              '</div>',
              '<span class="hc-arrow" aria-hidden="true">Details →</span>',
            '</a>',
          '</li>'
        ].join('');
      }).join('');
      requestAnimationFrame(function () {
        list.setAttribute('data-concerts', key);
        list.innerHTML = markup;
      });
    }).catch(function () {});
  }

  function boot() {
    injectChromeCss();
    watchChrome();
    initScrollTop();
    initHeroHeader();
    initNav();
    if ('requestIdleCallback' in window) requestIdleCallback(initConcertTeasers, { timeout: 2000 });
    else setTimeout(initConcertTeasers, 1);
    bootReactPages();
  }

  function bootReactPages() {
    var root = document.getElementById('root');
    if (!root || initNav()) return;
    if (typeof MutationObserver !== 'function') {
      var tries = 0;
      var iv = setInterval(function () {
        tries++;
        if (initNav() || tries > 40) clearInterval(iv);
      }, 100);
      return;
    }
    var obs = new MutationObserver(function () {
      if (initNav()) obs.disconnect();
    });
    obs.observe(root, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* Re-init for React-hydrated pages (projekte.html) */
  window.HOSite = { initNav: initNav };
})();
