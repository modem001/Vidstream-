import ytdl from '@distube/ytdl-core';

export default async function handler(req, res) {
  const { videoId } = req.query;

  if (!videoId) {
    return res.status(400).json({ error: 'Sanya videoId' });
  }

  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    const info = await ytdl.getInfo(videoUrl);
    
    // Zaɓi tsarin MP4 mai ɗauke da sauti da bidiyo tare
    const format = ytdl.chooseFormat(info.formats, {
      quality: 'highestvideo',
      filter: 'audioandvideo'
    });

    if (!format || !format.url) {
      return res.status(404).json({ error: 'An kasa samun mahaɗin MP4' });
    }

    return res.status(200).json({
      title: info.videoDetails.title,
      downloadUrl: format.url
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Kuskure ya faru wajen ciro mahaɗin download' });
  }
}
