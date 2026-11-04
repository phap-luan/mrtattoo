// Bạn chỉ cần định nghĩa thư mục, tên hiển thị và TỔNG SỐ LƯỢNG ẢNH hiện có.
// Ví dụ thư mục mini-fine-line có 150 ảnh, tiền tố tên file là "mini-tattoo_"
const GALLERY_CONFIG = [
  { 
    folder: "medium-large-custom-pieces", 
    category: "Medium & Large Custom Pieces", 
    prefix: "medium-large-tattoo_", 
    total: 120 
  },
  { 
    folder: "mini-fine-line", 
    category: "Mini & Fine Line", 
    prefix: "mini-tattoo_", 
    total: 60  // <-- Khi thêm ảnh mới, bạn chỉ cần đổi số 150 thành 151, 152... ở đây!
  }
];