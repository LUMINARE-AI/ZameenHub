const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("ZameenHub API Running 🚀");
});

app.use("/api/auth", require("./routes/auth.routes"));

app.use("/api/properties", require("./routes/property.routes"));
module.exports = app;