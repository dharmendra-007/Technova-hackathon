
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModulePerformance } from "@/utils/types";

interface ModulePerformanceChartProps {
  data: ModulePerformance[];
  title?: string;
  description?: string;
}

const ModulePerformanceChart: React.FC<ModulePerformanceChartProps> = ({ 
  data, 
  title = "Module Performance", 
  description = "Scores across different modules" 
}) => {
  const getBarColor = (status: string) => {
    switch (status) {
      case "strong":
        return "hsl(var(--success))";
      case "average":
        return "hsl(var(--warning))";
      case "weak":
        return "hsl(var(--destructive))";
      default:
        return "hsl(var(--primary))";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="moduleName" 
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 100]} 
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value) => {
                  // Handle different value types
                  const numValue = typeof value === 'number' ? value : Number(value);
                  return [`${numValue.toFixed(1)}%`, "Score"];
                }}
                labelFormatter={(label) => `Module: ${label}`}
              />
              <Bar dataKey="percentage" name="Score">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModulePerformanceChart;
