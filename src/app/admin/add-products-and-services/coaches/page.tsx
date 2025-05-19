"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { CoachForm } from "@/components/AddProductAndServices/CoachFormModal";
import SelectProductAndServices from "../SelectProductAndServices";
import fetcher from "@/lib/fetcher";
import useSWR from "swr";
import { COACHDATA } from "@/lib/types/product-services";
import { EditCoach } from "@/components/AddProductAndServices/EditCoachModal";
import { convertTimestampToDate } from "@/utils/firebase/helpers/convertTimestampToDate";
import ProductAndServicesSwitch from "@/components/AddProductAndServices/ProductAndServicesSwitch";

export default function CoachesPage() {
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
            <CoachForm />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coaches.map((coach) => (
                <Card key={coach.id} className="group">
                  <div className="p-4">
                    <div className="relative aspect-square mb-4 rounded overflow-hidden">
                      <Image
                        src={coach.imageUrl || "/default.png"}
                        alt={coach.name}
                        sizes="300px"
                        fill
                        priority
                        className="object-cover"
                      />
                    </div>

                    <div
                      className={`flex justify-end items-center gap-4 mb-4 p-1 rounded transition-colors ${
                        coach.isActive ? "bg-white" : "bg-red-100"
                      }`}
                    >
                      <span
                        className={`font-semibold ${
                          coach.isActive ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {coach.isActive ? "Active" : "Archived"}
                      </span>
                      <ProductAndServicesSwitch
                        collectionName="coaches"
                        id={coach.id}
                        isActive={coach.isActive}
                      />
                      <EditCoach data={coach} />
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">{coach.name}</h3>
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
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
