"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export default function navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed w-full z-50 bg-black/90 backdrop-blur-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/home" className="flex items-center space-x-2">
            <Image
              src="/pictures/sports and fitness navigation bar logo.png"
              alt="Sports and Fitness Center"
              width={40}
              height={40}
              className="w-auto h-8"
            />
            <span className="text-xl font-bold">Sports and Fitness Center</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {["Home", "Classes", "Apparels", "Coaches"].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <Link
                  href={item === "Home" ? "/home" : `/${item.toLowerCase()}`}
                  className="text-white hover:text-red-500 transition duration-300"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {["My Profile", "Login", "Register"].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + 0.1 * index, duration: 0.5 }}
              >
                <Link
                  href={`/${item.toLowerCase().replace(" ", "-")}`}
                  className={`text-white hover:text-red-500 transition duration-300 ${
                    item === "Register" ? "bg-red-600 px-4 py-2 rounded-full hover:bg-red-700" : ""
                  }`}
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

