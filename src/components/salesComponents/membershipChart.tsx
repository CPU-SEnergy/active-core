import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MembershipChartProps {
  memberships: {
    regular: number;
    student: number;
  } | undefined;
}

export default function MembershipChart({ memberships }: MembershipChartProps) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [chartData, setChartData] = useState<Array<{ name: string; basic: number; trainer: number }>>([]);

  useEffect(() => {
    if (memberships) {
      const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const month = new Date(0, i).toLocaleString('default', { month: 'short' });
        const regularBasic = Math.round(memberships.regular * 0.8 / 12);
        const regularTrainer = Math.round(memberships.regular * 0.2 / 12);
        const studentBasic = Math.round(memberships.student * 0.4 / 12);
        const studentTrainer = Math.round(memberships.student * 0.6 / 12);

        return {
          name: month,
          basic: regularBasic + studentBasic,
          trainer: regularTrainer + studentTrainer,
        };
      });

      setChartData(monthlyData);
    }
  }, [memberships]);

  if (!memberships) {
    return null;
  }

  return (
    <Card className="p-4 shadow-none">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-8">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-[#9095a0]"></div>
            <span className="ml-2 text-base font-medium">Basic Membership</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-gray-300"></div>
            <span className="ml-2 text-base font-medium">
              Membership with Trainer
            </span>
          </div>
        </div>
        <Select onValueChange={setSelectedYear} value={selectedYear}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={selectedYear}>{selectedYear}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ResponsiveContainer width="100%" height={300} minWidth={800}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barGap={0}
          barCategoryGap="20%"
        >
          <XAxis dataKey="name" stroke="#666" />
          <Tooltip 
            contentStyle={{ borderRadius: "8px", color: "#333" }}
            formatter={(value: number) => [`${value} members`, '']}
          />
          <Bar dataKey="basic" fill="#9095a0" barSize={20} />
          <Bar dataKey="trainer" fill="#E3E6EB" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}