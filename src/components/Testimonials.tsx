"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    text: "“This program completely changed my life! I feel more confident and energized every day.”",
    name: "- I love Social Work",
    image: "/pictures/Clyde.png",
  },
  {
    text: "“The coaches are phenomenal, and the community is incredibly supportive. Highly recommend!”",
    name: "- Shiri Lalums",
    image: "/pictures/Sheree.jpg",
  },
  {
    text: "“I've never felt stronger or more capable. This experience has been life-changing!”",
    name: "- Barbie Poral",
    image: "/pictures/Chito.jpg",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(1);

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-20 px-6 text-center bg-neutral-900 text-white relative">
      <motion.h2
        className="text-4xl font-bold mb-16 text-red-500 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        What Our Clients Say
      </motion.h2>

      <div className="flex justify-center items-center gap-6 relative mt-4">
        {testimonials.map((testimonial, index) => {
          const isActive = index === activeIndex;
          const scale = isActive ? 1.1 : 0.9;
          const opacity = isActive ? 1 : 0.6;

          return (
            <motion.div
              key={index}
              className="relative w-64 h-[320px] bg-gray-800 p-6 pt-16 rounded-lg shadow-lg border border-gray-700 flex flex-col items-center justify-start"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale, opacity }}
              transition={{ duration: 0.4 }}
            >
              <div className="absolute top-[-40px] w-20 h-20 rounded-full overflow-hidden border-4 border-red-500">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
              <p className="italic text-gray-300 text-center mt-10">{testimonial.text}</p>
              <h4 className="mt-4 font-bold text-red-500">{testimonial.name}</h4>
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={prevTestimonial}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition z-10"
      >
        <ChevronLeft className="text-white w-6 h-6" />
      </button>
      <button
        onClick={nextTestimonial}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition z-10"
      >
        <ChevronRight className="text-white w-6 h-6" />
      </button>
    </section>
  );
}
