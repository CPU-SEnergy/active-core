"use client";

import { useEffect, useState } from "react";
import SalesMetrics from "@/components/salesComponents/salesMetrics";
import EarningsChart from "@/components/salesComponents/earningsChart";
import DonutCharts from "@/components/salesComponents/donutChart";

const sampleData = {
  memberships: {
    package: 100,
    individual: 85,
    walkIn: 45,
  },
  earnings: [
    45000, 52000, 48000, 61000, 55000, 67000, 72000, 58000, 63000, 69000, 74000,
    81000,
  ],
  monthlyEarnings: 75000,
};

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<{
    memberships: {
      package: number;
      individual: number;
      walkIn: number;
    };
    earnings: number[];
    monthlyEarnings: number;
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setData(sampleData);
      setIsLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-2 lg:py-3">
        <div className="mt-3 sm:mt-5">
          <h1 className="text-lg lg:text-xl font-semibold text-gray-900">
            Sales Dashboard
          </h1>
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-8 bg-white">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <div className="w-full flex justify-center">
              <SalesMetrics data={data} isLoading={isLoading} />
            </div>
            <div className="w-full flex justify-center">
              <DonutCharts data={data} isLoading={isLoading} />
            </div>
          </div>
          <div className="w-full">
            <EarningsChart
              earnings={data?.earnings ?? []}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
