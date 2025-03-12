import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Image from "next/image";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { List, Grid } from "lucide-react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners";
import UploadModal from "../components/UploadModal";
import GalleryModal from "../components/GalleryModal";

// Tipe data untuk gallery
type Gallery = {
  _id: string;
  uploader: string;
  description: string;
  photos: string[];
  createdAt: string;
};

const GalleryPage = () => {
  const { data: session } = useSession();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await fetch("/api/gallery");
        const data = await response.json();
        setGalleries(data);
      } catch (error) {
        console.error("Error fetching galleries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleries();
  }, []);

  const handleGalleryClick = (gallery: Gallery) => {
    setSelectedGallery(gallery);
  };

  const closeGalleryModal = () => {
    setSelectedGallery(null);
  };

  return (
    <>
      <Head>
        <title>Gallery | Quadrapet</title>
      </Head>
      <div className="relative min-h-screen bg-gray-900 text-white">
        <Navbar />
        <main className="container mx-auto py-16 px-6">
          <motion.h1
            className="text-4xl font-bold text-center mt-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            style={{ fontFamily: "'Pacifico', cursive" }} // Apply font only here
          >
            Galeri Foto
          </motion.h1>
          {session && (
            <div className="text-center mt-6">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg hover:bg-blue-500 transition"
                onClick={() => setIsModalOpen(true)}
              >
                Tambah Foto
              </button>
            </div>
          )}
          <div className="flex justify-end mt-6">
            <button
              className={`p-2 rounded-md ${viewMode === "grid" ? "bg-blue-600" : "bg-gray-700"} text-white mr-2`}
              onClick={() => setViewMode("grid")}
            >
              <Grid size={24} />
            </button>
            <button
              className={`p-2 rounded-md ${viewMode === "list" ? "bg-blue-600" : "bg-gray-700"} text-white`}
              onClick={() => setViewMode("list")}
            >
              <List size={24} />
            </button>
          </div>
          {loading ? (
            <div className="flex justify-center items-center mt-10">
              <ClipLoader color="#ffffff" loading={loading} size={50} />
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {galleries.map((gallery) => (
                    <motion.div
                      key={gallery._id}
                      className="bg-gray-800 rounded-lg p-4 shadow-lg cursor-pointer hover:bg-gray-700 transition-all"
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleGalleryClick(gallery)}
                    >
                      <div className="w-full h-48 relative">
                        <Image
                          src={gallery.photos[0]}
                          layout="fill"
                          objectFit="cover"
                          alt={`Thumbnail ${gallery.uploader}`}
                          className="rounded-lg"
                        />
                      </div>
                      <h2 className="mt-4 text-xl font-semibold">{gallery.uploader}</h2>
                      <p className="text-gray-300 text-sm">{gallery.description}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="mt-10 space-y-8">
                  {galleries.map((gallery) => (
                    <motion.div
                      key={gallery._id}
                      className="bg-gray-800 rounded-lg p-4 shadow-lg cursor-pointer hover:bg-gray-700 transition-all flex"
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleGalleryClick(gallery)}
                    >
                      <div className="w-36 h-24 relative">
                        <Image
                          src={gallery.photos[0]}
                          layout="fill"
                          objectFit="cover"
                          alt={`Thumbnail ${gallery.uploader}`}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="ml-4">
                        <h2 className="text-xl font-semibold">{gallery.uploader}</h2>
                        <p className="text-gray-300 text-sm">{gallery.description}</p>
                        <p className="text-gray-500 mt-2">{new Date(gallery.createdAt).toLocaleString()}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
        <Footer />
        {isModalOpen && <UploadModal setIsModalOpen={setIsModalOpen} />}
        {selectedGallery && <GalleryModal selectedGallery={selectedGallery} closeGalleryModal={closeGalleryModal} />}
      </div>
      <ToastContainer />
    </>
  );
};

export default GalleryPage;