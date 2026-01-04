import { BookOpen, Github, Twitter } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#" },
    { label: "Pro", href: "#" },
    { label: "Apps", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Privacy", href: "#" },
  ],
};

const Footer = () => {
  return (
    <footer className="border-t border-surface-highlight bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Branding */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="size-5 text-primary" />
              <span className="text-lg font-bold">Bookworm</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              The social network for book lovers. Track your reading, find your next favorite book, and connect with friends.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider">{category}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {links.map((link) => (
                  <li key={link.label}>
                    <a className="hover:text-primary transition-colors" href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-surface-highlight pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© 2023 Bookworm Inc. All rights reserved.</p>
          <div className="flex gap-6 text-muted-foreground">
            <a className="hover:text-foreground transition-colors" href="#">
              <span className="sr-only">Twitter</span>
              <Twitter className="size-5" />
            </a>
            <a className="hover:text-foreground transition-colors" href="#">
              <span className="sr-only">GitHub</span>
              <Github className="size-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;