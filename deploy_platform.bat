@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo [1/3] Loyihani tekshirish (Build)...
echo ===================================================

:: Portable Node yo'lini aniqlash
set NODE_PATH=%~dp0stream-platform\node-v20.11.1-win-x64
set PATH=!NODE_PATH!;%PATH%

cd /d "%~dp0stream-platform"

echo Build boshlandi...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo [XATO] Build muvaffaqiyatsiz tugadi! Iltimos xatolarni ko'rib chiqing.
    pause
    exit /b %errorlevel%
)

echo.
echo ===================================================
echo [2/3] O'zgarishlarni GitHub-ga tayyorlash (Git Commit)...
echo ===================================================
cd /d "%~dp0"
git add .
set /p commit_msg="O'zgarishlar uchun nom kiriting (yoki bo'sh qoldiring): "
if "!commit_msg!"=="" set commit_msg="Avtomatik yangilanish: %date% %time%"

git commit -m "!commit_msg!"

echo.
echo ===================================================
echo [3/3] GitHub-ga yuklash (Git Push)...
echo ===================================================
git push origin main

echo.
echo ===================================================
echo [TAYYOR] Hammasi muvaffaqiyatli yakunlandi!
echo Netlify-da avtomatik yangilanish boshlanadi.
echo ===================================================
pause
