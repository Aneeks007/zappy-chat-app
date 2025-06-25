require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./authRoutes");
const pingRoute = require("./routes/ping"); // ✅ Add this line

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

// Auth routes
app.use("/auth", authRoutes);

// ✅ MongoDB ping route
app.use("/api/ping", pingRoute);

// Default route
app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(3001, () => {
  console.log("✅ Backend running on port 3001");
});
