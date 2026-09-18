import os
import tempfile
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
import yt_dlp

app = FastAPI(title="VidStream Downloader")


class DownloadRequest(BaseModel):
    url: str
    format: str = "video"
    quality: str = "720p"


@app.get("/")
def home():
    return {
        "status": "online",
        "service": "VidStream yt-dlp Downloader"
    }


@app.post("/download")
def download_video(request: DownloadRequest):
    if not request.url.startswith(("https://www.youtube.com/", "https://youtu.be/")):
        raise HTTPException(
            status_code=400,
            detail="Ana karɓar YouTube URLs kawai a wannan matakin."
        )

    temp_dir = tempfile.mkdtemp()

    if request.format == "audio":
        output_format = "bestaudio/best"
        postprocessors = [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "128"
        }]
    else:
        output_format = (
            f"bestvideo[height<={request.quality.replace('p', '')}]"
            f"+bestaudio/best"
        )
        postprocessors = []

    options = {
        "format": output_format,
        "outtmpl": os.path.join(temp_dir, "%(title)s.%(ext)s"),
        "merge_output_format": "mp4",
        "noplaylist": True,
        "quiet": True,
        "postprocessors": postprocessors
    }

    try:
        with yt_dlp.YoutubeDL(options) as ydl:
            info = ydl.extract_info(request.url, download=True)
            filename = ydl.prepare_filename(info)

            if request.format == "audio":
                filename = os.path.splitext(filename)[0] + ".mp3"
            else:
                filename = os.path.splitext(filename)[0] + ".mp4"

        if not os.path.exists(filename):
            raise HTTPException(
                status_code=500,
                detail="An kasa samun downloaded file."
            )

        return FileResponse(
            filename,
            media_type="application/octet-stream",
            filename=os.path.basename(filename)
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Download error: {str(error)}"
        )
