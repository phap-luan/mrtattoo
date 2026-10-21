// js/header.js
document.addEventListener("DOMContentLoaded", function() {
  // Kiểm tra xem trang hiện tại đang nằm ở thư mục gốc hay thư mục con
  const isSubFolder = window.location.pathname.includes('/tattoo-meanings/') || window.location.pathname.includes('/hanoi-travel-corner/');
  const rootPath = isSubFolder ? '../' : '';

  const headerHTML = `
    <header class="site-header">
      <a href="${rootPath}index.html" class="logo">MR TATTOO HANOI<span>.</span></a>
      <nav aria-label="Main Navigation">
        <a href="${rootPath}index.html">Home</a>
        <a href="${rootPath}gallery.html">Portfolio</a>
        <a href="${rootPath}index.html#dich-vu">Services</a>
        <a href="${rootPath}blog.html" style="color: var(--y);">Blog</a>
        <a href="${rootPath}index.html#lien-he" class="btn btn-small">Book Now</a>
      </nav>
    </header>
  `;

  // Chèn header vào ngay đầu thẻ body
  document.body.insertAdjacentHTML('afterbegin', headerHTML);
});