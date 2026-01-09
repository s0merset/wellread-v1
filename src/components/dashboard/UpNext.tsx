import { Button } from "@/components/ui/button";

interface UserBook {
  id: string;
  books: { 
    title: string; 
    author: string; 
  };
}

interface UpNextProps {
  books: UserBook[];
}

const UpNext: React.FC<UpNextProps> = ({ books }) => {
  return (
    <div className="group/card relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b]/30 h-full p-6 transition-all duration-300 shadow-sm">
      
      {/* Background Watermark Icon */}
      <span className="material-symbols-outlined absolute right-[-10px] top-[-10px] text-[120px] text-slate-500/5 dark:text-white/5 rotate-[-15deg] pointer-events-none transition-transform duration-700 group-hover/card:rotate-[-25deg] group-hover/card:scale-110">
        format_list_bulleted
      </span>

      {/* Header */}
      <div className="flex items-center gap-2 mb-6 relative z-10">
        <span className="material-symbols-outlined text-blue-500 text-[22px]">list_alt</span>
        <h4 className="text-lg font-bold">Up Next</h4>
      </div>

      {/* List Container */}
      <div className="space-y-3 relative z-10">
        {books.length > 0 ? (
          books.map((item) => (
            <div
              key={item.id}
              className="group/item flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-transparent hover:border-blue-500/20 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 cursor-grab active:cursor-grabbing"
            >
              <div className="min-w-0">
                <p className="font-bold text-sm truncate group-hover/item:text-blue-500 transition-colors">
                  {item.books.title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-medium">
                  {item.books.author}
                </p>
              </div>
              
              <span className="material-symbols-outlined text-slate-400 group-hover/item:text-blue-500 transition-colors select-none text-[18px]">
                drag_indicator
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-xs text-slate-500 italic">No books in your queue.</p>
          </div>
        )}
      </div>

      {/* Footer Button */}
      <div className="mt-6 relative z-10">
        <Button 
          variant="ghost" 
          className="group/btn w-full justify-between text-blue-500 hover:text-blue-600 hover:bg-blue-500/5 px-4 transition-all rounded-xl font-bold text-xs uppercase tracking-tight"
        >
          <span>View Reading List</span>
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
