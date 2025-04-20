import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { fetchStudentDetails } from "@/services/teacherService";
import { Mark, fetchMarks, updateMarks } from "@/services/marksService";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, User, Mail, Phone, Home, Edit, Save, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";

interface StudentDetailsProps {
  studentId: string;
  isOpen: boolean;
  onClose: () => void;
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ studentId, isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [editingMarkId, setEditingMarkId] = React.useState<string | null>(null);
  const [editValues, setEditValues] = React.useState<{
    midSemMarks?: number;
    endSemMarks?: number;
    internalMarks?: number;
  }>({});

  const { data: studentDetails, isLoading, error } = useQuery({
    queryKey: ['studentDetails', studentId],
    queryFn: () => fetchStudentDetails(studentId),
    enabled: isOpen && !!studentId
  });

  const { data: marks } = useQuery({
    queryKey: ['studentMarks', studentId],
    queryFn: () => fetchMarks(studentId),
    enabled: isOpen && !!studentId
  });

  const updateMarksMutation = useMutation({
    mutationFn: (mark: Partial<Mark> & { id: string }) => updateMarks(mark),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentMarks', studentId] });
      queryClient.invalidateQueries({ queryKey: ['studentDetails', studentId] });
      toast.success("Marks updated successfully");
      setEditingMarkId(null);
      setEditValues({});
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update marks");
    }
  });

  const handleEditClick = (mark: Mark) => {
    setEditingMarkId(mark.id);
    setEditValues({
      midSemMarks: mark.midSemMarks,
      endSemMarks: mark.endSemMarks,
      internalMarks: mark.internalMarks
    });
  };

  const handleSaveClick = (markId: string) => {
    updateMarksMutation.mutate({
      id: markId,
      ...editValues
    });
  };

  const handleCancelClick = () => {
    setEditingMarkId(null);
    setEditValues({});
  };

  if (!isOpen) return null;

  return (
    <Sheet open={isOpen} onOpenChange={open => !open && onClose()}>
      <SheetContent className="w-[90%] sm:max-w-xl md:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Student Details</SheetTitle>
          <SheetDescription>
            View and manage student information, marks, and performance
          </SheetDescription>
        </SheetHeader>

        {isLoading && <div className="text-center py-8">Loading student details...</div>}
        {error && <div className="text-center py-8 text-red-500">Error loading student details. Please try again.</div>}

        {studentDetails && (
          <Tabs defaultValue="profile">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="marks">Marks</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{studentDetails.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>Reg. No: {studentDetails.registrationNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span>{studentDetails.email}</span>
                  </div>
                  {studentDetails.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <span>{studentDetails.phone}</span>
                    </div>
                  )}
                  {studentDetails.address && (
                    <div className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-muted-foreground" />
                      <span>{studentDetails.address}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Recent Assessments</CardTitle>
                </CardHeader>
                <CardContent>
                  {studentDetails.assessments.length > 0 ? (
                    <div className="space-y-3">
                      {studentDetails.assessments.map(assessment => (
                        <div key={assessment.id} className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <div className="font-medium">{assessment.name}</div>
                            <div className="text-sm text-muted-foreground">{assessment.date}</div>
                          </div>
                          <Badge variant={assessment.percentage >= 75 ? "default" : assessment.percentage >= 50 ? "outline" : "destructive"}>
                            {assessment.percentage.toFixed(1)}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-4">No assessments found</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="marks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Course Marks</CardTitle>
                </CardHeader>
                <CardContent>
                  {marks && marks.length > 0 ? (
                    <div className="space-y-4">
                      {marks.map((mark) => (
                        <div key={mark.id} className="border rounded-md p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">
                              {studentDetails.marks.find(m => m.courseId === mark.courseId)?.courseName || mark.courseId}
                            </h3>
                            {editingMarkId === mark.id ? (
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleCancelClick()}
                                  disabled={updateMarksMutation.isPending}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleSaveClick(mark.id)}
                                  disabled={updateMarksMutation.isPending}
                                >
                                  <Save className="h-4 w-4 mr-1" />
                                  Save
                                </Button>
                              </div>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditClick(mark)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit Marks
                              </Button>
                            )}
                          </div>
                          
                          {editingMarkId === mark.id ? (
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <Label htmlFor={`mid-sem-${mark.id}`}>Mid Semester</Label>
                                <Input
                                  id={`mid-sem-${mark.id}`}
                                  type="number"
                                  value={editValues.midSemMarks || ''}
                                  onChange={(e) => setEditValues({ ...editValues, midSemMarks: e.target.value ? parseFloat(e.target.value) : undefined })}
                                  min="0"
                                  max="100"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`end-sem-${mark.id}`}>End Semester</Label>
                                <Input
                                  id={`end-sem-${mark.id}`}
                                  type="number"
                                  value={editValues.endSemMarks || ''}
                                  onChange={(e) => setEditValues({ ...editValues, endSemMarks: e.target.value ? parseFloat(e.target.value) : undefined })}
                                  min="0"
                                  max="100"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`internal-${mark.id}`}>Internal</Label>
                                <Input
                                  id={`internal-${mark.id}`}
                                  type="number"
                                  value={editValues.internalMarks || ''}
                                  onChange={(e) => setEditValues({ ...editValues, internalMarks: e.target.value ? parseFloat(e.target.value) : undefined })}
                                  min="0"
                                  max="100"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <div className="text-sm text-muted-foreground">Mid Semester</div>
                                <div className="font-medium">{mark.midSemMarks !== undefined ? mark.midSemMarks : 'N/A'}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">End Semester</div>
                                <div className="font-medium">{mark.endSemMarks !== undefined ? mark.endSemMarks : 'N/A'}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Internal</div>
                                <div className="font-medium">{mark.internalMarks !== undefined ? mark.internalMarks : 'N/A'}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-4">No marks found for this student</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Performance Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={studentDetails.performance}
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
                            "Score"
                          ]}
                          labelFormatter={(label) => `Module: ${label}`}
                        />
                        <Bar 
                          dataKey="percentage" 
                          name="Score" 
                          fill={(entry) => {
                            if (entry.status === 'strong') return 'hsl(var(--success))';
                            if (entry.status === 'average') return 'hsl(var(--warning))';
                            return 'hsl(var(--destructive))';
                          }}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-6 space-y-3">
                    <h3 className="font-medium">Strengths & Weaknesses</h3>
                    <div className="space-y-2">
                      {studentDetails.performance.map((module) => (
                        <div key={module.moduleId} className="flex justify-between items-center p-2 border rounded-md">
                          <span>{module.moduleName}</span>
                          <Badge 
                            variant={
                              module.status === 'strong' 
                                ? 'default' 
                                : module.status === 'average' 
                                  ? 'outline' 
                                  : 'destructive'
                            }
                          >
                            {module.status === 'strong' 
                              ? 'Strong' 
                              : module.status === 'average' 
                                ? 'Average' 
                                : 'Needs Improvement'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        <div className="mt-6 flex justify-end">
          <SheetClose asChild>
            <Button onClick={onClose}>Close</Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default StudentDetails;
