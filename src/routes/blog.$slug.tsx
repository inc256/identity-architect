import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Fragment, useState, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Page, Eyebrow } from "@/components/site/SiteShell";
import { ContentLoading } from "@/components/site/ContentLoading";
import { getPublishedBlogPost, getPublicImageUrl } from "@/lib/cms";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getPublishedBlogPost(params.slug);
    if (!post) throw notFound();
    return post;
  },
  pendingComponent: ContentLoading,
  head: ({ loaderData: post }) => {
    const title = post
      ? `${post.title} — CYTIC CREATIVES`
      : "Article unavailable — CYTIC CREATIVES";
    const description = post?.excerpt ?? "An article from CYTIC CREATIVES.";
    const cover = post?.image_path ? getPublicImageUrl("blog-images", post.image_path) : null;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        ...(cover ? [{ property: "og:image", content: cover }] : []),
        { name: "twitter:card", content: "summary_large_image" },
        ...(cover ? [{ name: "twitter:image", content: cover }] : []),
      ],
      links: [{ rel: "canonical", href: post ? `/blog/${post.slug}` : "/blog" }],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const post = Route.useLoaderData();
  const cover = post.image_path ? getPublicImageUrl("blog-images", post.image_path) : null;
  const [coverFailed, setCoverFailed] = useState(false);

  return (
    <Page>
      <article className="blog-detail-page">
        <div className="site-container">
          <Link to="/blog" className="blog-detail-back">
            <ArrowLeft aria-hidden="true" />
            Back to Journal
          </Link>
          <section className="blog-detail-card" aria-label={`${post.title} article details`}>
            <div className="blog-detail-visual">
              {cover && !coverFailed ? (
                <img
                  src={cover}
                  alt={post.title}
                  loading="eager"
                  decoding="async"
                  onError={() => setCoverFailed(true)}
                />
              ) : (
                <div
                  className="blog-cover-fallback"
                  role="img"
                  aria-label={`${post.title} article cover unavailable`}
                />
              )}
            </div>
            <div className="blog-detail-panel">
              <Eyebrow>{post.category || "Journal"}</Eyebrow>
              <h1 className="display-md">{post.title}</h1>
              {post.excerpt && <p className="blog-detail-excerpt">{post.excerpt}</p>}
              <div className="blog-detail-meta">
                {post.author && (
                  <div>
                    <span>Author</span>
                    <p>{post.author}</p>
                  </div>
                )}
                {post.publish_date && (
                  <div>
                    <span>Published</span>
                    <time dateTime={post.publish_date}>{formatPublishDate(post.publish_date)}</time>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
        <div className="article-body" aria-label="Article content">
          {renderArticleBody(post.body)}
        </div>
      </article>
    </Page>
  );
}

function formatPublishDate(value: string) {
  const date = new Date(`${value.slice(0, 10)}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(date);
}

function renderArticleBody(body: string) {
  return body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      const heading = block.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        const Heading = heading[1].length === 1 ? "h2" : "h3";
        return <Heading key={`heading-${index}`}>{heading[2]}</Heading>;
      }

      const standaloneImage = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (standaloneImage) {
        return (
          <ArticleImage
            key={`image-${index}`}
            alt={standaloneImage[1]}
            path={standaloneImage[2].trim()}
          />
        );
      }

      const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
      const content: ReactNode[] = [];
      let cursor = 0;

      for (const match of block.matchAll(imagePattern)) {
        const matchIndex = match.index ?? 0;
        if (matchIndex > cursor) content.push(block.slice(cursor, matchIndex));
        content.push(
          <InlineArticleImage
            key={`inline-image-${index}-${matchIndex}`}
            alt={match[1]}
            path={match[2].trim()}
          />,
        );
        cursor = matchIndex + match[0].length;
      }
      if (cursor < block.length) content.push(block.slice(cursor));

      return <p key={`paragraph-${index}`}>{content.length ? content : block}</p>;
    });
}

function ArticleImage({ alt, path }: { alt: string; path: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <figure className="article-image">
      <img
        src={getPublicImageUrl("blog-images", path)}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
      {alt && <figcaption>{alt}</figcaption>}
    </figure>
  );
}

function InlineArticleImage({ alt, path }: { alt: string; path: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <Fragment />;

  return (
    <img
      className="article-inline-image"
      src={getPublicImageUrl("blog-images", path)}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
