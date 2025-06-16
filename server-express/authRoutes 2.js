// server-express/authroute.js
require("dotenv").config();

const express = require("express");
const router = express.Router();
const User = require("./models/User");
const { StreamChat } = require("stream-chat");

// 🔐 Log current environment Stream credentials for debugging
console.log("🔐 STREAM_API_KEY:", process.env.STREAM_API_KEY);
console.log("🔐 STREAM_API_SECRET:", process.env.STREAM_API_SECRET);

// ✅ Initialize Stream client using environment variables
const streamApiKey = process.env.STREAM_API_KEY;
const streamApiSecret = process.env.STREAM_API_SECRET;

console.log("🔐 Using STREAM_API_KEY:", streamApiKey);
console.log("🔐 Using STREAM_API_SECRET:", streamApiSecret);

const streamClient = StreamChat.getInstance(streamApiKey, streamApiSecret);


// ✅ Signup Route
router.post("/signup", async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const newUser = new User({ name, username, password });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("❌ Signup error:", err.message);
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

    await streamClient.upsertUser({
      id: username,
      name: user.name,
    });

    const token = streamClient.createToken(username);

    console.log("🔐 Token generated for:", username);
    console.log("🔐 Token:", token);

    res.json({
      username: user.username,
      name: user.name,
      token,
    });
  } catch (err) {
    console.error("❌ Login failed:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});
// Get all users (except passwords)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // exclude password from response
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});


module.exports = router;
