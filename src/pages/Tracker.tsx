import React from 'react';
import Sidebar from '@/components/Sidebar';

const Tracker: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display min-h-screen flex flex-col transition-colors duration-200">
      <Sidebar type="tracker"/>
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto">
        {/* Page Header (Internal to Content) */}
        <div className="flex-1 min-w-0 p-6 lg:p-10">
          <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">My Dashboard</h1>
              <p className="text-slate-500 dark:text-slate-400">Track your progress and manage your reading goals.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Last updated: Just now</span>
              <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
                <span className="material-symbols-outlined text-xl">refresh</span>
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
            {/* 2024 Challenge Card */}
            <div className="xl:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-surface-dark dark:to-background-dark border border-slate-200 dark:border-slate-700 shadow-lg text-white p-6 sm:p-8 flex flex-col justify-between min-h-[280px]">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-yellow-400">trophy</span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">2024 Reading Challenge</h3>
                  </div>
                  <div className="text-4xl font-extrabold mb-1">24 <span className="text-xl text-slate-400 font-medium">/ 50 books</span></div>
                  <p className="text-sm text-green-400 font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-lg">trending_up</span>
                    4 books ahead of schedule
                  </p>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur border border-white/10 text-xs font-bold transition-colors">Edit Goal</button>
              </div>
              
              <div className="relative z-10 mb-8">
                <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full w-[48%]"></div>
                </div>
              </div>

              <div className="relative z-10">
                <p className="text-xs text-slate-400 mb-3 font-bold uppercase tracking-wide">Recently Finished</p>
                <div className="flex -space-x-3 hover:space-x-1 transition-all duration-300">
                  {/* Map covers here */}
                  {[1, 2, 3, 4].map((i) => (
                    <img key={i} alt="cover" className="w-12 h-16 object-cover rounded shadow-lg border-2 border-slate-800 hover:scale-110 hover:z-20 transition-transform cursor-pointer" src={`https://via.placeholder.com/150x200`} />
                  ))}
                  <div className="w-12 h-16 rounded bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 hover:scale-110 transition-transform cursor-pointer">
                    +20
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <TrackerStat icon="auto_stories" value="8,432" label="Pages Read" color="blue" />
              <TrackerStat icon="star_half" value="4.2" label="Avg. Rating" color="yellow" />
              <TrackerStat icon="rate_review" value="18" label="Reviews" color="green" />
              <TrackerStat icon="local_fire_department" value="12" label="Day Streak" color="purple" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">timelapse</span> Currently Reading
              </h3>
              {/* Main Currently Reading Card */}
              <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col sm:flex-row gap-6">
                <img alt="Project Hail Mary" className="shrink-0 w-24 sm:w-32 aspect-[2/3] rounded-lg object-cover shadow-md" src="https://via.placeholder.com/150x200" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xl font-bold">Project Hail Mary</h4>
                    <p className="text-sm text-slate-500 mb-4">by Andy Weir</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs font-bold"><span>75% Complete</span><span>360 / 480 pages</span></div>
                      <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[75%]"></div>
                      </div>
                    </div>
                  </div>
                  <button className="bg-primary hover:bg-blue-600 text-white font-bold text-sm py-2.5 rounded-lg transition-all shadow-lg shadow-primary/20">Update Progress</button>
                </div>
              </div>
            </div>

            {/* Top Genres Progress bars */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-pink-500">pie_chart</span> Top Genres
              </h3>
              <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
                <GenreProgress label="Sci-Fi" percent={42} color="bg-blue-500" />
                <GenreProgress label="Fantasy" percent={28} color="bg-purple-500" />
                <GenreProgress label="Non-Fiction" percent={15} color="bg-orange-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrackerStat = ({ icon, value, label, color }: { icon: string, value: string, label: string, color: string }) => {
  const colors: any = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-primary",
    yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600"
  };
  return (
    <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className={`h-10 w-10 rounded-lg ${colors[color]} flex items-center justify-center mb-3`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="text-2xl font-bold dark:text-white">{value}</div>
      <div className="text-xs font-medium text-slate-500">{label}</div>
    </div>
  );
};

const GenreProgress = ({ label, percent, color }: { label: string, percent: number, color: string }) => (
  <div className="group">
    <div className="flex justify-between text-xs font-bold mb-1">
      <span className="text-slate-700 dark:text-slate-300">{label}</span>
      <span className="text-slate-500">{percent}%</span>
    </div>
    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }}></div>
    </div>
  </div>
);

export default Tracker;
