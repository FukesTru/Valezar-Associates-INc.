// Valezar & Associates site script: phone menu, dropdowns, Contact us scrolling and the scroll movement.
// The site reads and works without it. The contact form and the chat come from the CRM embeds.
(function () {
  'use strict';
  var root = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.querySelector('.site-header');
  var menuButton = document.querySelector('[data-menu-toggle]');
  var menu = document.getElementById('mobile-menu');

  // Phone menu
  function setMenu(open) {
    if (!menu || !menuButton) return;
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    body.classList.toggle('menu-open', open);
  }
  if (menuButton) {
    menuButton.addEventListener('click', function () { setMenu(menu.hidden); });
  }
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1240 && menu && !menu.hidden) setMenu(false);
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

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    if (menu && !menu.hidden) { setMenu(false); menuButton.focus(); }
  });

  // Every Contact us button lands with the whole form in the middle of the screen,
  // clear of the sticky header above and the round buttons below.
  function scrollToForm(event) {
    var target = document.getElementById('contact-form');
    if (!target) return;
    event.preventDefault();
    setMenu(false);
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
