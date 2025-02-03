import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const years: Record<
  string,
  { name: string; basic: number; trainer: number }[]
> = {
  "2022": [
    { name: "Jan", basic: 20, trainer: 40 },
    { name: "Feb", basic: 30, trainer: 50 },
    { name: "Mar", basic: 25, trainer: 45 },
    { name: "Apr", basic: 40, trainer: 55 },
    { name: "May", basic: 50, trainer: 60 },
    { name: "Jun", basic: 45, trainer: 70 },
    { name: "Jul", basic: 60, trainer: 75 },
    { name: "Aug", basic: 80, trainer: 85 },
    { name: "Sep", basic: 50, trainer: 30 },
    { name: "Oct", basic: 30, trainer: 40 },
    { name: "Nov", basic: 60, trainer: 50 },
    { name: "Dec", basic: 35, trainer: 25 },
  ],
  "2023": [
    { name: "Jan", basic: 25, trainer: 45 },
    { name: "Feb", basic: 35, trainer: 55 },
    { name: "Mar", basic: 15, trainer: 35 },
    { name: "Apr", basic: 45, trainer: 50 },
    { name: "May", basic: 65, trainer: 55 },
    { name: "Jun", basic: 55, trainer: 65 },
    { name: "Jul", basic: 75, trainer: 85 },
    { name: "Aug", basic: 85, trainer: 95 },
    { name: "Sep", basic: 55, trainer: 25 },
    { name: "Oct", basic: 35, trainer: 45 },
    { name: "Nov", basic: 70, trainer: 60 },
    { name: "Dec", basic: 45, trainer: 30 },
  ],
  "2024": [
    { name: "Jan", basic: 30, trainer: 50 },
    { name: "Feb", basic: 50, trainer: 70 },
    { name: "Mar", basic: 10, trainer: 50 },
    { name: "Apr", basic: 30, trainer: 40 },
    { name: "May", basic: 70, trainer: 50 },
    { name: "Jun", basic: 50, trainer: 70 },
    { name: "Jul", basic: 70, trainer: 80 },
    { name: "Aug", basic: 90, trainer: 90 },
    { name: "Sep", basic: 60, trainer: 20 },
    { name: "Oct", basic: 30, trainer: 40 },
    { name: "Nov", basic: 80, trainer: 70 },
    { name: "Dec", basic: 40, trainer: 20 },
  ],
};

export default function MembershipChart() {
  const [selectedYear, setSelectedYear] = useState("2024");

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
            <SelectItem value="2022">2022</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={300} minWidth={800}>
        <BarChart
          data={years[selectedYear]}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barGap={0}
          barCategoryGap="20%"
        >
          <XAxis dataKey="name" stroke="#666" />
          <Tooltip contentStyle={{ borderRadius: "8px", color: "#333" }} />
          <Bar dataKey="basic" fill="#9095a0" barSize={20} />
          <Bar dataKey="trainer" fill="#E3E6EB" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
