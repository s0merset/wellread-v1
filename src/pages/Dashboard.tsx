import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Header from "@/components/Header";

// Dashboard Components
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import CurrentlyReading from "@/components/dashboard/CurrentlyReading";
import FriendActivity from "@/components/dashboard/FriendActivity";
import RecommendedBooks from "@/components/dashboard/RecommendedBooks";
import UpNext from "@/components/dashboard/UpNext";

// --- Types (Matching your Profile reference) ---
interface UserBook {
  id: string;
  status: string;
  current_page: number;
  books: { 
    id: string;
    title: string; 
    author: string; 
    cover_url: string; 
    total_pages: number; 
  };
  updated_at: string;
}

interface Activity {
  id: string;
  user_name: string;
  user_avatar: string;
  action_text: string;
  book_title: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- Data States ---
  const [readingNow, setReadingNow] = useState<UserBook[]>([]);
  const [upNext, setUpNext] = useState<UserBook[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

const fetchDashboardData = async () => {
  try {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Fetch ALL User Books (matching your Profile page logic)
    // This avoids the ENUM error because we aren't filtering in the query
    const { data: userBooksData, error: booksError } = await supabase
      .from('user_books')
      .select('*, books(*)') 
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (booksError) throw booksError;

    const fetchedBooks = (userBooksData as any[]) || [];

    // 2. Filter logic in JavaScript
    // 'reading' is standard, but 'to_read' or 'backlog' is likely what your DB uses instead of 'up_next'
    setReadingNow(fetchedBooks.filter(b => b.status === 'reading'));
    
    // We filter for books that aren't finished and aren't currently being read
    setUpNext(fetchedBooks.filter(b => b.status !== 'reading' && b.status !== 'finished').slice(0, 3));

    // 3. Activity Feed logic (using user_books to simulate activity)
    const { data: activityData } = await supabase
      .from('user_books')
      .select('*, profiles(username, avatar_url), books(title)')
      .order('updated_at', { ascending: false })
      .limit(5);

    if (activityData) {
      const formattedActivity = (activityData as any[]).map(item => ({
        id: item.id,
        user_name: item.profiles?.username || 'A reader',
        user_avatar: item.profiles?.avatar_url || '',
        action_text: item.status === 'finished' ? 'finished reading' : 'updated progress on',
        book_title: item.books?.title || 'a book',
        timestamp: item.updated_at
      }));
      setActivities(formattedActivity);
    }

  } catch (error) {
    console.error("Dashboard Error:", error);
    toast.error("Failed to sync dashboard data");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-blue-500">sync</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white transition-colors">
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 dark:border-slate-800 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="hidden lg:block">
          <Header variant="app"/>
        </div>

        <div className="lg:hidden h-16 flex items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-500 font-bold">auto_stories</span>
            <span className="font-black tracking-tight uppercase text-sm">Bookworm</span>
          </Link>
          
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" className="rounded-xl">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
            </Button>
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="rounded-xl">
                  <span className="material-symbols-outlined text-[22px]">menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0 border-l border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark">
                <DashboardSidebar />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <div className="flex flex-1 pt-16">
        
        {/* Sidebar - Desktop Only */}
        <aside className="hidden lg:block sticky top-16 h-[calc(100vh-64px)] overflow-y-auto border-r border-slate-200 dark:border-slate-800">
          <DashboardSidebar />
        </aside>

        {/* Main Scrolling Content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="max-w-6xl mx-auto px-6 py-10 lg:px-10">
            
            {/* Mobile Quick Action */}
            <div className="lg:hidden mb-10">
              <Button className="w-full gap-2 h-12 bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 rounded-xl font-bold">
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                LOG NEW BOOK
              </Button>
            </div>

            {/* Content Grid */}
            <div className="space-y-12">
              
              {/* Row 1: Reading Status */}
              <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                  <CurrentlyReading 
                    books={readingNow} 
                    onRefresh={fetchDashboardData} 
                  />
                </div>
                <div>
                  <UpNext books={upNext} />
                </div>
              </div> 

              {/* Row 2: Social Activity */}
              <div className="pt-10 border-t border-slate-200 dark:border-slate-800">
                <FriendActivity activities={activities} />
              </div>

              {/* Row 3: Discovery */}
              <div className="pt-10 border-t border-slate-200 dark:border-slate-800">
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
