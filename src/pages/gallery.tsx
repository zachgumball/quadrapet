import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Image from "next/image";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { X, UploadCloud, ChevronLeft, ChevronRight, List, Grid } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners";

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
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
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

  const handleUpload = async () => {
    if (selectedImages.length === 0 || !description) {
      alert("Pilih gambar dan masukkan deskripsi!");
      return;
    }
    const formData = new FormData();
    selectedImages.forEach((file) => formData.append("images", file));
    formData.append("description", description);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/gallery/upload", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 201) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.message === "Upload berhasil!") {
            toast.success(response.message);
            setIsModalOpen(false);
            setSelectedImages([]);
            setDescription("");
            setTimeout(() => {
              window.location.reload();
            }, 1000); // Delay to allow the toast notification to be visible
          } else {
            console.error("Unexpected response:", response);
            toast.error(`Terjadi kesalahan saat mengunggah: ${response.message}`);
          }
        } catch (error) {
          console.error("Error parsing response:", error);
          if (error instanceof Error) {
            toast.error(`Terjadi kesalahan saat mengunggah: ${error.message}`);
          } else {
            toast.error("Terjadi kesalahan saat mengunggah.");
          }
        }
      } else {
        console.error("Error uploading:", xhr.responseText);
        toast.error(`Terjadi kesalahan saat mengunggah: ${xhr.status} ${xhr.statusText}`);
      }
    };

    xhr.onerror = () => {
      console.error("Error uploading:", xhr.responseText);
      toast.error(`Terjadi kesalahan saat mengunggah: ${xhr.status} ${xhr.statusText}`);
    };

    xhr.send(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages([...selectedImages, ...Array.from(e.target.files)]);
    }
  };

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
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
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
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-xl w-[500px] text-black relative"
            >
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={24} />
              </button>
              <h2 className="text-lg font-bold mb-4">Unggah Foto</h2>
              <div className="border-2 border-dashed border-gray-400 p-4 text-center rounded-lg cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="fileUpload"
                />
                <label htmlFor="fileUpload" className="block cursor-pointer">
                  <UploadCloud size={40} className="mx-auto text-gray-400" />
                  <p className="text-gray-500">Klik atau seret gambar ke sini</p>
                </label>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative w-20 h-20">
                    <Image
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-md border"
                    />
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                      onClick={() => setSelectedImages(selectedImages.filter((_, i) => i !== index))}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <textarea
                className="w-full p-2 border rounded-md mt-4"
                placeholder="Deskripsi foto..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md w-full"
                onClick={handleUpload}
              >
                Unggah
              </button>
              {uploadProgress > 0 && (
                <div className="mt-4">
                  <div className="relative w-full h-4 bg-gray-200 rounded">
                    <div
                      className="absolute top-0 left-0 h-4 bg-blue-600 rounded"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-center mt-2">{Math.round(uploadProgress)}%</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
        {selectedGallery && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-black bg-opacity-90 p-8 rounded-xl shadow-xl w-[1000px] text-white relative"
            >
              <button
                className="absolute top-4 right-4 text-gray-300 hover:text-red-500"
                onClick={closeGalleryModal}
              >
                <X size={24} />
              </button>
              <div className="flex overflow-x-scroll space-x-4 mb-4 relative">
                {selectedGallery.photos.map((photo, index) => (
                  <Image
                    key={index}
                    src={photo}
                    width={500}
                    height={400}
                    alt={`Gallery Image ${index + 1}`}
                    className="rounded-lg"
                  />
                ))}
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <ChevronLeft size={40} className="text-gray-300" />
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <ChevronRight size={40} className="text-gray-300" />
                </div>
              </div>
              <div className="text-center mb-4">
                <h2 className="text-2xl font-semibold">{selectedGallery.uploader}</h2>
                <p className="text-gray-400 mt-2">{selectedGallery.description}</p>
                <p className="text-gray-500 mt-2">{new Date(selectedGallery.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-center text-gray-400">
                <p>Geser untuk melihat lebih banyak gambar</p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default GalleryPage;