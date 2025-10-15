// File: functions/api/gemini-tts-proxy.js

const axios = require('axios');

exports.main = async (context, sendResponse) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return sendResponse({
      statusCode: 500,
      body: { error: "API key is not configured in HubSpot secrets." }
    });
  }

  // NOTE: The TTS model has a specific name in the API URL
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/text-to-speech:synthesizeSpeech?key=${GEMINI_API_KEY}`;
  
  // The structure for TTS is slightly different
  const requestData = {
    input: {
      text: context.body.contents[0].parts[0].text
    },
    voice: {
      name: "en-US-Studio-O" // A high-quality voice
    },
    audioConfig: {
      audioEncoding: "LINEAR16",
      sampleRateHertz: 24000 // Required for this model
    }
  };

  try {
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // The response includes the audio data, which we forward
    sendResponse({
      statusCode: 200,
      body: { 
        audioData: response.data.audioContent, // The key is 'audioContent'
        mimeType: 'audio/wav',
        sampleRate: 24000
      },
    });
  } catch (error) {
    console.error("Error calling Gemini TTS API:", error.response ? error.response.data : error.message);
    sendResponse({
      statusCode: error.response ? error.response.status : 500,
      body: { error: "Failed to fetch response from Gemini TTS API.", details: error.response ? error.response.data : {} },
    });
  }
};