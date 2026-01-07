import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
}

interface UserResult extends Profile {
  isFollowing: boolean;
}

interface FindUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // To refresh stats
}

const FindUsersModal: React.FC<FindUsersModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Clear search when opening
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setResults([]);
    }
  }, [isOpen]);

  // Search Logic
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Search Profiles (exclude self)
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id) // Don't show myself
        .or(`username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
        .limit(20);

      if (error) throw error;

      // 2. Check who I am already following
      const { data: myFollows } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);

      const followingIds = new Set(myFollows?.map(f => f.following_id));

      // 3. Merge data
      const mappedResults = (profiles || []).map((p: any) => ({
        ...p,
        isFollowing: followingIds.has(p.id)
      }));

      setResults(mappedResults);

    } catch (error) {
      console.error(error);
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async (targetUser: UserResult) => {
    try {
      setProcessingId(targetUser.id);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (targetUser.isFollowing) {
        // UNFOLLOW
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetUser.id);
        
        if (error) throw error;
        toast.success(`Unfollowed @${targetUser.username}`);
      } else {
        // FOLLOW
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: targetUser.id
          });

        if (error) throw error;
        toast.success(`Following @${targetUser.username}`);
      }

      // Update local state immediately
      setResults(prev => prev.map(p => 
        p.id === targetUser.id ? { ...p, isFollowing: !p.isFollowing } : p
      ));
      
      onSuccess(); // Refresh parent stats

    } catch (error) {
      console.error(error);
      toast.error("Action failed");
    } finally {
      setProcessingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[80vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Find Friends</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">close</span></button>
          </div>
          
          <form onSubmit={handleSearch} className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">search</span>
            <input 
              type="text" 
              placeholder="Search username or name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-900 dark:text-white"
              autoFocus
            />
          </form>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {loading ? (
             <div className="flex justify-center py-8"><span className="material-symbols-outlined animate-spin text-blue-500">sync</span></div>
          ) : results.length > 0 ? (
            results.map((user) => (
              <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-slate-500 text-xs">
                      {user.username.substring(0,2).toUpperCase()}
                    </div>
                  )}
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.full_name || 'Reader'}</h4>
                  <p className="text-xs text-slate-500 truncate">@{user.username}</p>
                </div>

                {/* Follow Button */}
                <button 
                  onClick={() => toggleFollow(user)}
                  disabled={processingId === user.id}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    user.isFollowing 
                      ? 'bg-transparent border-slate-300 dark:border-slate-600 text-slate-500 hover:border-red-500 hover:text-red-500'
                      : 'bg-blue-500 border-transparent text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20'
                  }`}
                >
                  {processingId === user.id ? (
                    <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                  ) : user.isFollowing ? (
                    'Following'
                  ) : (
                    'Follow'
                  )}
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-500 text-sm">
              {searchTerm ? "No users found." : "Search for other readers to follow."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindUsersModal;
