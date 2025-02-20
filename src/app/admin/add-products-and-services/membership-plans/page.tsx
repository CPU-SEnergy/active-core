"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { MembershipPlanForm } from "@/components/AddProductAndServices/MembershipPlanFormModal";
import SelectProductAndServices from "../SelectProductAndServices";
const membershipPlans = [
  {
    id: 1,
    name: "Gold Membership",
    type: "Premium",
    description: "Full access to all facilities and priority booking.",
    price: { regular: 5000.0, student: 4000.0, special: 3500.0 },
    duration: 12,
    status: "active",
  },
  {
    id: 2,
    name: "Silver Membership",
    type: "Standard",
    description: "Access to gym and selected classes.",
    price: { regular: 3500.0, student: 3000.0, special: 2500.0 },
    duration: 6,
    status: "archived",
  },
];

export default function MembershipPlansPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Membership Plans</h1>
          <SelectProductAndServices />
        </div>

        <Button
          className="w-semifull mb-8 py-6 text-base border-2 border-gray-200 bg-white text-black hover:bg-gray-100"
          variant="outline"
          onClick={() => setIsModalOpen(true)}
        >
          Add Membership Plan
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {membershipPlans.map((plan) => (
            <Card key={plan.id} className="relative group p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{plan.name}</h3>
                <Button
                  size="icon"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500 mb-2">Type: {plan.type}</p>
              <p className="text-sm mb-2">{plan.description}</p>
              <p className="text-sm">
                Regular Price: P {plan.price.regular.toFixed(2)}
              </p>
              <p className="text-sm">
                Student Price: P {plan.price.student.toFixed(2)}
              </p>
              <p className="text-sm">
                Special Price: P {plan.price.special.toFixed(2)}
              </p>
              <p className="text-sm">Duration: {plan.duration}</p>
              <p
                className={`text-sm font-semibold ${plan.status === "Active" ? "text-green-600" : "text-red-600"}`}
              >
                Status: {plan.status}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <MembershipPlanForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          console.log("Membership form submitted successfully");
        }}
      />
    </div>
  );
}
