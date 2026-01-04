import { Clock, Bookmark, GripVertical, ArrowRight } from "lucide-react";
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

const upNext = [
  { title: "Dune", author: "Frank Herbert" },
  { title: "Tomorrow, and Tomorrow", author: "Gabrielle Zevin" },
];

const CurrentlyReading = () => {
  return (
    <div className="rounded-xl border border-surface-highlight bg-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
          <Bookmark className="size-4" />
        </div>
        <h2 className="text-lg font-bold">Currently Reading</h2>
      </div>

      {/* Main Book */}
      <div className="flex gap-4 mb-6">
        <div
          className="w-24 aspect-[2/3] rounded-lg bg-cover bg-center shadow-lg shrink-0"
          style={{ backgroundImage: `url("${currentBook.cover}")` }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg truncate">{currentBook.title}</h3>
          <p className="text-muted-foreground text-sm mb-3">by {currentBook.author}</p>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {currentBook.timeLeft} left
            </span>
            <span className="flex items-center gap-1">
              <Bookmark className="size-3" />
              Page {currentBook.currentPage}/{currentBook.totalPages}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{currentBook.progress}% Complete</span>
            </div>
            <Progress value={currentBook.progress} className="h-2" />
          </div>

          <Button size="sm" className="mt-4">
            Update Progress
          </Button>
        </div>
      </div>

      {/* Up Next */}
      <div className="border-t border-surface-highlight pt-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Up Next</h4>
        <div className="space-y-3">
          {upNext.map((book, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-surface-highlight/50 hover:bg-surface-highlight transition-colors cursor-pointer"
            >
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{book.title}</p>
                <p className="text-xs text-muted-foreground truncate">{book.author}</p>
              </div>
              <GripVertical className="size-4 text-muted-foreground shrink-0" />
            </div>
          ))}
        </div>
        <Button variant="ghost" className="w-full mt-4 text-primary hover:text-primary/80">
          View Reading List
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default CurrentlyReading;