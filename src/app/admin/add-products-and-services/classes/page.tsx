"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { ClassesModal } from "@/components/AddProductAndServices/ClassFormModal";
import SelectProductAndServices from "../SelectProductAndServices";
import fetcher from "@/lib/fetcher";
import useSWR from "swr";
import { CLASSDATA } from "@/lib/types/product-services";
import EditClassModal from "@/components/AddProductAndServices/EditClassModal";

export default function ClassesPage() {
  const {
    data: classes,
    error,
    isLoading,
  } = useSWR<CLASSDATA[]>("/api/classes", fetcher, {
    dedupingInterval: 60 * 60 * 24,
  });

  if (error) {
    console.error("Error fetching classes:", error);
    return <>Error fetching classes</>;
  }
  console.log("classes page", classes);

  return (
    <>
      {isLoading && <p>Loading classes...</p>}
      {Array.isArray(classes) && (
        <div className="min-h-screen bg-white">
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-semibold">Classes</h1>
              <SelectProductAndServices />
            </div>
            <ClassesModal />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {classes.length === 0 ? (
                <div className="col-span-4 text-center">
                  <p className="text-gray-500">No classes available</p>
                </div>
              ) : (
                classes.map((cls) => (
                  <Card key={cls.id} className="relative group">
                    <div className="relative aspect-square">
                      <Image
                        src={cls.imageUrl || "/placeholder.svg"}
                        alt={cls.name}
                        fill
                        sizes="200px"
                        priority
                        className="object-cover rounded-t-lg"
                      />
                      <EditClassModal data={cls} />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{cls.name}</h3>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        {cls.description}
                      </p>
                      <p className="text-sm font-semibold">
                        Coaches: {cls.coachId.join(", ")}
                      </p>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
