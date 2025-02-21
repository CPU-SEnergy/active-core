"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Testimonials from "@/components/Testimonials"
import StudentAppreciation from "@/components/StudentAppreciation"

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  return (
    <div className="min-h-screen bg-black text-white">
      {" "}
      {/* Add pt-20 for navbar space */}
      {/* Hero Section */}
      <section className="relative h-screen">
        {" "}
        {/* Adjust height for navbar */}
        <Image src="/pictures/hero 2.jpg" alt="Gym Interior" fill className="object-cover" priority />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-red-900/50 to-black/50"
        >
          <div className="container mx-auto px-4 h-full flex flex-col justify-center">
            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-6xl font-family: Audiowide mb-4"
            >
              GO HARD GET HARD
            </motion.h1>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="space-y-2"
            >
              <p className="text-3xl">YOUR FITNESS,</p>
              <p className="text-3xl">YOUR JOURNEY,</p>
              <p className="text-3xl">OUR MISSION</p>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 bg-red-600 text-white px-12 py-3 rounded-full text-lg font-semibold hover:bg-red-700 transition duration-300 w-64"
            >
              Start Here
            </motion.button>
          </div>
        </motion.div>
      </section>
      {/* About Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="py-16 bg-gradient-to-b from-black to-red-950 relative"
      >
        <Image src="/pictures/Second Part Picture.jpg" alt="Background" fill className="object-cover opacity-20" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2
            initial={{ y: -30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl font-bold mb-4"
          >
            Sports and Fitness Center
          </motion.h2>
          <motion.h3
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-2xl mb-8 text-red-500"
          >
            The bearer of champions!
          </motion.h3>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="max-w-4xl mx-auto text-lg leading-relaxed text-gray-300"
          >
            Located in the heart of Iloilo City, Sports & Fitness Center is the premier destination for athletes,
            fitness enthusiasts, and martial arts practitioners. As Iloilo&apos;s #1 sports and fitness center, we offer
            state-of-the-art gym facilities, top-tier training programs, and expert coaching in various disciplines,
            including boxing, Muay Thai, Brazilian Jiu-Jitsu, and more. Our world-class trainers have molded champions,
            producing elite athletes who compete on national and international stages. Whether you&apos;re a beginner or a
            professional, our dynamic community fosters discipline, strength, and excellence-helping you achieve peak
            performance. Join us and become the next champion!
          </motion.p>
        </div>
      </motion.section>
      {/* Coach Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="min-h-screen py-16 bg-gradient-to-r from-red-950 to-black flex items-center"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ y: -30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-3xl font-bold mb-12 text-center"
          >
            Coach of the Week
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative aspect-square"
            >
              <Image
                src="/pictures/Manaf Kassim.png"
                alt="Coach Manaf Kassim"
                fill
                className="object-cover rounded-lg"
              />
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-bold text-red-500">Manaf Kassim</h3>
              <p className="text-gray-300 leading-relaxed">
                Coach Manaf Kassim is a highly skilled boxing coach known for his strategic training methods and
                dedication to developing top-tier fighters. With years of experience in the sport, he has trained both
                amateur and professional boxers, focusing on technique, endurance, and mental toughness. His expertise
                has helped athletes sharpen their skills and achieve championship-level performance. Passionate and
                disciplined, Coach Manaf pushes his fighters to their limits, ensuring they reach their full potential
                in the ring.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
      {/* Move Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="min-h-screen py-16 bg-gradient-to-r from-red-950 to-black flex items-center"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ y: -30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-3xl font-bold mb-12 text-center"
          >
            Move of the Week
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative aspect-square"
            >
              <Image
                src="/pictures/combat.jpg"
                alt="The Jab"
                fill
                className="object-cover rounded-lg"
              />
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-bold text-red-500">The Jab</h3>
              <p className="text-gray-300 leading-relaxed">
                The Jab is a highly skilled boxing coach known for his strategic training methods and
                dedication to developing top-tier fighters. With years of experience in the sport, he has trained both
                amateur and professional boxers, focusing on technique, endurance, and mental toughness. His expertise
                has helped athletes sharpen their skills and achieve championship-level performance. Passionate and
                disciplined, Coach Manaf pushes his fighters to their limits, ensuring they reach their full potential
                in the ring.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>


      <StudentAppreciation />



      {/* Gym Tour Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="min-h-screen py-16 bg-gradient-to-b from-black to-red-950 flex items-center"
        style={{
          backgroundImage: 'url("/pictures/gym tour backdrop.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ y: -30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-3xl font-bold mb-8 text-center"
          >
            GYM TOUR
          </motion.h2>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl mb-12 text-center text-gray-300"
          >
            Experience top-tier amenities and elite training at Sports and Fitness Center—where champions are made!
          </motion.p>

          <h3 className="text-2xl font-bold text-red-500 mb-8">Discover Strength, Build Champions!</h3>

          {/* Main Video Player */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative aspect-video mb-12 bg-gray-800 rounded-lg max-w-4xl mx-auto"
          >
            <button className="absolute inset-0 flex items-center justify-center">
              <Play className="w-16 h-16 text-white animate-pulse" />
            </button>
          </motion.div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 * i, duration: 0.5 }}
                className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(i)}
              >
                <Image
                  src="/placeholder.svg"
                  alt={`Gym Tour Image ${i + 1}`}
                  fill
                  className="object-cover rounded-lg transition-transform duration-300 hover:scale-110"
                />
              </motion.div>
            ))}
          </div>

          {/* Modal */}
          <AnimatePresence>
            {selectedImage !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                onClick={() => setSelectedImage(null)}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  className="relative max-w-4xl w-full mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src="/placeholder.svg"
                    alt={`Expanded Gym Tour Image ${selectedImage + 1}`}
                    width={1000}
                    height={600}
                    className="w-full h-auto rounded-lg"
                  />
                  <button
                    className="absolute top-4 right-4 text-white bg-red-600 rounded-full p-2"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X size={24} />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-center mt-12"
          >
            <h3 className="text-2xl font-bold text-red-500 mb-8">Discover Strength, Build Champions!</h3>
          </motion.div>
        </div>
      </motion.section>
      {/* Cafe Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="py-16 bg-black"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ y: -30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-3xl font-bold mb-12 text-center"
          >
            Café
          </motion.h2>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative aspect-video max-w-4xl mx-auto"
          >
            <Image
              src="/pictures/cafe picture.jpg"
              alt="Sports and Fitness Center Cafe"
              fill
              className="object-cover rounded-lg"
            />
          </motion.div>
        </div>
      </motion.section>


      <Testimonials />


      {/* Footer */}
      <footer className="bg-black py-12 border-t border-red-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-red-500 font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/apparels" className="text-gray-300 hover:text-white transition-colors duration-300">
                    Apparels
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-gray-300 hover:text-white transition-colors duration-300">
                    Services
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-red-500 font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/classes" className="text-gray-300 hover:text-white transition-colors duration-300">
                    Locate Us
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-300">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-red-500 font-semibold mb-4">Subscribe to our website</h3>
              <p className="text-gray-300 mb-4">For product announcements and exclusive insights</p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Input your email"
                   className="flex-grow px-4 py-2 rounded-l-full bg-gray-800 border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring:red-500 transition-all duration-300"
                />
                <button
                  type="submit"
                  className="bg-red-600 text-white px-6 py-2 rounded-r-full hover:bg-red-700 transition-colors duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </footer>
    </div>
);
}
