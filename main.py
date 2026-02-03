import asyncio
import logging
import os
import sys
import glob
from dotenv import load_dotenv
from aiogram import Bot, Dispatcher, F
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart, StateFilter
from aiogram.types import Message, FSInputFile, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton, ContentType, ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
import yt_dlp
import converters
import music_recognizer

# Load environment variables
load_dotenv()
TOKEN = os.getenv("BOT_TOKEN")

# Configure logging
logging.basicConfig(level=logging.INFO, stream=sys.stdout)

# Initialize Bot
bot = Bot(token=TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
dp = Dispatcher()

# Constants
DOWNLOAD_DIR = "downloads"
if not os.path.exists(DOWNLOAD_DIR):
    os.makedirs(DOWNLOAD_DIR)

class BotStates(StatesGroup):
    menu = State()
    downloader = State()
    converter = State()
    music_finder = State()

def get_main_menu():
    return ReplyKeyboardMarkup(keyboard=[
        [KeyboardButton(text="📥 Media Yuklash"), KeyboardButton(text="🔄 Hujjat Konverter")],
        [KeyboardButton(text="🎵 Musiqa Qidirish (Shazam)")]
    ], resize_keyboard=True)

def get_back_button():
    return ReplyKeyboardMarkup(keyboard=[
        [KeyboardButton(text="⬅️ Bosh menyu")]
    ], resize_keyboard=True)

def get_format_keyboard():
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="🎬 Video", callback_data="type_video"),
            InlineKeyboardButton(text="🎵 Audio (MP3)", callback_data="type_audio")
        ]
    ])
    return keyboard

@dp.message(CommandStart())
async def command_start_handler(message: Message, state: FSMContext):
    await state.set_state(BotStates.menu)
    await message.answer(
        f"Assalomu alaykum, {message.from_user.full_name}!\n\n"
        "Xizmat turini tanlang:",
        reply_markup=get_main_menu()
    )

@dp.message(StateFilter('*'), F.text == "⬅️ Bosh menyu")
async def back_to_menu(message: Message, state: FSMContext):
    await state.set_state(BotStates.menu)
    await message.answer("Bosh menyu:", reply_markup=get_main_menu())

@dp.message(BotStates.menu)
@dp.message(BotStates.menu)
async def menu_handler(message: Message, state: FSMContext):
    text = message.text.strip() if message.text else ""
    
    # 1. Smart Link Detection (Auto-switch to Downloader)
    if "instagram.com" in text or "youtube.com" in text or "youtu.be" in text:
        await state.set_state(BotStates.downloader)
        # Call the link handler logic directly
        await link_handler(message)
        return

    # 2. Button Handling (Partial matching for robustness)
    if "Media Yuklash" in text:
        await state.set_state(BotStates.downloader)
        await message.answer(
            "<b>Media Yuklash bo'limi</b> 📥\n\n"
            "YouTube yoki Instagram havolasini yuboring:",
            reply_markup=get_back_button()
        )
    elif "Hujjat Konverter" in text:
        await state.set_state(BotStates.converter)
        await message.answer(
            "<b>Hujjat Konverter bo'limi</b> 🔄\n\n"
            "Konvertatsiya qilish uchun fayl (PDF, DOCX, XLSX) yuboring:",
            reply_markup=get_back_button()
        )
    elif "Musiqa Qidirish" in text: # "Shazam" might be in brackets
        await state.set_state(BotStates.music_finder)
        await message.answer(
            "<b>Musiqa Qidirish (Shazam)</b> 🎵\n\n"
            "Musiqani topish uchun <b>Nomini yozing</b>, yoki <b>Video/Audio</b> yuboring:",
            reply_markup=get_back_button()
        )
    else:
        await message.answer(
            "Iltimos, pastdagi tugmalardan birini tanlang yoki to'g'ridan-to'g'ri havola yuboring:", 
            reply_markup=get_main_menu()
        )


@dp.message(BotStates.converter, F.document)
async def document_handler(message: Message):
    doc = message.document
    file_name = doc.file_name if doc.file_name else "file"
    file_ext = os.path.splitext(file_name)[1].lower()
    
    keyboard = None
    
    if file_ext == '.pdf':
        keyboard = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="📄 Word (DOCX)", callback_data="conv_pdf_docx")],
            [InlineKeyboardButton(text="📊 PowerPoint (PPTX)", callback_data="conv_pdf_pptx")]
        ])
    elif file_ext == '.docx':
        keyboard = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="📗 Excel (Jadvallar)", callback_data="conv_docx_xlsx")]
        ])
    elif file_ext == '.xlsx':
        keyboard = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="📄 Word (Jadval)", callback_data="conv_xlsx_docx")]
        ])
        
    if keyboard:
        # Save file info in state or rely on reply_to_message in callback
        await message.reply("Konvertatsiya turini tanlang:", reply_markup=keyboard)
    else:
        await message.answer("Kechirasiz, men hozircha faqat PDF, Word va Excel fayllarni konvertatsiya qila olaman.")

