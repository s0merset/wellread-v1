import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

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
  rightElement, 
  variant = 'app' 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const defaultAppLinks: HeaderLink[] = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Discover', href: '/search' },
    { label: 'Lists', href: '/lists' },
    { label: 'Tracker', href: '/tracker' },
    { label: 'Profile', href: '/profile' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-3 flex items-center justify-between">
        
        {/* LEFT SECTION: LOGO */}
        <div className="flex-1 flex items-center">
          <Link to="/" className="flex items-center gap-4">
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-white">WellRead</h2>
          </Link>
        </div>

        {/* CENTER SECTION: NAVIGATION */}
        <div className="hidden md:flex flex-1 justify-center">
          {variant === 'app' && (
            <nav className="flex items-center gap-8">
              {defaultAppLinks.map((link) => {
                const isActive = location.pathname === link.href || activePage === link.label;
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`text-sm font-semibold transition-colors hover:text-primary ${
                      isActive 
                        ? 'text-primary' 
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* RIGHT SECTION: ACTIONS */}
        <div className="flex-1 flex items-center justify-end gap-4">
          {rightElement ? (
            rightElement 
          ) : variant === 'landing' ? (
            <>
              <button 
                onClick={() => navigate('/auth')}
                className="text-slate-600 dark:text-slate-300 font-medium hover:text-primary transition-colors text-sm"
              >
                Log in
              </button>
              <button 
                onClick={() => navigate('/auth')}
                className="flex items-center justify-center rounded-lg h-9 px-5 bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all"
              >
                Join Now
              </button>
            </>
          ) : (
            <>
              {/* Notifications */}
              <button className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors flex items-center">
                <span className="material-symbols-outlined text-2xl">notifications</span>
              </button>
              
              {/* Log Book */}
              <button 
                onClick={() => navigate('/tracker')}
                className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all"
              >
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
