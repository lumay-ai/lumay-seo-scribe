import { Link } from "react-router-dom";
import { TrendingUp, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Post {
  id: string;
  slug: string;
  title: string;
  featured_image_url?: string | null;
  reading_time?: number | null;
  view_count?: number;
}

interface TrendingPostsProps {
  posts: Post[];
}

const TrendingPosts = ({ posts }: TrendingPostsProps) => {
  if (posts.length === 0) return null;

  return (
    <div className="bg-secondary/30 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="font-heading text-lg font-semibold text-heading">
          Trending Now
        </h3>
        <Flame className="h-4 w-4 text-orange-500 animate-pulse" />
      </div>

      <div className="grid gap-3">
        {posts.slice(0, 5).map((post, index) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="group flex items-center gap-4 p-3 bg-card rounded-lg border border-border hover:border-primary/30 hover:shadow-md transition-all"
          >
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary/10 text-primary font-bold rounded-full text-sm">
              {index + 1}
            </span>

            <div className="w-16 h-12 flex-shrink-0 rounded overflow-hidden bg-muted">
              {post.featured_image_url ? (
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                  No img
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                {post.reading_time && (
                  <span className="text-xs text-muted-foreground">
                    {post.reading_time} min read
                  </span>
                )}
                {post.view_count && post.view_count > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {post.view_count} views
                  </Badge>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingPosts;
