
import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-secondary/10">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={user?.role === "teacher" ? "/teacher-dashboard" : "/student-dashboard"} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/10 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">EduTrack</h1>
        <p className="text-muted-foreground">Track academic progress and identify learning gaps</p>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Use the demo login buttons below to easily log in without creating an account</p>
        </div>
      </div>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
