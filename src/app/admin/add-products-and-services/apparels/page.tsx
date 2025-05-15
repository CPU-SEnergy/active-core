"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { ApparelForm } from "@/components/AddProductAndServices/ApparelFormModal";
import SelectProductAndServices from "../SelectProductAndServices";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { APPARELDATA } from "@/lib/types/product-services";
import { EditApparel } from "@/components/AddProductAndServices/EditApparelModal";

export default function ApparelsPage() {
  const { data, error, isLoading } = useSWR<APPARELDATA[]>(
    "/api/apparels",
    fetcher,

    { dedupingInterval: 60 * 60 * 24 }
  );

  if (error) {
    console.error("Error fetching apparels:", error);
    return <>Error fetching apparels</>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Apparels</h1>
          <SelectProductAndServices />
        </div>
        <ApparelForm />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading && <p>Loading apparels...</p>}
          {data &&
            data.length > 0 &&
            data.map((apparel) => (
              <Card key={apparel.id} className="relative group">
                <div className="relative aspect-square">
                  <Image
                    src={apparel.imageUrl || "/placeholder.svg"}
                    alt={apparel.name}
                    fill
                    sizes="300px"
                    priority
                    className="object-cover rounded-t-lg"
                  />
                  <EditApparel data={apparel} />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{apparel.name}</h3>
                  </div>
                  <p className="text-sm inline-flex gap-1">
                    {apparel.discount ? (
                      <>
                        <span className="line-through text-gray-500 font-semibold">
                          P {apparel.price.toFixed(2)}
                        </span>
                        <span className="text-red-500 font-semibold">
                          P {apparel.discount.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="font-semibold">
                        P {apparel.price.toFixed(2)}
                      </span>
                    )}
                  </p>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
