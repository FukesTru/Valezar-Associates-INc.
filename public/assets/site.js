// Valezar & Associates site script: phone menu, dropdowns, Contact us scrolling, chat pop-up,
// the contact form and the scroll movement. The site reads and works without it.
(function () {
  'use strict';
  var root = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.querySelector('.site-header');
  var menuButton = document.querySelector('[data-menu-toggle]');
  var menu = document.getElementById('mobile-menu');
  var chatButton = document.querySelector('[data-chat-toggle]');
  var chatPanel = document.getElementById('chat-panel');

  // Phone menu
  function setMenu(open) {
    if (!menu || !menuButton) return;
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    body.classList.toggle('menu-open', open);
    if (open) setChat(false);
  }
  if (menuButton) {
    menuButton.addEventListener('click', function () { setMenu(menu.hidden); });
  }
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1140 && menu && !menu.hidden) setMenu(false);
  });

  // Desktop dropdowns: open on hover or focus in CSS, and on press for touch and keyboard users
  document.querySelectorAll('.has-menu > .nav-link').forEach(function (button) {
    button.addEventListener('click', function () {
      var item = button.parentElement;
      var open = !item.classList.contains('open');
      document.querySelectorAll('.has-menu.open').forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.nav-link').setAttribute('aria-expanded', 'false');
      });
      item.classList.toggle('open', open);
      button.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', function (event) {
    if (!event.target.closest('.has-menu')) {
      document.querySelectorAll('.has-menu.open').forEach(function (item) {
        item.classList.remove('open');
        item.querySelector('.nav-link').setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Chat pop-up
  function setChat(open) {
    if (!chatPanel || !chatButton) return;
    chatPanel.hidden = !open;
    chatButton.setAttribute('aria-expanded', String(open));
    chatButton.setAttribute('aria-label', open ? 'Close chat' : 'Open chat');
    body.classList.toggle('chat-open', open);
    if (open) {
      var first = chatPanel.querySelector('a, button');
      if (first) first.focus({ preventScroll: true });
    }
  }
  if (chatButton) {
    chatButton.addEventListener('click', function () { setChat(chatPanel.hidden); });
  }
  document.querySelectorAll('[data-chat-close]').forEach(function (button) {
    button.addEventListener('click', function () { setChat(false); chatButton.focus(); });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    if (menu && !menu.hidden) { setMenu(false); menuButton.focus(); }
    if (chatPanel && !chatPanel.hidden) { setChat(false); chatButton.focus(); }
  });

  // Every Contact us button lands with the whole form in the middle of the screen,
  // clear of the sticky header above and the round buttons below.
  function scrollToForm(event) {
    var target = document.getElementById('contact-form');
    if (!target) return;
    event.preventDefault();
    setMenu(false);
    setChat(false);
    var headerHeight = header ? header.offsetHeight : 0;
    var round = document.querySelector('.round-call');
    var bottomEdge = round && getComputedStyle(round).display !== 'none' ? round.getBoundingClientRect().top - 8 : window.innerHeight;
    var room = bottomEdge - headerHeight;
    var rect = target.getBoundingClientRect();
    var top = rect.top + window.pageYOffset;
    var y = rect.height <= room ? top - headerHeight - (room - rect.height) / 2 : top - headerHeight - 12;
    window.scrollTo({ top: Math.max(0, y), behavior: reduceMotion ? 'auto' : 'smooth' });
    target.focus({ preventScroll: true });
  }
  document.querySelectorAll('[data-contact]').forEach(function (link) {
    link.addEventListener('click', scrollToForm);
  });

  // Contact form. Until the CRM form is connected, sending opens the visitor's email app
  // with the note filled in, addressed to the firm.
  document.querySelectorAll('[data-lead-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      var data = new FormData(form);
      var name = String(data.get('name') || '').trim();
      var lines = [
        'Name: ' + name,
        'Phone: ' + String(data.get('phone') || '').trim(),
        'Email: ' + String(data.get('email') || '').trim(),
        'Help with: ' + String(data.get('topic') || ''),
        'OK to text me about this enquiry: ' + (data.get('sms_ok') ? 'Yes' : 'No'),
        '',
        String(data.get('message') || '').trim(),
        '',
        'Sent from ' + window.location.href
      ];
      var address = form.getAttribute('data-to');
      var href = 'mailto:' + address + '?subject=' + encodeURIComponent('Website enquiry from ' + name) +
        '&body=' + encodeURIComponent(lines.join('\n'));
      var status = form.querySelector('.form-status');
      if (status) status.textContent = 'Your email app should open with your note ready to send. If it does not, call or text (305) 252-5505.';
      window.location.href = href;
    });
  });

  // Scroll movement: sections settle into place as they come into view
  var revealed = document.querySelectorAll('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealed.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealed.forEach(function (el) { observer.observe(el); });
  }
  root.classList.add('js-ready');
})();
