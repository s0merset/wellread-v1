import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header.tsx';
import { searchBooks, GoogleBook } from '@/lib/googleBooks';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";
import AddBookToListModal from '@/components/lists/AddToList.tsx';
import AIRecommendations from '@/components/discover/AIRecommendations.tsx';

interface ExtendedGoogleBook extends GoogleBook {
  rating?: number;
}

const Discover: React.FC = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ExtendedGoogleBook[]>([]);
  const [trending, setTrending] = useState<ExtendedGoogleBook[]>([]);
  const [arrivals, setArrivals] = useState<ExtendedGoogleBook[]>([]); // Removed 'curated' state
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userLibraryTitles, setUserLibraryTitles] = useState<string[]>([]);

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | null>(null);

  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeListInfo, setActiveListInfo] = useState({ id: "discovery-default", title: "My Library" });

  // 1. Correctly Join user_books and books to get Titles
  useEffect(() => {
    const getUserLibrary = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from('user_books')
        .select(`
          book_id,
          books (
            title
          )
        `)
        .eq('user_id', user.id)
        .limit(12);

      if (data && data.length > 0) {
        // Correctly mapping nested join data
        const titles = data
          .map((item: any) => item.books?.title)
          .filter(Boolean);
        setUserLibraryTitles(titles);
      } else {
        // Fallback for new users
        setUserLibraryTitles(["The Great Gatsby", "1984", "The Hobbit", "Dune"]);
      }
    };
    getUserLibrary();
  }, []);

  const buildFilteredQuery = useCallback((baseQuery: string) => {
    let final = baseQuery || "subject:fiction";
    if (selectedGenres.length > 0) {
      const subjects = selectedGenres.map(g => `subject:${g.toLowerCase()}`).join('+');
      final += `+${subjects}`;
    }
    return final;
  }, [selectedGenres]);

  const applyFilters = useCallback((books: ExtendedGoogleBook[]) => {
    if (!minRating) return books;
    return books.filter(book => (book.rating || 0) >= minRating);
  }, [minRating]);

  // 2. Updated Fetch: Removed Curated (AI replaces this)
  useEffect(() => {
    const fetchDiscoveryData = async () => {
      if (isSearching) return;
      setLoading(true);
      try {
        const [trendData, arrivalsData] = await Promise.all([
          searchBooks(buildFilteredQuery("inauthor:Dostoevsky+OR+inauthor:Tolstoy")),
          searchBooks(buildFilteredQuery("orderBy=newest"))
        ]);
        setTrending(applyFilters(trendData as ExtendedGoogleBook[]).slice(0, 6));
        setArrivals(applyFilters(arrivalsData as ExtendedGoogleBook[]).slice(0, 6));
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchDiscoveryData();
  }, [isSearching, buildFilteredQuery, applyFilters]);

  useEffect(() => {
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
        setSearchResults(applyFilters(results as ExtendedGoogleBook[]));
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, selectedGenres, buildFilteredQuery, applyFilters]);

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
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-text-main font-display min-h-screen flex flex-col antialiased">
      <Header variant="app" />
      
      <AddBookToListModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={() => { toast.success("Added to library!"); setIsAddModalOpen(false); }}
        book={selectedBook}
        listId={activeListInfo.id}
        listTitle={activeListInfo.title}
      />

      <main className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto">
        {/* Sidebar (Existing code remains the same) */}
        <aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 px-6 py-8 h-[calc(100vh-64px)] sticky top-[64px] overflow-y-auto">
           {/* Sidebar Content... */}
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          {/* Hero Section */}
          <section className="relative pt-12 pb-8 px-6 lg:px-12 border-b border-slate-200 dark:border-slate-800">
             {/* Search input logic... */}
          </section>

          <div className="p-6 lg:p-10 space-y-16">
            {isSearching ? (
              <section className="animate-in fade-in duration-300">
                <SectionHeader title="Results" subtitle="Filtered library results" icon="manage_search" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-10">
                  {searchResults.map((book) => (
                    <BookCard key={book.id} title={book.title} author={book.author} rating={book.rating || 4.0} cover={book.cover_url} onAddClick={() => handleOpenAddModal(book)} />
                  ))}
                </div>
              </section>
            ) : (
              <>
                {/* FIRST: TRENDING */}
                <DiscoveryList title="Trending This Week" icon="trending_up" data={trending} onAdd={handleOpenAddModal} />

                {/* SECOND: ACTUAL AI RECOMMENDATIONS (Replacing Curated Section) */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                   <AIRecommendations userList={userLibraryTitles} onAdd={handleOpenAddModal}/>
                </div>

                {/* THIRD: NEW ARRIVALS */}
                <DiscoveryList title="New Arrivals" icon="check_circle" data={arrivals} onAdd={handleOpenAddModal} />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// ... Helper components (DiscoveryList, SectionHeader, etc) stay the same
// HELPER COMPONENTS
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
