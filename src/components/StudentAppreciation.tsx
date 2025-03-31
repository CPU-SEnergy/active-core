"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Slider from "react-slick";
import StudentAppreciationModal from "./StudentAppreciationModal";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const athletes = [
  {
    name: "Michael Santos",
    achievement: "Gold Medalist - National Swimming Championship",
    image: "/pictures/combat.jpg",
    news: "Michael Santos dominated the National Swimming Championship, securing the gold medal in the 200m freestyle...",
  },
  {
    name: "Lois Gwapa",
    achievement: "Champion - Regional Track and Field",
    image: "/pictures/Lois.jpg",
    news: "Lois Bruha emerged as the champion in the highly competitive Regional Track and Field competition...",
  },
  {
    name: "Patrick Pineda",
    achievement: "MVP - Collegiate Basketball League",
    image: "/pictures/Patrick.jpg",
    news: "Patrick Pineda led his team to victory in the Collegiate Basketball League, earning the MVP title...",
  },
];

export default function StudentAppreciation() {
  const [selectedAthlete, setSelectedAthlete] = useState<null | typeof athletes[0]>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    nextArrow: (
      <motion.div
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        style={{ fontSize: "48px", right: "-50px", position: "absolute", cursor: "pointer" }}
      >
        ➡
      </motion.div>
    ),
    prevArrow: (
      <motion.div
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        style={{ fontSize: "48px", left: "-50px", position: "absolute", cursor: "pointer" }}
      >
        ⬅
      </motion.div>
    ),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          centerPadding: "0px",
        },
      },
    ],
  };

  return (
    <section className="py-16 px-6 text-center bg-gradient-to-r from-red-950 to-black text-white w-full max-w-full mx-auto">
      {/* Title Animation */}
      <motion.h2
        className="text-4xl font-audiowide mb-8 mb-8 text-white text-shadow-flicker"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        whileHover={{
          textShadow: "0px 0px 10px rgba(255, 0, 0, 0.8)",
          scale: 1.05,
        }}
      >
        Sports and Fitness Marvels!
      </motion.h2>

      {/* Subtitle Animation */}
      <motion.p
        className="text-lg text-gray-300 mb-6 text-shadow-fire"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 8, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        whileHover={{
          textShadow: "0px 0px 8px rgba(255, 255, 255, 0.6)",
          scale: 1.02,
        }}
      >
        We honor our talented athletes who have brought pride and glory to our Sports and Fitness Center.
      </motion.p>

      <div className="w-full max-w-4xl mx-auto">
        <Slider {...settings}>
          {athletes.map((athlete, index) => (
            <motion.div
              key={index}
              className="w-full bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 cursor-pointer mx-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              onClick={() => setSelectedAthlete(athlete)}
            >
              {/* Athlete Image with Hover Animation */}
              <motion.div
                className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-red-500"
                whileHover={{ scale: 1.1 }}
              >
                <Image src={athlete.image} alt={athlete.name} width={128} height={128} className="object-cover" />
              </motion.div>

              {/* Animated Athlete Name */}
              <motion.h4
                className="mt-4 font-bold text-red-500 text-xl text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                {athlete.name}
              </motion.h4>

              {/* Animated Achievement Text */}
              <motion.p
                className="text-gray-300 mt-2 italic text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.02, textShadow: "0px 0px 6px rgba(255,255,255,0.5)" }}
              >
                {athlete.achievement}
              </motion.p>
            </motion.div>
          ))}
        </Slider>
      </div>

      {/* Modal for Athlete Details */}
      {selectedAthlete && (
        <StudentAppreciationModal athlete={selectedAthlete} onClose={() => setSelectedAthlete(null)} />
      )}
    </section>
  );
}
