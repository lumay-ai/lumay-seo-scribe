import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block">
              <span className="font-heading text-2xl font-bold text-heading">
                Lumay<span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="mt-4 text-muted-foreground text-sm">
              Intelligent content solutions powered by AI. Automate and optimize your content strategy.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading font-semibold text-heading mb-4">Categories</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/category/seo" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  SEO
                </Link>
              </li>
              <li>
                <Link to="/category/content" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Content Strategy
                </Link>
              </li>
              <li>
                <Link to="/category/marketing" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
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
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-heading mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="tel:+13108101745" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  <Phone className="h-4 w-4 text-primary" />
                  +1 (310) 810-1745
                </a>
              </li>
              <li>
                <a 
                  href="mailto:sales@lumay.ai" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  <Mail className="h-4 w-4 text-primary" />
                  sales@lumay.ai
                </a>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  Lumay INC, 8 The Green #20160,<br />
                  Dover, DE 19901, United States
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Lumay AI. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Intelligent content solutions for creators worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
