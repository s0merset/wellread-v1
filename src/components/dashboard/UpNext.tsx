import { ArrowRight, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

const upNext = [
  { title: "The Midnight Library", author: "Matt Haig" },
  { title: "Atomic Habits", author: "James Clear" },
  { title: "Project Hail Mary", author: "Andy Weir" },
];

const UpNext = () => {
  return (
    <div className="rounded-xl h-full border border-surface-highlight bg-card p-6">
      <h4 className="text-lg font-bold mb-4">Up Next</h4>
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
  );
};

export default UpNext;
