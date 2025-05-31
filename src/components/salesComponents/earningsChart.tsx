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

interface EarningsChartProps {
  earnings: number[];
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

export default function EarningsChart({ earnings }: EarningsChartProps) {
  const [selectedYear, setSelectedYear] = useState("2024");
  const chartData = earnings.map((earning, index) => ({
    month: months[index],
    earnings: earning,
  }));

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString()}`;
  };

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg lg:text-xl font-semibold text-gray-900">
              Monthly Earnings
            </CardTitle>
            <p className="text-sm text-gray-500">
              Revenue performance over the year
            </p>
          </div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-20 h-8 text-xs border-gray-200">
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
      <CardContent className="pb-6">
        <div className="h-[300px] sm:h-[350px] lg:h-[400px]">
          <ChartContainer
            config={{
              earnings: {
                label: "Earnings",
                color: "#9095a0",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748b" }}
                />
                <YAxis hide={true} />
                <Bar
                  dataKey="earnings"
                  fill="var(--color-earnings)"
                  radius={[4, 4, 0, 0]}
                  className="hover:opacity-80 transition-opacity"
                />
                <ChartTooltip
                  cursor={{ fill: "rgba(59, 130, 246, 0.1)", radius: 4 }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0]?.payload;
                      return (
                        <div className="rounded-lg border bg-white p-3 shadow-lg">
                          <div className="flex flex-col space-y-1">
                            <span className="text-sm font-medium text-gray-900">
                              {label}
                            </span>
                            <span className="text-lg font-bold text-blue-600">
                              {formatCurrency(data.earnings)}
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
