// js/review-list.js
// Danh sách đánh giá khách hàng cho khối "Client Reviews" ở index.html (chạy tự động giống Featured Portfolio).
//
// CÁCH DÙNG:
//  - Mỗi đánh giá là 1 object. Thay [..] bằng đánh giá THẬT của khách (copy từ Google Maps, Instagram, WhatsApp...).
//  - rating: số sao 1-5 (để 0 thì không hiện sao).
//  - image : ảnh của ô đánh giá (ảnh hình xăm / ảnh khách). Mặc định dùng ảnh trong images/tac-pham-N.webp.
//            Muốn dùng ảnh riêng: đặt file vào images/reviews/ rồi sửa đường dẫn, ví dụ "images/reviews/anna.webp".
//  - placeholder: true = ô mẫu chưa có nội dung thật. Khi đã điền đánh giá thật, XÓA dòng "placeholder: true"
//            (hoặc đổi thành false) cho ô đó.
//  - Thêm / bớt đánh giá: chỉ cần thêm / xóa object, không phải sửa index.html.
//
// Khi site đã có đủ đánh giá thật, đặt REVIEW_SHOW_PLACEHOLDERS = false để ẩn mọi ô mẫu còn sót lại.

const REVIEW_SHOW_PLACEHOLDERS = true;

const REVIEW_LIST = [
  { name: "[Client Name 1]",  country: "[Country]", rating: 0, image: "images/tac-pham-1.webp",  text: "[Real client review text 1]",  placeholder: true },
  { name: "[Client Name 2]",  country: "[Country]", rating: 0, image: "images/tac-pham-2.webp",  text: "[Real client review text 2]",  placeholder: true },
  { name: "[Client Name 3]",  country: "[Country]", rating: 0, image: "images/tac-pham-3.webp",  text: "[Real client review text 3]",  placeholder: true },
  { name: "[Client Name 4]",  country: "[Country]", rating: 0, image: "images/tac-pham-4.webp",  text: "[Real client review text 4]",  placeholder: true },
  { name: "[Client Name 5]",  country: "[Country]", rating: 0, image: "images/tac-pham-5.webp",  text: "[Real client review text 5]",  placeholder: true },
  { name: "[Client Name 6]",  country: "[Country]", rating: 0, image: "images/tac-pham-6.webp",  text: "[Real client review text 6]",  placeholder: true },
  { name: "[Client Name 7]",  country: "[Country]", rating: 0, image: "images/tac-pham-7.webp",  text: "[Real client review text 7]",  placeholder: true },
  { name: "[Client Name 8]",  country: "[Country]", rating: 0, image: "images/tac-pham-8.webp",  text: "[Real client review text 8]",  placeholder: true },
  { name: "[Client Name 9]",  country: "[Country]", rating: 0, image: "images/tac-pham-9.webp",  text: "[Real client review text 9]",  placeholder: true },
  { name: "[Client Name 10]", country: "[Country]", rating: 0, image: "images/tac-pham-10.webp", text: "[Real client review text 10]", placeholder: true },
  { name: "[Client Name 11]", country: "[Country]", rating: 0, image: "images/tac-pham-11.webp", text: "[Real client review text 11]", placeholder: true },
  { name: "[Client Name 12]", country: "[Country]", rating: 0, image: "images/tac-pham-12.webp", text: "[Real client review text 12]", placeholder: true },
  { name: "[Client Name 13]", country: "[Country]", rating: 0, image: "images/tac-pham-13.webp", text: "[Real client review text 13]", placeholder: true },
  { name: "[Client Name 14]", country: "[Country]", rating: 0, image: "images/tac-pham-14.webp", text: "[Real client review text 14]", placeholder: true },
  { name: "[Client Name 15]", country: "[Country]", rating: 0, image: "images/tac-pham-15.webp", text: "[Real client review text 15]", placeholder: true }
];
