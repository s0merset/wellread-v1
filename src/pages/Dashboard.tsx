import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import CurrentlyReading from "@/components/dashboard/CurrentlyReading";
import FriendActivity from "@/components/dashboard/FriendActivity";
import Header from "@/components/Header";
import RecommendedBooks from "@/components/dashboard/RecommendedBooks";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import UpNext from "@/components/dashboard/UpNext";

const Dashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      
      {/* GLOBAL HEADER WRAPPER */}
      {/* Added z-50, background, backdrop-blur, and border-b to prevent overlapping */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 dark:border-slate-700 bg-background/95 backdrop-blur-sm">
        
        {/* Desktop Header */}
        <div className="hidden lg:block">
          <Header variant="app"/>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden h-16 flex items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">auto_stories</span>
            <span className="font-bold tracking-tight">Bookworm</span>
          </Link>
          
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" className="rounded-full">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
            </Button>
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="rounded-full">
                  <span className="material-symbols-outlined text-[22px]">menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0 border-l border-slate-200 dark:border-slate-700">
                <DashboardSidebar />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      {/* pt-16 ensures content starts exactly below the fixed header */}
      <div className="flex flex-1 pt-16">
        
        {/* Sidebar - Desktop Only */}
        <div className="hidden lg:block sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <DashboardSidebar />
        </div>

        {/* Main Scrolling Content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="max-w-6xl mx-auto px-4 py-8 lg:px-8">
            
            {/* Mobile Quick Action - Updated with Material Symbol */}
            <div className="lg:hidden mb-8">
              <Button className="w-full gap-2 h-12 shadow-lg shadow-primary/20 text-sm font-bold">
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                LOG NEW BOOK
              </Button>
            </div>

            {/* Content Grid */}
            <div className="space-y-10">
              
              {/* Row 1: Reading Status */}
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <CurrentlyReading />
                </div>
                <div>
                  <UpNext />
                </div>
              </div> 

              {/* Row 2: Social Activity */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <FriendActivity />
              </div>

              {/* Row 3: Discovery */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <RecommendedBooks />
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
