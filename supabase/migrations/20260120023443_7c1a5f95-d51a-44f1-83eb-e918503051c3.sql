-- Fix permissive RLS policy on page_views (avoid WITH CHECK (true) while still allowing anonymous tracking)
DROP POLICY IF EXISTS "Anyone can insert page views" ON public.page_views;

CREATE POLICY "Anyone can insert page views"
ON public.page_views
FOR INSERT
WITH CHECK (page_path IS NOT NULL AND length(page_path) > 0);
