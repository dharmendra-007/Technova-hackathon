
export interface Student {
  id: string;
  name: string;
  registrationNumber: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface Module {
  id: string;
  name: string;
  description: string;
}

export interface Question {
  id: string;
  text: string;
  marks: number;
  moduleId: string;
}

export interface Assessment {
  id: string;
  name: string;
  type: "mid-term" | "end-term" | "quiz";
  totalMarks: number;
  date: string;
  questions: Question[];
}

export interface StudentAssessment {
  id: string;
  studentId: string;
  assessmentId: string;
  date: string;
  scores: {
    questionId: string;
    score: number;
  }[];
}

export interface ModulePerformance {
  moduleId: string;
  moduleName: string;
  percentage: number;
  status: "strong" | "average" | "weak";
}

export interface TeacherSettings {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  department?: string;
  bio?: string;
  profilePicture?: string;
  notificationPreferences: {
    emailNotifications: boolean;
    assessmentReminders: boolean;
    studentUpdates: boolean;
  };
  theme: "light" | "dark" | "system";
  language: string;
}

export interface StudentDetails {
  id: string;
  name: string;
  registrationNumber: string;
  email: string;
  phone?: string;
  address?: string;
  marks: {
    courseId: string;
    courseName: string;
    midSemMarks?: number;
    endSemMarks?: number;
    internalMarks?: number;
    totalPercentage: number;
  }[];
  performance: ModulePerformance[];
  assessments: {
    id: string;
    name: string;
    date: string;
    score: number;
    totalMarks: number;
    percentage: number;
  }[];
}

// Database types for mapping Supabase responses
export interface AssessmentDB {
  id: string;
  name: string;
  type: "mid-term" | "end-term" | "quiz";
  total_marks: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface AssessmentQuestionDB {
  id: string;
  assessment_id: string;
  text: string;
  marks: number;
  module_id: string;
  created_at: string;
  updated_at: string;
}
