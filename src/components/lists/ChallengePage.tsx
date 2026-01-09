import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

const ChallengePage: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
      <Header variant="app" />
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <aside className="hidden md:flex w-70 border-r border-slate-200 dark:border-slate-800">
           <Sidebar type="tracker" />
        </aside>
        
        <main className="flex-1 p-6 lg:p-10">
          <h1 className="text-3xl font-extrabold mb-8">2026 Reading Challenge</h1>
          
          <div className="max-w-3xl bg-slate-900 text-white rounded-3xl p-10">
             <div className="text-center mb-10">
                <span className="material-symbols-outlined text-6xl text-yellow-500 mb-4">trophy</span>
                <h2 className="text-4xl font-black italic">YOU'RE CRUSHING IT!</h2>
                <p className="text-slate-400 mt-2">12 books finished out of 50</p>
             </div>
             {/* Add a larger progress bar here */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChallengePage;
