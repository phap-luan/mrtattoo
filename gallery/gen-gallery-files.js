// Quét các thư mục ảnh THẬT trên ổ đĩa và ghi ra gallery/files.js
// để trang gallery chỉ hiển thị ảnh thực sự tồn tại (không cần đoán bằng "total").
//
// Cách dùng (chạy ở thư mục gốc của project, nơi có thư mục "gallery"):
//   node gen-gallery-files.js
// Tuỳ chọn: node gen-gallery-files.js duong/dan/toi/gallery
//
// Chạy lại mỗi khi thêm / xoá / đổi tên ảnh trong thư mục thumbs.

const fs = require('fs');
const path = require('path');

const galleryDir = path.resolve(process.argv[2] || 'gallery');

if (!fs.existsSync(galleryDir)) {
  console.error('Không tìm thấy thư mục:', galleryDir);
  process.exit(1);
}

// Lấy số cuối tên file: medium-large-tattoo_379.webp -> 379
const numOf = name => {
  const m = name.match(/(\d+)\.webp$/i);
  return m ? parseInt(m[1], 10) : -1;
};

const result = {};
let totalFiles = 0;

for (const entry of fs.readdirSync(galleryDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const thumbsDir = path.join(galleryDir, entry.name, 'thumbs');
  if (!fs.existsSync(thumbsDir)) continue;

  const fullDir = path.join(galleryDir, entry.name, 'full');
  const names = fs.readdirSync(thumbsDir)
    .filter(f => /\.webp$/i.test(f))
    // chỉ giữ ảnh có đủ cả bản thumb lẫn bản full
    .filter(f => !fs.existsSync(fullDir) || fs.existsSync(path.join(fullDir, f)))
    // số lớn nhất (mới nhất) đứng đầu
    .sort((a, b) => numOf(b) - numOf(a) || a.localeCompare(b));

  const missingFull = fs.readdirSync(thumbsDir)
    .filter(f => /\.webp$/i.test(f))
    .filter(f => fs.existsSync(fullDir) && !fs.existsSync(path.join(fullDir, f)));
  if (missingFull.length) {
    console.warn(`  [!] ${entry.name}: ${missingFull.length} ảnh có thumb nhưng thiếu bản full (đã bỏ qua):`,
      missingFull.slice(0, 5).join(', ') + (missingFull.length > 5 ? ' ...' : ''));
  }

  result[entry.name] = names;
  totalFiles += names.length;
  const nums = names.map(numOf).filter(n => n >= 0);
  console.log(`${entry.name}: ${names.length} ảnh` +
    (nums.length ? ` (số ${Math.min(...nums)} → ${Math.max(...nums)})` : ''));
}

const out = path.join(galleryDir, 'files.js');
fs.writeFileSync(
  out,
  '// File tự sinh bởi gen-gallery-files.js — đừng sửa tay, hãy chạy lại script.\n' +
  'const GALLERY_FILES = ' + JSON.stringify(result) + ';\n'
);
console.log(`\nĐã ghi ${out} (${totalFiles} ảnh)`);
