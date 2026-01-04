import { Star, StarHalf } from "lucide-react";

const reviews = [
  {
    user: {
      name: "Sarah Jenkins",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuASH2yyiRncKeVrk2A_BOF6I6oUiuoj8um8KCk4kOPa05zUnyOgootpcaeXEKYw7j0lS5SRl1GkCGoyfZsl75r9rpzJ7Xv8K6q4h6UU6bfwa_IWbVaBsyzL-UbObqgkjZV1SYeb-DYmg15QeCvrtUAYznS-Y-FZjsxxopXk5ApNb16IOVskuQTwwhEPQo0lVTnwXDLkUb1jrKpC5sIoJKrRdP_L6n34gFarGNSt6VZFZpUe3Q_LF8dlNBhZ_QUgpg_2qRA2WGJ9Rg",
    },
    book: {
      cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuA53ENsAfQOJQV3n9aZ78KymXB1RVMBVZJAbn8_5YlBdO-cGqCgtunv810cOCpoJNYeg2JO9nV0JcDx1tbF60MwU794Rq-u_oQwwV0DDzV6OjTaPTezW-i3qb9gm6XlT4kg6k5pra0eHCQovTS46AWcon0V1hbkjTupzIgmgNnZfd0nBeSuJHEQFmTYoZsxZfgXbpNgu7BizIYDp_8ou6kPqLTo0e9bFFYCIt4SVOoFtag8EYnUwjrh2_sI01CLSYvNbp_YTqBanw",
    },
    rating: 4.5,
    review: "Absolutely loved this one. The character development was slow but the payoff in the final chapters made it all worth it. Highly recommend for anyone who loves slow-burn mysteries.",
    timeAgo: "2h ago",
  },
  {
    user: {
      name: "Mark D.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpQkhpNALiuhl0Qa3MhIYFLHAs_uGu76iaCGQIGmvGHf-DT6IUw2xwzRziXPlf0BiBU9R22DzOHSOE2noF-g2bSnGAJj1W0hqdGjd_ubzMj_se5f0BKQj8YfYvvwE8Vv9qvnAZ_AofEbJinb2Ul-tC6aHm7rWvUR3nPvqC7j6CKboUkFooB1HPQ1yrAp0mv0hgm-HmaoBNWiATIEJsLsdXoQHPrZq257gQFgPV3hboCbJqy35Ewd9zNPkgZWdxIl75EPy3ky14lg",
    },
    book: {
      cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWoo_S4FvAAqiq2YW4EeAhMjYlvDkbrCDwllq-HtRDKANaLSzDhHZBB_67WwRRNXpbMhX_3HisDXicaUSp9SRvo4cgDmAZhEBzvWlA3koThkMGN4Xl6Ai-Nx2VDbyxOqqdL5Loq1oHZr7Pl24iuASw4nc-42jczRIx1p4i3MX9Dc7XAzKX0Qxbh5lw25duDBlFYU-FIFUCs495bLYrS-obJxzCTW9Ik5sN9LO0OPrIPh0xG92xQK_c5rwlS1HKVF_LDqLytlKstQ",
    },
    rating: 3,
    review: "It was okay. I felt like the middle dragged on a bit too much. Beautiful prose, though.",
    timeAgo: "5h ago",
  },
  {
    user: {
      name: "Emily R.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGWFqiK59VDVyYNymh2EV4KmaZfiCxRqUmU-urCYKaN1N1zwDHyZusZYKa8OFjLqVltTsn7MevfAMkuGnNzYn45V_vktGJkL71ljpLqdZgqx7OfITCyFC2Lvd7yNMmA67vcsmHHWSFzVzNUnea410envxEj6f03fsjaPHFdV2R1iIsOtUrNqkma0C6hxP_muplJ1qXs6jauxl4t-BAi-VyqiDjyhV6V8MDUD2x7MrOSZyxUkCKYzlB5zbwqsVdflm4yf2nFbvCTw",
    },
    book: {
      cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJued-XUtSNBPh6QlOqGMeGC918l8lrnKmbQc-9fdi_bQVMUiVSUv1zcsqvC4bCSeuG4U-VSP8qj5jSIxZwej9BL298FYZQbkzK7_RdPt5nigoM7qAPPkHSNu3LgczP5zekcaypL3rOBJUC5SvSWBU8YeyFMCbPGQHVe77m_YAFibqlo9uzcrF2frEb53ZSHfYVFtw4D5DiX0PYkQdurD5zigjzFDBiVBAQJFs1-cu-xLy2b_2aIt-cI2vk_RZw5RPGLRhHE2LvA",
    },
    rating: 5,
    review: "A masterpiece. I couldn't put it down. Everyone needs to read this immediately!",
    timeAgo: "8h ago",
  },
];

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex text-primary text-sm">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="size-4 fill-current" />
      ))}
      {hasHalfStar && <StarHalf className="size-4 fill-current" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="size-4" />
      ))}
    </div>
  );
};

const CommunityReviews = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-[hsl(210_32%_5%)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-left">
          <h2 className="text-2xl font-bold">From the Community</h2>
          <p className="text-muted-foreground mt-1">See what others are reading right now.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <div key={index} className="flex gap-4 rounded-xl border border-surface-highlight bg-card p-4 shadow-sm">
              <div className="shrink-0">
                <div className="h-24 w-16 overflow-hidden rounded bg-muted shadow-md">
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url("${review.book.cover}")` }}
                  />
                </div>
              </div>

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="size-6 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url("${review.user.avatar}")` }}
                    />
                    <span className="text-sm font-bold">{review.user.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{review.timeAgo}</span>
                </div>

                <div className="my-2">
                  <StarRating rating={review.rating} />
                </div>

                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {review.review}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityReviews;