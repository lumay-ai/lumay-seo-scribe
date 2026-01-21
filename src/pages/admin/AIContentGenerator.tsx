import { useState } from "react";
import { useAIContentGenerator } from "@/hooks/useAIContentGenerator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, Copy, FileText, Tags, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { useCreatePost } from "@/hooks/usePosts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const AIContentGenerator = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { generateContent, isGenerating, generatedContent, clearContent } = useAIContentGenerator();
  const createPost = useCreatePost();

  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [brandName, setBrandName] = useState("");
  const [targetWordCount, setTargetWordCount] = useState(2000);

  const handleGenerate = async () => {
    if (!topic.trim() || !keywords.trim()) {
      toast.error("Please enter a topic and keywords");
      return;
    }

    await generateContent({
      topic,
      keywords,
      brandName: brandName || undefined,
      targetWordCount,
    });
  };

  const handleCopyContent = () => {
    if (generatedContent?.content) {
      navigator.clipboard.writeText(generatedContent.content);
      toast.success("Content copied to clipboard!");
    }
  };

  const handleCreatePost = async () => {
    if (!generatedContent || !user) return;

    const slug = generatedContent.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    try {
      await createPost.mutateAsync({
        title: generatedContent.title,
        slug,
        excerpt: generatedContent.excerpt,
        content: generatedContent.content,
        seo_title: generatedContent.title,
        seo_description: generatedContent.metaDescription,
        reading_time: generatedContent.readingTime,
        author_id: user.id,
        status: 'draft' as const,
      });

      toast.success("Post created as draft!");
      navigate("/admin/posts");
    } catch (error) {
      toast.error("Failed to create post");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-heading">AI Content Generator</h1>
        <p className="text-muted-foreground mt-1">
          Generate SEO-optimized blog posts with AI assistance
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Content Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic / Title *</Label>
              <Input
                id="topic"
                placeholder="e.g., Best AI Tools for Content Marketing in 2024"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Primary Keywords *</Label>
              <Textarea
                id="keywords"
                placeholder="e.g., AI content tools, content marketing AI, automated writing"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple keywords with commas
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandName">Brand Name (Optional)</Label>
              <Input
                id="brandName"
                placeholder="Your brand or company name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wordCount">Target Word Count</Label>
              <Input
                id="wordCount"
                type="number"
                min={1500}
                max={5000}
                value={targetWordCount}
                onChange={(e) => setTargetWordCount(parseInt(e.target.value) || 2000)}
              />
              <p className="text-xs text-muted-foreground">
                Recommended: 1500-3000+ words for SEO
              </p>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Content...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Keywords */}
        {generatedContent?.keywords && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tags className="h-5 w-5 text-primary" />
                Generated Keywords
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Primary</Label>
                <Badge className="mt-1">{generatedContent.keywords.primary}</Badge>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">LSI Keywords</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {generatedContent.keywords.lsi.map((kw, i) => (
                    <Badge key={i} variant="secondary">{kw}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Semantic Keywords</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {generatedContent.keywords.semantic.map((kw, i) => (
                    <Badge key={i} variant="outline">{kw}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Related Keywords</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {generatedContent.keywords.related.map((kw, i) => (
                    <Badge key={i} variant="outline">{kw}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Long-tail Queries</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {generatedContent.keywords.longTail.map((kw, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{kw}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Generated Content */}
      {generatedContent && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Generated Content
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyContent}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button size="sm" onClick={handleCreatePost} disabled={createPost.isPending}>
                {createPost.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Create Draft Post
              </Button>
              <Button variant="ghost" size="sm" onClick={clearContent}>
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="preview">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="meta">Meta & SEO</TabsTrigger>
                <TabsTrigger value="faqs">FAQs</TabsTrigger>
                <TabsTrigger value="toc">Table of Contents</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="mt-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{generatedContent.wordCount} words</span>
                    <span>{generatedContent.readingTime} min read</span>
                  </div>

                  <h1 className="text-2xl font-bold">{generatedContent.title}</h1>

                  {generatedContent.tldr && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <h3 className="font-semibold text-sm text-primary mb-2">TL;DR</h3>
                      <p className="text-sm">{generatedContent.tldr}</p>
                    </div>
                  )}

                  {generatedContent.quickSummary && generatedContent.quickSummary.length > 0 && (
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <h3 className="font-semibold text-sm mb-2">Quick Summary</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {generatedContent.quickSummary.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {generatedContent.directAnswer && (
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="font-semibold text-sm text-primary mb-1">Direct Answer</h3>
                      <p className="text-sm">{generatedContent.directAnswer}</p>
                    </div>
                  )}

                  <div 
                    className="prose prose-lg dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: generatedContent.content }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="meta" className="mt-4 space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Meta Title</Label>
                  <p className="font-medium">{generatedContent.title}</p>
                  <span className="text-xs text-muted-foreground">
                    {generatedContent.title.length}/60 characters
                  </span>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Meta Description</Label>
                  <p>{generatedContent.metaDescription}</p>
                  <span className="text-xs text-muted-foreground">
                    {generatedContent.metaDescription.length}/155 characters
                  </span>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Excerpt</Label>
                  <p className="text-sm">{generatedContent.excerpt}</p>
                </div>
              </TabsContent>

              <TabsContent value="faqs" className="mt-4">
                {generatedContent.faqs.length > 0 ? (
                  <div className="space-y-4">
                    {generatedContent.faqs.map((faq, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <HelpCircle className="h-4 w-4 text-primary" />
                          {faq.question}
                        </h4>
                        <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No FAQs generated</p>
                )}
              </TabsContent>

              <TabsContent value="toc" className="mt-4">
                {generatedContent.tableOfContents.length > 0 ? (
                  <ul className="space-y-2">
                    {generatedContent.tableOfContents.map((item, i) => (
                      <li 
                        key={i} 
                        className={`${item.level === 3 ? 'ml-4' : ''}`}
                      >
                        <a href={`#${item.id}`} className="text-primary hover:underline">
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No table of contents generated</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIContentGenerator;
