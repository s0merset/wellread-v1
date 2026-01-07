import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";
import UpdateProgressModal from '@/components/tracker/UpdateProgress';

// --- Types ---
interface Book {
  title: string;
  author: string;
  cover_url: string;
  total_pages: number;
}

interface UserBook {
  id: string;
  current_page: number;
  status: string;
  rating?: number;
  review_text?: string;
  books: Book;
}

const Tracker: React.FC = () => {
  // --- 1. STATE DEFINITIONS ---
  const [loading, setLoading] = useState(true);
  const [currentlyReading, setCurrentlyReading] = useState<UserBook | null>(null);
  const [recentlyFinished, setRecentlyFinished] = useState<string[]>([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  
  const [stats, setStats] = useState({
    pagesRead: 0,
    avgRating: 0,
    reviewsCount: 0,
    finishedCount: 0
  });

  const [challenge, setChallenge] = useState({
    target: 50,
    current: 0,
    ahead: 0,
    percent: 0
  });

  // --- 2. LOGIC: FETCH TRACKER DATA ---
  const fetchTrackerData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch all books in user's library
      const { data: userBooks, error: booksError } = await supabase
        .from('user_books')
        .select(`*, books (*)`)
        .eq('user_id', user.id);

      if (booksError) throw booksError;

      const allBooks = (userBooks as any[]) || [];
      const finished = allBooks.filter(b => b.status === 'finished');
      const reading = allBooks.find(b => b.status === 'reading');

      // Calculate Stats
      const totalPages = finished.reduce((acc, curr) => acc + (curr.books.total_pages || 0), 0);
      const ratings = finished.filter(b => b.rating).map(b => b.rating as number);
      const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "0";
      const reviewsCount = finished.filter(b => b.review_text).length;

      setStats({
        pagesRead: totalPages,
        avgRating: Number(avgRating),
        reviewsCount,
        finishedCount: finished.length
      });

      setCurrentlyReading(reading || null);
      setRecentlyFinished(finished.slice(0, 4).map(b => b.books.cover_url));

      // Fetch Challenge Progress
      const currentYear = new Date().getFullYear();
      const { data: challengeData } = await supabase
        .from('reading_challenges')
        .select('*')
        .eq('user_id', user.id)
        .eq('year', currentYear)
        .single();

      if (challengeData) {
        const target = challengeData.target_books;
        const dayOfYear = Math.floor((Date.now() - new Date(currentYear, 0, 0).getTime()) / 86400000);
        const expected = (target / 365) * dayOfYear;
        
        setChallenge({
          target,
          current: finished.length,
          ahead: finished.length - Math.floor(expected),
          percent: Math.min(Math.round((finished.length / target) * 100), 100)
        });
      }

    } catch (error: any) {
      console.error(error);
      toast.error("Failed to sync tracker data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackerData();
  }, []);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-background-light dark:bg-background-dark">
      <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
    </div>
  );

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display min-h-screen flex flex-col transition-colors duration-200">
      <Header variant="app"/>
      
      {/* UPDATE MODAL INTEGRATION */}
      <UpdateProgressModal 
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSuccess={fetchTrackerData}
        bookData={currentlyReading}
      />

      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto">
	
        <aside className="hidden md:flex w-70 border-r border-slate-200 dark:border-slate-800 ">
          <Sidebar type="tracker" />
        </aside>

        <div className="flex-1 min-w-0 p-6 lg:p-10 ml-30">
          <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">My Dashboard</h1>
              <p className="text-slate-500 dark:text-slate-400">Track your progress and manage your reading goals.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Last updated: Just now</span>
              <button onClick={fetchTrackerData} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
                <span className="material-symbols-outlined text-xl">refresh</span>
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
            {/* 2026 Challenge Card - THEME PRESERVED */}
            <div className="xl:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-surface-dark dark:to-background-dark border border-slate-200 dark:border-slate-700 shadow-lg text-white p-6 sm:p-8 flex flex-col justify-between min-h-[280px]">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-yellow-400">trophy</span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">2026 Reading Challenge</h3>
                  </div>
                  <div className="text-4xl font-extrabold mb-1">{challenge.current} <span className="text-xl text-slate-400 font-medium">/ {challenge.target} books</span></div>
                  <p className={`text-sm font-medium flex items-center gap-1 ${challenge.ahead >= 0 ? 'text-green-400' : 'text-orange-400'}`}>
                    <span className="material-symbols-outlined text-lg">{challenge.ahead >= 0 ? 'trending_up' : 'trending_down'}</span>
                    {Math.abs(challenge.ahead)} books {challenge.ahead >= 0 ? 'ahead of' : 'behind'} schedule
                  </p>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur border border-white/10 text-xs font-bold transition-colors">Edit Goal</button>
              </div>
              
              <div className="relative z-10 mb-8">
                <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-1000" 
                    style={{ width: `${challenge.percent}%` }}
                  ></div>
                </div>
              </div>

              <div className="relative z-10">
                <p className="text-xs text-slate-400 mb-3 font-bold uppercase tracking-wide">Recently Finished</p>
                <div className="flex -space-x-3 hover:space-x-1 transition-all duration-300">
                  {recentlyFinished.map((src, i) => (
                    <img key={i} alt="cover" className="w-12 h-16 object-cover rounded shadow-lg border-2 border-slate-800 hover:scale-110 hover:z-20 transition-transform cursor-pointer" src={src} />
                  ))}
                  {stats.finishedCount > 4 && (
                    <div className="w-12 h-16 rounded bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 hover:scale-110 transition-transform cursor-pointer">
                      +{stats.finishedCount - 4}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats Grid - THEME PRESERVED */}
            <div className="grid grid-cols-2 gap-4 ">
              <TrackerStat icon="auto_stories" value={stats.pagesRead.toLocaleString()} label="Pages Read" color="blue" />
              <TrackerStat icon="star_half" value={stats.avgRating.toString()} label="Avg. Rating" color="yellow" />
              <TrackerStat icon="rate_review" value={stats.reviewsCount.toString()} label="Reviews" color="green" />
              <TrackerStat icon="local_fire_department" value="12" label="Day Streak" color="purple" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
            <div className="lg:col-span-2 space-y-6 ">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">timelapse</span> Currently Reading
              </h3>
              
              {currentlyReading ? (
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-surface-dark dark:to-background-dark rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col sm:flex-row gap-6">
                  <img 
                    alt={currentlyReading.books.title} 
                    className="shrink-0 w-24 sm:w-32 aspect-[2/3] rounded-lg object-cover shadow-md border border-white/10" 
                    src={currentlyReading.books.cover_url} 
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xl font-bold text-white">{currentlyReading.books.title}</h4>
                      <p className="text-sm text-slate-400 mb-4">by {currentlyReading.books.author}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs font-bold text-slate-300">
                          <span>{Math.round((currentlyReading.current_page / currentlyReading.books.total_pages) * 100)}% Complete</span>
                          <span>{currentlyReading.current_page} / {currentlyReading.books.total_pages} pages</span>
                        </div>
                        <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-700" 
                            style={{ width: `${(currentlyReading.current_page / currentlyReading.books.total_pages) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsUpdateModalOpen(true)}
                      className="bg-primary hover:bg-blue-600 text-white font-bold text-sm py-2.5 rounded-lg transition-all shadow-lg shadow-primary/20"
                    >
                      Update Progress
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center text-slate-500 font-bold">
                  No active books. Start a new journey!
                </div>
              )}
            </div>

            {/* Top Genres - THEME PRESERVED */}
            <div className="space-y-6 ">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-pink-500">pie_chart</span> Top Genres
              </h3>
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-surface-dark dark:to-background-dark rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
                <GenreProgress label="Fiction" percent={65} color="bg-blue-500" />
                <GenreProgress label="Philosophy" percent={20} color="bg-purple-500" />
                <GenreProgress label="Classics" percent={15} color="bg-orange-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrackerStat = ({ icon, value, label, color }: { icon: string, value: string, label: string, color: string }) => {
  const colors: any = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-primary",
    yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600"
  };
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-surface-dark dark:to-background-dark p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-white">
      <div className={`h-10 w-10 rounded-lg ${colors[color]} flex items-center justify-center mb-3`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs font-medium text-slate-400">{label}</div>
    </div>
  );
};

const GenreProgress = ({ label, percent, color }: { label: string, percent: number, color: string }) => (
  <div className="group text-white">
    <div className="flex justify-between text-xs font-bold mb-1">
      <span className="text-slate-300">{label}</span>
      <span className="text-slate-400">{percent}%</span>
    </div>
    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }}></div>
    </div>
  </div>
);

export default Tracker;
