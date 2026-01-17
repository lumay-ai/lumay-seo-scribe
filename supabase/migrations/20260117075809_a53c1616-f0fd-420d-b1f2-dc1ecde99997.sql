-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'author');

-- Create post status enum
CREATE TYPE public.post_status AS ENUM ('draft', 'published', 'archived');

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tags table
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Posts table with full SEO fields
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  featured_image_url TEXT,
  featured_image_alt TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  status post_status DEFAULT 'draft' NOT NULL,
  reading_time INTEGER DEFAULT 5,
  
  -- SEO fields
  seo_title TEXT,
  seo_description TEXT,
  canonical_url TEXT,
  robots TEXT DEFAULT 'index, follow',
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image TEXT,
  schema_markup JSONB,
  
  -- Timestamps
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Post tags junction table
CREATE TABLE public.post_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
  UNIQUE (post_id, tag_id)
);

-- Comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Subscribers table
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Bookmarks table
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, post_id)
);

-- Share tracking table
CREATE TABLE public.share_counts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL UNIQUE,
  twitter_count INTEGER DEFAULT 0,
  facebook_count INTEGER DEFAULT 0,
  linkedin_count INTEGER DEFAULT 0,
  copy_link_count INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.share_counts ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- Check if user is editor or admin
CREATE OR REPLACE FUNCTION public.is_editor_or_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin') OR public.has_role(_user_id, 'editor')
$$;

-- Check if user is author or higher
CREATE OR REPLACE FUNCTION public.is_author_or_higher(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin') 
      OR public.has_role(_user_id, 'editor')
      OR public.has_role(_user_id, 'author')
$$;

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS POLICIES

-- User Roles: Only admins can manage roles
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Profiles: Users can view all, update own
CREATE POLICY "Anyone can view profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Categories: Anyone can read, editors+ can manage
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Editors can manage categories" ON public.categories
  FOR ALL USING (public.is_editor_or_admin(auth.uid()));

-- Tags: Anyone can read, editors+ can manage
CREATE POLICY "Anyone can view tags" ON public.tags
  FOR SELECT USING (true);

CREATE POLICY "Editors can manage tags" ON public.tags
  FOR ALL USING (public.is_editor_or_admin(auth.uid()));

-- Posts: Public can read published, authors+ can manage own
CREATE POLICY "Anyone can view published posts" ON public.posts
  FOR SELECT USING (status = 'published' OR author_id = auth.uid() OR public.is_editor_or_admin(auth.uid()));

CREATE POLICY "Authors can create posts" ON public.posts
  FOR INSERT WITH CHECK (public.is_author_or_higher(auth.uid()) AND author_id = auth.uid());

CREATE POLICY "Authors can update own posts" ON public.posts
  FOR UPDATE USING (author_id = auth.uid() OR public.is_editor_or_admin(auth.uid()));

CREATE POLICY "Editors can delete posts" ON public.posts
  FOR DELETE USING (public.is_editor_or_admin(auth.uid()));

-- Post Tags: Follow post visibility
CREATE POLICY "Anyone can view post tags for published posts" ON public.post_tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.posts 
      WHERE posts.id = post_id 
      AND (posts.status = 'published' OR posts.author_id = auth.uid() OR public.is_editor_or_admin(auth.uid()))
    )
  );

CREATE POLICY "Editors can manage post tags" ON public.post_tags
  FOR ALL USING (public.is_editor_or_admin(auth.uid()));

CREATE POLICY "Authors can manage own post tags" ON public.post_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.posts 
      WHERE posts.id = post_id AND posts.author_id = auth.uid()
    )
  );

-- Comments: Anyone can read on published posts
CREATE POLICY "Anyone can view comments on published posts" ON public.comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.posts 
      WHERE posts.id = post_id AND posts.status = 'published'
    ) OR public.is_admin(auth.uid())
  );

CREATE POLICY "Authenticated users can comment" ON public.comments
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL 
    AND user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.posts 
      WHERE posts.id = post_id AND posts.status = 'published'
    )
  );

CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own comments or admins" ON public.comments
  FOR DELETE USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- Subscribers: Anyone can subscribe, admins can manage
CREATE POLICY "Anyone can subscribe" ON public.subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view subscribers" ON public.subscribers
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage subscribers" ON public.subscribers
  FOR ALL USING (public.is_admin(auth.uid()));

-- Bookmarks: Users manage their own
CREATE POLICY "Users can view own bookmarks" ON public.bookmarks
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create bookmarks" ON public.bookmarks
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users can delete own bookmarks" ON public.bookmarks
  FOR DELETE USING (user_id = auth.uid());

-- Share counts: Anyone can read, system can update
CREATE POLICY "Anyone can view share counts" ON public.share_counts
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert share counts" ON public.share_counts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update share counts" ON public.share_counts
  FOR UPDATE USING (true);

-- Create storage bucket for blog media
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-media', 'blog-media', true);

-- Storage policies for blog media
CREATE POLICY "Anyone can view blog media" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-media');

CREATE POLICY "Authenticated users can upload blog media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'blog-media' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own uploads" ON storage.objects
  FOR UPDATE USING (bucket_id = 'blog-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own uploads" ON storage.objects
  FOR DELETE USING (bucket_id = 'blog-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Insert default categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('SEO', 'seo', 'Search engine optimization tips and strategies'),
  ('Content', 'content', 'Content creation and marketing insights'),
  ('Marketing', 'marketing', 'Digital marketing strategies'),
  ('Technology', 'technology', 'Tech news and tutorials');

-- Insert default tags
INSERT INTO public.tags (name, slug) VALUES
  ('SEO', 'seo'),
  ('Content Strategy', 'content-strategy'),
  ('Digital Marketing', 'digital-marketing'),
  ('Technical SEO', 'technical-seo'),
  ('E-E-A-T', 'eeat'),
  ('Link Building', 'link-building'),
  ('Blogging', 'blogging');

-- Full text search index on posts
CREATE INDEX posts_search_idx ON public.posts 
  USING GIN (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content, '')));

-- Index for faster slug lookups
CREATE INDEX posts_slug_idx ON public.posts (slug);
CREATE INDEX posts_status_idx ON public.posts (status);
CREATE INDEX categories_slug_idx ON public.categories (slug);
CREATE INDEX tags_slug_idx ON public.tags (slug);