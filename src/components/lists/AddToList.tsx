import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { searchBooks, GoogleBook } from '@/lib/googleBooks';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UserList {
  id: string;
  title: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  listId: string | null; // This comes in as "discovery-default"
  listTitle: string | null;
  book: {
    title: string;
    author: string;
    cover_url: string;
    total_pages: number;
  } | null;
}

const AddBookToListModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, listId: initialListId, listTitle: initialListTitle, book }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GoogleBook[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State for the user's actual lists from the database
  const [userLists, setUserLists] = useState<UserList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>(""); 
  const [fetchingLists, setFetchingLists] = useState(false);

  // 1. Fetch real lists from Supabase when the modal opens
  useEffect(() => {
    const loadData = async () => {
      if (!isOpen) return;
      
      setFetchingLists(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("Please sign in to add books");
          return;
        }

        const { data: lists, error } = await supabase
          .from('lists')
          .select('id, title')
          .eq('user_id', user.id) // Ensure this column name matches your DB (usually user_id)
          .order('title', { ascending: true });

        if (error) throw error;

        setUserLists(lists || []);

        // SELECTION LOGIC:
        // If the ID passed in is a real UUID (longer than a placeholder string)
        const isRealUuid = initialListId && initialListId.length > 20;

        if (isRealUuid) {
          setSelectedListId(initialListId);
        } else if (lists && lists.length > 0) {
          // If we're on the Discover page, auto-select the first list found in the DB
          setSelectedListId(lists[0].id);
        }
      } catch (err: any) {
        console.error("List fetch error:", err);
        toast.error("Could not load your lists");
      } finally {
        setFetchingLists(false);
      }
    };

    loadData();
  }, [isOpen, initialListId]);

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      const books = await searchBooks(query);
      setResults(books);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const performAddAction = async (targetBook: any) => {
    // Check if we have a real UUID. If it's still "discovery-default" or empty, stop.
    if (!selectedListId || selectedListId.length < 20) {
      toast.error("Please select a specific list from the dropdown first.");
      return;
    }

    setLoading(true);
    try {
      // 1. Get or Create Book in global table
      let { data: existingBook } = await supabase
        .from('books')
        .select('id')
        .eq('title', targetBook.title)
        .eq('author', targetBook.author)
        .maybeSingle();

      let bookId = existingBook?.id;

      if (!bookId) {
        const { data: newBook, error: bError } = await supabase
          .from('books')
          .insert([{ 
            title: targetBook.title, 
            author: targetBook.author, 
            cover_url: targetBook.cover_url, 
            total_pages: targetBook.total_pages 
          }])
          .select().single();
        if (bError) throw bError;
        bookId = newBook.id;
      }

      // 2. Add to the SELECTED list
      const { error: lError } = await supabase
        .from('list_items')
        .insert([{ list_id: selectedListId, book_id: bookId }]);

      if (lError) {
        if (lError.code === '23505') toast.error("Book is already in this list");
        else throw lError;
      } else {
        const listTitle = userLists.find(l => l.id === selectedListId)?.title || "your list";
        toast.success(`Added to ${listTitle}`);
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-slate-100">Add to List</h2>
          
          <div className="mt-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Select List</label>
            <select 
              value={selectedListId}
              onChange={(e) => setSelectedListId(e.target.value)}
              disabled={fetchingLists}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary outline-none transition-all disabled:opacity-50"
            >
              {fetchingLists ? (
                <option>Loading your lists...</option>
              ) : userLists.length === 0 ? (
                <option value="">No lists found - create one first!</option>
              ) : (
                userLists.map(list => (
                  <option key={list.id} value={list.id}>{list.title}</option>
                ))
              )}
            </select>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Quick Add Selected Book */}
          {book && !query && (
            <div className="mb-4">
              <button
                onClick={() => performAddAction(book)}
                disabled={loading || fetchingLists || !selectedListId}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all text-left group disabled:opacity-50"
              >
                <img src={book.cover_url} className="w-10 aspect-[2/3] object-cover rounded shadow-sm" alt="cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black truncate text-slate-900 dark:text-slate-100">{book.title}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase truncate">{book.author}</p>
                </div>
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">add_circle</span>
              </button>
            </div>
          )}

          {/* Search Input */}
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <Input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search other books..."
              className="pl-10 h-11 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl font-bold text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Results List */}
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {results.map((r) => (
              <button
                key={r.id}
                onClick={() => performAddAction(r)}
                disabled={loading || !selectedListId}
                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left group"
              >
                <img src={r.cover_url} className="w-10 aspect-[2/3] object-cover rounded shadow-sm" alt="cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black truncate text-slate-900 dark:text-slate-100">{r.title}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase truncate">{r.author}</p>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary">add_circle</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex gap-2">
          <Button onClick={onClose} variant="ghost" className="w-full h-10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddBookToListModal;
