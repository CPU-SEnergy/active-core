"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { ClassesModal } from "@/components/AddProductAndServices/ClassFormModal";
import SelectProductAndServices from "../SelectProductAndServices";
import fetcher from "@/lib/fetcher";
import useSWR from "swr";
import type { CLASSDATA } from "@/lib/types/product-services";
import EditClassModal from "@/components/AddProductAndServices/EditClassModal";
import { Skeleton } from "@/components/ui/skeleton";
import ProductAndServicesSwitch from "@/components/AddProductAndServices/ProductAndServicesSwitch";
import CoachList from "@/components/CoachList";
import DeleteButton from "@/components/AddProductAndServices/DeleteItemById";
import { removeItem } from "@/app/actions/admin/products-services/removeItem";

function ClassesSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-48" />
        </div>
        <Skeleton className="h-10 w-32 mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="relative">
              <div className="relative aspect-square">
                <Skeleton className="absolute inset-0 rounded-t-lg" />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ClassesPage() {
  const {
    data: classes,
    error,
    isLoading,
  } = useSWR<CLASSDATA[]>(`/api/classes`, fetcher);

  if (error) {
    console.error("Error fetching classes:", error);
    return <>Error fetching classes</>;
  }

  if (isLoading) {
    return <ClassesSkeleton />;
  }

  console.log("coaches page", classes);

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold">Classes</h1>
            <SelectProductAndServices />
          </div>
          <ClassesModal />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {!Array.isArray(classes) || classes.length === 0 ? (
              <div className="col-span-4 text-center">
                <p className="text-gray-500">No classes available</p>
              </div>
            ) : (
              classes.map((cls) => (
                <Card key={cls.id} className="relative group">
                  <DeleteButton
                    id={cls.id}
                    collectionName="classes"
                    onDelete={(id) => removeItem("classes", id)}
                  />
                  <div className="relative aspect-square rounded-t-lg overflow-hidden">
                    <Image
                      src={cls.imageUrl || "/placeholder.svg"}
                      alt={cls.name}
                      fill
                      sizes="200px"
                      priority
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-4">
                    <div
                      className={`flex justify-end items-center gap-4 mb-4 p-1 rounded transition-colors ${
                        cls.isActive ? "bg-white" : "bg-red-100"
                      }`}
                    >
                      <span
                        className={`font-semibold ${cls.isActive ? "text-green-600" : "text-gray-500"}`}
                      >
                        {cls.isActive ? "Active" : "Archived"}
                      </span>
                      <ProductAndServicesSwitch
                        collectionName="classes"
                        id={cls.id}
                        isActive={cls.isActive}
                      />
                      <EditClassModal data={cls} />
                    </div>

                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{cls.name}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {cls.description}
                    </p>
                    <p className="text-sm font-semibold">
                      Coaches: <CoachList coachIds={cls.coaches} />
                    </p>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
