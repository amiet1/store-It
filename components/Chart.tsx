"use client";

import {
  RadialBarChart,
  RadialBar,
  PolarGrid,
  PolarRadiusAxis,
  Label,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { convertFileSize } from "@/lib/utils";

interface ChartProps {
  used: number;
  total?: number; // optional, defaults to 2GB
}

export const Chart = ({
  used = 0,
  total = 2 * 1024 * 1024 * 1024,
}: ChartProps) => {
  const available = total - used;
  const percentageUsed = total ? Math.round((used / total) * 100) : 0;

  const chartData = [
    { name: "Used", value: used, fill: "white" },
    { name: "Available", value: available, fill: "#55555555" },
  ];

  return (
    <Card className="chart">
      <CardContent className="flex-1 p-0">
        <RadialBarChart
          width={250}
          height={250}
          innerRadius={80}
          outerRadius={110}
          data={chartData}
          startAngle={90}
          endAngle={-270} // full circle
        >
          <PolarGrid radialLines={false} />
          <RadialBar dataKey="value" cornerRadius={10} background={true} />
          <PolarRadiusAxis tick={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan className="chart-total-percentage" fontSize={24}>
                        {percentageUsed}%
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-white/70"
                        fontSize={12}
                      >
                        Space used
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </CardContent>

      <CardHeader className="chart-details">
        <CardTitle className="chart-title">Available Storage</CardTitle>
        <CardDescription className="chart-description">
          {convertFileSize(used)} / {convertFileSize(total)}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default Chart;
