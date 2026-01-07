import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import debounce from 'lodash/debounce'; // Optional: for search throttling

// --- Google Books API Response Types ---
interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail: string;
    };
    pageCount?: number;
    description?: string;
  };
}

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({ isOpen, onClose, onSuccess }) => {
  // UI States
  const [step, setStep] = useState<'search' | 'write'>('search');
  const [loading, setLoading] = useState(false);
  
  // Search Data
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GoogleBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<GoogleBook | null>(null);

  // Review Form Data
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setStep('search');
      setQuery('');
      setResults([]);
      setRating(0);
      setReviewText('');
      setIsSpoiler(false);
    }
  }, [isOpen]);

  // --- 1. SEARCH GOOGLE BOOKS ---
  const searchGoogleBooks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      // Using public Google Books API
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10`);
      const data = await response.json();
      setResults(data.items || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to search Google Books");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. SELECT BOOK ---
  const handleSelectBook = (book: GoogleBook) => {
    setSelectedBook(book);
    setStep('write');
  };

  // --- 3. SUBMIT REVIEW ---
  const handleSubmit = async () => {
    if (!selectedBook) return;
    if (rating === 0) {
      toast.error("Please give a star rating");
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const info = selectedBook.volumeInfo;
      const title = info.title;
      const author = info.authors ? info.authors[0] : 'Unknown Author';
      const cover_url = info.imageLinks?.thumbnail?.replace('http:', 'https:') || ''; // Ensure HTTPS
      const total_pages = info.pageCount || 0;

      // A. Insert/Get Book from 'books' table
      // We check if book exists by title/author to avoid dupes
      // (Ideally you'd use a unique Google ID, but sticking to your current schema)
      let bookId: string;
      
      const { data: existingBook } = await supabase
        .from('books')
        .select('id')
        .eq('title', title)
        .eq('author', author)
        .maybeSingle();

      if (existingBook) {
        bookId = existingBook.id;
      } else {
        const { data: newBook, error: insertError } = await supabase
          .from('books')
          .insert({ title, author, cover_url, total_pages })
          .select()
          .single();
        
        if (insertError) throw insertError;
        bookId = newBook.id;
      }

      // B. Upsert into 'user_books' (Review)
      // We assume adding a review marks it as 'finished'
      const { error: reviewError } = await supabase
        .from('user_books')
        .upsert({
          user_id: user.id,
          book_id: bookId,
          status: 'finished',
          rating: rating,
          review_text: reviewText,
          is_favorite: false, // Default
          is_spoiler: isSpoiler,
          finished_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id, book_id' }); // Update if exists

      if (reviewError) throw reviewError;

      toast.success("Review published!");
      onSuccess();
      onClose();

    } catch (error: any) {
      console.error(error);
      toast.error(`Failed to post review: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 z-10">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {step === 'search' ? 'Find a Book to Review' : 'Write Review'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">close</span></button>
        </div>

        {/* --- STEP 1: SEARCH --- */}
        {step === 'search' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <form onSubmit={searchGoogleBooks} className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">search</span>
                <input 
                  autoFocus
                  type="text"
                  placeholder="Search by title, author, or ISBN..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </form>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {loading ? (
                <div className="flex justify-center py-10"><span className="material-symbols-outlined animate-spin text-blue-500 text-2xl">sync</span></div>
              ) : results.length > 0 ? (
                results.map((book) => {
                  const img = book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192?text=No+Cover';
                  return (
                    <div 
                      key={book.id} 
                      onClick={() => handleSelectBook(book)}
                      className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                      <img src={img} className="w-12 h-16 object-cover rounded shadow-sm" alt="cover" />
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{book.volumeInfo.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{book.volumeInfo.authors?.join(', ') || 'Unknown Author'}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{book.volumeInfo.pageCount ? `${book.volumeInfo.pageCount} pages` : ''}</p>
                      </div>
                      <span className="material-symbols-outlined text-slate-300 self-center">chevron_right</span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-slate-500 py-10 text-sm">
                  {query ? "No results found." : "Search to find a book."}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- STEP 2: WRITE --- */}
        {step === 'write' && selectedBook && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Selected Book Summary */}
            <div className="flex gap-4 items-center pb-6 border-b border-slate-100 dark:border-slate-800">
              <img 
                src={selectedBook.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/100'} 
                className="w-16 h-24 object-cover rounded shadow-md"
                alt="cover"
              />
              <div>
                <button onClick={() => setStep('search')} className="text-[10px] font-bold text-blue-500 hover:underline mb-1">CHANGE BOOK</button>
                <h4 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{selectedBook.volumeInfo.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedBook.volumeInfo.authors?.join(', ')}</p>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="flex flex-col items-center gap-2">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Your Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <span className={`material-symbols-outlined text-4xl ${star <= rating ? 'text-yellow-400 fill-current' : 'text-slate-300 dark:text-slate-700'}`}>
                      star
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300 h-5">
                {rating === 1 && "Not for me"}
                {rating === 2 && "It was okay"}
                {rating === 3 && "Good"}
                {rating === 4 && "Great read"}
                {rating === 5 && "Masterpiece!"}
              </p>
            </div>

            {/* Review Text */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Your Review</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="What did you think about this book?"
                className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl resize-none focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-900 dark:text-white"
              />
            </div>

            {/* Spoiler Toggle */}
            <div 
              onClick={() => setIsSpoiler(!isSpoiler)}
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSpoiler ? 'bg-blue-500 border-blue-500' : 'border-slate-400'}`}>
                {isSpoiler && <span className="material-symbols-outlined text-white text-sm">check</span>}
              </div>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Contains Spoilers?</span>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={loading || rating === 0}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : 'Publish Review'}
            </button>

          </div>
        )}
      </div>
    </div>
  );
};

export default AddReviewModal;
