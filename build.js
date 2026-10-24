const fs = require('fs');
const path = require('path');

const SITE = 'https://mrtattoo.vn';
const STUDIO = 'Mr Tattoo Hanoi Studio';
const LOGO_URL = `${SITE}/images/og-cover.jpg`;

// Các trang tĩnh ở thư mục gốc sẽ được nhúng sẵn header/footer
const STATIC_PAGES = ['index.html', 'about-us.html', 'gallery.html', 'design.html', 'blog.html', 'contact.html'];

const articles = require('./articles.json');

/* ------------------------------------------------------------------ */
/* Tiện ích                                                            */
/* ------------------------------------------------------------------ */
const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
  .replace(/</g, '&lt;').replace(/>/g, '&gt;');

// JSON-LD an toàn (không bị đóng thẻ script giữa chừng)
const ldJson = obj => JSON.stringify(obj, null, 2).replace(/</g, '\\u003c');

const pad = n => String(n).padStart(2, '0');

// Chuẩn hóa MỌI kiểu ngày về "YYYY-MM-DD" (chuẩn ISO 8601 cho SEO). Trả về null nếu không đọc được.
//   2026-10-22 | 2026/10/22  -> năm trước
//   22-10-2026 | 22/10/2026 | 22.10.2026 -> ngày/tháng/năm (kiểu Việt Nam)
//   "October 22, 2026" | "22 October 2026" -> chữ tháng tiếng Anh
function isoDate(str) {
  if (str == null) return null;
  const s = String(str).trim();
  const valid = (y, m, d) => {
    const t = new Date(Date.UTC(y, m - 1, d));
    return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d
      ? `${y}-${pad(m)}-${pad(d)}` : null;
  };
  let m = s.match(/^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})/);
  if (m) return valid(+m[1], +m[2], +m[3]);
  m = s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
  if (m) return valid(+m[3], +m[2], +m[1]);
  if (/\d{4}/.test(s) && /[a-z]/i.test(s)) {
    const d = new Date(s + ' 12:00:00'); // 12h trưa để không lệch ngày theo múi giờ
    if (!isNaN(d)) return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
  return null;
}
// "2026-10-22" -> "October 22, 2026" (hiển thị thống nhất trên toàn site)
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function prettyDate(iso) {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${MONTHS[+m[2] - 1]} ${+m[3]}, ${m[1]}` : '';
}
const todayIso = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
})();

// Đường dẫn ảnh tuyệt đối cho og:image / schema
function absImage(img) {
  if (/^https?:/.test(img)) return img;
  return `${SITE}/${img.replace(/^(\.\.\/)+/, '').replace(/^\//, '')}`;
}

/* ------------------------------------------------------------------ */
/* Partials: nguồn duy nhất cho header & footer                        */
/* ------------------------------------------------------------------ */
function readPartial(name) {
  const p = path.join('partials', name);
  if (!fs.existsSync(p)) {
    console.error(`LOI: Khong tim thay ${p}. Hay tao thu muc "partials" voi header.html va footer.html.`);
    process.exit(1);
  }
  return fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
}
const headerTpl = readPartial('header.html');
const footerTpl = readPartial('footer.html');
const withRoot = (tpl, root) => tpl.split('{{root}}').join(root);

// Chèn / cập nhật một khối giữa 2 dấu hiệu <!--NAME:START--> ... <!--NAME:END-->
function upsertBlock(html, name, content, place) {
  const start = `<!--${name}:START-->`;
  const end = `<!--${name}:END-->`;
  const wrapped = `${start}\n${content}\n${end}`;
  const re = new RegExp(`${start}[\\s\\S]*?${end}`);
  if (re.test(html)) return html.replace(re, () => wrapped);
  return place(html, wrapped);
}
const placeHeader = (html, block) => html.replace(/<body[^>]*>/, m => `${m}\n${block}`);
const placeFooter = (html, block) => {
  const i = html.lastIndexOf('</body>');
  return i === -1 ? html + '\n' + block : `${html.slice(0, i)}${block}\n${html.slice(i)}`;
};

/* ------------------------------------------------------------------ */
/* Sinh js/header.js và js/footer.js từ partials                       */
/* (chỉ chèn khi trang CHƯA có sẵn header/footer; luôn gắn menu mobile) */
/* ------------------------------------------------------------------ */
if (!fs.existsSync('js')) fs.mkdirSync('js', { recursive: true });

const rootDetect = `
  var p = window.location.pathname;
  var isSub = p.indexOf('/tattoo-meanings/') !== -1 || p.indexOf('/hanoi-travel-corner/') !== -1 || p.indexOf('/knowledge/') !== -1;
  var root = isSub ? '../../' : '';`;

const headerJs = `// js/header.js — TU DONG SINH boi build.js tu partials/header.html. Khong sua tay.
document.addEventListener('DOMContentLoaded', function () {${rootDetect}
  var TEMPLATE = ${JSON.stringify(headerTpl)};

  // Du phong: neu trang chua duoc build san header thi chen bang JS
  if (!document.querySelector('.site-header')) {
    document.body.insertAdjacentHTML('afterbegin', TEMPLATE.split('{{root}}').join(root));
  }

  // To mau muc menu cua trang hien tai
  var here = p.split('/').pop() || 'index.html';
  document.querySelectorAll('.desktop-nav a:not(.btn)').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href.indexOf('#') === -1 && href.split('/').pop() === here) {
      link.style.color = 'var(--y)';
    }
  });

  // blog.html#meanings | #travel | #knowledge -> mo dung tab chuyen de
  // (dung cho cac link "chuyen de" tu khoi Travel Corner & Blog o trang chu)
  function openBlogTabFromHash() {
    if (here !== 'blog.html') return;
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
`;

const footerJs = `// js/footer.js — TU DONG SINH boi build.js tu partials/footer.html. Khong sua tay.
document.addEventListener('DOMContentLoaded', function () {${rootDetect}
  var TEMPLATE = ${JSON.stringify(footerTpl)};

  // Du phong: neu trang chua duoc build san footer thi chen bang JS
  if (!document.querySelector('.site-footer')) {
    document.body.insertAdjacentHTML('beforeend', TEMPLATE.split('{{root}}').join(root));
  }
});
`;

fs.writeFileSync('js/header.js', headerJs, 'utf8');
fs.writeFileSync('js/footer.js', footerJs, 'utf8');
console.log('[Partials] js/header.js + js/footer.js da duoc sinh lai');

/* ------------------------------------------------------------------ */
/* Nhúng sẵn header/footer vào các trang tĩnh                          */
/* ------------------------------------------------------------------ */
STATIC_PAGES.forEach(file => {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');
  html = upsertBlock(html, 'SITE-HEADER', withRoot(headerTpl, ''), placeHeader);
  html = upsertBlock(html, 'SITE-FOOTER', withRoot(footerTpl, ''), placeFooter);
  fs.writeFileSync(file, html, 'utf8');
  console.log(`[Static page] header/footer da nhung vao ${file}`);
});

/* ------------------------------------------------------------------ */
/* Sinh các bài viết                                                   */
/* ------------------------------------------------------------------ */
let meaningsList = [];
let travelList = [];
let knowledgeList = [];

articles.forEach(art => {
  const folderName = art.filename.replace('.html', '');
  const currentUrl = `${SITE}/${art.category}/${folderName}/`;
  let categoryLabel = 'Tattoo Knowledge';
  if (art.category === 'tattoo-meanings') {
    categoryLabel = 'Tattoo Meanings';
  } else if (art.category === 'hanoi-travel-corner') {
    categoryLabel = 'Hanoi Travel Corner';
  } else if (art.category === 'knowledge') {
    categoryLabel = 'Tattoo Knowledge';
  }

  // Ảnh bìa: bài nằm sâu 2 cấp (../../images/...)
  const cleanImagePath = /^https?:/.test(art.image)
    ? art.image
    : '../../' + art.image.replace(/^(\.\.\/)+/, '');
  const ogImage = absImage(art.image);

  const published = isoDate(art.date) || todayIso;
  const publishedLabel = prettyDate(published);

  const blogPosting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: art.title,
    description: art.description,
    image: ogImage,
    inLanguage: 'en',
    mainEntityOfPage: { '@type': 'WebPage', '@id': currentUrl },
    author: { '@type': 'Organization', name: STUDIO, url: SITE + '/' },
    publisher: {
      '@type': 'Organization',
      name: STUDIO,
      logo: { '@type': 'ImageObject', url: LOGO_URL }
    },
    datePublished: published,
    dateModified: published
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog.html` },
      { '@type': 'ListItem', position: 3, name: art.title, item: currentUrl }
    ]
  };

  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#7E1015">

  <title>${esc(art.title)} | Mr Tattoo Hanoi</title>
  <meta name="description" content="${esc(art.description)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${currentUrl}">

  <meta property="og:type" content="article">
  <meta property="og:site_name" content="${STUDIO}">
  <meta property="og:locale" content="en_US">
  <meta property="og:title" content="${esc(art.title)}">
  <meta property="og:description" content="${esc(art.description)}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:url" content="${currentUrl}">
  <meta property="article:published_time" content="${published}">
  <meta property="article:section" content="${categoryLabel}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(art.title)}">
  <meta name="twitter:description" content="${esc(art.description)}">
  <meta name="twitter:image" content="${ogImage}">

  <!-- LUI 2 CAP THU MUC VE THU MUC GOC WEB -->
  <link rel="stylesheet" href="../../style.css">
  <link rel="stylesheet" href="../../frames.css">

  <style>
    /* Nền XUNG QUANH khung bài viết: vàng hoa văn sen giống các khối vàng của about-us.html
       (đường dẫn lùi 2 cấp vì bài nằm trong /chuyen-muc/ten-bai/) */
    body {
      background: var(--paper) url("../../patterns/tile-on-yellow-red.svg");
    }
    .article-page {
      position: relative;
      padding: 56px 0 80px;
      background: var(--paper) url("../../patterns/tile-on-yellow-red.svg");
    }
    /* Dải viền thoi đỏ ở đầu khối, giống .section.yellow */
    .article-page::before {
      content: "";
      position: absolute;
      left: 0; right: 0; top: 0;
      height: 14px;
      background: url("../../patterns/band-red.svg") repeat-x center;
    }

    /* Khung nội dung: nền kem nhạt vani TRƠN (không hoa văn), viền đôi đỏ sẫm như .light-panel */
    .article-card {
      max-width: 860px;
      margin: 0 auto;
      background: #FAF3DE;   /* kem nhạt vani, không hoa văn */
      color: #2b1812;        /* nâu đen trầm dễ đọc */
      padding: 44px 48px;
      line-height: 1.85;
      border: 4px double var(--r2);
      border-radius: 2px;
      box-shadow: 0 10px 28px rgba(60, 14, 12, 0.32);
    }

    /* Breadcrumb */
    .article-breadcrumb { font-size: 0.88rem; margin-bottom: 14px; color: #6e4e3d; }
    .article-breadcrumb a { color: var(--r2); text-decoration: none; font-weight: 600; }
    .article-breadcrumb a:hover { color: var(--r); text-decoration: underline; }

    /* Chuyên mục & Ngày đăng */
    .article-meta {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--r);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .article-cat-badge {
      background: rgba(126, 16, 21, 0.08);
      color: var(--r2);
      padding: 3px 10px;
      border-radius: 3px;
      border: 1px solid rgba(126, 16, 21, 0.22);
    }
    .article-meta time {
      color: #6e4e3d;
      font-weight: 600;
      text-transform: none;
      letter-spacing: 0;
    }

    /* Tiêu đề bài viết: đỏ sẫm như phần How It Began trong about-us.html */
    .article-title {
      font-family: var(--font-head);
      font-size: clamp(1.85rem, 3.8vw, 2.6rem);
      line-height: 1.3;
      color: var(--r2);
      margin: 0 0 20px;
      font-weight: 700;
    }

    /* Mô tả bài viết: phong cách lead-quote như about-us.html */
    .article-lead-quote {
      font-family: var(--font-head);
      font-size: 1.25rem;
      line-height: 1.6;
      color: var(--r2);
      border-left: 5px solid var(--r2);
      padding: 12px 18px;
      margin: 0 0 30px;
      background: rgba(126, 16, 21, 0.04);
      border-radius: 0 4px 4px 0;
      font-style: italic;
    }

    /* Ảnh bìa bài viết */
    .article-cover {
      display: block;
      width: 100%;
      max-height: 480px;
      object-fit: cover;
      border-radius: 4px;
      border: 1px solid rgba(126, 16, 21, 0.25);
      margin: 0 0 32px;
    }

    /* Thân bài viết */
    .article-body { color: #2b1812; }
    .article-body h2 {
      color: var(--r2);
      margin-top: 36px;
      margin-bottom: 16px;
      font-size: 1.55rem;
      font-family: var(--font-head);
      text-transform: none;
      letter-spacing: 0;
    }
    .article-body h2::after { display: none; }
    .article-body h3 {
      color: var(--r2);
      margin-top: 28px;
      margin-bottom: 12px;
      font-size: 1.25rem;
      font-family: var(--font-head);
    }
    .article-body p { margin-bottom: 20px; font-size: 1.05rem; }
    .article-body ul, .article-body ol { margin: 0 0 20px; padding-left: 1.4em; font-size: 1.05rem; }
    .article-body a { color: var(--r); font-weight: 600; text-decoration: underline; }
    .article-body a:hover { color: var(--r2); }
    .article-body img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
      border: 1px solid rgba(126, 16, 21, 0.25);
      margin: 12px 0;
    }

    /* Hộp CTA cuối bài viết */
    .article-cta-box {
      background: var(--k);
      color: var(--w);
      border: 2px solid var(--r2);
      border-radius: 4px;
      padding: 30px;
      text-align: center;
      margin-top: 50px;
    }
    .article-cta-box h3 { color: var(--y2); margin: 0 0 10px; }
    .article-cta-box p { margin: 0 0 20px; font-size: 0.95rem; }

    @media (max-width: 700px) {
      .article-page { padding: 34px 0 50px; }
      .article-card { padding: 26px 18px; }
      .article-title { font-size: 1.6rem; }
      .article-lead-quote { font-size: 1.1rem; padding: 10px 14px; }
    }
  </style>

  <script type="application/ld+json">
${ldJson(blogPosting)}
  </script>
  <script type="application/ld+json">
${ldJson(breadcrumb)}
  </script>
</head>
<body>
<!--SITE-HEADER:START-->
${withRoot(headerTpl, '../../')}
<!--SITE-HEADER:END-->

  <main class="article-page">
    <div class="wrap">
      <article class="article-card">
        <nav class="article-breadcrumb" aria-label="Breadcrumb">
          <a href="../../index.html">Home</a> › <a href="../../blog.html">Blog</a> › <span>${categoryLabel}</span>
        </nav>
        <div class="article-meta">
          <span class="article-cat-badge">${categoryLabel}</span>
          <time datetime="${published}">${publishedLabel}</time>
        </div>
        <h1 class="article-title">${esc(art.title)}</h1>
        <p class="article-lead-quote">"${esc(art.description)}"</p>
        <img src="${cleanImagePath}" alt="${esc(art.title)}" class="article-cover" width="1200" height="750" fetchpriority="high">

        <div class="article-body">
          ${art.content}
        </div>

        <div class="article-cta-box">
          <h3>Inspired to get your meaningful tattoo in Hanoi?</h3>
          <p>Send us your idea and get a free consultation right away.</p>
          <a href="https://wa.me/84377616886" class="btn" target="_blank" rel="noopener">Book on WhatsApp ($10+ studio)</a>
        </div>
      </article>
    </div>
  </main>

<!--SITE-FOOTER:START-->
${withRoot(footerTpl, '../../')}
<!--SITE-FOOTER:END-->

  <!-- LUI 2 CAP THU MUC: gan menu mobile (header/footer da duoc nhung san) -->
  <script src="../../js/header.js"></script>
  <script src="../../js/footer.js"></script>

</body>
</html>`;

  const articleDir = `${art.category}/${folderName}`;
  if (!fs.existsSync(articleDir)) {
    fs.mkdirSync(articleDir, { recursive: true });
  }
  fs.writeFileSync(`${articleDir}/index.html`, htmlTemplate, 'utf8');
  console.log(`[Article] ${articleDir}/index.html`);

  const summaryItem = {
    title: art.title,
    slug: `${art.category}/${folderName}/`,
    thumb: art.image,
    time: publishedLabel,   // hiển thị: "October 22, 2026"
    date: published,        // chuẩn máy đọc: "2026-10-22" (dùng để sắp xếp & sitemap)
    desc: art.description
  };

  if (art.category === 'tattoo-meanings') {
    meaningsList.push(summaryItem);
  } else if (art.category === 'hanoi-travel-corner') {
    travelList.push(summaryItem);
  } else if (art.category === 'knowledge') {
    knowledgeList.push(summaryItem);
  }
});

/* ------------------------------------------------------------------ */
/* Gộp dữ liệu danh sách bài viết cho blog.html                        */
/* ------------------------------------------------------------------ */
function getExistingData(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const jsonStr = content.substring(content.indexOf('['), content.lastIndexOf(';') + 1);
      return JSON.parse(jsonStr.replace(/;\s*$/, ''));
    }
  } catch (e) {
    console.log(`Khong doc duoc du lieu cu tu ${filePath}, se tao moi.`);
  }
  return [];
}

