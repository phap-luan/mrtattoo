// js/header.js — TU DONG SINH boi build.js tu partials/header.html. Khong sua tay.
document.addEventListener('DOMContentLoaded', function () {
  var p = window.location.pathname;
  var isSub = p.indexOf('/mrtattoo/tattoo-meanings/') !== -1 || p.indexOf('/mrtattoo/hanoi-travel-corner/') !== -1 || p.indexOf('/mrtattoo/knowledge/') !== -1;
  var root = isSub ? '../../' : '';
  var TEMPLATE = "<header class=\"site-header\">\n  <a href=\"/mrtattoo/\" class=\"logo\">MR TATTOO HANOI<span>.</span></a>\n\n  <!-- Desktop menu -->\n  <nav class=\"desktop-nav\" aria-label=\"Main Navigation\">\n    <a href=\"/mrtattoo/\">Home</a>\n    <a href=\"/mrtattoo/info-mr-tattoo/\">About Us</a>\n    <a href=\"/mrtattoo/tattoo-gallery/\">Portfolio</a>\n    <a href=\"/mrtattoo/designs/\">Design</a>\n    <a href=\"/mrtattoo/#dich-vu\">Services</a>\n    <a href=\"/mrtattoo/blog/\">Blog</a>\n    <a href=\"/mrtattoo/contact/\">Contact</a>\n    <a href=\"/mrtattoo/#lien-he\" class=\"btn btn-small\">Book Now</a>\n  </nav>\n\n  <!-- Mobile hamburger button -->\n  <button class=\"mobile-menu-btn\" aria-label=\"Toggle Menu\" id=\"mobileMenuBtn\">\n    <span></span>\n    <span></span>\n    <span></span>\n  </button>\n</header>\n\n<!-- Mobile slide-out menu -->\n<div class=\"mobile-nav-overlay\" id=\"mobileNavOverlay\"></div>\n<nav class=\"mobile-nav\" id=\"mobileNav\" aria-label=\"Mobile Navigation\">\n  <button class=\"mobile-close-btn\" id=\"mobileCloseBtn\" aria-label=\"Close Menu\">&times;</button>\n  <a href=\"/mrtattoo/\">Home</a>\n  <a href=\"/mrtattoo/info-mr-tattoo/\">About Us</a>\n  <a href=\"/mrtattoo/tattoo-gallery/\">Portfolio</a>\n  <a href=\"/mrtattoo/designs/\">Design</a>\n  <a href=\"/mrtattoo/#dich-vu\">Services</a>\n  <a href=\"/mrtattoo/blog/\">Blog</a>\n  <a href=\"/mrtattoo/contact/\">Contact</a>\n  <a href=\"/mrtattoo/#lien-he\" class=\"btn\" style=\"text-align: center; margin-top: 15px;\">Book Now</a>\n</nav>\n";

  // Du phong: neu trang chua duoc build san header thi chen bang JS
  if (!document.querySelector('.site-header')) {
    document.body.insertAdjacentHTML('afterbegin', TEMPLATE.split('{{root}}').join(root));
  }

  // To mau muc menu cua trang hien tai
  var here = p.replace(/^\/mrtattoo/, '').replace(/index\.html$/, '');
  if (here.charAt(here.length - 1) !== '/') here += '/';
  document.querySelectorAll('.desktop-nav a:not(.btn)').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    if (href.indexOf('#') === -1 && href.replace(/^\/mrtattoo/, '') === here) {
      link.style.color = 'var(--y)';
    }
  });

  // blog.html#meanings | #travel | #knowledge -> mo dung tab chuyen de
  // (dung cho cac link "chuyen de" tu khoi Travel Corner & Blog o trang chu)
  function openBlogTabFromHash() {
    if (here !== '/blog/') return;
    var map = { meanings: 0, travel: 1, knowledge: 2 };
    var key = (window.location.hash || '').replace('#', '');
    var btns = document.querySelectorAll('.blog-tab-btn');
    if (map.hasOwnProperty(key) && btns[map[key]]) btns[map[key]].click();
  }
  openBlogTabFromHash();
  window.addEventListener('hashchange', openBlogTabFromHash);

  // Menu mobile
  var menuBtn = document.getElementById('mobileMenuBtn');
  var closeBtn = document.getElementById('mobileCloseBtn');
  var mobileNav = document.getElementById('mobileNav');
  var overlay = document.getElementById('mobileNavOverlay');
  if (!menuBtn || !mobileNav) return;

  function openMenu() {
    menuBtn.classList.add('active');
    mobileNav.classList.add('open');
    overlay.classList.add('open');
  }
  function closeMenu() {
    menuBtn.classList.remove('active');
    mobileNav.classList.remove('open');
    overlay.classList.remove('open');
  }
  menuBtn.addEventListener('click', function () {
    if (mobileNav.classList.contains('open')) closeMenu(); else openMenu();
  });
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  mobileNav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
});
