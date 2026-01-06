import React from 'react';

interface HeaderLink {
  label: string;
  href: string;
}

interface HeaderProps {
  activePage?: string;
  links?: HeaderLink[]; 
  rightElement?: React.ReactNode; 
  variant?: 'app' | 'landing'; 
}

const Header: React.FC<HeaderProps> = ({ 
  activePage, 
  links, 
  rightElement, 
  variant = 'app' 
}) => {
  // 1. Define Default App Navigation
  const defaultAppLinks: HeaderLink[] = [
    { label: 'Home', href: '#' },
    { label: 'Discover', href: '#' },
    { label: 'Lists', href: '#' },
    { label: 'Tracker', href: '#' },
    { label: 'Profile', href: '#' },
  ];

  // 2. Define Default Landing Navigation
  const defaultLandingLinks: HeaderLink[] = [
    { label: 'Features', href: '#features' },
    { label: 'Popular', href: '#popular' },
    { label: 'Community', href: '#community' },
  ];

  const navItems = links || (variant === 'landing' ? defaultLandingLinks : defaultAppLinks);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-3 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] dark:text-white">WellRead</h2>
        </div>

        {/* NAVIGATION: Hover effects restored here */}
        <nav className="hidden md:flex flex-1 justify-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`text-sm font-medium transition-all duration-200 ${
                activePage === item.label 
                  ? 'text-primary font-bold' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary' 
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* ACTIONS: Hover effects restored for buttons */}
        <div className="flex items-center gap-4">
          {rightElement ? (
            rightElement 
          ) : variant === 'landing' ? (
            <>
              <button className="text-slate-600 dark:text-slate-300 font-medium hover:text-primary transition-colors">
                Log in
              </button>
              <button className="flex items-center justify-center rounded-lg h-9 px-5 bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all">
                Join Now
              </button>
            </>
          ) : (
            <>
              <button className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-2xl">notifications</span>
              </button>
              <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all">
                <span>Log Book</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
