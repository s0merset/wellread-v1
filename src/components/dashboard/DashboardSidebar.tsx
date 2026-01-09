import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// --- Shadcn UI Components ---
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// --- Existing Modals ---
import EditProfileModal from '@/components/profile/EditProfile';
import AddReviewModal from '@/components/review/AddReview';
import FindUsersModal from '@/components/profile/FindUsers';

const DashboardSidebar = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false); 
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  
  // --- Profile & Stats State ---
  const [profile, setProfile] = useState({ 
    username: '', 
    full_name: '', 
    avatar_url: '', 
    bio: '' 
  });
  const [stats, setStats] = useState({ 
    booksRead: 0, 
    reviews: 0, 
    lists: 0, 
    followers: 0, 
    following: 0,
    yearCount: 0 
  });

  // --- Modal States ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isFindFriendsOpen, setIsFindFriendsOpen] = useState(false);

  // --- DATA FETCHING LOGIC ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch Profile Info
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // 2. Fetch User Books (for Read Count, Reviews, and Yearly Count)
      const { data: userBooks, error: booksError } = await supabase
        .from('user_books')
        .select('status, review_text, finished_at')
        .eq('user_id', user.id);

      if (booksError) throw booksError;

      const finishedBooks = userBooks?.filter(b => b.status === 'finished') || [];
      const currentYear = new Date().getFullYear();

      // 3. Fetch Follower Counts
      const { count: followersCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', user.id);

      const { count: followingCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', user.id);

      // 4. Fetch List Count
      const { count: listsCount } = await supabase
        .from('lists')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // --- Set Final State ---
      setProfile({
        username: profileData?.username || user.email?.split('@')[0] || 'reader',
        full_name: profileData?.full_name || 'Reader',
        avatar_url: profileData?.avatar_url || '',
        bio: profileData?.bio || ''
      });

      setStats({
        booksRead: finishedBooks.length,
        reviews: userBooks?.filter(b => b.review_text).length || 0,
        lists: listsCount || 0,
        followers: followersCount || 0,
        following: followingCount || 0,
        yearCount: finishedBooks.filter(b => b.finished_at && new Date(b.finished_at).getFullYear() === currentYear).length
      });

    } catch (error: any) {
      console.error("Sidebar Fetch Error:", error.message);
      toast.error("Failed to sync profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
      setIsLoggingOut(false);
    } else {
      setTimeout(() => {
        window.location.href = "/login";
      }, 800);
    }
  };

  // --- RENDERING LOGIC ---

  if (isLoggingOut) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white dark:bg-[#0f172a] flex items-center justify-center">
         <span className="material-symbols-outlined animate-spin text-4xl text-blue-500">sync</span>
      </div>
    );
  }

  if (loading) {
    return (
      <aside className="hidden lg:flex flex-col w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] min-h-screen p-6 animate-pulse">
        <div className="size-20 rounded-full bg-slate-200 dark:bg-slate-800 mb-4 self-center" />
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded self-center mb-8" />
        <div className="grid grid-cols-3 gap-2 w-full h-32 bg-slate-100 dark:bg-slate-900 rounded-xl" />
      </aside>
    );
  }

  return (
    <aside className="hidden lg:flex flex-col w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] min-h-screen sticky top-0 overflow-y-auto no-scrollbar">
      
      {/* Sign Out Prompt */}
      <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <AlertDialogContent className="rounded-2xl border-slate-200 dark:border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black text-xl">Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 dark:text-slate-400 font-medium">
              Are you sure you want to end your session?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="rounded-xl font-bold uppercase tracking-widest text-xs h-11 border-none bg-slate-100 dark:bg-slate-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSignOut}
              className="rounded-xl font-black uppercase tracking-widest text-xs h-11 bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Profile Modals */}
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSuccess={fetchData} initialData={profile} />
      <AddReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} onSuccess={fetchData} />
      <FindUsersModal isOpen={isFindFriendsOpen} onClose={() => setIsFindFriendsOpen(false)} onSuccess={fetchData} />

      <div className="p-6 flex flex-col">
        {/* Profile Identity Section */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-4 group">
            <div className="size-20 rounded-full p-[2px] ring-2 ring-slate-100 dark:ring-slate-800 overflow-hidden shadow-xl">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold rounded-full">
                  {profile.username.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <h3 className="font-black text-lg text-slate-900 dark:text-white truncate w-full">{profile.full_name}</h3>
          <p className="text-xs text-slate-500 font-medium mb-3">@{profile.username}</p>
          
          <div className="flex gap-1.5">
            <span className="text-[9px] font-black bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-0.5 rounded uppercase tracking-tighter">Member</span>
            <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-tighter">Active</span>
          </div>
        </div>

        {/* Dynamic Stats Grid (Matches Profile Blueprint) */}
        <div className="grid grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden mb-8 shadow-sm">
          <SidebarStat value={stats.booksRead} label="Books" />
          <SidebarStat value={stats.reviews} label="Reviews" />
          <SidebarStat value={stats.lists} label="Lists" />
          <SidebarStat value={stats.followers} label="Followers" />
          <SidebarStat value={stats.following} label="Following" />
          <SidebarStat value={stats.yearCount} label="Yearly" />
        </div>

      </div>

      {/* Footer Nav */}
      <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
         <SidebarNavLink icon="settings" label="Settings" />
         <button 
           onClick={() => setShowSignOutDialog(true)}
           className="flex items-center gap-3 w-full p-2.5 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all font-bold text-xs uppercase tracking-widest group"
         >
           <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">logout</span>
           Sign Out
         </button>
      </div>
    </aside>
  );
};

// --- Sub-components ---
const SidebarStat = ({ value, label }: { value: number, label: string }) => (
  <div className="bg-white dark:bg-[#0f172a] p-3 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
    <div className="text-sm font-black text-slate-900 dark:text-white">{value}</div>
    <div className="text-[8px] text-slate-400 uppercase font-black tracking-tighter">{label}</div>
  </div>
);

const SidebarNavLink = ({ icon, label, active = false }: { icon: string, label: string, active?: boolean }) => (
  <button className={`flex items-center justify-between w-full p-2.5 rounded-xl transition-all group ${active ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-500' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
    <div className="flex items-center gap-3 font-bold text-xs uppercase tracking-widest">
      <span className={`material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform ${active ? 'font-fill' : ''}`}>{icon}</span>
      {label}
    </div>
    {active && <span className="material-symbols-outlined text-[16px]">chevron_right</span>}
  </button>
);

export default DashboardSidebar;
