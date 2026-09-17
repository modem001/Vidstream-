export default async function handler(req, res) {
  const { q } = req.query;
  const API_KEY = process.env.YOUTUBE_API_KEY;

  if (!q) {
    return res.status(400).json({ error: 'Sanya abin da kake bincike' });
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&type=video&q=${encodeURIComponent(q)}&key=${API_KEY}`
    );
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Kuskure wajen haɗuwa da YouTube' });
  }
}

