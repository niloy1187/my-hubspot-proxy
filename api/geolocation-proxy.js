// File: functions/api/geolocation-proxy.js

const axios = require('axios');

exports.main = async (context, sendResponse) => {
  try {
    // This is a free, public API for demo purposes
    const response = await axios.get('http://ip-api.com/json');
    
    // Remap the fields to match what the front-end JS expects
    const locationData = {
        city: response.data.city,
        country_name: response.data.country
    };

    sendResponse({
      statusCode: 200,
      body: locationData,
    });
  } catch (error) {
    console.error("Error calling Geolocation API:", error.message);
    sendResponse({
      statusCode: 500,
      body: { error: "Failed to fetch geolocation data." },
    });
  }
};