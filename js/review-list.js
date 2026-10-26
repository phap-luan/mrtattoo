// js/review-list.js
// Danh sách đánh giá khách hàng cho khối "Client Reviews" ở index.html (dải ảnh chạy tự động).
//
// CÁCH DÙNG: mỗi đánh giá chỉ cần 2 thông tin:
//  - image: link ảnh VUÔNG 1x1 (ảnh chụp màn hình đánh giá / ảnh khách). Ví dụ "images/reviews/anna.webp".
//  - link : link bài đánh giá trên Google Maps. Ví dụ "https://goo.gl/maps/ex5GkbZcrvcTeGpM6?g_st=az"
//           Khách bấm vào ảnh sẽ mở link này ở tab mới. Để link: "" thì ảnh chỉ để xem, không bấm được.
//  - Thêm / bớt đánh giá: chỉ cần thêm / xóa 1 dòng, không phải sửa index.html.
//  - Danh sách rỗng ([]) thì cả khối Client Reviews tự ẩn.
//
// Các dòng dưới đây là MẪU: thay bằng ảnh và link thật của bạn.

const REVIEW_LIST = [
  { image: "images/review/tattoo-review-01.webp", link: "https://goo.gl/maps/MvXP6F5EFhP99taR8?g_st=az" },
  { image: "images/review/tattoo-review-02.webp", link: "https://goo.gl/maps/KYEDp5GHDG7LKwjb9?g_st=az" },
  { image: "images/review/tattoo-review-03.webp", link: "https://goo.gl/maps/qSEdQGoPAtXfL39e6?g_st=az" },
  { image: "images/review/tattoo-review-04.webp", link: "https://goo.gl/maps/h1imKZ4fWSCfDT4Y9?g_st=az" },
  { image: "images/review/tattoo-review-05.webp", link: "https://goo.gl/maps/oko9G2SrQtPHPN5a7?g_st=az" },
  { image: "images/review/tattoo-review-06.webp", link: "https://goo.gl/maps/BFwR3aMTHVV81X9i7?g_st=az" },
  { image: "images/review/tattoo-review-07.webp", link: "https://goo.gl/maps/CpkMnF47XZnTUufe6?g_st=az" },
  { image: "images/review/tattoo-review-08.webp", link: "https://goo.gl/maps/sWWwacc7KYZFjeL59?g_st=az" },
  { image: "images/review/tattoo-review-09.webp", link: "https://goo.gl/maps/RA3YvugL8BWkYAJX7?g_st=az" },
  { image: "images/review/tattoo-review-10.webp", link: "https://goo.gl/maps/4VV7ATjQ3JHJfxFf8?g_st=az" },
  { image: "images/review/tattoo-review-11.webp", link: "https://goo.gl/maps/hCHVMvFF1oFgJMtS9?g_st=az" },
  { image: "images/review/tattoo-review-12.webp", link: "https://goo.gl/maps/RHooG1AYeupH9kNR6?g_st=az" },
  { image: "images/review/tattoo-review-13.webp", link: "https://goo.gl/maps/ERV7TbGWK9ZcQJwm8?g_st=az" },
  { image: "images/review/tattoo-review-14.webp", link: "https://goo.gl/maps/3yr7G7BsqJd8c1au6?g_st=az" },
  { image: "images/review/tattoo-review-15.webp", link: "https://goo.gl/maps/4wuRmzNgc7MwxPf88?g_st=az" },
  { image: "images/review/tattoo-review-16.webp", link: "https://goo.gl/maps/ex5GkbZcrvcTeGpM6?g_st=az" }
];
