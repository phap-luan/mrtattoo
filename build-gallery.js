// build-gallery.js
// Cách dùng (chạy ở thư mục gốc của web, nơi có thư mục gallery/):
//   npm i sharp            (chỉ cần cài 1 lần)
//   node build-gallery.js           -> chỉ tạo thumbnail cho ảnh mới, cập nhật sizes.js
//   node build-gallery.js --force   -> tạo lại TOÀN BỘ thumbnail (dùng khi đổi kích thước/chất lượng)
//   node build-gallery.js duong/dan/gallery   -> nếu thư mục gallery nằm chỗ khác
//
// Ảnh gốc:  gallery/<folder>/full/<prefix><n>.webp      (không bị chạm tới)
// Thumbnail: gallery/<folder>/thumbs/<prefix><n>.webp   (tự tạo, thư mục tự sinh)
// Kết quả:  gallery/sizes.js  (tỉ lệ ngang/dọc của từng ảnh; 0 = ảnh không tồn tại)

const fs = require('fs');
const vm = require('vm');
const path = require('path');
const sharp = require('sharp');

const THUMB_HEIGHT = 460; // gấp đôi chiều cao hàng 230px để nét trên màn hình retina
const THUMB_QUALITY = 72;

const args = process.argv.slice(2);
const force = args.includes('--force');
const root = args.find(a => !a.startsWith('--')) || 'gallery';

const ctx = {};
vm.createContext(ctx);
vm.runInContext(
  fs.readFileSync(path.join(root, 'list.js'), 'utf8') + ';this.CONFIG = GALLERY_CONFIG;',
  ctx
);

(async () => {
  const out = {};
  let made = 0, missing = 0;

  for (const g of ctx.CONFIG) {
    out[g.folder] = [];
    const fullDir = path.join(root, g.folder, 'full');
    const thumbDir = path.join(root, g.folder, 'thumbs');
    fs.mkdirSync(thumbDir, { recursive: true });

    for (let i = 1; i <= g.total; i++) {
      const name = `${g.prefix}${i}.webp`;
      const full = path.join(fullDir, name);
      const thumb = path.join(thumbDir, name);

      if (!fs.existsSync(full)) {
        out[g.folder].push(0); // ảnh bị xóa / chưa có
        missing++;
        continue;
      }

      if (force || !fs.existsSync(thumb)) {
        await sharp(full)
          .rotate() // theo EXIF để không bị xoay nhầm
          .resize({ height: THUMB_HEIGHT, withoutEnlargement: true })
          .webp({ quality: THUMB_QUALITY })
          .toFile(thumb);
        made++;
      }

      const m = await sharp(thumb).metadata();
      out[g.folder].push(+(m.width / m.height).toFixed(4));
    }
  }

  fs.writeFileSync(
    path.join(root, 'sizes.js'),
    '// File do build-gallery.js tự sinh, không sửa tay.\nconst GALLERY_RATIOS=' + JSON.stringify(out) + ';\n'
  );
  console.log(`Xong: tạo ${made} thumbnail, ${missing} số không có ảnh. Đã ghi ${path.join(root, 'sizes.js')}`);
})().catch(err => { console.error(err); process.exit(1); });
