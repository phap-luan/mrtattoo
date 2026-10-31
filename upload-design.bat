@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ==========================================
echo   CAP NHAT ANH DESIGN (thumbnail + sizes.js)
echo ==========================================
echo.

if not exist "node_modules\sharp" (
  echo Dang cai thu vien sharp lan dau, vui long cho...
  call npm i sharp
  echo.
)

echo [1] Chi xu ly anh MOI (nhanh, dung hang ngay)
echo [2] Tao lai TOAN BO thumbnail (cham hon, dung khi doi kich thuoc/chat luong)
echo.
choice /c 12 /n /m "Chon 1 hoac 2: "
echo.

if errorlevel 2 (
  echo Dang tao lai toan bo thumbnail...
  node build-design.js --force
) else (
  echo Dang xu ly anh moi...
  node build-design.js
)

echo.
echo ==========================================
echo HOAN TAT! Ban co the kiem tra website.
echo ==========================================
pause
