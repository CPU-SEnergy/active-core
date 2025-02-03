"use client";

import SalesMetrics from "../../../components/salesComponents/salesMetrics";
import EarningsChart from "../../../components/salesComponents/earningsChart";
import DonutCharts from "@/components/salesComponents/donutChart";
import MembershipChart from "@/components/salesComponents/membershipChart";

export default function DashboardPage() {
  return (
    <div className=" space-y-6 w-screen">
      <h1 className="text-2xl font-bold">Sales</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <SalesMetrics />
        </div>
        <div className="md:col-span-2">
          <EarningsChart />
        </div>
      </div>
      <div className="flex flex-row">
        <div>
          <DonutCharts />
        </div>
        <div>
          <MembershipChart />
        </div>
      </div>
    </div>
  );
}
