"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MembershipPlanForm } from "@/components/AddProductAndServices/MembershipPlanModal";
import SelectProductAndServices from "../SelectProductAndServices";
import useSWR from "swr";
import { MEMBERSHIPDATA } from "@/lib/types/product-services";
import fetcher from "@/lib/fetcher";
import { convertTimestampToDate } from "@/utils/firebase/helpers/convertTimestampToDate";
import { EditMembershipPlanModal } from "@/components/AddProductAndServices/EditMemberShipPlanModal";
import {
  isPast,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";

export default function MembershipPlansPage() {
  const {
    data: membershipPlans,
    error,
    isLoading,
  } = useSWR<MEMBERSHIPDATA[]>("/api/membership-plan", fetcher, {
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
      {membershipPlans && (
        <div className="min-h-screen bg-white">
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-semibold">Membership Plans</h1>
              <SelectProductAndServices />
            </div>

            <MembershipPlanForm />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {membershipPlans.map((plan) => (
                <Card key={plan.id} className="relative group">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{plan.name}</h3>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <EditMembershipPlanModal
                          data={{ ...plan, id: plan.id.toString() }}
                        />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      Type: {plan.type}
                    </p>
                    <p className="text-sm mb-2">{plan.description}</p>
                    <p className="text-sm">
                      Regular Price: P {plan.price.regular.toFixed(2)}
                    </p>
                    <p className="text-sm">
                      Student Price: P {plan.price.student.toFixed(2)}
                    </p>
                    <p className="text-sm">
                      Special Price: P {plan.price.discount.toFixed(2)}
                    </p>
                    <p className="text-sm">Duration: {plan.duration} days</p>
                    <p
                      className={`text-sm font-semibold ${
                        plan.status === "active"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Status: {plan.status}
                    </p>
                    {plan.planDateEnd && renderPlanTimeLeft(plan.planDateEnd)}
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

function renderPlanTimeLeft(planDateEnd: unknown): JSX.Element | null {
  const endDate = convertTimestampToDate(planDateEnd);
  const now = new Date();
  if (isPast(endDate)) {
    return <p className="text-sm">Plan has ended</p>;
  }
  const days = differenceInDays(endDate, now);
  const hours = differenceInHours(endDate, now) - days * 24;
  const mins =
    differenceInMinutes(endDate, now) - (days * 24 * 60 + hours * 60);
  return (
    <p className="text-sm">
      Time left: {days} days, {hours} hrs, {mins} mins
    </p>
  );
}
