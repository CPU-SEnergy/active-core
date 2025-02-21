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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <motion.div
        className="bg-gray-900 text-white p-8 rounded-lg max-w-lg shadow-lg relative"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-red-500 mb-4">{athlete.name}</h2>
        <p className="italic text-gray-300 mb-4">{athlete.achievement}</p>
        <p className="text-gray-300">{athlete.news}</p>
      </motion.div>
    </div>
  );
}
