import { BookOpen, Clock, GripVertical, ArrowRight } from "lucide-react";
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
    <div className="relative rounded-xl h-full border border-surface-highlight bg-card p-8">
      <BookOpen className="absolute right-8 top-8 size-56 text-white/5 rotate-12" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-xl font-bold">Currently Reading</h2>
      </div>

      {/* Main Book */}
      <div className="flex gap-6 mb-8">
        <div
          className="w-32 aspect-[2/3] rounded-xl bg-cover bg-center shadow-lg shrink-0"
          style={{ backgroundImage: `url("${currentBook.cover}")` }}
        />

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-xl truncate">
            {currentBook.title}
          </h3>

          <p className="text-muted-foreground text-base mb-4">
            by {currentBook.author}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-2">
              <Clock className="size-4" />
              {currentBook.timeLeft} left
            </span>
          </div>

          {/* Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {currentBook.progress}% Complete
              </span>
            </div>

            <Progress
              value={currentBook.progress}
              className="h-3"
            />
          </div>

          <Button size="default" className="mt-6">
            Update Progress
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CurrentlyReading;

