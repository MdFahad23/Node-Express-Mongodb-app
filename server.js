require("dotenv/config");
const mongoose = require("mongoose");
const app = require("./app");

mongoose
  .connect(process.env.NODE_URL)
  .then((res) => console.log("SUCCESSFULLY TO CONNECTING!"))
  .catch((err) => console.log("CONNECTING FAILED!"));

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`APP RUNNING ON PORT ${port} `);
});
