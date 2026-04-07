import { useState, useMemo, useCallback } from "react";
import { usePosts } from "@/hooks/usePosts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link2, Search, Plus, BookOpen, ArrowRight, Sparkles, Check, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface InternalLinkingProps {
  content: string;
  currentPostId?: string;
  onInsertLink: (html: string) => void;
  onUpdateContent: (newContent: string) => void;
}

interface LinkOpportunity {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    category?: { name: string; slug: string } | null;
  };
  matchedKeywords: string[];
  suggestedAnchor: string;
  relevanceScore: number;
}

const InternalLinking = ({
  content,
  currentPostId,
  onInsertLink,
  onUpdateContent,
}: InternalLinkingProps) => {
  const { data: allPosts } = usePosts("published");
  const [searchQuery, setSearchQuery] = useState("");
  const [insertType, setInsertType] = useState<"inline" | "also-read" | "related">("inline");
  const [insertedLinks, setInsertedLinks] = useState<Set<string>>(new Set());

  // Strip HTML for text analysis
  const plainContent = useMemo(
    () => content.replace(/<[^>]*>/g, " ").toLowerCase(),
    [content]
  );

  // Find internal linking opportunities
  const opportunities = useMemo((): LinkOpportunity[] => {
    if (!allPosts) return [];

    const otherPosts = allPosts.filter(
      (p: any) => p.id !== currentPostId
    );

    return otherPosts
      .map((post: any) => {
        const titleWords = post.title
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "")
          .split(/\s+/)
          .filter((w: string) => w.length > 3);

        // Check which title keywords appear in content
        const matchedKeywords = titleWords.filter(
          (word: string) => plainContent.includes(word)
        );

        // Build a relevance score
        const keywordRatio = titleWords.length > 0 ? matchedKeywords.length / titleWords.length : 0;
        const excerptWords = (post.excerpt || "")
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "")
          .split(/\s+/)
          .filter((w: string) => w.length > 3);
        const excerptMatches = excerptWords.filter(
          (w: string) => plainContent.includes(w)
        ).length;
        const excerptRatio = excerptWords.length > 0 ? excerptMatches / excerptWords.length : 0;

        const relevanceScore = keywordRatio * 0.7 + excerptRatio * 0.3;

        // Generate SEO-friendly anchor text
        const suggestedAnchor = post.title.length > 60
          ? post.title.slice(0, 57) + "..."
          : post.title;

        return {
          post: {
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            category: post.category,
          },
          matchedKeywords: matchedKeywords.slice(0, 5),
          suggestedAnchor,
          relevanceScore,
        };
      })
      .filter((opp: LinkOpportunity) => opp.relevanceScore > 0.15)
      .sort((a: LinkOpportunity, b: LinkOpportunity) => b.relevanceScore - a.relevanceScore)
      .slice(0, 15);
  }, [allPosts, currentPostId, plainContent]);

  // Filter by search
  const filteredOpportunities = useMemo(() => {
    if (!searchQuery.trim()) return opportunities;
    const q = searchQuery.toLowerCase();
    return opportunities.filter(
      (opp) =>
        opp.post.title.toLowerCase().includes(q) ||
        opp.matchedKeywords.some((k) => k.includes(q))
    );
  }, [opportunities, searchQuery]);

  // All published posts for manual search
  const manualSearchResults = useMemo(() => {
    if (!searchQuery.trim() || !allPosts) return [];
    const q = searchQuery.toLowerCase();
    return allPosts
      .filter(
        (p: any) =>
          p.id !== currentPostId &&
          (p.title.toLowerCase().includes(q) ||
            (p.excerpt || "").toLowerCase().includes(q))
      )
      .slice(0, 10);
  }, [searchQuery, allPosts, currentPostId]);

  const buildInlineLink = (title: string, slug: string, customAnchor?: string) => {
    const anchor = customAnchor || title;
    return `<a href="/blog/${slug}" title="${title}">${anchor}</a>`;
  };

  const buildAlsoReadBlock = (posts: { title: string; slug: string }[]) => {
    const items = posts
      .map((p) => `<li><a href="/blog/${p.slug}" title="${p.title}">${p.title}</a></li>`)
      .join("\n    ");
    return `\n<div class="also-read-section" style="background:#f8f9fa;border-left:4px solid #3b82f6;padding:16px 20px;margin:24px 0;border-radius:0 8px 8px 0;">
  <h3 style="margin:0 0 12px 0;font-size:16px;font-weight:600;">📖 Also Read</h3>
  <ul style="margin:0;padding-left:20px;list-style:disc;">
    ${items}
  </ul>
</div>\n`;
  };

  const buildRelatedBlock = (posts: { title: string; slug: string; excerpt: string | null }[]) => {
    const items = posts
      .map(
        (p) => `<div style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
    <a href="/blog/${p.slug}" title="${p.title}" style="font-weight:600;color:#3b82f6;text-decoration:none;">${p.title}</a>
    ${p.excerpt ? `<p style="margin:4px 0 0;font-size:14px;color:#6b7280;">${p.excerpt.slice(0, 100)}...</p>` : ""}
  </div>`
      )
      .join("\n  ");
    return `\n<div class="related-posts-section" style="background:#fefce8;border:1px solid #fde68a;padding:20px;margin:24px 0;border-radius:8px;">
  <h3 style="margin:0 0 16px 0;font-size:16px;font-weight:600;">🔗 Related Articles</h3>
  ${items}
</div>\n`;
  };

  const buildMoreBlock = (posts: { title: string; slug: string }[]) => {
    const items = posts
      .map((p) => `<a href="/blog/${p.slug}" title="${p.title}" style="display:inline-block;padding:6px 14px;background:#f3f4f6;border-radius:20px;font-size:13px;color:#374151;text-decoration:none;margin:4px;">${p.title}</a>`)
      .join("\n    ");
    return `\n<div class="more-articles-section" style="padding:20px 0;margin:24px 0;border-top:2px solid #e5e7eb;">
  <h3 style="margin:0 0 12px 0;font-size:16px;font-weight:600;">📚 More on This Topic</h3>
  <div style="display:flex;flex-wrap:wrap;gap:4px;">
    ${items}
  </div>
</div>\n`;
  };

  const handleInsertInline = (opp: LinkOpportunity) => {
    const link = buildInlineLink(opp.post.title, opp.post.slug, opp.suggestedAnchor);
    onInsertLink(link);
    setInsertedLinks((prev) => new Set(prev).add(opp.post.id));
    toast({
      title: "Link inserted",
      description: `Inline link to "${opp.post.title}" added at cursor.`,
    });
  };

  const handleAutoInsertInContent = useCallback(
    (opp: LinkOpportunity) => {
      // Find a keyword match in the content and wrap it with a link
      const keyword = opp.matchedKeywords[0];
      if (!keyword) return;

      // Find the keyword in plain text within HTML
      const regex = new RegExp(
        `(?<![<\\/a-zA-Z"=])\\b(${keyword})\\b(?![^<]*>|[^<]*<\\/a>)`,
        "i"
      );
      const match = content.match(regex);
      if (match && match.index !== undefined) {
        const before = content.slice(0, match.index);
        const after = content.slice(match.index + match[0].length);
        const linked = `<a href="/blog/${opp.post.slug}" title="${opp.post.title}">${match[0]}</a>`;
        onUpdateContent(before + linked + after);
        setInsertedLinks((prev) => new Set(prev).add(opp.post.id));
        toast({
          title: "Auto-linked!",
          description: `"${match[0]}" linked to "${opp.post.title}"`,
        });
      } else {
        toast({
          title: "No match found",
          description: "Could not find a suitable place to insert. Use inline insert instead.",
          variant: "destructive",
        });
      }
    },
    [content, onUpdateContent]
  );

  const handleInsertAlsoRead = (posts: LinkOpportunity[]) => {
    const block = buildAlsoReadBlock(
      posts.slice(0, 4).map((o) => ({ title: o.post.title, slug: o.post.slug }))
    );
    onInsertLink(block);
    toast({ title: "Also Read block inserted" });
  };

  const handleInsertRelated = (posts: LinkOpportunity[]) => {
    const block = buildRelatedBlock(
      posts.slice(0, 4).map((o) => ({
        title: o.post.title,
        slug: o.post.slug,
        excerpt: o.post.excerpt,
      }))
    );
    onInsertLink(block);
    toast({ title: "Related Articles block inserted" });
  };

  const handleInsertMore = (posts: LinkOpportunity[]) => {
    const block = buildMoreBlock(
      posts.slice(0, 6).map((o) => ({ title: o.post.title, slug: o.post.slug }))
    );
    onInsertLink(block);
    toast({ title: "More Articles block inserted" });
  };

  const handleInsertManual = (post: any) => {
    if (insertType === "inline") {
      const link = buildInlineLink(post.title, post.slug);
      onInsertLink(link);
      toast({ title: "Link inserted", description: `Inline link to "${post.title}" added.` });
    } else if (insertType === "also-read") {
      const block = buildAlsoReadBlock([{ title: post.title, slug: post.slug }]);
      onInsertLink(block);
      toast({ title: "Also Read block inserted" });
    } else {
      const block = buildRelatedBlock([
        { title: post.title, slug: post.slug, excerpt: post.excerpt },
      ]);
      onInsertLink(block);
      toast({ title: "Related block inserted" });
    }
    setInsertedLinks((prev) => new Set(prev).add(post.id));
  };

  const copyAnchorHtml = (title: string, slug: string) => {
    const html = buildInlineLink(title, slug);
    navigator.clipboard.writeText(html);
    toast({ title: "Copied!", description: "Anchor HTML copied to clipboard." });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="font-heading flex items-center gap-2 text-base">
          <Link2 className="h-5 w-5 text-primary" />
          Internal Linking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Actions */}
        {opportunities.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Quick Insert Blocks
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleInsertAlsoRead(opportunities)}
              >
                <BookOpen className="h-3 w-3 mr-1" />
                Also Read
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleInsertRelated(opportunities)}
              >
                <ArrowRight className="h-3 w-3 mr-1" />
                Related
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleInsertMore(opportunities)}
              >
                <Plus className="h-3 w-3 mr-1" />
                More
              </Button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts to link..."
            className="pl-9 h-9 text-sm"
          />
        </div>

        {/* Insert Type */}
        <div className="flex items-center gap-2">
          <Label className="text-xs whitespace-nowrap">Insert as:</Label>
          <Select value={insertType} onValueChange={(v: any) => setInsertType(v)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inline">Inline Link</SelectItem>
              <SelectItem value="also-read">Also Read Block</SelectItem>
              <SelectItem value="related">Related Block</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Auto-detected Opportunities */}
        {filteredOpportunities.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Auto-Detected ({filteredOpportunities.length})
            </Label>
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {filteredOpportunities.map((opp) => (
                <div
                  key={opp.post.id}
                  className="p-2.5 rounded-md border border-border bg-muted/30 hover:bg-muted/60 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {opp.post.title}
                      </p>
                      {opp.post.category && (
                        <span className="text-[10px] text-primary font-medium uppercase">
                          {opp.post.category.name}
                        </span>
                      )}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {opp.matchedKeywords.map((kw) => (
                          <Badge key={kw} variant="secondary" className="text-[10px] px-1.5 py-0">
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {insertedLinks.has(opp.post.id) ? (
                        <Badge variant="default" className="text-[10px] px-1.5">
                          <Check className="h-3 w-3 mr-0.5" /> Added
                        </Badge>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            title="Auto-link keyword in content"
                            onClick={() => handleAutoInsertInContent(opp)}
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            title="Insert at cursor"
                            onClick={() => handleInsertInline(opp)}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            title="Copy anchor HTML"
                            onClick={() => copyAnchorHtml(opp.post.title, opp.post.slug)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-1">
                    <div className="h-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/60"
                        style={{ width: `${Math.min(100, opp.relevanceScore * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manual Search Results */}
        {searchQuery.trim() && manualSearchResults.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Search Results
            </Label>
            <div className="max-h-[200px] overflow-y-auto space-y-1">
              {manualSearchResults.map((post: any) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer group"
                  onClick={() => handleInsertManual(post)}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground truncate">{post.title}</p>
                    <p className="text-[10px] text-muted-foreground">/blog/{post.slug}</p>
                  </div>
                  {insertedLinks.has(post.id) ? (
                    <Check className="h-4 w-4 text-primary shrink-0" />
                  ) : (
                    <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {opportunities.length === 0 && !searchQuery.trim() && (
          <p className="text-xs text-muted-foreground text-center py-4">
            Write some content first to see internal linking opportunities.
          </p>
        )}

        <p className="text-[10px] text-muted-foreground">
          Links use SEO-friendly anchor text with title attributes for better crawlability.
        </p>
      </CardContent>
    </Card>
  );
};

export default InternalLinking;
