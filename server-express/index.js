require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./authRoutes");
const Message = require("./models/Message");

const app = express();

// ✅ CORS fix for deployed frontend
app.use(cors({
  origin: 'https://zappy-prxq.onrender.com',
  credentials: true
}));

app.use(express.json());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Auth Routes
app.use("/auth", authRoutes);

// ✅ Get messages by room
app.get("/messages/:room", async (req, res) => {
  try {
    const room = req.params.room;
    const messages = await Message.find({ room }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// ✅ Start server
app.listen(3001, () => {
  console.log("🚀 Server running at http://localhost:3001");
});
