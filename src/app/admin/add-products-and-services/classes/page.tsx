"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { ClassesModal } from "@/components/AddProductAndServices/ClassFormModal";
import SelectProductAndServices from "../SelectProductAndServices";

const classes = [
  {
    id: 1,
    name: "Yoga Basics",
    description:
      "A beginner-friendly yoga class to improve flexibility and relaxation.",
    picture: "/placeholder.svg",
    coaches: ["Coach A", "Coach B"],
  },
  {
    id: 2,
    name: "HIIT Workout",
    description: "High-intensity interval training for endurance and strength.",
    picture: "/placeholder.svg",
    coaches: ["Coach C"],
  },
];

export default function ClassesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Classes</h1>
          <SelectProductAndServices />
        </div>

        <Button
          className="w-semifull mb-8 py-6 text-base border-2 border-gray-200 bg-white text-black hover:bg-gray-100"
          variant="outline"
          onClick={() => setIsModalOpen(true)}
        >
          Add Class
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {classes.map((classItem) => (
            <Card key={classItem.id} className="relative group">
              <div className="relative aspect-square">
                <Image
                  src={classItem.picture || "/placeholder.svg"}
                  alt={classItem.name}
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
                  <h3 className="font-medium">{classItem.name}</h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {classItem.description}
                </p>
                <p className="text-sm font-semibold">
                  Coaches: {classItem.coaches.join(", ")}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <ClassesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          console.log("Class form submitted successfully");
        }}
        coaches={classes.flatMap((classItem) =>
          classItem.coaches.map((coach) => ({ id: coach, name: coach }))
        )}
      />
    </div>
  );
}
