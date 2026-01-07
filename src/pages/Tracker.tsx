import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";
import UpdateProgressModal from '@/components/tracker/UpdateProgress';
import EditGoalModal from '@/components/tracker/EditGoal';
import SelectBookModal from '@/components/tracker/SelectBook';
import ReplaceBookModal from '@/components/tracker/ReplaceBook';

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
  updated_at?: string;
}

const Tracker: React.FC = () => {
  // --- 1. STATE ---
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [library, setLibrary] = useState<UserBook[]>([]);
  const [currentlyReading, setCurrentlyReading] = useState<UserBook | null>(null);
  const [recentlyFinished, setRecentlyFinished] = useState<string[]>([]);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal State
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isSelectBookModalOpen, setIsSelectBookModalOpen] = useState(false);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false); // New State
  
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

  // --- 2. LOGIC ---
  const fetchTrackerData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Use explicit join syntax to avoid errors
      let query = supabase
        .from('user_books')
        .select(`
          *,
          books:book_id (*)
        `)
        .eq('user_id', user.id);

      const { data: userBooks, error: booksError } = await query.order('updated_at', { ascending: false });

      if (booksError) throw new Error(booksError.message);

      const allBooks = (userBooks as any[]) || [];
      const validBooks = allBooks.filter(b => b.books !== null);
      
      setLibrary(validBooks);

      const finished = validBooks.filter(b => b.status === 'finished');
      const reading = validBooks.find(b => b.status === 'reading');

      const totalPages = finished.reduce((acc, curr) => acc + (curr.books.total_pages || 0), 0);
      const ratings = finished.filter(b => b.rating).map(b => b.rating as number);
      const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "0";

      setStats({
        pagesRead: totalPages,
        avgRating: Number(avgRating),
        reviewsCount: finished.filter(b => b.review_text).length,
        finishedCount: finished.length
      });

      setCurrentlyReading(reading || null);
      setRecentlyFinished(finished.slice(0, 4).map(b => b.books.cover_url));

      const currentYear = new Date().getFullYear();
      const { data: challengeData } = await supabase
        .from('reading_challenges')
        .select('*')
        .eq('user_id', user.id)
        .eq('year', currentYear)
        .maybeSingle();

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
      console.error("Tracker Sync Error:", error);
      toast.error(`Sync failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackerData();
  }, []);

  // --- NEW: Actual Deletion Logic ---
  const confirmReplaceBook = async () => {
    if (!currentlyReading) return;

    try {
      const { error } = await supabase
        .from('user_books')
        .delete()
        .eq('id', currentlyReading.id);

      if (error) throw error;

      toast.success("Book removed");
      setIsReplaceModalOpen(false); // Close confirmation modal
      
      // Refresh data
      await fetchTrackerData();
      
      // Open selection modal immediately so user can pick next book
      setIsSelectBookModalOpen(true);

    } catch (error) {
      console.error(error);
      toast.error("Failed to remove book");
    }
  };

  // --- Search Logic ---
  const filteredLibrary = library.filter(item => {
    const matchesSearch = 
      item.books.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.books.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-background-light dark:bg-background-dark">
      <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
    </div>
  );

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display min-h-screen flex flex-col transition-colors duration-200">
      <Header variant="app"/>
      
      {/* --- MODALS --- */}
      <UpdateProgressModal 
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSuccess={fetchTrackerData}
        bookData={currentlyReading}
      />
      <EditGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSuccess={fetchTrackerData}
        currentTarget={challenge.target}
      />
      <SelectBookModal
        isOpen={isSelectBookModalOpen}
        onClose={() => setIsSelectBookModalOpen(false)}
        onSuccess={fetchTrackerData}
      />
      
      {/* NEW: Replace Book Modal */}
      <ReplaceBookModal
        isOpen={isReplaceModalOpen}
        onClose={() => setIsReplaceModalOpen(false)}
        onConfirm={confirmReplaceBook}
        bookTitle={currentlyReading?.books.title || ''}
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
            {/* Challenge Card */}
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
                <button onClick={() => setIsGoalModalOpen(true)} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur border border-white/10 text-xs font-bold transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">edit</span> Edit Goal
                </button>
              </div>
              <div className="relative z-10 mb-8">
                <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-1000" style={{ width: `${challenge.percent}%` }}></div>
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-xs text-slate-400 mb-3 font-bold uppercase tracking-wide">Recently Finished</p>
                <div className="flex -space-x-3 hover:space-x-1 transition-all duration-300">
                  {recentlyFinished.map((src, i) => (
                    <img key={i} alt="cover" className="w-12 h-16 object-cover rounded shadow-lg border-2 border-slate-800 hover:scale-110 hover:z-20 transition-transform cursor-pointer" src={src} />
                  ))}
                  {stats.finishedCount > 4 && (
                    <div className="w-12 h-16 rounded bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 hover:scale-110 transition-transform cursor-pointer">+{stats.finishedCount - 4}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <TrackerStat icon="auto_stories" value={stats.pagesRead.toLocaleString()} label="Pages Read" color="blue" />
              <TrackerStat icon="star_half" value={stats.avgRating.toString()} label="Avg. Rating" color="yellow" />
              <TrackerStat icon="rate_review" value={stats.reviewsCount.toString()} label="Reviews" color="green" />
              <TrackerStat icon="local_fire_department" value="12" label="Day Streak" color="purple" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">timelapse</span> Currently Reading
                </h3>
                {!currentlyReading && (
                  <button onClick={() => setIsSelectBookModalOpen(true)} className="group flex items-center gap-1.5 text-sm font-bold text-primary hover:text-blue-600 transition-colors">
                    <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">add_circle</span> Pick from Lists
                  </button>
                )}
              </div>
              
              {currentlyReading ? (
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-surface-dark dark:to-background-dark rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col sm:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <img alt={currentlyReading.books.title} className="shrink-0 w-24 sm:w-32 aspect-[2/3] rounded-lg object-cover shadow-md border border-white/10" src={currentlyReading.books.cover_url} />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xl font-bold text-white line-clamp-1">{currentlyReading.books.title}</h4>
                      <p className="text-sm text-slate-400 mb-4">by {currentlyReading.books.author}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs font-bold text-slate-300">
                          <span>{Math.round((currentlyReading.current_page / currentlyReading.books.total_pages) * 100)}% Complete</span>
                          <span>{currentlyReading.current_page} / {currentlyReading.books.total_pages} pages</span>
                        </div>
                        <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-primary transition-all duration-700" style={{ width: `${(currentlyReading.current_page / currentlyReading.books.total_pages) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* BUTTONS SECTION */}
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setIsUpdateModalOpen(true)} 
                        className="flex-1 bg-primary hover:bg-blue-600 text-white font-bold text-sm py-2.5 rounded-lg transition-all shadow-lg shadow-primary/20"
                      >
                        Update Progress
                      </button>
                      
                      {/* Replace Button -> Opens Modal */}
                      <button 
                        onClick={() => setIsReplaceModalOpen(true)}
                        className="px-4 py-2.5 rounded-lg bg-slate-700 hover:bg-red-500/20 hover:text-red-400 border border-slate-600 hover:border-red-500/50 text-slate-300 font-bold text-sm transition-all flex items-center gap-2 group"
                        title="Remove and Replace"
                      >
                        <span className="material-symbols-outlined text-lg">swap_horiz</span>
                        <span className="hidden sm:inline">Replace</span>
                      </button>
                    </div>

                  </div>
                </div>
              ) : (
                <div className="p-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-1">
                    <span className="material-symbols-outlined text-3xl text-slate-400">auto_stories</span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white">No active book</div>
                  <button onClick={() => setIsSelectBookModalOpen(true)} className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">Start Reading</button>
                </div>
              )}
            </div>

            <div className="space-y-6">
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

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500">manage_search</span> 
                Search Library
              </h3>
              
	      {/* --- NEW BUTTON: Track Another Book --- */}
                <button 
                  onClick={() => setIsSelectBookModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Track New
                </button>

              <div className="flex gap-3">
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-xl px-3 py-2 outline-none focus:border-primary"
                >
                  <option value="all">All Status</option>
                  <option value="reading">Reading</option>
                  <option value="finished">Finished</option>
                  <option value="to_read">To Read</option>
                </select>

                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">search</span>
                  <input 
                    type="text" 
                    placeholder="Find title or author..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none w-full sm:w-64 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                      <th className="p-4 pl-6">Book Details</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Progress</th>
                      <th className="p-4 text-right pr-6">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredLibrary.length > 0 ? (
                      filteredLibrary.map((book) => (
                        <tr key={book.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-4">
                              <img src={book.books.cover_url} alt="cover" className="w-10 h-14 object-cover rounded shadow-sm border border-slate-200 dark:border-slate-700"/>
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white text-sm">{book.books.title}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{book.books.author}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                              book.status === 'reading' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 border-blue-200 dark:border-blue-800' :
                              book.status === 'finished' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 border-green-200 dark:border-green-800' :
                              'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                            }`}>
                              {book.status === 'reading' ? 'In Progress' : book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="w-32">
                              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                                <span>{Math.round((book.current_page / book.books.total_pages) * 100)}%</span>
                                <span>{book.current_page}/{book.books.total_pages}</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${book.status === 'finished' ? 'bg-green-500' : 'bg-primary'}`} style={{ width: `${(book.current_page / book.books.total_pages) * 100}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-right pr-6">
                             {book.status === 'reading' ? (
                               <button 
                                 onClick={() => {
                                   setCurrentlyReading(book);
                                   setIsUpdateModalOpen(true);
                                 }}
                                 className="text-primary hover:text-blue-700 text-xs font-bold hover:underline"
                               >
                                 Update
                               </button>
                             ) : book.status === 'finished' ? (
                               <div className="flex items-center justify-end text-yellow-500 gap-0.5">
                                 <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-2">{book.rating || '-'}</span>
                                 <span className="material-symbols-outlined text-sm">star</span>
                               </div>
                             ) : (
                               <span className="text-xs text-slate-400">In List</span>
                             )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-500 text-sm">
                          No books found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---
const TrackerStat = ({ icon, value, label, color }: { icon: string, value: string, label: string, color: string }) => {
  const colors: any = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-primary",
    yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600"
  };
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-surface-dark dark:to-background-dark p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-white hover:scale-[1.02] transition-transform duration-200">
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
