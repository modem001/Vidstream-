export default async function handler(req, res) {
  const { url, format } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL required' });
  }

  try {
    const response = await fetch('https://api.cobalt.tools/api/json', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url,
        isAudioOnly: format === 'audio',
        aFormat: 'mp3',
        vQuality: '720'
      })
    });

    const data = await response.json();

    if (data && data.url) {
      return res.status(200).json({ downloadUrl: data.url });
    } else {
      return res.status(500).json({ error: 'An kasa ciro mahaɗin bidiyo' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
