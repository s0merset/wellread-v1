import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";
import CreateListModal from '@/components/lists/CreateListModal';
import AddBookToListModal from '@/components/lists/AddToList';

// Define the interface for dynamic list data
interface ListData {
  id: string;
  title: string;
  is_public: boolean;
  tag: string;
  book_count: number;
  covers: string[];
}

const Lists: React.FC = () => {
  const [lists, setLists] = useState<ListData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [activeList, setActiveList] = useState<{ id: string, title: string } | null>(null);

  // 1. Fetch Lists from Supabase
  const fetchLists = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('lists')
        .select(`
          *,
          list_items (
            books (cover_url)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formatted = data.map((list: any) => ({
        id: list.id,
        title: list.title,
        is_public: list.is_public,
        tag: list.tag || "#general",
        book_count: list.list_items?.length || 0,
        covers: list.list_items?.slice(0, 3).map((item: any) => item.books.cover_url) || []
      }));

      setLists(formatted);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  // 2. Open Search Modal for a specific list
  const handleOpenSearch = (id: string, title: string) => {
    setActiveList({ id, title });
    setIsSearchModalOpen(true);
  };

  // 3. Filter logic for search
  const filteredLists = lists.filter(l =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display min-h-screen transition-colors duration-200">
      <Header variant="app" />

      {/* Create List Pop-up */}
      <CreateListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchLists}
      />

      {/* Add Book to List Pop-up */}
      <AddBookToListModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSuccess={fetchLists}
        listId={activeList?.id || null}
        listTitle={activeList?.title || null}
      />

      <main className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto">
        <aside className="hidden md:flex w-70 border-r border-slate-200 dark:border-slate-800 ">
          <Sidebar type="lists" />
        </aside>

        <div className="flex-1 flex flex-col min-w-0 ml-30">
          <div className="sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-6 lg:px-10 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Your Lists</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and curate your collections.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span>Create New List</span>
              </button>
            </div>
            <div className="relative max-w-lg">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <span className="material-symbols-outlined">search</span>
              </span>
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Search your lists..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="p-6 lg:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

              {/* Render User Lists */}
              {!loading && filteredLists.map((list) => (
                <ListCard
                  key={list.id}
                  title={list.title}
                  count={list.book_count}
                  isPublic={list.is_public}
                  tag={list.tag}
                  onAdd={() => handleOpenSearch(list.id, list.title)}
                  covers={list.covers.length >= 3 ? list.covers : [
                    ...list.covers,
                    "https://via.placeholder.com/150?text=Empty",
                    "https://via.placeholder.com/150?text=Empty",
                    "https://via.placeholder.com/150?text=Empty"
                  ].slice(0, 3)}
                />
              ))}

              {/* Skeleton/Empty State */}
              {loading && <div className="col-span-full py-12 text-center text-slate-400 animate-pulse font-bold">Syncing your library...</div>}

              {/* Create New List Placeholder Card */}
              <div
                onClick={() => setIsModalOpen(true)}
                className="group relative dark:bg-surface-dark rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-all shadow-sm flex flex-col h-full hover:shadow-md cursor-pointer border-dashed"
              >
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                  <div className="w-16 h-16 rounded-full dark:border-slate-700 dark:bg-surface-dark bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl text-primary">add</span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Create New List</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Updated ListCard Component with onAdd prop
const ListCard: React.FC<{
  title: string;
  count: number;
  isPublic: boolean;
  tag: string;
  covers: string[];
  onAdd: () => void;
}> = ({ title, count, isPublic, tag, covers, onAdd }) => (
  <div className="group dark:bg-surface-dark rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-all shadow-sm flex flex-col h-full hover:shadow-md cursor-pointer">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1 min-w-0 mr-2">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-tight truncate">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{count} books • Updated recently</p>
      </div>
      <div className="flex items-center gap-1">
        {/* ADD BOOK BUTTON */}
        <button 
          onClick={(e) => { e.stopPropagation(); onAdd(); }}
          className="p-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all transform active:scale-90"
          title="Add a book to this list"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
        </button>
        <button className="text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>
    </div>

    <div className="relative flex items-center justify-center mb-5 h-40 bg-slate-50 dark:bg-black/20 rounded-lg overflow-hidden">
      <div className="absolute w-20 h-28 z-10 transition-all duration-300 ease-out translate-x-8 rotate-[12deg] opacity-70 group-hover:translate-x-20 group-hover:rotate-[25deg] group-hover:opacity-100">
        <img alt="c3" className="w-full h-full object-cover rounded shadow-md border border-white/20" src={covers[2]} />
      </div>
      <div className="absolute w-20 h-28 z-20 transition-all duration-300 ease-out translate-x-0 rotate-0 group-hover:scale-110 group-hover:shadow-2xl">
        <img alt="c2" className="w-full h-full object-cover rounded shadow-lg border border-white/20" src={covers[1]} />
      </div>
      <div className="absolute w-20 h-28 z-30 transition-all duration-300 ease-out -translate-x-8 rotate-[-12deg] group-hover:-translate-x-20 group-hover:rotate-[-25deg] group-hover:scale-105">
        <img alt="c1" className="w-full h-full object-cover rounded shadow-2xl border border-white/20" src={covers[0]} />
      </div>
    </div>

    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded ${isPublic ? 'text-green-600 bg-green-500/10' : 'text-slate-500 bg-slate-100'}`}>
        <span className="material-symbols-outlined text-[14px]">{isPublic ? 'public' : 'lock'}</span> {isPublic ? 'Public' : 'Private'}
      </span>
      <span className="text-xs text-slate-400 font-medium">{tag}</span>
    </div>
  </div>
);

export default Lists;
