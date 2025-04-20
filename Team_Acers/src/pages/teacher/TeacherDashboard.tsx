
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, FileText, TrendingUp } from "lucide-react";
import { mockStudents, mockAssessments, getClassModulePerformance } from "@/utils/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const TeacherDashboard = () => {
  const classPerformance = getClassModulePerformance();

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
        
        {/* Stats overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStudents.length}</div>
              <p className="text-xs text-muted-foreground">Registered students</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assessments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAssessments.length}</div>
              <p className="text-xs text-muted-foreground">Created assessments</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(classPerformance.reduce((acc, curr) => acc + curr.average, 0) / classPerformance.length).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Across all modules</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Analytics</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classPerformance.length}</div>
              <p className="text-xs text-muted-foreground">Module analytics available</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Class Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Class Performance</CardTitle>
            <CardDescription>Average scores across different modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={classPerformance}
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
                    tickFormatter={(value) => `${typeof value === 'number' ? value : Number(value)}%`}
                  />
                  <Tooltip 
                    formatter={(value) => [
                      `${typeof value === 'number' ? value.toFixed(1) : Number(value).toFixed(1)}%`, 
                      "Average Score"
                    ]}
                    labelFormatter={(label) => `Module: ${label}`}
                  />
                  <Bar dataKey="average" name="Average Score" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-md p-3 transition-all hover:bg-accent">
                <div className="rounded-full bg-primary/20 p-2">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">New assessment created</p>
                  <p className="text-xs text-muted-foreground">Final Exam - {mockAssessments[1].date}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 rounded-md p-3 transition-all hover:bg-accent">
                <div className="rounded-full bg-primary/20 p-2">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Student scores updated</p>
                  <p className="text-xs text-muted-foreground">5 students - Midterm Exam</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 rounded-md p-3 transition-all hover:bg-accent">
                <div className="rounded-full bg-primary/20 p-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Analytics reports generated</p>
                  <p className="text-xs text-muted-foreground">Module performance reports available</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default TeacherDashboard;