@dp.callback_query(F.data.startswith("conv_"))
async def callbacks_converter(callback: CallbackQuery):
    action = callback.data
    
    if not callback.message.reply_to_message or not callback.message.reply_to_message.document:
        await callback.answer("Fayl topilmadi.", show_alert=True)
        return

    document = callback.message.reply_to_message.document
    await callback.message.edit_text("⏳ Konvertatsiya qilinmoqda... Kuting.")
    
    try:
        # Download file
        file_id = document.file_id
        file_name = document.file_name
        file_ext = os.path.splitext(file_name)[1].lower()
        input_path = f"{DOWNLOAD_DIR}/{file_id}{file_ext}"
        
        file = await bot.get_file(file_id)
        await bot.download_file(file.file_path, input_path)
        
        output_path = ""
        output_caption = ""
        
        if action == "conv_pdf_docx":
            output_path = input_path.replace(".pdf", ".docx")
            await converters.convert_pdf_to_word(input_path, output_path)
            output_caption = "📄 <b>Word fayl tayyor!</b>"
            
        elif action == "conv_pdf_pptx":
            output_path = input_path.replace(".pdf", ".pptx")
            await converters.convert_pdf_to_pptx(input_path, output_path)
            output_caption = "📊 <b>PowerPoint fayl tayyor!</b>"
            
        elif action == "conv_docx_xlsx":
            output_path = input_path.replace(".docx", ".xlsx")
            await converters.convert_word_to_excel(input_path, output_path)
            output_caption = "📗 <b>Excel fayl tayyor!</b>"
            
        elif action == "conv_xlsx_docx":
            output_path = input_path.replace(".xlsx", ".docx")
            await converters.convert_excel_to_word(input_path, output_path)
            output_caption = "📄 <b>Word fayl tayyor!</b>"
            
        # Send result
        if os.path.exists(output_path):
            result_file = FSInputFile(output_path)
            await callback.message.answer_document(
                document=result_file,
                caption=f"{output_caption}\n\n@SizningBotingiz"
            )
            os.remove(output_path)
        else:
            await callback.message.edit_text("❌ Xatolik: Natija fayli hosil bo'lmadi.")
            
        # Cleanup input
        os.remove(input_path)
        await callback.message.delete()
        
    except Exception as e:
        logging.error(f"Conversion Error: {e}")
        await callback.message.edit_text(f"❌ Xatolik yuz berdi: {e}")

@dp.message(BotStates.downloader, F.text)
async def link_handler(message: Message):
    text = message.text
    if "instagram.com" in text or "youtube.com" in text or "youtu.be" in text:
        await message.reply(
            "Nima yuklab olmoqchisiz?",
            reply_markup=get_format_keyboard()
        )
    else:
        await message.answer("Iltimos, to'g'ri YouTube yoki Instagram havolasini yuboring.")

@dp.message(BotStates.downloader)
async def downloader_wrong_input(message: Message):
    await message.answer("Iltimos, havola (link) yuboring.")

@dp.message(BotStates.converter)
async def converter_wrong_input(message: Message):
    await message.answer("Iltimos, fayl (PDF, DOCX, XLSX) yuboring.")

@dp.message(BotStates.music_finder, F.content_type.in_({'video', 'audio', 'voice', 'video_note'}))
async def music_finder_handler(message: Message):
    await message.answer("⏳ <b>Eshitmoqdaman...</b> (Bu biroz vaqt olishi mumkin)")
    
    file_id = None
    if message.video: file_id = message.video.file_id
    elif message.audio: file_id = message.audio.file_id
    elif message.voice: file_id = message.voice.file_id
    elif message.video_note: file_id = message.video_note.file_id
    
    if not file_id:
        await message.answer("❌ Faylni o'qib bo'lmadi.")
        return

    # Temporary file path
    temp_path = f"{DOWNLOAD_DIR}/temp_{file_id}"
    
    try:
        # 1. Download snippet
        file = await bot.get_file(file_id)
        # Determine extension from file_path or default
        ext = os.path.splitext(file.file_path)[1]
        temp_path += ext
        await bot.download_file(file.file_path, temp_path)
        
        # 2. Recognize
        result = await music_recognizer.recognize_audio(temp_path)
        
        # Cleanup temp file immediately
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        if result:
            await message.answer(
                f"🔎 <b>Topildi:</b> {result['artist']} - {result['title']}\n"
                "⬇️ <i>To'liq versiyasini yuklayapman...</i>"
            )
            # 3. Download Full MP3 via YouTube Search
            search_query = f"ytsearch1:{result['full_name']} audio"
            # Re-use audio download logic logic but customized for search
            await download_and_send_audio(message, search_query)
        else:
            await message.answer("❌ Afsuski, bu musiqani taniy olmadim.")
            
    except Exception as e:
        logging.error(f"Music Finder Error: {e}")
        await message.answer(f"❌ Xatolik yuz berdi: {e}")
        if os.path.exists(temp_path):
            os.remove(temp_path)

