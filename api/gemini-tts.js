// File: api/gemini-tts.js
const axios = require('axios');

module.exports = async (req, res) => {
  // Set CORS headers to allow requests from any domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle pre-flight OPTIONS request from the browser
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: "API key is not configured." });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/text-to-speech:synthesizeSpeech?key=${GEMINI_API_KEY}`;

  const requestData = {
    input: { text: req.body.contents[0].parts[0].text },
    voice: { name: "en-US-Studio-O" },
    audioConfig: { audioEncoding: "LINEAR16", sampleRateHertz: 24000 },
  };

  try {
    const response = await axios.post(apiUrl, requestData, {
      headers: { 'Content-Type': 'application/json' },
    });
    res.status(200).json({
      audioData: response.data.audioContent,
      mimeType: 'audio/wav',
      sampleRate: 24000
    });
  } catch (error) {
    console.error("Error calling Gemini TTS API:", error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({ error: "Failed to fetch response from Gemini TTS API." });
  }
};
