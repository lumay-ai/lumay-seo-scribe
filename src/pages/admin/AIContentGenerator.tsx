import { useState } from "react";
import { useAIContentGenerator, GenerateParams } from "@/hooks/useAIContentGenerator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Loader2, Sparkles, Copy, FileText, Tags, HelpCircle, Send, 
  MapPin, Zap, Target, Layers, BookOpen, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { useCreatePost } from "@/hooks/usePosts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const AIContentGenerator = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { generateContent, isGenerating, generatedContent, clearContent } = useAIContentGenerator();
  const createPost = useCreatePost();

  // Basic fields
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [brandName, setBrandName] = useState("Lumay AI");
  const [location, setLocation] = useState("");
  const [targetWordCount, setTargetWordCount] = useState(2500);
  
  // Advanced keyword options
  const [keywordIntent, setKeywordIntent] = useState("");
  const [powerWords, setPowerWords] = useState("");
  const [keywordPrefix, setKeywordPrefix] = useState("");
  const [keywordSuffix, setKeywordSuffix] = useState("");

  const handleGenerate = async () => {
    if (!topic.trim() || !keywords.trim()) {
      toast.error("Please enter a topic and keywords");
      return;
    }

    const params: GenerateParams = {
      topic,
      keywords,
      brandName: brandName || "Lumay AI",
      location: location || undefined,
      targetWordCount,
      keywordIntent: keywordIntent || undefined,
      powerWords: powerWords || undefined,
      keywordPrefix: keywordPrefix || undefined,
      keywordSuffix: keywordSuffix || undefined,
    };

    await generateContent(params);
  };

  const handleCopyContent = (type: 'html' | 'plain') => {
    if (!generatedContent) return;
    
    const textToCopy = type === 'plain' 
      ? generatedContent.plainContent || generatedContent.content.replace(/<[^>]*>/g, '')
      : generatedContent.content;
      
    navigator.clipboard.writeText(textToCopy);
    toast.success(`${type === 'plain' ? 'Plain text' : 'HTML'} copied to clipboard!`);
  };

  const handleCreatePost = async (publish: boolean = false) => {
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
        status: publish ? 'published' : 'draft',
        published_at: publish ? new Date().toISOString() : null,
        schema_markup: generatedContent.schemaMarkup ? JSON.parse(JSON.stringify(generatedContent.schemaMarkup)) : null,
        robots: 'index, follow',
        canonical_url: `https://lumay.42web.io/blog/${slug}`,
      });

      toast.success(publish ? "Post published successfully!" : "Post saved as draft!");
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
          Generate SEO-optimized blog posts with advanced query ladder keywords and semantic HTML
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
            <CardDescription>
              Configure your content generation settings
            </CardDescription>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brandName" className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  Brand Name
                </Label>
                <Input
                  id="brandName"
                  placeholder="Lumay AI"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., Dover, DE, USA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wordCount">Target Word Count</Label>
              <Select value={targetWordCount.toString()} onValueChange={(v) => setTargetWordCount(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1500">1500+ words</SelectItem>
                  <SelectItem value="2000">2000+ words</SelectItem>
                  <SelectItem value="2500">2500+ words</SelectItem>
                  <SelectItem value="3000">3000+ words</SelectItem>
                  <SelectItem value="4000">4000+ words</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Advanced Keyword Options */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="advanced">
                <AccordionTrigger className="text-sm">
                  <span className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Query Ladder Options
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="keywordIntent">Keyword Intent</Label>
                    <Select value={keywordIntent} onValueChange={setKeywordIntent}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select intent type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="informational">Informational (how to, what is)</SelectItem>
                        <SelectItem value="commercial">Commercial (best, top, review)</SelectItem>
                        <SelectItem value="transactional">Transactional (buy, get, download)</SelectItem>
                        <SelectItem value="navigational">Navigational (brand + keyword)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="keywordPrefix">Keyword Prefix</Label>
                      <Input
                        id="keywordPrefix"
                        placeholder="e.g., best, top, how to"
                        value={keywordPrefix}
                        onChange={(e) => setKeywordPrefix(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="keywordSuffix">Keyword Suffix</Label>
                      <Input
                        id="keywordSuffix"
                        placeholder="e.g., 2024, guide, tips"
                        value={keywordSuffix}
                        onChange={(e) => setKeywordSuffix(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="powerWords" className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      Power Words
                    </Label>
                    <Input
                      id="powerWords"
                      placeholder="e.g., Ultimate, Essential, Proven, Expert"
                      value={powerWords}
                      onChange={(e) => setPowerWords(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Emotional trigger words to include in content
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="w-full"
              size="lg"
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
                Query Ladder Keywords
              </CardTitle>
              <CardDescription>
                AI-generated keyword ecosystem for SEO optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
              <div>
                <Label className="text-xs text-muted-foreground">Primary Keyword</Label>
                <Badge className="mt-1 text-base">{generatedContent.keywords.primary}</Badge>
              </div>

              {generatedContent.keywords.withPrefix?.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">With Prefix</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {generatedContent.keywords.withPrefix.map((kw, i) => (
                      <Badge key={i} variant="secondary">{kw}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {generatedContent.keywords.withSuffix?.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">With Suffix</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {generatedContent.keywords.withSuffix.map((kw, i) => (
                      <Badge key={i} variant="secondary">{kw}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label className="text-xs text-muted-foreground">LSI Keywords</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {generatedContent.keywords.lsi?.map((kw, i) => (
                    <Badge key={i} variant="outline">{kw}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Semantic Keywords</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {generatedContent.keywords.semantic?.map((kw, i) => (
                    <Badge key={i} variant="outline">{kw}</Badge>
                  ))}
                </div>
              </div>

              {generatedContent.keywords.distance && (
                <div>
                  <Label className="text-xs text-muted-foreground">Distance Keywords</Label>
                  <div className="space-y-2 mt-1">
                    <div>
                      <span className="text-xs text-green-600">Close:</span>
                      <div className="flex flex-wrap gap-1">
                        {generatedContent.keywords.distance.close?.map((kw, i) => (
                          <Badge key={i} className="bg-green-100 text-green-800 text-xs">{kw}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-yellow-600">Medium:</span>
                      <div className="flex flex-wrap gap-1">
                        {generatedContent.keywords.distance.medium?.map((kw, i) => (
                          <Badge key={i} className="bg-yellow-100 text-yellow-800 text-xs">{kw}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-orange-600">Far:</span>
                      <div className="flex flex-wrap gap-1">
                        {generatedContent.keywords.distance.far?.map((kw, i) => (
                          <Badge key={i} className="bg-orange-100 text-orange-800 text-xs">{kw}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-xs text-muted-foreground">Long-tail Queries</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {generatedContent.keywords.longTail?.map((kw, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{kw}</Badge>
                  ))}
                </div>
              </div>

              {generatedContent.keywords.llmQueries?.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">LLM/AI Queries</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {generatedContent.keywords.llmQueries.map((kw, i) => (
                      <Badge key={i} className="bg-purple-100 text-purple-800 text-xs">{kw}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {generatedContent.keywords.nlpEntities?.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">NLP Entities</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {generatedContent.keywords.nlpEntities.map((kw, i) => (
                      <Badge key={i} className="bg-blue-100 text-blue-800 text-xs">{kw}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {generatedContent.keywords.intentBased && (
                <div>
                  <Label className="text-xs text-muted-foreground">Intent-Based Keywords</Label>
                  <div className="space-y-1 mt-1 text-xs">
                    {Object.entries(generatedContent.keywords.intentBased).map(([intent, kws]) => (
                      kws && kws.length > 0 && (
                        <div key={intent}>
                          <span className="capitalize font-medium">{intent}:</span>
                          <span className="text-muted-foreground ml-1">{kws.join(', ')}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Generated Content */}
      {generatedContent && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Generated Content
              </CardTitle>
              <CardDescription>
                {generatedContent.wordCount} words • {generatedContent.readingTime} min read
                {generatedContent.keywordDensity && ` • ${generatedContent.keywordDensity}% keyword density`}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => handleCopyContent('plain')}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Plain Text
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleCopyContent('html')}>
                <Copy className="mr-2 h-4 w-4" />
                Copy HTML
              </Button>
              <Button variant="secondary" size="sm" onClick={() => handleCreatePost(false)} disabled={createPost.isPending}>
                {createPost.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookOpen className="mr-2 h-4 w-4" />}
                Save Draft
              </Button>
              <Button size="sm" onClick={() => handleCreatePost(true)} disabled={createPost.isPending}>
                {createPost.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Publish Now
              </Button>
              <Button variant="ghost" size="sm" onClick={clearContent}>
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="preview">
              <TabsList className="grid grid-cols-5 w-full max-w-2xl">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="html">HTML Code</TabsTrigger>
                <TabsTrigger value="meta">Meta & SEO</TabsTrigger>
                <TabsTrigger value="faqs">FAQs</TabsTrigger>
                <TabsTrigger value="toc">TOC</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="mt-4">
                <div className="space-y-6">
                  <h1 className="text-2xl md:text-3xl font-bold">{generatedContent.title}</h1>

                  {generatedContent.tldr && (
                    <aside className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-4">
                      <h3 className="font-semibold text-sm text-primary mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        TL;DR
                      </h3>
                      <p className="text-sm">{generatedContent.tldr}</p>
                    </aside>
                  )}

                  {generatedContent.quickSummary && generatedContent.quickSummary.length > 0 && (
                    <aside className="bg-secondary/50 rounded-lg p-4">
                      <h3 className="font-semibold text-sm mb-2">Quick Summary</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {generatedContent.quickSummary.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </aside>
                  )}

                  {generatedContent.directAnswer && (
                    <aside className="border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/20 pl-4 py-3 pr-4 rounded-r-lg">
                      <h3 className="font-semibold text-sm text-amber-700 dark:text-amber-400 mb-1">Direct Answer</h3>
                      <p className="text-sm">{generatedContent.directAnswer}</p>
                    </aside>
                  )}

                  <article 
                    className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-table:border prose-th:bg-muted prose-th:p-2 prose-td:p-2 prose-td:border"
                    dangerouslySetInnerHTML={{ __html: generatedContent.content }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="html" className="mt-4">
                <div className="relative">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute top-2 right-2 z-10"
                    onClick={() => handleCopyContent('html')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[600px] text-xs">
                    <code>{generatedContent.content}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="meta" className="mt-4 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Meta Title</Label>
                    <p className="font-medium p-2 bg-muted rounded">{generatedContent.title}</p>
                    <span className={`text-xs ${generatedContent.title.length > 60 ? 'text-red-500' : 'text-green-600'}`}>
                      {generatedContent.title.length}/60 characters
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Meta Description</Label>
                    <p className="p-2 bg-muted rounded text-sm">{generatedContent.metaDescription}</p>
                    <span className={`text-xs ${generatedContent.metaDescription.length > 155 ? 'text-red-500' : 'text-green-600'}`}>
                      {generatedContent.metaDescription.length}/155 characters
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Excerpt</Label>
                  <p className="text-sm p-2 bg-muted rounded">{generatedContent.excerpt}</p>
                </div>

                {generatedContent.schemaMarkup && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Schema Markup (JSON-LD)</Label>
                    <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                      {JSON.stringify(generatedContent.schemaMarkup, null, 2)}
                    </pre>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="faqs" className="mt-4">
                {generatedContent.faqs && generatedContent.faqs.length > 0 ? (
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
                {generatedContent.tableOfContents && generatedContent.tableOfContents.length > 0 ? (
                  <nav className="space-y-1">
                    {generatedContent.tableOfContents.map((item, i) => (
                      <div 
                        key={i} 
                        className={`py-1 ${item.level === 3 ? 'ml-4' : ''}`}
                      >
                        <a 
                          href={`#${item.id}`} 
                          className="text-primary hover:underline flex items-center gap-2"
                        >
                          <span className="text-xs text-muted-foreground">H{item.level}</span>
                          {item.title}
                        </a>
                      </div>
                    ))}
                  </nav>
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
