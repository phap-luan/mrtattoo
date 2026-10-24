// Bạn chỉ cần định nghĩa thư mục, tên hiển thị và TỔNG SỐ LƯỢNG ẢNH hiện có.
// Ví dụ thư mục mini-fine-line có 150 ảnh, tiền tố tên file là "mini-tattoo_"
const GALLERY_CONFIG = [
  { 
    folder: "mini-fine-line", 
    category: "Mini & Fine Line", 
    prefix: "mini-tattoo_", 
    total: 100  // <-- Khi thêm ảnh mới, bạn chỉ cần đổi số 150 thành 151, 152... ở đây!
  },
  { 
    folder: "medium-large-custom-pieces", 
    category: "Medium & Large Custom Pieces", 
    prefix: "medium-large-tattoo_", 
    total: 80 
  },
  { 
    folder: "vietnamese-motifs", 
    category: "Vietnamese Motifs", 
    prefix: "vn-tattoo_", 
    total: 45 
  }
];