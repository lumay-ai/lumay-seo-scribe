import { BlogPost, Author } from "@/types/blog";

export const authors: Record<string, Author> = {
  sarah: {
    name: "Sarah Chen",
    avatar: "/authors/sarah.jpg",
    bio: "Senior content strategist with 10+ years in digital marketing. Passionate about SEO and user experience.",
    role: "Editor in Chief",
    social: {
      twitter: "https://twitter.com/sarahchen",
      linkedin: "https://linkedin.com/in/sarahchen",
    },
  },
  michael: {
    name: "Michael Torres",
    avatar: "/authors/michael.jpg",
    bio: "Technical writer and web developer. Loves simplifying complex topics for everyday readers.",
    role: "Senior Writer",
    social: {
      twitter: "https://twitter.com/mtorres",
    },
  },
};

export const samplePosts: BlogPost[] = [
  {
    id: "1",
    slug: "complete-guide-to-seo-2024",
    title: "The Complete Guide to SEO in 2024: Strategies That Actually Work",
    excerpt:
      "Master the art of search engine optimization with proven strategies, from technical SEO to content optimization and link building techniques.",
    content: `
      <p class="lead">Search engine optimization has evolved dramatically over the past decade. What worked five years ago may now actively harm your rankings. This comprehensive guide covers everything you need to know about SEO in 2024.</p>

      <h2 id="understanding-modern-seo">Understanding Modern SEO</h2>
      <p>Modern SEO is fundamentally about providing value to users. Search engines have become incredibly sophisticated at understanding user intent and evaluating content quality. Gone are the days of keyword stuffing and link schemes.</p>
      
      <blockquote>
        <p>"The best SEO strategy is to create content so valuable that people naturally want to link to it and share it."</p>
        <cite>— John Mueller, Google Search Advocate</cite>
      </blockquote>

      <h2 id="technical-seo-fundamentals">Technical SEO Fundamentals</h2>
      <p>Technical SEO forms the foundation of any successful SEO strategy. Without proper technical implementation, even the best content may struggle to rank.</p>
      
      <h3 id="core-web-vitals">Core Web Vitals</h3>
      <p>Core Web Vitals are a set of metrics that Google uses to evaluate user experience:</p>
      <ul>
        <li><strong>Largest Contentful Paint (LCP)</strong>: Measures loading performance. Aim for under 2.5 seconds.</li>
        <li><strong>First Input Delay (FID)</strong>: Measures interactivity. Target under 100 milliseconds.</li>
        <li><strong>Cumulative Layout Shift (CLS)</strong>: Measures visual stability. Keep under 0.1.</li>
      </ul>

      <div class="highlight-box">
        <h4>Pro Tip</h4>
        <p>Use Google PageSpeed Insights to audit your Core Web Vitals and get actionable recommendations for improvement.</p>
      </div>

      <h2 id="content-optimization">Content Optimization Strategies</h2>
      <p>High-quality content is the cornerstone of SEO success. Focus on creating comprehensive, well-researched articles that thoroughly address user queries.</p>

      <h3 id="keyword-research">Keyword Research Best Practices</h3>
      <p>Effective keyword research involves understanding search intent, analyzing competition, and identifying opportunities:</p>
      <ol>
        <li>Start with seed keywords related to your topic</li>
        <li>Use tools like Ahrefs or SEMrush to expand your list</li>
        <li>Analyze the SERPs for each keyword to understand intent</li>
        <li>Prioritize keywords based on search volume and difficulty</li>
      </ol>

      <figure>
        <img src="/blog/seo-keyword-research.jpg" alt="Keyword research process showing search volume analysis and competition metrics" />
        <figcaption>A systematic approach to keyword research yields better results</figcaption>
      </figure>

      <h2 id="link-building">Link Building in 2024</h2>
      <p>Link building remains crucial, but the approach has evolved. Focus on earning links through valuable content and genuine relationships rather than manipulative tactics.</p>

      <h2 id="measuring-success">Measuring SEO Success</h2>
      <p>Track these key metrics to measure your SEO performance:</p>
      <ul>
        <li>Organic traffic growth</li>
        <li>Keyword rankings</li>
        <li>Click-through rates (CTR)</li>
        <li>Conversion rates from organic traffic</li>
        <li>Domain authority growth</li>
      </ul>
    `,
    featuredImage: "/blog/seo-guide-featured.jpg",
    featuredImageAlt:
      "Illustration showing SEO concepts including search rankings, keywords, and website optimization",
    author: authors.sarah,
    publishedAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    readingTime: 12,
    category: "SEO",
    tags: ["SEO", "Digital Marketing", "Content Strategy", "Technical SEO"],
    seo: {
      title: "Complete Guide to SEO in 2024 | Lumay Blog",
      description:
        "Master SEO with our comprehensive 2024 guide. Learn technical SEO, content optimization, and link building strategies that drive real results.",
      canonicalUrl: "https://lumay.blog/complete-guide-to-seo-2024",
      robots: "index, follow",
      ogTitle: "The Complete Guide to SEO in 2024",
      ogDescription:
        "Everything you need to know about search engine optimization in 2024. Proven strategies from industry experts.",
      ogImage: "https://lumay.blog/og/seo-guide-2024.jpg",
      ogType: "article",
      twitterCard: "summary_large_image",
      twitterTitle: "Complete SEO Guide 2024",
      twitterDescription:
        "Master SEO with proven strategies for 2024. Technical SEO, content optimization & more.",
      twitterImage: "https://lumay.blog/twitter/seo-guide-2024.jpg",
    },
    faqs: [
      {
        question: "How long does it take to see SEO results?",
        answer:
          "SEO typically takes 3-6 months to show significant results. However, this varies based on competition, domain authority, and the quality of your optimization efforts.",
      },
      {
        question: "Is SEO still worth it in 2024?",
        answer:
          "Absolutely. Organic search remains one of the most cost-effective and sustainable sources of website traffic. While the landscape has evolved, SEO continues to deliver strong ROI for businesses.",
      },
      {
        question: "What are the most important ranking factors?",
        answer:
          "The most important ranking factors include high-quality content, backlinks from authoritative sites, user experience metrics (Core Web Vitals), mobile-friendliness, and E-E-A-T signals.",
      },
    ],
    sources: [
      {
        title: "Google Search Central Documentation",
        url: "https://developers.google.com/search/docs",
      },
      {
        title: "Moz Beginner's Guide to SEO",
        url: "https://moz.com/beginners-guide-to-seo",
      },
      {
        title: "Ahrefs SEO Blog",
        url: "https://ahrefs.com/blog/",
      },
    ],
    relatedPosts: ["2", "3"],
    tableOfContents: [
      { id: "understanding-modern-seo", title: "Understanding Modern SEO", level: 2 },
      { id: "technical-seo-fundamentals", title: "Technical SEO Fundamentals", level: 2 },
      { id: "core-web-vitals", title: "Core Web Vitals", level: 3 },
      { id: "content-optimization", title: "Content Optimization Strategies", level: 2 },
      { id: "keyword-research", title: "Keyword Research Best Practices", level: 3 },
      { id: "link-building", title: "Link Building in 2024", level: 2 },
      { id: "measuring-success", title: "Measuring SEO Success", level: 2 },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "The Complete Guide to SEO in 2024: Strategies That Actually Work",
      description:
        "Master SEO with our comprehensive 2024 guide covering technical SEO, content optimization, and link building.",
      image: "https://lumay.blog/blog/seo-guide-featured.jpg",
      author: {
        "@type": "Person",
        name: "Sarah Chen",
      },
      publisher: {
        "@type": "Organization",
        name: "Lumay Blog",
        logo: {
          "@type": "ImageObject",
          url: "https://lumay.blog/logo.png",
        },
      },
      datePublished: "2024-01-15T10:00:00Z",
      dateModified: "2024-01-20T14:30:00Z",
    },
  },
  {
    id: "2",
    slug: "content-writing-tips-beginners",
    title: "10 Essential Content Writing Tips for Beginners",
    excerpt:
      "Learn the fundamentals of effective content writing with these practical tips that will help you create engaging, SEO-friendly articles.",
    content: `
      <p class="lead">Great content writing is both an art and a science. Whether you're starting a blog or writing for business, these foundational tips will set you on the path to success.</p>

      <h2 id="know-your-audience">1. Know Your Audience</h2>
      <p>Before writing a single word, understand who you're writing for. Create detailed reader personas that include demographics, pain points, and goals.</p>

      <h2 id="write-compelling-headlines">2. Write Compelling Headlines</h2>
      <p>Your headline is the first impression. Spend time crafting headlines that are clear, compelling, and promise value to the reader.</p>

      <h2 id="structure-your-content">3. Structure Your Content</h2>
      <p>Use headers, subheaders, bullet points, and short paragraphs to make your content scannable. Most readers skim before deciding to read in full.</p>

      <h2 id="focus-on-value">4. Focus on Providing Value</h2>
      <p>Every piece of content should answer a question, solve a problem, or provide entertainment. Always ask: "What does the reader gain from this?"</p>

      <h2 id="edit-ruthlessly">5. Edit Ruthlessly</h2>
      <p>First drafts are never perfect. Edit for clarity, remove redundant words, and ensure every sentence serves a purpose.</p>
    `,
    featuredImage: "/blog/content-writing.jpg",
    featuredImageAlt: "Writer at desk with laptop creating content",
    author: authors.michael,
    publishedAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-10T08:00:00Z",
    readingTime: 8,
    category: "Content",
    tags: ["Content Writing", "Blogging", "Tips"],
    seo: {
      title: "10 Essential Content Writing Tips for Beginners | Lumay Blog",
      description:
        "Master content writing with these 10 essential tips for beginners. Learn to create engaging, SEO-friendly articles.",
      canonicalUrl: "https://lumay.blog/content-writing-tips-beginners",
      robots: "index, follow",
      ogTitle: "10 Essential Content Writing Tips for Beginners",
      ogDescription: "Practical tips to improve your content writing skills.",
      ogImage: "https://lumay.blog/og/content-writing.jpg",
      ogType: "article",
      twitterCard: "summary_large_image",
      twitterTitle: "Content Writing Tips for Beginners",
      twitterDescription: "10 practical tips to become a better content writer.",
      twitterImage: "https://lumay.blog/twitter/content-writing.jpg",
    },
    faqs: [
      {
        question: "How long should my blog posts be?",
        answer:
          "Aim for 1,500-2,500 words for comprehensive topics, but prioritize quality over length. Some topics can be covered well in 800 words.",
      },
    ],
    sources: [],
    relatedPosts: ["1", "3"],
    tableOfContents: [
      { id: "know-your-audience", title: "Know Your Audience", level: 2 },
      { id: "write-compelling-headlines", title: "Write Compelling Headlines", level: 2 },
      { id: "structure-your-content", title: "Structure Your Content", level: 2 },
      { id: "focus-on-value", title: "Focus on Providing Value", level: 2 },
      { id: "edit-ruthlessly", title: "Edit Ruthlessly", level: 2 },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "10 Essential Content Writing Tips for Beginners",
      description: "Learn the fundamentals of effective content writing.",
      image: "https://lumay.blog/blog/content-writing.jpg",
      author: { "@type": "Person", name: "Michael Torres" },
      publisher: {
        "@type": "Organization",
        name: "Lumay Blog",
        logo: { "@type": "ImageObject", url: "https://lumay.blog/logo.png" },
      },
      datePublished: "2024-01-10T08:00:00Z",
      dateModified: "2024-01-10T08:00:00Z",
    },
  },
  {
    id: "3",
    slug: "building-authority-online",
    title: "How to Build Authority and Trust Online (E-E-A-T Guide)",
    excerpt:
      "Understand Google's E-E-A-T framework and learn practical strategies to establish your expertise, experience, authority, and trustworthiness.",
    content: `
      <p class="lead">E-E-A-T stands for Experience, Expertise, Authoritativeness, and Trustworthiness. It's a framework Google uses to evaluate content quality.</p>

      <h2 id="what-is-eeat">What is E-E-A-T?</h2>
      <p>E-E-A-T is part of Google's Search Quality Rater Guidelines. While not a direct ranking factor, it influences how Google's algorithms perceive content quality.</p>

      <h2 id="demonstrating-experience">Demonstrating Experience</h2>
      <p>Show that you have first-hand experience with the topics you write about. Include personal anecdotes, case studies, and real-world examples.</p>

      <h2 id="building-expertise">Building Expertise</h2>
      <p>Establish your knowledge through in-depth content, proper citations, and staying current with industry developments.</p>

      <h2 id="establishing-authority">Establishing Authority</h2>
      <p>Build your reputation through guest posting, speaking engagements, and earning recognition from other experts in your field.</p>

      <h2 id="earning-trust">Earning Trust</h2>
      <p>Be transparent about who you are, cite reliable sources, and maintain accuracy in all your content.</p>
    `,
    featuredImage: "/blog/eeat-guide.jpg",
    featuredImageAlt: "Trust and authority concept with professional networking",
    author: authors.sarah,
    publishedAt: "2024-01-05T09:00:00Z",
    updatedAt: "2024-01-18T11:00:00Z",
    readingTime: 10,
    category: "SEO",
    tags: ["E-E-A-T", "Authority", "Trust", "SEO"],
    seo: {
      title: "E-E-A-T Guide: Build Authority & Trust Online | Lumay Blog",
      description:
        "Learn how to demonstrate Experience, Expertise, Authority, and Trustworthiness to improve your content's credibility and SEO.",
      canonicalUrl: "https://lumay.blog/building-authority-online",
      robots: "index, follow",
      ogTitle: "How to Build Authority and Trust Online",
      ogDescription: "Master the E-E-A-T framework for better content credibility.",
      ogImage: "https://lumay.blog/og/eeat-guide.jpg",
      ogType: "article",
      twitterCard: "summary_large_image",
      twitterTitle: "E-E-A-T Guide for Content Creators",
      twitterDescription: "Build authority and trust with Google's E-E-A-T framework.",
      twitterImage: "https://lumay.blog/twitter/eeat-guide.jpg",
    },
    faqs: [
      {
        question: "Is E-E-A-T a ranking factor?",
        answer:
          "E-E-A-T is not a direct ranking factor, but it's a framework that influences many ranking signals. Google's algorithms are designed to surface content that demonstrates these qualities.",
      },
    ],
    sources: [
      {
        title: "Google Search Quality Rater Guidelines",
        url: "https://static.googleusercontent.com/media/guidelines.raterhub.com/en//searchqualityevaluatorguidelines.pdf",
      },
    ],
    relatedPosts: ["1", "2"],
    tableOfContents: [
      { id: "what-is-eeat", title: "What is E-E-A-T?", level: 2 },
      { id: "demonstrating-experience", title: "Demonstrating Experience", level: 2 },
      { id: "building-expertise", title: "Building Expertise", level: 2 },
      { id: "establishing-authority", title: "Establishing Authority", level: 2 },
      { id: "earning-trust", title: "Earning Trust", level: 2 },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "How to Build Authority and Trust Online (E-E-A-T Guide)",
      description: "Master Google's E-E-A-T framework for content credibility.",
      image: "https://lumay.blog/blog/eeat-guide.jpg",
      author: { "@type": "Person", name: "Sarah Chen" },
      publisher: {
        "@type": "Organization",
        name: "Lumay Blog",
        logo: { "@type": "ImageObject", url: "https://lumay.blog/logo.png" },
      },
      datePublished: "2024-01-05T09:00:00Z",
      dateModified: "2024-01-18T11:00:00Z",
    },
  },
];

export const getPostBySlug = (slug: string): BlogPost | undefined => {
  return samplePosts.find((post) => post.slug === slug);
};

export const getRelatedPosts = (postIds: string[]): BlogPost[] => {
  return samplePosts.filter((post) => postIds.includes(post.id));
};
