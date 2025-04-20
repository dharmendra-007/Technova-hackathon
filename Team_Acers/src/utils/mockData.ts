import { Student, Module, Assessment, Question, StudentAssessment, ModulePerformance } from "./types";

export const mockModules: Module[] = [
  { id: "m1", name: "Data Structures", description: "Fundamental data structures and algorithms" },
  { id: "m2", name: "Web Development", description: "Modern web development techniques" },
  { id: "m3", name: "Database Systems", description: "Database design and SQL" },
  { id: "m4", name: "Computer Networks", description: "Network protocols and architecture" },
  { id: "m5", name: "Software Engineering", description: "Software development methodologies" },
];

export const mockStudents: Student[] = [
  { id: "s1", name: "Sandeep", registrationNumber: "CS001", email: "sandeep@gmail.com" },
  { id: "s2", name: "Yograj", registrationNumber: "CS002", email: "yograj@gmail.com" },
  { id: "s3", name: "Subha", registrationNumber: "CS003", email: "subha@gmail.com" },
  { id: "s4", name: "Soumya", registrationNumber: "CS004", email: "soumya@gmail.com" },
  { id: "s5", name: "Deva", registrationNumber: "CS005", email: "deva@gmail.com" },
];

export const mockQuestions: Question[] = [
  { id: "q1", text: "Question 1a", marks: 5, moduleId: "m1" },
  { id: "q2", text: "Question 1b", marks: 5, moduleId: "m1" },
  { id: "q3", text: "Question 2a", marks: 10, moduleId: "m2" },
  { id: "q4", text: "Question 2b", marks: 10, moduleId: "m3" },
  { id: "q5", text: "Question 3", marks: 15, moduleId: "m4" },
  { id: "q6", text: "Question 4", marks: 15, moduleId: "m5" },
];

export const mockAssessments: Assessment[] = [
  {
    id: "a1",
    name: "Midterm Exam",
    type: "mid-term",
    totalMarks: 50,
    date: "2023-03-15",
    questions: mockQuestions.slice(0, 4),
  },
  {
    id: "a2",
    name: "Final Exam",
    type: "end-term",
    totalMarks: 100,
    date: "2023-06-10",
    questions: mockQuestions,
  },
  {
    id: "a3",
    name: "Quiz 1",
    type: "quiz",
    totalMarks: 20,
    date: "2023-02-20",
    questions: mockQuestions.slice(0, 2),
  },
];

export const mockStudentAssessments: StudentAssessment[] = [
  {
    id: "sa1",
    studentId: "s1",
    assessmentId: "a1",
    date: "2023-03-15",
    scores: [
      { questionId: "q1", score: 2 }, // 40% of 5
      { questionId: "q2", score: 3 }, // 60% of 5
      { questionId: "q3", score: 5 }, // 50% of 10
      { questionId: "q4", score: 4 }, // 40% of 10
    ],
  },
  {
    id: "sa2",
    studentId: "s1",
    assessmentId: "a2",
    date: "2023-06-10",
    scores: [
      { questionId: "q1", score: 2 }, // 40% of 5
      { questionId: "q2", score: 3 }, // 60% of 5
      { questionId: "q3", score: 5 }, // 50% of 10
      { questionId: "q4", score: 5 }, // 50% of 10
      { questionId: "q5", score: 8 }, // 53% of 15
      { questionId: "q6", score: 7 }, // 47% of 15
    ],
  },
  {
    id: "sa3",
    studentId: "s1",
    assessmentId: "a3",
    date: "2023-02-20",
    scores: [
      { questionId: "q1", score: 2 }, // 40% of 5
      { questionId: "q2", score: 3 }, // 60% of 5
    ],
  },
];

export const getStudentModulePerformance = (studentId: string): ModulePerformance[] => {
  // Get all assessments for this student
  const studentAssessments = mockStudentAssessments.filter(sa => sa.studentId === studentId);
  
  // Calculate performance for each module
  return mockModules.map(module => {
    let totalScore = 0;
    let totalPossible = 0;
    
    // For each assessment the student took
    studentAssessments.forEach(assessment => {
      // Get the assessment details
      const assessmentDetails = mockAssessments.find(a => a.id === assessment.assessmentId);
      
      if (assessmentDetails) {
        // Filter questions for this module
        const moduleQuestions = assessmentDetails.questions.filter(q => q.moduleId === module.id);
        
        moduleQuestions.forEach(question => {
          // Find the student's score for this question
          const scoreEntry = assessment.scores.find(s => s.questionId === question.id);
          
          if (scoreEntry) {
            totalScore += scoreEntry.score;
            totalPossible += question.marks;
          }
        });
      }
    });
    
    // Calculate percentage
    const percentage = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;
    
    // Determine status
    let status: "strong" | "average" | "weak";
    if (percentage >= 75) {
      status = "strong";
    } else if (percentage >= 50) {
      status = "average";
    } else {
      status = "weak";
    }
    
    return {
      moduleId: module.id,
      moduleName: module.name,
      percentage,
      status,
    };
  });
};

export const getClassModulePerformance = (): {moduleId: string, moduleName: string, average: number}[] => {
  return mockModules.map(module => {
    let totalPercentage = 0;
    let studentCount = 0;
    
    mockStudents.forEach(student => {
      const performance = getStudentModulePerformance(student.id);
      const modulePerf = performance.find(p => p.moduleId === module.id);
      
      if (modulePerf) {
        totalPercentage += modulePerf.percentage;
        studentCount++;
      }
    });
    
    return {
      moduleId: module.id,
      moduleName: module.name,
      average: studentCount > 0 ? totalPercentage / studentCount : 0,
    };
  });
};
