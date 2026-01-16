export interface Author {
  name: string;
  avatar: string;
  bio: string;
  role: string;
  social?: {
    twitter?: string;
    linkedin?: string;
  };
}

export interface SEOMeta {
  title: string;
  description: string;
  canonicalUrl: string;
  robots: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Source {
  title: string;
  url: string;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  featuredImageAlt: string;
  author: Author;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  category: string;
  tags: string[];
  seo: SEOMeta;
  faqs: FAQ[];
  sources: Source[];
  relatedPosts: string[];
  tableOfContents: TableOfContentsItem[];
  schema: {
    "@context": string;
    "@type": string;
    headline: string;
    description: string;
    image: string;
    author: {
      "@type": string;
      name: string;
    };
    publisher: {
      "@type": string;
      name: string;
      logo: {
        "@type": string;
        url: string;
      };
    };
    datePublished: string;
    dateModified: string;
  };
}
