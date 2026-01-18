import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subDays, format } from "date-fns";

export const useTrackPageView = () => {
  return useMutation({
    mutationFn: async ({ postId, pagePath }: { postId?: string; pagePath: string }) => {
      const { error } = await supabase
        .from("page_views")
        .insert({
          post_id: postId || null,
          page_path: pagePath,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
        });

      if (error) throw error;
    },
  });
};

export const usePageViewsStats = (days: number = 30) => {
  return useQuery({
    queryKey: ["page-views-stats", days],
    queryFn: async () => {
      const startDate = subDays(new Date(), days);
      
      const { data, error } = await supabase
        .from("page_views")
        .select("created_at, page_path, post_id")
        .gte("created_at", startDate.toISOString());

      if (error) throw error;

      // Group by date
      const viewsByDate = data.reduce((acc: Record<string, number>, view) => {
        const date = format(new Date(view.created_at), "MMM dd");
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      // Convert to chart format
      const chartData = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateKey = format(date, "MMM dd");
        chartData.push({
          date: dateKey,
          views: viewsByDate[dateKey] || 0,
        });
      }

      return {
        totalViews: data.length,
        chartData,
        viewsByPath: data.reduce((acc: Record<string, number>, view) => {
          acc[view.page_path] = (acc[view.page_path] || 0) + 1;
          return acc;
        }, {}),
      };
    },
  });
};

export const usePopularPosts = (limit: number = 10) => {
  return useQuery({
    queryKey: ["popular-posts", limit],
    queryFn: async () => {
      const { data: pageViews, error: viewsError } = await supabase
        .from("page_views")
        .select("post_id")
        .not("post_id", "is", null);

      if (viewsError) throw viewsError;

      // Count views per post
      const viewCounts = pageViews.reduce((acc: Record<string, number>, view) => {
        if (view.post_id) {
          acc[view.post_id] = (acc[view.post_id] || 0) + 1;
        }
        return acc;
      }, {});

      // Get top posts
      const topPostIds = Object.entries(viewCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([id]) => id);

      if (topPostIds.length === 0) return [];

      const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select("id, title, slug, status")
        .in("id", topPostIds);

      if (postsError) throw postsError;

      return posts.map((post) => ({
        ...post,
        views: viewCounts[post.id] || 0,
      })).sort((a, b) => b.views - a.views);
    },
  });
};

export const useSubscriberStats = (days: number = 30) => {
  return useQuery({
    queryKey: ["subscriber-stats", days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscribers")
        .select("created_at, is_verified");

      if (error) throw error;

      const totalSubscribers = data.length;
      const verifiedSubscribers = data.filter((s) => s.is_verified).length;

      // Group by date for chart
      const subscribersByDate = data.reduce((acc: Record<string, number>, sub) => {
        const date = format(new Date(sub.created_at), "MMM dd");
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      // Convert to chart format (cumulative)
      const chartData = [];
      let cumulative = 0;
      for (let i = days - 1; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateKey = format(date, "MMM dd");
        cumulative += subscribersByDate[dateKey] || 0;
        chartData.push({
          date: dateKey,
          subscribers: cumulative,
        });
      }

      // Get recent growth
      const thirtyDaysAgo = subDays(new Date(), 30);
      const recentSubscribers = data.filter(
        (s) => new Date(s.created_at) >= thirtyDaysAgo
      ).length;

      return {
        totalSubscribers,
        verifiedSubscribers,
        recentGrowth: recentSubscribers,
        chartData,
      };
    },
  });
};
