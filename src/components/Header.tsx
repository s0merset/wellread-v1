import React from 'react';
import { NavItem } from '../types';

interface HeaderProps {
  activePage: NavItem;
}

const Header: React.FC<HeaderProps> = ({ activePage }) => {
  const navItems: NavItem[] = ['Home', 'Discover', 'Lists', 'Tracker', 'Profile'];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-primary">
            <span className="material-symbols-outlined text-3xl">menu_book</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] hidden sm:block dark:text-white">Bookworm</h2>
        </div>

        <nav className="hidden md:flex flex-1 justify-center gap-8">
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              className={`text-sm font-medium transition-colors ${
                activePage === item 
                  ? 'text-primary font-bold' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary'
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="text-slate-600 dark:text-slate-300 hover:text-primary">
            <span className="material-symbols-outlined text-2xl">notifications</span>
          </button>
          <a className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-200 dark:border-slate-700" href="#">
            <span className="material-symbols-outlined text-xl text-slate-500 dark:text-slate-300">person</span>
          </a>
          <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all">
            <span>Log Book</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
