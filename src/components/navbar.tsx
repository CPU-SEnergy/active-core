"use client";

import Image from "next/image";
import Link from "next/link";
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
import { Menu } from "lucide-react";
import LogoutButton from "./LogoutButton";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (pathname.startsWith("/auth") || pathname.startsWith("/admin")) {
    return null;
  }

  if (loading) {
    return <div className="h-14 bg-black/90 animate-pulse"></div>;
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
      className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm"
    >
      <div className="w-screen px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/pictures/new-logo.png"
              alt="Fight Fusion Academy Logo"
              width={50}
              height={50}
              className="w-auto h-12"
            />
            <span className="text-2xl font-bold sm:block hidden text-white">
              Fight Fusion Academy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {Object.entries(navLinks).map(([name, href], index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <Link
                  href={href}
                  className={`transition duration-300 ${
                    isActive(href) ? "text-red-500 font-bold" : "text-white hover:text-red-500"
                  }`}
                >
                  {name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger className="text-white hover:text-gray-300 focus:outline-none" aria-label="Open menu">
                <Menu />
              </SheetTrigger>
              <SheetContent className="w-full">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col items-center space-y-3 text-black py-4">
                  {Object.entries(navLinks).map(([name, href]) => (
                    <SheetClose asChild key={name}>
                      <Link
                        href={href}
                        className={`hover:bg-gray-100 px-3 py-2 rounded-md text-lg font-medium ${
                          isActive(href) ? "text-red-500 font-bold" : ""
                        }`}
                      >
                        {name}
                      </Link>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <LogoutButton user={user} />
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Authentication Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LogoutButton user={user} />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
