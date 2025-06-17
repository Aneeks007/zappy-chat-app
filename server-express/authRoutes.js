require("dotenv").config();

const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("./models/User");

// 🛠 CometChat config
const COMETCHAT_APP_ID = "277220fd8655d51c";
const COMETCHAT_REGION = "IN";
const COMETCHAT_AUTH_KEY = "4b4d37c68b34a8bb44a3738023acac08c09ab2c4";

// ✅ Signup Route
router.post("/signup", async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    // Save user to MongoDB
    const newUser = new User({ name, username, password });
    await newUser.save();

    // Also create user in CometChat
    await axios.post(
      `https://api-${COMETCHAT_REGION}.cometchat.io/v3/users`,
      {
        uid: username,
        name: name,
      },
      {
        headers: {
          appId: COMETCHAT_APP_ID,
          apiKey: COMETCHAT_AUTH_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("❌ Signup error:", err.response?.data || err.message);
    res.status(500).json({ error: "Signup failed" });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  console.log("➡️ Login attempt:", { username, password });

  try {
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      console.log("❌ Invalid credentials");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      username: user.username,
      name: user.name,
      token: "dummy-token", // ✅ added dummy token
    });
  } catch (err) {
    console.error("❌ Login failed:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

// ✅ Get all users (excluding passwords)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;
