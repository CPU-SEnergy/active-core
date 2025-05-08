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
}

export default function DashboardPage() {
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const currentYear = new Date().getFullYear().toString();
        const response = await fetch(`/api/admin/sales/${currentYear}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch sales data');
        }

        const data = await response.json();
        setSalesData(data);
      } catch (err) {
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