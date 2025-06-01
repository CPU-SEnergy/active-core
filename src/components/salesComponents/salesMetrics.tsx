"use client";

import type React from "react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SalesMetricsProps {
  data: {
    earnings: number[];
    memberships: {
      package: number;
      individual: number;
      walkIn: number;
    };
    monthlyEarnings?: number;
  } | null;
  isLoading?: boolean;
}

export function SalesMetricsSkeleton() {
  return (
    <Card className="w-full h-full bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <Skeleton className="h-4 w-16 mb-2" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <Skeleton className="h-4 w-24 mb-2" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-20" />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <Skeleton className="h-4 w-36 mb-3" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 w-18" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SalesMetrics({
  data,
  isLoading = false,
}: SalesMetricsProps) {
  const [period, setPeriod] = useState("monthly");

  if (isLoading) {
    return <SalesMetricsSkeleton />;
  }

  // Default to 0 values if no data
  const earnings = data?.earnings || Array(12).fill(0);
  const memberships = data?.memberships || {
    package: 0,
    individual: 0,
    walkIn: 0,
  };
  const monthlyEarnings = data?.monthlyEarnings || 0;

  const formatCurrency = (amount: number) => {
    return `₱ ${amount.toLocaleString()}`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getCurrentValue = () => {
    if (period === "monthly") {
      return monthlyEarnings;
    }
    return earnings.reduce((sum, val) => sum + val, 0);
  };

  const getPreviousValue = () => {
    if (period === "monthly") {
      const currentMonth = new Date().getMonth();
      return currentMonth > 0 ? earnings[currentMonth - 1] || 0 : 0;
    }
    return 0;
  };

  const totalCustomers =
    memberships.package + memberships.individual + memberships.walkIn;

  function renderGrowthIndicator(): React.ReactNode {
    const current = getCurrentValue();
    const previous = getPreviousValue();
    const growth = calculateGrowth(current, previous);

    if (growth > 0) {
      return (
        <span className="text-green-500 text-sm font-medium">
          ▲ {formatPercentage(growth)}
        </span>
      );
    } else if (growth < 0) {
      return (
        <span className="text-red-500 text-sm font-medium">
          ▼ {formatPercentage(Math.abs(growth))}
        </span>
      );
    } else {
      return (
        <span className="text-gray-500 text-sm font-medium">No Change</span>
      );
    }
  }

  const hasData = totalCustomers > 0 || getCurrentValue() > 0;

  return (
    <Card className="w-full h-full bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {period === "monthly" ? "This Month Sales" : "This Year Sales"}
          </CardTitle>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="text-xs font-medium w-20 h-8 bg-gray-100 border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Month</SelectItem>
              <SelectItem value="annually">Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="text-sm text-gray-500 mb-2">Revenue</div>
            <div className="flex justify-between items-center">
              <span className="text-xl lg:text-2xl font-semibold text-gray-900">
                {formatCurrency(getCurrentValue())}
              </span>
              {hasData && renderGrowthIndicator()}
              {!hasData && (
                <span className="text-gray-400 text-sm font-medium">
                  No data
                </span>
              )}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="text-sm text-gray-500 mb-2">Total Members</div>
            <div className="flex justify-between items-center">
              <span className="text-xl lg:text-2xl font-semibold text-gray-900">
                {formatNumber(totalCustomers)}
              </span>
              {!hasData && (
                <span className="text-gray-400 text-sm font-medium">
                  No data
                </span>
              )}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="text-sm text-gray-500 mb-3">Memberships:</div>
            {hasData ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#E74C78]" />
                  <span className="text-sm text-gray-700">
                    Package:{" "}
                    <span className="font-medium">
                      {formatNumber(memberships.package)}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#9095a0]" />
                  <span className="text-sm text-gray-700">
                    Individual:{" "}
                    <span className="font-medium">
                      {formatNumber(memberships.individual)}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#F59E0B]" />
                  <span className="text-sm text-gray-700">
                    Walk-in:{" "}
                    <span className="font-medium">
                      {formatNumber(memberships.walkIn)}
                    </span>
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-4">
                <div className="text-center">
                  <div className="text-gray-400 mb-2">
                    <svg
                      className="w-8 h-8 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">
                    No membership data available
                  </p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="h-3 w-3 rounded-full bg-[#E74C78]" />
                      <span className="text-sm text-gray-700">
                        Package: <span className="font-medium">0</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <div className="h-3 w-3 rounded-full bg-[#9095a0]" />
                      <span className="text-sm text-gray-700">
                        Individual: <span className="font-medium">0</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <div className="h-3 w-3 rounded-full bg-[#F59E0B]" />
                      <span className="text-sm text-gray-700">
                        Walk-in: <span className="font-medium">0</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
