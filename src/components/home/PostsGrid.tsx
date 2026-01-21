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

interface PostsGridProps {
  posts: Post[];
  columns?: 2 | 3 | 4 | 5 | 6;
}

const PostsGrid = ({ posts, columns = 4 }: PostsGridProps) => {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {posts.map((post) => (
        <Link
          key={post.id}
          to={`/blog/${post.slug}`}
          className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/30"
        >
          {/* Image */}
          <div className="aspect-[16/10] overflow-hidden bg-muted">
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
          </div>

          {/* Content */}
          <div className="p-3">
            {post.category && (
              <Badge variant="secondary" className="text-xs mb-2">
                {post.category.name}
              </Badge>
            )}
            
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>

            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              {post.published_at && (
                <span>{format(new Date(post.published_at), "MMM d")}</span>
              )}
              {post.reading_time && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.reading_time}m
                  </span>
                </>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PostsGrid;
