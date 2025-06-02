"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Facebook, MapPin, Phone, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black/95 backdrop-blur-sm text-white pt-16 pb-1.5 w-full">
      <div className="max-w-9xl mx-auto px-8 sm:px-12 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-32">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex flex-col md:flex-row items-center md:items-start mb-6">                
                <Link href="/" className="block bg-white p-2 rounded-lg shadow-lg hover:shadow-white/20 transition-all duration-300 mr-4 transform hover:scale-105">
                  <Image
                    src="/pictures/IMAA Official no-bg.png"
                    alt="IMAA Logo"
                    width={100}
                    height={100}
                    className="rounded-md"
                  />
                </Link>
                <div>
                  <h3 className="text-xl font-bold mb-2 pt-4 px-4">Iloilo Martial Artist Association</h3>
                  <p className="text-gray-400 pt-4 px-4">
                    The premier martial arts training center in Iloilo established in 2025.
                  </p>
                </div>
              </div>
              <div className="flex space-x-9 justify-center md:justify-start mt-9">
                <SocialIcon icon={<Facebook className="h-6 w-6" />} />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-1 md:pl-16">
            <h3 className="text-xl font-bold mb-6 text-center md:text-left">Quick Links</h3>
            <ul className="space-y-3 text-center md:text-left">
              <li>
                <FooterLink href="/">Home</FooterLink>
              </li>
              <li>
                <FooterLink href="/sports-classes">Classes</FooterLink>
              </li>
              <li>
                <FooterLink href="/apparels">Apparels</FooterLink>
              </li>
              <li>
                <FooterLink href="/coaches">Coaches</FooterLink>
              </li>
              <li>
                <FooterLink href="/user-profile">My Profile</FooterLink>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold mb-6 text-center md:text-start">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="mt-1 mr-3 h-5 w-5 text-white" />
                <span className="text-gray-300">Uncle Toms bldg. Diversion Road, Iloilo City 5000</span>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <Phone className="mr-3 h-5 w-5 text-white" />
                <span className="text-gray-300">09212701685</span>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <Mail className="mr-3 h-5 w-5 text-white" />
                <span className="text-gray-300">ilonggomartialartistassociatio@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-12 mb-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-400 text-sm text-center md:text-left pt-6 px-10">
          ⓔ2025 Iloilo Martial Artist Association. All rights reserved.
        </p>
        <div className="mt-4 md:mt-0 flex space-x-6 px-10"></div>
      </div>
    </footer>
  )
}

// Helper Components
function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <Link 
      href="https://www.facebook.com/people/Ilonggo-martial-artist-association/61576952401707/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-white transition duration-300 hover:scale-110 transform"
    >
      {icon}
    </Link>
  )
}

function FooterLink({ href, children, small = false }: { href: string; children: React.ReactNode; small?: boolean }) {
  return (
    <Link
      href={href}
      className={`text-gray-400 hover:text-white transition-all duration-500 relative group ${small ? "text-sm" : ""} hover:translate-x-2`}
    >
      {children}
      <span className="absolute bottom-[-3px] left-0 w-0 h-[1px] bg-white transition-all duration-500 group-hover:w-full"></span>
    </Link>
  )
}
