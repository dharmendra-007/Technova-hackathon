
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart3, Users, FileText, TrendingUp } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="border-b bg-background">
        <div className="container mx-auto flex justify-between items-center h-16 px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h1 className="font-bold text-xl">EduTrack</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Track Student Progress with <span className="text-primary">Precision</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Map exam questions to course outcomes, identify learning gaps, and provide actionable insights through visual analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link to="/login">Teachers Portal</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Student Dashboard</Link>
            </Button>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-muted rounded-lg p-8 max-w-md">
            <BarChart3 className="h-64 w-full text-primary opacity-20" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Key Features</h2>
            <p className="text-muted-foreground mt-2">Tools to enhance teaching and learning outcomes</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Question-Module Mapping</h3>
              <p className="text-muted-foreground">
                Map exam questions to specific course modules and outcomes for targeted assessment.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Visual Analytics</h3>
              <p className="text-muted-foreground">
                Interactive charts and dashboards that visualize student performance across modules.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Track student performance over time with detailed module-wise analytics.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Student Management</h3>
              <p className="text-muted-foreground">
                Easily add, edit, and organize student information and assessment data.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Assessment Creation</h3>
              <p className="text-muted-foreground">
                Create and manage various types of assessments with flexible question mapping.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Learning Gap Analysis</h3>
              <p className="text-muted-foreground">
                Identify and address learning gaps with module-specific performance insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to enhance academic outcomes?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Start using EduTrack today to gain valuable insights into student performance and improve teaching effectiveness.
        </p>
        <Button size="lg" asChild>
          <Link to="/login">Get Started Now</Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h1 className="font-bold text-xl">EduTrack</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 EduTrack. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
