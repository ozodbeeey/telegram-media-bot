import asyncio
import os
import logging

async def run_ffmpeg(command):
    """Run FFmpeg command asynchronously."""
    process = await asyncio.create_subprocess_exec(
        *command,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )
    stdout, stderr = await process.communicate()
    
    if process.returncode != 0:
        logging.error(f"FFmpeg Error: {stderr.decode()}")
        raise Exception("FFmpeg processing failed")
    return True

async def video_to_mp3(input_path, output_path):
    """Convert video to high-quality MP3."""
    cmd = [
        'ffmpeg', '-y',
        '-i', input_path,
        '-vn', # No video
        '-acodec', 'libmp3lame',
        '-q:a', '2', # High quality (VBR)
        output_path
    ]
    await run_ffmpeg(cmd)

async def video_to_voice(input_path, output_path):
    """Convert video to OGG Opus (Voice Message format)."""
    cmd = [
        'ffmpeg', '-y',
        '-i', input_path,
        '-vn',
        '-acodec', 'libopus',
        output_path
    ]
    await run_ffmpeg(cmd)

async def change_speed(input_path, output_path, factor):
    """Change video and audio speed. Factor > 1 is fast, < 1 is slow."""
    # Video filter: setpts=PTS/factor
    # Audio filter: atempo=factor
    
    # Note: atempo is limited to 0.5 to 2.0. For larger changes, chaining is needed,
    # but for this bot 0.5x (slow) and 1.5x/2x (fast) is sufficient.
    
    cmd = [
        'ffmpeg', '-y',
        '-i', input_path,
        '-filter_complex', f'[0:v]setpts=PTS/{factor}[v];[0:a]atempo={factor}[a]',
        '-map', '[v]', '-map', '[a]',
        '-c:v', 'libx264', '-preset', 'fast',
        output_path
    ]
    await run_ffmpeg(cmd)

async def compress_video(input_path, output_path):
    """Compress video using CRF."""
    cmd = [
        'ffmpeg', '-y',
        '-i', input_path,
        '-vcodec', 'libx264',
        '-crf', '28', # Higher = more compression
        '-preset', 'fast',
        output_path
    ]
    await run_ffmpeg(cmd)

async def video_to_note(input_path, output_path):
    """Convert video to circular video note (Square 640x640)."""
    # 1. Crop to square (center)
    # 2. Resize to 640x640
    cmd = [
        'ffmpeg', '-y',
        '-i', input_path,
        '-vf', 'crop=min(iw\,ih):min(iw\,ih),scale=640:640',
        '-c:v', 'libx264', '-preset', 'fast',
        '-an', # Video notes often have no sound or need specific audio encoding, usually ok with audio though. 
               # Let's keep audio but ensure format is compatible if Telegram requires specific encoding.
               # Telegram Video Notes are usually MP4 with H264 + AAC.
        '-c:a', 'aac',
        output_path
    ]
    await run_ffmpeg(cmd)

async def trim_video(input_path, output_path, start_time, duration):
    """Trim video."""
    cmd = [
        'ffmpeg', '-y',
        '-ss', str(start_time),
        '-i', input_path,
        '-t', str(duration),
        '-c', 'copy', # Fast copy if possible, but might desync. Encoding is safer for social apps.
        # Re-encoding:
        '-c:v', 'libx264', '-preset', 'fast',
        '-c:a', 'aac',
        output_path
    ]
    await run_ffmpeg(cmd)
