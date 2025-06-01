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

interface SalesMetricsProps {
  data: {
    earnings: number[];
    memberships: {
      regular: number;
      student: number;
    };
    monthlyEarnings?: number;
  } | null;
}

export default function SalesMetrics({ data }: SalesMetricsProps) {
  const [period, setPeriod] = useState("monthly");

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
      return data?.monthlyEarnings || 0;
    }
    // Sum up yearly earnings
    return data?.earnings.reduce((sum, val) => sum + val, 0) || 0;
  };

  const getPreviousValue = () => {
    if (period === "monthly") {
      const currentMonth = new Date().getMonth();
      return currentMonth > 0 ? data?.earnings[currentMonth - 1] || 0 : 0;
    }
    return 0;
  };

  if (!data || !data.earnings || !data.memberships) {
    return <div>No data available</div>;
  }

  const totalCustomers = data.memberships.regular + data.memberships.student;

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
              {renderGrowthIndicator()}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="text-sm text-gray-500 mb-2">Total Members</div>
            <div className="flex justify-between items-center">
              <span className="text-xl lg:text-2xl font-semibold text-gray-900">
                {formatNumber(totalCustomers)}
              </span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="text-sm text-gray-500 mb-3">
              Membership Distribution
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#E74C78]" />
                <span className="text-sm text-gray-700">
                  Regular:{" "}
                  <span className="font-medium">
                    {formatNumber(data.memberships.regular)}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#9095a0]" />
                <span className="text-sm text-gray-700">
                  Student:{" "}
                  <span className="font-medium">
                    {formatNumber(data.memberships.student)}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
