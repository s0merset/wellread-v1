import { Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  Book,
  Heart,
  PenLine,
  Users,
  Settings,
  Bell,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Book, label: "My Books", href: "/dashboard/books" },
  { icon: Heart, label: "Favorites", href: "/dashboard/favorites" },
  { icon: PenLine, label: "Reviews", href: "/dashboard/reviews" },
  { icon: Users, label: "Friends", href: "/dashboard/friends" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

const DashboardSidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-72 border-r border-surface-highlight bg-card min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-surface-highlight">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <BookOpen className="size-6" />
          </div>
          <span className="text-xl font-bold">Bookworm</span>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-surface-highlight">
        <div className="flex items-center gap-2">
          <Button className="flex-1 gap-2">
            <Plus className="size-4" />
            Log Book
          </Button>
          <Button variant="outline" size="icon" className="border-surface-highlight">
            <Bell className="size-4" />
          </Button>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-surface-highlight">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-lg font-bold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold truncate">Alex Readmore</h3>
            <p className="text-sm text-muted-foreground truncate">@alexreads</p>
          </div>
        </div>

        <div className="flex justify-between mt-4 text-center">
          <div>
            <p className="text-lg font-bold">42</p>
            <p className="text-xs text-muted-foreground">Read</p>
          </div>
          <div>
            <p className="text-lg font-bold">128</p>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
          <div>
            <p className="text-lg font-bold">96</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
        </div>
      </div>

      {/* Reading Challenge */}
      <div className="p-4 border-b border-surface-highlight">
        <div className="rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 p-4">
          <h4 className="font-bold text-sm mb-2">Reading Challenge</h4>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-black">24</span>
            <span className="text-muted-foreground text-sm">of 50 books</span>
          </div>
          <Progress value={48} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground">
            You're 2 books ahead of schedule!
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:bg-surface-highlight hover:text-foreground"
                  )}
                >
                  <item.icon className="size-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;