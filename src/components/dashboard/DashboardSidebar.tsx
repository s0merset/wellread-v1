import { Progress } from "@/components/ui/progress";

const DashboardSidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col w-72 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 min-h-screen transition-all duration-300">
      
      {/* User Profile Section */}
      <div className="group/profile relative overflow-hidden p-6 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
        
        {/* Profile Watermark */}
        <span className="material-symbols-outlined absolute right-[-10px] top-[-10px] text-[100px] text-primary/5 rotate-[-15deg] pointer-events-none transition-transform duration-700 group-hover/profile:rotate-0 group-hover/profile:scale-110">
          account_circle
        </span>

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Avatar with Glow */}
          <div className="relative mb-4">
            <div className="size-24 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-primary/20 transition-transform duration-500 group-hover/profile:scale-105">
              F
            </div>
            <div className="absolute bottom-1 right-1 size-6 bg-green-500 border-4 border-white dark:border-slate-900 rounded-full"></div>
          </div>
          
          <h3 className="font-bold text-lg truncate w-full">Francis Rey Betonio</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Lvl 24 Bibliophile</p>
        </div>

        {/* Stats Grid */}
        <div className="relative z-10 grid grid-cols-3 gap-2 mt-8">
          <div className="flex flex-col items-center p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-primary text-[20px] mb-1">book_4</span>
            <p className="text-sm font-bold">42</p>
            <p className="text-[10px] text-muted-foreground uppercase">Read</p>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-primary text-[20px] mb-1">person_add</span>
            <p className="text-sm font-bold">128</p>
            <p className="text-[10px] text-muted-foreground uppercase">Following</p>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-primary text-[20px] mb-1">groups</span>
            <p className="text-sm font-bold">96</p>
            <p className="text-[10px] text-muted-foreground uppercase">Followers</p>
          </div>
        </div>
      </div>


      {/* Sidebar Footer/Nav could go here */}
      <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-700">
         <button className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-muted-foreground hover:text-primary group/nav">
            <div className="flex items-center gap-3 font-semibold text-sm">
                <span className="material-symbols-outlined transition-transform group-hover/nav:rotate-12">settings</span>
                Settings
            </div>
            <span className="material-symbols-outlined text-[18px] opacity-0 group-hover/nav:opacity-100 transition-all -translate-x-2 group-hover/nav:translate-x-0">chevron_right</span>
         </button>
      </div>

    </aside>
  );
};

export default DashboardSidebar;
