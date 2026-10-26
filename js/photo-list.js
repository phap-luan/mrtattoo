// js/photo-list.js
// Danh sách ảnh cho khối "Featured Portfolio" ở index.html (dải ảnh chạy tự động, giống Client Reviews).
//
// CÁCH DÙNG: mỗi ảnh chỉ cần 2 thông tin:
//  - thumb: link ảnh NHỎ (thumbnail) để hiển thị trên dải chạy -> tải nhanh.
//  - full : link ảnh FULL (kích thước lớn). Khi khách bấm vào ảnh, ảnh này được phóng to ở giữa màn hình.
//           Bấm ra ngoài, bấm nút X hoặc nhấn phím Esc để đóng.
//  - Thêm / bớt ảnh: chỉ cần thêm / xóa 1 dòng, không phải sửa index.html.
//  - Danh sách rỗng ([]) thì dải ảnh tự ẩn.
//
// Các dòng dưới đây là MẪU (thumb và full đang dùng chung 1 file): khi có ảnh thumb riêng,
// ví dụ "images/thumbs/tac-pham-1.webp" và "images/full/tac-pham-1.webp", chỉ cần sửa đường dẫn.

const PHOTO_LIST = [
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_018.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_018.webp" },
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_002.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_002.webp" },
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_074.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_074.webp" },
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_008.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_008.webp" },
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_061.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_061.webp" },
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_093.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_093.webp" },
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_058.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_058.webp" },
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_042.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_042.webp" },
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_046.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_046.webp" },
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_051.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_051.webp" },
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_039.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_039.webp" },
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_028.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_028.webp" },
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_016.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_016.webp" },
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_055.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_055.webp" }
];
