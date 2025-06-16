require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { StreamChat } = require("stream-chat");
const authRoutes = require("./authRoutes");

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const streamClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);

// Attach streamClient to req object
app.use((req, res, next) => {
  req.streamClient = streamClient;
  next();
});

// Auth routes
app.use("/auth", authRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(3001, () => {
  console.log("✅ Backend running on port 3001");
});
