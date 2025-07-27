export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENROUTER_KEY;
  if (!apiKey) {
    console.log("❌ المفتاح مش موجود");
    return res.status(500).json({ error: "API key not found!" });
  }

  try {
    const input = req.body;
    console.log("🔹 بيانات الطلب:", input);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input)
    });

    const data = await response.json();
    console.log("✅ الرد من OpenRouter:", data);

    return res.status(200).json(data);
  } catch (err) {
    console.log("🔥 Error:", err.message);
    return res.status(500).json({ error: "Error calling OpenRouter API", details: err.message });
  }
}