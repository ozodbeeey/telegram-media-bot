@echo off
title Telegram Bot Launcher
color 0A

echo ===================================================
echo  Telegram Botni Ishga Tushirish
echo ===================================================
echo.

:: 1. To'g'ri papkaga o'tish
cd /d "%~dp0"
echo [INFO] Hozirgi papka: %CD%

:: 2. Kutubxonalarni tekshirish va o'rnatish
echo.
echo [INFO] Kutubxonalarni o'rnatish tekshirilmoqda...
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [XATO] Kutubxonalarni o'rnatishda xatolik bo'ldi!
    pause
    exit /b
)

:: 3. Botni ishga tushirish (Auto-Restart bilan)
:loop
echo.
echo [INFO] Bot ishga tushirilmoqda...
echo ===================================================
python main.py
echo.
echo [OGOHLANTIRISH] Bot to'xtadi! 3 soniyadan keyin qayta yonadi...
echo To'xtatish uchun oynani yoping (X).
timeout /t 3
goto loop
