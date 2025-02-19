"use client";

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil } from "lucide-react"
import { Modal } from "@/components/ui/apparels-modal"


// Mock data for apparels
const apparels = [
  {
    id: 1,
    name: "Sweatpants",
    size: "Small",
    price: { regular: 1900.0, sale: 1200.0 },
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Boxing Gloves",
    size: "Medium | Large",
    price: { regular: 2200.0, sale: 1600.0 },
    image: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Sweatpants",
    size: "Small",
    price: { regular: 1900.0, sale: 1200.0 },
    image: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Sweatpants",
    size: "Small",
    price: { regular: 1900.0, sale: 1200.0 },
    image: "/placeholder.svg",
  },
  
  {
    id: 5,
    name: "Sweatpants",
    size: "Small",
    price: { regular: 1900.0, sale: 1200.0 },
    image: "/placeholder.svg",
  },
  {
    id: 6,
    name: "Boxing Gloves",
    size: "Medium | Large",
    price: { regular: 2200.0, sale: 1600.0 },
    image: "/placeholder.svg",
  },
  {
    id: 7,
    name: "Sweatpants",
    size: "Small",
    price: { regular: 1900.0, sale: 1200.0 },
    image: "/placeholder.svg",
  },
  {
    id: 8,
    name: "Sweatpants",
    size: "Small",
    price: { regular: 1900.0, sale: 1200.0 },
    image: "/placeholder.svg",
  },
]

export default function ApparelsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Apparels</h1>
          <Select defaultValue="apparels">
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

        {/* Add Apparels Button */}
        <Button
          className="w-semifull mb-8 py-6 text-base border-2 border-gray-200 bg-white text-black hover:bg-gray-100"
          variant="outline"
          onClick={() => setIsModalOpen(true)}
        >
          Add Apparels
        </Button>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {apparels.map((apparel) => (
            <Card key={apparel.id} className="relative group">
              <div className="relative aspect-square">
                <Image
                  src={apparel.image || "/placeholder.svg"}
                  alt={apparel.name}
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
                  <h3 className="font-medium">{apparel.name}</h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mb-2">{apparel.size}</p>
                <p className="text-sm">
                  P {apparel.price.regular.toFixed(2)} | P {apparel.price.sale.toFixed(2)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal Component */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}