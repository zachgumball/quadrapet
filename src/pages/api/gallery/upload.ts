import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { IncomingForm } from "formidable";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";

// Nonaktifkan body parser bawaan Next.js
export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== "POST") {
    console.log("❌ Method Not Allowed");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const session = await getSession({ req });
  if (!session) {
    console.log("❌ Unauthorized: No session found");
    return res.status(401).json({ message: "Unauthorized" });
  }

  console.log("✅ Session found:", session);

  try {
    // Gunakan formidable untuk membaca file
    const form = new IncomingForm({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("❌ Error parsing form data:", err);
        return res.status(500).json({ error: "Error parsing form data" });
      }

      console.log("✅ Form fields:", fields);
      console.log("✅ Form files:", files);

      if (!files.images) {
        console.error("❌ No files uploaded");
        return res.status(400).json({ error: "No files uploaded" });
      }

      const images = Array.isArray(files.images) ? files.images : [files.images];
      const uploadPromises = images.map((file) => {
        return new Promise<string>((resolve, reject) => {
          console.log("Uploading file to Cloudinary:", file.filepath);
          cloudinary.uploader.upload(
            file.filepath,
            { timeout: 60000 }, // Set timeout to 60 seconds
            (error, result) => {
              if (error) {
                console.error("❌ Error uploading to Cloudinary:", error);
                reject(error);
              } else {
                console.log("✅ Upload result:", result);
                resolve(result?.secure_url || "");
              }
            }
          );
        });
      });

      try {
        const uploadedUrls = await Promise.all(uploadPromises);
        console.log("✅ Uploaded URLs:", uploadedUrls);

        const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;

        const newGallery = new Gallery({
          uploader: session.user?.name,
          description,
          photos: uploadedUrls,
        });

        await newGallery.save();
        console.log("✅ New gallery saved:", newGallery);
        return res.status(201).json({ message: "Upload berhasil!", gallery: newGallery });
      } catch (uploadError) {
        console.error("❌ Upload error:", uploadError);
        return res.status(500).json({ message: "Terjadi kesalahan saat mengunggah gambar!" });
      }
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan saat mengunggah gambar!" });
  }
}