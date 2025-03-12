require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT;
const indexRoutes = require("./routes/indexRoutes");
const client = require("../VYBE-bnd/config/redis");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1", indexRoutes);

app.get("/health", async (req, res) => {
  res.send({
    status: "ok",
    timestamp: new Date(),
  });
});

try {
  mongoose.connect(process.env.MONGODB_URL);
  console.log("MONGODB CONNECTED!");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.log(error);
}

process.on("SIGINT", async () => {
  await client.quit();
  process.exit();
});
