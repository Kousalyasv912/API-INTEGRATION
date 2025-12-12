// Load environment variables from .env
require('dotenv').config();
const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

// Use PORT from .env or default to 5003
const PORT = process.env.PORT || 5004;
const apiKey = process.env.OPENWEATHER_API_KEY;

// Serve static frontend files (index.html, style.css, etc.)
app.use(express.static(path.join(__dirname, '../frontend')));

// Explicit route for root (/) to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Weather API route
app.get('/api/weather', async (req, res) => {
  const city = (req.query.city || "").trim();

  if (!city) {
    return res.json({ error: "Please enter a city name." });
  }

  if (!apiKey) {
    return res.json({ error: "Server missing API key. Set OPENWEATHER_API_KEY in .env file." });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);

    const weatherData = response.data;
    res.json({
      city: weatherData.name,
      temperature: weatherData.main.temp,
      windSpeed: weatherData.wind.speed
    });
  } catch (error) {
    if (error.response) {
      console.error("OpenWeather API error:", error.response.data);
    } else {
      console.error("Request error:", error.message);
    }
    res.json({ error: "City not found or API error." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ server.js file started on port ${PORT}`);
});
