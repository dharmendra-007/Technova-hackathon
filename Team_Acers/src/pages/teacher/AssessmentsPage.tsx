
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { mockAssessments, mockModules } from "@/utils/mockData";
import { format } from "date-fns";
import { FileText, Plus } from "lucide-react";

const AssessmentsPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Assessment
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Assessments</TabsTrigger>
            <TabsTrigger value="midterm">Midterm</TabsTrigger>
            <TabsTrigger value="endterm">Final Exam</TabsTrigger>
            <TabsTrigger value="quiz">Quizzes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockAssessments.map((assessment) => (
                <Card key={assessment.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>{assessment.name}</CardTitle>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <CardDescription>
                      {format(new Date(assessment.date), "MMMM d, yyyy")}
                    </CardDescription>
                  </CardHeader>
                  <div className="p-6 pt-0">
                    <dl className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Type</dt>
                        <dd className="font-medium capitalize">{assessment.type.replace('-', ' ')}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Total Marks</dt>
                        <dd className="font-medium">{assessment.totalMarks}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Questions</dt>
                        <dd className="font-medium">{assessment.questions.length}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Modules</dt>
                        <dd className="font-medium">
                          {new Set(assessment.questions.map(q => q.moduleId)).size}
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-6 flex items-center gap-2">
                      <Button className="w-full" variant="outline">
                        View
                      </Button>
                      <Button className="w-full">Edit</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="midterm" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockAssessments
                .filter((a) => a.type === "mid-term")
                .map((assessment) => (
                  <Card key={assessment.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle>{assessment.name}</CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <CardDescription>
                        {format(new Date(assessment.date), "MMMM d, yyyy")}
                      </CardDescription>
                    </CardHeader>
                    <div className="p-6 pt-0">
                      <dl className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <dt className="text-muted-foreground">Type</dt>
                          <dd className="font-medium capitalize">{assessment.type.replace('-', ' ')}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Total Marks</dt>
                          <dd className="font-medium">{assessment.totalMarks}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Questions</dt>
                          <dd className="font-medium">{assessment.questions.length}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Modules</dt>
                          <dd className="font-medium">
                            {new Set(assessment.questions.map(q => q.moduleId)).size}
                          </dd>
                        </div>
                      </dl>
                      <div className="mt-6 flex items-center gap-2">
                        <Button className="w-full" variant="outline">
                          View
                        </Button>
                        <Button className="w-full">Edit</Button>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          {/* Similar structure for end-term and quiz tabs */}
          <TabsContent value="endterm" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockAssessments
                .filter((a) => a.type === "end-term")
                .map((assessment) => (
                  <Card key={assessment.id} className="overflow-hidden">
                    {/* Same card structure as above */}
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle>{assessment.name}</CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <CardDescription>
                        {format(new Date(assessment.date), "MMMM d, yyyy")}
                      </CardDescription>
                    </CardHeader>
                    <div className="p-6 pt-0">
                      <dl className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <dt className="text-muted-foreground">Type</dt>
                          <dd className="font-medium capitalize">{assessment.type.replace('-', ' ')}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Total Marks</dt>
                          <dd className="font-medium">{assessment.totalMarks}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Questions</dt>
                          <dd className="font-medium">{assessment.questions.length}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Modules</dt>
                          <dd className="font-medium">
                            {new Set(assessment.questions.map(q => q.moduleId)).size}
                          </dd>
                        </div>
                      </dl>
                      <div className="mt-6 flex items-center gap-2">
                        <Button className="w-full" variant="outline">
                          View
                        </Button>
                        <Button className="w-full">Edit</Button>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="quiz" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockAssessments
                .filter((a) => a.type === "quiz")
                .map((assessment) => (
                  <Card key={assessment.id} className="overflow-hidden">
                    {/* Same card structure as above */}
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle>{assessment.name}</CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <CardDescription>
                        {format(new Date(assessment.date), "MMMM d, yyyy")}
                      </CardDescription>
                    </CardHeader>
                    <div className="p-6 pt-0">
                      <dl className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <dt className="text-muted-foreground">Type</dt>
                          <dd className="font-medium capitalize">{assessment.type.replace('-', ' ')}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Total Marks</dt>
                          <dd className="font-medium">{assessment.totalMarks}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Questions</dt>
                          <dd className="font-medium">{assessment.questions.length}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Modules</dt>
                          <dd className="font-medium">
                            {new Set(assessment.questions.map(q => q.moduleId)).size}
                          </dd>
                        </div>
                      </dl>
                      <div className="mt-6 flex items-center gap-2">
                        <Button className="w-full" variant="outline">
                          View
                        </Button>
                        <Button className="w-full">Edit</Button>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AssessmentsPage;
