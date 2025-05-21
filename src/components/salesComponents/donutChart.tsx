import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

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
        { name: "Trainer", value: Math.round(data.memberships.student * 0.6), color: COLORS.STUDENT.TRAINER },
        { name: "Basic", value: Math.round(data.memberships.student * 0.4), color: COLORS.STUDENT.BASIC },
      ],
    },
    {
      category: "Regular",
      data: [
        { name: "Trainer", value: Math.round(data.memberships.regular * 0.2), color: COLORS.REGULAR.TRAINER },
        { name: "Basic", value: Math.round(data.memberships.regular * 0.8), color: COLORS.REGULAR.BASIC },
      ],
    },
  ];

  return (
    <Card className="w-[400px] p-4 border rounded-lg">
      <CardContent>
        <div className="grid gap-4">
          {chartData.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 border p-3 rounded-lg"
            >
              <div className="h-[120px] w-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={item.data}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={60}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {item.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        fontSize: "12px",
                        padding: "4px",
                        border: "none",
                        boxShadow: "none",
                        backgroundColor: "transparent",
                      }}
                      formatter={(value: number) => `${value} members`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base font-semibold">{item.category}</span>
                {item.data.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {entry.name} ({entry.value})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}