
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Download, Users } from "lucide-react";
import { getClassModulePerformance, mockStudents, getStudentModulePerformance } from "@/utils/mockData";
import { Badge } from "@/components/ui/badge";
import { ModulePerformance } from "@/utils/types";
import ModulePerformanceChart from "@/components/charts/ModulePerformanceChart";
import RadarPerformanceChart from "@/components/charts/RadarPerformanceChart";

const AnalyticsPage = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  
  // Get class performance data from mockData
  const classPerformance = getClassModulePerformance().map(item => ({
    moduleId: item.moduleId,
    moduleName: item.moduleName,
    percentage: item.average,
    status: determineStatus(item.average)
  }));
  
  // Get individual student performance if a student is selected
  const studentPerformance = selectedStudent !== "all" 
    ? getStudentModulePerformance(selectedStudent)
    : [];
  
  // Calculate performance distribution
  const performanceDistribution = calculatePerformanceDistribution();
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Analytics Insights</AlertTitle>
          <AlertDescription>
            This page provides performance analytics across all modules and students.
            Use the filters to view specific student data.
          </AlertDescription>
        </Alert>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStudents.length}</div>
              <div className="text-xs text-muted-foreground">Registered in the system</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Class Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(classPerformance.reduce((acc, curr) => acc + curr.percentage, 0) / classPerformance.length).toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Across all modules</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Performance Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-500 text-white">
                  {performanceDistribution.strong}% Strong
                </Badge>
                <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                  {performanceDistribution.average}% Average
                </Badge>
                <Badge variant="destructive">
                  {performanceDistribution.weak}% Weak
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex items-center gap-4">
          <Select 
            value={selectedStudent} 
            onValueChange={setSelectedStudent}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select Student" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students (Class Average)</SelectItem>
              {mockStudents.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name} ({student.registrationNumber})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedStudent !== "all" && (
            <Button
              variant="ghost"
              onClick={() => setSelectedStudent("all")}
            >
              Reset to Class View
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Performance Overview</TabsTrigger>
            <TabsTrigger value="modules">Module Analysis</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="radar">Skill Radar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedStudent === "all" 
                    ? "Class Performance Overview" 
                    : `Performance Overview: ${mockStudents.find(s => s.id === selectedStudent)?.name}`}
                </CardTitle>
                <CardDescription>
                  {selectedStudent === "all"
                    ? "Average scores across all students for each module"
                    : "Individual student performance across modules"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={selectedStudent === "all" ? classPerformance : studentPerformance}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 20,
                        bottom: 50,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="moduleName" 
                        angle={-45}
                        textAnchor="end"
                        height={70}
                        interval={0}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value) => {
                          const numValue = typeof value === 'number' ? value : Number(value);
                          return [`${numValue.toFixed(1)}%`, "Score"];
                        }}
                      />
                      <Bar 
                        dataKey="percentage" 
                        name="Score" 
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="modules" className="space-y-4">
            <ModulePerformanceChart 
              data={selectedStudent === "all" ? classPerformance : studentPerformance}
              title={selectedStudent === "all" ? "Class Module Performance" : "Student Module Performance"}
              description="Performance breakdown by module with status indicators"
            />
          </TabsContent>
          
          <TabsContent value="distribution" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
                <CardDescription>Breakdown of student performance categories</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-[300px] w-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Strong", value: performanceDistribution.strong },
                          { name: "Average", value: performanceDistribution.average },
                          { name: "Weak", value: performanceDistribution.weak },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="hsl(var(--success))" />
                        <Cell fill="hsl(var(--warning))" />
                        <Cell fill="hsl(var(--destructive))" />
                      </Pie>
                      <Legend />
                      <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {selectedStudent === "all" && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockStudents.map((student) => {
                  const performance = getStudentModulePerformance(student.id);
                  const average = (performance.reduce((acc, curr) => acc + curr.percentage, 0) / performance.length);
                  
                  return (
                    <Card key={student.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-base">{student.name}</CardTitle>
                          <Badge variant={determineBadgeVariant(average)}>
                            {average.toFixed(1)}%
                          </Badge>
                        </div>
                        <CardDescription>{student.registrationNumber}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{student.email}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          className="mt-2 w-full text-sm"
                          onClick={() => setSelectedStudent(student.id)}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="radar" className="space-y-4">
            <RadarPerformanceChart 
              data={selectedStudent === "all" ? classPerformance : studentPerformance}
              title={selectedStudent === "all" ? "Class Competency Radar" : "Student Competency Radar"}
              description="Visualization of strengths and weaknesses across modules"
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

// Helper functions
const determineStatus = (score: number): "strong" | "average" | "weak" => {
  if (score >= 75) return "strong";
  if (score >= 50) return "average";
  return "weak";
};

const calculatePerformanceDistribution = () => {
  const allStudentPerformances = mockStudents.flatMap(student => 
    getStudentModulePerformance(student.id)
  );
  
  const strong = Math.round((allStudentPerformances.filter(p => p.status === "strong").length / allStudentPerformances.length) * 100);
  const average = Math.round((allStudentPerformances.filter(p => p.status === "average").length / allStudentPerformances.length) * 100);
  const weak = Math.round((allStudentPerformances.filter(p => p.status === "weak").length / allStudentPerformances.length) * 100);
  
  return { strong, average, weak };
};

const determineBadgeVariant = (score: number) => {
  if (score >= 75) return "default";
  if (score >= 50) return "outline";
  return "destructive";
};

export default AnalyticsPage;
