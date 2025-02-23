"use client";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface Athlete {
  name: string;
  achievement: string;
  news: string;
}

interface StudentAppreciationModalProps {
  athlete: Athlete;
  onClose: () => void;
}

export default function StudentAppreciationModal({ athlete, onClose }: StudentAppreciationModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
      <motion.div
        className="bg-gray-900 text-white p-10 rounded-lg max-w-lg shadow-lg relative"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2"
          onClick={onClose}
        >
          <X size={30} />
        </button>

        <h2 className="text-3xl font-bold text-red-500 mb-6">{athlete.name}</h2>
        <p className="italic text-lg text-gray-300 mb-6">{athlete.achievement}</p>
        <p className="text-lg text-gray-300">{athlete.news}</p>
      </motion.div>
    </div>
  );
}
