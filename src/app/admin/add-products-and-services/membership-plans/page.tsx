"use client";

import { Card } from "@/components/ui/card";
import { MembershipPlanForm } from "@/components/AddProductAndServices/MembershipPlanModal";
import SelectProductAndServices from "../SelectProductAndServices";
import useSWR from "swr";
import { MEMBERSHIPDATA } from "@/lib/types/product-services";
import fetcher from "@/lib/fetcher";
import { EditMembershipPlanModal } from "@/components/AddProductAndServices/EditMemberShipPlanModal";
import { Skeleton } from "@/components/ui/skeleton";
import ProductAndServicesSwitch from "@/components/AddProductAndServices/ProductAndServicesSwitch";
import DeleteButton from "@/components/AddProductAndServices/DeleteItemById";
import { removeItem } from "@/app/actions/admin/products-services/removeItem";

function MembershipPlanSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-48" />
        </div>
        <Skeleton className="h-10 w-32 mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="relative">
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function MembershipPlansPage() {
  const {
    data: membershipPlans,
    error,
    isLoading,
  } = useSWR<MEMBERSHIPDATA[]>("/api/membershipPlans", fetcher, {
    dedupingInterval: 60 * 60 * 24,
  });

  if (error) {
    console.error("Error fetching membership:", error);
    return <>Error fetching membership</>;
  }

  if (isLoading) {
    return <MembershipPlanSkeleton />;
  }

  console.log("membership page", membershipPlans);

  return (
    <>
      <div className="min-h-screen bg-white">
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-semibold">Membership Plans</h1>
              <SelectProductAndServices />
            </div>

            <MembershipPlanForm />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {membershipPlans?.length === 0 ? (
                <div className="col-span-3 text-center">
                  <p className="text-gray-500">No membership plans available</p>
                </div>
              ) : (
                membershipPlans?.map((plan) => (
                  <Card key={plan.id} className="relative group">
                    <div className="p-4">
                      <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
                        <ProductAndServicesSwitch
                          collectionName="membershipPlans"
                          id={plan.id}
                          isActive={plan.isActive}
                        />
                        <EditMembershipPlanModal
                          data={{ ...plan, id: plan.id.toString() }}
                        />
                        <div className="absolute top-5 bottom-2">
                          <DeleteButton
                            id={plan.id}
                            collectionName="membershipPlans"
                            onDelete={(id) => removeItem("membershipPlans", id)}
                          />
                        </div>
                      </div>

                      <div className="pr-20">
                        <h3 className="font-medium mb-2">{plan.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">
                          Type: {plan.planType}
                        </p>
                        <p className="text-sm mb-2">{plan.description}</p>
                        <p className="text-sm">Price: P {plan.price}</p>
                        <p className="text-sm">
                          Duration: {plan.duration} days
                        </p>
                        <p
                          className={`text-sm font-semibold ${
                            plan.isActive ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          Status: {plan.isActive ? "Active" : "Archived"}
                        </p>
                      </div>
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
