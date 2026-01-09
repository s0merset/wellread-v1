import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-highlight bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold tracking-tight text-foreground">WellRead</span>
        </div>


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
