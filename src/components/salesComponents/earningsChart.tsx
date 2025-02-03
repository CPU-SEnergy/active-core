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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

const years = {
  "2022": [
    { month: "Jan", earnings: 3800 },
    { month: "Feb", earnings: 4900 },
    { month: "Mar", earnings: 3600 },
    { month: "Apr", earnings: 5800 },
    { month: "May", earnings: 6500 },
    { month: "Jun", earnings: 2900 },
    { month: "Jul", earnings: 5200 },
    { month: "Aug", earnings: 4600 },
    { month: "Sep", earnings: 4300 },
    { month: "Oct", earnings: 3500 },
    { month: "Nov", earnings: 4800 },
    { month: "Dec", earnings: 5500 },
  ],
  "2023": [
    { month: "Jan", earnings: 4500 },
    { month: "Feb", earnings: 5600 },
    { month: "Mar", earnings: 4200 },
    { month: "Apr", earnings: 6300 },
    { month: "May", earnings: 7100 },
    { month: "Jun", earnings: 3800 },
    { month: "Jul", earnings: 5800 },
    { month: "Aug", earnings: 5100 },
    { month: "Sep", earnings: 4700 },
    { month: "Oct", earnings: 4100 },
    { month: "Nov", earnings: 5400 },
    { month: "Dec", earnings: 6200 },
  ],
  "2024": [
    { month: "Jan", earnings: 3200 },
    { month: "Feb", earnings: 5100 },
    { month: "Mar", earnings: 3900 },
    { month: "Apr", earnings: 6100 },
    { month: "May", earnings: 7000 },
    { month: "Jun", earnings: 2500 },
    { month: "Jul", earnings: 5300 },
    { month: "Aug", earnings: 4400 },
    { month: "Sep", earnings: 4100 },
    { month: "Oct", earnings: 2900 },
    { month: "Nov", earnings: 4700 },
    { month: "Dec", earnings: 5400 },
  ],
};

export default function EarningsChart() {
  const [selectedYear, setSelectedYear] =
    React.useState<keyof typeof years>("2024");

  return (
    <Card className="max-w-lg bg-background/50 shadow-sm ">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Earnings
        </CardTitle>
        <Select
          defaultValue={selectedYear}
          onValueChange={(value) =>
            setSelectedYear(value as keyof typeof years)
          }
        >
          <SelectTrigger className="w-[80px] h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
          </SelectContent>
        </Select>
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
                data={years[selectedYear]}
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
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-md border bg-background p-1 shadow-sm">
                          <div className="flex flex-col">
                            <span className="text-[0.60rem] uppercase text-muted-foreground">
                              Earnings
                            </span>
                            <span className="text-xs font-bold text-muted-foreground">
                              ₱{data.earnings}
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
