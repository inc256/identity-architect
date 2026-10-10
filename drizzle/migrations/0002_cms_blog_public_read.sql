ALTER TABLE public.cms_blog_posts ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON TABLE public.cms_blog_posts TO anon, authenticated;

DROP POLICY IF EXISTS "public_can_read_published_blog_posts" ON public.cms_blog_posts;
CREATE POLICY "public_can_read_published_blog_posts"
ON public.cms_blog_posts
FOR SELECT
TO anon, authenticated
USING (status = 'Published');
