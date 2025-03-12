import { useState } from "react";
import { motion } from "framer-motion";
import { X, UploadCloud } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";

interface UploadModalProps {
  setIsModalOpen: (isOpen: boolean) => void;
}

const UploadModal = ({ setIsModalOpen }: UploadModalProps) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages([...selectedImages, ...Array.from(e.target.files)]);
    }
  };

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

  return (
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
  );
};

export default UploadModal;
