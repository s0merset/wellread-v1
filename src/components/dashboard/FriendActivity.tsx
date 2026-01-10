import React from "react";
import { Button } from "@/components/ui/button";

// --- Types ---
// Keeping your rich Activity interface so the UI elements (likes, ratings, books) work
export interface Activity {
  id: string;
  type: "rating" | "finished" | "list";
  created_at: string;
  user: {
    full_name: string;
    avatar_url: string;
    username: string;
  };
  book?: {
    title: string;
    author: string;
    cover_url: string;
  };
  rating?: number;
  review?: string;
  listName?: string;
  bookCount?: number;
  likes: number;
}

interface FriendActivityProps {
  activities: Activity[];
  loading?: boolean; // You can pass loading state from Dashboard if you want
}

const FriendActivity: React.FC<FriendActivityProps> = ({ activities, loading }) => {
  
  // Skeleton Loader (kept your exact styling)
  if (loading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-80 h-72 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="space-y-2">
                <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-2 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            </div>
            <div className="h-32 w-full bg-slate-100 dark:bg-slate-900 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary font-fill">group</span>
          <h2 className="font-black text-sm uppercase tracking-widest text-slate-700 dark:text-slate-300">Friend Activity</h2>
        </div>

        <Button variant="ghost" size="sm" className="group/all text-primary hover:bg-primary/5 transition-all text-xs font-bold">
          SEE ALL
          <span className="material-symbols-outlined text-[18px] ml-1 group-hover/all:translate-x-1 transition-transform">
            chevron_right
          </span>
        </Button>
      </div>

      {/* Activity Cards - Horizontal Layout */}
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
        {activities.length === 0 ? (
          <div className="w-full py-10 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-sm">
            Follow more readers to see their activity!
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="group/card relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 w-80 h-72 flex-shrink-0 flex flex-col"
            >
              {/* Dynamic Watermark */}
              <span className="material-symbols-outlined absolute right-[-15px] top-[-15px] text-[150px] text-primary/5 rotate-[-10deg] pointer-events-none transition-transform duration-700 group-hover/card:rotate-[5deg] group-hover/card:scale-110">
                {activity.type === "rating" ? "grade" : activity.type === "list" ? "format_list_bulleted" : "check_circle"}
              </span>

              <div className="relative z-10 flex flex-col h-full">
                {/* User Info Bar */}
                <div className="flex items-center gap-3 mb-4">
                  {activity.user?.avatar_url ? (
                    <img
                      src={activity.user.avatar_url}
                      className="size-10 rounded-full border-2 border-white dark:border-slate-800 shadow-sm object-cover shrink-0"
                      alt={activity.user.full_name}
                    />
                  ) : (
                    <div className="size-10 rounded-full bg-primary flex items-center justify-center font-bold text-white shrink-0 text-xs">
                      {activity.user?.full_name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-sm truncate text-slate-900 dark:text-white">
                      {activity.user?.full_name || activity.user?.username || "A Reader"}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {/* Activity Type Icon */}
                  <div className={`p-1.5 rounded-lg ${
                    activity.type === "finished" ? "bg-green-500/10 text-green-500" : 
                    activity.type === "list" ? "bg-blue-500/10 text-blue-500" : "bg-primary/10 text-primary"
                  }`}>
                     <span className="material-symbols-outlined text-[18px]">
                        {activity.type === "rating" && "grade"}
                        {activity.type === "finished" && "check_circle"}
                        {activity.type === "list" && "library_add"}
                     </span>
                  </div>
                </div>

                {/* Main Content Box */}
                <div className="flex-1 overflow-hidden">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 backdrop-blur-sm h-full">
                    {activity.type !== "list" ? (
                      <>
                        <div className="flex gap-3 mb-2">
                          <img src={activity.book?.cover_url} className="w-8 h-12 object-cover rounded shadow-sm" alt="cover" />
                          <div className="min-w-0">
                            <p className="font-bold text-[13px] leading-tight text-slate-900 dark:text-white line-clamp-1">{activity.book?.title}</p>
                            <p className="text-[11px] text-slate-500 truncate">{activity.book?.author}</p>
                          </div>
                        </div>
                        
                        {activity.rating && (
                          <div className="flex gap-0.5 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`material-symbols-outlined text-[14px] ${i < (activity.rating || 0) ? "text-yellow-500 font-fill" : "text-slate-300"}`}>
                                star
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <p className="text-xs text-slate-600 dark:text-slate-400 italic line-clamp-3 leading-relaxed">
                          "{activity.review || `Just finished reading ${activity.book?.title}!`}"
                        </p>
                      </>
                    ) : (
                      <div className="py-1">
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1">New List Created</p>
                        <p className="font-black text-sm mb-2 text-slate-900 dark:text-white">{activity.listName}</p>
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-800">
                          <span className="material-symbols-outlined text-[18px] text-blue-500">auto_stories</span>
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{activity.bookCount} books added</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Social Actions */}
                <div className="flex gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button className="flex items-center gap-1.5 text-[11px] font-black text-slate-400 hover:text-primary transition-colors group/btn uppercase tracking-tighter">
                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover/btn:scale-110 group-hover/btn:-rotate-12">
                      {activity.type === "list" ? "favorite" : "thumb_up"}
                    </span>
                    {activity.likes} Likes
                  </button>
                  <button className="flex items-center gap-1.5 text-[11px] font-black text-slate-400 hover:text-primary transition-colors group/btn uppercase tracking-tighter">
                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover/btn:scale-110">
                      chat_bubble
                    </span>
                    Comment
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FriendActivity;
