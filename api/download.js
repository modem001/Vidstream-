export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Sanya mahaɗin bidiyo (URL missing)' });
  }

  try {
    // Amfani da Cobalt API wajen ciro direct MP4 URL
    const response = await fetch('https://api.cobalt.tools/api/json', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url,
        videoQuality: '720'
      })
    });

    const data = await response.json();

    if (data.url) {
      return res.status(200).json({ downloadUrl: data.url });
    } else {
      return res.status(400).json({ error: 'Cannot download video' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Uwar gudu (Server error) ta faru' });
  }
}
