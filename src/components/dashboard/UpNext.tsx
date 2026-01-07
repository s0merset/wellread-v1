import { Button } from "@/components/ui/button";

const upNext = [
  { title: "The Midnight Library", author: "Matt Haig" },
  { title: "Atomic Habits", author: "James Clear" },
  { title: "Project Hail Mary", author: "Andy Weir" },
];

const UpNext = () => {
  return (
    <div className="group/card relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:bg-surface-dark h-full p-6 transition-all duration-300">
      
      {/* Background Watermark Icon - Consistent with Currently Reading */}
      <span className="material-symbols-outlined absolute right-[-10px] top-[-10px] text-[120px] text-slate-500/5 dark:text-white/5 rotate-[-15deg] pointer-events-none transition-transform duration-700 group-hover/card:rotate-[-25deg] group-hover/card:scale-110">
        format_list_bulleted
      </span>

      {/* Header */}
      <div className="flex items-center gap-2 mb-6 relative z-10">
        <span className="material-symbols-outlined text-primary text-[22px]">list_alt</span>
        <h4 className="text-lg font-bold">Up Next</h4>
      </div>

      {/* List Container */}
      <div className="space-y-3 relative z-10">
        {upNext.map((book, index) => (
          <div
            key={index}
            className="group/item flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 cursor-grab active:cursor-grabbing"
          >
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate group-hover/item:text-primary transition-colors">
                {book.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {book.author}
              </p>
            </div>
            
            {/* Material Drag Handle */}
            <span className="material-symbols-outlined text-slate-400 group-hover/item:text-primary transition-colors select-none">
              drag_indicator
            </span>
          </div>
        ))}
      </div>

      {/* Dynamic Footer Button */}
      <div className="mt-6 relative z-10">
        <Button 
          variant="ghost" 
          className="group/btn w-full justify-between text-primary hover:text-primary hover:bg-primary/5 px-4 transition-all"
        >
          <span className="flex items-center gap-2">
            View Reading List
          </span>
          
          <div className="relative flex items-center overflow-hidden w-5 h-5">
            <span className="material-symbols-outlined text-[20px] absolute transition-all duration-300 translate-x-[-20px] opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100">
              arrow_forward
            </span>
            <span className="material-symbols-outlined text-[20px] absolute transition-all duration-300 translate-x-0 opacity-100 group-hover/btn:translate-x-[20px] group-hover/btn:opacity-0">
              chevron_right
            </span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default UpNext;
