import { BlogPost } from "@/types/blog";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface RelatedPostsProps {
  posts: BlogPost[];
}

const RelatedPosts = ({ posts }: RelatedPostsProps) => {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="font-heading text-2xl font-semibold text-heading mb-6">
        Also Read
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="group block p-6 bg-card border border-border rounded-lg hover:border-primary/50 hover:shadow-lg transition-all duration-300"
          >
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              {post.category}
            </span>
            <h3 className="mt-2 font-heading text-lg font-semibold text-heading group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {post.excerpt}
            </p>
            <span className="mt-4 inline-flex items-center text-sm text-primary font-medium">
              Read article
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
