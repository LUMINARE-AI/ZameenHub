const express = require("express");
const router = express.Router();

const {
  addProperty,
  getProperties,
} = require("../controllers/property.controller");

const protect = require("../middlewares/auth.middleware");


// Add property (login required)
router.post("/", protect, addProperty);

// Get properties (public)
router.get("/", getProperties);

module.exports = router;