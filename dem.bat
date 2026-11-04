@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ================================================
echo   KIỂM TRA FILE CÒN THIẾU (TỪ 1 ĐẾN 98)
echo ================================================
echo.

set "prefix=medium-large-tattoo_"
set "ext=.webp"
set "min=1"
set "max=98"
set "missing_count=0"

echo Các file còn thiếu:
echo ------------------------------------------------

for /L %%i in (%min%, 1, %max%) do (
    if not exist "%prefix%%%i%ext%" (
        echo  - %prefix%%%i%ext% [Thiếu số %%i]
        set /a missing_count+=1
    )
)

echo ------------------------------------------------
echo Tổng số file còn thiếu: !missing_count! / %max%
echo ================================================
echo.
pause