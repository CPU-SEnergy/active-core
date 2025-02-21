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
    name: "Lois Bruha",
    achievement: "Champion - Regional Track and Field",
    image: "/pictures/Lois.jpg",
    news: "Jessica Lee emerged as the champion in the highly competitive Regional Track and Field competition...",
  },
  {
    name: "Patrick Pineda",
    achievement: "MVP - Collegiate Basketball League",
    image: "/pictures/Patrick.jpg",
    news: "Carlos Dela Cruz led his team to victory in the Collegiate Basketball League, earning the MVP title...",
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
    nextArrow: <div style={{ fontSize: "48px", right: "-50px", position: "absolute", cursor: "pointer" }}>➡</div>,
    prevArrow: <div style={{ fontSize: "48px", left: "-50px", position: "absolute", cursor: "pointer" }}>⬅</div>,
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
    <section className="py-16 px-6 text-center bg-neutral-900 text-white w-full max-w-full mx-auto">
      <motion.h2
        className="text-4xl font-bold mb-8 text-red-500"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Sports and Fitness Marvels!
      </motion.h2>

      <p className="text-lg text-gray-300 mb-6">
        We honor our talented athletes who have brought pride and glory to our Sports and Fitness Center.
      </p>

      <div className="w-full max-w-4xl mx-auto">
        <Slider {...settings}>
          {athletes.map((athlete, index) => (
            <motion.div
              key={index}
              className="w-full bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 cursor-pointer mx-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              onClick={() => setSelectedAthlete(athlete)}
            >
              {/* Athlete Image */}
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-red-500">
                <Image src={athlete.image} alt={athlete.name} width={128} height={128} className="object-cover" />
              </div>

              <h4 className="mt-4 font-bold text-red-500 text-xl text-center">{athlete.name}</h4>
              <p className="text-gray-300 mt-2 italic text-center">{athlete.achievement}</p>
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
