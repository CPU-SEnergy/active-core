import * as React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface EarningsChartProps {
  earnings: number[];
}

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function EarningsChart({ earnings }: EarningsChartProps) {
  // Transform the earnings array into the format needed for the chart
  const chartData = earnings.map((earning, index) => ({
    month: months[index],
    earnings: earning
  }));

  return (
    <Card className="max-w-lg bg-background/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Earnings
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="h-[200px]">
          <ChartContainer
            config={{
              earnings: {
                label: "earnings",
                color: "#9095a0",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="2 2"
                  vertical={false}
                  stroke="#e0e0e0"
                />
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={8}
                  tickLine={false}
                  axisLine={false}
                  tick={{ dy: 5 }}
                />
                <YAxis hide={true} />
                <Bar dataKey="earnings" fill="var(--color-earnings)" />
                <ChartTooltip
                  cursor={false}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload?.[0]?.payload;
                      return (
                        <div className="rounded-md border bg-background p-1 shadow-sm">
                          <div className="flex flex-col">
                            <span className="text-[0.60rem] uppercase text-muted-foreground">
                              Earnings
                            </span>
                            <span className="text-xs font-bold text-muted-foreground">
                              ₱{data.earnings.toLocaleString()}
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