export default async function handler(req, res) {
  const { videoId } = req.query;

  if (!videoId) {
    return res.status(400).json({ error: 'Sanya videoId' });
  }

  try {
    const response = await fetch('https://api.cobalt.tools/api/json', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: `https://www.youtube.com/watch?v=${videoId}`,
        videoQuality: '720'
      })
    });

    const data = await response.json();

    if (data && data.url) {
      return res.status(200).json({ downloadUrl: data.url });
    } else {
      return res.status(500).json({ error: 'An kasa samun download link' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Kuskure wajen ciro bidiyo' });
  }
}
