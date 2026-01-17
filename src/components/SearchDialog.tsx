import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchPosts } from "@/hooks/usePosts";
import { useCategories } from "@/hooks/useCategories";
import { useTags } from "@/hooks/useTags";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const SearchDialog = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [tagFilter, setTagFilter] = useState<string | undefined>();
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: posts, isLoading } = useSearchPosts(debouncedQuery, categoryFilter, tagFilter);
  const { data: categories } = useCategories();
  const { data: tags } = useTags();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handlePostClick = (slug: string) => {
    setOpen(false);
    navigate(`/blog/${slug}`);
  };

  const clearFilters = () => {
    setQuery("");
    setCategoryFilter(undefined);
    setTagFilter(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Search className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-heading">Search Articles</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, content..."
              className="pl-10 pr-10"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground py-1">Categories:</span>
            {categories?.map((category) => (
              <Badge
                key={category.id}
                variant={categoryFilter === category.slug ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() =>
                  setCategoryFilter(
                    categoryFilter === category.slug ? undefined : category.slug
                  )
                }
              >
                {category.name}
              </Badge>
            ))}
          </div>

          {/* Tag Filters */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground py-1">Tags:</span>
            {tags?.slice(0, 6).map((tag) => (
              <Badge
                key={tag.id}
                variant={tagFilter === tag.slug ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() =>
                  setTagFilter(tagFilter === tag.slug ? undefined : tag.slug)
                }
              >
                {tag.name}
              </Badge>
            ))}
          </div>

          {(categoryFilter || tagFilter || query) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto mt-4 -mx-6 px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : posts?.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No articles found. Try a different search term.
            </p>
          ) : (
            <div className="space-y-2">
              {posts?.map((post: any) => (
                <button
                  key={post.id}
                  onClick={() => handlePostClick(post.slug)}
                  className="w-full text-left p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {post.category && (
                      <Badge variant="secondary" className="text-xs">
                        {post.category.name}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {post.reading_time} min read
                    </span>
                  </div>
                  <h3 className="font-medium text-foreground line-clamp-1">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {post.excerpt}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground text-center pt-4 border-t">
          Press <kbd className="px-1.5 py-0.5 bg-muted rounded">⌘K</kbd> to search
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
