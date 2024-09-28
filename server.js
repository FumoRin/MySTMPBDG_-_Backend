const express = require("express");

// Express App
const app = express();

// Routes
app.get("/", (req, res) => {
  res.json({ mssg: "Hello World" });
});

// Listen on port 6000
app.listen(4000, () => {
  console.log("Server started on port 4000");
});
