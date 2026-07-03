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
  replaceCalIcons();
  initConcertClicks();
  initStickyControls();
  addPosterButtons();
  initFilters();
  highlightFromHash();
})();
