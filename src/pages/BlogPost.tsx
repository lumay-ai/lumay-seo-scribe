import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { format } from "date-fns";
import { Calendar, Clock, User, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import AuthorCard from "@/components/AuthorCard";
import ReadingProgress from "@/components/ReadingProgress";
import SEOHead from "@/components/SEOHead";
import { usePost } from "@/hooks/usePosts";
import { useTrackPageView } from "@/hooks/useAnalytics";
import { SEOMeta } from "@/types/blog";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = usePost(slug || "");
  const trackPageView = useTrackPageView();

  // Track page view
  useEffect(() => {
    if (post) {
      trackPageView.mutate({
        pagePath: `/blog/${slug}`,
      });
    }
  }, [slug, post]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!post || error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-4xl font-bold text-heading mb-4">
              Article Not Found
            </h1>
            <p className="text-muted-foreground">
              The article you're looking for doesn't exist.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const publishDate = post.published_at ? new Date(post.published_at) : new Date(post.created_at);
  const updateDate = new Date(post.updated_at);
  const categoryName = post.category?.name || "Uncategorized";
  const categorySlug = post.category?.slug || "uncategorized";
  const author = (post as any).author;
  const authorName = author?.display_name || "Anonymous";
  const tags = post.post_tags?.map((pt: any) => pt.tag) || [];

  // Build SEO data from post
  const seoData: SEOMeta = {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || "",
    canonicalUrl: post.canonical_url || window.location.href,
    ogTitle: post.og_title || post.title,
    ogDescription: post.og_description || post.excerpt || "",
    ogImage: post.og_image || post.featured_image_url || "",
    ogType: "article",
    twitterCard: "summary_large_image",
    twitterTitle: post.twitter_title || post.title,
    twitterDescription: post.twitter_description || post.excerpt || "",
    twitterImage: post.twitter_image || post.featured_image_url || "",
    robots: post.robots || "index, follow",
  };

  const schemaMarkup = post.schema_markup && typeof post.schema_markup === 'object' 
    ? post.schema_markup as object 
    : undefined;

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead seo={seoData} schema={schemaMarkup} />
      <ReadingProgress />
      <Header />

      <main className="flex-1">
        {/* Article Header */}
        <header className="py-12 md:py-16 bg-gradient-to-b from-secondary/50 to-background">
          <div className="container max-w-4xl">
            <Breadcrumb
              items={[
                { label: categoryName, href: `/category/${categorySlug}` },
                { label: post.title },
              ]}
            />

            <div className="animate-fade-in-up">
              <span className="inline-block px-3 py-1 text-xs font-medium text-primary-foreground bg-primary rounded-full mb-6">
                {categoryName}
              </span>

              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-heading leading-tight">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Meta Info */}
              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{authorName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.published_at || post.created_at}>
                    {format(publishDate, "MMMM d, yyyy")}
                  </time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.reading_time || 5} min read</span>
                </div>
              </div>

              {/* Last Updated */}
              {post.updated_at !== post.created_at && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Last updated: {format(updateDate, "MMMM d, yyyy")}
                </p>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {tags.map((tag: any) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="py-12 md:py-16">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 max-w-6xl mx-auto">
              {/* Main Content */}
              <article className="max-w-3xl">
                {/* Featured Image */}
                {post.featured_image_url ? (
                  <figure className="mb-12 rounded-xl overflow-hidden">
                    <img
                      src={post.featured_image_url}
                      alt={post.featured_image_alt || post.title}
                      className="w-full h-auto"
                    />
                    {post.featured_image_alt && (
                      <figcaption className="mt-2 text-sm text-muted-foreground text-center">
                        {post.featured_image_alt}
                      </figcaption>
                    )}
                  </figure>
                ) : (
                  <figure className="mb-12 rounded-xl overflow-hidden bg-muted aspect-video flex items-center justify-center">
                    <div className="text-center p-8">
                      <span className="font-heading text-6xl text-primary/20">L</span>
                    </div>
                  </figure>
                )}

                {/* Article Body */}
                {post.content && (
                  <div
                    className="article-content prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                )}

                {/* Author Card */}
                {author && (
                  <section className="mt-12 pt-8 border-t border-border">
                    <h2 className="font-heading text-xl font-semibold text-heading mb-4">
                      About the Author
                    </h2>
                    <AuthorCard author={{
                      name: author.display_name || "Anonymous",
                      avatar: author.avatar_url || "",
                      bio: author.bio || "",
                      role: "Author",
                      social: {}
                    }} />
                  </section>
                )}
              </article>

              {/* Sidebar */}
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <div className="p-4 bg-card border border-border rounded-lg">
                    <h3 className="font-heading text-lg font-semibold text-heading mb-2">
                      Share this article
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Found this helpful? Share it with others!
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
