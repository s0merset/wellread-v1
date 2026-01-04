import { ArrowRight, Eye } from "lucide-react";

const popularBooks = [
  {
    title: "The Great Read",
    author: "F. Author Name",
    cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhQ-dPdFmzgmcAk1gxiOKUWDnG9se3uQLOr_vnd_8rAJVkmomI8Bbv2nciAm2A3WZ7cDO6NS8kXRZ6TPPaa2PeB9S3ztT-v7RmDC5bfxpNaJzaycjd2vTWAdYAY5PFkDRrkCwvjMlDYPsUWTOJ6gWJnjbmrb724qwtN_V9Ge_VEXY2vpx8InoUVHeX9NLBGtYCt6MH5UARq6IZP0MY3AWJFqH5INFQ3LWxvSuZXuZLVkeQP-aLaBD-nHw-glK0iKVE_JikqVIUHQ",
  },
  {
    title: "Design Systems",
    author: "Alla Kholmatova",
    cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ6PDPiMWIaGOHJ76zGt9hxzKJhPGOGgHxZX_4PDKZ3P1dAV7pY20O83oJsz2l0WLC0ybgQH4QpHcBh6MoEkc5z7wWjOjVE2o0aIdpPmrh3cFO2JZyYKGlxb9eM2v9KQLW5yCby08yxZRv_L2AhJ66P0KYU7QkBg5CNzZ3YR8DF8YkwrsLO1DMT7KNjIZzT8CU6j3SCx_NGSwucwjglQnhzgKVdD3wzSlhu29Bcrab6FIZKfrB9Zu4TV3UTdw4hIh0fe_XYj73Lg",
  },
  {
    title: "The Art of Code",
    author: "J. Developer",
    cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpWR6Eh6gEtW0R79Q8BBAEnUATTAWLE108JX_L8JmiY4odVbb5wCvDHziivg_pU0sH4XFQv-AwFcw4uxspD9hcTUdm4HnX175-B1LOXm2GTrTmBWOVn6A841oZG7YUE8IKfEjCfd-d_6GucR_8os9yiupfw2mcf6AKYa7mx5PLm7mQRpamyaHkKABnbJ0xPwa3bepjJYbB6BFCndUpUYiSVhwIi2BxIwuKYR1IXDfWMvVTLcPuaFNerGnn099eJG679laMUtmN0Q",
  },
  {
    title: "Modern UI",
    author: "S. Designer",
    cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjWu82H_72xsFy4fgIobPu_xxnZGsDRBoLh8klMq8UDPsWKubJax9bpi82QJkCcde5Ie9a5v4rSOir472_w3uxeu7xLaFl3DPcbrG7FLs-zNqxlH9KsiIWT6bBQ09f4Xh-aRdf3KS0hKoyZBgTeoQwdAavWVmM0r4u6ql-E_CfvK9632iCllYmwAljD7CR1MMN7XosUmYtAkctdwdfLGPWkfv01bB0Ql_3NQ8M3-It1yCBC8lGWGetnfP3ubRovtrZKJKFyK2jqQ",
  },
  {
    title: "Classic Lit",
    author: "A. Oldwriter",
    cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0LSSE2nLPVFCx2bxsp8sjCirkVtfY3zpIs0C7Nf-kRo4Z1h3lXujKi2_aBKSoWHN4f5vx_cae3097yKmQeKSSrQ9iZ0BxL2BjrCLsWkMJ7UJ_t7SnNCwxD1RFxICKTmKbmDm9goRajtZzfBRC0Wpp0k89K8d1co7w_QHX-3GthznZGPtEUSBPQd1Rcxjoo-LqLmuA-avCGVbETqqWUXehNkzL-kCJxOn3a30hJckyLcmYS6_IjVkmITQM9_OyvNpZKm9HfJc1CA",
  },
  {
    title: "Future Tech",
    author: "E. Musketeer",
    cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3AEUMVRU967tBZwfsUpYpPJh7_A3UaLhYnydDs-U8U6PjrxiOmLM3qQdfDW8zQIMxelqgiRwhoougfoRG6pd-qksMmcnegHwSceNiwqEtAJx4pBN9sVR52N5iDklUYdCFtiY6EA4UtLWn9kKIa9JlehAgJdENjM8M1IyYyycvxBpDnrX_9-1lXX7T7rbIxpK3eYTPAisLYuxW9huAgzLfxKQBE-R80K1s1Lnb-R0UCnVwQd41LdZVXLvC-NMUgL76mIqyXwxqTA",
  },
];

const PopularBooks = () => {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Popular This Week</h2>
          <a className="text-sm font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors" href="#">
            View all <ArrowRight className="size-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {popularBooks.map((book, index) => (
            <div key={index} className="group relative flex flex-col gap-2 cursor-pointer">
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-card shadow-md transition-transform group-hover:-translate-y-1">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url("${book.cover}")` }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Eye className="size-8 text-foreground drop-shadow-lg" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold truncate text-sm">{book.title}</span>
                <span className="text-xs text-muted-foreground truncate">{book.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularBooks;