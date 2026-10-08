/* Kontakt form — FormSubmit AJAX, mailto if the provider rejects the send */
(function () {
  'use strict';

  var form = document.querySelector('.contact-form');
  var status = document.getElementById('formStatus');
  if (!form || !status) return;

  var EMAIL = 'harald.oeler@gmx.de';
  var INACTIVE_KEY = 'kontakt-formsubmit-inactive';

  var MESSAGE_PLACEHOLDERS = {
    Konzert: 'Datum, Ort, Besetzung',
    Unterricht: 'Instrument, Alter, Ort',
    Presse: 'Medium, Termin, gewünschte Unterlagen',
    Sonstiges: 'Ihre Nachricht …'
  };
  var DEFAULT_PLACEHOLDER = 'Ihre Nachricht …';

  function showStatus(msg, type) {
    status.hidden = false;
    status.style.display = 'block';
    status.textContent = msg;
    status.className = 'form-status form-status--' + (type || 'info');
  }

  function fieldValue(id) {
    var el = form.querySelector('#' + id);
    return el ? el.value.trim() : '';
  }

  function mailtoHref() {
    var chosen = fieldValue('cf-subject');
    var subject = chosen ? chosen + ' · haraldoeler.com' : 'Kontaktanfrage über haraldoeler.com';
    var body = 'Name: ' + fieldValue('cf-name')
      + '\nE-Mail: ' + fieldValue('cf-email')
      + '\n\n' + fieldValue('cf-message');
    return 'mailto:' + EMAIL
      + '?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body);
  }

  function openMailto() {
    var link = document.createElement('a');
    link.href = mailtoHref();
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function showMailtoFallback() {
    openMailto();
    status.hidden = false;
    status.style.display = 'block';
    status.className = 'form-status form-status--info';
    status.textContent = '';
    status.appendChild(document.createTextNode('E-Mail-Programm geöffnet — bitte dort senden. '));
    var again = document.createElement('a');
    again.href = mailtoHref();
    again.textContent = 'Erneut öffnen';
    status.appendChild(again);
  }

  function clearFieldErrors() {
    form.querySelectorAll('.field-group').forEach(function (g) {
      g.classList.remove('has-error');
      var err = g.querySelector('.field-error');
      if (err) err.remove();
    });
  }

  function setFieldError(id, msg) {
    var input = document.getElementById(id);
    if (!input) return;
    var group = input.closest('.field-group');
    if (!group) return;
    group.classList.add('has-error');
    var err = document.createElement('span');
    err.className = 'field-error';
    err.id = id + '-error';
    err.textContent = msg;
    input.setAttribute('aria-describedby', err.id);
    group.appendChild(err);
  }

  function validate() {
    clearFieldErrors();
    var ok = true;
    var name = form.querySelector('#cf-name');
    var email = form.querySelector('#cf-email');
    var message = form.querySelector('#cf-message');

    if (!name.value.trim()) {
      setFieldError('cf-name', 'Bitte Namen eingeben.');
      ok = false;
    }
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      setFieldError('cf-email', 'Bitte gültige E-Mail eingeben.');
      ok = false;
    }
    if (!message.value.trim()) {
      setFieldError('cf-message', 'Bitte Nachricht eingeben.');
      ok = false;
    }
    var subject = form.querySelector('#cf-subject');
    if (subject && !subject.value) {
      setFieldError('cf-subject', 'Bitte Betreff wählen.');
      ok = false;
    }
    return ok;
  }

  var subjectField = form.querySelector('#cf-subject');
  var messageField = form.querySelector('#cf-message');
  if (subjectField && messageField) {
    subjectField.addEventListener('change', function () {
      messageField.placeholder = MESSAGE_PLACEHOLDERS[subjectField.value] || DEFAULT_PLACEHOLDER;
    });
  }

  var copyBtn = document.getElementById('copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var label = copyBtn.textContent;
      function copied() {
        copyBtn.textContent = 'Kopiert';
        setTimeout(function () { copyBtn.textContent = label; }, 2000);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(EMAIL).then(copied);
      } else {
        window.location.href = 'mailto:' + EMAIL;
      }
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) {
      showStatus('Bitte Pflichtfelder korrekt ausfüllen.', 'error');
      return;
    }

    var btn = form.querySelector('.btn-send');
    if (btn) btn.disabled = true;

    var skipProvider = false;
    try { skipProvider = sessionStorage.getItem(INACTIVE_KEY) === '1'; } catch (err) { skipProvider = false; }

    if (skipProvider) {
      showMailtoFallback();
      if (btn) btn.disabled = false;
      return;
    }

    showStatus('Wird gesendet …', 'info');

    var replyTo = fieldValue('cf-email');
    var chosen = fieldValue('cf-subject');
    var subject = chosen ? chosen + ' · haraldoeler.com' : 'Kontaktanfrage über haraldoeler.com';

    fetch('https://formsubmit.co/ajax/' + encodeURIComponent(EMAIL), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      referrerPolicy: 'origin',
      body: JSON.stringify({
        name: fieldValue('cf-name'),
        email: replyTo,
        message: fieldValue('cf-message'),
        _replyto: replyTo,
        _subject: subject,
        _captcha: 'false',
        _template: 'table'
      })
    })
      .then(function (r) {
        return r.json().catch(function () { return {}; });
      })
      .then(function (data) {
        if (data && (data.success === 'true' || data.success === true)) {
          try { sessionStorage.removeItem(INACTIVE_KEY); } catch (err) { /* ignore */ }
          showStatus('Nachricht gesendet. Antwort in der Regel innerhalb weniger Tage.', 'success');
          form.reset();
          if (messageField) messageField.placeholder = DEFAULT_PLACEHOLDER;
          return;
        }
        var message = (data && data.message) ? String(data.message) : '';
        if (/activat/i.test(message) || /web server/i.test(message)) {
          try { sessionStorage.setItem(INACTIVE_KEY, '1'); } catch (err) { /* ignore */ }
        }
        showMailtoFallback();
      })
      .catch(function () {
        showMailtoFallback();
      })
      .finally(function () {
        if (btn) btn.disabled = false;
      });
  });
})();
