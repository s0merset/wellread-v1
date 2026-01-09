import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

const StatsPage: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
      <Header variant="app" />
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <aside className="hidden md:flex w-70 border-r border-slate-200 dark:border-slate-800">
           <Sidebar type="tracker" />
        </aside>
        
        <main className="flex-1 p-6 lg:p-10">
          <h1 className="text-3xl font-extrabold mb-2">Reading Stats</h1>
          <p className="text-slate-500 mb-8">Detailed breakdown of your reading habits.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Total Pages</h3>
              <div className="text-4xl font-black text-primary">12,402</div>
            </div>
            {/* Add more stat cards here */}
          </div>
          
          <div className="mt-8 p-10 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center text-slate-500">
            Charts and analytics coming soon.
          </div>
        </main>
      </div>
    </div>
  );
};

export default StatsPage;
