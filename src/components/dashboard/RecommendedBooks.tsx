import { Button } from "@/components/ui/button";
import { useState } from "react";

const recommendedBooks = [
  {
    title: "Cloud Cuckoo Land",
    author: "Anthony Doerr",
    cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuBw_NJu_ByYevLS1vefAredD62Asz6nd_x6Y4A7aK7--O8muQx-tGYJfdVYsJX0JAe1aaEHPDuyYifMey3fEO7mdjFE8ucYKTwErfjOXGKH-r1iSH1h-X5aPxtI7rIU_Ihruvvf0VlUWqxa-i09Wu7QD1sGf5H7J-gVK0RPodJz0OX0ZIyLw5YOvejDk5OjCS1u6CEIr-Hpxktx0Z1gNl_by-A5rVpSjqLjZp9_2kj06Wd0M0H5SHvmcVuBtIkCqoLF41qcaA9ggQ",
  },
  {
    title: "Yellowface",
    author: "R.F. Kuang",
    cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ6PDPiMWIaGOHJ76zGt9hxzKJhPGOGgHxZX_4PDKZ3P1dAV7pY20O83oJsz2l0WLC0ybgQH4QpHcBh6MoEkc5z7wWjOjVE2o0aIdpPmrh3cFO2JZyYKGlxb9eM2v9KQLW5yCby08yxZRv_L2AhJ66P0KYU7QkBg5CNzZ3YR8DF8YkwrsLO1DMT7KNjIZzT8CU6j3SCx_NGSwucwjglQnhzgKVdD3wzSlhu29Bcrab6FIZKfrB9Zu4TV3UTdw4hIh0fe_XYj73Lg",
  },
  {
    title: "Happy Place",
    author: "Emily Henry",
    cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpWR6Eh6gEtW0R79Q8BBAEnUATTAWLE108JX_L8JmiY4odVbb5wCvDHziivg_pU0sH4XFQv-AwFcw4uxspD9hcTUdm4HnX175-B1LOXm2GTrTmBWOVn6A841oZG7YUE8IKfEjCfd-d_6GucR_8os9yiupfw2mcf6AKYa7mx5PLm7mQRpamyaHkKABnbJ0xPwa3bepjJYbB6BFCndUpUYiSVhwIi2BxIwuKYR1IXDfWMvVTLcPuaFNerGnn099eJG679laMUtmN0Q",
  },
  {
    title: "Neuromancer",
    author: "William Gibson",
    cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjWu82H_72xsFy4fgIobPu_xxnZGsDRBoLh8klMq8UDPsWKubJax9bpi82QJkCcde5Ie9a5v4rSOir472_w3uxeu7xLaFl3DPcbrG7FLs-zNqxlH9KsiIWT6bBQ09f4Xh-aRdf3KS0hKoyZBgTeoQwdAavWVmM0r4u6ql-E_CfvK9632iCllYmwAljD7CR1MMN7XosUmYtAkctdwdfLGPWkfv01bB0Ql_3NQ8M3-It1yCBC8lGWGetnfP3ubRovtrZKJKFyK2jqQ",
  },
  {
    title: "1984",
    author: "George Orwell",
    cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0LSSE2nLPVFCx2bxsp8sjCirkVtfY3zpIs0C7Nf-kRo4Z1h3lXujKi2_aBKSoWHN4f5vx_cae3097yKmQeKSSrQ9iZ0BxL2BjrCLsWkMJ7UJ_t7SnNCwxD1RFxICKTmKbmDm9goRajtZzfBRC0Wpp0k89K8d1co7w_QHX-3GthznZGPtEUSBPQd1Rcxjoo-LqLmuA-avCGVbETqqWUXehNkzL-kCJxOn3a30hJckyLcmYS6_IjVkmITQM9_OyvNpZKm9HfJc1CA",
  },
];

const RecommendedBooks = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  return (
    <div className="space-y-4">
      {/* Header + Controls */}
      <div className="flex items-center justify-between px-2">
        
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-purple-500">explore</span>
                      Recommended for You
                    </h3>
                 </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-9 rounded-full border-slate-200 dark:border-slate-700 hover:text-primary transition-all"
            onClick={() => setScrollPosition(Math.max(0, scrollPosition - 1))}
            disabled={scrollPosition === 0}
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-9 rounded-full border-slate-200 dark:border-slate-700 hover:text-primary transition-all"
            onClick={() => setScrollPosition(Math.min(recommendedBooks.length - 3, scrollPosition + 1))}
            disabled={scrollPosition >= recommendedBooks.length - 3}
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </Button>
        </div>
      </div>

      {/* Books Container */}
      <div className="overflow-hidden">
        <div
          className="flex gap-6 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${scrollPosition * 184}px)` }}
        >
          {recommendedBooks.map((book, index) => (
            <div key={index} className="shrink-0 w-40">
              {/* Main Card with Group hover */}
              <div className="group relative rounded-2xl border border-slate-200 dark:border-slate-700 p-3 cursor-pointer transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-slate-900/40">
                
                {/* Image Container with Hover Effect */}
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-md mb-3">
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url("${book.cover}")` }}
                  />
                  
                  {/* Hover Overlay with Blurred Eye Icon */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="size-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-300">
                      <span className="material-symbols-outlined text-white text-[28px] drop-shadow-lg">
                          visibility
                      </span>
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="px-1">
                  <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                    {book.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate uppercase tracking-tight">
                    {book.author}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendedBooks;
