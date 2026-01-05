import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  type: 'tracker' | 'lists';
}

const Sidebar: React.FC<SidebarProps> = ({ type }) => {
  return (
    <aside className="hidden lg:block w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 p-6 h-[calc(100vh-64px)] sticky top-[64px] overflow-y-auto custom-scrollbar bg-background-light dark:bg-background-dark/50">
      
      {/* 1. TOP SECTION: Profile (Tracker) or Library (Lists) */}
      {type === 'tracker' ? (
        <div className="mb-8 flex items-center gap-3 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">person</span>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">Alex Readman</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">@bookworm_alex</div>
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Library</h3>
          <nav className="space-y-1">
            <SidebarLink to="/lists" icon="format_list_bulleted" label="All Lists" count={12} />
            <SidebarLink to="/lists/liked" icon="favorite" label="Liked Lists" count={8} />
            <SidebarLink to="/lists/saved" icon="bookmarks" label="Saved for Later" count={3} />
            <SidebarLink to="/lists/archived" icon="archive" label="Archived" />
          </nav>
        </div>
      )}

      {/* 2. MIDDLE SECTION: Tracker Nav or Sort Options (Lists) */}
      {type === 'tracker' ? (
        <>
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 px-2">My Library</h3>
            <nav className="space-y-1">
              <SidebarLink to="/dashboard" icon="dashboard" label="Dashboard" />
              <SidebarLink to="/all-books" icon="library_books" label="All Books" count={142} />
              <SidebarLink to="/read" icon="check_circle" label="Read" count={98} />
              <SidebarLink to="/currently-reading" icon="timelapse" label="Currently Reading" count={2} />
              <SidebarLink to="/want-to-read" icon="bookmark" label="Want to Read" count={42} />
            </nav>
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 px-2">Insights</h3>
            <nav className="space-y-1">
              <SidebarLink to="/stats" icon="bar_chart" label="Stats" />
              <SidebarLink to="/diary" icon="calendar_month" label="Reading Diary" />
              <SidebarLink to="/challenge" icon="emoji_events" label="2024 Challenge" />
            </nav>
          </div>
        </>
      ) : (
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Sort By</h3>
          <div className="space-y-2">
            {['Last Updated', 'Name (A-Z)', 'Book Count'].map((label) => (
              <label key={label} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="sort" 
                  defaultChecked={label === 'Last Updated'}
                  className="h-4 w-4 border-slate-300 dark:border-slate-600 bg-transparent text-primary focus:ring-offset-0 focus:ring-primary/20" 
                />
                <span className="text-slate-600 dark:text-slate-300 group-hover:text-primary text-sm font-medium transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 3. BOTTOM SECTION: Tags (Common to both) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2">
            {type === 'tracker' ? 'Collections' : 'Tags'}
          </h3>
          {type === 'lists' && (
            <button className="p-1 text-slate-400 hover:text-primary rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 px-2">
          {['#favorites', '#2024', '#scifi', '#nonfiction'].map((tag) => (
            <span 
              key={tag} 
              className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-primary hover:text-primary transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};

/* Helper Component for Sidebar Links */
interface SidebarLinkProps {
  to: string;
  icon: string;
  label: string;
  count?: number;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, count }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all group ${
        isActive 
          ? 'bg-primary/10 text-primary font-bold' 
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`
    }
  >
    <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
      {icon}
    </span>
    {label}
    {count !== undefined && (
      <span className="ml-auto text-xs opacity-60 font-normal">{count}</span>
    )}
  </NavLink>
);

export default Sidebar;
