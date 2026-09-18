export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method ba a yarda da shi"
    });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      error: "An rasa video URL"
    });
  }

  try {
    const response = await fetch("https://api.cobalt.tools/", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: url,
        downloadMode: "auto",
        videoQuality: "720",
        filenameStyle: "basic"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.code || "Cobalt API ta kasa"
      });
    }

    if (data.status === "tunnel" || data.status === "redirect") {
      return res.status(200).json({
        downloadUrl: data.url
      });
    }

    if (data.status === "picker" && data.picker?.length) {
      return res.status(200).json({
        downloadUrl: data.picker[0].url
      });
    }

    return res.status(400).json({
      error: "Ba a samu download link ba",
      details: data
    });

  } catch (error) {
    console.error("Download error:", error);

    return res.status(500).json({
      error: "Matsalar server ta faru"
    });
  }
}
