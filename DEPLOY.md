# Botni Render-ga joylash bo'yicha qo'llanma

Bu qo'llanma orqali siz botni bepul Render serveriga joylashingiz mumkin.

## 1. Instagram uchun Cookie olish (Server uchun shart!)
Render serverida Chrome brauzeri yo'q, shuning uchun biz unga login qilingan faylni (`cookies.txt`) berishimiz kerak.

1.  Kompyuteringizda **Chrome** brauzerini oching.
2.  [Get cookies.txt LOCALLY](https://chrome.google.com/webstore/detail/get-cookiestxt-locally/cclelndahbckbenkjhflccgomjciolap) kengaytmasini (extension) o'rnating.
3.  **Instagram.com** ga kiring va o'z akkauntingizga login qiling.
4.  O'ng yuqoridagi "Cookie" ikonkasini bosing.
5.  **Export** tugmasini bosib, faylni yuklab oling.
6.  Fayl nomini **`cookies.txt`** deb o'zgartiring va loyiha papkasiga (ozodbek papkasi ichiga) tashlang.

## 2. GitHub-ga yuklash
Loyiha papkasida (Terminalda) quyidagi buyruqlarni birma-bir yozing:

```bash
git init
git add .
git commit -m "Bot tayyor"
```

*Agar sizda hali GitHub repozitoriyasi yo'q bo'lsa:*
1.  [GitHub.com](https://github.com) ga kiring va yangi repozitoriy oching (nomini `ozodbek-bot` qo'ying).
2.  "Private" (shaxsiy) qilib ochgan ma'qul (chunki ichida cookies.txt bor).
3.  GitHub bergan havolani olib, terminalga yozing:
    ```bash
    git branch -M main
    git remote add origin https://github.com/SIZNING_NICKNAME/ozodbek-bot.git
    git push -u origin main
    ```

## 3. Render.com ga ulash
1.  [Render.com](https://render.com) ga kiring va ro'yxatdan o'ting (GitHub orqali kirsangiz osonroq).
2.  **"New +"** tugmasini bosib, **"Web Service"** ni tanlang (yoki Background Worker ham bo'ladi, lekin Web Service tekin).
3.  **"Build and deploy from a Git repository"** ni tanlang.
4.  Ro'yxatdan `ozodbek-bot` ni topib, **Connect** ni bosing.

## 4. Render Sozlamalari
Quyidagi narsalarni to'g'ri to'ldiring:

*   **Name:** `ozodbek-bot`
*   **Region:** Frankfurt (yoki xohlaganingiz)
*   **Branch:** `main`
*   **Runtime:** **Docker** (juda muhim!)
*   **Instance Type:** Free

Pastrog'ida **Environment Variables** degan joy bor. "Add Environment Variable" ni bosib qo'shing:
*   **Key:** `BOT_TOKEN`
*   **Value:** `(BotFather bergan tokeningizni shu yerga yozing)`

## 5. Ishga tushirish
Hammasi tayyor bo'lsa, pastdagi **"Create Web Service"** tugmasini bosing.
Render botni o'zi quradi (Build) va ishga tushiradi. Bu jarayon 3-5 daqiqa vaqt olishi mumkin.

Agar hammasi to'g'ri bo'lsa, loglarda `Start polling` chiqadi va botingiz 24 soat ishlaydi!
