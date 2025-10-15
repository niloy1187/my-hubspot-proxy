// File: functions/api/gemini-chat-proxy.js

const axios = require('axios');

exports.main = async (context, sendResponse) => {
  // 1. Get the Gemini API Key from your HubSpot secrets
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return sendResponse({
      statusCode: 500,
      body: { error: "API key is not configured in HubSpot secrets." }
    });
  }

  // 2. The endpoint for the Gemini API
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

  // 3. The data sent from your front-end module
  const requestData = context.body;

  try {
    // 4. Make a secure, server-to-server request to the Google API
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 5. Send the response from Google back to your module
    sendResponse({
      statusCode: 200,
      body: response.data,
    });
  } catch (error) {
    console.error("Error calling Gemini API:", error.response ? error.response.data : error.message);
    sendResponse({
      statusCode: error.response ? error.response.status : 500,
      body: { error: "Failed to fetch response from Gemini API.", details: error.response ? error.response.data : {} },
    });
  }
};