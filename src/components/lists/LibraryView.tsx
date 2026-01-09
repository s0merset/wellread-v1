import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';

interface LibraryViewProps {
  filter: 'all' | 'reading' | 'finished';
}

const LibraryView: React.FC<LibraryViewProps> = ({ filter }) => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let query = supabase.from('user_books').select('*, books:book_id(*)').eq('user_id', user.id);
    
    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data } = await query.order('updated_at', { ascending: false });
    setBooks(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchBooks(); }, [filter]);

  const titles = { all: "All Books", reading: "Currently Reading", finished: "Books Read" };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
      <Header variant="app" />
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <aside className="hidden md:flex w-70 border-r border-slate-200 dark:border-slate-800">
           <Sidebar type="tracker" /> {/* Pass your counts/profile here as well */}
        </aside>
        
        <main className="flex-1 p-6 lg:p-10">
          <h1 className="text-3xl font-extrabold mb-6">{titles[filter]}</h1>
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
             {/* Reuse your Table Logic from Tracker.tsx here */}
             {books.length > 0 ? (
               <table className="w-full text-left">
                  {/* ... same table headers and rows as Tracker.tsx ... */}
               </table>
             ) : (
               <div className="p-20 text-center text-slate-400">No books found in this category.</div>
             )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LibraryView;
