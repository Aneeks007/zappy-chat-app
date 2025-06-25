const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.status(200).send("MongoDB Atlas is alive!");
  } catch (err) {
    res.status(500).send("MongoDB ping failed.");
  }
});

module.exports = router;
