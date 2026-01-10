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

// --- Types ---
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

export interface Activity {
  id: string;
  type: "rating" | "finished" | "list";
  created_at: string;
  user: {
    full_name: string;
    avatar_url: string;
    username: string;
  };
  book?: {
    title: string;
    author: string;
    cover_url: string;
  };
  rating?: number;
  review?: string;
  listName?: string;
  bookCount?: number;
  likes: number;
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

      // 1. Fetch User Books
      const { data: userBooksData, error: booksError } = await supabase
        .from('user_books')
        .select('*, books(*)') 
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (booksError) throw booksError;
      const fetchedBooks = (userBooksData as any[]) || [];

      setReadingNow(fetchedBooks.filter(b => b.status === 'reading'));
      setUpNext(fetchedBooks.filter(b => b.status !== 'reading' && b.status !== 'finished').slice(0, 3));

      // 2. INTEGRATED: Fetch Notifications (Friend Activity)
      // We fetch notifications where the current user is the receiver (user_id)
const { data: notificationData } = await supabase
  .from('notifications')
		// Change this line in your .select()
.select(`
  id,
  created_at,
  type,
  payload,
  actor:profiles!notifications_actor_id_fkey ( 
    username,
    avatar_url,
    full_name
  )
`)
  .eq('user_id', user.id);

if (notificationData) {
  const formatted = notificationData.map((n: any) => ({
    id: n.id,
    type: "rating", // or check n.type
    created_at: n.created_at,
    user: n.actor,
    book: {
      title: n.payload?.book_title || "Untitled",
      cover_url: n.payload?.book_cover || "",
      author: n.payload?.book_author || ""
    },
    rating: n.payload?.rating || 5,
    review: n.payload?.content_snippet,
    likes: 0
  }));
  setActivities(formatted);
}
    } catch (error) {
      console.error("Dashboard Error:", error);
      toast.error("Failed to sync dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // 3. REALTIME INTEGRATION
  useEffect(() => {
    fetchDashboardData();

    let channel: any;

    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      channel = supabase
        .channel('realtime-dashboard-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`, // Only listen for MY notifications
          },
          async (payload: any) => {
	    console.log("RAW NOTIFICATION RECEIVED:", payload.new)
            // Fetch actor profile for the new notification to keep UI consistent
            const { data: actorProfile } = await supabase
              .from('profiles')
              .select('username, avatar_url')
              .eq('id', payload.new.actor_id)
              .single();

	    const newActivity: Activity = {
  id: payload.new.id,
  // Use the type from your payload or default to 'rating'
  type: payload.new.payload?.type || "rating", 
  created_at: payload.new.created_at,
  // Nest user info here
  user: {
    username: actorProfile?.username || "A friend",
    avatar_url: actorProfile?.avatar_url || "",
    full_name: actorProfile?.full_name || actorProfile?.username || "A Reader",
  },
  // Nest book info here
  book: {
    title: payload.new.payload?.book_title || "a book",
    author: payload.new.payload?.book_author || "Unknown Author",
    cover_url: payload.new.payload?.book_cover || "",
  },
  rating: payload.new.payload?.rating || 5,
  review: payload.new.payload?.content_snippet || "",
  likes: 0, // Initial likes
};

setActivities((prev) => [newActivity, ...prev.slice(0, 9)]);
toast.info(`${actorProfile?.username || "A friend"} posted a new review!`);
          }
        )
	    .subscribe((status) => {
  console.log("Realtime Status:", status);
  if (status === 'CHANNEL_ERROR') {
    console.error("Realtime failed to connect. Check if Realtime is enabled in Supabase.");
  }
  if (status === 'SUBSCRIBED') {
    console.log("Realtime is LIVE and listening for changes.");
  }
});
    };

    setupSubscription();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
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
            {/* Notification Bell Badge */}
            <div className="relative">
              <Button size="icon" variant="ghost" className="rounded-xl">
                <span className="material-symbols-outlined text-[22px]">notifications</span>
              </Button>
              {activities.length > 0 && (
                 <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </div>
            
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
        <aside className="hidden lg:block sticky top-16 h-[calc(100vh-64px)] overflow-y-auto border-r border-slate-200 dark:border-slate-800">
          <DashboardSidebar />
        </aside>

        <main className="flex-1 overflow-x-hidden">
          <div className="max-w-6xl mx-auto px-6 py-10 lg:px-10">
            
            <div className="lg:hidden mb-10">
              <Button className="w-full gap-2 h-12 bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 rounded-xl font-bold">
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                LOG NEW BOOK
              </Button>
            </div>

            <div className="space-y-12">
              <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                  <CurrentlyReading books={readingNow} onRefresh={fetchDashboardData} />
                </div>
                <div>
                  <UpNext books={upNext} />
                </div>
              </div> 

              {/* FRIEND ACTIVITY - Now fed by Realtime Notifications */}
              <div className="pt-10 border-t border-slate-200 dark:border-slate-800">
                <FriendActivity activities={activities} />
              </div>

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
