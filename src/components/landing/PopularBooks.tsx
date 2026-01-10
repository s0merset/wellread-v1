import { ArrowRight, Eye } from "lucide-react";

const popularBooks = [
  {
    title: "Tomorrow, and Tomorrow, and Tomorrow",
    author: "Gabrielle Zevin",
    cover: "https://covers.openlibrary.org/b/id/14849932-L.jpg",
  },
  {
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    cover: "https://covers.openlibrary.org/b/id/10526868-L.jpg",
  },
  {
    title: "Project Hail Mary",
    author: "Andy Weir",
    cover: "https://covers.openlibrary.org/b/id/14837125-L.jpg",
  },
  {
    title: "Lessons in Chemistry",
    author: "Bonnie Garmus",
    cover: "https://covers.openlibrary.org/b/id/12725772-L.jpg",
  },
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    cover: "https://covers.openlibrary.org/b/id/14825926-L.jpg",
  },
  {
    title: "Yellowface",
    author: "R.F. Kuang",
    cover: "https://covers.openlibrary.org/b/id/15127199-L.jpg",
  },
];

const PopularBooks = () => {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Popular Reads</h2>
          <a 
            className="text-sm font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors group" 
            href="#"
          >
            View all 
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {popularBooks.map((book, index) => (
            <div key={index} className="group relative flex flex-col gap-3 cursor-pointer">
              {/* Cover Container */}
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-muted shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url("${book.cover}")` }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <div className="flex flex-col items-center gap-2">
                    <Eye className="size-8 text-white" />
                    <span className="text-white text-xs font-medium">Quick View</span>
                  </div>
                </div>
              </div>

              {/* Text Info */}
              <div className="flex flex-col gap-0.5">
                <h3 className="font-bold truncate text-sm leading-tight group-hover:text-primary transition-colors">
                  {book.title}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {book.author}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularBooks;
