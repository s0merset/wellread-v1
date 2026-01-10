import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Import Router hooks

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
  const navigate = useNavigate(); // 2. Hook for button navigation

  // 3. Define Real App Routes
  const defaultAppLinks: HeaderLink[] = [
    { label: 'Home', href: '/dashboard' }, // Or '/' depending on your setup
    { label: 'Discover', href: '/search' },
    { label: 'Lists', href: '/lists' },
    { label: 'Tracker', href: '/tracker' },
    { label: 'Profile', href: '/profile' },
  ];

  // 4. Landing Page Links (Anchors are usually fine here, or use /#features)


  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-3 flex items-center justify-between">
        
        {/* LOGO - Link back to home */}
        <Link to="/" className="flex items-center gap-4">
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-white">WellRead</h2>
        </Link>


        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          {rightElement ? (
            rightElement 
          ) : variant === 'landing' ? (
            <>
              <button 
                onClick={() => navigate('/auth')}
                className="text-slate-600 dark:text-slate-300 font-medium hover:text-primary transition-colors"
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
              {/* Notifications (Placeholder logic) */}
              <button className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-2xl">notifications</span>
              </button>
              
              {/* Log Book - Redirects to Tracker where the modal logic lives */}
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
