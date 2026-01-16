import { BlogPost } from "@/types/blog";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogCard = ({ post, featured = false }: BlogCardProps) => {
  const publishDate = new Date(post.publishedAt);

  if (featured) {
    return (
      <article className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:shadow-xl transition-all duration-500">
        <Link to={`/blog/${post.slug}`} className="block">
          <div className="aspect-[16/9] bg-muted relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
              <span className="font-heading text-6xl text-primary/30">L</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
            <span className="inline-block px-3 py-1 text-xs font-medium text-primary-foreground bg-primary rounded-full mb-4">
              {post.category}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-heading group-hover:text-primary transition-colors">
              {post.title}
            </h2>
            <p className="mt-4 text-muted-foreground text-lg line-clamp-2">
              {post.excerpt}
            </p>
            <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(publishDate, "MMM d, yyyy")}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.readingTime} min read
              </span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300">
      <Link to={`/blog/${post.slug}`} className="block">
        <div className="aspect-[16/10] bg-muted relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
            <span className="font-heading text-4xl text-primary/20">L</span>
          </div>
        </div>
        <div className="p-6">
          <span className="text-xs font-medium text-primary uppercase tracking-wider">
            {post.category}
          </span>
          <h3 className="mt-2 font-heading text-xl font-semibold text-heading group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="mt-3 text-muted-foreground text-sm line-clamp-3">
            {post.excerpt}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {format(publishDate, "MMM d")}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.readingTime} min
              </span>
            </div>
            <span className="text-primary text-sm font-medium flex items-center group-hover:gap-2 transition-all">
              Read
              <ArrowRight className="h-4 w-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;
