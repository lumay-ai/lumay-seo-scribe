import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useComments = (postId: string) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          user:profiles!comments_user_id_fkey(*)
        `)
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!postId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, content, userId }: { postId: string; content: string; userId: string }) => {
      const { data, error } = await supabase
        .from("comments")
        .insert({ post_id: postId, content, user_id: userId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, postId }: { id: string; postId: string }) => {
      const { error } = await supabase.from("comments").delete().eq("id", id);
      if (error) throw error;
      return postId;
    },
    onSuccess: (postId) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
};
