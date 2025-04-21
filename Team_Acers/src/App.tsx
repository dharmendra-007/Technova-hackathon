
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentsPage from "./pages/teacher/StudentsPage";
import AssessmentsPage from "./pages/teacher/AssessmentsPage";
import AnalyticsPage from "./pages/teacher/AnalyticsPage";
import SettingsPage from "./pages/teacher/SettingsPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProgress from "./pages/student/StudentProgress";
import StudentProfile from "./pages/student/StudentProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Teacher Routes */}
            <Route 
              path="/teacher-dashboard" 
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <TeacherDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/teacher-dashboard/students" 
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <StudentsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/teacher-dashboard/assessments" 
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <AssessmentsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/teacher-dashboard/analytics" 
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <AnalyticsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/teacher-dashboard/settings" 
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <SettingsPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Student Routes */}
            <Route 
              path="/student-dashboard" 
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student-dashboard/progress" 
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentProgress />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student-dashboard/profile" 
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentProfile />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
