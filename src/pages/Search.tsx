import React, { useState, useEffect } from 'react';
import Header from '../components/Header.tsx';
import { searchBooks, GoogleBook } from '@/lib/googleBooks';
import { supabase } from '@/lib/supabase'; // 1. Added Supabase import
import { toast } from "sonner";

// 2. Corrected Import to match your component usage
import AddBookToListModal from '@/components/lists/AddToList.tsx';

const Discover: React.FC = () => {
  // --- STATE ---
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GoogleBook[]>([]);
  const [trending, setTrending] = useState<GoogleBook[]>([]);
  const [curated, setCurated] = useState<GoogleBook[]>([]);
  const [arrivals, setArrivals] = useState<GoogleBook[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- NEW STATES FOR LIST LOGIC ---
  const [lists, setLists] = useState<any[]>([]); // To store user's collections
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeList, setActiveList] = useState<{id: string, title: string} | null>(null);

  // --- 3. FETCH LISTS FUNCTION ---
  // This is passed to the modal to refresh data if needed
  const fetchLists = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching lists:", error.message);
    } else {
      setLists(data || []);
    }
  };

  // --- MODAL HANDLER ---
  const handleOpenAddModal = (book: any) => {
    setSelectedBook({
      title: book.title,
      author: book.author,
      cover_url: book.cover_url,
      total_pages: book.total_pages || 200
    });
    setIsAddModalOpen(true);
  };

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    fetchLists(); // Fetch lists on mount

    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [trendData, curatedData, arrivalsData] = await Promise.all([
          searchBooks("inauthor:Dostoevsky+OR+inauthor:Kafka+OR+inauthor:Camus+OR+inauthor:Tolstoy"),
          searchBooks("subject:philosophy+fiction"),
          searchBooks("subject:fiction&orderBy=newest")
        ]);
        
        setTrending(trendData.slice(0, 6));
        setCurated(curatedData.slice(0, 6));
        setArrivals(arrivalsData.slice(0, 6));
      } catch (error) {
        console.error("Error loading books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // --- REAL-TIME FUZZY SEARCH LOGIC ---
  useEffect(() => {
    if (!query.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      setIsSearching(true);
      try {
        const results = await searchBooks(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-text-main font-display min-h-screen flex flex-col transition-colors duration-200 antialiased">
      <Header variant="app" />
      
      {/* 4. Modal component logic integrated with all required props */}
      <AddBookToListModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={fetchLists}
        listId={activeList?.id || null} // This will be null on initial open, modal will handle choice
        listTitle={activeList?.title || null}
        book={selectedBook} 
      />

      <main className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto">
        {/* Filter Sidebar - REMAINS UNCHANGED */}
        <aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 px-6 py-8 h-[calc(100vh-64px)] sticky top-[64px] overflow-y-auto custom-scrollbar bg-background-light dark:bg-background-dark/50">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Filter Books</h3>
            <button className="text-xs text-primary font-bold hover:text-primary-hover transition-colors">Reset All</button>
          </div>

          <FilterGroup title="Genres">
            {['Fiction', 'Non-Fiction', 'Sci-Fi & Fantasy', 'Mystery', 'History'].map(genre => (
              <label key={genre} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer group transition-colors -mx-2">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary/20 bg-transparent" />
                <span className="text-slate-600 dark:text-slate-300 group-hover:text-primary text-sm font-medium">{genre}</span>
              </label>
            ))}
          </FilterGroup>

          <FilterGroup title="Min Rating">
             {[4, 3].map(rating => (
               <label key={rating} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer group transition-colors -mx-2">
                 <input type="radio" name="rating" className="h-4 w-4 border-slate-300 dark:border-slate-600 text-primary focus:ring-offset-0 bg-transparent" />
                 <div className="flex text-yellow-400 text-sm">
                   {[...Array(5)].map((_, i) => (
                     <span key={i} className={`material-symbols-outlined text-[18px] ${i < rating ? 'fill-[1]' : ''}`}>star</span>
                   ))}
                   <span className="ml-2 text-slate-600 dark:text-slate-300 text-sm font-medium">{rating}+ Stars</span>
                 </div>
               </label>
             ))}
          </FilterGroup>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <section className="relative pt-12 pb-8 px-6 lg:px-12 border-b border-slate-200 dark:border-slate-800">
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-8 text-slate-900 dark:text-white">
                What are you <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">reading next?</span>
              </h1>
              
              <form onSubmit={handleFormSubmit} className="relative group max-w-2xl mx-auto mb-6">
                <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl group-hover:bg-primary/40 transition-all opacity-0 group-hover:opacity-100 duration-500"></div>
                <label className="relative flex items-center w-full h-14 rounded-2xl bg-white dark:bg-surface-dark shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-200 dark:border-slate-700/50 overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                  <div className="pl-5 pr-3 text-slate-400">
                    <span className="material-symbols-outlined">{loading ? 'sync' : 'search'}</span>
                  </div>
                  <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="peer w-full outline-none h-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 text-base font-medium" 
                    placeholder="Search titles, authors, ISBNs..."
                    style={{ color: 'inherit' }}
                  />
                  {isSearching && (
                    <button 
                      type="button" 
                      onClick={() => { setQuery(""); }}
                      className="pr-5 text-slate-400 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  )}
                </label>
              </form>
            </div>
          </section>

          <div className="p-6 lg:p-10 space-y-16">
            {isSearching ? (
              <section>
                <SectionHeader title="Search Results" subtitle={loading ? "Searching..." : `Found matches for "${query}"`} icon="manage_search" />
                <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-10 transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`}>
                  {searchResults.map((book) => (
                    <BookCard 
                      key={book.id} 
                      title={book.title} 
                      author={book.author} 
                      rating={4.5} 
                      cover={book.cover_url}
                      onAddClick={() => handleOpenAddModal(book)} 
                    />
                  ))}
                </div>
              </section>
            ) : (
              <>
                <section>
                  <SectionHeader title="Trending This Week" subtitle="The most logged classics right now." icon="trending_up" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-10">
                    {trending.map(book => (
                      <BookCard 
                        key={book.id} 
                        title={book.title} 
                        author={book.author} 
                        rating={4.9} 
                        cover={book.cover_url} 
                        onAddClick={() => handleOpenAddModal(book)}
                      />
                    ))}
                  </div>
                </section>

                <section>
                  <SectionHeader title="Curated For You" subtitle="Philosophical fiction hand-picked for your taste." icon="auto_awesome" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-10">
                    {curated.map(book => (
                      <BookCard 
                        key={book.id} 
                        title={book.title} 
                        author={book.author} 
                        rating={4.7} 
                        cover={book.cover_url} 
                        onAddClick={() => handleOpenAddModal(book)}
                      />
                    ))}
                  </div>
                </section>

                <section>
                  <SectionHeader title="New Arrivals" subtitle="Hot off the press and available now." icon="check_circle" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-10">
                    {arrivals.map(book => (
                      <BookCard 
                        key={book.id} 
                        title={book.title} 
                        author={book.author} 
                        rating={4.4} 
                        cover={book.cover_url} 
                        onAddClick={() => handleOpenAddModal(book)}
                      />
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// --- STATIC SUB-COMPONENTS (UNCHANGED) ---
const FilterGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <h4 className="text-sm font-bold mb-4 text-slate-900 dark:text-white">{title}</h4>
    <div className="space-y-2">{children}</div>
  </div>
);

const SectionHeader = ({ title, subtitle, icon }: { title: string; subtitle: string; icon: string }) => (
  <div className="flex items-end justify-between mb-6 px-1">
    <div>
      <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
        <span className="material-symbols-outlined text-primary">{icon}</span>
        {title}
      </h3>
      <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
    </div>
    <button className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1 uppercase tracking-wider">
      View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
    </button>
  </div>
);

const BookCard = ({ title, author, rating, cover, onAddClick }: { title: string; author: string; rating: number; cover: string, onAddClick: () => void }) => (
  <div className="group relative flex flex-col gap-3">
    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-lg bg-slate-100 dark:bg-surface-dark ring-1 ring-black/5 dark:ring-white/10 group-hover:shadow-glow group-hover:ring-primary/50 transition-all duration-300">
      <img 
        alt={title} 
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
        src={cover || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=500"} 
        loading="lazy"
      />
      <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1">
        <span className="material-symbols-outlined text-[12px] text-yellow-400 fill-[1]">star</span> {rating}
      </div>
      
      <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-4 backdrop-blur-[2px]">
        <button 
          onClick={(e) => { e.preventDefault(); onAddClick(); }} 
          className="w-full py-2 bg-primary rounded font-bold text-xs text-white hover:bg-primary-hover shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
        >
          Want to Read
        </button>
        <button className="w-full py-2 bg-white/10 backdrop-blur border border-white/20 rounded font-bold text-xs text-white hover:bg-white/20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
          Log/Review
        </button>
      </div>
    </div>
    <div className="space-y-1">
      <h4 className="font-bold text-sm leading-tight text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{author}</p>
    </div>
  </div>
);

export default Discover;
