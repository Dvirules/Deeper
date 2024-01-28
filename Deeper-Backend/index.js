const express = require('express');
const cron = require('node-cron');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3001;
let monitoredWebsites = require('./monitoredWebsitesDbMock.js');
const latencyFunctions = require('./handlerFunctions/latencyFunctions.js');
let timeInterval = 1;

app.use(cors());
app.use(express.json());

// Schedule initial latency checks every 1 minute
let cronTask = cron.schedule(`*/1 * * * *`, async () => latencyFunctions.checkLatencyForAll(false));

// Routes:
// Get all websites
app.get('/websites', async (req, res) => {
  try {
    res.status(200).json(monitoredWebsites);
  }
  catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Add a new website
app.post('/addWebsite', async (req, res) => {
  try {
    let newWebsite = req.body;
    allIDs = monitoredWebsites.map(website => website.id);
    newWebsite.id = Math.max(...allIDs) + 1;
    await latencyFunctions.checkLatency(newWebsite);
    monitoredWebsites.push(newWebsite);
    res.status(200).json({ success: true, message: 'Website added successfully' });
  }
  catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: 'Internal server error' });
  };
});

// Update an existing website
app.put('/updateWebsite/:websiteId', async (req, res) => {
  try {
    const websiteId = parseInt(req.params.websiteId);
    const {name, url} = req.body;
    for (i = 0; i < monitoredWebsites.length; i++) {
      if (monitoredWebsites[i].id === websiteId) {
        name !== "" ? monitoredWebsites[i].name = name : undefined;
        url !== "" ? monitoredWebsites[i].url = url : undefined;
        await latencyFunctions.checkLatency(monitoredWebsites[i]);
      }
    }
    res.status(200).json({ success: true, message: 'Website Updated successfully' });
  }
  catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: 'Internal server error' });
  };
});

// Delete a website
app.delete("/deleteWebsite/:websiteId", (req, res) => {
  try {
    const websiteId = parseInt(req.params.websiteId);
    monitoredWebsites = monitoredWebsites.filter(website => website.id !== websiteId);
    res.status(200).json(monitoredWebsites);
  }
  catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get the current time interval for latency checks
app.get('/interval', async (req, res) => {
  try {
    res.status(200).json(timeInterval);
  }
  catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Set the current time interval for latency checks
app.put('/interval', async (req, res) => {
  try {
    timeInterval = req.body.timeInterval;
    cronTask.stop();
    cronTask = cron.schedule(`*/${timeInterval} * * * *`, async () => latencyFunctions.checkLatencyForAll(false));
    console.log("New time interval for latency checks updated to " + timeInterval);
    res.status(200).json(timeInterval);
  }
  catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running and listening on port ${PORT}`);
});

latencyFunctions.checkLatencyForAll(true);
