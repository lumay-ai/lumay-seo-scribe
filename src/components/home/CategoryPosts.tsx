import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  featured_image_url?: string | null;
  published_at?: string | null;
  reading_time?: number | null;
}

interface Category {
  name: string;
  slug: string;
}

interface CategoryPostsProps {
  category: Category;
  posts: Post[];
}

const CategoryPosts = ({ category, posts }: CategoryPostsProps) => {
  if (posts.length === 0) return null;

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1, 4);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-xl font-semibold text-heading">
          {category.name}
        </h3>
        <Link 
          to={`/category/${category.slug}`}
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Featured in category */}
        <Link
          to={`/blog/${featuredPost.slug}`}
          className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all"
        >
          <div className="aspect-video overflow-hidden bg-muted">
            {featuredPost.featured_image_url ? (
              <img
                src={featuredPost.featured_image_url}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
          </div>
          <div className="p-4">
            <h4 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {featuredPost.title}
            </h4>
            {featuredPost.excerpt && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {featuredPost.excerpt}
              </p>
            )}
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              {featuredPost.published_at && (
                <span>{format(new Date(featuredPost.published_at), "MMM d, yyyy")}</span>
              )}
              {featuredPost.reading_time && (
                <>
                  <span>•</span>
                  <span>{featuredPost.reading_time} min read</span>
                </>
              )}
            </div>
          </div>
        </Link>

        {/* Other posts in category */}
        <div className="space-y-3">
          {otherPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group flex gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="w-20 h-14 flex-shrink-0 rounded overflow-hidden bg-muted">
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
                <h5 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h5>
                <span className="text-xs text-muted-foreground">
                  {post.reading_time && `${post.reading_time} min`}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPosts;
