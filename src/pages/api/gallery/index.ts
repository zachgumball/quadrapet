import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();

  if (req.method === "GET") {
    try {
      const galleries = await Gallery.find().sort({ createdAt: -1 });
      return res.status(200).json(galleries);
    } catch (error) {
      console.error("Error fetching galleries:", error);
      return res.status(500).json({ message: "Terjadi kesalahan saat mengambil data galeri." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Metode ${req.method} tidak diizinkan.` });
  }
};

// 🔥 Pastikan ada `export default`
export default handler;
