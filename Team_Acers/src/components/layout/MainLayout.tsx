
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Home,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const teacherNavItems = [
    { label: "Dashboard", icon: <Home className="h-5 w-5" />, path: "/teacher-dashboard" },
    { label: "Students", icon: <Users className="h-5 w-5" />, path: "/teacher-dashboard/students" },
    { label: "Assessments", icon: <FileText className="h-5 w-5" />, path: "/teacher-dashboard/assessments" },
    { label: "Analytics", icon: <BarChart3 className="h-5 w-5" />, path: "/teacher-dashboard/analytics" },
    { label: "Settings", icon: <Settings className="h-5 w-5" />, path: "/teacher-dashboard/settings" },
  ];

  const studentNavItems = [
    { label: "Dashboard", icon: <Home className="h-5 w-5" />, path: "/student-dashboard" },
    { label: "My Progress", icon: <BarChart3 className="h-5 w-5" />, path: "/student-dashboard/progress" },
    { label: "Profile", icon: <User className="h-5 w-5" />, path: "/student-dashboard/profile" },
  ];

  const navItems = user?.role === "teacher" ? teacherNavItems : studentNavItems;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 z-50 bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 lg:left-0",
          sidebarOpen ? "left-0" : "-left-64"
        )}
        style={{ width: "250px" }}
      >
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h1 className="font-bold text-xl">EduTrack</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="lg:hidden text-sidebar-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{user?.name}</span>
              <span className="text-xs text-sidebar-foreground/70 capitalize">{user?.role}</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn(
        "flex-1 transition-all duration-300",
        sidebarOpen ? "lg:ml-[250px]" : "lg:ml-0"
      )}>
        {/* Header */}
        <header className="h-16 border-b bg-background flex items-center gap-4 px-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="text-lg font-medium">
            {user?.role === "teacher" ? "Teacher Portal" : "Student Portal"}
          </div>
        </header>
        
        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
