import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsBookmarked, useToggleBookmark } from "@/hooks/useBookmarks";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface BookmarkButtonProps {
  postId: string;
}

const BookmarkButton = ({ postId }: BookmarkButtonProps) => {
  const { user } = useAuth();
  const { data: isBookmarked, isLoading } = useIsBookmarked(postId);
  const toggleBookmark = useToggleBookmark();

  const handleClick = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to bookmark articles.",
      });
      return;
    }

    toggleBookmark.mutate(postId, {
      onSuccess: (bookmarked) => {
        toast({
          title: bookmarked ? "Bookmarked!" : "Removed from bookmarks",
          description: bookmarked
            ? "This article has been saved to your bookmarks."
            : "This article has been removed from your bookmarks.",
        });
      },
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isLoading || toggleBookmark.isPending}
      className="hover:bg-primary/10 hover:text-primary hover:border-primary"
    >
      {isBookmarked ? (
        <>
          <BookmarkCheck className="h-4 w-4 mr-2 text-primary" />
          Saved
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4 mr-2" />
          Bookmark
        </>
      )}
    </Button>
  );
};

export default BookmarkButton;
