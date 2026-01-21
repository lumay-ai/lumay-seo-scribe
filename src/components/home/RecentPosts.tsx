import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  featured_image_url?: string | null;
  published_at?: string | null;
  reading_time?: number | null;
  category?: { name: string; slug: string } | null;
}

interface RecentPostsProps {
  posts: Post[];
}

const RecentPosts = ({ posts }: RecentPostsProps) => {
  if (posts.length === 0) return null;

  const featuredRecent = posts[0];
  const otherRecent = posts.slice(1, 6);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-semibold text-heading">
          Recent Posts
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Large featured recent post */}
        <Link
          to={`/blog/${featuredRecent.slug}`}
          className="lg:col-span-2 group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-primary/30"
        >
          <div className="grid md:grid-cols-2">
            <div className="aspect-video md:aspect-auto overflow-hidden bg-muted">
              {featuredRecent.featured_image_url ? (
                <img
                  src={featuredRecent.featured_image_url}
                  alt={featuredRecent.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}
            </div>
            <div className="p-6 flex flex-col justify-center">
              {featuredRecent.category && (
                <Badge variant="secondary" className="w-fit mb-3">
                  {featuredRecent.category.name}
                </Badge>
              )}
              <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                {featuredRecent.title}
              </h3>
              {featuredRecent.excerpt && (
                <p className="text-muted-foreground mt-3 line-clamp-3">
                  {featuredRecent.excerpt}
                </p>
              )}
              <div className="flex items-center gap-3 mt-4 text-sm text-muted-foreground">
                {featuredRecent.published_at && (
                  <span>{format(new Date(featuredRecent.published_at), "MMM d, yyyy")}</span>
                )}
                {featuredRecent.reading_time && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {featuredRecent.reading_time} min
                  </span>
                )}
              </div>
              <span className="mt-4 text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Read More <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Link>

        {/* Sidebar recent posts */}
        <div className="space-y-4">
          {otherRecent.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group flex gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="w-20 h-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
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
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  {post.published_at && (
                    <span>{format(new Date(post.published_at), "MMM d")}</span>
                  )}
                  {post.reading_time && (
                    <>
                      <span>•</span>
                      <span>{post.reading_time}m</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentPosts;
