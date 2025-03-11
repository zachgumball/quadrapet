import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema({
  uploader: { type: String, required: true },
  description: { type: String, required: true },
  photos: [{ type: String, required: true }],
}, { timestamps: true });

export default mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);
