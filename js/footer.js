// js/footer.js
document.addEventListener("DOMContentLoaded", function() {
  const isSubFolder = window.location.pathname.includes('/tattoo-meanings/') || window.location.pathname.includes('/hanoi-travel-corner/');
  const rootPath = isSubFolder ? '../' : '';

  const footerHTML = `
    <footer class="site-footer">
      <div class="wrap footer-grid-custom" style="display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 40px;">
        <div>
          <strong style="color: var(--y); font-size: 1.2rem;">Mr Tattoo Hanoi Studio</strong>
          <p style="margin: 10px 0; opacity: 0.85;">Small, affordable tattoos in the heart of Hanoi's Old Quarter. Since 2012.</p>
          <p style="margin-top: 12px;">
            <a href="https://instagram.com/[tai-khoan]" target="_blank" rel="noopener">Instagram</a> · 
            <a href="https://facebook.com/[trang-cua-ban]" target="_blank" rel="noopener">Facebook</a> · 
            <a href="https://wa.me/84377616886" target="_blank" rel="noopener">WhatsApp</a>
          </p>
        </div>
        <div>
          <h4 style="color: var(--y); text-transform: uppercase; font-size: 1rem; margin-bottom: 16px;">Visit us</h4>
          <address style="font-style: normal; opacity: 0.85; line-height: 1.8;">
            106 P. Hàng Buồm, Phố cổ Hà Nội<br>
            Hoàn Kiếm, Hà Nội 100000, Vietnam<br>
            Open daily (Mở cả ngày)<br>
            <a href="tel:+84377616886">+84 377 616 886</a>
          </address>
        </div>
        <div>
          <h4 style="color: var(--y); text-transform: uppercase; font-size: 1rem; margin-bottom: 16px;">Explore</h4>
          <ul class="explore-list" style="list-style: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 8px;"><a href="${rootPath}index.html" style="color: var(--w); opacity: 0.85; text-decoration: none;">Home</a></li>
            <li style="margin-bottom: 8px;"><a href="${rootPath}gallery.html" style="color: var(--w); opacity: 0.85; text-decoration: none;">Portfolio</a></li>
            <li style="margin-bottom: 8px;"><a href="${rootPath}blog.html" style="color: var(--w); opacity: 0.85; text-decoration: none;">Blog &amp; Stories</a></li>
            <li style="margin-bottom: 8px;"><a href="${rootPath}index.html#lien-he" style="color: var(--w); opacity: 0.85; text-decoration: none;">Contact &amp; Map</a></li>
          </ul>
        </div>
      </div>
      <div class="wrap" style="margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; text-align: center;">
        <p class="copy" style="margin: 0; opacity: 0.6; font-size: 0.85rem;">© 2026 Mr Tattoo Hanoi Studio · mrtattoo.vn · All rights reserved.</p>
      </div>
    </footer>

    <!-- Nút nổi trên điện thoại -->
    <div class="float-cta">
      <a href="https://wa.me/84377616886" target="_blank" rel="noopener">WhatsApp</a>
      <a href="https://instagram.com/[tai-khoan]" target="_blank" rel="noopener">Instagram</a>
    </div>
  `;

  // Chèn footer vào cuối thẻ body
  document.body.insertAdjacentHTML('beforeend', footerHTML);
});