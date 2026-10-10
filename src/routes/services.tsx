import { createFileRoute } from "@tanstack/react-router";
import { Page, Eyebrow, CTA } from "@/components/site/SiteShell";
import { ServicesList } from "@/components/site/ServicesList";
import { ContentLoading } from "@/components/site/ContentLoading";
import { getPublishedServices } from "@/lib/cms";
export const Route = createFileRoute("/services")({
  loader: () => getPublishedServices(),
  pendingComponent: ContentLoading,
  head: () => ({
    meta: [
      { title: "Services — CYTIC CREATIVES" },
      {
        name: "description",
        content:
          "Digital products, digital presence, brand development, and brand applications from CYTIC CREATIVES.",
      },
      { property: "og:title", content: "Services — CYTIC CREATIVES" },
      {
        property: "og:description",
        content: "Digital products, digital presence, brand development, and brand applications.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});
function Services() {
  const services = Route.useLoaderData();
  return (
    <Page>
      <section className="services-directory bg-navy text-cream">
        <div className="site-container pb-28">
          <div className="services-directory-heading">
            <div>
              <Eyebrow light>What we offer</Eyebrow>
              <h2 className="display-md">Expertise for every stage.</h2>
            </div>
            <p>
              A considered set of services to shape your digital presence, strengthen your brand,
              and bring new ideas to life.
            </p>
          </div>
          <ServicesList services={services} alwaysOpen showDescriptions={false} />
        </div>
      </section>
      <section className="cream-section">
        <div className="site-container grid gap-12 py-24 lg:grid-cols-2">
          <Eyebrow>Connected capability</Eyebrow>
          <div>
            <h2 className="display-md">From product to presence.</h2>
            <p className="statement-copy">
              CYTIC CREATIVES connects digital products, design systems, and branded touchpoints
              into one consistent experience.
            </p>
          </div>
        </div>
      </section>
      <CTA />
    </Page>
  );
}
