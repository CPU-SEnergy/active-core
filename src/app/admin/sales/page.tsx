"use client";

// import SalesMetrics from "../../../components/salesComponents/salesMetrics";
// import EarningsChart from "../../../components/salesComponents/earningsChart";
import DonutCharts from "@/components/salesComponents/donutChart";
import MembershipChart from "@/components/salesComponents/membershipChart";

export default function Sales() {
  return (
    <div className="flex w-screen h-screen gap-4 p-4">
      <div className="w-1/2 flex flex-col gap-4">
        <div className="flex-1 flex flex-col items-center justify-center text-xl font-bold border p-4">
          <DonutCharts></DonutCharts>
        </div>
      </div>

      <div className="w-1/2 flex flex-col gap-4">
        <div className="flex-1 flex flex-col items-center justify-center text-xl font-bold border p-4">
          <MembershipChart></MembershipChart>
        </div>
      </div>
    </div>
  );
}
