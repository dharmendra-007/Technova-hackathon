
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarIcon, Download, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import RadarPerformanceChart from "@/components/charts/RadarPerformanceChart";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { getStudentModulePerformance, mockStudentAssessments, mockAssessments } from "@/utils/mockData";
import { StudentAssessment, ModulePerformance } from "@/utils/types";

const StudentProgress = () => {
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  // Use the function to get student module performance for the first student
  const studentModulePerformance = getStudentModulePerformance("s1");
  
  // Create a processed version of student assessments with additional fields
  const processedAssessments = mockStudentAssessments.map(assessment => {
    const assessmentDetails = mockAssessments.find(a => a.id === assessment.assessmentId);
    
    // Calculate total score as a percentage
    const totalScore = assessment.scores.reduce((sum, item) => sum + item.score, 0);
    const totalPossible = assessmentDetails ? assessmentDetails.totalMarks : 100;
    const scorePercentage = (totalScore / totalPossible) * 100;
    
    return {
      ...assessment,
      name: assessmentDetails?.name || "Unnamed Assessment",
      moduleId: assessmentDetails?.questions[0]?.moduleId || "",
      moduleName: assessmentDetails?.questions[0]?.moduleId || "",
      scorePercentage,
      type: assessmentDetails?.type || "quiz"
    };
  });
  
  // Filter assessments based on selected module and date
  const filteredAssessments = processedAssessments.filter((assessment) => {
    const moduleMatch = selectedModule === "all" || assessment.moduleId === selectedModule;
    const dateMatch = !date || (assessment.date && new Date(assessment.date).toDateString() === date.toDateString());
    return moduleMatch && dateMatch;
  });
  
  // Get trend data for line chart
  const trendData = processedAssessments
    .sort((a, b) => {
      if (a.date && b.date) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return 0;
    })
    .map((assessment) => ({
      name: assessment.name,
      score: assessment.scorePercentage,
      date: assessment.date || "",
    }));
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">My Progress</h1>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overall Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(studentModulePerformance.reduce((acc, curr) => acc + curr.percentage, 0) / 
                  studentModulePerformance.length).toFixed(1)}%
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant={determinePerformanceBadgeVariant(75)}>
                  {determinePerformanceLabel(75)}
                </Badge>
                <span className="text-xs text-muted-foreground">Across all modules</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Strongest Module</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {findStrongestModule(studentModulePerformance).moduleName}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="default" className="bg-green-500">
                  {findStrongestModule(studentModulePerformance).percentage.toFixed(1)}%
                </Badge>
                <span className="text-xs text-muted-foreground">Keep up the good work!</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Needs Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {findWeakestModule(studentModulePerformance).moduleName}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="destructive">
                  {findWeakestModule(studentModulePerformance).percentage.toFixed(1)}%
                </Badge>
                <span className="text-xs text-muted-foreground">Focus on this area</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="modules">
          <TabsList>
            <TabsTrigger value="modules">Module Performance</TabsTrigger>
            <TabsTrigger value="assessments">Assessment Scores</TabsTrigger>
            <TabsTrigger value="trends">Performance Trends</TabsTrigger>
            <TabsTrigger value="radar">Skill Radar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="modules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Module Performance</CardTitle>
                <CardDescription>Your performance across different modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={studentModulePerformance}
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
          
          <TabsContent value="assessments" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-medium">Assessment Scores</h3>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Select 
                  value={selectedModule} 
                  onValueChange={setSelectedModule}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modules</SelectItem>
                    {studentModulePerformance.map((module) => (
                      <SelectItem key={module.moduleId} value={module.moduleId}>
                        {module.moduleName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal w-[200px]",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Filter by date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                {(selectedModule !== "all" || date) && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectedModule("all");
                      setDate(undefined);
                    }}
                    className="gap-1"
                  >
                    <Filter className="h-4 w-4" />
                    Clear filters
                  </Button>
                )}
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAssessments.length > 0 ? (
                filteredAssessments.map((assessment, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-base">{assessment.name}</CardTitle>
                        <Badge variant={determinePerformanceBadgeVariant(assessment.scorePercentage)}>
                          {assessment.scorePercentage.toFixed(1)}%
                        </Badge>
                      </div>
                      <CardDescription>{assessment.moduleName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{assessment.date || "N/A"}</span>
                        </div>
                        <div>
                          <span className="font-medium">{assessment.type}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-6 text-muted-foreground">
                  No assessments found matching your filters.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Your score patterns over different assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={trendData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 20,
                        bottom: 50,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="name" 
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
                        labelFormatter={(name) => {
                          const assessment = trendData.find(a => a.name === name);
                          return `${name} (${assessment?.date || "N/A"})`;
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        name="Score" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="radar" className="space-y-4">
            <RadarPerformanceChart 
              data={studentModulePerformance} 
              title="Module Competency Radar"
              description="Visualization of your strengths and weaknesses across modules"
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

// Helper functions
const determinePerformanceBadgeVariant = (score: number) => {
  if (score >= 80) return "default";
  if (score >= 70) return "default";
  if (score >= 60) return "outline";
  return "destructive";
};

const determinePerformanceLabel = (score: number) => {
  if (score >= 80) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 60) return "Average";
  return "Needs Improvement";
};

const findStrongestModule = (modules: ModulePerformance[]) => {
  return modules.reduce((strongest, current) => 
    current.percentage > strongest.percentage ? current : strongest, 
    modules[0]
  );
};

const findWeakestModule = (modules: ModulePerformance[]) => {
  return modules.reduce((weakest, current) => 
    current.percentage < weakest.percentage ? current : weakest, 
    modules[0]
  );
};

export default StudentProgress;
