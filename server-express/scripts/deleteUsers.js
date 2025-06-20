require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User"); // adjust if needed

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const result = await User.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} users from MongoDB.`);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
  });
