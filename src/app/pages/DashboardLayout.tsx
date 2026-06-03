import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { LayoutDashboard, FileText, Radar, Briefcase, GraduationCap, Settings, Bell, Menu, X } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore"; 

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  

  const { user } = useAuthStore(); 

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
    { icon: FileText, label: "My CV", path: "/dashboard/cv" },
    // { icon: Radar, label: "Skill Gap", path: "/dashboard/skills" },
    { icon: Briefcase, label: "Job Matches", path: "/dashboard/jobs" },
    { icon: GraduationCap, label: "Learning Path", path: "/dashboard/learning" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-primary" />
          </div>
          <span className="font-heading font-semibold">SkillAlign</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 cursor-pointer">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 z-40 h-screen w-64 border-r border-border bg-card flex flex-col transition-transform duration-300",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 hidden md:flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-primary" />
          </div>
          <span className="text-xl font-heading font-semibold">SkillAlign</span>
        </div>

        <div className="px-4 py-6 md:py-0 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-fill flex items-center justify-center font-semibold text-text-secondary uppercase">
            {getInitials(user?.name)}
          </div>
          <div className="overflow-hidden">
            <div className="font-medium text-sm truncate" title={user?.name}>
              {user?.name || "Pengguna"}
            </div>
            <div className="text-xs text-text-secondary truncate" title={user?.email}>
              {user?.email || "email@belum-terdaftar.com"}
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname === '/dashboard' && item.path === '/dashboard');
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-secondary/10 text-primary border-l-[3px] border-l-primary" 
                    : "text-text-secondary hover:bg-surface-fill hover:text-foreground border-l-[3px] border-transparent"
                )}
              >
                <item.icon size={18} className={isActive ? "text-primary" : ""} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur sticky top-0 z-30 px-6 flex items-center justify-between">
          <h1 className="text-lg font-medium text-foreground">
            {navItems.find(i => i.path === location.pathname)?.label || "Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary hidden sm:inline-block">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
            <button className="relative p-2 text-text-secondary hover:text-foreground rounded-full hover:bg-surface-fill transition-colors cursor-pointer">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            </button>
          </div>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
