@echo off
echo ===================================================
echo GitHub-ga kod yuklash boshlandi...
echo ===================================================
echo.
echo Iltimos, agar Login so'rasa:
echo 1. "Sign in with browser" ni tanlang.
echo 2. Yoki Login/Parolingizni kiriting.
echo.

cd /d "%~dp0"
git remote set-url origin https://ozodbeeey@github.com/ozodbeeey/telegram-media-bot.git
git push -u origin main

echo.
echo ===================================================
echo Agar "Everything up-to-date" yoki "Success" chiqsa, hammasi joyida!
echo ===================================================
pause
