# Telegram Media Downloader Bot

Ushbu bot YouTube va Instagram'dan video va audio yuklab olish imkonini beradi.

## ⚠️ Muhim Talablar

Bot to'liq ishlashi uchun kompyuteringizda quyidagilar o'rnatilgan bo'lishi shart:

1.  **Python** (3.8 yoki yuqori versiya)
2.  **FFmpeg** (Audio yuklash va formatlash uchun juda muhim!)

### FFmpeg o'rnatish (Windows)

Eng oson yo'li (agar `winget` bor bo'lsa, terminalda yozing):
```powershell
winget install Gyan.FFmpeg
```

Yoki [ffmpeg.org](https://ffmpeg.org/download.html) saytidan yuklab olib, PATH ga qo'shishingiz kerak.

## 🚀 O'rnatish va Ishga Tushirish

1.  **Kutubxonalarni o'rnatish**:
    Ushbu papkada terminal oching va quyidagi buyruqni yozing:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Botni ishga tushirish**:
    ```bash
    python main.py
    ```

## Botdan foydalanish

1.  Botga Telegram orqali `/start` bosing.
2.  Instagram yoki YouTube video linkini yuboring.
3.  "Video" yoki "Audio" tugmasini tanlang.
