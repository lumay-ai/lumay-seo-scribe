import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { usePosts } from "@/hooks/usePosts";
import { useEffect } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { data: posts, isLoading } = usePosts("published");
  
  const featuredPost = posts?.[0];
  const otherPosts = posts?.slice(1) || [];

  useEffect(() => {
    document.title = "Lumay Blog | Insights for Modern Content Creators";
    
    // Set meta description
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
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Background Image */}
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
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                Welcome to Lumay
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-heading leading-tight">
                Insights for Modern
                <span className="text-primary"> Content Creators</span>
              </h1>
              <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
                Master SEO, content strategy, and digital marketing with expert-crafted guides. 
                Build authority, grow your audience, and create content that ranks.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {isLoading ? (
          <section className="py-12 md:py-16">
            <div className="container flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </section>
        ) : featuredPost ? (
          <section className="py-12 md:py-16">
            <div className="container">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-heading text-2xl md:text-3xl font-semibold text-heading">
                  Featured Article
                </h2>
                <span className="text-sm text-muted-foreground">
                  Editor's pick
                </span>
              </div>
              <BlogCard post={featuredPost} featured />
            </div>
          </section>
        ) : null}

        {/* Latest Posts */}
        {otherPosts.length > 0 && (
          <section className="py-12 md:py-16 bg-secondary/30">
            <div className="container">
              <h2 className="font-heading text-2xl md:text-3xl font-semibold text-heading mb-8">
                Latest Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-heading">
                Stay Updated
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Get the latest SEO tips and content strategies delivered to your inbox weekly.
              </p>
              <form className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-6 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 flex-1 max-w-md"
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Subscribe
                </button>
              </form>
              <p className="mt-4 text-sm text-muted-foreground">
                No spam, unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
