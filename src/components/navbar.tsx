'use client'

import * as React from 'react'
import Link from 'next/link'
import { LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  return (
    <nav className="bg-black">
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex-none">
            <Link href="/" className="flex items-center">
              <span className="text-3xl font-bold text-white">Logo</span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-base font-medium">Home</Link>
              <Link href="/membership" className="text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-base font-medium">Membership</Link>
              <Link href="/classes" className="text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-base font-medium">Classes</Link>
              <Link href="/apparels" className="text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-base font-medium">Apparels</Link>
            </div>
            <Button variant="ghost" size="lg" className="text-gray-300 hover:bg-gray-800 hover:text-white" asChild>
              <Link href="/user-profile">
                <User className="h-6 w-6 md:mr-2" />
                <span className="hidden md:inline text-base">Profile</span>
              </Link>
            </Button>
            <Button variant="ghost" size="lg" className="text-gray-300 hover:bg-gray-800 hover:text-white">
              <LogOut className="h-6 w-6 md:mr-2" />
              <span className="hidden md:inline text-base">Log out</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link href="/" className="text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-md text-lg font-medium">Homepage</Link>
          <Link href="/membership" className="text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-md text-lg font-medium">Membership</Link>
          <Link href="/classes" className="text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-md text-lg font-medium">Classes</Link>
          <Link href="/apparels" className="text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-md text-lg font-medium">Apparels</Link>
        </div>
      </div>
    </nav>
  )
}