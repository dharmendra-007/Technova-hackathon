
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, BookOpen, FileCheck, Award } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { mockModules, mockAssessments, getStudentModulePerformance } from "@/utils/mockData";
import ModulePerformanceChart from "@/components/charts/ModulePerformanceChart";
import RadarPerformanceChart from "@/components/charts/RadarPerformanceChart";
import { Button } from "@/components/ui/button";

const StudentDashboard = () => {
  const { user } = useAuth();
  const studentId = "s1"; // Default to the first student in our mock data
  const modulePerformance = getStudentModulePerformance(studentId);
  
  // Module with highest performance
  const strongestModule = [...modulePerformance].sort((a, b) => b.percentage - a.percentage)[0];
  
  // Module with lowest performance
  const weakestModule = [...modulePerformance].sort((a, b) => a.percentage - b.percentage)[0];
  
  // Calculate overall average
  const overallAverage = modulePerformance.reduce((acc, curr) => acc + curr.percentage, 0) / modulePerformance.length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
        </div>
        
        {/* Stats overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Modules</CardTitle>
              <Book className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockModules.length}</div>
              <p className="text-xs text-muted-foreground">Enrolled courses</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assessments</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAssessments.length}</div>
              <p className="text-xs text-muted-foreground">Completed assessments</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallAverage.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Overall performance</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Strongest</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{strongestModule?.moduleName}</div>
              <p className="text-xs text-muted-foreground">{strongestModule?.percentage.toFixed(1)}% performance</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ModulePerformanceChart 
            data={modulePerformance}
            title="Your Module Performance"
            description="Your scores across different modules"
          />
          
          <RadarPerformanceChart 
            data={modulePerformance}
            title="Performance Overview"
            description="Your strengths and areas to improve"
          />
        </div>
        
        {/* Module Summary Cards */}
        <h2 className="text-2xl font-bold mt-8 mb-4">Module Insights</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modulePerformance.map((module) => (
            <Card key={module.moduleId}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{module.moduleName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className={`text-2xl font-bold mb-2 ${
                    module.status === "strong" 
                      ? "text-success" 
                      : module.status === "average" 
                      ? "text-warning" 
                      : "text-destructive"
                  }`}
                >
                  {module.percentage.toFixed(1)}%
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5 mb-4">
                  <div 
                    className={`h-2.5 rounded-full ${
                      module.status === "strong" 
                        ? "bg-success" 
                        : module.status === "average" 
                        ? "bg-warning" 
                        : "bg-destructive"
                    }`}
                    style={{ width: `${module.percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {module.status === "strong" 
                    ? "You're doing great in this module!" 
                    : module.status === "average" 
                    ? "You're making good progress, but there's room for improvement." 
                    : "This module needs attention. Focus on improving your understanding."}
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  View Detailed Analysis
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentDashboard;