if (!fs.existsSync('knowledge')) fs.mkdirSync('knowledge', { recursive: true });

const existingMeanings = getExistingData('js/meanings-data.js');
const existingTravel = getExistingData('js/travel-data.js');
const existingKnowledge = getExistingData('js/knowledge-data.js');

function mergeData(existing, incoming) {
  const map = new Map();
  existing.forEach(item => map.set(item.slug, item));
  incoming.forEach(item => map.set(item.slug, item)); // bài mới đè bài cũ nếu trùng slug
  return Array.from(map.values());
}

const finalMeanings = mergeData(existingMeanings, meaningsList);
const finalTravel = mergeData(existingTravel, travelList);
const finalKnowledge = mergeData(existingKnowledge, knowledgeList);

fs.writeFileSync('js/meanings-data.js',
  `// Tu dong sinh boi build.js - Khong sua thu cong\nconst meaningsData = ${JSON.stringify(finalMeanings, null, 2)};`, 'utf8');
fs.writeFileSync('js/travel-data.js',
  `// Tu dong sinh boi build.js - Khong sua thu cong\nconst travelData = ${JSON.stringify(finalTravel, null, 2)};`, 'utf8');
fs.writeFileSync('js/knowledge-data.js',
  `// Tu dong sinh boi build.js - Khong sua thu cong\nconst knowledgeData = ${JSON.stringify(finalKnowledge, null, 2)};`, 'utf8');

