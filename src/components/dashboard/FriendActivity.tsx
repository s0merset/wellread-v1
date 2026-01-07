import { Button } from "@/components/ui/button";

const activities = [
  {
    type: "rating",
    user: { name: "Jam T.", initial: "J" },
    timeAgo: "2h ago",
    book: { title: "The Brothers Karamazov", author: "Fyodor Dostoevsky" },
    rating: 5,
    review: "Absolutely loved this concept! It made me rethink so many choices...",
    likes: 12,
    comments: 3,
    watermark: "grade"
  },
  {
    type: "finished",
    user: { name: "Hayman W.", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpQkhpNALiuhl0Qa3MhIYFLHAs_uGu76iaCGQIGmvGHf-DT6IUw2xwzRziXPlf0BiBU9R22DzOHSOE2noF-g2bSnGAJj1W0hqdGjd_ubzMj_se5f0BKQj8YfYvvwE8Vv9qvnAZ_AofEbJinb2Ul-tC6aHm7rWvUR3nPvqC7j6CKboUkFooB1HPQ1yrAp0mv0hgm-HmaoBNWiATIEJsLsdXoQHPrZq257gQFgPV3hboCbJqy35Ewd9zNPkgZWdxIl75EPy3ky14lg" },
    timeAgo: "5h ago",
    book: { title: "Atomic Habits", author: "James Clear" },
    review: "Life changing read. Highly recommend.",
    likes: 24,
    watermark: "check_circle"
  },
  {
    type: "list",
    user: { name: "Pato Toya", initial: "P" },
    timeAgo: "1d ago",
    listName: "2024 Sci-Fi Must Reads",
    bookCount: 8,
    likes: 8,
    watermark: "format_list_bulleted"
  },
];

const FriendActivity = () => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">group</span>
          <h2 className="text-lg font-bold">Friend Activity</h2>
        </div>
        
        <Button variant="ghost" size="sm" className="group/all text-primary hover:bg-primary/5 transition-all">
          SEE ALL
          <div className="relative flex items-center overflow-hidden w-5 h-5 ml-1">
            <span className="material-symbols-outlined text-[18px] absolute transition-all duration-300 translate-x-[-20px] opacity-0 group-hover/all:translate-x-0 group-hover/all:opacity-100">
              arrow_forward
            </span>
            <span className="material-symbols-outlined text-[18px] absolute transition-all duration-300 translate-x-0 opacity-100 group-hover/all:translate-x-[20px] group-hover/all:opacity-0">
              chevron_right
            </span>
          </div>
        </Button>
      </div>

      {/* Activity Cards - Horizontal Layout */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="group/card relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:bg-surface-dark p-5 hover:shadow-xl transition-all duration-300 w-80 h-72 flex-shrink-0 flex flex-col"
          >
            {/* Dynamic Watermark based on activity type */}
            <span className="material-symbols-outlined absolute right-[-15px] top-[-15px] text-[150px] text-slate-500/5 dark:text-white/5 rotate-[-10deg] pointer-events-none transition-transform duration-700 group-hover/card:rotate-[5deg] group-hover/card:scale-110">
              {activity.watermark}
            </span>

            <div className="relative z-10 flex flex-col h-full">
              {/* User Info Bar */}
              <div className="flex items-center gap-3 mb-4">
                {activity.user.avatar ? (
                  <div
                    className="size-10 rounded-full border-2 border-background shadow-sm bg-cover bg-center shrink-0"
                    style={{ backgroundImage: `url("${activity.user.avatar}")` }}
                  />
                ) : (
                  <div className="size-10 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center font-bold text-white shrink-0 shadow-sm">
                    {activity.user.initial}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm truncate">{activity.user.name}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{activity.timeAgo}</p>
                </div>
                
                {/* Activity Type Icon */}
                <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                   {activity.type === "rating" && <span className="material-symbols-outlined text-primary text-[18px]">grade</span>}
                   {activity.type === "finished" && <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>}
                   {activity.type === "list" && <span className="material-symbols-outlined text-blue-500 text-[18px]">library_add</span>}
                </div>
              </div>

              {/* Main Content Box */}
              <div className="flex-1 overflow-hidden">
                <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 backdrop-blur-sm">
                  {activity.type !== "list" ? (
                    <>
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <p className="font-bold text-sm truncate group-hover/card:text-primary transition-colors">{activity.book?.title}</p>
                      </div>
                      
                      {activity.rating && (
                        <div className="flex gap-0.5 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`material-symbols-outlined text-[14px] ${i < activity.rating ? "text-primary font-fill" : "text-slate-300"}`}>
                              star
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-xs text-muted-foreground italic line-clamp-3">
                        "{activity.review}"
                      </p>
                    </>
                  ) : (
                    <div className="py-2">
                      <p className="text-xs text-primary font-bold uppercase tracking-widest mb-1">New List Created</p>
                      <p className="font-bold text-sm mb-1">{activity.listName}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">auto_stories</span>
                        {activity.bookCount} books added
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Actions */}
              <div className="flex gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors group/btn">
                  <span className="material-symbols-outlined text-[18px] transition-transform group-hover/btn:scale-120 group-hover/btn:-rotate-12">
                    {activity.type === "list" ? "favorite" : "thumb_up"}
                  </span>
                  {activity.likes}
                </button>
                {activity.comments !== undefined && (
                  <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors group/btn">
                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover/btn:scale-120">
                      chat_bubble
                    </span>
                    {activity.comments}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendActivity;
