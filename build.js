const fs = require('fs');
const articles = require('./articles.json');

let meaningsList = [];
let travelList = [];

articles.forEach(art => {
  const folderName = art.filename.replace('.html', '');
  const currentUrl = `https://mrtattoo.vn/${art.category}/${folderName}/`;
  
  // Xử lý đường dẫn ảnh: Đảm bảo ảnh lùi 2 cấp thư mục (../../images/...)
  let cleanImagePath = art.image;
  if (cleanImagePath.startsWith('../')) {
    cleanImagePath = '../' + cleanImagePath; // Chuyển ../ thành ../../
  } else if (!cleanImagePath.startsWith('../../') && !cleanImagePath.startsWith('http')) {
    cleanImagePath = '../../' + cleanImagePath;
  }

  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#FFC400">

  <title>${art.title} | Mr Tattoo Hanoi</title>
  <meta name="description" content="${art.description}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${currentUrl}">

  <meta property="og:type" content="article">
  <meta property="og:title" content="${art.title}">
  <meta property="og:description" content="${art.description}">
  <meta property="og:image" content="https://mrtattoo.vn/${art.image.replace('../', '').replace('../../', '')}">
  <meta property="og:url" content="${currentUrl}">

  <!-- LÙI 2 CẤP THƯ MỤC VỀ THƯ MỤC GỐC WEB -->
  <link rel="stylesheet" href="../../style.css">

  <style>
    .article-container { max-width: 800px; margin: 40px auto; padding: 0 20px; color: #ddd; line-height: 1.8; }
    .article-header { margin-bottom: 30px; text-align: center; }
    .article-meta { font-size: 0.85rem; color: var(--y); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px; }
    .article-header h1 { font-size: clamp(2rem, 3.5vw, 2.8rem); color: #fff; line-height: 1.3; margin-bottom: 15px; }
    .article-cover { width: 100%; max-height: 480px; object-fit: cover; border-radius: 12px; border: 1px solid rgba(255, 196, 0, 0.3); margin: 20px 0 35px 0; }
    .article-body h2 { color: var(--y); margin-top: 35px; margin-bottom: 15px; font-size: 1.5rem; }
    .article-body p { margin-bottom: 20px; font-size: 1.05rem; }
    .article-cta-box { background: #161616; border: 2px solid var(--y); border-radius: 10px; padding: 30px; text-align: center; margin-top: 50px; }
  </style>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "${art.title}",
    "image": "https://mrtattoo.vn/${art.image.replace('../', '').replace('../../', '')}",
    "author": { "@type": "Organization", "name": "Mr Tattoo Hanoi Studio" },
    "publisher": {
      "@type": "Organization",
      "name": "Mr Tattoo Hanoi Studio",
      "logo": { "@type": "ImageObject", "url": "https://mrtattoo.vn/images/og-cover.jpg" }
    },
    "datePublished": "${art.date}"
  }
  </script>
</head>
<body>

  <main class="article-container">
    <div class="article-header">
      <div class="article-meta">${art.category === 'tattoo-meanings' ? 'Tattoo Meanings' : 'Hanoi Travel Corner'} · ${art.date}</div>
      <h1>${art.title}</h1>
      <p style="color: #aaa; font-size: 1.1rem;">${art.description}</p>
    </div>

    <!-- Nạp ảnh đại diện lùi 2 cấp -->
    <img src="${cleanImagePath}" alt="${art.title}" class="article-cover" loading="lazy">

    <div class="article-body">
      ${art.content}
    </div>

    <div class="article-cta-box">
      <h3 style="color: #fff; margin-bottom: 10px;">Inspired to get your meaningful tattoo in Hanoi?</h3>
      <p style="margin-bottom: 20px; font-size: 0.95rem;">Send us your idea and get a free consultation right away.</p>
      <a href="https://wa.me/84377616886" class="btn" style="background: var(--y); color: var(--k); padding: 10px 24px; font-weight: bold; text-decoration: none; border-radius: 4px;" target="_blank" rel="noopener">Book on WhatsApp ($10+ studio)</a>
    </div>
  </main>

  <!-- LÙI 2 CẤP THƯ MỤC ĐỂ GỌI HEADER / FOOTER -->
  <script src="../../js/header.js"></script>
  <script src="../../js/footer.js"></script>

</body>
</html>`;

  const articleDir = `${art.category}/${folderName}`;
  if (!fs.existsSync(articleDir)) {
    fs.mkdirSync(articleDir, { recursive: true });
  }
  fs.writeFileSync(`${articleDir}/index.html`, htmlTemplate, 'utf8');
  console.log(`[Clean URL Fixed] ${articleDir}/index.html`);

  const summaryItem = {
    title: art.title,
    slug: `${art.category}/${folderName}/`,
    thumb: art.image,
    time: art.time || art.date || "RECENT",
    desc: art.description
  };

  if (art.category === 'tattoo-meanings') {
    meaningsList.push(summaryItem);
  } else if (art.category === 'hanoi-travel-corner') {
    travelList.push(summaryItem);
  }
});

const meaningsJsContent = `// Tự động sinh bởi build.js - Không sửa thủ công\nconst meaningsData = ${JSON.stringify(meaningsList, null, 2)};`;
fs.writeFileSync('js/meanings-data.js', meaningsJsContent, 'utf8');

const travelJsContent = `// Tự động sinh bởi build.js - Không sửa thủ công\nconst travelData = ${JSON.stringify(travelList, null, 2)};`;
fs.writeFileSync('js/travel-data.js', travelJsContent, 'utf8');

console.log("=> Đã cập nhật xong dữ liệu 2 file JS!");