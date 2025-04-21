
import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModulePerformance } from "@/utils/types";

interface RadarPerformanceChartProps {
  data: ModulePerformance[];
  title?: string;
  description?: string;
}

const RadarPerformanceChart: React.FC<RadarPerformanceChartProps> = ({ 
  data, 
  title = "Performance Radar", 
  description = "Overall performance across modules" 
}) => {
  // Transform data for radar chart
  const radarData = data.map(item => ({
    module: item.moduleName,
    score: item.percentage,
    fullMark: 100,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="module" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RadarPerformanceChart;
