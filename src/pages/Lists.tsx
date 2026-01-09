import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";
import CreateListModal from '@/components/lists/CreateListModal';
import AddBookToListModal from '@/components/lists/AddToList';
import UpdateListModal from '@/components/lists/UpdateList';
import ListViewModal from '@/components/lists/ListView';

// Define the interface for dynamic list data
interface ListData {
  id: string;
  title: string;
  is_public: boolean;
  tag: string;
  book_count: number;
  covers: string[];
}

// Interface for the book object required by the AddBook Modal
interface BookData {
  title: string;
  author: string;
  cover_url: string;
  total_pages: number;
}

const Lists: React.FC = () => {
  const [lists, setLists] = useState<ListData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modal Visibility States
  const [activeModal, setActiveModal] = useState<'create' | 'add' | 'update' | 'delete' | 'view' | null>(null);
  
  // State for the list currently being interacted with
  const [selectedList, setSelectedList] = useState<ListData | null>(null);
  const [selectedBook, setSelectedBook] = useState<BookData | null>(null);

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
      toast.error("Failed to sync library");
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  // Action Handlers
  const handleAction = (type: 'create' | 'add' | 'update' | 'delete' | 'view', list: ListData | null = null) => {
    setSelectedList(list);
    setActiveModal(type);
  };

  const filteredLists = lists.filter(l =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display min-h-screen transition-colors duration-200">
      <Header variant="app" />

      {/* --- ALL MODALS --- */}
      <CreateListModal
        isOpen={activeModal === 'create'}
        onClose={() => setActiveModal(null)}
        onSuccess={fetchLists}
      />

<AddBookToListModal
        isOpen={activeModal === 'add'}
        onClose={() => {
            setActiveModal(null);
            setSelectedBook(null); // Clean up state on close
        }}
        onSuccess={fetchLists}
        listId={selectedList?.id || null}
        listTitle={selectedList?.title || null}
        book={selectedBook} // <--- FIXED: Added the required book prop
      />
      <UpdateListModal 
        isOpen={activeModal === 'update'}
        onClose={() => setActiveModal(null)}
        onSuccess={fetchLists}
        list={selectedList}
      />


      <ListViewModal 
        isOpen={activeModal === 'view'}
        onClose={() => setActiveModal(null)}
        listId={selectedList?.id || ""}
        listTitle={selectedList?.title || ""}
        onRefresh={fetchLists}
      />

      <main className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto">
        <aside className="hidden md:flex w-70 border-r border-slate-200 dark:border-slate-800 ">
          <Sidebar type="lists" />
        </aside>

        <div className="flex-1 flex flex-col min-w-0 ml-30">
          <div className="sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-6 lg:px-10 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">Your Lists</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and curate your collections.</p>
              </div>
              <button
                onClick={() => handleAction('create')}
                className="flex items-center justify-center gap-2 rounded-xl h-11 px-6 bg-primary hover:bg-blue-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all"
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
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all"
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
                  list={list}
                  onView={() => handleAction('view', list)}
                  onAdd={() => handleAction('add', list)}
                  onUpdate={() => handleAction('update', list)}
                  onDelete={() => handleAction('delete', list)}
                />
              ))}

              {/* Skeleton/Empty State */}
              {loading && <div className="col-span-full py-12 text-center text-slate-400 animate-pulse font-bold uppercase tracking-widest text-xs">Syncing your library...</div>}

              {/* Create New List Placeholder Card */}
              <div
                onClick={() => handleAction('create')}
                className="group relative dark:bg-surface-dark rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-all shadow-sm flex flex-col h-full hover:shadow-md cursor-pointer border-dashed min-h-[320px]"
              >
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-2xl dark:bg-slate-800 bg-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                    <span className="material-symbols-outlined text-3xl text-primary font-fill">add_circle</span>
                  </div>
                  <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Create New List</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Updated ListCard with Menu Options
const ListCard: React.FC<{
  list: ListData;
  onAdd: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  onView: () => void;
}> = ({ list, onAdd, onUpdate, onDelete, onView }) => {
  const [showMenu, setShowMenu] = useState(false);

  // Auto-fill covers if empty
  const displayCovers = list.covers.length >= 3 ? list.covers : [
    ...list.covers,
    "https://via.placeholder.com/150?text=Empty",
    "https://via.placeholder.com/150?text=Empty",
    "https://via.placeholder.com/150?text=Empty"
  ].slice(0, 3);

  return (
    <div 
      onClick={onView}
      className="group relative dark:bg-surface-dark rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-all shadow-sm flex flex-col h-full hover:shadow-xl cursor-pointer bg-white"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-2">
          <h3 className="font-black text-lg text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-tight truncate uppercase tracking-tight">
            {list.title}
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            {list.book_count} books • {list.tag}
          </p>
        </div>
        
        <div className="flex items-center gap-1 relative">
          <button 
            onClick={(e) => { e.stopPropagation(); onAdd(); }}
            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all transform active:scale-90"
            title="Add a book"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
          </button>
          
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">more_vert</span>
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-20 py-2 animate-in fade-in zoom-in-95 duration-150">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); onUpdate(); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span> Edit Details
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete(); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span> Delete List
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center mb-5 h-44 bg-slate-50 dark:bg-black/20 rounded-xl overflow-hidden group-hover:bg-slate-100 dark:group-hover:bg-black/40 transition-colors">
        <div className="absolute w-22 h-32 z-10 transition-all duration-500 ease-out translate-x-10 rotate-[15deg] opacity-70 group-hover:translate-x-24 group-hover:rotate-[25deg] group-hover:opacity-100">
          <img alt="c3" className="w-full h-full object-cover rounded-lg shadow-md border-2 border-white/20" src={displayCovers[2]} />
        </div>
        <div className="absolute w-22 h-32 z-20 transition-all duration-500 ease-out translate-x-0 rotate-0 group-hover:scale-110 group-hover:shadow-2xl">
          <img alt="c2" className="w-full h-full object-cover rounded-lg shadow-xl border-2 border-white/20" src={displayCovers[1]} />
        </div>
        <div className="absolute w-22 h-32 z-30 transition-all duration-500 ease-out -translate-x-10 rotate-[-15deg] group-hover:-translate-x-24 group-hover:rotate-[-25deg] group-hover:scale-105">
          <img alt="c1" className="w-full h-full object-cover rounded-lg shadow-2xl border-2 border-white/20" src={displayCovers[0]} />
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg ${list.is_public ? 'text-emerald-600 bg-emerald-500/10' : 'text-slate-500 bg-slate-100'}`}>
          <span className="material-symbols-outlined text-[14px]">{list.is_public ? 'public' : 'lock'}</span> {list.is_public ? 'Public' : 'Private'}
        </span>
        <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
          View List
        </button>
      </div>
    </div>
  );
};

export default Lists;
