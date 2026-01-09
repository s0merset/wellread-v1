import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import UpdateProgressModal from "../tracker/UpdateProgress";

// --- Types ---
interface UserBook {
  id: string;
  current_page: number;
  books: { 
    title: string; 
    author: string; 
    cover_url: string; 
    total_pages: number; 
  };
}

interface CurrentlyReadingProps {
  books: UserBook[];
  onRefresh: () => void;
}

const CurrentlyReading: React.FC<CurrentlyReadingProps> = ({ books, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (books.length === 0) {
    return (
      <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl h-full p-12 flex flex-col items-center justify-center text-center transition-all bg-white dark:bg-[#1e293b]/10">
        <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-700 mb-4">auto_stories</span>
        <h2 className="text-xl font-bold mb-2">No books in progress</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-[250px] mb-6 text-sm">Pick up where you left off or start a new adventure.</p>
        <Button variant="outline" className="rounded-xl font-bold">Explore Library</Button>
      </div>
    );
  }

  const currentBook = books[0];
  const progress = Math.round((currentBook.current_page / currentBook.books.total_pages) * 100);

  return (
    <>
      <div className="group border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b]/30 relative rounded-2xl h-full p-8 transition-all duration-300 overflow-hidden shadow-sm">
        {/* Decorative Watermark */}
        <span className="material-symbols-outlined absolute right-[-20px] top-[-20px] text-[240px] text-slate-500/5 dark:text-white/5 rotate-12 pointer-events-none transition-transform duration-700 group-hover:rotate-[20deg] group-hover:scale-110">
          menu_book
        </span>

        <div className="flex items-center gap-3 mb-8 relative z-10">
          <span className="material-symbols-outlined text-blue-500 font-fill">auto_stories</span>
          <h2 className="text-xl font-black uppercase tracking-tight">Currently Reading</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-8 relative z-10">
          {/* Cover Art */}
          <div
            className="w-36 aspect-[2/3] rounded-xl bg-cover bg-center shadow-2xl shrink-0 transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-2 ring-1 ring-black/10 dark:ring-white/10"
            style={{ backgroundImage: `url("${currentBook.books.cover_url}")` }}
          />

          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div>
              <h3 className="font-extrabold text-2xl truncate mb-1 text-slate-900 dark:text-white">{currentBook.books.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-lg mb-4 font-medium">by {currentBook.books.author}</p>
            </div>

            {/* Stats Tag */}
            <div className="flex flex-wrap gap-3 text-sm font-bold text-slate-600 dark:text-slate-300 mb-6">
              <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="material-symbols-outlined text-[18px]">import_contacts</span>
                {currentBook.current_page} <span className="text-slate-400">/</span> {currentBook.books.total_pages} pages
              </span>
            </div>

            {/* Progress Bar Area */}
            <div className="space-y-3 max-w-md">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                <span className="text-blue-500 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] animate-pulse">trending_up</span>
                  {progress}% Complete
                </span>
                <span className="text-slate-400">
                  {currentBook.books.total_pages - currentBook.current_page} pages left
                </span>
              </div>
              <Progress value={progress} className="h-2.5 bg-slate-100 dark:bg-slate-800" />
            </div>

            {/* Action Button */}
            <div className="mt-8">
              <Button 
                size="lg" 
                onClick={() => setIsModalOpen(true)}
                className="group/btn relative overflow-hidden flex items-center gap-2 pr-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all hover:pr-10 shadow-lg shadow-blue-500/20 font-black text-xs uppercase tracking-widest h-12"
              >
                Update Progress
                <span className="material-symbols-outlined text-[20px] absolute right-[-20px] opacity-0 transition-all duration-300 group-hover/btn:right-3 group-hover/btn:opacity-100">
                  arrow_forward
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Integrated Modal */}
      <UpdateProgressModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={onRefresh}
        bookData={currentBook}
      />
    </>
  );
};

export default CurrentlyReading;
