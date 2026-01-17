import { Link } from "react-router-dom";
import { usePosts, useDeletePost } from "@/hooks/usePosts";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PostsList = () => {
  const { data: posts, isLoading } = usePosts();
  const deletePost = useDeletePost();

  const handleDelete = (id: string, title: string) => {
    deletePost.mutate(id, {
      onSuccess: () => {
        toast({
          title: "Post deleted",
          description: `"${title}" has been deleted.`,
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Failed to delete post.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-heading">Posts</h1>
          <p className="text-muted-foreground mt-1">
            Manage your blog posts
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/posts/new">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : posts?.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <h3 className="text-lg font-medium text-foreground mb-2">No posts yet</h3>
          <p className="text-muted-foreground mb-4">Create your first blog post to get started.</p>
          <Button asChild>
            <Link to="/admin/posts/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Link>
          </Button>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                  Title
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground hidden md:table-cell">
                  Category
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground hidden lg:table-cell">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground hidden lg:table-cell">
                  Date
                </th>
                <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts?.map((post: any) => (
                <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground line-clamp-1">
                        {post.title}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1 md:hidden">
                        {post.category?.name || "Uncategorized"}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {post.category?.name || "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        post.status === "published"
                          ? "bg-green-100 text-green-700"
                          : post.status === "archived"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground hidden lg:table-cell">
                    {format(new Date(post.created_at), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {post.status === "published" && (
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/blog/${post.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/posts/${post.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete post?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{post.title}". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(post.id, post.title)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PostsList;
