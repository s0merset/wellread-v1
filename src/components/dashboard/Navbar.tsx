import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Bell, User } from "lucide-react";

const NavBar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-highlight bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16  items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <span className="text-4xl translate-x-5 font-bold tracking-tight text-foreground">WellRead</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="#">
            Home
          </a>
          <a className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="#">
            Discover
          </a>
          <a className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="#">
            Lists
          </a>
		    
          <a className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="#">
            Tracker
          </a>

        </nav>

        <div className="flex items-center gap-3">
	    <Button variant="ghost" size="icon" className="relative">
		<Bell className="size-5" />
		<span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full" />
	    </Button>

	    <Button variant="ghost" size="icon" className="relative">
		<User className="size-5" />
		<span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full" />
	    </Button>


          <Button className="shadow-lg shadow-primary/20" asChild>
            <Link to="/auth">Log/Review</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;

