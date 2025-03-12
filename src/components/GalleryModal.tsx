import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

type Gallery = {
  _id: string;
  uploader: string;
  description: string;
  photos: string[];
  createdAt: string;
};

interface GalleryModalProps {
  selectedGallery: Gallery;
  closeGalleryModal: () => void;
}

const GalleryModal = ({ selectedGallery, closeGalleryModal }: GalleryModalProps) => {
  return (
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
          {selectedGallery.photos.map((photo: string, index: number) => (
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
  );
};

export default GalleryModal;
