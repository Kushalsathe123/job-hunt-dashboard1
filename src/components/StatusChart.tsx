
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { JobApplication } from "@/services/api";

interface StatusChartProps {
  applications: JobApplication[];
}

const StatusChart = ({ applications }: StatusChartProps) => {
  // Count applications by status
  const statusCounts = applications.reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Prepare data for chart
  const chartData = [
    { name: "Applied", value: statusCounts["Applied"] || 0, color: "#3B82F6" },
    { name: "Interview", value: statusCounts["Interview"] || 0, color: "#FBBF24" },
    { name: "Offer", value: statusCounts["Offer"] || 0, color: "#10B981" },
    { name: "Rejected", value: statusCounts["Rejected"] || 0, color: "#EF4444" },
  ].filter((item) => item.value > 0); // Only show statuses that have applications

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-gray-500">No data to display</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} applications`, "Count"]} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatusChart;
