import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { ContentLoading } from "@/components/site/ContentLoading";
import { Page, Eyebrow } from "@/components/site/SiteShell";
import { getPublishedBlogPosts, getPublicImageUrl } from "@/lib/cms";

export const Route = createFileRoute("/blog/")({
  loader: () => getPublishedBlogPosts(),
  pendingComponent: ContentLoading,
  head: () => ({
    meta: [
      { title: "Journal — CYTIC CREATIVES" },
      { name: "description", content: "Ideas, perspectives, and updates from CYTIC CREATIVES." },
      { property: "og:title", content: "Journal — CYTIC CREATIVES" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const posts = Route.useLoaderData();
  return (
    <Page>
      <section className="page-intro">
        <div className="site-container">
          <Eyebrow>Journal</Eyebrow>
          <h1 className="display-xl">Ideas in motion.</h1>
          <p>Perspectives and updates from the CYTIC team.</p>
        </div>
      </section>
      <section className="site-container pb-28">
        {posts.length === 0 ? (
          <p className="empty-state">
            No public articles are available yet. Make sure an article is marked Published and
            public read access is enabled.
          </p>
        ) : (
          <div className="blog-grid">
            {posts.map((post) => {
              const cover = post.image_path
                ? getPublicImageUrl("blog-images", post.image_path)
                : null;
              return (
                <article className="blog-card" key={post.id}>
                  <Link to="/blog/$slug" params={{ slug: post.slug }} className="blog-card-link">
                    <BlogCover src={cover} alt={post.title} />
                    <div className="blog-card-meta">
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        {post.category && <span>{post.category}</span>}
                        {post.publish_date && (
                          <time dateTime={post.publish_date}>{post.publish_date}</time>
                        )}
                      </div>
                      <h2>{post.title}</h2>
                      {post.excerpt && <p>{post.excerpt}</p>}
                      {post.author && <span className="blog-byline">{post.author}</span>}
                      <span className="arrow-link">
                        Read article <ArrowUpRight />
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </Page>
  );
}

function BlogCover({ src, alt }: { src: string | null; alt: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="blog-cover">
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 768px) 100vw, 50vw"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="blog-cover-fallback" aria-hidden="true" />
      )}
    </div>
  );
}
