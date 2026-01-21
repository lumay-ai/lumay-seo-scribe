import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Megaphone } from "lucide-react";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  featured_image_url?: string | null;
}

interface SponsoredPostsProps {
  posts: Post[];
}

const SponsoredPosts = ({ posts }: SponsoredPostsProps) => {
  if (posts.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Megaphone className="h-5 w-5 text-primary" />
        <h3 className="font-heading text-lg font-semibold text-heading">
          Sponsored Content
        </h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="group bg-card/80 backdrop-blur border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary/40 transition-all"
          >
            <div className="relative aspect-video overflow-hidden bg-muted">
              {post.featured_image_url ? (
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}
              <Badge className="absolute top-2 right-2 bg-primary/90 text-xs">
                Sponsored
              </Badge>
            </div>
            <div className="p-3">
              <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h4>
              {post.excerpt && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {post.excerpt}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SponsoredPosts;
