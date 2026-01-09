import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  type: 'tracker' | 'lists';
  // Props for "Lists" functionality
  counts?: { all: number; liked: number; saved: number };
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  activeSort?: string;
  onSortChange?: (sort: string) => void;
  activeTag?: string | null;
  onTagSelect?: (tag: string | null) => void;
  availableTags?: string[];
}

const Sidebar: React.FC<SidebarProps> = ({
  type,
  counts,
  activeFilter = 'all',
  onFilterChange,
  activeSort = 'Last Updated',
  onSortChange,
  activeTag,
  onTagSelect,
  availableTags = [],
}) => {
  return (
    <aside className="hidden lg:block w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 p-6 h-[calc(100vh-64px)] sticky top-[64px] overflow-y-auto custom-scrollbar bg-background-light dark:bg-background-dark/50">
      
      {/* 1. TOP SECTION: Profile (Tracker) or Library (Lists) */}
      {type === 'tracker' ? (
        <div className="mb-8 flex items-center gap-3 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">person</span>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">Francis Rey</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">@fr_betonio</div>
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Library</h3>
          <nav className="space-y-1">
            <SidebarFilterButton
              icon="format_list_bulleted"
              label="All Lists"
              count={counts?.all}
              isActive={activeFilter === 'all'}
              onClick={() => onFilterChange?.('all')}
            />
            <SidebarFilterButton
              icon="favorite"
              label="Liked Lists"
              count={counts?.liked}
              isActive={activeFilter === 'liked'}
              onClick={() => onFilterChange?.('liked')}
            />
            <SidebarFilterButton
              icon="bookmarks"
              label="Saved for Later"
              count={counts?.saved}
              isActive={activeFilter === 'saved'}
              onClick={() => onFilterChange?.('saved')}
            />
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
                  checked={activeSort === label}
                  onChange={() => onSortChange?.(label)}
                  className="h-4 w-4 border-slate-300 dark:border-slate-600 bg-transparent text-primary focus:ring-0 focus:ring-offset-0"
                />
                <span className={`text-sm font-medium transition-colors ${
                  activeSort === label ? 'text-primary' : 'text-slate-600 dark:text-slate-300 group-hover:text-primary'
                }`}>
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 3. BOTTOM SECTION: Tags / Collections */}
      <div>
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {type === 'tracker' ? 'Collections' : 'Tags'}
          </h3>
          {type === 'lists' && (
            <button className="p-1 text-slate-400 hover:text-primary rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 px-2">
          {type === 'lists' && (
             <TagBadge 
               tag="#all" 
               isActive={!activeTag} 
               onClick={() => onTagSelect?.(null)} 
             />
          )}
          
          {(type === 'lists' ? availableTags : ['#favorites', '#2024', '#scifi']).map((tag) => (
            <TagBadge
              key={tag}
              tag={tag.startsWith('#') ? tag : `#${tag}`}
              isActive={activeTag === tag}
              onClick={() => type === 'lists' ? onTagSelect?.(tag) : null}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

/** 
 * Helper Component for Navigation Links (Tracker Style) 
 */
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

/** 
 * Helper Component for State-based Filters (Lists Style) 
 */
interface SidebarFilterButtonProps {
  icon: string;
  label: string;
  count?: number;
  isActive: boolean;
  onClick: () => void;
}

const SidebarFilterButton: React.FC<SidebarFilterButtonProps> = ({ icon, label, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all group ${
      isActive
        ? 'bg-primary/10 text-primary font-bold'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`}
  >
    <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
      {icon}
    </span>
    {label}
    {count !== undefined && (
      <span className="ml-auto text-xs opacity-60 font-normal">{count}</span>
    )}
  </button>
);

/**
 * Helper Component for Tags
 */
const TagBadge: React.FC<{ tag: string; isActive: boolean; onClick: () => void }> = ({ tag, isActive, onClick }) => (
  <span
    onClick={onClick}
    className={`px-2 py-1 rounded-md text-xs font-medium border cursor-pointer transition-all ${
      isActive
        ? 'bg-primary text-white border-primary shadow-sm'
        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
    }`}
  >
    {tag}
  </span>
);

export default Sidebar;
