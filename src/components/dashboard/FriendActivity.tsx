import { Users, Star, BookmarkCheck, ListPlus, ThumbsUp, MessageCircle, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const activities = [
  {
    type: "rating",
    user: { name: "Jam T.", initial: "J" },
    timeAgo: "2h ago",
    book: { title: "The Brothers Karamazov", author: "Fyodor Dostoevsky" },
    rating: 5,
    review: "Absolutely loved this concept! It made me rethink so many choices...",
    likes: 12,
    comments: 3,
  },
  {
    type: "finished",
    user: { name: "Hayman Waman", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpQkhpNALiuhl0Qa3MhIYFLHAs_uGu76iaCGQIGmvGHf-DT6IUw2xwzRziXPlf0BiBU9R22DzOHSOE2noF-g2bSnGAJj1W0hqdGjd_ubzMj_se5f0BKQj8YfYvvwE8Vv9qvnAZ_AofEbJinb2Ul-tC6aHm7rWvUR3nPvqC7j6CKboUkFooB1HPQ1yrAp0mv0hgm-HmaoBNWiATIEJsLsdXoQHPrZq257gQFgPV3hboCbJqy35Ewd9zNPkgZWdxIl75EPy3ky14lg" },
    timeAgo: "5h ago",
    book: { title: "Atomic Habits", author: "James Clear" },
    review: "Life changing read. Highly recommend.",
    likes: 24,
  },
  {
    type: "list",
    user: { name: "Pato Toya", initial: "P" },
    timeAgo: "1d ago",
    listName: "",
    bookCount: 8,
    likes: 8,
  },
];

const FriendActivity = () => {
  return (
    <div className="rounded-xl border border-surface-highlight bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold">Friend Activity</h2>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          See All
          <ArrowRight className="size-4 ml-1" />
        </Button>
      </div>

      <div className="space-y-6">
        {activities.map((activity, index) => (
          <div key={index} className="flex gap-3">
            {/* Avatar */}
            {activity.user.avatar ? (
              <div
                className="size-10 rounded-full bg-cover bg-center shrink-0"
                style={{ backgroundImage: `url("${activity.user.avatar}")` }}
              />
            ) : (
              <div className="size-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center font-bold shrink-0">
                {activity.user.initial}
              </div>
            )}

            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center gap-2 flex-wrap">
                {activity.type === "rating" && (
                  <Star className="size-4 text-primary fill-primary" />
                )}
                {activity.type === "finished" && (
                  <BookmarkCheck className="size-4 text-green-500" />
                )}
                {activity.type === "list" && (
                  <ListPlus className="size-4 text-primary" />
                )}
                <span className="font-medium text-sm">{activity.user.name}</span>
                <span className="text-muted-foreground text-sm">
                  {activity.type === "rating" && "rated a book"}
                  {activity.type === "finished" && "finished"}
                  {activity.type === "list" && "created a list"}
                </span>
                <span className="text-xs text-muted-foreground ml-auto">{activity.timeAgo}</span>
              </div>

              {/* Content */}
              {activity.type !== "list" && activity.book && (
                <div className="mt-2 p-3 rounded-lg bg-surface-highlight/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{activity.book.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.book.author}</p>
                    </div>
                    {activity.type === "finished" && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400">
                        FINISHED
                      </span>
                    )}
                  </div>
                  {activity.rating && (
                    <div className="flex gap-0.5 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3 ${i < activity.rating! ? "text-primary fill-primary" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                  )}
                  {activity.review && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      "{activity.review}"
                    </p>
                  )}
                </div>
              )}

              {activity.type === "list" && (
                <div className="mt-2 p-3 rounded-lg bg-surface-highlight/50">
                  <p className="font-medium text-sm">{activity.listName}</p>
                  <p className="text-xs text-muted-foreground mt-1">+{activity.bookCount} books</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 mt-2">
                {activity.likes !== undefined && (
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {activity.type === "list" ? (
                      <Heart className="size-3" />
                    ) : (
                      <ThumbsUp className="size-3" />
                    )}
                    {activity.likes}
                  </button>
                )}
                {activity.comments !== undefined && (
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <MessageCircle className="size-3" />
                    {activity.comments}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendActivity;
