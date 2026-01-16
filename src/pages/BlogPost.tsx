import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, Clock, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TableOfContents from "@/components/TableOfContents";
import AuthorCard from "@/components/AuthorCard";
import FAQSection from "@/components/FAQSection";
import SourcesSection from "@/components/SourcesSection";
import RelatedPosts from "@/components/RelatedPosts";
import ReadingProgress from "@/components/ReadingProgress";
import SEOHead from "@/components/SEOHead";
import { getPostBySlug, getRelatedPosts } from "@/data/posts";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug || "");

  if (!post) {
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

  const publishDate = new Date(post.publishedAt);
  const updateDate = new Date(post.updatedAt);
  const relatedPosts = getRelatedPosts(post.relatedPosts);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead seo={post.seo} schema={post.schema} />
      <ReadingProgress />
      <Header />

      <main className="flex-1">
        {/* Article Header */}
        <header className="py-12 md:py-16 bg-gradient-to-b from-secondary/50 to-background">
          <div className="container max-w-4xl">
            <Breadcrumb
              items={[
                { label: post.category, href: `/category/${post.category.toLowerCase()}` },
                { label: post.title },
              ]}
            />

            <div className="animate-fade-in-up">
              <span className="inline-block px-3 py-1 text-xs font-medium text-primary-foreground bg-primary rounded-full mb-6">
                {post.category}
              </span>

              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-heading leading-tight">
                {post.title}
              </h1>

              <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>

              {/* Meta Info */}
              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.publishedAt}>
                    {format(publishDate, "MMMM d, yyyy")}
                  </time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readingTime} min read</span>
                </div>
              </div>

              {/* Last Updated */}
              {post.updatedAt !== post.publishedAt && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Last updated: {format(updateDate, "MMMM d, yyyy")}
                </p>
              )}

              {/* Tags */}
              <div className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="py-12 md:py-16">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 max-w-6xl mx-auto">
              {/* Main Content */}
              <article className="max-w-3xl">
                {/* Featured Image Placeholder */}
                <figure className="mb-12 rounded-xl overflow-hidden bg-muted aspect-video flex items-center justify-center">
                  <div className="text-center p-8">
                    <span className="font-heading text-6xl text-primary/20">L</span>
                    <p className="mt-4 text-sm text-muted-foreground">
                      {post.featuredImageAlt}
                    </p>
                  </div>
                </figure>

                {/* Article Body */}
                <div
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* FAQ Section */}
                <FAQSection faqs={post.faqs} />

                {/* Sources */}
                <SourcesSection sources={post.sources} />

                {/* Author Card */}
                <section className="mt-12 pt-8 border-t border-border">
                  <h2 className="font-heading text-xl font-semibold text-heading mb-4">
                    About the Author
                  </h2>
                  <AuthorCard author={post.author} />
                </section>

                {/* Related Posts */}
                <RelatedPosts posts={relatedPosts} />
              </article>

              {/* Sidebar - TOC */}
              <aside className="hidden lg:block">
                <TableOfContents items={post.tableOfContents} />
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
