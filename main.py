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
import ffmpeg_utils
import homework
import presentation
import ai_tools

# Load environment variables
load_dotenv()
TOKEN = os.getenv("BOT_TOKEN")
if not TOKEN:
    sys.exit("Error: BOT_TOKEN topilmadi! .env faylini tekshiring.")

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
    editor = State()
    homework = State()
    presentation = State()
    ai_chat = State()
    tts = State()
    translator = State()

def get_main_menu():
    return ReplyKeyboardMarkup(keyboard=[
        [KeyboardButton(text="📥 Media Yuklash"), KeyboardButton(text="🎬 Video Tahrirlash")],
        [KeyboardButton(text="🎵 Musiqa Qidirish (Shazam)"), KeyboardButton(text="🎓 Studentlar uchun")],
        [KeyboardButton(text="📝 Mustaqil ish"), KeyboardButton(text="🖥 Prezentatsiya")],
        [KeyboardButton(text="🤖 AI Yordamchi"), KeyboardButton(text="🗣 Matn -> Ovoz"), KeyboardButton(text="🌍 Tarjimon")]
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
    elif "Musiqa Qidirish" in text: # "Shazam" might be in brackets
        await state.set_state(BotStates.music_finder)
        await message.answer(
            "<b>Musiqa Qidirish (Shazam)</b> 🎵\n\n"
            "Musiqani topish uchun <b>Nomini yozing</b>, yoki <b>Video/Audio</b> yuboring:",
            reply_markup=get_back_button()
        )
    elif "Video Tahrirlash" in text:
        await state.set_state(BotStates.editor)
        await message.answer(
            "<b>Video Tahrirlash</b> 🎬\n\n"
            "Tahrirlash uchun <b>Video yuboring</b>:",
            reply_markup=get_back_button()
        )
    elif "Studentlar uchun" in text:
        await state.set_state(BotStates.converter)
        await message.answer(
            "<b>🎓 Studentlar uchun (Converter)</b>\n\n"
            "Quyidagi formatdagi fayllarni yuboring:\n"
            "📄 <b>PDF, Word (DOCX), Excel (XLSX), PowerPoint (PPTX)</b>\n\n"
            "Men ularni bir formatdan boshqasiga o'tkazib beraman.",
            reply_markup=get_back_button()
        )
    elif "Mustaqil ish" in text:
        await state.set_state(BotStates.homework)
        await message.answer(
            "<b>📝 Mustaqil ish (Referat) kerakmi?</b>\n\n"
            "Mavzuni yozing (masalan: <i>Amir Temur, Iqtisodiyot, Python</i>):",
            reply_markup=get_back_button()
        )
    elif "Prezentatsiya" in text:
        await state.set_state(BotStates.presentation)
        await message.answer(
            "<b>🖥 Prezentatsiya (Slayd) yaratish</b>\n\n"
            "Mavzuni yozing (masalan: <i>Amir Temur, Marketing, Fizika</i>):",
            reply_markup=get_back_button()
        )
    elif "AI Yordamchi" in text:
        await state.set_state(BotStates.ai_chat)
        await message.answer(
            "<b>🤖 AI Yordamchi (ChatGPT)</b>\n\n"
            "Savolingizni yozing, men javob beraman:",
            reply_markup=get_back_button()
        )
    elif "Matn -> Ovoz" in text:
        await state.set_state(BotStates.tts)
        await message.answer(
            "<b>🗣 Matnni Ovozga aylantirish</b>\n\n"
            "Matnni yozing, men uni o'qib beraman (MP3):",
            reply_markup=get_back_button()
        )
    elif "Tarjimon" in text:
        await state.set_state(BotStates.translator)
        await message.answer(
            "<b>🌍 Tarjimon (Google)</b>\n\n"
            "So'z yoki matn yozing, men uni <b>O'zbekchaga</b> tarjima qilaman.\n"
            "<i>(Boshqa tilga o'girish uchun, masalan: 'en hello' deb yozing)</i>",
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
    status_msg = await message.answer("⏳ <b>Eshitmoqdaman...</b> (Bu biroz vaqt olishi mumkin)")
    
    file_id = None
    if message.video: file_id = message.video.file_id
    elif message.audio: file_id = message.audio.file_id
    elif message.voice: file_id = message.voice.file_id
    elif message.video_note: file_id = message.video_note.file_id
    
    if not file_id:
        await status_msg.edit_text("❌ Faylni o'qib bo'lmadi.")
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
            await status_msg.delete() # Clean up status
            await message.answer(
                f"🔎 <b>Topildi:</b> {result['artist']} - {result['title']}\n"
                "⬇️ <i>To'liq versiyasini yuklayapman...</i>"
            )
            # 3. Download Full MP3 via YouTube Search
            search_query = f"ytsearch1:{result['full_name']} audio"
            # Re-use audio download logic logic but customized for search
            await download_and_send_audio(message, search_query)
        else:
            await status_msg.edit_text("❌ Afsuski, bu musiqani taniy olmadim.")
            
    except Exception as e:
        logging.error(f"Music Finder Error: {e}")
        await status_msg.edit_text(f"❌ Xatolik yuz berdi: {e}")
        if os.path.exists(temp_path):
            os.remove(temp_path)

@dp.message(BotStates.music_finder, F.text)
async def music_finder_text_handler(message: Message):
    query = message.text
    status_msg = await message.answer(f"🔎 <b>Qidirilmoqda:</b> {query}...")
    
    ydl_opts = {
        'format': 'bestaudio/best',
        'noplaylist': True,
        'extract_flat': True, # Only metadata
        'quiet': True,
    }
    
    # Check for cookies (reuse logic if needed, but for search flat_playlist usually works without)
    if os.path.exists('cookies.txt'):
        ydl_opts['cookiefile'] = 'cookies.txt'

    search_query = f"ytsearch5:{query}"
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(search_query, download=False)
            
        if 'entries' not in info or not info['entries']:
            await status_msg.edit_text("❌ Hech narsa topilmadi.")
            return
            
        entries = info['entries']
        response_text = "<b>🎵 Topilgan musiqalar:</b>\n\n"
        buttons = []
        
        for i, entry in enumerate(entries):
            title = entry.get('title', 'Noma\'lum')
            vid_id = entry.get('id')
            response_text += f"<b>{i+1}.</b> {title}\n"
            # Button for each song
            buttons.append([InlineKeyboardButton(text=f"{i+1} ⬇️", callback_data=f"dl_song_{vid_id}")])
            
        buttons.append([InlineKeyboardButton(text="❌ Bekor qilish", callback_data="cancel_search")])
        markup = InlineKeyboardMarkup(inline_keyboard=buttons)
        
        await status_msg.edit_text(response_text, reply_markup=markup)
        
    except Exception as e:
        await status_msg.edit_text(f"❌ Qidiruvda xatolik: {e}")

@dp.callback_query(F.data.startswith("dl_song_"))
async def callbacks_download_song(callback: CallbackQuery):
    vid_id = callback.data.split("_")[2]
    url = f"https://www.youtube.com/watch?v={vid_id}"
    
    await callback.message.edit_text(f"⏳ <b>Yuklanmoqda...</b>\n<i>(ID: {vid_id})</i>")
    
    # Reuse the robust download function where we send 'url'
    # Note: callback.message is the bot's message. 
    # download_and_send_audio usually expects a user message to obtain chat_id.
    # But callback.message has chat.id too.
    await download_and_send_audio(callback.message, url)

@dp.callback_query(F.data == "cancel_search")
async def callbacks_cancel_search(callback: CallbackQuery):
    await callback.message.delete()
    await callback.answer("Bekor qilindi")

@dp.message(BotStates.music_finder)
async def music_finder_wrong_input(message: Message):
    await message.answer("Musiqa topish uchun <b>Nomini yozing</b> yoki <b>Video/Audio/Ovozli xabar</b> yuboring.")

# ----------------- VIDEO EDITOR HANDLERS -----------------

def get_editor_keyboard(video_id):
    # Using video_id in callback data to track sessions if needed, 
    # but simplest is to reply to the bot's message which has the video.
    # We will assume the user interacts with the message we send back.
    return InlineKeyboardMarkup(inline_keyboard=[
        [
            # InlineKeyboardButton(text="✂️ Kesish", callback_data="edit_trim"), # Complex, maybe later
            InlineKeyboardButton(text="📉 Kichraytirish", callback_data="edit_compress")
        ],
        [
            InlineKeyboardButton(text="⏩ Tezlashtirish (1.5x)", callback_data="edit_fast"),
            InlineKeyboardButton(text="🐌 Sekinlashtirish (0.5x)", callback_data="edit_slow")
        ],
        [
            InlineKeyboardButton(text="🔭 Telescope", callback_data="edit_note"),
            InlineKeyboardButton(text="🎵 MP3 qilish", callback_data="edit_mp3")
        ],
        [
            InlineKeyboardButton(text="🎙 Ovozli xabar", callback_data="edit_voice"),
            InlineKeyboardButton(text="🎼 Musiqani topish", callback_data="edit_find_music")
        ]
    ])

@dp.message(BotStates.editor, F.video)
async def editor_video_handler(message: Message, state: FSMContext):
    video = message.video
    # Ask what to do
    await message.reply(
        "Tahrirlash uchun quyidagi tugmalardan birini tanlang:",
        reply_markup=get_editor_keyboard(video.file_id)
    )

@dp.message(BotStates.editor)
async def editor_wrong_input(message: Message):
    await message.answer("Iltimos, tahrirlash uchun <b>Video</b> yuboring.")

@dp.callback_query(F.data.startswith("edit_"))
async def callbacks_editor(callback: CallbackQuery):
    action = callback.data
    
    # The message the user replied to (the video) is actually... wait.
    # The user sent a video. Bot replied with "Choose option". 
    # User clicks button on Bot's message.
    # So callback.message is the Bot's message.
    # callback.message.reply_to_message is the User's Video message.
    
    if not callback.message.reply_to_message or not callback.message.reply_to_message.video:
        await callback.answer("Video topilmadi. Qaytadan yuboring.", show_alert=True)
        return

    video = callback.message.reply_to_message.video
    file_id = video.file_id
    
    status_msg = await callback.message.edit_text("⏳ <b>Jarayon ketmoqda...</b>")
    
    input_path = f"{DOWNLOAD_DIR}/edit_in_{file_id}.mp4"
    output_path = ""
    output_type = "document" # document, audio, voice, video, video_note
    
    try:
        # Download
        file = await bot.get_file(file_id)
        await bot.download_file(file.file_path, input_path)
        
        caption = "(📥@instgramyoutubedowbot orqali istagan musiqangizni tez va oson toping!)"
        
        if action == "edit_mp3":
            output_path = f"{DOWNLOAD_DIR}/edit_out_{file_id}.mp3"
            await ffmpeg_utils.video_to_mp3(input_path, output_path)
            output_type = "audio"
            
        elif action == "edit_voice":
            output_path = f"{DOWNLOAD_DIR}/edit_out_{file_id}.ogg"
            await ffmpeg_utils.video_to_voice(input_path, output_path)
            output_type = "voice"
            
        elif action == "edit_compress":
            output_path = f"{DOWNLOAD_DIR}/edit_out_{file_id}.mp4"
            await ffmpeg_utils.compress_video(input_path, output_path)
            output_type = "video"
            
        elif action == "edit_fast":
            output_path = f"{DOWNLOAD_DIR}/edit_out_{file_id}.mp4"
            await ffmpeg_utils.change_speed(input_path, output_path, 1.5)
            output_type = "video"
            
        elif action == "edit_slow":
            output_path = f"{DOWNLOAD_DIR}/edit_out_{file_id}.mp4"
            await ffmpeg_utils.change_speed(input_path, output_path, 0.5)
            output_type = "video"
            
        elif action == "edit_note":
            output_path = f"{DOWNLOAD_DIR}/edit_out_{file_id}.mp4"
            await ffmpeg_utils.video_to_note(input_path, output_path)
            output_type = "video_note"
            
        elif action == "edit_find_music":
            # Extract audio first for better recognition
            temp_audio_path = f"{DOWNLOAD_DIR}/temp_recog_{file_id}.mp3"
            await ffmpeg_utils.video_to_mp3(input_path, temp_audio_path)
            
            result = await music_recognizer.recognize_audio(temp_audio_path)
            
            # Cleanup temp audio
            if os.path.exists(temp_audio_path):
                os.remove(temp_audio_path)
                
            if result:
                 await callback.message.answer(
                    f"🔎 <b>Topildi:</b> {result['artist']} - {result['title']}\n"
                    "⬇️ <i>To'liq versiyasini yuklayapman...</i>"
                )
                 search_query = f"ytsearch1:{result['full_name']} audio"
                 await download_and_send_audio(callback.message, search_query)
                 await status_msg.delete()
                 os.remove(input_path)
                 return
            else:
                 await status_msg.edit_text("❌ Afsuski, musiqani taniy olmadim.")
                 os.remove(input_path)
                 return
        
        # Send Result
        if os.path.exists(output_path):
            result_file = FSInputFile(output_path)
            if output_type == "audio":
                await callback.message.answer_audio(audio=result_file, caption=caption)
            elif output_type == "voice":
                await callback.message.answer_voice(voice=result_file, caption=caption) 
            elif output_type == "video_note":
                await callback.message.answer_video_note(video_note=result_file)
            else:
                await callback.message.answer_video(video=result_file, caption=caption)
            
            await status_msg.delete()
        else:
            await status_msg.edit_text("❌ Xatolik: Natija fayli hosil bo'lmadi.")
            
    except Exception as e:
        logging.error(f"Editor Error: {e}")
        await status_msg.edit_text(f"❌ Xatolik: {e}")
        
    finally:
        # Cleanup both input and output files
        if os.path.exists(input_path):
            os.remove(input_path)
        if output_path and os.path.exists(output_path):
            os.remove(output_path)

# ----------------- HOMEWORK HANDLER -----------------

@dp.message(BotStates.homework, F.text)
async def homework_handler(message: Message, state: FSMContext):
    topic = message.text
    status_msg = await message.answer(f"🔎 <b>{topic}</b> haqida ma'lumot qidiryapman...\n<i>(Wikipediadan olib Word fayl yasayman)</i>")
    
    # Safe filename
    safe_topic = "".join([c for c in topic if c.isalnum() or c in (' ', '_', '-')]).strip()
    output_path = f"{DOWNLOAD_DIR}/{safe_topic}.docx"
    
    try:
        # Run sync function in thread to not block event loop
        loop = asyncio.get_event_loop()
        success, msg = await loop.run_in_executor(None, homework.generate_homework, topic, output_path)
        
        if success:
            doc_file = FSInputFile(output_path)
            await message.bot.send_document(
                chat_id=message.chat.id,
                document=doc_file,
                caption=f"📝 <b>Mustaqil ish tayyor!</b>\n\nMavzu: {topic}\nManba: Wikipedia"
            )
            await status_msg.delete()
        else:
            await status_msg.edit_text(f"❌ {msg}")
            
    except Exception as e:
        await status_msg.edit_text(f"❌ Xatolik: {e}")
        
    finally:
        if os.path.exists(output_path):
            os.remove(output_path)

# ----------------- PRESENTATION HANDLER -----------------

@dp.message(BotStates.presentation, F.text)
async def presentation_handler(message: Message, state: FSMContext):
    topic = message.text
    status_msg = await message.answer(f"⏳ <b>{topic}</b> bo'yicha slayd tayyorlanmoqda...\n<i>(Biroz vaqt olishi mumkin)</i>")
    
    safe_topic = "".join([c for c in topic if c.isalnum() or c in (' ', '_', '-')]).strip()
    output_path = f"{DOWNLOAD_DIR}/{safe_topic}.pptx"
    
    try:
        loop = asyncio.get_event_loop()
        success, msg = await loop.run_in_executor(None, presentation.generate_presentation, topic, output_path)
        
        if success:
            ppt_file = FSInputFile(output_path)
            await message.bot.send_document(
                chat_id=message.chat.id,
                document=ppt_file,
                caption=(
                    f"🖥 <b>Slayd tayyor!</b>\n\nMavzu: {topic}\n\n"
                    "💡 <i>Eslatma: Faylni Powerpointda ochib, o'zingizga moslab (dizaynini o'zgartirib) olaverasiz.</i>"
                )
            )
            await status_msg.delete()
        else:
            await status_msg.edit_text(f"❌ {msg}")
            
    except Exception as e:
        await status_msg.edit_text(f"❌ Xatolik: {e}")
        
    finally:
        if os.path.exists(output_path):
            os.remove(output_path)

# ---------------------------------------------------------

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

@dp.callback_query(F.data == "check_music")
async def callbacks_check_music(callback: CallbackQuery):
    if not callback.message.video:
        await callback.answer("Video topilmadi.", show_alert=True)
        return

    video = callback.message.video
    file_id = video.file_id
    
    status_msg = await callback.message.reply("⏳ <b>Musiqa qidirilmoqda...</b>")
    
    input_path = f"{DOWNLOAD_DIR}/check_music_{file_id}.mp4"
    temp_audio_path = f"{DOWNLOAD_DIR}/check_music_{file_id}.mp3"
    
    try:
        # Download video
        file = await bot.get_file(file_id)
        await bot.download_file(file.file_path, input_path)
        
        # Extract audio using existing util
        await ffmpeg_utils.video_to_mp3(input_path, temp_audio_path)
        
        # Recognize
        result = await music_recognizer.recognize_audio(temp_audio_path)
        
        if result:
            await status_msg.delete()
            
            # Interactive Search Logic (Copied/Adapted from music_finder_text_handler)
            search_query = f"ytsearch5:{result['full_name']} audio"
            
            ydl_opts = {
                'format': 'bestaudio/best',
                'noplaylist': True,
                'extract_flat': True,
                'quiet': True,
            }
             # Check for cookies
            if os.path.exists('cookies.txt'):
                ydl_opts['cookiefile'] = 'cookies.txt'
                
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(search_query, download=False)
                
            if 'entries' not in info or not info['entries']:
                await callback.message.answer(f"🔎 <b>Topildi:</b> {result['artist']} - {result['title']}\n❌ Lekin YouTube-dan topib bo'lmadi.")
                return

            entries = info['entries']
            response_text = f"🔎 <b>Shazam orqali topildi:</b> {result['artist']} - {result['title']}\n\n<b>🎵 YouTube natijalari:</b>\n\n"
            buttons = []
            
            for i, entry in enumerate(entries):
                title = entry.get('title', 'Noma\'lum')
                vid_id = entry.get('id')
                response_text += f"<b>{i+1}.</b> {title}\n"
                buttons.append([InlineKeyboardButton(text=f"{i+1} ⬇️", callback_data=f"dl_song_{vid_id}")])
                
            buttons.append([InlineKeyboardButton(text="❌ Bekor qilish", callback_data="cancel_search")])
            markup = InlineKeyboardMarkup(inline_keyboard=buttons)
            
            await callback.message.answer(response_text, reply_markup=markup)

        else:
            await status_msg.edit_text("❌ Afsuski, bu videodagi musiqani taniy olmadim.")
            
    except Exception as e:
        await status_msg.edit_text(f"❌ Xatolik: {e}")
        logging.error(f"Check Music Error: {e}")
        
    finally:
        # Cleanup
        if os.path.exists(input_path): os.remove(input_path)
        if os.path.exists(temp_audio_path): os.remove(temp_audio_path)


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
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)
            
            # Send file
            video_file = FSInputFile(filename)
            
            # Button to check music
            kb = InlineKeyboardMarkup(inline_keyboard=[
                [InlineKeyboardButton(text="🎼 Musiqani topish", callback_data="check_music")]
            ])
            
            await message.bot.send_video(
                chat_id=message.chat.id,
                video=video_file,
                caption=f"🎬 <b>{info.get('title', 'Video')}</b>\n\n(📥@instgramyoutubedowbot orqali istagan musiqangizni tez va oson toping!)",
                reply_markup=kb
            )
            
            # Delete Status Message if it comes from the bot (e.g. "Yuklanmoqda...")
            if message.from_user.is_bot:
                try: await message.delete()
                except: pass
            
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
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            
            # 1. Handle "Search Results" (Playlist)
            if 'entries' in info:
                # Take the first item if it's a search result
                info = info['entries'][0]

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
                caption=f"🎵 <b>{info.get('title', 'Audio')}</b>\n\n(📥@instgramyoutubedowbot orqali istagan musiqangizni tez va oson toping!)"
            )
            
            # Delete Status Message if it comes from the bot (e.g. "Yuklanmoqda...")
            if message.from_user.is_bot:
                try: await message.delete()
                except: pass
            
            os.remove(filename)
    except Exception as e:
        await message.edit_text(f"❌ Audio yuklashda xatolik: {e}")

# ----------------- AI HANDLERS -----------------

@dp.message(BotStates.ai_chat, F.text)
async def ai_chat_handler(message: Message, state: FSMContext):
    user_text = message.text
    status_msg = await message.answer("🤖 <b>O'ylayapman...</b>")
    
    response = await ai_tools.ask_ai(user_text)
    
    # Check length (Telegram limit 4096)
    if len(response) > 4000:
        for x in range(0, len(response), 4000):
            await message.bot.send_message(message.chat.id, response[x:x+4000])
    else:
        await message.answer(response, parse_mode="Markdown") # AI uses markdown usually
        
    await status_msg.delete()

@dp.message(BotStates.tts, F.text)
async def tts_handler(message: Message, state: FSMContext):
    text = message.text
    logging.info(f"TTS Request: {text}")
    status_msg = await message.answer("🗣 <b>Ovoz yozilmoqda...</b>")
    
    output_path = f"{DOWNLOAD_DIR}/tts_{message.from_user.id}.mp3"
    
    try:
        success, result = await ai_tools.text_to_speech(text, lang='uz', output_path=output_path)
        
        if success and os.path.exists(output_path):
            voice_file = FSInputFile(output_path)
            await message.answer_audio(voice_file, caption=f"🗣 <b>Matn:</b> {text[:50]}...")
            await status_msg.delete()
        else:
            await status_msg.edit_text(f"❌ Ovoz yozishda xatolik: {result}")
            
    except Exception as e:
        logging.error(f"TTS Handler Error: {e}")
        await status_msg.edit_text(f"❌ Tizim xatoligi: {e}")
        
    finally:
        if os.path.exists(output_path):
            try: os.remove(output_path)
            except: pass

@dp.message(BotStates.translator, F.text)
async def translator_handler(message: Message, state: FSMContext):
    text = message.text
    
    # Simple logic: Detect if user explicitly wants EN/RU
    target = 'uz'
    content = text
    
    if text.lower().startswith('en '):
        target = 'en'
        content = text[3:]
    elif text.lower().startswith('ru '):
        target = 'ru'
        content = text[3:]
        
    translation = await ai_tools.translate_text(content, target_lang=target)
    
    await message.answer(
        f"🌍 <b>Tarjima ({target.upper()}):</b>\n\n"
        f"<code>{translation}</code>"
    )

async def main():
    print("Bot ishga tushmoqda...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
