-- Drop overly permissive policies on share_counts and replace with more controlled ones
DROP POLICY IF EXISTS "Anyone can insert share counts" ON public.share_counts;
DROP POLICY IF EXISTS "Anyone can update share counts" ON public.share_counts;

-- Use a function to handle share count increments (prevents arbitrary updates)
CREATE OR REPLACE FUNCTION public.increment_share_count(
  _post_id UUID,
  _platform TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert or update share count for the post
  INSERT INTO public.share_counts (post_id, twitter_count, facebook_count, linkedin_count, copy_link_count)
  VALUES (_post_id, 
    CASE WHEN _platform = 'twitter' THEN 1 ELSE 0 END,
    CASE WHEN _platform = 'facebook' THEN 1 ELSE 0 END,
    CASE WHEN _platform = 'linkedin' THEN 1 ELSE 0 END,
    CASE WHEN _platform = 'copy_link' THEN 1 ELSE 0 END
  )
  ON CONFLICT (post_id) DO UPDATE SET
    twitter_count = share_counts.twitter_count + CASE WHEN _platform = 'twitter' THEN 1 ELSE 0 END,
    facebook_count = share_counts.facebook_count + CASE WHEN _platform = 'facebook' THEN 1 ELSE 0 END,
    linkedin_count = share_counts.linkedin_count + CASE WHEN _platform = 'linkedin' THEN 1 ELSE 0 END,
    copy_link_count = share_counts.copy_link_count + CASE WHEN _platform = 'copy_link' THEN 1 ELSE 0 END,
    updated_at = now();
END;
$$;

-- Subscribers: Make insert require valid email format (basic protection)
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.subscribers;

CREATE POLICY "Valid email can subscribe" ON public.subscribers
  FOR INSERT WITH CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');