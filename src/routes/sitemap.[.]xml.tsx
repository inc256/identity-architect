import { createFileRoute } from "@tanstack/react-router";
import { getPublishedBlogPosts, getPublishedProjects, getWebsiteSettings } from "@/lib/cms";

const xmlEscape = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const Route = createFileRoute("/sitemap/.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const [projects, posts, settings] = await Promise.all([
          getPublishedProjects(),
          getPublishedBlogPosts(),
          getWebsiteSettings(),
        ]);
        const origin = new URL(request.url).origin;
        const paths = [
          "",
          "work",
          "services",
          "process",
          "about",
          "contact",
          "blog",
          ...(settings.show_quote === false ? [] : ["quote"]),
          "privacy",
          "terms",
          ...projects.map((project) => `work/${encodeURIComponent(project.slug)}`),
          ...posts.map((post) => `blog/${encodeURIComponent(post.slug)}`),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${xmlEscape(`${origin}/${path}`)}</loc></url>`).join("")}</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
      },
    },
  },
});
