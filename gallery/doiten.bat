@echo off
chcp 65001 >nul
setlocal

echo ===================================================
echo    TOOL ĐỔI TÊN ẢNH .WEBP (CÓ TÙY CHỌN SỐ BẮT ĐẦU)
echo ===================================================
echo.

set /p "target_dir=Nhập đường dẫn thư mục chứa ảnh (Nhấn Enter dùng thư mục hiện tại): "
if "%target_dir%"=="" set "target_dir=%~dp0"

set /p "prefix=Nhập tiền tố tên mới (Ví dụ: mini-tattoo_): "
if "%prefix%"=="" (
    echo [LỖI] Tên mới không được để trống!
    pause
    exit
)

set /p "start_num=Nhập số thứ tự bắt đầu (Ví dụ: 590): "
if "%start_num%"=="" set "start_num=1"

echo.
echo Đang đổi tên, vui lòng chờ...
echo ---------------------------------------------------

:: Gọi PowerShell để đổi tên với số đếm bắt đầu tùy chỉnh
powershell -Command "$dir = '%target_dir%'; $prefix = '%prefix%'; $i = [int]%start_num%; Get-ChildItem -Path $dir -Filter '*.webp' | Sort-Object Name | ForEach-Object { $newName = '{0}{1:D3}.webp' -f $prefix, $i; Rename-Item $_.FullName -NewName $newName; Write-Host ('[OK] ' + $_.Name + ' ---> ' + $newName); $i++ }"

echo ---------------------------------------------------
echo [HOÀN TẤT] Đã đổi tên thành công theo số thứ tự mới!
echo ===================================================
pause