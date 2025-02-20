"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil } from "lucide-react";
import { CoachForm } from "@/components/ui/coaches-modal";

// Mock data for coaches
const coaches = [
  {
    id: 1,
    name: "John Doe",
    specialization: "Strength Training",
    bio: "Expert in strength and conditioning.",
    age: 35,
    experience: "10 years",
    certifications: "Certified Strength Coach",
    contact: "123-456-7890",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Jane Smith",
    specialization: "Yoga Instructor",
    bio: "Passionate about holistic wellness.",
    age: 29,
    experience: "8 years",
    certifications: "Registered Yoga Teacher",
    contact: "987-654-3210",
    image: "/placeholder.svg",
  },
];

export default function CoachesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Coaches</h1>
          <Select defaultValue="coaches">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apparels">Apparels</SelectItem>
              <SelectItem value="equipment">Membership</SelectItem>
              <SelectItem value="accessories">Coaches</SelectItem>
              <SelectItem value="accessories">Classes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Add Coach Button */}
        <Button
          className="w-semifull mb-8 py-6 text-base border-2 border-gray-200 bg-white text-black hover:bg-gray-100"
          variant="outline"
          onClick={() => setIsModalOpen(true)}
        >
          Add Coach
        </Button>

        {/* Coaches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coaches.map((coach) => (
            <Card key={coach.id} className="relative group">
              <div className="relative aspect-square">
                <Image
                  src={coach.image || "/placeholder.svg"}
                  alt={coach.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{coach.name}</h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mb-2">{coach.specialization}</p>
                <p className="text-sm text-gray-500 mb-2">Age: {coach.age}</p>
                <p className="text-sm text-gray-500 mb-2">Experience: {coach.experience}</p>
                <p className="text-sm text-gray-500 mb-2">Certifications: {coach.certifications}</p>
                <p className="text-sm text-gray-500">Contact: {coach.contact}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal Component */}
      <CoachForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          console.log("Coach form submitted successfully");
        }} 
      />
    </div>
  );
}
