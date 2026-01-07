import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const currentBook = {
  title: "Project Hail Mary",
  author: "Andy Weir",
  cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhQ-dPdFmzgmcAk1gxiOKUWDnG9se3uQLOr_vnd_8rAJVkmomI8Bbv2nciAm2A3WZ7cDO6NS8kXRZ6TPPaa2PeB9S3ztT-v7RmDC5bfxpNaJzaycjd2vTWAdYAY5PFkDRrkCwvjMlDYPsUWTOJ6gWJnjbmrb724qwtN_V9Ge_VEXY2vpx8InoUVHeX9NLBGtYCt6MH5UARq6IZP0MY3AWJFqH5INFQ3LWxvSuZXuZLVkeQP-aLaBD-nHw-glK0iKVE_JikqVIUHQ",
  timeLeft: "4h 32m",
  currentPage: 342,
  totalPages: 496,
  progress: 68,
};

const CurrentlyReading = () => {
  return (
    <div className="group border border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:bg-surface-dark relative rounded-xl h-full p-8 transition-all duration-300 overflow-hidden">
      
      {/* Background Watermark Icon */}
      <span className="material-symbols-outlined absolute right-[-20px] top-[-20px] text-[240px] text-slate-500/5 dark:text-white/5 rotate-12 pointer-events-none transition-transform duration-700 group-hover:rotate-[20deg] group-hover:scale-110">
        menu_book
      </span>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="material-symbols-outlined text-primary">auto_stories</span>
        <h2 className="text-xl font-bold">Currently Reading</h2>
      </div>

      {/* Main Book */}
      <div className="flex flex-col md:flex-row gap-8 relative z-10">
        {/* Book Cover with subtle lift on hover */}
        <div
          className="w-36 aspect-[2/3] rounded-xl bg-cover bg-center shadow-xl shrink-0 transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-2"
          style={{ backgroundImage: `url("${currentBook.cover}")` }}
        />

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div>
            <h3 className="font-bold text-2xl truncate mb-1">
              {currentBook.title}
            </h3>
            <p className="text-muted-foreground text-lg mb-4">
              by {currentBook.author}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              <span className="material-symbols-outlined text-[18px]">schedule</span>
              {currentBook.timeLeft} left
            </span>
            <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              <span className="material-symbols-outlined text-[18px]">import_contacts</span>
              {currentBook.currentPage} / {currentBook.totalPages} pages
            </span>
          </div>

          {/* Progress Section */}
          <div className="space-y-3 max-w-md">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                {currentBook.progress}% Complete
              </span>
            </div>

            <Progress
              value={currentBook.progress}
              className="h-2.5 bg-slate-200 dark:bg-slate-800"
            />
          </div>

          {/* Dynamic Button */}
          <div className="mt-8">
            <Button size="lg" className="group/btn relative overflow-hidden flex items-center gap-2 pr-4 transition-all hover:pr-10">
              Update Progress
              <span className="material-symbols-outlined text-[20px] absolute right-[-20px] opacity-0 transition-all duration-300 group-hover/btn:right-3 group-hover/btn:opacity-100">
                arrow_forward
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentlyReading;
