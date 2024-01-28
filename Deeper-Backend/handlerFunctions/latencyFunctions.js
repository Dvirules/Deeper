const axios = require('axios');
let monitoredWebsites = require('../monitoredWebsitesDbMock.js');

const latencyFunctions = {

    // Function to check latency for a website
    checkLatency: async (website) => {
      try {
        const start = new Date();
        await axios.head(website.url);
        const end = new Date();
        const latency = end - start;
        website.latency = latency;
      } catch (error) {
        console.error(`Error checking latency for ${website.name}: ${error}`);
        website.latency = undefined;
      }
  },

  checkLatencyForAll : async (isAppFirstRun) => {
    isAppFirstRun ? console.log("Running latency checks for all websites as the app has launched") : console.log('Running scheduled latency checks...');
    for (const website of monitoredWebsites) {
      await latencyFunctions.checkLatency(website);
    }
    isAppFirstRun ? console.log("Done running initial latency checks") : console.log('Scheduled latency checks completed');;
  },
}

module.exports = latencyFunctions;