import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string;
}

interface UserBook {
  id: string;
  is_favorite: boolean;
  books: Book;
}

interface AddFavoriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddFavoriteModal: React.FC<AddFavoriteModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [library, setLibrary] = useState<UserBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchLibrary();
      setSearchTerm('');
    }
  }, [isOpen]);

  const fetchLibrary = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // FIX: Use explicit join 'books:book_id'
      const { data, error } = await supabase
        .from('user_books')
        .select(`
          id, 
          is_favorite, 
          books:book_id (
            id, title, author, cover_url
          )
        `)
        .eq('user_id', user.id)
        .eq('is_favorite', false) // Only fetch non-favorites
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Filter out any entries where the book relation is null (deleted books)
      const validBooks = (data as any[]).filter(item => item.books !== null);
      setLibrary(validBooks);

    } catch (error: any) {
      console.error("Library Load Error:", error);
      // More descriptive error message
      toast.error(error.message || "Failed to load library");
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (id: string) => {
    try {
      setProcessingId(id);
      const { error } = await supabase
        .from('user_books')
        .update({ is_favorite: true })
        .eq('id', id);

      if (error) throw error;

      toast.success("Added to favorites!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add favorite");
    } finally {
      setProcessingId(null);
    }
  };

  // Client-side search
  const filteredBooks = library.filter(item => 
    item.books.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.books.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[80vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add to Favorites</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">close</span></button>
          </div>
          
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">search</span>
            <input 
              type="text" 
              placeholder="Search your library..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-900 dark:text-white"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {loading ? (
             <div className="flex justify-center py-8"><span className="material-symbols-outlined animate-spin text-blue-500">sync</span></div>
          ) : filteredBooks.length > 0 ? (
            filteredBooks.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-pointer" onClick={() => addToFavorites(item.id)}>
                <img src={item.books.cover_url} className="w-10 h-14 object-cover rounded shadow-sm border border-slate-200 dark:border-slate-700" alt={item.books.title} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.books.title}</h4>
                  <p className="text-xs text-slate-500 truncate">{item.books.author}</p>
                </div>
                <button 
                  disabled={processingId === item.id}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-pink-500 group-hover:text-white transition-all"
                >
                  {processingId === item.id ? <span className="material-symbols-outlined animate-spin text-sm">sync</span> : <span className="material-symbols-outlined text-sm">favorite</span>}
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500 text-sm">
              {searchTerm ? "No books found." : "No available books to add."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddFavoriteModal;
