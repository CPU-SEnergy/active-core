"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CoachForm } from "@/components/AddProductAndServices/CoachFormModal";
import SelectProductAndServices from "../SelectProductAndServices";
import fetcher from "@/lib/fetcher";
import useSWR from "swr";
import { COACHDATA } from "@/lib/types/product-services";
import { EditCoach } from "@/components/AddProductAndServices/EditCoachModal";
import { convertTimestampToDate } from "@/utils/firebase/helpers/convertTimestampToDate";

export default function CoachesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: coaches,
    error,
    isLoading,
  } = useSWR<COACHDATA[]>("/api/coaches", fetcher, {
    dedupingInterval: 60 * 60 * 24,
  });

  if (error) {
    console.error("Error fetching coaches:", error);
    return <>Error fetching coaches</>;
  }
  console.log("coaches page", coaches);

  return (
    <>
      {isLoading && <p>Loading coaches...</p>}
      {coaches && (
        <div className="min-h-screen bg-white">
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-semibold">Coaches</h1>
              <SelectProductAndServices />
            </div>
            <Button
              className="w-semifull mb-8 py-6 text-base border-2 border-gray-200 bg-white text-black hover:bg-gray-100"
              variant="outline"
              onClick={() => setIsModalOpen(true)}
            >
              Add Coach
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coaches.map((coach) => (
                <Card key={coach.id} className="relative group">
                  <div className="relative aspect-square">
                    <Image
                      src={coach.imageUrl || "/default.png"}
                      alt={coach.name}
                      sizes="300px"
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    <EditCoach data={coach} />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{coach.name}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {coach.specialization}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      Birthday:{" "}
                      {convertTimestampToDate(coach.dob).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      Experience: {coach.experience} years
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      Certifications: {coach.certifications}
                    </p>
                    <p className="text-sm text-gray-500">
                      Contact: {coach.contactInfo}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <CoachForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              console.log("Coach form submitted successfully");
            }}
          />
        </div>
      )}
    </>
  );
}