@dp.message(BotStates.music_finder, F.text)
async def music_finder_text_handler(message: Message):
    query = message.text
    await message.answer(f"🔎 <b>Qidirilmoqda:</b> {query}\n⬇️ <i>Topib, yuklayapman...</i>")
    
    # Search and download via YouTube
    search_query = f"ytsearch1:{query} audio"
    await download_and_send_audio(message, search_query)

@dp.message(BotStates.music_finder)
async def music_finder_wrong_input(message: Message):
    await message.answer("Musiqa topish uchun <b>Nomini yozing</b> yoki <b>Video/Audio/Ovozli xabar</b> yuboring.")

@dp.callback_query(F.data.startswith("type_"))
async def callbacks_num(callback: CallbackQuery):
    action = callback.data.split("_")[1]
    
    # Get the link from the original message that was replied to/attached
    # Actually, the buttons are attached to the bot's message "Nima yuklab olmoqchisiz?".
    # That bot message is a reply to the User's message containing the link.
    # So callback.message is the Bot's message.
    # callback.message.reply_to_message is the User's message with the link.
    
    if not callback.message.reply_to_message or not callback.message.reply_to_message.text:
        await callback.answer("Xatolik: Havola topilmadi.", show_alert=True)
        return

    url = callback.message.reply_to_message.text
    await callback.message.edit_text("⏳ Yuklanmoqda... Iltimos kuting.")
    
    try:
        if action == "video":
            await download_and_send_video(callback.message, url)
        elif action == "audio":
            await download_and_send_audio(callback.message, url)
    except Exception as e:
        logging.error(f"Error: {e}")
        await callback.message.edit_text(f"❌ Xatolik yuz berdi: {str(e)}")

async def download_and_send_video(message: Message, url: str):
    ydl_opts = {
        'format': 'best[ext=mp4]/best', # Best mp4 video
        'outtmpl': f'{DOWNLOAD_DIR}/%(id)s.%(ext)s',
        'noplaylist': True,
        'max_filesize': 50 * 1024 * 1024, # 50MB limit approximate
    }
    
    # Check for cookies.txt (Server/Local fallback)
    if os.path.exists('cookies.txt'):
        ydl_opts['cookiefile'] = 'cookies.txt'
    else:
        ydl_opts['cookiesfrombrowser'] = ('chrome',) 
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)
            
            # Send file
            video_file = FSInputFile(filename)
            await message.bot.send_video(
                chat_id=message.chat.id,
                video=video_file,
                caption=f"🎬 <b>{info.get('title', 'Video')}</b>\n\n@SizningBotingiz"
            )
            
            # Cleanup
            os.remove(filename)
    except yt_dlp.utils.DownloadError as e:
        await message.edit_text(f"❌ Yuklab bo'lmadi. Fayl juda katta bo'lishi mumkin (Limit 50MB).\nXato: {e}")
    except Exception as e:
        await message.edit_text(f"❌ Kutilmagan xatolik: {e}")


async def download_and_send_audio(message: Message, url: str):
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': f'{DOWNLOAD_DIR}/%(id)s.%(ext)s',
        'noplaylist': True,
        'max_filesize': 50 * 1024 * 1024,
    }

    # Check for cookies.txt (Server/Local fallback)
    if os.path.exists('cookies.txt'):
        ydl_opts['cookiefile'] = 'cookies.txt'
    else:
        ydl_opts['cookiesfrombrowser'] = ('chrome',)
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            # Filename might change due to postprocessing (.mp3)
            # Prepare filename returns the *original* ext usually? 
            # Safest is to find the file or trust prepare_filename then change ext
            filename_base = ydl.prepare_filename(info)
            filename = os.path.splitext(filename_base)[0] + ".mp3"
            
            # Check if file exists, sometimes yt-dlp naming can vary slightly
            if not os.path.exists(filename):
                # Fallback search
                files = glob.glob(f"{DOWNLOAD_DIR}/{info['id']}*.mp3")
                if files:
                    filename = files[0]
            
            audio_file = FSInputFile(filename)
            await message.bot.send_audio(
                chat_id=message.chat.id,
                audio=audio_file,
                caption=f"🎵 <b>{info.get('title', 'Audio')}</b>\n\n@SizningBotingiz"
            )
            
            os.remove(filename)
    except Exception as e:
        await message.edit_text(f"❌ Audio yuklashda xatolik: {e}")

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
