require("dotenv").config();

const app = require("./core/server");
const task = require("./modules/cron");

task.start();

app.listen(process.env.PORT, () => console.log(`server ${process.env.PORT}`));
