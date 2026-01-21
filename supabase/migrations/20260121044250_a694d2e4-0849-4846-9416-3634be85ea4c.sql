-- Add is_sponsored and is_trending columns to posts table
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS is_sponsored boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_trending boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_posts_is_sponsored ON public.posts(is_sponsored) WHERE is_sponsored = true;
CREATE INDEX IF NOT EXISTS idx_posts_is_trending ON public.posts(is_trending) WHERE is_trending = true;
CREATE INDEX IF NOT EXISTS idx_posts_view_count ON public.posts(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts(published_at DESC) WHERE status = 'published';