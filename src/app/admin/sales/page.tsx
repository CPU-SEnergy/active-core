"use client";

import { useEffect, useState } from "react";
import SalesMetrics from "../../../components/salesComponents/salesMetrics";
import EarningsChart from "../../../components/salesComponents/earningsChart";
import DonutCharts from "@/components/salesComponents/donutChart";
import MembershipChart from "@/components/salesComponents/membershipChart";

interface SalesData {
  earnings: number[];
  memberships: {
    regular: number;
    student: number;
  };
  monthlyRevenue?: number;
}

export default function DashboardPage() {
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const currentYear = new Date().getFullYear().toString();
        const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');

        // Fetch yearly data
        const yearResponse = await fetch(`/api/admin/sales/${currentYear}`);
        if (!yearResponse.ok) {
          throw new Error('Failed to fetch sales data');
        }
        const yearData = await yearResponse.json();

        // Fetch monthly data
        const monthResponse = await fetch(`/api/admin/overview/kpi/${currentYear}/${currentMonth}`);
        if (!monthResponse.ok) {
          throw new Error('Failed to fetch monthly data');
        }
        const monthData = await monthResponse.json();
        
        // Map revenue to earnings in the data
        setSalesData({
          ...yearData,
          monthlyEarnings: monthData.monthlyRevenue || 0,
        });
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6 w-screen">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <SalesMetrics data={salesData} />
        </div>
        <div className="md:col-span-2">
          <EarningsChart earnings={salesData?.earnings || []} />
        </div>
      </div>
      <div className="flex flex-row">
        <div>
          <DonutCharts data={salesData} />
        </div>
        <div>
          <MembershipChart memberships={salesData?.memberships} />
        </div>
      </div>
    </div>
  );
}