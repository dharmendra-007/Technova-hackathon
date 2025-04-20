
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserRole, useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock, User } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isRegistering) {
        await register(email, password, name, role);
      } else {
        await login(email, password);
        navigate(role === "teacher" ? "/teacher-dashboard" : "/student-dashboard");
      }
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-primary/20">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {isRegistering ? "Create Account" : "Sign In"}
        </CardTitle>
        <CardDescription className="text-center">
          {isRegistering 
            ? "Enter your details to register a new account" 
            : "Enter your credentials to access your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isRegistering}
                  disabled={isSubmitting}
                  className="pl-9"
                />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
                className="pl-9"
                minLength={6}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="teacher" id="teacher" disabled={isSubmitting} />
                <Label htmlFor="teacher">Teacher</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="student" disabled={isSubmitting} />
                <Label htmlFor="student">Student</Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting 
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
              : isRegistering 
                ? "Register" 
                : "Sign In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button 
          variant="link" 
          className="px-0" 
          onClick={() => setIsRegistering(!isRegistering)}
          disabled={isSubmitting}
        >
          {isRegistering 
            ? "Already have an account? Sign in" 
            : "Don't have an account? Register"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
