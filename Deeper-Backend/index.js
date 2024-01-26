const express = require('express');
const axios = require('axios');
const cron = require('node-cron');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3001;

app.use(cors());

let monitoredWebsites = [
  { id: 1, name: 'Google', url: 'https://www.google.com', interval: 30, latency: null },
  { id: 2, name: 'Itzik', url: 'https://www.google.com', interval: 30, latency: null },
  { id: 3, name: 'Moshe', url: 'https://www.google.com', interval: 30, latency: null },
  { id: 4, name: 'Dani', url: 'https://www.google.com', interval: 30, latency: null },
];

// Function to check latency for a website
const checkLatency = async (website) => {
  try {
    const start = new Date();
    await axios.head(website.url);
    const end = new Date();
    const latency = end - start;
    website.latency = latency;
  } catch (error) {
    console.error(`Error checking latency for ${website.name}: ${error.message}`);
  }
};

// Schedule latency checks every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  console.log('Running latency checks...');
  for (const website of monitoredWebsites) {
    await checkLatency(website);
  }
  console.log('Latency checks completed.');
});

// CRUD operations for monitored websites
app.get('/websites', (req, res) => {
  res.json(monitoredWebsites);
});

app.post('/websites', (req, res) => {
  const newWebsite = req.body;
  monitoredWebsites.push(newWebsite);
  res.json(newWebsite);
});

app.listen(PORT, () => {
  console.log(`Server is running and listening on port ${PORT}`);
});
