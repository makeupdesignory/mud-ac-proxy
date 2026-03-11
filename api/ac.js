export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-ac-url, x-ac-key");
  if (req.method === "OPTIONS") return res.status(200).end();
  const acUrl = req.headers["x-ac-url"];
  const acKey = req.headers["x-ac-key"];
  const path = req.query.path || "";
  if (!acUrl || !acKey) return res.status(400).json({ error: "Mancano headers" });
  try {
    const url = `${acUrl.replace(/\/$/, "")}/api/3/${path}`;
    const upstream = await fetch(url, { headers: { "Api-Token": acKey } });
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
