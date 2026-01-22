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
    <div className="relative bg-gradient-to-r from-amber-500/10 via-orange-500/15 to-amber-500/10 rounded-xl p-6 border-2 border-amber-500/40 shadow-lg shadow-amber-500/10">
      {/* Highlight ribbon */}
      <div className="absolute -top-3 left-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
        ✨ FEATURED
      </div>

      <div className="flex items-center gap-2 mb-4 mt-2">
        <Megaphone className="h-5 w-5 text-amber-600" />
        <h3 className="font-heading text-lg font-semibold text-heading">
          Sponsored Content
        </h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="group bg-card/90 backdrop-blur border-2 border-amber-500/30 rounded-lg overflow-hidden hover:shadow-xl hover:border-amber-500/60 hover:scale-[1.02] transition-all duration-300"
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
              <Badge className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold border-0">
                Sponsored
              </Badge>
            </div>
            <div className="p-3">
              <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-amber-600 transition-colors">
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
