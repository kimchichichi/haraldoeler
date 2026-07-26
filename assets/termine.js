/* Termine page enhancements */
(function () {
  'use strict';

  var MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

  function assignConcertIds() {
    document.querySelectorAll('.concert-item').forEach(function (item) {
      if (item.id) return;
      var dateEl = item.querySelector('.c-date');
      if (!dateEl) return;
      var m = dateEl.textContent.trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
      if (m) item.id = 'termin-' + m[3] + '-' + m[2] + '-' + m[1];
    });
  }

  function insertMonthDividers() {
    var list = document.querySelector('.concert-list');
    if (!list) return;
    var items = Array.from(list.querySelectorAll('.concert-item'));
    var lastKey = '';
    items.forEach(function (item) {
      var dateEl = item.querySelector('.c-date');
      if (!dateEl) return;
      var m = dateEl.textContent.trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
      if (!m) return;
      var key = m[3] + '-' + m[2];
      if (key === lastKey) return;
      lastKey = key;
      var divider = document.createElement('li');
      divider.className = 'month-divider';
      divider.setAttribute('aria-hidden', 'true');
      divider.textContent = MONTHS[Number(m[2]) - 1] + ' ' + m[3];
      list.insertBefore(divider, item);
    });
  }

  function replaceCalIcons() {
    var svg = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
    document.querySelectorAll('.cal-icon').forEach(function (el) {
      el.innerHTML = svg;
    });
  }

  function initConcertClicks() {
    document.querySelectorAll('.concert-item').forEach(function (item) {
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'article');
      function highlight() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        item.classList.add('is-highlighted');
        window.setTimeout(function () { item.classList.remove('is-highlighted'); }, 1600);
      }
      item.addEventListener('click', function (e) {
        if (e.target.closest('a, button')) return;
        highlight();
      });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target.closest('a')) return;
          e.preventDefault();
          highlight();
        }
      });
    });
  }

  function initStickyControls() {
    var bar = document.querySelector('.controls-bar');
    if (!bar) return;
    bar.classList.add('is-sticky');
    var header = document.querySelector('.site-header');
    function syncHeaderH() {
      if (header) {
        document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
      }
    }
    syncHeaderH();
    window.addEventListener('resize', syncHeaderH, { passive: true });
  }

  function initFilters() {
    var searchInput = document.getElementById('concert-search');
    var items = document.querySelectorAll('.concert-item');
    var emptyEl = document.getElementById('termine-empty');
    if (!searchInput || !items.length) return;

    var originals = Array.from(items).map(function (item) { return item.innerHTML; });
    var activeYear = 'all';

    function escapeRe(s) {
      return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function highlightIn(html, q) {
      return html.replace(/>([^<]*)</g, function (match, text) {
        return '>' + text.replace(new RegExp('(' + escapeRe(q) + ')', 'gi'), '<mark class="search-hl">$1</mark>') + '<';
      });
    }

    function getItemYear(item) {
      var el = item.querySelector('.c-date');
      if (!el) return null;
      var m = el.textContent.match(/\d{4}/);
      return m ? m[0] : null;
    }

    function applyFilters() {
      var q = searchInput.value.trim();
      var visible = 0;

      items.forEach(function (item, i) {
        item.innerHTML = originals[i];
        var year = getItemYear(item);
        var yearMatch = activeYear === 'all' || year === activeYear;
        var textMatch = q === '' || item.textContent.toLowerCase().includes(q.toLowerCase());
        var show = yearMatch && textMatch;
        item.style.display = show ? '' : 'none';
        if (show) visible++;
        if (show && q !== '') item.innerHTML = highlightIn(originals[i], q);
      });

      document.querySelectorAll('.month-divider').forEach(function (divider) {
        var next = divider.nextElementSibling;
        var hasVisible = false;
        while (next && !next.classList.contains('month-divider')) {
          if (next.classList.contains('concert-item') && next.style.display !== 'none') hasVisible = true;
          next = next.nextElementSibling;
        }
        divider.style.display = hasVisible ? '' : 'none';
      });

      if (emptyEl) emptyEl.classList.toggle('is-visible', visible === 0);
    }

    document.querySelectorAll('.yr-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.yr-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        activeYear = btn.dataset.yr;
        applyFilters();
      });
    });

    searchInput.addEventListener('input', applyFilters);

    var resetBtn = document.getElementById('termine-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        searchInput.value = '';
        activeYear = 'all';
        document.querySelectorAll('.yr-btn').forEach(function (b) {
          b.classList.toggle('active', b.dataset.yr === 'all');
        });
        applyFilters();
      });
    }

    window.termineApplyFilters = applyFilters;
  }

  function addPosterButtons() {
    document.querySelectorAll('.concert-item').forEach(function (item) {
      var posterHref = item.dataset.poster;
      if (!posterHref || item.querySelector('.c-poster-link')) return;
      var actions = item.querySelector('.c-right');
      var infoLink = item.querySelector('.c-info-link');
      if (!actions || !infoLink) return;
      var posterLink = document.createElement('a');
      posterLink.className = 'c-info-link c-poster-link';
      posterLink.href = posterHref;
      posterLink.target = '_blank';
      posterLink.rel = 'noopener';
      posterLink.innerHTML = 'plakat <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 6H14M8 1l6 5-6 5"/></svg>';
      actions.insertBefore(posterLink, infoLink.nextSibling);
    });
  }

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  /** Convert Berlin wall-clock time to UTC YYYYMMDDTHHMMSSZ */
  function berlinToUtcStamp(y, m, d, h, min) {
    var want = Date.UTC(y, m - 1, d, h, min, 0);
    var t = want;
    var dtf = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Berlin',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23'
    });
    for (var i = 0; i < 4; i++) {
      var parts = {};
      dtf.formatToParts(new Date(t)).forEach(function (p) {
        if (p.type !== 'literal') parts[p.type] = p.value;
      });
      var got = Date.UTC(
        Number(parts.year),
        Number(parts.month) - 1,
        Number(parts.day),
        Number(parts.hour),
        Number(parts.minute),
        Number(parts.second || 0)
      );
      t += want - got;
    }
    var dt = new Date(t);
    return (
      dt.getUTCFullYear() +
      pad2(dt.getUTCMonth() + 1) +
      pad2(dt.getUTCDate()) +
      'T' +
      pad2(dt.getUTCHours()) +
      pad2(dt.getUTCMinutes()) +
      pad2(dt.getUTCSeconds()) +
      'Z'
    );
  }

  function titleText(titleEl) {
    if (!titleEl) return '';
    var out = '';
    var nodes = titleEl.childNodes;
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeType === 3) out += nodes[i].textContent;
    }
    return out.replace(/\s+/g, ' ').trim();
  }

  function descriptionText(item, titleEl) {
    var bits = [];
    if (titleEl) {
      titleEl.querySelectorAll('small').forEach(function (s) {
        var t = s.textContent.replace(/\s+/g, ' ').trim();
        if (t) bits.push(t);
      });
    }
    var info = item.querySelector('.c-info-link');
    if (info && info.href && !/haraldoeler\.com\/?$/.test(info.href)) {
      bits.push(info.href);
    }
    return bits.join(' · ');
  }

  function locationText(item) {
    var locEl = item.querySelector('.c-location');
    if (!locEl) return '';
    return locEl.textContent.replace(/\s+/g, ' ').trim();
  }

  function parseConcertTime(dayEl) {
    if (!dayEl) return null;
    var t = dayEl.textContent.replace(/\s+/g, ' ').trim();
    if (/uhrzeit folgt|tba/i.test(t)) return null;
    var m = t.match(/(\d{1,2})[.:](\d{2})\s*Uhr/i);
    if (!m) return null;
    return { h: Number(m[1]), min: Number(m[2]) };
  }

  function icsEscape(s) {
    return String(s)
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;');
  }

  function slugifyFilename(s) {
    return String(s)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_|_$/g, '')
      .slice(0, 60) || 'konzert';
  }

  function encodeIcalDataUri(ics) {
    // Keep structural colons readable; leave CRLF as %0D%0A from encodeURIComponent
    return 'data:text/calendar;charset=utf8,' + encodeURIComponent(ics).replace(/%3A/gi, ':');
  }

  function buildCalendarLinks() {
    document.querySelectorAll('.concert-item').forEach(function (item) {
      if (item.querySelector('.c-tba')) return;
      var dateEl = item.querySelector('.c-date');
      var dayEl = item.querySelector('.c-day');
      var titleEl = item.querySelector('.c-title');
      if (!dateEl) return;
      var dm = dateEl.textContent.trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
      var time = parseConcertTime(dayEl);
      if (!dm || !time) return;

      var y = Number(dm[3]);
      var mo = Number(dm[2]);
      var d = Number(dm[1]);
      var title = titleText(titleEl);
      if (!title) return;
      var details = descriptionText(item, titleEl);
      var location = locationText(item);
      if (/ort folgt/i.test(location)) return;

      var start = berlinToUtcStamp(y, mo, d, time.h, time.min);
      var end = berlinToUtcStamp(y, mo, d, time.h + 2, time.min);

      var gParams = new URLSearchParams({
        action: 'TEMPLATE',
        text: title,
        details: details,
        location: location,
        dates: start + '/' + end
      });
      var googleHref = 'https://www.google.com/calendar/render?' + gParams.toString();

      var ics =
        'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\n' +
        'SUMMARY:' + icsEscape(title) + '\r\n' +
        (details ? 'DESCRIPTION:' + icsEscape(details) + '\r\n' : '') +
        'DTSTART:' + start + '\r\n' +
        'DTEND:' + end + '\r\n' +
        (location ? 'LOCATION:' + icsEscape(location) + '\r\n' : '') +
        'END:VEVENT\r\nEND:VCALENDAR';

      var icalHref = encodeIcalDataUri(ics);
      var filename =
        slugifyFilename(title) + '_' + y + '-' + pad2(mo) + '-' + pad2(d) + '.ics';

      var cal = item.querySelector('.c-cal');
      if (!cal) {
        var right = item.querySelector('.c-right');
        if (!right) return;
        cal = document.createElement('div');
        cal.className = 'c-cal';
        right.appendChild(cal);
      }

      cal.innerHTML = '';
      var icon = document.createElement('span');
      icon.className = 'cal-icon';
      cal.appendChild(icon);

      var gLink = document.createElement('a');
      gLink.href = googleHref;
      gLink.target = '_blank';
      gLink.rel = 'noopener';
      gLink.textContent = 'Google';
      cal.appendChild(gLink);

      var sep = document.createElement('span');
      sep.textContent = '|';
      cal.appendChild(sep);

      var iLink = document.createElement('a');
      iLink.href = icalHref;
      iLink.setAttribute('download', filename);
      iLink.textContent = 'iCal';
      cal.appendChild(iLink);
    });
  }

  function highlightFromHash() {
    if (!location.hash) return;
    var target = document.querySelector(location.hash);
    if (target && target.classList.contains('concert-item')) {
      window.setTimeout(function () {
        target.classList.add('is-highlighted');
        target.scrollIntoView({ block: 'center' });
      }, 300);
    }
  }

  assignConcertIds();
  insertMonthDividers();
  buildCalendarLinks();
  replaceCalIcons();
  initConcertClicks();
  initStickyControls();
  addPosterButtons();
  initFilters();
  highlightFromHash();
})();
