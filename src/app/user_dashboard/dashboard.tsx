'use client'

//Please fix the imports specifically from firebaseClient

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { User, Clock, Calendar, Edit2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


const mockUserData = {
  name: "Rhea Rizz Perocho",
  age: 21,
  dateJoined: "2023-01-15",
  membershipExpiry: "2024-01-15",
  profilePicture: "/placeholder.svg?height=100&width=100",
}


const mockMembershipHistory = [
  {
    name: "Premium Annual",
    timeframe: "Annual",
    dateJoined: "2023-01-15",
    dateExpiry: "2024-01-15",
  },
  {
    name: "Basic Monthly",
    timeframe: "Monthly",
    dateJoined: "2022-06-01",
    dateExpiry: "2022-12-31",
  },
]

export default function UserDashboard() {
  const [user, setUser] = useState(mockUserData)
  const [membershipHistory, setMembershipHistory] = useState(mockMembershipHistory)

 
  useEffect(() => {
   
    setUser(mockUserData)
    setMembershipHistory(mockMembershipHistory)
  }, [])

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <h1 className="text-3xl font-bold mb-8">User Dashboard</h1>
      
      {/* Profile Card */}
      <Card className="mb-8">
        <CardContent className="flex flex-col md:flex-row items-center p-6">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            <Image
              src={user.profilePicture}
              alt="Profile Picture"
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
          <div className="flex-grow">
            <h2 className="text-2xl font-semibold mb-2">My Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <User className="mr-2" size={20} />
                <span>{user.name}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2" size={20} />
                <span>{user.age} years old</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2" size={20} />
                <span>Joined: {new Date(user.dateJoined).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2" size={20} />
                <span>Expires: {new Date(user.membershipExpiry).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <Button className="mt-4 md:mt-0 md:ml-4" variant="outline">
            <Edit2 className="mr-2" size={16} />
            Edit Profile
          </Button>
        </CardContent>
      </Card>
      
      {/* Membership History Card */}
      <Card>
        <CardHeader>
          <CardTitle>Membership History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Membership</th>
                  <th className="text-left p-2">Timeframe</th>
                  <th className="text-left p-2">Date Joined</th>
                  <th className="text-left p-2">Date Expired</th>
                </tr>
              </thead>
              <tbody>
                {membershipHistory.map((membership, index) => (
                  <tr key={index} className="border-b last:border-b-0">
                    <td className="p-2">{membership.name}</td>
                    <td className="p-2">{membership.timeframe}</td>
                    <td className="p-2">{new Date(membership.dateJoined).toLocaleDateString()}</td>
                    <td className="p-2">{new Date(membership.dateExpiry).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}