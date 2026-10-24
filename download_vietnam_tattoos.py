"""
Kịch bản tự động tải hình ảnh ý tưởng thiết kế hình xăm (tattoo design) mang đậm văn hóa Việt Nam từ Pinterest.
Tính năng:
- Tải từ khóa văn hóa Việt Nam trên Pinterest
- Cơ chế chống trùng lặp đa tầng: Link/ID và MD5/pHash
- Lọc chất lượng và độ phân giải cao
- Ghi lịch sử tải vào download_history.json
- Báo cáo kết quả tổng kết chi tiết
"""

import os
import sys
import json
import time
import io
import hashlib
import argparse
import urllib.parse
from datetime import datetime

# Đảm bảo mã hóa UTF-8 trên Windows console
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

try:
    import requests
    from PIL import Image
    import imagehash
    import gallery_dl.extractor
except ImportError as e:
    print(f"[!] Thiếu thư viện: {e}. Vui lòng cài đặt: pip install requests pillow imagehash gallery-dl")
    sys.exit(1)

# Danh sách từ khóa tìm kiếm
DEFAULT_KEYWORDS = [
    "Vietnam tattoo design",
    "Vietnamese traditional tattoo concept",
    "Non la tattoo design",
    "Lotus Vietnamese tattoo",
    "Dong Son drum tattoo design",
    "Pho bowl tattoo flash",
    "Vietnamese stamp tattoo design",
]

DEFAULT_TARGET = 50
DEFAULT_OUTPUT_DIR = r"D:\AnhPinterest"
HISTORY_FILENAME = "download_history.json"
MIN_DIMENSION = 350  # Chiều rộng/cao tối thiểu để đảm bảo ảnh rõ nét

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
}


