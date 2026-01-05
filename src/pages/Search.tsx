import React from 'react';
import Header from '../components/Header.tsx';

const Discover: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-text-main font-display min-h-screen flex flex-col transition-colors duration-200 antialiased">
      <Header />
      
      <main className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto">
        {/* Filter Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 px-6 py-8 h-[calc(100vh-64px)] sticky top-[64px] overflow-y-auto custom-scrollbar bg-background-light dark:bg-background-dark/50">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Filter Books</h3>
            <button className="text-xs text-primary font-bold hover:text-primary-hover transition-colors">Reset All</button>
          </div>

          <FilterGroup title="Genres">
            {['Fiction', 'Non-Fiction', 'Sci-Fi & Fantasy', 'Mystery', 'History'].map(genre => (
              <label key={genre} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer group transition-colors -mx-2">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary/20 bg-transparent" />
                <span className="text-slate-600 dark:text-slate-300 group-hover:text-primary text-sm font-medium">{genre}</span>
              </label>
            ))}
          </FilterGroup>

          <FilterGroup title="Min Rating">
             {[4, 3].map(rating => (
               <label key={rating} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer group transition-colors -mx-2">
                 <input type="radio" name="rating" className="h-4 w-4 border-slate-300 dark:border-slate-600 text-primary focus:ring-offset-0 bg-transparent" />
                 <div className="flex text-yellow-400 text-sm">
                   {[...Array(5)].map((_, i) => (
                     <span key={i} className={`material-symbols-outlined text-[18px] ${i < rating ? 'fill-[1]' : ''}`}>star</span>
                   ))}
                   <span className="ml-2 text-slate-600 dark:text-slate-300 text-sm font-medium">{rating}+ Stars</span>
                 </div>
               </label>
             ))}
          </FilterGroup>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Search Hero */}
          <section className="relative pt-12 pb-8 px-6 lg:px-12 border-b border-slate-200 dark:border-slate-800">
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-8 text-slate-900 dark:text-white">
                What are you <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">reading next?</span>
              </h1>
              
              <div className="relative group max-w-2xl mx-auto mb-6">
                <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl group-hover:bg-primary/40 transition-all opacity-0 group-hover:opacity-100 duration-500"></div>
                <label className="relative flex items-center w-full h-14 rounded-2xl bg-white dark:bg-surface-dark shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-200 dark:border-slate-700/50 overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                  <div className="pl-5 pr-3 text-slate-400"><span className="material-symbols-outlined">search</span></div>
                  <input className="peer w-full h-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 text-base font-medium" placeholder="Search titles, authors, ISBNs..." />
                </label>
              </div>
            </div>
          </section>

          {/* Trending Grid */}
          <div className="p-6 lg:p-10 space-y-16">
            <section>
              <SectionHeader title="Trending This Week" subtitle="The most logged books on Bookworm right now." icon="trending_up" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-10">
                <BookCard title="The Midnight Library" author="Matt Haig" rating={4.8} />
                <BookCard title="Project Hail Mary" author="Andy Weir" rating={4.5} />
                {/* Add more BookCards as needed */}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

const FilterGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <h4 className="text-sm font-bold mb-4 text-slate-900 dark:text-white">{title}</h4>
    <div className="space-y-2">{children}</div>
  </div>
);

const SectionHeader = ({ title, subtitle, icon }: { title: string; subtitle: string; icon: string }) => (
  <div className="flex items-end justify-between mb-6 px-1">
    <div>
      <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
        <span className="material-symbols-outlined text-primary">{icon}</span>
        {title}
      </h3>
      <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
    </div>
    <a href="#" className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1 uppercase tracking-wider">
      View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
    </a>
  </div>
);

const BookCard = ({ title, author, rating }: { title: string; author: string; rating: number }) => (
  <div className="group relative flex flex-col gap-3">
    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-lg bg-surface-dark ring-1 ring-white/10 group-hover:shadow-glow group-hover:ring-primary/50 transition-all duration-300">
      <img alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://via.placeholder.com/300x450" />
      <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-xs font-bold text-white flex items-center gap-1">
        <span className="material-symbols-outlined text-[12px] text-yellow-400 fill-[1]">star</span> {rating}
      </div>
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-4 backdrop-blur-[2px]">
        <button className="w-full py-2 bg-primary rounded font-bold text-xs text-white hover:bg-primary-hover shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">Want to Read</button>
        <button className="w-full py-2 bg-white/10 backdrop-blur border border-white/20 rounded font-bold text-xs text-white hover:bg-white/20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">Log/Review</button>
      </div>
    </div>
    <div className="space-y-1">
      <h4 className="font-bold text-sm leading-tight text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{author}</p>
    </div>
  </div>
);

export default Discover;
