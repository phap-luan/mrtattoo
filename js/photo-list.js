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
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_18.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_18.webp" },
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_2.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_2.webp" },
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_74.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_74.webp" },
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_8.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_8.webp" },
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_61.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_61.webp" },
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_93.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_93.webp" },
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_58.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_58.webp" },
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_42.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_42.webp" },
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_46.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_46.webp" },
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_51.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_51.webp" },
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_39.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_39.webp" },
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_28.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_28.webp" },
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_16.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_16.webp" },
  { thumb: "gallery/medium-large-custom-pieces/thumbs/medium-large-tattoo_55.webp",  full: "gallery/medium-large-custom-pieces/full/medium-large-tattoo_55.webp" }
];
