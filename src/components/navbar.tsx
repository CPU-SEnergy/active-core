"use client";

import * as React from "react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { usePathname } from "next/navigation";
import { useAuth } from "@/auth/AuthProvider";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Navbar() {
  const { user, loading } = useAuth();

  const pathname = usePathname();

  if (pathname.startsWith("/auth") || pathname.startsWith("/admin")) {
    return null;
  }

  if (loading) {
    return (
      <nav className="bg-black">
        <div className="w-full px-4">
          <div className="flex items-center justify-between h-14">
            <div className="text-white">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-black">
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex-none">
            <Link href="/" className="flex items-center">
              <span className="text-3xl font-bold text-white">Logo</span>
            </Link>
          </div>
          <h1 className="md:hidden text-white text-xl">Sports and Fitness</h1>
          <div className="md:hidden flex-end">
            <Sheet>
              <SheetTrigger className="text-white hover:text-gray-300 active:text-gray-500 focus:outline-none flex">
                <Menu />
              </SheetTrigger>
              <SheetContent className="w-full">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription></SheetDescription>
                </SheetHeader>
                <div className="px-2 pt-2 pb-3 space-y-3 flex flex-col items-center text-black">
                  <SheetClose asChild>
                    <Link
                      href="/"
                      className="hover:bg-gray-100 px-3 py-2 rounded-md text-lg font-medium"
                    >
                      Home
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/coaches"
                      className="hover:bg-gray-100 px-3 py-2 rounded-md text-lg font-medium"
                    >
                      Coaches
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/apparels"
                      className="hover:bg-gray-100 px-3 py-2 rounded-md text-lg font-medium"
                    >
                      Apparels
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/sports-classes"
                      className="hover:bg-gray-100 px-3 py-2 rounded-md text-lg font-medium"
                    >
                      Classes
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/user-profile"
                      className="hover:bg-gray-100 px-3 py-2 rounded-md text-lg font-medium"
                    >
                      My Profile
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <LogoutButton user={user} />
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </Link>
            <Link
              href="/coaches"
              className="text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            >
              Coaches
            </Link>
            <Link
              href="/apparels"
              className="text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            >
              Apparels
            </Link>
            <Link
              href="/sports-classes"
              className="text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            >
              Classes
            </Link>
            <Link
              href="/user-profile"
              className="text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            >
              My Profile
            </Link>
            <LogoutButton user={user} />
          </div>
        </div>
      </div>
    </nav>
  );
}
