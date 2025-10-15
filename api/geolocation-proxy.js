// File: api/geolocation.js
// Triggering a fresh Vercel build at DATE: 2024-10-15

const axios = require('axios');

module.exports = async (req, res) => {
  try {
    // This is a free, public API for demo purposes
    const response = await axios.get('http://ip-api.com/json');
    
    // Remap the fields to match what the front-end JS expects
    const locationData = {
        city: response.data.city,
        country_name: response.data.country
    };

    res.status(200).json(locationData);
  } catch (error) {
    console.error("Error calling Geolocation API:", error.message);
    res.status(500).json({ error: "Failed to fetch geolocation data." });
  }
};