/* ------------------------------------------------------------------ */
/* sitemap.xml (+ robots.txt nếu chưa có)                              */
/* ------------------------------------------------------------------ */
const sitemapEntries = [
  { loc: `${SITE}/`, priority: '1.0' },
  { loc: `${SITE}/about-us.html`, priority: '0.7' },
  { loc: `${SITE}/gallery.html`, priority: '0.8' },
  { loc: `${SITE}/design.html`, priority: '0.8' },
  { loc: `${SITE}/blog.html`, priority: '0.7' },
  { loc: `${SITE}/contact.html`, priority: '0.7' }
].filter(e => {
  const file = e.loc === `${SITE}/` ? 'index.html' : e.loc.replace(`${SITE}/`, '');
  return fs.existsSync(file);
});

[...finalMeanings, ...finalTravel, ...finalKnowledge].forEach(item => {
  sitemapEntries.push({
    loc: `${SITE}/${item.slug}`,
    lastmod: item.date || isoDate(item.time),
    priority: '0.6'
  });
});

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.map(e => `  <url>
    <loc>${e.loc}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''}
    <priority>${e.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync('sitemap.xml', sitemapXml, 'utf8');
console.log(`[SEO] sitemap.xml: ${sitemapEntries.length} URL`);

if (!fs.existsSync('robots.txt')) {
  fs.writeFileSync('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`, 'utf8');
  console.log('[SEO] Da tao robots.txt');
}

console.log('=> Build hoan tat!');
