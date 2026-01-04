import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-highlight bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <BookOpen className="size-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">Bookworm</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="#">
            Features
          </a>
          <a className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="#">
            Community
          </a>
          <a className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="#">
            Pro
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden sm:flex text-muted-foreground hover:text-foreground" asChild>
            <Link to="/auth">Log In</Link>
          </Button>
          <Button className="shadow-lg shadow-primary/20" asChild>
            <Link to="/auth">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;