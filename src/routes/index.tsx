import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import heroImage from "@/assets/cytic-hero.png";
import logoMark from "@/assets/CYTIC_Logo_512p.png";
import { businessAddress } from "@/data/site";
import { Button } from "@/components/ui/button";
import { ArrowLink, CTA, Eyebrow, Page } from "@/components/site/SiteShell";
import { ContentLoading } from "@/components/site/ContentLoading";
import { getPublishedServices } from "@/lib/cms";
import { useWebsiteSettings } from "@/lib/website-settings";

export const Route = createFileRoute("/")({
  loader: () => getPublishedServices(),
  pendingComponent: ContentLoading,
  head: () => ({
    meta: [
      { title: "CYTIC CREATIVES | Digital products and brands." },
      {
        name: "description",
        content:
          "CYTIC CREATIVES is a subsidiary of Namielus Group Limited, creating digital products, digital experiences, and distinctive brands.",
      },
      { property: "og:title", content: "CYTIC CREATIVES | Digital products and brands." },
      {
        property: "og:description",
        content: "Digital products, digital presence, brand development, and brand applications.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "CYTIC CREATIVES",
          description:
            "Digital products, digital presence, brand development, and brand applications.",
          parentOrganization: { "@type": "Organization", name: "Namielus Group Limited" },
          address: {
            "@type": "PostalAddress",
            streetAddress: "Afri Courts, 69 Buganda Rd",
            addressLocality: "Kampala",
            addressCountry: "UG",
          },
          location: {
            "@type": "Place",
            name: businessAddress,
          },
        }),
      },
    ],
  }),
  component: Home,
});
function Home() {
  const services = Route.useLoaderData();
  const settings = useWebsiteSettings();
  return (
    <Page>
      <section className="hero bg-navy text-cream">
        <div className="site-container hero-layout">
          <div className="hero-copy">
            <Eyebrow light>Subsidiary of Namielus Group Limited</Eyebrow>
            <h1 className="hero-title">
              Identity that hits <span>differently.</span>
            </h1>
            <p className="hero-description">
              We design and build digital experiences and brand systems that help businesses grow
              with confidence.
            </p>
            <div className="hero-actions">
              {settings.show_quote !== false && (
                <Button asChild variant="gold" size="xl">
                  <Link to="/quote">
                    Get a Quote <ArrowUpRight />
                  </Link>
                </Button>
              )}
              <Button asChild variant="cream" size="xl" className="hero-work-button">
                <Link to="/services">
                  Explore Our Services <ArrowDown />
                </Link>
              </Button>
            </div>
          </div>
          <div className="hero-media">
            <div className="hero-image">
              <img
                src={heroImage}
                alt="Art-directed collection of premium brand identity materials"
                width={1536}
                height={1024}
              />
              <div className="hero-stamp">
                <img src={logoMark} alt="" aria-hidden="true" />
                CYTIC CREATIVES
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="cream-section">
        <div className="site-container grid gap-8 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-3">
            <Eyebrow>Selected work</Eyebrow>
          </div>
          <div className="lg:col-span-8 lg:col-start-5">
            <h2 className="display-lg">Distinctive work, built with purpose.</h2>
            <p className="statement-copy">
              Explore the brands and digital experiences we have created to help businesses stand
              apart.
            </p>
            <ArrowLink to="/work">Explore our work</ArrowLink>
          </div>
        </div>
      </section>
      <section className="capabilities-section bg-navy text-cream">
        <div className="site-container py-16 lg:py-24">
          <div className="section-heading border-cream/20">
            <div>
              <Eyebrow light>Capabilities</Eyebrow>
              <h2 className="display-lg mt-5">
                Designed around
                <br />
                your next move.
              </h2>
            </div>
            <p className="text-cream/65">
              One connected system, built to make your business unmistakable.
            </p>
          </div>
          {services.length > 0 ? (
            <div className="capability-grid">
              {services.map((service, index) => (
                <article className="capability-card" key={service.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <Link to="/services" aria-label={`Explore ${service.name} services`}>
                    Explore <ArrowUpRight />
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty-state">Services are being updated. Please check back soon.</p>
          )}
          <div className="mt-12">
            <ArrowLink to="/services">See Our Services</ArrowLink>
          </div>
        </div>
      </section>
      <CTA />
    </Page>
  );
}
