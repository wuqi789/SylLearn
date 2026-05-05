"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";

interface MasteryDataPoint {
  dimension: string;
  value: number;
  fullMark?: number;
}

interface MasteryChartProps {
  data: MasteryDataPoint[];
  className?: string;
}

export function MasteryChart({ data, className }: MasteryChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    fullMark: d.fullMark ?? 100,
  }));

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="border-b border-border/50 px-4 py-3">
        <h3 className="text-sm font-semibold">掌握度分析</h3>
      </div>
      <div className="flex items-center justify-center p-4">
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="72%">
            <PolarGrid
              stroke="hsl(var(--border))"
              strokeDasharray="3 3"
              strokeOpacity={0.5}
            />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{
                fontSize: 11,
                fill: "hsl(var(--muted-foreground))",
              }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
                color: "hsl(var(--foreground))",
              }}
              formatter={(value) => [`${value}%`, "掌握度"]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
