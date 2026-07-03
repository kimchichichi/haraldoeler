/* Kontakt form — FormSubmit AJAX */
(function () {
  'use strict';

  var form = document.querySelector('.contact-form');
  var status = document.getElementById('formStatus');
  if (!form || !status) return;

  var EMAIL = 'harald.oeler@gmx.de';

  function showStatus(msg, type) {
    status.style.display = 'block';
    status.textContent = msg;
    status.className = 'form-status form-status--' + (type || 'info');
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
    return ok;
  }

  var copyBtn = document.getElementById('copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(EMAIL).then(function () {
          showStatus('E-Mail-Adresse kopiert.', 'success');
        });
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
    showStatus('Wird gesendet …', 'info');

    var payload = new FormData();
    payload.append('name', form.querySelector('#cf-name').value.trim());
    payload.append('email', form.querySelector('#cf-email').value.trim());
    payload.append('message', form.querySelector('#cf-message').value.trim());
    payload.append('_replyto', form.querySelector('#cf-email').value.trim());
    payload.append('_subject', (form.querySelector('#cf-subject').value.trim() || 'Kontaktanfrage über haraldoeler.com'));
    payload.append('_captcha', 'false');
    payload.append('_template', 'table');

    fetch('https://formsubmit.co/ajax/' + encodeURIComponent(EMAIL), {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: payload
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.success === 'true' || data.success === true) {
          showStatus('Vielen Dank — Ihre Nachricht wurde gesendet.', 'success');
          form.reset();
        } else {
          throw new Error(data.message || 'Senden fehlgeschlagen');
        }
      })
      .catch(function () {
        showStatus('Senden fehlgeschlagen. Bitte E-Mail kopieren oder direkt schreiben.', 'error');
      })
      .finally(function () {
        if (btn) btn.disabled = false;
      });
  });
})();
