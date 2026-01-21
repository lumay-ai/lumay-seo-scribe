import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import PostsGrid from "@/components/home/PostsGrid";
import RecentPosts from "@/components/home/RecentPosts";
import CategoryPosts from "@/components/home/CategoryPosts";
import SponsoredPosts from "@/components/home/SponsoredPosts";
import TrendingPosts from "@/components/home/TrendingPosts";
import { usePosts } from "@/hooks/usePosts";
import { useCategories } from "@/hooks/useCategories";
import { useEffect, useMemo } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const { data: posts, isLoading } = usePosts("published");
  const { data: categories } = useCategories();

  // Fetch sponsored posts
  const { data: sponsoredPosts } = useQuery({
    queryKey: ["posts", "sponsored"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, slug, title, excerpt, featured_image_url")
        .eq("status", "published")
        .eq("is_sponsored", true)
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  // Fetch trending posts
  const { data: trendingPosts } = useQuery({
    queryKey: ["posts", "trending"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, slug, title, featured_image_url, reading_time, view_count")
        .eq("status", "published")
        .eq("is_trending", true)
        .order("view_count", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  const featuredPost = posts?.[0];
  const recentPosts = posts?.slice(0, 6) || [];
  const allPosts = posts?.slice(0, 30) || [];

  // Group posts by category
  const postsByCategory = useMemo(() => {
    if (!posts || !categories) return {};
    const grouped: Record<string, typeof posts> = {};
    categories.forEach((cat) => {
      grouped[cat.slug] = posts.filter(
        (p) => p.category?.slug === cat.slug
      ).slice(0, 4);
    });
    return grouped;
  }, [posts, categories]);

  useEffect(() => {
    document.title = "Lumay Blog | Insights for Modern Content Creators";
    
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Expert insights on SEO, content strategy, and digital marketing. Learn proven techniques to grow your online presence.";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={heroBg}
              alt=""
              className="w-full h-full object-cover"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
          </div>
          
          <div className="container relative z-10">
            <div className="max-w-3xl animate-fade-in-up">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Welcome to Lumay
              </span>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-heading leading-tight">
                Insights for Modern
                <span className="text-primary"> Content Creators</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Master SEO, content strategy, and digital marketing with expert-crafted guides.
              </p>
            </div>
          </div>
        </section>

        {isLoading ? (
          <section className="py-12">
            <div className="container flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </section>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <section className="py-8 md:py-12">
                <div className="container">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-heading text-2xl font-semibold text-heading">
                      Featured Article
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      Editor's pick
                    </span>
                  </div>
                  <BlogCard post={featuredPost} featured />
                </div>
              </section>
            )}

            {/* Sponsored Posts */}
            {sponsoredPosts && sponsoredPosts.length > 0 && (
              <section className="py-8">
                <div className="container">
                  <SponsoredPosts posts={sponsoredPosts} />
                </div>
              </section>
            )}

            {/* Recent Posts */}
            {recentPosts.length > 0 && (
              <section className="py-8 md:py-12 bg-secondary/20">
                <div className="container">
                  <RecentPosts posts={recentPosts} />
                </div>
              </section>
            )}

            {/* Trending Posts */}
            {trendingPosts && trendingPosts.length > 0 && (
              <section className="py-8">
                <div className="container">
                  <TrendingPosts posts={trendingPosts} />
                </div>
              </section>
            )}

            {/* Category Sections */}
            {categories && categories.length > 0 && (
              <section className="py-8 md:py-12">
                <div className="container space-y-10">
                  <h2 className="font-heading text-2xl font-semibold text-heading">
                    Browse by Category
                  </h2>
                  {categories.slice(0, 4).map((category) => {
                    const catPosts = postsByCategory[category.slug] || [];
                    if (catPosts.length === 0) return null;
                    return (
                      <CategoryPosts
                        key={category.id}
                        category={{ name: category.name, slug: category.slug }}
                        posts={catPosts}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {/* All Posts Grid (30 posts) */}
            {allPosts.length > 0 && (
              <section className="py-8 md:py-12 bg-secondary/30">
                <div className="container">
                  <h2 className="font-heading text-2xl font-semibold text-heading mb-6">
                    All Articles
                  </h2>
                  <PostsGrid posts={allPosts} columns={5} />
                </div>
              </section>
            )}

            {/* Newsletter Section */}
            <section className="py-12 md:py-16">
              <div className="container">
                <div className="max-w-2xl mx-auto text-center">
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-heading">
                    Stay Updated
                  </h2>
                  <p className="mt-3 text-muted-foreground">
                    Get the latest SEO tips and content strategies delivered to your inbox weekly.
                  </p>
                  <form className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="px-5 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 flex-1 max-w-md"
                    />
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Subscribe
                    </button>
                  </form>
                  <p className="mt-3 text-sm text-muted-foreground">
                    No spam, unsubscribe anytime.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
