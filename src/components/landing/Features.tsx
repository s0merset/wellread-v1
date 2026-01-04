import { BookOpen, List, Users } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Track Everything",
    description: "Keep a diary of every book you've read, complete with dates, ratings, and private notes.",
  },
  {
    icon: List,
    title: "Curate Lists",
    description: "Create and share collections for every mood, genre, or reading challenge you take on.",
  },
  {
    icon: Users,
    title: "Join the Community",
    description: "Follow friends and critics you trust to see what they are reading and loving right now.",
  },
];

const Features = () => {
  return (
    <section className="border-y border-surface-highlight bg-background relative">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 text-center mb-16">
          <h2 className="text-3xl font-black sm:text-4xl">The ultimate companion for readers.</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to catalog your reading life and connect with others.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group flex flex-col gap-4 rounded-xl border border-surface-highlight bg-card p-8 transition-colors hover:border-primary/50 hover:bg-card/80"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary group-hover:scale-110 transition-transform">
                <feature.icon className="size-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;