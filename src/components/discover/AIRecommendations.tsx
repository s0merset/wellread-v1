import React, { useEffect, useState, useCallback } from 'react';
import { fetchGroqRecommendations } from "@/lib/groqService";
import { RecommendedBook } from "@/types";

// --- REUSING YOUR UI COMPONENTS FOR CONSISTENCY ---
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

const BookCard = ({ title, author, rating, cover, onAddClick, reason }: any) => (
  <div className="group relative flex flex-col gap-3">
    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl shadow-lg bg-slate-100 dark:bg-[#1e293b] ring-1 ring-black/5 dark:ring-white/10 group-hover:shadow-glow group-hover:ring-primary/50 transition-all duration-300">
      <img alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src={cover || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=500"} loading="lazy" />
      
      {/* Rating Badge */}
      <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1">
        <span className="material-symbols-outlined text-[12px] text-yellow-400 fill-[1]">star</span> {rating}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-4 backdrop-blur-[2px]">
        {/* We can show the AI "Reason" here as a tooltip/info */}
        <p className="text-[9px] text-white/80 text-center italic mb-2 px-2 line-clamp-3">"{reason}"</p>
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

interface Props {
  userList: string[];
  onAdd: (book: any) => void;
}

const AIRecommendations: React.FC<Props> = ({ userList, onAdd }) => {
  const [recommendations, setRecommendations] = useState<RecommendedBook[]>([]);
  const [loading, setLoading] = useState(false);

const getCovers = async (books: RecommendedBook[]) => {
  return Promise.all(
    books.map(async (book) => {
      const query = encodeURIComponent(`${book.title} ${book.author}`);
      try {
        // ADDING A TIMESTAMP (?t=...) forces a fresh request every time
        const timestamp = new Date().getTime();
        const res = await fetch(
          `https://openlibrary.org/search.json?q=${query}&limit=1&_t=${timestamp}`, 
          { cache: 'no-store' } // Force browser to ignore cache
        );
        
        const data = await res.json();
        const coverId = data.docs[0]?.cover_i;
        
        return {
          ...book,
          cover: coverId 
            ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` 
            : undefined
        };
      } catch (e) {
        return book;
      }
    })
  );
};

  const handleGenerate = useCallback(async () => {
    if (userList.length === 0) return;
    setLoading(true);
    try {
      const books = await fetchGroqRecommendations(userList);
      const withCovers = await getCovers(books);
      setRecommendations(withCovers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userList]);

  useEffect(() => {
    if (userList.length > 0 && recommendations.length === 0) {
      handleGenerate();
    }
  }, [userList, handleGenerate, recommendations.length]);

  if (loading) {
    return (
      <section className="animate-pulse">
        <SectionHeader title="Curated For You" subtitle="Analyzing your library..." icon="auto_awesome" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[2/3] w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <section>
      <SectionHeader 
        title="Curated For You" 
        subtitle="Personalized picks based on your reading history." 
        icon="auto_awesome" 
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-10">
        {recommendations.map((book, i) => (
          <BookCard 
            key={i} 
            title={book.title} 
            author={book.author} 
            rating={4.8} // AI recommendations are high matches
            cover={book.cover} 
            reason={book.reason}
            onAddClick={() => onAdd({
              title: book.title,
              author: book.author,
              cover_url: book.cover
            })} 
          />
        ))}
      </div>
    </section>
  );
};

export default AIRecommendations;
