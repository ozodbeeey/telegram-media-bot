import g4f
from gtts import gTTS
from deep_translator import GoogleTranslator
import asyncio
import os

async def ask_ai(prompt):
    """
    Get response from Free AI Provider (g4f).
    Using Bing or other stable providers.
    """
    try:
        # Using run_in_executor because g4f might be sync blocking
        loop = asyncio.get_event_loop()
        
        def _get_response():
            # You can change provider if one fails. Auto is usually best.
            response = g4f.ChatCompletion.create(
                model=g4f.models.default,
                messages=[{"role": "user", "content": prompt}],
            )
            return response

        response = await loop.run_in_executor(None, _get_response)
        return response if response else "Kechirasiz, javob ololmadim."
        
    except Exception as e:
        return f"Xatolik: {e}"

async def text_to_speech(text, lang='uz', output_path='tts.mp3'):
    """
    Convert text to speech using gTTS.
    lang: 'uz', 'en', 'ru'
    """
    try:
        loop = asyncio.get_event_loop()
        
        def _save_tts():
            try:
                # Try Uzbek first
                tts = gTTS(text=text, lang=lang, slow=False)
                tts.save(output_path)
            except ValueError:
                # Fallback to Turkish (closest Latin pronunciation) if Uzbek fails
                if lang == 'uz':
                    tts = gTTS(text=text, lang='tr', slow=False)
                    tts.save(output_path)
                else:
                    raise
            
        await loop.run_in_executor(None, _save_tts)
        return True, output_path
    except Exception as e:
        return False, str(e)

async def translate_text(text, target_lang='uz'):
    """
    Translate text to target language.
    target_lang: 'uz', 'en', 'ru'
    """
    try:
        loop = asyncio.get_event_loop()
        
        def _translate():
            translator = GoogleTranslator(source='auto', target=target_lang)
            return translator.translate(text)
            
        result = await loop.run_in_executor(None, _translate)
        return result
    except Exception as e:
        return f"Tarjima xatoligi: {e}"
