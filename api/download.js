export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      error: "An rasa video URL"
    });
  }

  try {
    const response = await fetch(
      "https://api.cobalt.tools/api/json",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: url,
          videoQuality: "720"
        })
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Cobalt API ta kasa amsawa"
      });
    }

    const data = await response.json();

    if (data.url) {
      return res.status(200).json({
        downloadUrl: data.url
      });
    }

    return res.status(400).json({
      error: "Ba a samu download URL ba"
    });
  } catch (error) {
    console.error("Download error:", error);

    return res.status(500).json({
      error: "Matsalar server ta faru"
    });
  }
}
