import React from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

const Lists: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display min-h-screen flex flex-col transition-colors duration-200">
      <Header variant="app"/>
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
              <input className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Search your lists..." type="text"/>
            </div>
          </div>

          <div className="p-6 lg:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* List Card Component */}
              <ListCard title="Summer Reads 2024" count={12} isPublic={true} tag="#2024" />
              <ListCard title="Sci-Fi Essentials" count={48} isPublic={false} tag="#scifi" />
              <ListCard title="Fiction" count={50} isPublic={false} tag="#fiction" /> 
              <ListCard title="Time Killers" count={50} isPublic={false} tag="#fiction" /> 
              <ListCard title="Non-Fiction" count={50} isPublic={false} tag="#fiction" /> 
              <ListCard title="Ponder" count={50} isPublic={false} tag="#fiction" /> 
              <ListCard title="Dystopian" count={50} isPublic={false} tag="#fiction" /> 
              {/* Create New List Placeholder */}
              <div className="group relative bg-white dark:bg-surface-dark rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-all shadow-sm flex flex-col h-full hover:shadow-md cursor-pointer border-dashed">
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
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

const ListCard = ({ title, count, isPublic, tag }: { title: string, count: number, isPublic: boolean, tag: string }) => (
  <div className="group bg-white dark:bg-surface-dark rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-all shadow-sm flex flex-col h-full hover:shadow-md cursor-pointer">
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-tight">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{count} books • Updated recently</p>
      </div>
      <button className="text-slate-400 hover:text-primary transition-colors">
        <span className="material-symbols-outlined">more_horiz</span>
      </button>
    </div>
    
    {/* Stacked Image Effect */}
    <div className="flex items-center gap-3 mb-5 overflow-hidden h-32 bg-slate-50 dark:bg-black/20 rounded-lg p-2 relative">
      <div className="w-1/3 h-full relative z-30 transform hover:-translate-y-1 transition-transform">
        <img alt="c1" className="w-full h-full object-cover rounded shadow-md" src="https://via.placeholder.com/150x200" />
      </div>
      <div className="w-1/3 h-full relative z-20 scale-95 opacity-90 transform hover:-translate-y-1 transition-transform">
        <img alt="c2" className="w-full h-full object-cover rounded shadow-md" src="https://via.placeholder.com/150x200" />
      </div>
      <div className="w-1/3 h-full relative z-10 scale-90 opacity-80 transform hover:-translate-y-1 transition-transform">
        <img alt="c3" className="w-full h-full object-cover rounded shadow-md" src="https://via.placeholder.com/150x200" />
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
