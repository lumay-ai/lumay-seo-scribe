import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Tags, 
  Users, 
  Settings,
  LogOut,
  Loader2,
  ChevronLeft,
  BarChart3,
  User,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Sparkles, label: "AI Generator", href: "/admin/ai-generator" },
  { icon: FileText, label: "Posts", href: "/admin/posts" },
  { icon: FolderOpen, label: "Categories", href: "/admin/categories" },
  { icon: Tags, label: "Tags", href: "/admin/tags" },
  { icon: Users, label: "Team", href: "/admin/team" },
  { icon: User, label: "Profile", href: "/admin/profile" },
];

const AdminLayout = () => {
  const { user, isAuthor, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAuthor) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
            <span className="text-sm">Back to site</span>
          </Link>
          <h1 className="font-heading text-xl font-bold text-heading mt-4">
            Lumay<span className="text-primary">.</span> Admin
          </h1>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== "/admin" && location.pathname.startsWith(item.href));
              
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
