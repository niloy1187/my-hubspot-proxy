// File: api/gemini-chat.js
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

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await axios.post(apiUrl, req.body, {
      headers: { 'Content-Type': 'application/json' },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error calling Gemini API:", error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({ error: "Failed to fetch response from Gemini API." });
  }
};
