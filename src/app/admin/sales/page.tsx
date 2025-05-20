"use client";

import { useEffect, useState } from "react";
import SalesMetrics from "../../../components/salesComponents/salesMetrics";
import EarningsChart from "../../../components/salesComponents/earningsChart";
import DonutCharts from "@/components/salesComponents/donutChart";
import MembershipChart from "@/components/salesComponents/membershipChart";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

function SalesSkeleton() {
  return (
    <div className="space-y-6 w-screen">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Sales Metrics Card */}
        <div className="md:col-span-1">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </Card>
        </div>

        {/* Earnings Chart */}
        <div className="md:col-span-2">
          <Card className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Charts */}
      <div className="flex flex-row gap-6">
        {/* Donut Chart */}
        <div className="flex-1">
          <Card className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-[200px] w-[200px] rounded-full mx-auto" />
            </div>
          </Card>
        </div>

        {/* Membership Chart */}
        <div className="flex-1">
          <Card className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

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
    return <SalesSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 font-medium">Error: {error}</div>
      </div>
    );
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