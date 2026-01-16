import { useEffect } from "react";
import { SEOMeta } from "@/types/blog";

interface SEOHeadProps {
  seo: SEOMeta;
  schema?: object;
}

const SEOHead = ({ seo, schema }: SEOHeadProps) => {
  useEffect(() => {
    // Update document title
    document.title = seo.title;

    // Update or create meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Standard meta tags
    updateMeta("description", seo.description);
    updateMeta("robots", seo.robots);

    // Open Graph tags
    updateMeta("og:title", seo.ogTitle, true);
    updateMeta("og:description", seo.ogDescription, true);
    updateMeta("og:image", seo.ogImage, true);
    updateMeta("og:type", seo.ogType, true);

    // Twitter tags
    updateMeta("twitter:card", seo.twitterCard);
    updateMeta("twitter:title", seo.twitterTitle);
    updateMeta("twitter:description", seo.twitterDescription);
    updateMeta("twitter:image", seo.twitterImage);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = seo.canonicalUrl;

    // Cleanup function
    return () => {
      document.title = "Lumay Blog";
    };
  }, [seo]);

  return schema ? (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  ) : null;
};

export default SEOHead;
