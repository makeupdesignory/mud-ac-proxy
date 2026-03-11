// Proxy ActiveCampaign API — bypassa il CORS dal browser
export default async function handler(req, res) {
  // Permetti chiamate dal browser (CORS)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-ac-url, x-ac-key");

  if (req.method === "OPTIONS") return res.status(200).end();

  const acUrl = req.headers["x-ac-url"];
  const acKey = req.headers["x-ac-key"];
  const path  = req.query.path || "";

  if (!acUrl || !acKey) {
    return res.status(400).json({ error: "Mancano x-ac-url o x-ac-key negli headers" });
  }

  try {
    const url = `${acUrl.replace(/\/$/, "")}/api/3/${path}`;
    const upstream = await fetch(url, {
      headers: { "Api-Token": acKey, "Content-Type": "application/json" },
    });
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
