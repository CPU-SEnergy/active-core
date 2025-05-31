import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DonutChartsProps {
  data: {
    memberships: {
      regular: number;
      student: number;
    };
  } | null;
}

const COLORS = {
  STUDENT: {
    TRAINER: "#9095a0",
    BASIC: "#E3E6EB",
  },
  REGULAR: {
    TRAINER: "#E74C78",
    BASIC: "#F7C7D5",
  },
};

export default function DonutCharts({ data }: DonutChartsProps) {
  if (!data || !data.memberships) {
    return null;
  }

  const chartData = [
    {
      category: "Student",
      data: [
        {
          name: "Trainer",
          value: Math.round(data.memberships.student * 0.6),
          color: COLORS.STUDENT.TRAINER,
        },
        {
          name: "Basic",
          value: Math.round(data.memberships.student * 0.4),
          color: COLORS.STUDENT.BASIC,
        },
      ],
    },
    {
      category: "Regular",
      data: [
        {
          name: "Trainer",
          value: Math.round(data.memberships.regular * 0.2),
          color: COLORS.REGULAR.TRAINER,
        },
        {
          name: "Basic",
          value: Math.round(data.memberships.regular * 0.8),
          color: COLORS.REGULAR.BASIC,
        },
      ],
    },
  ];

  return (
    <Card className="w-full h-full bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Memberships
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="grid gap-4">
          {chartData.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 border border-gray-100 p-4 rounded-lg bg-gray-50/30"
            >
              <div className="h-[100px] w-[100px] sm:h-[120px] sm:w-[120px] flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={item.data}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={45}
                      paddingAngle={2}
                      dataKey="value"
                      strokeWidth={1}
                      stroke="#ffffff"
                    >
                      {item.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        fontSize: "12px",
                        padding: "8px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "6px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        backgroundColor: "white",
                      }}
                      formatter={(value: number) => [`${value} members`, ""]}
                      labelFormatter={() => ""}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <span className="text-base font-semibold text-gray-900">
                  {item.category}
                </span>
                <div className="space-y-1">
                  {item.data.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm text-gray-700 truncate">
                        {entry.name}{" "}
                        <span className="font-medium">({entry.value})</span>
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  Total:{" "}
                  {item.data.reduce((sum, entry) => sum + entry.value, 0)}{" "}
                  members
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
