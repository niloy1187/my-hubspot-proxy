// File: api/geolocation.js
const axios = require('axios');

module.exports = async (req, res) => {
  // Set CORS headers to allow requests from any domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle pre-flight OPTIONS request from the browser
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = await axios.get('http://ip-api.com/json');
    const locationData = {
      city: response.data.city,
      country_name: response.data.country,
    };
    res.status(200).json(locationData);
  } catch (error) {
    console.error("Error calling Geolocation API:", error.message);
    res.status(500).json({ error: "Failed to fetch geolocation data." });
  }
};
