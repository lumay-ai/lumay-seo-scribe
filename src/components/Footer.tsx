import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block">
              <span className="font-heading text-2xl font-bold text-heading">
                Lumay<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="mt-4 text-muted-foreground max-w-md">
              Insights and strategies for modern content creators. Learn SEO, content marketing, and digital strategy from industry experts.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading font-semibold text-heading mb-4">Categories</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/category/seo" className="text-muted-foreground hover:text-foreground transition-colors">
                  SEO
                </Link>
              </li>
              <li>
                <Link to="/category/content" className="text-muted-foreground hover:text-foreground transition-colors">
                  Content Strategy
                </Link>
              </li>
              <li>
                <Link to="/category/marketing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Marketing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading font-semibold text-heading mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Lumay Blog. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with care for content creators worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
