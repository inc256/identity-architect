import { createFileRoute } from "@tanstack/react-router";
import { Page, Eyebrow, CTA } from "@/components/site/SiteShell";
import { ContentLoading } from "@/components/site/ContentLoading";
import { ProjectGrid } from "@/components/site/ProjectGrid";
import { getPublishedProjects } from "@/lib/cms";
export const Route = createFileRoute("/work/")({
  loader: () => getPublishedProjects(),
  pendingComponent: ContentLoading,
  head: () => ({
    meta: [
      { title: "Selected Work — CYTIC CREATIVES" },
      {
        name: "description",
        content: "Explore digital products and brand experiences by CYTIC CREATIVES.",
      },
      { property: "og:title", content: "Selected Work — CYTIC CREATIVES" },
      {
        property: "og:description",
        content: "Digital product and brand systems by CYTIC CREATIVES.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/work" }],
  }),
  component: Work,
});
function Work() {
  const projects = Route.useLoaderData();
  return (
    <Page>
      <section className="page-intro">
        <div className="site-container">
          <Eyebrow>Work</Eyebrow>
          <h1 className="display-xl">Built to be recognized.</h1>
          <p>Explore published CYTIC projects and the thinking behind the work.</p>
        </div>
      </section>
      <section>
        <div className="site-container pb-16 lg:pb-20">
          <ProjectGrid projects={projects} all />
        </div>
      </section>
      <CTA />
    </Page>
  );
}
