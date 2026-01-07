import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { searchBooks, GoogleBook } from '@/lib/googleBooks';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  listId: string | null;
  listTitle: string | null;
  // This allows the modal to receive a "preset" book from the Discover page
  book: {
    title: string;
    author: string;
    cover_url: string;
    total_pages: number;
  } | null;
}

const AddBookToListModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, listId, listTitle, book }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GoogleBook[]>([]);
  const [loading, setLoading] = useState(false);

  // Sync query if a book is passed in (optional, but helps UX)
  useEffect(() => {
    if (isOpen && book) {
      setQuery(""); // Clear search so the "Preset" book stands out
      setResults([]);
    }
  }, [isOpen, book]);

  // Debounced search logic for manual searching
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

  // Unified function to handle database insertion
  const performAddAction = async (targetBook: any) => {
    if (!listId) return;
    setLoading(true);

    try {
      // 1. Ensure book exists in global 'books' table
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

      // 2. Link book to the specific list
      const { error: lError } = await supabase
        .from('list_items')
        .insert([{ list_id: listId, book_id: bookId }]);

      if (lError) {
        if (lError.code === '23505') toast.error("Book is already in this list");
        else throw lError;
      } else {
        toast.success(`Successfully added to ${listTitle}`);
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
          <h2 className="text-xl font-black tracking-tighter">Add to List</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
             Collection: <span className="text-primary">{listTitle}</span>
          </p>
        </div>

        <div className="p-4 space-y-4">
          {/* 1. Preset "Quick Add" Option (If book prop is provided) */}
          {book && !query && (
            <div className="mb-4">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 ml-1">Quick Add Selected</p>
              <button
                onClick={() => performAddAction(book)}
                disabled={loading}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all text-left group"
              >
                <img src={book.cover_url} className="w-10 aspect-[2/3] object-cover rounded shadow-sm" alt="cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black truncate">{book.title}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase truncate">{book.author}</p>
                </div>
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">add_circle</span>
              </button>
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
                <div className="relative flex justify-center text-[9px] font-black uppercase text-slate-400"><span className="bg-white dark:bg-slate-900 px-3">or search others</span></div>
              </div>
            </div>
          )}

          {/* 2. Manual Search Input */}
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
            <Input 
              autoFocus={!book}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or author..."
              className="pl-10 h-11 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl font-bold text-sm"
            />
          </div>

          {/* 3. Search Results */}
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
            {results.map((r) => (
              <button
                key={r.id}
                onClick={() => performAddAction(r)}
                disabled={loading}
                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left group"
              >
                <img src={r.cover_url} className="w-10 aspect-[2/3] object-cover rounded shadow-sm" alt="cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black truncate">{r.title}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase truncate">{r.author}</p>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-all">add_circle</span>
              </button>
            ))}
            {loading && query && <div className="text-center py-4 animate-pulse text-[10px] font-black text-slate-400 uppercase tracking-widest">Searching...</div>}
            {!loading && query && results.length === 0 && <div className="text-center py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">No matches found</div>}
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
