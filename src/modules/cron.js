const cron = require("node-cron");

const axios = require("axios");

const task = cron.schedule("*/10 * * * *", async () => {
  try {
    const response = await axios.post(process.env.WEB_HOOK_URI);
    console.log("post sent " + response.data);
  } catch (err) {
    console.log(`error ${err}`);
  }
});

module.exports = task;