class PinterestDownloader:
    def __init__(self, output_dir=DEFAULT_OUTPUT_DIR, target_count=DEFAULT_TARGET, keywords=None):
        self.output_dir = os.path.abspath(output_dir)
        self.target_count = target_count
        self.keywords = keywords or DEFAULT_KEYWORDS
        self.history_path = os.path.join(self.output_dir, HISTORY_FILENAME)

        # Thống kê
        self.total_scanned = 0
        self.new_downloaded = 0
        self.skipped_duplicate_link = 0
        self.skipped_duplicate_content = 0
        self.skipped_low_resolution = 0
        self.failed_downloads = 0

        # Bộ nhớ lịch sử
        self.history_data = {
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
            "total_downloaded": 0,
            "urls": [],
            "ids": [],
            "md5_hashes": [],
            "phash_hashes": [],
            "items": [],
        }

        # Sets để tra cứu O(1)
        self.known_urls = set()
        self.known_ids = set()
        self.known_md5 = set()
        self.known_phashes = []  # list of imagehash.ImageHash objects

        self._init_storage()

    def _init_storage(self):
        """Khởi tạo thư mục và nạp file lịch sử tải về."""
        os.makedirs(self.output_dir, exist_ok=True)
        print(f"[*] Thư mục lưu trữ: {self.output_dir}")

        if os.path.exists(self.history_path):
            try:
                with open(self.history_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.history_data.update(data)
                    self.known_urls = set(self.history_data.get("urls", []))
                    self.known_ids = set(self.history_data.get("ids", []))
                    self.known_md5 = set(self.history_data.get("md5_hashes", []))
                    for ph_str in self.history_data.get("phash_hashes", []):
                        try:
                            self.known_phashes.append(imagehash.hex_to_hash(ph_str))
                        except Exception:
                            pass
                print(f"[*] Đã nạp lịch sử cũ: {len(self.known_urls)} URLs, {len(self.known_md5)} MD5 hashes.")
            except Exception as e:
                print(f"[!] Không thể đọc file lịch sử cũ ({e}), tạo mới.")
        else:
            print("[*] Chưa có file download_history.json, sẽ tạo mới.")

        # Quét thêm các file đã có sẵn trong thư mục D:\AnhPinterest để tránh trùng
        self._index_existing_folder_files()

    def _index_existing_folder_files(self):
        """Quét và ghi nhận các file ảnh sẵn có trong thư mục nếu chưa có trong history."""
        existing_files = [
            f for f in os.listdir(self.output_dir)
            if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))
        ]
        if not existing_files:
            return

        print(f"[*] Phát hiện {len(existing_files)} file ảnh đã có sẵn trong thư mục, đang lập chỉ mục mã băm...")
        indexed_count = 0
        for fname in existing_files:
            fpath = os.path.join(self.output_dir, fname)
            try:
                with open(fpath, "rb") as f:
                    content = f.read()
                file_md5 = hashlib.md5(content).hexdigest()
                if file_md5 not in self.known_md5:
                    self.known_md5.add(file_md5)
                    self.history_data["md5_hashes"].append(file_md5)
                    try:
                        img = Image.open(io.BytesIO(content))
                        ph = imagehash.phash(img)
                        self.known_phashes.append(ph)
                        self.history_data["phash_hashes"].append(str(ph))
                    except Exception:
                        pass
                    indexed_count += 1
            except Exception:
                pass
        if indexed_count > 0:
            print(f"[*] Đã lập chỉ mục thêm {indexed_count} ảnh có sẵn.")

    def _save_history(self):
        """Lưu trạng thái hiện tại vào download_history.json an toàn."""
        self.history_data["updated_at"] = datetime.now().isoformat()
        self.history_data["total_downloaded"] = len(self.history_data.get("items", []))
        self.history_data["urls"] = list(self.known_urls)
        self.history_data["ids"] = list(self.known_ids)
        self.history_data["md5_hashes"] = list(self.known_md5)
        self.history_data["phash_hashes"] = [str(ph) for ph in self.known_phashes]

        tmp_path = self.history_path + ".tmp"
        try:
            with open(tmp_path, "w", encoding="utf-8") as f:
                json.dump(self.history_data, f, indent=2, ensure_ascii=False)
            os.replace(tmp_path, self.history_path)
        except Exception as e:
            print(f"[!] Lỗi ghi file lịch sử: {e}")

    def _is_duplicate_content(self, raw_bytes, img):
        """Kiểm tra trùng lặp nội dung bằng MD5 và perceptual hash (pHash)."""
        # 1. Kiểm tra chính xác qua MD5
        file_md5 = hashlib.md5(raw_bytes).hexdigest()
        if file_md5 in self.known_md5:
            return True, "MD5 trùng khớp chính xác", file_md5, None

        # 2. Kiểm tra tương đồng thị giác qua pHash (phát hiện ảnh giống nhau dù nén lại)
        curr_phash = imagehash.phash(img)
        for existing_phash in self.known_phashes:
            # Khoảng cách Hamming <= 2 coi như là cùng một ảnh
            if (curr_phash - existing_phash) <= 2:
                return True, f"pHash tương đồng thị giác (khoảng cách {curr_phash - existing_phash})", file_md5, curr_phash

        return False, None, file_md5, curr_phash

    def _process_candidate(self, img_url, metadata, keyword):
        """Xử lý tải và kiểm tra một ứng viên hình ảnh."""
        self.total_scanned += 1

        img_id = metadata.get("filename") or metadata.get("id") or hashlib.md5(img_url.encode()).hexdigest()[:16]
        pin_id = metadata.get("id") or ""

        # BƯỚC 1: Kiểm tra Link/ID trước khi tải
        if img_url in self.known_urls or img_id in self.known_ids or (pin_id and pin_id in self.known_ids):
            self.skipped_duplicate_link += 1
            return False

        # BƯỚC 2: Tải nội dung ảnh
        try:
            resp = requests.get(img_url, headers=HEADERS, timeout=15)
            if resp.status_code != 200:
                self.failed_downloads += 1
                return False
            raw_bytes = resp.content
        except Exception as e:
            self.failed_downloads += 1
            return False

        # BƯỚC 3: Mở ảnh và kiểm tra độ phân giải
        try:
            img = Image.open(io.BytesIO(raw_bytes))
            width, height = img.size
        except Exception:
            self.failed_downloads += 1
            return False

        if width < MIN_DIMENSION or height < MIN_DIMENSION:
            self.skipped_low_resolution += 1
            # Thêm URL vào known để không quét lại lần sau
            self.known_urls.add(img_url)
            return False

        # BƯỚC 4: Kiểm tra trùng lặp nội dung ảnh (MD5 & pHash)
        is_dup, reason, file_md5, curr_phash = self._is_duplicate_content(raw_bytes, img)
        if is_dup:
            self.skipped_duplicate_content += 1
            self.known_urls.add(img_url)
            self.known_ids.add(img_id)
            if pin_id:
                self.known_ids.add(pin_id)
            return False

        # BƯỚC 5: Lưu file ảnh theo định dạng yêu cầu: vietnam_tattoo_[ID_ANH].jpg
        clean_id = "".join(c for c in str(img_id) if c.isalnum() or c in ("-", "_"))[:32]
        if not clean_id:
            clean_id = hashlib.md5(img_url.encode()).hexdigest()[:16]
        filename = f"vietnam_tattoo_{clean_id}.jpg"
        save_path = os.path.join(self.output_dir, filename)

        # Chuyển đổi màu sắc sang RGB nếu cần (tránh lỗi khi lưu PNG/WebP với kênh Alpha thành JPEG)
        try:
            if img.mode in ("RGBA", "LA", "P"):
                rgb_img = Image.new("RGB", img.size, (255, 255, 255))
                if img.mode == "P":
                    img = img.convert("RGBA")
                rgb_img.paste(img, mask=img.split()[-1] if "A" in img.mode else None)
                rgb_img.save(save_path, "JPEG", quality=95, optimize=True)
            else:
                img.convert("RGB").save(save_path, "JPEG", quality=95, optimize=True)
        except Exception as e:
            # Lưu trực tiếp raw bytes nếu PIL save lỗi
            try:
                with open(save_path, "wb") as f:
                    f.write(raw_bytes)
            except Exception:
                self.failed_downloads += 1
                return False

        # BƯỚC 6: Cập nhật lịch sử
        self.known_urls.add(img_url)
        self.known_ids.add(img_id)
        if pin_id:
            self.known_ids.add(pin_id)
        self.known_md5.add(file_md5)
        if curr_phash:
            self.known_phashes.append(curr_phash)

        item_entry = {
            "id": img_id,
            "pin_id": pin_id,
            "filename": filename,
            "url": img_url,
            "keyword": keyword,
            "width": width,
            "height": height,
            "md5": file_md5,
            "phash": str(curr_phash) if curr_phash else "",
            "downloaded_at": datetime.now().isoformat(),
        }
        self.history_data["items"].append(item_entry)

        self.new_downloaded += 1
        print(f"[{self.new_downloaded:02d}/{self.target_count}] Đã tải: {filename} ({width}x{height}px) - Từ khóa: '{keyword}'")

        # Lưu lịch sử mỗi 5 ảnh để đề phòng gián đoạn
        if self.new_downloaded % 5 == 0:
            self._save_history()

        return True

    def run(self):
        """Chạy kịch bản tải qua tất cả các từ khóa."""
        print("=" * 65)
        print(" BẮT ĐẦU TẢI Ý TƯỞNG THIẾT KẾ HÌNH XĂM VĂN HÓA VIỆT NAM ")
        print("=" * 65)
        print(f"Mục tiêu tải mới: {self.target_count} ảnh")
        print(f"Số lượng từ khóa: {len(self.keywords)}")
        for idx, kw in enumerate(self.keywords, 1):
            print(f"  {idx}. {kw}")
        print("=" * 65)

        start_time = time.time()

        # Phân bổ số ảnh tối đa cho mỗi từ khóa ở vòng quét ban đầu để đảm bảo đa dạng
        per_keyword_quota = max(8, (self.target_count // len(self.keywords)) + 2)

        # Quét lần lượt qua các từ khóa
        for round_num in range(1, 3):
            if self.new_downloaded >= self.target_count:
                break

            for kw in self.keywords:
                if self.new_downloaded >= self.target_count:
                    break

                print(f"\n>>> Đang quét từ khóa: '{kw}' (Vòng {round_num})...")
                encoded_kw = urllib.parse.quote(kw)
                search_url = f"https://www.pinterest.com/search/pins/?q={encoded_kw}"

                try:
                    extractor = gallery_dl.extractor.find(search_url)
                    if not extractor:
                        print(f"  [!] Không thể khởi tạo extractor cho: {kw}")
                        continue

                    kw_downloaded = 0
                    for item in extractor:
                        if self.new_downloaded >= self.target_count:
                            break

                        # item[0] == 3 là URL download trong gallery-dl
                        if item[0] == 3:
                            img_url = item[1]
                            metadata = item[2] if len(item) > 2 and isinstance(item[2], dict) else {}

                            success = self._process_candidate(img_url, metadata, kw)
                            if success:
                                kw_downloaded += 1
                                if round_num == 1 and kw_downloaded >= per_keyword_quota:
                                    print(f"  [i] Đã đạt hạn ngạch vòng 1 ({kw_downloaded} ảnh) cho '{kw}', chuyển từ khóa tiếp theo để tạo sự đa dạng...")
                                    break
                except Exception as e:
                    print(f"  [!] Lỗi khi quét từ khóa '{kw}': {e}")

        # Lưu lịch sử cuối cùng
        self._save_history()
        elapsed = time.time() - start_time

        # Báo cáo kết quả
        self.print_report(elapsed)

    def print_report(self, elapsed_seconds):
        """In báo cáo kết quả chi tiết theo yêu cầu."""
        print("\n" + "=" * 65)
        print(" BÁO CÁO TỔNG KẾT QUÁ TRÌNH TẢI ẢNH ")
        print("=" * 65)
        print(f" Thời gian thực thi: {elapsed_seconds:.1f} giây")
        print(f" Thư mục lưu trữ: {self.output_dir}")
        print(f" File lịch sử: {self.history_path}")
        print("-" * 65)
        print(f" 1. Tổng số ảnh đã quét được:         {self.total_scanned}")
        print(f" 2. Số ảnh mới đã tải thành công:      {self.new_downloaded}")
        print(f" 3. Số ảnh bị bỏ qua do trùng Link/ID: {self.skipped_duplicate_link}")
        print(f" 4. Số ảnh bị bỏ qua do trùng Nội dung:{self.skipped_duplicate_content} (MD5 / pHash)")
        if self.skipped_low_resolution > 0:
            print(f" 5. Số ảnh bị bỏ qua do độ phân giải thấp: {self.skipped_low_resolution}")
        if self.failed_downloads > 0:
            print(f" 6. Số ảnh tải lỗi đường truyền:          {self.failed_downloads}")
        print("=" * 65)


def main():
    parser = argparse.ArgumentParser(description="Tải ảnh tattoo văn hóa Việt Nam từ Pinterest")
    parser.add_argument("--target", type=int, default=DEFAULT_TARGET, help="Số lượng ảnh mới muốn tải (mặc định: 50)")
    parser.add_argument("--output", type=str, default=DEFAULT_OUTPUT_DIR, help="Thư mục lưu trữ (mặc định: D:\\AnhPinterest)")
    args = parser.parse_args()

    downloader = PinterestDownloader(
        output_dir=args.output,
        target_count=args.target,
    )
    downloader.run()


if __name__ == "__main__":
    main()
