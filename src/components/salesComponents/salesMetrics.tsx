import { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

export default function SalesMetrics() {
  const [period, setPeriod] = useState("monthly");

  const metrics = {
    weekly: {
      title: "This Week Sales",
      arr: { current: "P 75.2k", previous: "P 70.5k" },
      customers: { current: "89", previous: "85" },
      activeCustomer: { current: "68.40%", previous: "67.20%" },
    },
    monthly: {
      title: "This Month Sales",
      arr: { current: "P 300.5k", previous: "P 257.3k" },
      customers: { current: "357", previous: "328" },
      activeCustomer: { current: "70.80%", previous: "61.50%" },
    },
    annually: {
      title: "This Year Sales",
      arr: { current: "P 3.2M", previous: "P 3.8M" },
      customers: { current: "2,453", previous: "2,201" },
      activeCustomer: { current: "82.40%", previous: "78.60%" },
    },
  };

  const currentMetrics = metrics[period as keyof typeof metrics];

  const calculateGrowth = (current: string, previous: string) => {
    const currentValue = Number.parseFloat(current.replace(/[^0-9.-]+/g, ""));
    const previousValue = Number.parseFloat(previous.replace(/[^0-9.-]+/g, ""));
    const growth = ((currentValue - previousValue) / previousValue) * 100;
    return growth.toFixed(1);
  };

  const renderGrowthIndicator = (current: string, previous: string) => {
    const growth = calculateGrowth(current, previous);
    const isPositive = Number.parseFloat(growth) >= 0;

    return (
      <div
        className={`flex items-center gap-1 px-2 py-1 ${isPositive ? "bg-green-100" : "bg-red-100"} rounded-full`}
      >
        {isPositive ? (
          <TrendingUp className="w-3 h-3 text-green-600" />
        ) : (
          <TrendingDown className="w-3 h-3 text-red-600" />
        )}
        <span
          className={`text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}
        >
          {Math.abs(Number.parseFloat(growth))}%
        </span>
      </div>
    );
  };

  return (
    <Card>
      <div className="p-6 bg-white rounded-lg shadow-sm max-w-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold mr-10 text-gray-900">
            {currentMetrics.title}
          </h2>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="text-xs font-medium w-20 bg-[#E9EAEC]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Week</SelectItem>
              <SelectItem value="monthly">Month</SelectItem>
              <SelectItem value="annually">Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">ARR</div>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-semibold">
                {currentMetrics.arr.current}
              </span>
              {renderGrowthIndicator(
                currentMetrics.arr.current,
                currentMetrics.arr.previous
              )}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Customers</div>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-semibold">
                {currentMetrics.customers.current}
              </span>
              {renderGrowthIndicator(
                currentMetrics.customers.current,
                currentMetrics.customers.previous
              )}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Active Customer</div>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-semibold">
                {currentMetrics.activeCustomer.current}
              </span>
              {renderGrowthIndicator(
                currentMetrics.activeCustomer.current,
                currentMetrics.activeCustomer.previous
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
