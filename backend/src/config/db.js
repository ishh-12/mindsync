const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri || typeof mongoUri !== "string") {
      throw new Error("MONGO_URI is missing. Expected it in backend/.env");
    }

    const conn = await mongoose.connect(mongoUri);
    console.log("MongoDB connected:", conn.connection.host);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    return null;
  }
};

module.exports = connectDB;
