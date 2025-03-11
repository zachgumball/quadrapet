import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI tidak ditemukan di .env.local");
}

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("✅ Sudah terhubung ke MongoDB");
      return;
    }

    await mongoose.connect(MONGODB_URI, {
      dbName: "tribute-gallery", // Pastikan nama database benar
    });

    console.log("✅ Berhasil terhubung ke MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    throw error;
  }
};
