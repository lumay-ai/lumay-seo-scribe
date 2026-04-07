import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePostById, useCreatePost, useUpdatePost } from "@/hooks/usePosts";
import { useCategories } from "@/hooks/useCategories";
import { useTags, usePostTags, useUpdatePostTags } from "@/hooks/useTags";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ImageUpload from "@/components/admin/ImageUpload";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, Eye, ArrowLeft, X, Link2, FileText, Code, Upload, RefreshCw } from "lucide-react";
import InternalLinking from "@/components/admin/InternalLinking";
import { Link } from "react-router-dom";

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;

  const { data: post, isLoading: postLoading } = usePostById(id || "");
  const { data: categories } = useCategories();
  const { data: allTags } = useTags();
  const { data: postTags } = usePostTags(id || "");

  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const updatePostTags = useUpdatePostTags();

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [customSlug, setCustomSlug] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [featuredImageAlt, setFeaturedImageAlt] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft");
  const [readingTime, setReadingTime] = useState(5);

  // SEO fields
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [robots, setRobots] = useState("index, follow");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");

  // Schema markup
  const [schemaMarkup, setSchemaMarkup] = useState("");
  const [schemaError, setSchemaError] = useState("");

  // Google Docs import
  const [googleDocsUrl, setGoogleDocsUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load post data
  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setSlug(post.slug || "");
      setCustomSlug(true); // existing post always has custom slug
      setExcerpt(post.excerpt || "");
      setContent(post.content || "");
      setFeaturedImage(post.featured_image_url || "");
      setFeaturedImageAlt(post.featured_image_alt || "");
      setCategoryId(post.category_id || "");
      setStatus(post.status as any);
      setReadingTime(post.reading_time || 5);
      setSeoTitle(post.seo_title || "");
      setSeoDescription(post.seo_description || "");
      setCanonicalUrl(post.canonical_url || "");
      setRobots(post.robots || "index, follow");
      setOgTitle(post.og_title || "");
      setOgDescription(post.og_description || "");
      setOgImage(post.og_image || "");
      if (post.schema_markup) {
        setSchemaMarkup(JSON.stringify(post.schema_markup, null, 2));
      }
    }
  }, [post]);

  // Load post tags
  useEffect(() => {
    if (postTags) {
      setSelectedTags(postTags.map((pt: any) => pt.tag_id));
    }
  }, [postTags]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!customSlug && title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  }, [title, customSlug]);

  // Calculate reading time
  useEffect(() => {
    const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    setReadingTime(Math.max(1, Math.ceil(wordCount / 200)));
  }, [content]);

  // Validate schema JSON
  const validateSchema = (value: string) => {
    setSchemaMarkup(value);
    if (!value.trim()) {
      setSchemaError("");
      return;
    }
    try {
      JSON.parse(value);
      setSchemaError("");
    } catch {
      setSchemaError("Invalid JSON format");
    }
  };

  // Generate default schema
  const generateDefaultSchema = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title || "Article Title",
      description: seoDescription || excerpt || "",
      image: featuredImage || ogImage || "",
      author: {
        "@type": "Person",
        name: "Lumay AI"
      },
      publisher: {
        "@type": "Organization",
        name: "Lumay AI",
        logo: {
          "@type": "ImageObject",
          url: "https://lumay.42web.io/logo.png"
        }
      },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://lumay.42web.io/blog/${slug}`
      }
    };
    setSchemaMarkup(JSON.stringify(schema, null, 2));
    setSchemaError("");
    toast({ title: "Schema generated", description: "Default Article schema has been added." });
  };

  // Import from Google Docs (published HTML)
  const handleGoogleDocsImport = async () => {
    if (!googleDocsUrl.trim()) {
      toast({ title: "URL required", description: "Please enter a Google Docs published URL.", variant: "destructive" });
      return;
    }

    setIsImporting(true);
    try {
      // Google Docs publish URL format: https://docs.google.com/document/d/e/XXXXX/pub
      const url = googleDocsUrl.includes("/pub") ? googleDocsUrl : googleDocsUrl.replace(/\/edit.*$/, "/pub");
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch document");
      
      const html = await response.text();
      
      // Extract body content
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (!bodyMatch) throw new Error("Could not parse document");
      
      let docContent = bodyMatch[1];
      // Clean up Google Docs HTML
      docContent = docContent
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/class="[^"]*"/gi, "")
        .replace(/style="[^"]*"/gi, "")
        .replace(/id="[^"]*"/gi, "")
        .replace(/<span>\s*<\/span>/gi, "")
        .replace(/<p>\s*<\/p>/gi, "")
        .replace(/\s+/g, " ")
        .trim();

      setContent(docContent);
      setGoogleDocsUrl("");
      toast({ title: "Imported!", description: "Google Docs content has been imported successfully." });
    } catch (error: any) {
      toast({
        title: "Import failed",
        description: "Make sure the Google Doc is published to the web (File → Share → Publish to web).",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Import from HTML/DOCX file
  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith(".html") || file.name.endsWith(".htm")) {
      const text = await file.text();
      const bodyMatch = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      setContent(bodyMatch ? bodyMatch[1] : text);
      toast({ title: "HTML imported!", description: `Loaded content from ${file.name}` });
    } else if (file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      const text = await file.text();
      // Convert markdown-like text to basic HTML
      const html = text
        .split("\n\n")
        .map(para => {
          if (para.startsWith("# ")) return `<h1>${para.slice(2)}</h1>`;
          if (para.startsWith("## ")) return `<h2>${para.slice(3)}</h2>`;
          if (para.startsWith("### ")) return `<h3>${para.slice(4)}</h3>`;
          return `<p>${para.replace(/\n/g, "<br/>")}</p>`;
        })
        .join("\n");
      setContent(html);
      toast({ title: "Content imported!", description: `Loaded content from ${file.name}` });
    } else {
      toast({ title: "Unsupported format", description: "Please use .html, .htm, .txt, or .md files.", variant: "destructive" });
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async (publishNow = false) => {
    if (!title.trim()) {
      toast({ title: "Title required", description: "Please enter a title for your post.", variant: "destructive" });
      return;
    }

    if (!slug.trim()) {
      toast({ title: "Slug required", description: "Please enter a URL slug for your post.", variant: "destructive" });
      return;
    }

    // Validate schema if provided
    let parsedSchema = null;
    if (schemaMarkup.trim()) {
      try {
        parsedSchema = JSON.parse(schemaMarkup);
      } catch {
        toast({ title: "Invalid Schema", description: "Please fix the JSON schema markup before saving.", variant: "destructive" });
        return;
      }
    }

    const postData = {
      title,
      slug,
      excerpt,
      content,
      featured_image_url: featuredImage || null,
      featured_image_alt: featuredImageAlt || null,
      category_id: categoryId || null,
      status: publishNow ? "published" as const : status,
      reading_time: readingTime,
      seo_title: seoTitle || null,
      seo_description: seoDescription || null,
      canonical_url: canonicalUrl || `https://lumay.42web.io/blog/${slug}`,
      robots,
      og_title: ogTitle || null,
      og_description: ogDescription || null,
      og_image: ogImage || featuredImage || null,
      schema_markup: parsedSchema,
      published_at: publishNow ? new Date().toISOString() : post?.published_at || null,
      author_id: user?.id,
    };

    try {
      if (isEditing) {
        await updatePost.mutateAsync({ id, ...postData });
        await updatePostTags.mutateAsync({ postId: id, tagIds: selectedTags });
        toast({
          title: publishNow ? "Post published!" : "Post updated!",
          description: publishNow ? "Your post is now live." : "Your changes have been saved.",
        });
      } else {
        const newPost = await createPost.mutateAsync(postData);
        if (selectedTags.length > 0) {
          await updatePostTags.mutateAsync({ postId: newPost.id, tagIds: selectedTags });
        }
        toast({
          title: publishNow ? "Post published!" : "Post created!",
          description: publishNow ? "Your post is now live." : "Your draft has been saved.",
        });
        navigate(`/admin/posts/${newPost.id}`);
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to save post.", variant: "destructive" });
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const isSaving = createPost.isPending || updatePost.isPending;

  if (isEditing && postLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin/posts">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="font-heading text-xl font-semibold text-heading">
              {isEditing ? "Edit Post" : "New Post"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => handleSave(false)} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={() => handleSave(true)} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Eye className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter post title..."
                    className="text-lg font-medium"
                  />
                </div>

                {/* Custom URL Slug */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slug" className="flex items-center gap-2">
                      <Link2 className="h-4 w-4" />
                      URL Slug
                    </Label>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="custom-slug" className="text-xs text-muted-foreground">Custom</Label>
                      <Switch
                        id="custom-slug"
                        checked={customSlug}
                        onCheckedChange={(checked) => {
                          setCustomSlug(checked);
                          if (!checked && title) {
                            setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-muted/50 rounded-md p-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">lumay.42web.io/blog/</span>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => {
                        setCustomSlug(true);
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                      }}
                      placeholder="post-url-slug"
                      className="border-0 bg-transparent focus-visible:ring-0 p-0 h-auto"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Full URL: https://lumay.42web.io/blog/{slug || "your-post-slug"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief summary of the post..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Import Content */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Import Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Google Docs Import */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Google Docs (Published URL)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={googleDocsUrl}
                      onChange={(e) => setGoogleDocsUrl(e.target.value)}
                      placeholder="https://docs.google.com/document/d/e/.../pub"
                    />
                    <Button
                      variant="outline"
                      onClick={handleGoogleDocsImport}
                      disabled={isImporting}
                    >
                      {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Publish your Google Doc first: File → Share → Publish to web
                  </p>
                </div>

                {/* File Import */}
                <div className="space-y-2">
                  <Label>Upload File (.html, .txt, .md)</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".html,.htm,.txt,.md"
                    onChange={handleFileImport}
                    className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Content</CardTitle>
              </CardHeader>
              <CardContent>
                <RichTextEditor content={content} onChange={setContent} />
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">SEO Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="meta" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="meta">Meta Tags</TabsTrigger>
                    <TabsTrigger value="social">Social</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    <TabsTrigger value="schema">Schema</TabsTrigger>
                  </TabsList>

                  <TabsContent value="meta" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>SEO Title</Label>
                      <Input
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        placeholder={title || "Page title for search engines"}
                      />
                      <p className="text-xs text-muted-foreground">
                        {(seoTitle || title).length}/60 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Meta Description</Label>
                      <Textarea
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        placeholder={excerpt || "Description for search engines"}
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground">
                        {(seoDescription || excerpt).length}/160 characters
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="social" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>OG Title</Label>
                      <Input
                        value={ogTitle}
                        onChange={(e) => setOgTitle(e.target.value)}
                        placeholder={seoTitle || title || "Social share title"}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>OG Description</Label>
                      <Textarea
                        value={ogDescription}
                        onChange={(e) => setOgDescription(e.target.value)}
                        placeholder={seoDescription || excerpt || "Social share description"}
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>OG Image URL</Label>
                      <Input
                        value={ogImage}
                        onChange={(e) => setOgImage(e.target.value)}
                        placeholder={featuredImage || "https://..."}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Canonical URL</Label>
                      <Input
                        value={canonicalUrl}
                        onChange={(e) => setCanonicalUrl(e.target.value)}
                        placeholder={`https://lumay.42web.io/blog/${slug}`}
                      />
                      <p className="text-xs text-muted-foreground">
                        Leave empty to auto-generate from slug
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Robots Meta</Label>
                      <Select value={robots} onValueChange={setRobots}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="index, follow">Index, Follow</SelectItem>
                          <SelectItem value="noindex, follow">No Index, Follow</SelectItem>
                          <SelectItem value="index, nofollow">Index, No Follow</SelectItem>
                          <SelectItem value="noindex, nofollow">No Index, No Follow</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  {/* Custom Schema Markup */}
                  <TabsContent value="schema" className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        JSON-LD Schema Markup
                      </Label>
                      <Button variant="outline" size="sm" onClick={generateDefaultSchema}>
                        Generate Default
                      </Button>
                    </div>
                    <Textarea
                      value={schemaMarkup}
                      onChange={(e) => validateSchema(e.target.value)}
                      placeholder='{"@context":"https://schema.org","@type":"Article",...}'
                      rows={12}
                      className="font-mono text-xs"
                    />
                    {schemaError && (
                      <p className="text-xs text-destructive">{schemaError}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Add custom structured data (JSON-LD). Supports Article, FAQ, HowTo, Product, and more.
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Featured Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUpload
                  value={featuredImage}
                  onChange={setFeaturedImage}
                  onRemove={() => setFeaturedImage("")}
                  folder="featured"
                />
                {featuredImage && (
                  <div className="space-y-2">
                    <Label>Alt Text</Label>
                    <Input
                      value={featuredImageAlt}
                      onChange={(e) => setFeaturedImageAlt(e.target.value)}
                      placeholder="Describe the image..."
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {allTags?.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag.id)}
                    >
                      {tag.name}
                      {selectedTags.includes(tag.id) && (
                        <X className="h-3 w-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>

                <div className="text-sm text-muted-foreground">
                  <p>Reading time: ~{readingTime} min</p>
                </div>
              </CardContent>
            </Card>

            <InternalLinking
              content={content}
              currentPostId={id}
              onInsertLink={(html) => {
                setContent((prev) => prev + html);
              }}
              onUpdateContent={(newContent) => {
                setContent(newContent);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
