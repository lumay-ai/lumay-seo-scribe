import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-heading text-2xl font-bold text-heading">
            Lumay<span className="text-primary">.</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            to="/category/seo"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            SEO
          </Link>
          <Link
            to="/category/content"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Content
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="default" size="sm" className="hidden sm:inline-flex">
            Subscribe
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
