import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });
};

export const useTagBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["tag", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, slug }: { name: string; slug: string }) => {
      const { data, error } = await supabase
        .from("tags")
        .insert({ name, slug })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

export const usePostTags = (postId: string) => {
  return useQuery({
    queryKey: ["post-tags", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("post_tags")
        .select("*, tag:tags(*)")
        .eq("post_id", postId);

      if (error) throw error;
      return data;
    },
    enabled: !!postId,
  });
};

export const useUpdatePostTags = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, tagIds }: { postId: string; tagIds: string[] }) => {
      // Delete existing post tags
      await supabase.from("post_tags").delete().eq("post_id", postId);

      // Insert new post tags
      if (tagIds.length > 0) {
        const { error } = await supabase
          .from("post_tags")
          .insert(tagIds.map((tagId) => ({ post_id: postId, tag_id: tagId })));

        if (error) throw error;
      }
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["post-tags", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
