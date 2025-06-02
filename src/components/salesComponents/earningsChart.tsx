"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  CartesianGrid,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface EarningsChartProps {
  earnings?: number[];
  isLoading?: boolean;
}

export function EarningsChartSkeleton() {
  return (
    <Card className="w-full bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="min-w-0 flex-1">
            <Skeleton className="h-5 sm:h-6 w-32 sm:w-36 mb-2" />
            <Skeleton className="h-3 sm:h-4 w-40 sm:w-48" />
          </div>
          <Skeleton className="h-8 w-16 sm:w-20" />
        </div>
      </CardHeader>
      <CardContent className="pb-4 sm:pb-6">
        <div className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px]">
          <div className="h-full w-full flex items-end justify-between gap-0.5 sm:gap-1 md:gap-2 px-1 sm:px-2 md:px-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-1 sm:gap-2 flex-1"
              >
                <Skeleton
                  className="w-full rounded-t-md"
                  style={{
                    height: `${Math.random() * 60 + 40}%`,
                    minHeight: "15px",
                  }}
                />
                <Skeleton className="h-2 sm:h-3 w-3 sm:w-4 md:w-6" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function EarningsChart({
  earnings = [],
  isLoading = false,
}: EarningsChartProps) {
  const [selectedYear, setSelectedYear] = useState("2024");

  if (isLoading) {
    return <EarningsChartSkeleton />;
  }

  const chartData = earnings.map((earning, index) => ({
    month: months[index],
    earnings: Number(earning) || 0,
  }));

  const formatTooltipCurrency = (amount: number) => {
    if (!amount || isNaN(amount)) return "₱0";
    return `₱${Math.round(amount).toLocaleString()}`;
  };

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">
              Monthly Earnings
            </CardTitle>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Revenue performance over the year
            </p>
          </div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-16 sm:w-20 h-7 sm:h-8 text-xs border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pb-4 sm:pb-6 px-3 sm:px-4 lg:px-6">
        <div className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px] w-full">
          <ChartContainer
            config={{
              earnings: {
                label: "Earnings",
                color: "#9095a0",
              },
            }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 5,
                  left: 5,
                  bottom: 10,
                }}
                barCategoryGap="10%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: "10px",
                  }}
                  interval={0}
                  angle={0}
                  textAnchor="middle"
                  height={30}
                />
                <YAxis hide={true} domain={[0, "dataMax + 10000"]} />
                <Bar
                  dataKey="earnings"
                  fill="var(--color-earnings)"
                  radius={[2, 2, 0, 0]}
                  className="hover:opacity-80 transition-opacity"
                  maxBarSize={60}
                />
                <ChartTooltip
                  cursor={{ fill: "rgba(59, 130, 246, 0.1)", radius: 2 }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0]?.payload;
                      return (
                        <div className="rounded-lg border bg-white p-2 sm:p-3 shadow-lg max-w-[200px]">
                          <div className="flex flex-col space-y-1">
                            <span className="text-xs sm:text-sm font-medium text-gray-900">
                              {label} {selectedYear}
                            </span>
                            <span className="text-sm sm:text-lg font-bold text-blue-600">
                              {formatTooltipCurrency(data.earnings)}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
