import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Progress } from "@/components/ui/progress";

// Define a type for the profile data based on your schema
interface Profile {
  full_name: string;
  username: string;
  avatar_url: string;
  reading_level: string;
}

const DashboardSidebar = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      // Get the current authenticated user
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Fetch profile data from your 'profiles' table
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) setProfile(data);
        if (error) console.error("Error fetching profile:", error.message);
      }
      setLoading(false);
    };

    getProfile();
  }, []);

  // Show a "Medium" style loading skeleton instead of a blank string
  if (loading) {
    return (
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 min-h-screen p-6 space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="size-20 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 min-h-screen transition-all duration-300">
      
      {/* User Profile Section */}
      <div className="group/profile relative overflow-hidden p-6 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
        
        {/* Profile Watermark */}
        <span className="material-symbols-outlined absolute right-[-5px] top-[-5px] text-[90px] text-primary/5 rotate-[-15deg] pointer-events-none transition-transform duration-700 group-hover/profile:rotate-0 group-hover/profile:scale-110">
          account_circle
        </span>

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Dynamic Avatar */}
          <div className="relative mb-3">
            <div className="size-20 rounded-full overflow-hidden border-4 border-white dark:border-slate-900 shadow-lg shadow-primary/10 transition-transform duration-500 group-hover/profile:scale-105">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-2xl font-black text-white">
                  {profile?.full_name?.[0] || 'U'}
                </div>
              )}
            </div>
            <div className="absolute bottom-0.5 right-0.5 size-5 bg-green-500 border-[3px] border-white dark:border-slate-900 rounded-full shadow-sm"></div>
          </div>
          
          {/* Dynamic Profile Info */}
          <h3 className="font-bold text-base truncate w-full">
            {profile?.full_name || "New Reader"}
          </h3>
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">
            {profile?.reading_level || "Novice Reader"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="relative z-10 grid grid-cols-3 gap-1 mt-6">
          <div className="flex flex-col items-center p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-primary text-[18px] mb-0.5">book_4</span>
            <p className="text-xs font-black">42</p>
            <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter">Read</p>
          </div>
          <div className="flex flex-col items-center p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-primary text-[18px] mb-0.5">person_add</span>
            <p className="text-xs font-black">128</p>
            <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter">Following</p>
          </div>
          <div className="flex flex-col items-center p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-primary text-[18px] mb-0.5">groups</span>
            <p className="text-xs font-black">96</p>
            <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter">Followers</p>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-700">
         <button className="flex items-center justify-between w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-muted-foreground hover:text-primary group/nav">
            <div className="flex items-center gap-2.5 font-bold text-xs">
                <span className="material-symbols-outlined text-[20px] transition-transform group-hover/nav:rotate-12">settings</span>
                SETTINGS
            </div>
            <span className="material-symbols-outlined text-[16px] opacity-0 group-hover/nav:opacity-100 transition-all -translate-x-1 group-hover/nav:translate-x-0">chevron_right</span>
         </button>
      </div>

    </aside>
  );
};

export default DashboardSidebar;
