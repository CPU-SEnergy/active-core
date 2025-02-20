"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Import icons for navigation

const testimonials = [
  {
    text: "“This program completely changed my life! I feel more confident and energized every day.”",
    name: "- Sarah M.",
    image: "/images/sarah.jpg",
  },
  {
    text: "“The coaches are phenomenal, and the community is incredibly supportive. Highly recommend!”",
    name: "- James L.",
    image: "/images/james.jpg",
  },
  {
    text: "“I've never felt stronger or more capable. This experience has been life-changing!”",
    name: "- Emily R.",
    image: "/images/emily.jpg",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(1); // Start with the middle card

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-16 px-6 text-center bg-neutral-900 text-white relative">
      <motion.h2
        className="text-4xl font-bold mb-8 text-red-500"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        What Our Clients Say
      </motion.h2>

      {/* Navigation Buttons */}
      <button
        onClick={prevTestimonial}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition"
      >
        <ChevronLeft className="text-white w-6 h-6" />
      </button>
      <button
        onClick={nextTestimonial}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition"
      >
        <ChevronRight className="text-white w-6 h-6" />
      </button>

      {/* Testimonials Container */}
      <div className="flex justify-center items-center gap-4">
        {testimonials.map((testimonial, index) => {
          // Calculate scaling based on the active index
          const isActive = index === activeIndex;
          const scale = isActive ? 1.2 : 0.9;
          const opacity = isActive ? 1 : 0.6;

          return (
            <motion.div
              key={index}
              className="relative max-w-md bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale, opacity }}
              transition={{ duration: 0.4 }}
            >
              {/* Circular Profile Image */}
              <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-red-500">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>

              <p className="italic text-gray-300 mt-4">{testimonial.text}</p>
              <h4 className="mt-4 font-bold text-red-500">{testimonial.name}</h4>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
