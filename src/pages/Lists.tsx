import React from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

// Define the interface for ListCard props
interface ListCardProps {
  title: string;
  count: number;
  isPublic: boolean;
  tag: string;
  covers: string[]; // Array of 3 image URLs
}

const Lists: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display min-h-screen transition-colors duration-200">
      <Header variant="app" />
      <main className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto">
        <aside className="hidden md:flex w-70 border-r border-slate-200 dark:border-slate-800 ">
          <Sidebar type="lists" />
        </aside>

        {/* List Content */}
        <div className="flex-1 flex flex-col min-w-0 ml-30">
          <div className="sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-6 lg:px-10 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Your Lists</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and curate your collections.</p>
              </div>
              <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all">
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span>Create New List</span>
              </button>
            </div>
            <div className="relative max-w-lg">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <span className="material-symbols-outlined">search</span>
              </span>
              <input className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Search your lists..." type="text" />
            </div>
          </div>

          <div className="p-6 lg:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* List Cards with Unique Covers */}
              <ListCard 
                title="Summer Reads 2026" 
                count={12} 
                isPublic={true} 
                tag="#2024" 
                covers={[
                  "https://covers.openlibrary.org/b/id/12885107-L.jpg",
                  "https://covers.openlibrary.org/b/id/8231856-L.jpg",
                  "https://covers.openlibrary.org/b/id/10405051-L.jpg"
                ]}
              />
              <ListCard 
                title="Sci-Fi Essentials" 
                count={48} 
                isPublic={false} 
                tag="#scifi" 
                covers={[
                  "https://covers.openlibrary.org/b/id/10541997-L.jpg",
                  "https://covers.openlibrary.org/b/id/12640243-L.jpg",
                  "https://covers.openlibrary.org/b/id/8231992-L.jpg"
                ]}
              />
              <ListCard 
                title="Fiction Classics" 
                count={50} 
                isPublic={false} 
                tag="#fiction" 
                covers={[
                  "https://covers.openlibrary.org/b/id/12711818-L.jpg",
                  "https://covers.openlibrary.org/b/id/12818862-L.jpg",
                  "https://covers.openlibrary.org/b/id/10395333-L.jpg"
                ]}
              /> 
              <ListCard 
                title="Non-Fiction" 
                count={22} 
                isPublic={false} 
                tag="#learning" 
                covers={[
                  "https://covers.openlibrary.org/b/id/12560381-L.jpg",
                  "https://covers.openlibrary.org/b/id/12817814-L.jpg",
                  "https://covers.openlibrary.org/b/id/12891392-L.jpg"
                ]}
              />

              {/* Create New List Placeholder */}
              <div className="group relative dark:bg-surface-dark rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-all shadow-sm flex flex-col h-full hover:shadow-md cursor-pointer border-dashed">
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

const ListCard: React.FC<ListCardProps> = ({ title, count, isPublic, tag, covers }) => (
  <div className="group dark:bg-surface-dark rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-all shadow-sm flex flex-col h-full hover:shadow-md cursor-pointer">
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-tight">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{count} books • Updated recently</p>
      </div>
      <button className="text-slate-400 hover:text-primary transition-colors">
        <span className="material-symbols-outlined">more_horiz</span>
      </button>
    </div>
    
    {/* Balanced Fanned Stack Effect */}
    <div className="relative flex items-center justify-center mb-5 h-40 bg-slate-50 dark:bg-black/20 rounded-lg overflow-hidden">
      
      {/* Book C3 (Rightmost - tilted right) */}
      <div className="absolute w-20 h-28 z-10 
        transition-all duration-300 ease-out
        translate-x-8 rotate-[12deg] opacity-70
        group-hover:translate-x-20 group-hover:rotate-[25deg] group-hover:opacity-100">
        <img alt="c3" className="w-full h-full object-cover rounded shadow-md border border-white/20" src={covers[2]} />
      </div>
      
      {/* Book C2 (Center Anchor) */}
      <div className="absolute w-20 h-28 z-20 
        transition-all duration-300 ease-out
        translate-x-0 rotate-0
        group-hover:scale-110 group-hover:shadow-2xl">
        <img alt="c2" className="w-full h-full object-cover rounded shadow-lg border border-white/20" src={covers[1]} />
      </div>

      {/* Book C1 (Leftmost - tilted further left) */}
      <div className="absolute w-20 h-28 z-30 
        transition-all duration-300 ease-out
        -translate-x-8 rotate-[-12deg]
        group-hover:-translate-x-20 group-hover:rotate-[-25deg] group-hover:scale-105">
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
