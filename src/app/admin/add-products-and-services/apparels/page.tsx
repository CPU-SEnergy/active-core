"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { ApparelForm } from "@/components/AddProductAndServices/ApparelFormModal";
import SelectProductAndServices from "../SelectProductAndServices";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { APPARELDATA } from "@/lib/types/product-services";
import { EditApparel } from "@/components/AddProductAndServices/EditApparelModal";
import { Skeleton } from "@/components/ui/skeleton";
import ProductAndServicesSwitch from "@/components/AddProductAndServices/ProductAndServicesSwitch";
import DeleteButton from "@/components/AddProductAndServices/DeleteItemById";
import { removeItem } from "@/app/actions/admin/products-services/removeItem";

function ApparelsSkeleton() {
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
                <Skeleton className="h-4 w-24" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function calculateFinalPrice(price: number, discount?: number): number {
  if (!discount || discount <= 0 || discount >= price) return price;
  return price - discount;
}

export default function ApparelsPage() {
  const { data, error, isLoading } = useSWR<APPARELDATA[]>(
    "/api/apparels",
    fetcher
  );

  if (error) {
    console.error("Error fetching apparels:", error);
    return <>Error fetching apparels</>;
  }

  if (isLoading) {
    return <ApparelsSkeleton />;
  }

  console.log("Apparels data:", data);

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Apparels</h1>
          <SelectProductAndServices />
        </div>
        <ApparelForm />
        {isLoading && <p>Loading apparels...</p>}
        {!isLoading && !data && (
          <p className="text-center text-gray-500">No apparels found.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data &&
            data.length > 0 &&
            data.map((apparel) => (
              <Card key={apparel.id} className="relative group">
                <DeleteButton
                  id={apparel.id}
                  collectionName="apparels"
                  onDelete={(id) => removeItem("apparels", id)}
                />
                <div className="relative aspect-square rounded-t-lg overflow-hidden">
                  <Image
                    src={apparel.imageUrl || "/placeholder.svg"}
                    alt={apparel.name}
                    fill
                    sizes="300px"
                    priority
                    className="object-cover"
                  />
                </div>

                <div
                  className={`flex justify-end items-center gap-4 mb-4 p-1 rounded transition-colors ${
                    apparel.isActive ? "bg-white" : "bg-red-100"
                  }`}
                >
                  <span
                    className={`font-semibold ${
                      apparel.isActive ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {apparel.isActive ? "Active" : "Archived"}
                  </span>

                  <div className="flex items-center gap-2">
                    <ProductAndServicesSwitch
                      collectionName={"apparels"}
                      id={apparel.id}
                      isActive={apparel.isActive}
                    />
                    <EditApparel data={apparel} />
                  </div>
                </div>

                <div className="p-4 pt-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{apparel.name}</h3>
                  </div>
                  <p className="text-sm inline-flex gap-1">
                    {(() => {
                      const hasDiscount =
                        apparel.discount &&
                        apparel.discount > 0 &&
                        apparel.discount < apparel.price;

                      const finalPrice = calculateFinalPrice(
                        apparel.price,
                        apparel.discount
                      );

                      return hasDiscount ? (
                        <>
                          <span className="line-through text-gray-500 font-semibold">
                            ₱{apparel.price.toFixed(2)}
                          </span>
                          <span className="text-red-500 font-semibold">
                            ₱{finalPrice.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold">
                          ₱{apparel.price.toFixed(2)}
                        </span>
                      );
                    })()}
                  </p>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
