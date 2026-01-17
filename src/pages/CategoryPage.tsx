import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { useSearchPosts } from "@/hooks/usePosts";
import { useCategoryBySlug } from "@/hooks/useCategories";
import { Loader2 } from "lucide-react";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: category } = useCategoryBySlug(slug || "");
  const { data: posts, isLoading } = useSearchPosts("", slug);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-16 bg-gradient-to-b from-secondary/50 to-background">
          <div className="container">
            <span className="text-sm text-primary font-medium">Category</span>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-heading mt-2">
              {category?.name || slug}
            </h1>
            {category?.description && (
              <p className="mt-4 text-muted-foreground max-w-2xl">
                {category.description}
              </p>
            )}
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : posts?.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                No articles in this category yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts?.map((post: any) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
