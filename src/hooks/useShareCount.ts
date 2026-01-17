import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useShareCount = (postId: string) => {
  return useQuery({
    queryKey: ["share-count", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("share_counts")
        .select("*")
        .eq("post_id", postId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!postId,
  });
};

export const useIncrementShare = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, platform }: { postId: string; platform: "twitter" | "facebook" | "linkedin" | "copy_link" }) => {
      const { error } = await supabase.rpc("increment_share_count", {
        _post_id: postId,
        _platform: platform,
      });

      if (error) throw error;
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["share-count", postId] });
    },
  });
};
