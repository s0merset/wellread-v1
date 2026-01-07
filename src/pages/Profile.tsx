import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import EditProfileModal from '@/components/profile/EditProfile';
import AddFavoriteModal from '@/components/profile/AddFavoriteBook';
import AddReviewModal from '@/components/review/AddReview';

// --- Types ---
type Tab = 'Profile' | 'Activity' | 'Reviews' | 'Lists' | 'Stats';

interface ProfileData {
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
}

interface UserBook {
  id: string;
  status: string;
  rating: number;
  review_text: string;
  current_page: number;
  is_favorite: boolean; // NEW FIELD
  books: { 
    id: string;
    title: string; 
    author: string; 
    cover_url: string; 
    total_pages: number; 
  };
  finished_at: string;
  updated_at: string;
}

interface ListWithCovers {
  id: string;
  name: string;
  count: number;
  covers: string[];
}

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Profile');
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFavModalOpen, setIsFavModalOpen] = useState(false); // NEW STATE

  // Data States
  const [profile, setProfile] = useState<ProfileData>({ username: '', full_name: '', avatar_url: '', bio: '' });
  const [stats, setStats] = useState({ booksRead: 0, yearCount: 0, reviews: 0, lists: 0, pagesRead: 0 });
  const [currentRead, setCurrentRead] = useState<UserBook | null>(null);
  const [allBooks, setAllBooks] = useState<UserBook[]>([]);
  const [lists, setLists] = useState<ListWithCovers[]>([]);

  // --- Data Fetching ---
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch Profile
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      
      setProfile({
        username: profileData?.username || user.email?.split('@')[0] || 'reader',
        full_name: profileData?.full_name || 'Reader',
        avatar_url: profileData?.avatar_url || '',
        bio: profileData?.bio || 'Just another book lover tracking their journey.'
      });

      // 2. Fetch User Books
      const { data: userBooksData } = await supabase
        .from('user_books')
        .select('*, books(*)')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      const fetchedBooks = (userBooksData as any[]) || [];
      setAllBooks(fetchedBooks);

      const finished = fetchedBooks.filter(b => b.status === 'finished');
      const reading = fetchedBooks.find(b => b.status === 'reading');
      
      const currentYear = new Date().getFullYear();
      const thisYear = finished.filter(b => b.finished_at && new Date(b.finished_at).getFullYear() === currentYear);
      const totalPages = finished.reduce((acc, curr) => acc + (curr.books.total_pages || 0), 0);

      setCurrentRead(reading || null);

      // 3. Fetch Lists
      const { data: listsData } = await supabase
        .from('lists')
        .select(`id, name, list_items ( books ( cover_url ) )`)
        .eq('user_id', user.id);

      if (listsData) {
        const formattedLists = listsData.map((l: any) => ({
          id: l.id,
          name: l.name,
          count: l.list_items.length,
          covers: l.list_items.map((i: any) => i.books?.cover_url).filter(Boolean).slice(0, 3)
        }));
        setLists(formattedLists);
        setStats({
          booksRead: finished.length,
          yearCount: thisYear.length,
          reviews: fetchedBooks.filter(b => b.review_text).length,
          lists: listsData.length,
          pagesRead: totalPages
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error syncing profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // --- NEW: Handle Remove Favorite ---
  const handleRemoveFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    try {
      const { error } = await supabase
        .from('user_books')
        .update({ is_favorite: false })
        .eq('id', id);

      if (error) throw error;
      toast.success("Removed from favorites");
      fetchProfileData(); // Refresh
    } catch (error) {
      toast.error("Failed to remove");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
       <span className="material-symbols-outlined animate-spin text-4xl text-blue-500">sync</span>
    </div>
  );

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display text-slate-900 dark:text-white antialiased pb-20 transition-colors">
      <Header activePage="Profile" />
      
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchProfileData}
        initialData={profile}
      />

      <AddFavoriteModal
        isOpen={isFavModalOpen}
        onClose={() => setIsFavModalOpen(false)}
        onSuccess={fetchProfileData}
      />
      
      <AddReviewModal 
         isOpen={isReviewModalOpen}
         onClose={() => setIsReviewModalOpen(false)}
         onSuccess={() => {
           // Refresh profile data to show the new review in the "Reviews" tab
           fetchProfileData(); 
         }}
       />
      <main className="max-w-[1400px] w-full mx-auto px-6 py-10 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* SIDEBAR */}
          <aside className="w-full lg:w-[320px] shrink-0">
            {/* ... Sidebar code matches previous response (omitted for brevity) ... */}
            <div className="flex flex-col items-center lg:items-start lg:sticky lg:top-10">
              
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full p-[3px] ring-2 ring-slate-200 dark:ring-slate-800">
                   <div className="w-full h-full rounded-full bg-slate-100 dark:bg-[#1e293b] flex items-center justify-center overflow-hidden">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl font-bold text-slate-400">{profile?.username.slice(0,2).toUpperCase()}</span>
                      )}
                   </div>
                </div>
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="absolute bottom-1 right-1 bg-blue-500 p-1.5 rounded-full border-4 border-white dark:border-[#0f172a] hover:scale-110 transition-transform text-white cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
              </div>

              <h1 className="text-3xl font-extrabold mb-1 text-center lg:text-left">{profile.full_name}</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-4 text-center lg:text-left">@{profile.username}</p>
              
              <div className="flex gap-2 mb-6">
                <span className="text-[10px] font-black bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-1 rounded uppercase tracking-tighter">Member</span>
                <span className="text-[10px] font-black bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded uppercase tracking-tighter">Reader</span>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-8 text-center lg:text-left">
                {profile.bio}
              </p>

              <button onClick={() => setIsEditModalOpen(true)} className="w-full py-2.5 rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold transition-all mb-10 shadow-sm">
                Edit Profile
              </button>


	      <button 
               onClick={() => setIsReviewModalOpen(true)}
               className="px-4 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-yellow-400 hover:text-slate-900 transition-colors text-slate-600 dark:text-slate-300"
               title="Write a Review"
             >
               <span className="material-symbols-outlined">rate_review</span>
             </button>
              <div className="w-full grid grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden mb-10">
                <StatBox value={stats.booksRead} label="Books" />
                <StatBox value={stats.yearCount} label="This Year" />
                <StatBox value={stats.reviews} label="Reviews" />
                <StatBox value={stats.lists} label="Lists" />
              </div>

              <div className="w-full">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Currently Reading
                 </h4>
                 {currentRead ? (
                   <div className="bg-white dark:bg-[#1e293b]/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <div className="flex gap-4 mb-4">
                        <img src={currentRead.books.cover_url} className="w-12 h-18 object-cover rounded shadow-lg" alt={currentRead.books.title} />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm truncate">{currentRead.books.title}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentRead.books.author}</div>
                          <div className="mt-2 text-[10px] font-bold text-slate-500">
                            Page {currentRead.current_page} <span className="float-right text-blue-500">{Math.round((currentRead.current_page / currentRead.books.total_pages) * 100)}%</span>
                          </div>
                          <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                             <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${(currentRead.current_page / currentRead.books.total_pages) * 100}%` }}></div>
                          </div>
                        </div>
                      </div>
                   </div>
                 ) : (
                   <div className="text-sm text-slate-400 text-center py-4 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                     Not reading anything currently.
                   </div>
                 )}
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 min-w-0">
            <div className="border-b border-slate-200 dark:border-slate-800 flex gap-8 mb-10 overflow-x-auto no-scrollbar">
              {(['Profile', 'Activity', 'Reviews', 'Lists', 'Stats'] as Tab[]).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
                </button>
              ))}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {activeTab === 'Profile' && (
                <ProfileTab 
                  books={allBooks} 
                  lists={lists} 
                  onAddFavorite={() => setIsFavModalOpen(true)}
                  onRemoveFavorite={handleRemoveFavorite}
                />
              )}
              {activeTab === 'Activity' && <ActivityTab books={allBooks} />}
              {activeTab === 'Reviews' && <ReviewsTab books={allBooks} />}
              {activeTab === 'Lists' && <ListsTab lists={lists} />}
              {activeTab === 'Stats' && <StatsTab books={allBooks} totalPages={stats.pagesRead} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Updated Profile Tab with Add/Remove Logic ---
const ProfileTab = ({ 
  books, 
  lists, 
  onAddFavorite,
  onRemoveFavorite 
}: { 
  books: UserBook[], 
  lists: ListWithCovers[],
  onAddFavorite: () => void,
  onRemoveFavorite: (id: string, e: React.MouseEvent) => void
}) => {
  // Filter by is_favorite = true
  const favorites = books.filter(b => b.is_favorite);
  const recentReviews = books.filter(b => b.review_text).slice(0, 2);

  return (
    <>
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold">Favorite Books</h3>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] px-2 py-0.5 rounded font-bold">All Time</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-5">
          {/* Favorite Cards */}
          {favorites.map((book) => (
            <div key={book.id} className="aspect-[2/3] rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5 dark:ring-white/5 hover:scale-[1.05] transition-transform duration-300 cursor-pointer relative group">
              <img src={book.books.cover_url} alt={book.books.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                  <div className="flex items-center text-yellow-400 font-bold gap-1 mb-2">
                    <span>{book.rating || '-'}</span><span className="material-symbols-outlined text-sm">star</span>
                  </div>
                  {/* Remove Button */}
                  <button 
                    onClick={(e) => onRemoveFavorite(book.id, e)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-colors"
                    title="Remove from favorites"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
              </div>
            </div>
          ))}
          
          {/* Add Button - Hidden if 5 or more favorites to keep layout clean, or always show */}
          {favorites.length < 5 && (
            <div 
              onClick={onAddFavorite}
              className="aspect-[2/3] rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 cursor-pointer transition-all group"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">add</span>
                <span className="text-xs font-bold uppercase tracking-wider">Add</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Reviews & Lists Preview (Same as before) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        <div className="xl:col-span-2 space-y-6">
          <h3 className="text-xl font-bold mb-4">Recent Reviews</h3>
          {recentReviews.length > 0 ? (
            recentReviews.map(book => <ReviewCard key={book.id} book={book} />)
          ) : (
             <div className="text-slate-500 italic">No reviews yet.</div>
          )}
        </div>
        
        <div>
          <h3 className="text-xl font-bold mb-6">Top Lists</h3>
          <div className="space-y-4">
             {lists.slice(0, 3).map(list => (
               <div key={list.id} className="flex gap-4 items-center group cursor-pointer">
                  <div className="w-16 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden relative border border-slate-200 dark:border-slate-700">
                     {list.covers[0] && <img src={list.covers[0]} className="w-full h-full object-cover opacity-80" />}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm group-hover:text-blue-500 transition-colors">{list.name}</h5>
                    <p className="text-xs text-slate-500">{list.count} books</p>
                  </div>
               </div>
             ))}
             {lists.length === 0 && <p className="text-sm text-slate-500">No lists created.</p>}
          </div>
        </div>
      </div>
    </>
  );
};

// --- Other Tab Components (ActivityTab, ReviewsTab, ListsTab, StatsTab, etc.) remain identical to previous response ---
const ActivityTab = ({ books }: { books: UserBook[] }) => {
  return (
    <div className="space-y-8 relative pl-8 border-l border-slate-200 dark:border-slate-800 ml-4 max-w-2xl">
      {books.length === 0 && <div className="text-slate-500">No activity yet.</div>}
      
      {books.map((book) => {
        let type = 'updated';
        let icon = 'update';
        let color = 'bg-slate-500';
        let text = 'Updated progress on';

        if (book.status === 'finished') {
          type = 'finished';
          icon = 'check';
          color = 'bg-green-500';
          text = 'Finished reading';
        } else if (book.status === 'reading' && book.current_page === 0) {
          type = 'started';
          icon = 'play_arrow';
          color = 'bg-blue-500';
          text = 'Started reading';
        }

        const date = new Date(book.updated_at).toLocaleDateString();

        return (
          <div key={book.id} className="relative flex gap-4">
            <div className={`absolute -left-[41px] w-5 h-5 rounded-full ${color} flex items-center justify-center text-white ring-4 ring-white dark:ring-[#0f172a]`}>
              <span className="material-symbols-outlined text-[12px] font-bold">{icon}</span>
            </div>
            <img src={book.books.cover_url} className="w-12 h-18 object-cover rounded shadow-sm" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{date}</p>
              <p className="text-slate-900 dark:text-white">
                {text} <span className="font-bold">{book.books.title}</span>
              </p>
              {book.rating > 0 && (
                 <div className="flex text-yellow-400 text-xs mt-1">
                    {[...Array(book.rating)].map((_, i) => <span key={i} className="material-symbols-outlined text-[14px] fill-current">star</span>)}
                 </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  );
};

const ReviewsTab = ({ books }: { books: UserBook[] }) => {
  const reviews = books.filter(b => b.review_text);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reviews.length === 0 && <div className="col-span-2 text-center text-slate-500 py-10">No reviews written yet.</div>}
      {reviews.map(book => <ReviewCard key={book.id} book={book} />)}
    </div>
  );
};

const ListsTab = ({ lists }: { lists: ListWithCovers[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {lists.length === 0 && <div className="col-span-3 text-center text-slate-500 py-10">No lists created yet.</div>}
      {lists.map(list => (
        <FannedListCard 
          key={list.id} 
          title={list.name} 
          count={list.count} 
          covers={list.covers} 
        />
      ))}
    </div>
  );
};

const StatsTab = ({ books, totalPages }: { books: UserBook[], totalPages: number }) => {
  const finished = books.filter(b => b.status === 'finished');
  const ratings = finished.filter(b => b.rating).map(b => b.rating);
  const avgRating = ratings.length ? (ratings.reduce((a,b) => a+b, 0) / ratings.length).toFixed(1) : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-[#1e293b]/30 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
        <h4 className="text-slate-500 text-xs font-bold uppercase mb-4">Reading Overview</h4>
        <div className="space-y-6">
          <div className="flex justify-between items-end">
             <div>
               <div className="text-3xl font-black text-slate-900 dark:text-white">{totalPages.toLocaleString()}</div>
               <div className="text-xs text-slate-500">Pages Read</div>
             </div>
             <span className="material-symbols-outlined text-blue-500 text-3xl">auto_stories</span>
          </div>
          <div className="flex justify-between items-end">
             <div>
               <div className="text-3xl font-black text-slate-900 dark:text-white">{finished.length}</div>
               <div className="text-xs text-slate-500">Books Completed</div>
             </div>
             <span className="material-symbols-outlined text-green-500 text-3xl">check_circle</span>
          </div>
          <div className="flex justify-between items-end">
             <div>
               <div className="text-3xl font-black text-slate-900 dark:text-white">{avgRating}</div>
               <div className="text-xs text-slate-500">Average Rating</div>
             </div>
             <span className="material-symbols-outlined text-yellow-500 text-3xl">star_half</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e293b]/30 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
        <h4 className="text-slate-500 text-xs font-bold uppercase mb-4">Rating Distribution</h4>
        <div className="space-y-3 pt-2">
          {[5, 4, 3, 2, 1].map(star => {
            const count = ratings.filter(r => Math.round(r) === star).length;
            const percent = ratings.length ? (count / ratings.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <div className="w-8 font-bold flex items-center gap-1">{star} <span className="material-symbols-outlined text-[10px] text-yellow-500">star</span></div>
                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${percent}%` }}></div>
                </div>
                <div className="w-8 text-right text-slate-500">{count}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

// --- Shared UI Components ---
const StatBox = ({ value, label }: { value: number, label: string }) => (
  <div className="bg-slate-50 dark:bg-[#0f172a] p-4 text-center group hover:bg-white dark:hover:bg-slate-900 transition-colors">
    <div className="text-xl font-bold text-slate-900 dark:text-white group-hover:scale-110 transition-transform duration-300">{value}</div>
    <div className="text-[10px] text-slate-500 uppercase font-black">{label}</div>
  </div>
);

const ReviewCard = ({ book }: { book: UserBook }) => (
  <div className="bg-white dark:bg-[#1e293b]/30 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-6 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm">
    <img src={book.books.cover_url} className="w-16 h-24 object-cover rounded shadow-lg shrink-0" alt={book.books.title} />
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-slate-900 dark:text-white">{book.books.title}</h4>
        <div className="flex text-yellow-400 text-xs">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`material-symbols-outlined text-[14px] ${i < book.rating ? 'fill-current' : 'text-slate-300 dark:text-slate-700'}`}>star</span>
          ))}
        </div>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400 my-2 line-clamp-3 leading-relaxed">"{book.review_text}"</p>
      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
        <span>{new Date(book.finished_at || book.updated_at).toLocaleDateString()}</span>
      </div>
    </div>
  </div>
);

const FannedListCard = ({ title, count, covers }: { title: string, count: number, covers: string[] }) => (
  <div className="group bg-white dark:bg-[#1e293b]/30 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all cursor-pointer">
    <h4 className="font-bold mb-1 text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">{title}</h4>
    <p className="text-[10px] text-slate-500 mb-6">{count} books</p>
    
    <div className="relative flex items-center justify-center h-32 bg-slate-100 dark:bg-black/20 rounded-xl overflow-hidden">
      {covers[2] && (
        <div className="absolute w-14 h-20 z-10 transition-all duration-300 translate-x-6 rotate-[12deg] opacity-60 group-hover:translate-x-16 group-hover:rotate-[25deg] group-hover:opacity-100">
          <img src={covers[2]} className="w-full h-full object-cover rounded shadow-md border border-white/10" />
        </div>
      )}
      {covers[1] && (
        <div className="absolute w-16 h-22 z-20 transition-all duration-300 translate-x-0 rotate-0 group-hover:scale-110 shadow-xl">
          <img src={covers[1]} className="w-full h-full object-cover rounded shadow-xl border border-white/10" />
        </div>
      )}
      {covers[0] ? (
        <div className="absolute w-14 h-20 z-30 transition-all duration-300 -translate-x-6 rotate-[-12deg] group-hover:-translate-x-16 group-hover:rotate-[-25deg]">
          <img src={covers[0]} className="w-full h-full object-cover rounded shadow-md border border-white/10" />
        </div>
      ) : (
        <div className="text-xs text-slate-400">Empty List</div>
      )}
    </div>
  </div>
);

export default Profile;
