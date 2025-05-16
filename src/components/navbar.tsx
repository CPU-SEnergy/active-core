"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/auth/AuthProvider";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react';
import LogoutButton from "./LogoutButton";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname.startsWith("/auth") || pathname.startsWith("/admin")) {
    return null;
  }

  if (loading) {
    return <div className="h-20 bg-white shadow-lg animate-pulse"></div>;
  }

  const navLinks = {
    Home: "/",
    Classes: "/sports-classes",
    Apparels: "/apparels",
    Coaches: "/coaches",
    "My Profile": "/user-profile",
  };

  const isActive = (href: string) => pathname === href;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-white/95 shadow-lg backdrop-blur-sm" : "bg-white shadow-md"
      }`}
    >
      <div className="max-w-9xl mx-auto px-10 sm:px-10 lg:px-10">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <motion.div 
            className="flex-shrink-0 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center group transition-transform hover:scale-110">
              <Image 
                src="/pictures/IMAA Official no-bg.png" 
                alt="Iloilo Martial Arts Association" 
                width={60} 
                height={60} 
                className="rounded-full mr-2"
              />
              <span className="text-xl font-bold text-black hidden sm:block">IMAA</span>
            </Link>
          </motion.div>

          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
            {Object.entries(navLinks).map(([name, href], index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <NavLink href={href} active={isActive(href)}>
                  {name}
                </NavLink>
              </motion.div>
            ))}
          </div>

          {/* Authentication Actions */}
          <motion.div 
            className="hidden md:flex space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <LogoutButton user={user} />
          </motion.div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-black focus:outline-none">
                  <span className="sr-only">Open menu</span>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-center text-2xl font-bold">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-6 py-4">
                  {Object.entries(navLinks).map(([name, href]) => (
                    <SheetClose asChild key={name}>
                      <Link
                        href={href}
                        className={`relative px-3 py-2 text-lg font-medium transition-all duration-300 hover:translate-x-2 ${
                          isActive(href) 
                            ? "text-black font-bold after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-black after:bottom-0 after:left-0" 
                            : "text-gray-600 hover:text-black"
                        }`}
                      >
                        {name}
                      </Link>
                    </SheetClose>
                  ))}
                  <div className="pt-6 border-t border-gray-200">
                    <SheetClose asChild>
                      <div className="flex justify-center">
                        <LogoutButton user={user} />
                      </div>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

// Helper Component
function NavLink({ href, children, active = false }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`relative font-medium transition-all duration-500 hover:translate-y-[-12px] ${
        active ? "text-black font-bold" : "text-gray-600"
      } group`}
    >
      {children}
       <span
        className={`absolute bottom-[-5px] left-0 h-[3px] bg-gradient-to-r from-gray-900 to-gray-700 transition-all duration-500 group-hover:w-full shadow-lg ${
          active ? "w-full" : "w-0"
        }`}
      ></span>
    </Link>
  )
}
