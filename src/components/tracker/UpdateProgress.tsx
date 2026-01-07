import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  bookData: {
    id: string;
    current_page: number;
    books: {
      title: string;
      cover_url: string;
      total_pages: number;
    }
  } | null;
}

const UpdateProgressModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, bookData }) => {
  const [pagesRead, setPagesRead] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bookData) {
      setPagesRead(bookData.current_page);
    }
  }, [bookData, isOpen]);

  if (!isOpen || !bookData) return null;

  const total = bookData.books.total_pages;
  const percentage = Math.round((pagesRead / total) * 100);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pagesRead > total) {
      toast.error("Pages read cannot exceed total pages");
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('user_books')
      .update({ 
        current_page: pagesRead,
        // Automatically mark as finished if pages match
        status: pagesRead === total ? 'finished' : 'reading',
        finished_at: pagesRead === total ? new Date().toISOString() : null
      })
      .eq('id', bookData.id);

    setLoading(false);
    if (error) {
      toast.error("Failed to update progress");
    } else {
      toast.success(pagesRead === total ? "Book finished! 🎉" : "Progress saved");
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className="flex gap-4 items-center">
            <img src={bookData.books.cover_url} className="w-16 aspect-[2/3] rounded-lg shadow-md object-cover" alt="cover" />
            <div className="min-w-0">
              <h2 className="text-lg font-black tracking-tight truncate">{bookData.books.title}</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Update your progress</p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Numeric Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Page</Label>
                <span className="text-xs font-black text-primary">{percentage}%</span>
              </div>
              <div className="relative group">
                <Input 
                  type="number"
                  value={pagesRead}
                  onChange={(e) => setPagesRead(Number(e.target.value))}
                  className="h-12 pl-4 pr-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl font-bold text-lg"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">/ {total}</span>
              </div>
            </div>

            {/* Visual Slider (Custom Styled) */}
            <input 
              type="range" 
              min="0" 
              max={total} 
              value={pagesRead} 
              onChange={(e) => setPagesRead(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
            />

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={onClose} className="flex-1 h-11 rounded-xl font-black text-xs uppercase tracking-widest">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="group/btn flex-[2] h-11 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20">
                <span className="relative z-10">{loading ? 'Saving...' : 'Save Progress'}</span>
                <div className="relative flex items-center overflow-hidden w-4 h-4 ml-2">
                  <span className="material-symbols-outlined text-[18px] absolute transition-all duration-300 translate-x-[-20px] opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100">
                    done_all
                  </span>
                  <span className="material-symbols-outlined text-[18px] absolute transition-all duration-300 translate-x-0 opacity-100 group-hover/btn:translate-x-[20px] group-hover/btn:opacity-0">
                    edit
                  </span>
                </div>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProgressModal;
