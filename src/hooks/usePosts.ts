import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Post = Tables<"posts">;
export type PostInsert = TablesInsert<"posts">;
export type PostUpdate = TablesUpdate<"posts">;

export const usePosts = (status?: "published" | "draft" | "archived") => {
  return useQuery({
    queryKey: ["posts", status],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select(`
          *,
          category:categories(*)
        `)
        .order("created_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch author profiles separately if needed
      if (data && data.length > 0) {
        const authorIds = [...new Set(data.map(p => p.author_id).filter(Boolean))];
        if (authorIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("*")
            .in("user_id", authorIds);

          const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
          
          return data.map(post => ({
            ...post,
            author: post.author_id ? profileMap.get(post.author_id) || null : null,
          }));
        }
      }

      return data;
    },
  });
};

export const usePost = (slug: string) => {
  return useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          category:categories(*),
          post_tags(
            tag:tags(*)
          )
        `)
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;

      // Fetch author profile separately
      if (data?.author_id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", data.author_id)
          .maybeSingle();
        
        return { ...data, author: profile };
      }

      return data;
    },
    enabled: !!slug,
  });
};

export const usePostById = (id: string) => {
  return useQuery({
    queryKey: ["post-id", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          category:categories(*),
          post_tags(
            tag:tags(*)
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;

      // Fetch author profile separately
      if (data?.author_id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", data.author_id)
          .maybeSingle();
        
        return { ...data, author: profile };
      }

      return data;
    },
    enabled: !!id,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: PostInsert) => {
      const { data, error } = await supabase
        .from("posts")
        .insert(post)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: PostUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("posts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", data.slug] });
      queryClient.invalidateQueries({ queryKey: ["post-id", data.id] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useSearchPosts = (query: string, categorySlug?: string, tagSlug?: string) => {
  return useQuery({
    queryKey: ["search-posts", query, categorySlug, tagSlug],
    queryFn: async () => {
      let dbQuery = supabase
        .from("posts")
        .select(`
          *,
          category:categories(*),
          post_tags(
            tag:tags(*)
          )
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (query) {
        dbQuery = dbQuery.or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`);
      }

      if (categorySlug) {
        const { data: category } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", categorySlug)
          .single();
        
        if (category) {
          dbQuery = dbQuery.eq("category_id", category.id);
        }
      }

      const { data, error } = await dbQuery;
      if (error) throw error;

      // Filter by tag if specified
      if (tagSlug && data) {
        return data.filter((post: any) => 
          post.post_tags?.some((pt: any) => pt.tag?.slug === tagSlug)
        );
      }

      return data;
    },
    enabled: true,
  });
};
