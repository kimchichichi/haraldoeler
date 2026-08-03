/* Medien — Spotify preview + dual-link discography cards */
(function () {
  'use strict';

  var activeOverlay = null;

  function isSpotifyUrl(url) {
    return !!url && /open\.spotify\.com/i.test(url);
  }

  function spotifyLinkFromEmbed(embedUrl) {
    if (!embedUrl) return '';
    return embedUrl
      .replace('https://open.spotify.com/embed/', 'https://open.spotify.com/')
      .replace(/\?utm_source=.*$/, '');
  }

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

  function appendCardLink(linksWrap, text, url) {
    var link = document.createElement('a');
    link.className = 'arrow';
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = text;
    linksWrap.appendChild(link);
  }

  function appendCardSep(linksWrap) {
    var sep = document.createElement('span');
    sep.className = 'card-links-sep';
    sep.setAttribute('aria-hidden', 'true');
    sep.textContent = '·';
    linksWrap.appendChild(sep);
  }

  function buildCardLinks(div, linkItems, arrow) {
    var svg = arrow.querySelector('svg');
    var svgHtml = svg ? svg.outerHTML : '';
    var linksWrap = document.createElement('div');
    linksWrap.className = 'card-links';

    linkItems.forEach(function (item, index) {
      if (index > 0) appendCardSep(linksWrap);
      appendCardLink(linksWrap, item.text, item.url);
    });

    if (svgHtml && linkItems.length) {
      var trail = document.createElement('span');
      trail.className = 'arrow arrow-icon';
      trail.setAttribute('aria-hidden', 'true');
      trail.innerHTML = svgHtml;
      linksWrap.appendChild(trail);
    }

    arrow.replaceWith(linksWrap);
  }

  function convertSpotifyCards() {
    document.querySelectorAll('a.card[data-spotify]').forEach(function (card) {
      var href = card.getAttribute('href');
      var infoUrl = card.dataset.info || (href && !isSpotifyUrl(href) ? href : '');
      var spotifyLink = card.dataset.spotifyLink
        || (href && isSpotifyUrl(href) ? href : spotifyLinkFromEmbed(card.dataset.spotify));

      var div = document.createElement('div');
      div.className = card.className;
      Array.prototype.forEach.call(card.attributes, function (attr) {
        if (attr.name !== 'href' && attr.name !== 'class') {
          div.setAttribute(attr.name, attr.value);
        }
      });
      if (infoUrl) div.dataset.info = infoUrl;
      if (spotifyLink) div.dataset.spotifyLink = spotifyLink;
      if (card.dataset.appleLink) div.dataset.appleLink = card.dataset.appleLink;
      if (card.dataset.youtubeLink) div.dataset.youtubeLink = card.dataset.youtubeLink;
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
      if (arrow) {
        var linkItems = [];
        if (infoUrl) linkItems.push({ text: 'mehr infos', url: infoUrl });
        if (spotifyLink) linkItems.push({ text: 'spotify', url: spotifyLink });
        if (card.dataset.appleLink) linkItems.push({ text: 'apple music', url: card.dataset.appleLink });
        if (card.dataset.youtubeLink) linkItems.push({ text: 'youtube', url: card.dataset.youtubeLink });
        buildCardLinks(div, linkItems, arrow);
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
