import { useState } from "react";
import { useComments, useCreateComment, useDeleteComment } from "@/hooks/useComments";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Trash2, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection = ({ postId }: CommentsSectionProps) => {
  const [content, setContent] = useState("");
  const { user } = useAuth();
  const { data: comments, isLoading } = useComments(postId);
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to leave a comment.",
      });
      return;
    }

    if (!content.trim()) return;

    createComment.mutate(
      { postId, content: content.trim(), userId: user.id },
      {
        onSuccess: () => {
          setContent("");
          toast({
            title: "Comment posted!",
            description: "Your comment has been added.",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to post comment. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDelete = (commentId: string) => {
    deleteComment.mutate(
      { id: commentId, postId },
      {
        onSuccess: () => {
          toast({
            title: "Comment deleted",
            description: "Your comment has been removed.",
          });
        },
      }
    );
  };

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="font-heading text-2xl font-semibold text-heading mb-6 flex items-center gap-2">
        <MessageSquare className="h-6 w-6" />
        Comments {comments?.length ? `(${comments.length})` : ""}
      </h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={user ? "Share your thoughts..." : "Sign in to leave a comment"}
          className="mb-4 min-h-[100px]"
          disabled={!user}
        />
        <Button
          type="submit"
          disabled={!user || !content.trim() || createComment.isPending}
        >
          {createComment.isPending ? "Posting..." : "Post Comment"}
        </Button>
      </form>

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded w-1/4 mb-2" />
              <div className="h-16 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : comments?.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-6">
          {comments?.map((comment: any) => (
            <div key={comment.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {comment.user?.display_name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {comment.user?.display_name || "Anonymous"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(comment.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
                {user?.id === comment.user_id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(comment.id)}
                    disabled={deleteComment.isPending}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-foreground pl-13">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CommentsSection;
