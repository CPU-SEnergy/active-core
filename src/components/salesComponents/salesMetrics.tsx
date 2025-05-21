import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

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
    if (amount >= 1000000) {
      return `₱ ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `₱ ${(amount / 1000).toFixed(1)}k`;
    }
    return `₱ ${amount.toFixed(2)}`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
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
      return currentMonth > 0 ? (data?.earnings[currentMonth - 1] || 0) : 0;
    }
    return 0; // No previous year data available
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
        <span className="text-gray-500 text-sm font-medium">
          No Change
        </span>
      );
    }
  }

  return (
    <Card>
      <div className="p-6 bg-white rounded-lg shadow-sm max-w-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold mr-10 text-gray-900">
            {period === "monthly" ? "This Month Sales" : "This Year Sales"}
          </h2>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="text-xs font-medium w-20 bg-[#E9EAEC]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Month</SelectItem>
              <SelectItem value="annually">Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">Revenue</div>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-semibold">
                {formatCurrency(getCurrentValue())}
              </span>
              {renderGrowthIndicator()}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Total Members</div>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-semibold">
                {formatNumber(totalCustomers)}
              </span>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Membership Distribution</div>
            <div className="flex justify-between items-center">
              <span className="text-sm">
                Regular: {formatNumber(data.memberships.regular)} <br />
                Student: {formatNumber(data.memberships.student)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}