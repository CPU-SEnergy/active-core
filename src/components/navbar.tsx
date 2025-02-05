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
    return (
      <nav className="bg-black text-white fixed w-full z-50">
        <div className="container mx-auto px-4 flex items-center justify-between h-20">
          <div className="text-white">Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm"
    >
      <div className="w-screen px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/home" className="flex items-center space-x-3">
            <Image
              src="/pictures/sports and fitness navigation bar logo.png"
              alt="Sports and Fitness Center"
              width={50}
              height={50}
              className="w-auto h-10"
            />
            <span className="text-2xl font-semibold sm:block hidden">
              Sports and Fitness Center
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {["Home", "Classes", "Apparels", "Coaches", "My Profile"].map(
              (item, index) => {
                const href =
                  item === "Home"
                    ? "/"
                    : item === "Classes"
                      ? "/sports-classes"
                      : item === "My Profile"
                        ? "/user-profile"
                        : `/${item.toLowerCase().replace(" ", "-")}`;
                return (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                  >
                    <Link
                      href={href}
                      className="text-white hover:text-red-500 transition duration-300"
                    >
                      {item}
                    </Link>
                  </motion.div>
                );
              }
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger className="text-white hover:text-gray-300 focus:outline-none">
                <Menu />
              </SheetTrigger>
              <SheetContent className="w-full">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col items-center space-y-3 text-black py-4">
                  {["Home", "Classes", "Apparels", "Coaches", "My Profile"].map(
                    (item) => (
                      <SheetClose asChild key={item}>
                        <Link
                          href={
                            item === "Home"
                              ? "/"
                              : `/${item.toLowerCase().replace(" ", "-")}`
                          }
                          className="hover:bg-gray-100 px-3 py-2 rounded-md text-lg font-medium"
                        >
                          {item}
                        </Link>
                      </SheetClose>
                    )
                  )}
                  <SheetClose asChild>
                    <LogoutButton user={user} />
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Authentication Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <LogoutButton user={user} />
            ) : (
              ["Login", "Register"].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + 0.1 * index, duration: 0.5 }}
                >
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className={`text-white hover:text-red-500 transition duration-300 ${
                      item === "Register"
                        ? "bg-red-600 px-4 py-2 rounded-full hover:bg-red-700"
                        : ""
                    }`}
                  >
                    {item}
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
