import React, { useState, useEffect } from 'react';
import Header from '../components/Header.tsx';
import { searchBooks, GoogleBook } from '@/lib/googleBooks';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";
import AddBookToListModal from '@/components/lists/AddToList.tsx';

const Discover: React.FC = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GoogleBook[]>([]);
  const [trending, setTrending] = useState<GoogleBook[]>([]);
  const [curated, setCurated] = useState<GoogleBook[]>([]);
  const [arrivals, setArrivals] = useState<GoogleBook[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter States
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | null>(null);

  // Modal States
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const buildFilteredQuery = (baseQuery: string) => {
    let final = baseQuery || "subject:fiction";
    if (selectedGenres.length > 0) {
      const subjects = selectedGenres.map(g => `subject:${g.toLowerCase()}`).join('+');
      final += `+${subjects}`;
    }
    return final;
  };

  const applyFilters = (books: GoogleBook[]) => {
    if (!minRating) return books;
    return books.filter(book => (book.rating || 0) >= minRating);
  };

  // 1. Fetch Discovery (When NOT searching)
  useEffect(() => {
    const fetchDiscoveryData = async () => {
      if (isSearching) return;
      setLoading(true);
      try {
        const [trendData, curatedData, arrivalsData] = await Promise.all([
          searchBooks(buildFilteredQuery("inauthor:Dostoevsky+OR+inauthor:Tolstoy")),
          searchBooks(buildFilteredQuery("subject:philosophy")),
          searchBooks(buildFilteredQuery("orderBy=newest"))
        ]);
        setTrending(applyFilters(trendData).slice(0, 6));
        setCurated(applyFilters(curatedData).slice(0, 6));
        setArrivals(applyFilters(arrivalsData).slice(0, 6));
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchDiscoveryData();
  }, [selectedGenres, minRating, isSearching]);

  // 2. Search Logic (Debounced)
  useEffect(() => {
    // FIX 1: Trigger "Searching" state immediately so UI reacts
    if (query.trim() || selectedGenres.length > 0) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchBooks(buildFilteredQuery(query));
        setSearchResults(applyFilters(results));
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, selectedGenres, minRating]);

  const handleOpenAddModal = (book: any) => {
    setSelectedBook({
      title: book.title,
      author: book.author,
      cover_url: book.cover_url,
      total_pages: book.total_pages || 200
    });
    setIsAddModalOpen(true);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-text-main font-display min-h-screen flex flex-col transition-colors duration-200 antialiased">
      <Header variant="app" />
      
      <AddBookToListModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        book={selectedBook} 
      />

      <main className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto">
        
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 px-6 py-8 h-[calc(100vh-64px)] sticky top-[64px] overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Filter Books</h3>
            <button onClick={() => {setSelectedGenres([]); setMinRating(null); setQuery("");}} className="text-xs text-primary font-bold hover:text-primary-hover">Reset All</button>
          </div>

          <FilterGroup title="Genres">
            {['Fiction', 'Philosophy', 'Science', 'Mystery', 'History'].map(genre => (
              <label key={genre} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer group transition-colors">
                <input 
                  type="checkbox" 
                  checked={selectedGenres.includes(genre)}
                  onChange={() => setSelectedGenres(prev => prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre])}
                  className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-primary" 
                />
                <span className={`text-sm font-medium transition-colors ${selectedGenres.includes(genre) ? 'text-primary' : 'text-slate-600 dark:text-slate-300'}`}>
                  {genre}
                </span>
              </label>
            ))}
          </FilterGroup>

          <FilterGroup title="Min Rating">
             {[4, 3].map(rating => (
               <label key={rating} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                 <input 
                   type="radio" 
                   name="rating" 
                   checked={minRating === rating}
                   onChange={() => setMinRating(rating)}
                   className="h-4 w-4 border-slate-300 dark:border-slate-600 text-primary" 
                 />
                 <div className="flex text-yellow-400 text-sm items-center">
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
          {/* Hero Section */}
          <section className="relative pt-12 pb-8 px-6 lg:px-12 border-b border-slate-200 dark:border-slate-800">
            {/* FIX 2: Background layer with pointer-events-none to prevent blocking the input */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
            
            <div className="relative z-20 max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-8 text-slate-900 dark:text-white">
                Explore <span className="text-primary">{selectedGenres.length > 0 ? selectedGenres[0] : "Library"}</span>
              </h1>
              
              <div className="relative group max-w-2xl mx-auto mb-6">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl transition-all opacity-0 group-hover:opacity-100 duration-500"></div>
                <label className="relative flex items-center w-full h-14 rounded-2xl bg-white dark:bg-[#1e293b] shadow-xl border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary/50 transition-all cursor-text">
                  <div className="pl-5 pr-3 text-slate-400">
                    <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>
                      {loading ? 'sync' : 'search'}
                    </span>
                  </div>
                  {/* FIX 3: Robust text coloring and auto-focus logic */}
                  <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full outline-none h-full bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 text-base font-medium pr-4" 
                    placeholder="Search titles, authors, ISBNs..."
                    autoFocus
                  />
                </label>
              </div>
            </div>
          </section>

          {/* Main Feed */}
          <div className="p-6 lg:p-10 space-y-16">
            {isSearching ? (
              <section className="animate-in fade-in duration-300">
                <SectionHeader title="Results" subtitle={loading ? "Searching..." : `Filtered library results`} icon="manage_search" />
                <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-10 transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`}>
                  {searchResults.map((book) => (
                    <BookCard key={book.id} title={book.title} author={book.author} rating={book.rating || 4.0} cover={book.cover_url} onAddClick={() => handleOpenAddModal(book)} />
                  ))}
                  {searchResults.length === 0 && !loading && (
                    <div className="col-span-full py-10 text-center text-slate-500 font-medium">No books found for this selection.</div>
                  )}
                </div>
              </section>
            ) : (
              <>
                <DiscoveryList title="Trending This Week" icon="trending_up" data={trending} onAdd={handleOpenAddModal} />
                <DiscoveryList title="Curated For You" icon="auto_awesome" data={curated} onAdd={handleOpenAddModal} />
                <DiscoveryList title="New Arrivals" icon="check_circle" data={arrivals} onAdd={handleOpenAddModal} />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// --- HELPERS ---
const DiscoveryList = ({ title, icon, data, onAdd }: any) => (
  <section>
    <SectionHeader title={title} subtitle="Based on your library activity." icon={icon} />
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-10">
      {data.map((book: any) => (
        <BookCard key={book.id} title={book.title} author={book.author} rating={book.rating || 4.5} cover={book.cover_url} onAddClick={() => onAdd(book)} />
      ))}
    </div>
  </section>
);

const FilterGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <h4 className="text-sm font-bold mb-4 text-slate-900 dark:text-white uppercase tracking-tight">{title}</h4>
    <div className="space-y-2">{children}</div>
  </div>
);

const SectionHeader = ({ title, subtitle, icon }: { title: string; subtitle: string; icon: string }) => (
  <div className="flex items-end justify-between mb-6 px-1">
    <div>
      <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white uppercase tracking-tight">
        <span className="material-symbols-outlined text-primary font-fill">{icon}</span>
        {title}
      </h3>
      <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
    </div>
  </div>
);

const BookCard = ({ title, author, rating, cover, onAddClick }: any) => (
  <div className="group relative flex flex-col gap-3">
    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl shadow-lg bg-slate-100 dark:bg-[#1e293b] ring-1 ring-black/5 dark:ring-white/10 group-hover:shadow-glow group-hover:ring-primary/50 transition-all duration-300">
      <img alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src={cover || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=500"} loading="lazy" />
      <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1">
        <span className="material-symbols-outlined text-[12px] text-yellow-400 fill-[1]">star</span> {rating}
      </div>
      <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-4 backdrop-blur-[2px]">
        <button onClick={(e) => { e.preventDefault(); onAddClick(); }} className="w-full py-2 bg-primary rounded-xl font-bold text-[10px] uppercase text-white hover:bg-primary-hover shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          Want to Read
        </button>
      </div>
    </div>
    <div className="space-y-1">
      <h4 className="font-bold text-sm leading-tight text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 uppercase font-bold tracking-tighter">{author}</p>
    </div>
  </div>
);

export default Discover;
