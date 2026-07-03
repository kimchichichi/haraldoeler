/* Medien — Spotify preview + filter counts */
(function () {
  'use strict';

  var activeOverlay = null;

  function closeAll() {
    if (!activeOverlay) return;
    activeOverlay.classList.remove('is-open');
    activeOverlay.setAttribute('aria-hidden', 'true');
    var container = activeOverlay.querySelector('.sp-iframe-container');
    if (container) container.innerHTML = '';
    var card = activeOverlay.closest('.card');
    var btn = card && card.querySelector('.sp-preview-btn');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    activeOverlay = null;
  }

  function openOverlay(card) {
    var embedUrl = card.dataset.spotify;
    var overlay = card.querySelector('.spotify-overlay');
    var btn = card.querySelector('.sp-preview-btn');
    if (!overlay || !embedUrl) return;

    if (activeOverlay === overlay) { closeAll(); return; }
    closeAll();

    var iframe = document.createElement('iframe');
    iframe.src = embedUrl + (embedUrl.indexOf('?') > -1 ? '&' : '?') + 'autoplay=1';
    iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('loading', 'lazy');
    iframe.title = 'Spotify Vorschau';

    overlay.querySelector('.sp-iframe-container').appendChild(iframe);
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    activeOverlay = overlay;
  }

  function convertSpotifyCards() {
    document.querySelectorAll('a.card[data-spotify]').forEach(function (card) {
      var href = card.getAttribute('href');
      var div = document.createElement('div');
      div.className = card.className;
      Array.prototype.forEach.call(card.attributes, function (attr) {
        if (attr.name !== 'href' && attr.name !== 'class') {
          div.setAttribute(attr.name, attr.value);
        }
      });
      if (href) div.dataset.href = href;
      div.innerHTML = card.innerHTML;

      var wrap = div.querySelector('.image-wrap');
      if (wrap && !wrap.querySelector('.sp-preview-btn')) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sp-preview-btn';
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Spotify Vorschau abspielen');
        btn.textContent = '▶ Vorschau';
        var overlay = wrap.querySelector('.spotify-overlay');
        wrap.insertBefore(btn, overlay || null);
      }

      var arrow = div.querySelector('.arrow');
      if (arrow && href) {
        var link = document.createElement('a');
        link.className = arrow.className;
        link.href = href;
        link.target = '_blank';
        link.rel = 'noopener';
        link.innerHTML = arrow.innerHTML
          .replace(/mehr infos · spotify/i, 'mehr infos')
          .replace(/^spotify$/i, 'mehr infos');
        arrow.replaceWith(link);
      }

      card.replaceWith(div);
    });
  }

  function bindSpotify() {
    document.querySelectorAll('.card[data-spotify]').forEach(function (card) {
      var btn = card.querySelector('.sp-preview-btn');
      if (btn && !btn.__bound) {
        btn.__bound = true;
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          openOverlay(card);
        });
      }
    });

    document.querySelectorAll('.sp-close').forEach(function (btn) {
      if (btn.__bound) return;
      btn.__bound = true;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeAll();
      });
    });
  }

  convertSpotifyCards();
  bindSpotify();

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll();
  });
})();
