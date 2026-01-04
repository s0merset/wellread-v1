import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import CurrentlyReading from "@/components/dashboard/CurrentlyReading";
import FriendActivity from "@/components/dashboard/FriendActivity";
import RecommendedBooks from "@/components/dashboard/RecommendedBooks";
import NavBar from "@/components/dashboard/Navbar";
import { Bell, Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Dashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Desktop Sidebar */}
     <div className="fixed top-0 left-0 right-0 z-10">
      <NavBar />
     </div>

     <div className="flex flex-1 w-full pt-16">
      <DashboardSidebar />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 border-b border-surface-highlight bg-background/95 backdrop-blur-sm flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold">Bookworm</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost">
            <Bell className="size-5" />
          </Button>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <DashboardSidebar />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:pt-0 pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Mobile Quick Action */}
          <div className="lg:hidden mb-6">
            <Button className="w-full gap-2">
              <Plus className="size-4" />
              Log Book
            </Button>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <CurrentlyReading />
              <RecommendedBooks />
            </div>
            <div>
              <FriendActivity />
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
};

export default Dashboard;
