import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DonutChartsProps {
  data: {
    memberships: {
      package: number;
      individual: number;
      walkIn: number;
    };
  } | null;
  isLoading?: boolean;
}

export function DonutChartsSkeleton() {
  return (
    <Card className="w-full h-full bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-4">
        <Skeleton className="h-6 w-24" />
      </CardHeader>
      <CardContent className="pb-6">
        <div className="flex flex-col items-center p-4 border border-gray-100 rounded-lg bg-gray-50/30">
          <div className="w-full mb-6">
            <div className="h-[220px] mx-auto flex items-center justify-center">
              <div className="relative">
                <Skeleton className="h-[180px] w-[180px] rounded-full" />
                <Skeleton className="h-[100px] w-[100px] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
          <div className="w-full grid grid-cols-3 gap-2 sm:gap-4">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-2 sm:p-3 bg-white rounded-lg border border-gray-100"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-6 w-10 mb-1" />
                <Skeleton className="h-3 w-8" />
              </div>
            ))}
          </div>

          <div className="w-full text-center mt-4 pt-3 border-t border-gray-200">
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const COLORS = {
  PACKAGE: "#E74C78",
  INDIVIDUAL: "#9095a0",
  WALK_IN: "#F59E0B",
};

export default function DonutCharts({
  data,
  isLoading = false,
}: DonutChartsProps) {
  if (isLoading) {
    return <DonutChartsSkeleton />;
  }

  // Default to 0 values if no data
  const memberships = data?.memberships || {
    package: 0,
    individual: 0,
    walkIn: 0,
  };

  const chartData = [
    {
      name: "Package",
      value: memberships.package,
      color: COLORS.PACKAGE,
    },
    {
      name: "Individual",
      value: memberships.individual,
      color: COLORS.INDIVIDUAL,
    },
    {
      name: "Walk-in",
      value: memberships.walkIn,
      color: COLORS.WALK_IN,
    },
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="w-full h-full bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Memberships
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="flex flex-col items-center p-4 border border-gray-100 rounded-lg bg-gray-50/30">
          <div className="w-full mb-6">
            <div className="h-[220px] mx-auto">
              {total > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={2}
                      stroke="#ffffff"
                    >
                      {chartData.map((entry, index) => (
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
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="h-[180px] w-[180px] mx-auto border-4 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                      <div className="text-gray-400">
                        <svg
                          className="w-12 h-12 mx-auto mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        <p className="text-sm font-medium">No Data</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full grid grid-cols-3 gap-2 sm:gap-4">
            {chartData.map((entry, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-2 sm:p-3 bg-white rounded-lg border border-gray-100"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {entry.name}
                  </span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {entry.value}
                </span>
                <span className="text-xs text-gray-500">
                  (
                  {total > 0 ? ((entry.value / total) * 100).toFixed(1) : "0.0"}
                  %)
                </span>
              </div>
            ))}
          </div>

          <div className="w-full text-center mt-4 pt-3 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-700">
              Total: {total} {total === 1 ? "member" : "members"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
