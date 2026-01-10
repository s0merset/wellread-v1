import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const userAvatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80",
];

const bookCovers = [
  [
    // Column 1
    "https://covers.openlibrary.org/b/id/9367297-L.jpg", // The Great Gatsby
    "https://covers.openlibrary.org/b/id/15092781-L.jpg", // Dune
  ],
  [
    // Column 2 (Center)
    "https://covers.openlibrary.org/b/id/14627222-L.jpg", // The Hobbit
    "https://covers.openlibrary.org/b/id/15155627-L.jpg", // Atomic Habits
    "https://covers.openlibrary.org/b/id/12693610-L.jpg", // 1984
  ],
  [
    // Column 3
    "https://covers.openlibrary.org/b/id/15139354-L.jpg", // Circe
    "https://covers.openlibrary.org/b/id/14854809-L.jpg", // Tomorrow, and Tomorrow, and Tomorrow
  ],
];

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
      {/* Abstract background glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -right-40 size-[500px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute top-40 -left-20 size-[300px] rounded-full bg-purple-500/10 blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left content */}
          <div className="flex flex-col gap-6 text-left">
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Your Life in <span className="text-primary">Books</span>.
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl max-w-lg">
              Track what you read, discover your next favorite, and see what friends are saying. The ultimate social platform for book lovers.
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Button 
                onClick={() => navigate("/auth")}
                size="lg" 
                className="h-12 min-w-[140px] shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all"
              >
                Create Account
              </Button>
              <Button
                onClick={() => navigate("/auth")}
                size="lg"
                variant="outline"
                className="h-12 min-w-[140px] border-surface-highlight bg-surface/50 backdrop-blur-sm hover:bg-surface-highlight hover:-translate-y-0.5 transition-all"
              >
                Browse Books
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {userAvatars.map((avatar, index) => (
                  <div
                    key={index}
                    className="size-8 rounded-full border-2 border-background bg-muted bg-cover bg-center"
                    style={{ backgroundImage: `url("${avatar}")` }}
                  />
                ))}
              </div>
              <p>Join 50,000+ readers sharing their library.</p>
            </div>
          </div>

          {/* Right - Book collage */}
          <div className="relative w-full aspect-[4/3] lg:aspect-square">
            {/* Mobile Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 lg:hidden" />
            
            <div className="grid grid-cols-3 gap-4 rotate-[-6deg] scale-110 opacity-90 hover:scale-[1.12] hover:rotate-[-4deg] transition-all duration-700 ease-in-out">
              {bookCovers.map((column, colIndex) => (
                <div key={colIndex} className={`space-y-4 ${colIndex === 0 ? 'pt-12' : colIndex === 2 ? 'pt-8' : ''}`}>
                  {column.map((cover, coverIndex) => (
                    <div
                      key={coverIndex}
                      className={`aspect-[2/3] w-full rounded-md bg-muted shadow-2xl overflow-hidden transition-transform duration-500 hover:z-20 hover:scale-105 ${
                        colIndex === 1 && coverIndex === 1 ? 'ring-2 ring-primary/50' : ''
                      }`}
                    >
                      <img 
                        src={cover} 
                        alt="Book Cover"
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
