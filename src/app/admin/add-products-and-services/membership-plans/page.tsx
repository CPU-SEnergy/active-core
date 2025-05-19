"use client";

import { Card } from "@/components/ui/card";
import { MembershipPlanForm } from "@/components/AddProductAndServices/MembershipPlanModal";
import SelectProductAndServices from "../SelectProductAndServices";
import useSWR from "swr";
import { MEMBERSHIPDATA } from "@/lib/types/product-services";
import fetcher from "@/lib/fetcher";
import { EditMembershipPlanModal } from "@/components/AddProductAndServices/EditMemberShipPlanModal";
import ProductAndServicesSwitch from "@/components/AddProductAndServices/ProductAndServicesSwitch";

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

  console.log("membership page", membershipPlans);

  return (
    <>
      {isLoading && <p>Loading membership plans...</p>}
      {Array.isArray(membershipPlans) && (
        <div className="min-h-screen bg-white">
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-semibold">Membership Plans</h1>
              <SelectProductAndServices />
            </div>

            <MembershipPlanForm />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {membershipPlans.length === 0 ? (
                <div className="col-span-3 text-center">
                  <p className="text-gray-500">No membership plans available</p>
                </div>
              ) : (
                membershipPlans.map((plan) => (
                  <Card key={plan.id} className="relative group">
                    <div className="p-4">
                      <div className="absolute top-2 right-2 flex gap-2 z-10">
                        <ProductAndServicesSwitch
                          collectionName="membershipPlans"
                          id={plan.id}
                          isActive={plan.isActive}
                        />
                        <EditMembershipPlanModal
                          data={{ ...plan, id: plan.id.toString() }}
                        />
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
      )}
    </>
  );
}
