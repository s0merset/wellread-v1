import { Sparkles, ChevronLeft, ChevronRight, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const recommendedBooks = [
  {
    title: "Cloud Cuckoo Land",
    author: "Anthony Doerr",
    match: 98,
    cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuBw_NJu_ByYevLS1vefAredD62Asz6nd_x6Y4A7aK7--O8muQx-tGYJfdVYsJX0JAe1aaEHPDuyYifMey3fEO7mdjFE8ucYKTwErfjOXGKH-r1iSH1h-X5aPxtI7rIU_Ihruvvf0VlUWqxa-i09Wu7QD1sGf5H7J-gVK0RPodJz0OX0ZIyLw5YOvejDk5OjCS1u6CEIr-Hpxktx0Z1gNl_by-A5rVpSjqLjZp9_2kj06Wd0M0H5SHvmcVuBtIkCqoLF41qcaA9ggQ",
  },
  {
    title: "Yellowface",
    author: "R.F. Kuang",
    match: 95,
    cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ6PDPiMWIaGOHJ76zGt9hxzKJhPGOGgHxZX_4PDKZ3P1dAV7pY20O83oJsz2l0WLC0ybgQH4QpHcBh6MoEkc5z7wWjOjVE2o0aIdpPmrh3cFO2JZyYKGlxb9eM2v9KQLW5yCby08yxZRv_L2AhJ66P0KYU7QkBg5CNzZ3YR8DF8YkwrsLO1DMT7KNjIZzT8CU6j3SCx_NGSwucwjglQnhzgKVdD3wzSlhu29Bcrab6FIZKfrB9Zu4TV3UTdw4hIh0fe_XYj73Lg",
  },
  {
    title: "Happy Place",
    author: "Emily Henry",
    match: 88,
    cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpWR6Eh6gEtW0R79Q8BBAEnUATTAWLE108JX_L8JmiY4odVbb5wCvDHziivg_pU0sH4XFQv-AwFcw4uxspD9hcTUdm4HnX175-B1LOXm2GTrTmBWOVn6A841oZG7YUE8IKfEjCfd-d_6GucR_8os9yiupfw2mcf6AKYa7mx5PLm7mQRpamyaHkKABnbJ0xPwa3bepjJYbB6BFCndUpUYiSVhwIi2BxIwuKYR1IXDfWMvVTLcPuaFNerGnn099eJG679laMUtmN0Q",
  },
  {
    title: "Neuromancer",
    author: "William Gibson",
    match: 85,
    cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjWu82H_72xsFy4fgIobPu_xxnZGsDRBoLh8klMq8UDPsWKubJax9bpi82QJkCcde5Ie9a5v4rSOir472_w3uxeu7xLaFl3DPcbrG7FLs-zNqxlH9KsiIWT6bBQ09f4Xh-aRdf3KS0hKoyZBgTeoQwdAavWVmM0r4u6ql-E_CfvK9632iCllYmwAljD7CR1MMN7XosUmYtAkctdwdfLGPWkfv01bB0Ql_3NQ8M3-It1yCBC8lGWGetnfP3ubRovtrZKJKFyK2jqQ",
  },
  {
    title: "1984",
    author: "George Orwell",
    match: 82,
    cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0LSSE2nLPVFCx2bxsp8sjCirkVtfY3zpIs0C7Nf-kRo4Z1h3lXujKi2_aBKSoWHN4f5vx_cae3097yKmQeKSSrQ9iZ0BxL2BjrCLsWkMJ7UJ_t7SnNCwxD1RFxICKTmKbmDm9goRajtZzfBRC0Wpp0k89K8d1co7w_QHX-3GthznZGPtEUSBPQd1Rcxjoo-LqLmuA-avCGVbETqqWUXehNkzL-kCJxOn3a30hJckyLcmYS6_IjVkmITQM9_OyvNpZKm9HfJc1CA",
  },
];

const RecommendedBooks = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  return (
    <div className="rounded-xl border border-surface-highlight bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <Sparkles className="size-4" />
          </div>
          <h2 className="text-lg font-bold">Recommended for You</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-8 border-surface-highlight"
            onClick={() => setScrollPosition(Math.max(0, scrollPosition - 1))}
            disabled={scrollPosition === 0}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 border-surface-highlight"
            onClick={() => setScrollPosition(Math.min(recommendedBooks.length - 3, scrollPosition + 1))}
            disabled={scrollPosition >= recommendedBooks.length - 3}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex gap-4 transition-transform duration-300"
          style={{ transform: `translateX(-${scrollPosition * 140}px)` }}
        >
          {recommendedBooks.map((book, index) => (
            <div key={index} className="group relative shrink-0 w-32">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url("${book.cover}")` }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button className="p-2 rounded-full bg-primary/80 hover:bg-primary transition-colors">
                    <Plus className="size-4" />
                  </button>
                  <button className="p-2 rounded-full bg-card/80 hover:bg-card transition-colors">
                    <Eye className="size-4" />
                  </button>
                </div>
                <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-primary/90 text-xs font-bold">
                  {book.match}% Match
                </div>
              </div>
              <div className="mt-2">
                <p className="font-medium text-sm truncate">{book.title}</p>
                <p className="text-xs text-muted-foreground truncate">{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendedBooks;