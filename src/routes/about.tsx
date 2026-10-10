import { createFileRoute } from "@tanstack/react-router";
import { CTA, Eyebrow, Page } from "@/components/site/SiteShell";

const principles = [
  ["Clarity", "Clear ideas. Clear communication."],
  ["Usability", "Useful, intuitive digital experiences."],
  ["Consistency", "Connected brand experiences at every touchpoint."],
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About CYTIC CREATIVES" },
      {
        name: "description",
        content: "CYTIC CREATIVES creates thoughtful digital products and distinctive brands.",
      },
      { property: "og:title", content: "About CYTIC CREATIVES" },
      {
        property: "og:description",
        content: "Thoughtful digital products and distinctive brands.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <Page>
      <section className="page-intro">
        <div className="site-container">
          <Eyebrow>About CYTIC CREATIVES</Eyebrow>
          <h1 className="display-xl">
            Thoughtful digital.
            <br />
            Distinctive brands.
          </h1>
          <p>We create digital products and brand systems that help businesses move forward.</p>
        </div>
      </section>
      <section className="cream-section">
        <div className="site-container py-16 lg:py-24">
          <Eyebrow>Our approach</Eyebrow>
          <h2 className="display-lg mt-6">Thoughtful by design.</h2>
          <div className="principle-grid">
            {principles.map(([title, description], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </Page>
  );
}
