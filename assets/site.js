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
    /* Quiet text control — replace FAB icon markup site-wide */
    btn.innerHTML = '<span aria-hidden="true">↑</span> Nach oben';
    var showAt = 640;
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
    link.href = sitePrefix() + 'assets/chrome.css?v=27';
    (document.body || document.head).appendChild(link);
  }

  var SOCIAL_ICONS = {
    instagram: {
      label: 'Instagram',
      svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>'
    },
    youtube: {
      label: 'YouTube',
      svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/></svg>'
    },
    spotify: {
      label: 'Spotify',
      svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 17.34c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3 1.02zm1.44-3.3c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.38-.48.12-1.02-.12-1.14-.66-.12-.48.12-1.02.66-1.14 4.38-1.32 9.76-.66 13.46 1.62.36.18.54.78.22 1.26zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.3c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.48-1.02.66-1.56.36z"/></svg>'
    },
    facebook: {
      label: 'Facebook',
      svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 13.5h2.5l.5-3H14V8.75c0-.83.17-1.25 1.34-1.25H17V5.08C16.69 5.03 15.8 5 14.79 5 12.6 5 11 6.24 11 8.65V10.5H8.5v3H11V20h3v-6.5z"/></svg>'
    }
  };

  function socialKind(href) {
    var url = String(href || '').toLowerCase();
    if (url.indexOf('instagram') !== -1) return 'instagram';
    if (url.indexOf('youtube') !== -1 || url.indexOf('youtu.be') !== -1) return 'youtube';
    if (url.indexOf('spotify') !== -1) return 'spotify';
    if (url.indexOf('facebook') !== -1 || url.indexOf('fb.com') !== -1) return 'facebook';
    return null;
  }

  function socialLinkHtml(kind, href) {
    var meta = SOCIAL_ICONS[kind];
    if (!meta) return '';
    return '<a href="' + href + '" target="_blank" rel="noopener" aria-label="' + meta.label + '" title="' + meta.label + '">' + meta.svg + '</a>';
  }

  function iconifyFooterSocial(container) {
    if (!container || container.getAttribute('data-icons') === '1') return;
    Array.prototype.forEach.call(container.querySelectorAll('a'), function (a) {
      var kind = socialKind(a.getAttribute('href') || '');
      var meta = kind && SOCIAL_ICONS[kind];
      if (!meta) return;
      a.setAttribute('aria-label', meta.label);
      a.setAttribute('title', meta.label);
      a.innerHTML = meta.svg;
    });
    container.setAttribute('data-icons', '1');
  }

  function enhanceFooter(footer) {
    if (!footer || footer.getAttribute('data-chrome') === '1') return;
    var left = footer.querySelector(':scope > .left');
    if (left && !left.querySelector('.footer-social')) {
      var social = document.createElement('div');
      social.className = 'footer-social';
      social.innerHTML = [
        socialLinkHtml('instagram', 'https://www.instagram.com/haraldoeler/'),
        socialLinkHtml('youtube', 'https://www.youtube.com/@HO-yg4ur/videos'),
        socialLinkHtml('spotify', 'https://open.spotify.com/artist/1Oe30Bgo655dNTk0OEqmIA')
      ].join('');
      left.appendChild(social);
    }
    var existingSocial = footer.querySelector('.footer-social');
    if (existingSocial) iconifyFooterSocial(existingSocial);
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

  /* Homepage concert rows: venue name only (street detail stays on Termine). */
  function venueOnly(location) {
    var raw = cleanText(location);
    if (!raw) return '';
    return raw.split('·')[0].trim();
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
                '<div class="hc-location">' + escapeHtml(venueOnly(event.location)) + '</div>',
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

  function initNewsArticle() {
    var head = document.querySelector('.article-head');
    var nav = document.querySelector('.article-nav');
    if (!head || !nav) return;

    var back = nav.querySelector('.back-link');
    if (back && cleanText(back.textContent).toLowerCase() === 'news') {
      back.textContent = 'Alle News';
    }

    addProjectChip(head);
    var sections = concertSections();
    sections.forEach(function (sec) { sec.classList.add('is-dates'); });
    addCalendarLinks(sections);
    addTicketLink();
    initGallery();
    loadArticlePager(nav);
  }

  function addProjectChip(head) {
    if (head.querySelector('.project-chip')) return;
    var eyebrow = head.querySelector('.article-eyebrow');
    var title = head.querySelector('.article-title');
    var sub = head.querySelector('.article-subtitle');
    var blob = [eyebrow, title, sub].map(function (el) {
      return el ? el.textContent : '';
    }).join(' ').toLowerCase();
    var chip = '';
    if (/klakk/.test(blob)) chip = 'KlAkk!';
    else if (/via!|duo via/.test(blob)) chip = 'ViA!';
    else if (/\bsolo\b/.test(blob)) chip = 'Solo';
    if (!chip) return;
    var el = document.createElement('p');
    el.className = 'project-chip';
    el.textContent = chip;
    var anchor = sub || title;
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(el, anchor.nextSibling);
  }

  function concertSections() {
    return Array.prototype.filter.call(document.querySelectorAll('.info-section'), function (sec) {
      var label = sec.querySelector('.info-label');
      return label && /konzertdaten/i.test(label.textContent || '');
    });
  }

  function pad2(n) {
    n = String(n);
    return n.length < 2 ? '0' + n : n;
  }

  function googleCalUrl(title, dm, tm, location) {
    var d = pad2(dm[1]);
    var m = pad2(dm[2]);
    var y = dm[3];
    var start;
    var end;
    if (tm) {
      var hh = parseInt(tm[1], 10);
      var mm = parseInt(tm[2], 10);
      var endMin = hh * 60 + mm + 120;
      start = y + m + d + 'T' + pad2(hh) + pad2(mm) + '00';
      end = y + m + d + 'T' + pad2(Math.floor(endMin / 60)) + pad2(endMin % 60) + '00';
    } else {
      start = y + m + d;
      var dt = new Date(Date.UTC(+y, +m - 1, +d + 1));
      end = dt.getUTCFullYear() + pad2(dt.getUTCMonth() + 1) + pad2(dt.getUTCDate());
    }
    return 'https://www.google.com/calendar/render?action=TEMPLATE'
      + '&text=' + encodeURIComponent(title)
      + '&dates=' + start + '/' + end
      + (location ? '&location=' + encodeURIComponent(location) : '')
      + '&ctz=Europe/Berlin';
  }

  function addCalendarLinks(sections) {
    var pageTitle = document.querySelector('.article-title');
    var fallbackTitle = pageTitle ? cleanText(pageTitle.textContent) : 'Konzert';
    sections.forEach(function (sec) {
      var entries = sec.querySelectorAll('.concert-entry');
      var targets = entries.length ? Array.prototype.slice.call(entries) : [sec];
      targets.forEach(function (entry) {
        if (entry.querySelector('.cal-link')) return;
        var dateEl = entry.querySelector('.concert-date') || sec.querySelector('.concert-date');
        if (!dateEl) return;
        var raw = cleanText(dateEl.textContent);
        var dm = raw.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
        if (!dm) return;
        var tm = raw.match(/(\d{1,2})[:.](\d{2})\s*Uhr/);
        var titleEl = entry.querySelector('.concert-title');
        var title = titleEl ? cleanText(titleEl.textContent) : fallbackTitle;
        var venueEl = entry.querySelector('.concert-venue');
        var location = venueEl ? cleanText(venueEl.textContent) : '';
        var line = document.createElement('p');
        line.className = 'cal-line';
        var a = document.createElement('a');
        a.className = 'cal-link';
        a.href = googleCalUrl(title, dm, tm, location);
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = 'Kalender';
        line.appendChild(a);
        var slot = venueEl || dateEl;
        if (slot.parentNode) slot.parentNode.insertBefore(line, slot.nextSibling);
      });
    });
  }

  function addTicketLink() {
    if (document.querySelector('.ticket-link')) return;
    var links = document.querySelectorAll('main a[href]');
    var found = null;
    for (var i = 0; i < links.length; i++) {
      var href = (links[i].getAttribute('href') || '').toLowerCase();
      var text = (links[i].textContent || '').toLowerCase();
      if (/ticket|eventim|reservix/.test(href) || /\b(tickets?|kartenvorverkauf|karten)\b/.test(text) || /\bkarten\b/.test(href)) {
        found = links[i];
        break;
      }
    }
    if (!found) return;
    var sec = document.querySelector('.info-section.is-dates') || document.querySelector('.article-info');
    if (!sec) return;
    var p = document.createElement('p');
    p.className = 'ticket-link';
    var a = document.createElement('a');
    a.href = found.getAttribute('href');
    a.textContent = 'Tickets';
    if (/^https?:/i.test(found.getAttribute('href') || '')) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
    p.appendChild(a);
    var label = sec.querySelector('.info-label');
    if (label) label.insertAdjacentElement('afterend', p);
    else sec.appendChild(p);
  }

  function initGallery() {
    var imgs = document.querySelectorAll('.media-gallery img, img.media-photo');
    var list = Array.prototype.filter.call(imgs, function (img) {
      if (img.classList.contains('partner-logo')) return false;
      return !(img.closest && img.closest('a'));
    });
    if (!list.length) return;

    var box = document.createElement('div');
    box.className = 'news-lightbox';
    box.hidden = true;
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Bild');
    box.innerHTML = '<button type="button" class="news-lightbox-close" aria-label="Schließen">×</button><figure><img alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(box);
    var big = box.querySelector('img');
    var cap = box.querySelector('figcaption');
    var closeBtn = box.querySelector('.news-lightbox-close');
    var last = null;

    function open(img) {
      last = img;
      big.src = img.currentSrc || img.src;
      big.alt = img.alt || '';
      cap.textContent = img.alt || '';
      cap.hidden = !img.alt;
      box.hidden = false;
      document.body.classList.add('news-lightbox-open');
      closeBtn.focus();
    }
    function close() {
      box.hidden = true;
      big.removeAttribute('src');
      document.body.classList.remove('news-lightbox-open');
      if (last && last.focus) last.focus();
    }
    closeBtn.addEventListener('click', close);
    box.addEventListener('click', function (e) {
      if (e.target === box) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !box.hidden) close();
    });

    list.forEach(function (img) {
      img.classList.add('is-zoomable');
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.setAttribute('aria-haspopup', 'dialog');
      img.setAttribute('aria-label', img.alt ? 'Vergrößern: ' + img.alt : 'Bild vergrößern');
      img.addEventListener('click', function () { open(img); });
      img.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(img);
        }
      });
    });
  }

  function decodeTitle(html) {
    return String(html || '')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&nbsp;/g, ' ')
      .replace(/&#160;/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&apos;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  function pagerLink(item, dir) {
    var a = document.createElement('a');
    a.href = item.href;
    a.className = dir === 'prev' ? 'pager-prev' : 'pager-next';
    a.setAttribute('aria-label', (dir === 'prev' ? 'Vorheriger Beitrag: ' : 'Nächster Beitrag: ') + item.title);
    var dirEl = document.createElement('span');
    dirEl.className = 'pager-dir';
    dirEl.textContent = dir === 'prev' ? '‹ Vorheriger' : 'Nächster ›';
    var titleEl = document.createElement('span');
    titleEl.className = 'pager-title';
    titleEl.textContent = item.title;
    // Same stack order on both sides: label above title
    a.appendChild(dirEl);
    a.appendChild(titleEl);
    return a;
  }

  function loadArticlePager(nav) {
    var slug = location.pathname.replace(/\.html$/i, '').replace(/\/$/, '').split('/').pop();
    if (nav.querySelector('.article-pager')) return;
    fetch(sitePrefix() + 'news.html').then(function (r) {
      if (!r.ok) throw new Error('news');
      return r.text();
    }).then(function (html) {
      var items = [];
      var re = /<a class="card\b[^>]*href="([^"]+)"[^>]*data-date="(\d{4}-\d{2}-\d{2})"[\s\S]*?<h2>([\s\S]*?)<\/h2>/g;
      var m;
      while ((m = re.exec(html))) {
        items.push({
          href: m[1],
          id: m[1].replace(/\.html$/i, '').split('/').pop(),
          date: m[2],
          title: decodeTitle(m[3]),
          i: items.length
        });
      }
      items.sort(function (a, b) {
        if (a.date !== b.date) return a.date < b.date ? -1 : 1;
        return a.i - b.i;
      });
      var idx = -1;
      for (var i = 0; i < items.length; i++) {
        if (items[i].id === slug) { idx = i; break; }
      }
      if (idx < 0) return;
      var pager = document.createElement('div');
      pager.className = 'article-pager';
      var prevSlot = document.createElement('div');
      prevSlot.className = 'pager-slot pager-slot-prev';
      var nextSlot = document.createElement('div');
      nextSlot.className = 'pager-slot pager-slot-next';
      if (idx > 0) prevSlot.appendChild(pagerLink(items[idx - 1], 'prev'));
      if (idx < items.length - 1) nextSlot.appendChild(pagerLink(items[idx + 1], 'next'));
      if (!prevSlot.childNodes.length && !nextSlot.childNodes.length) return;
      pager.appendChild(prevSlot);
      pager.appendChild(nextSlot);
      nav.appendChild(pager);
    }).catch(function () {});
  }

  function boot() {
    injectChromeCss();
    watchChrome();
    initScrollTop();
    initHeroHeader();
    initNav();
    initNewsArticle();
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
