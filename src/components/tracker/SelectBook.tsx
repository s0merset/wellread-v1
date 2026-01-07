import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// --- Types ---
interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string;
  total_pages: number;
}

interface SearchResult {
  book: Book;
  listName: string;
  trackerStatus: string | null;
  userBookId: string | null;
}

interface SelectBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SelectBookModal: React.FC<SelectBookModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setResults([]);
      fetchListBooks();
    }
  }, [isOpen]);

  const fetchListBooks = async () => {
    try {
      setLoadingData(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // --- UPDATED QUERY ---
      // 1. We use 'lists:list_id' to explicitly specify the Foreign Key join.
      // 2. We select '*' from lists to avoid errors if the column is 'title' instead of 'name'.
      const { data: listData, error: listError } = await supabase
        .from('list_items')
        .select(`
          book_id,
          books:book_id (
            id, title, author, cover_url, total_pages
          ),
          lists:list_id!inner (
            *
          )
        `)
        .eq('lists.user_id', user.id) // Filter by the joined list owner
        .order('created_at', { ascending: false })
        .limit(100);

      if (listError) {
        console.error("List Fetch Error:", listError);
        // Fallback: If the error persists, it might be due to RLS or permissions.
        throw listError;
      }

      // --- Fetch Tracker Status ---
      const { data: trackerItems } = await supabase
        .from('user_books')
        .select('id, book_id, status')
        .eq('user_id', user.id);

      const trackerMap = new Map(trackerItems?.map(i => [i.book_id, i]) || []);

      // --- Format Data ---
      const formattedResults: SearchResult[] = (listData || []).map((item: any) => {
        if (!item.books) return null;

        const trackerEntry = trackerMap.get(item.book_id);
        
        // FLEXIBLE NAME CHECK: Checks for 'name' OR 'title'
        const listName = item.lists?.name || item.lists?.title || 'Unknown List';

        return {
          book: item.books,
          listName: listName,
          trackerStatus: trackerEntry?.status || null,
          userBookId: trackerEntry?.id || null
        };
      }).filter(Boolean) as SearchResult[];

      // Deduplicate results
      const uniqueResults = formattedResults.filter((v, i, a) => 
        a.findIndex(t => t.book.id === v.book.id) === i
      );

      setResults(uniqueResults);

    } catch (error: any) {
      console.error("Error details:", error);
      toast.error(`Error: ${error.message || 'Could not load lists'}`);
    } finally {
      setLoadingData(false);
    }
  };

  // Client-side search logic
  const filteredResults = results.filter(item => 
    item.book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.listName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartReading = async (item: SearchResult) => {
    try {
      setProcessingId(item.book.id);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (item.userBookId) {
        const { error } = await supabase
          .from('user_books')
          .update({ 
            status: 'reading',
            current_page: 0,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.userBookId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_books')
          .insert({
            user_id: user.id,
            book_id: item.book.id,
            status: 'reading',
            current_page: 0
          });
        if (error) throw error;
      }

      toast.success(`Started reading "${item.book.title}"`);
      onSuccess();
      onClose();

    } catch (error) {
      console.error(error);
      toast.error("Failed to start book");
    } finally {
      setProcessingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-hidden">
        
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Start a New Book</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Select from your <span className="text-primary font-bold">Reading Lists</span>
              </p>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
            <input 
              type="text"
              placeholder="Search by title, author, or list name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
          {loadingData ? (
             <div className="flex justify-center py-10">
               <span className="material-symbols-outlined animate-spin text-primary text-2xl">sync</span>
             </div>
          ) : filteredResults.length > 0 ? (
            filteredResults.map((item) => (
              <div 
                key={item.book.id} 
                className={`group flex items-center gap-4 p-3 rounded-xl border border-transparent transition-all shadow-sm
                  ${item.trackerStatus === 'reading' 
                    ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 opacity-70' 
                    : 'bg-white dark:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-md cursor-pointer'
                  }`}
                onClick={() => item.trackerStatus !== 'reading' && handleStartReading(item)}
              >
                <div className="relative shrink-0">
                  <img 
                    src={item.book.cover_url || 'https://via.placeholder.com/100x150'} 
                    alt={item.book.title}
                    className="w-12 h-16 object-cover rounded shadow border border-slate-200 dark:border-slate-700"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-slate-100 dark:bg-slate-700 text-[9px] font-bold px-1.5 py-0.5 rounded shadow border border-slate-200 dark:border-slate-600 truncate max-w-[80px] text-slate-500 dark:text-slate-300">
                    {item.listName}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-white truncate text-base">{item.book.title}</h4>
                  <p className="text-xs font-medium text-slate-500 truncate">{item.book.author}</p>
                  
                  {item.trackerStatus && (
                    <p className={`text-[10px] font-bold uppercase mt-1 flex items-center gap-1 ${
                      item.trackerStatus === 'finished' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                    }`}>
                      <span className="material-symbols-outlined text-[10px]">{item.trackerStatus === 'finished' ? 'check_circle' : 'timelapse'}</span>
                      {item.trackerStatus}
                    </p>
                  )}
                </div>

                <button 
                  disabled={processingId === item.book.id || item.trackerStatus === 'reading'}
                  className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all
                    ${item.trackerStatus === 'reading' 
                      ? 'bg-transparent text-blue-400 cursor-default' 
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-400 group-hover:bg-primary group-hover:text-white'
                    }`}
                >
                  {processingId === item.book.id ? (
                    <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                  ) : item.trackerStatus === 'reading' ? (
                    <span className="material-symbols-outlined text-lg">trending_flat</span>
                  ) : (
                    <span className="material-symbols-outlined text-lg">play_arrow</span>
                  )}
                </button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center opacity-60">
              <span className="material-symbols-outlined text-4xl mb-2 text-slate-400">bookmark_border</span>
              <p className="text-sm font-medium text-slate-500">No matching books found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectBookModal;
