import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Page, Eyebrow, CTA } from "@/components/site/SiteShell";

const plans = [
  { name: "Digital Products", price: "From UGX 1.8M", description: "Custom Android, web, iOS, and website development with a focused product experience.", features: ["Product strategy and planning", "Responsive user interfaces", "Performance and usability testing", "Launch-ready implementation"] },
  { name: "Digital Presence", price: "From UGX 1.2M", description: "Clear, intuitive digital interfaces that help users understand and trust your offering.", features: ["User flow mapping", "UI/UX design", "Responsive design system", "Design handoff support"] },
  { name: "Brand Development", price: "From UGX 1.0M", description: "Distinct identity assets designed to communicate your value consistently.", features: ["Logo and visual direction", "Campaign design", "Graphics and brand assets", "Brand-ready presentation"] },
  { name: "Brand Applications", price: "From UGX 0.9M", description: "Thoughtful brand application across merchandise and digital experience states.", features: ["Merchandise branding", "Error and loading states", "Brand consistency", "Production-ready assets"] },
] as const;

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — CYTIC CREATIVES" },
      { name: "description", content: "Explore CYTIC CREATIVES pricing for digital products, digital presence, brand development, and brand applications." },
      { property: "og:title", content: "Pricing — CYTIC CREATIVES" },
      { property: "og:description", content: "Flexible pricing for digital products and brand experiences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: Pricing,
});

function Pricing() {
  return (
    <Page>
      <section className="page-intro bg-navy text-cream">
        <div className="site-container">
          <Eyebrow light>Pricing</Eyebrow>
          <h1 className="display-xl">Clear pricing for<br/>distinct work.</h1>
          <p className="max-w-2xl text-cream/70">Every project begins with a clear scope and an estimate shaped around your goals. Final pricing is confirmed after the brief is reviewed.</p>
        </div>
      </section>

      <section className="cream-section">
        <div className="site-container py-24 lg:py-28">
          <div className="section-heading">
            <div>
              <Eyebrow>Flexible investment</Eyebrow>
              <h2 className="display-lg mt-5">A clear package for every stage of growth.</h2>
            </div>
            <p>Choose a starting scope, then refine the brief with our team. Every proposal is tailored to your product, audience, and business goals.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {plans.map((plan) => (
              <article key={plan.name} className="rounded-3xl border border-navy/15 bg-white p-8 text-navy shadow-sm lg:p-10">
                <Eyebrow>{plan.name}</Eyebrow>
                <h2 className="mt-5 text-3xl font-extrabold tracking-tight lg:text-4xl">{plan.price}</h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-navy/70">{plan.description}</p>
                <ul className="mt-8 space-y-4 border-t border-navy/15 pt-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm font-medium">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-gold/40 bg-gold px-8 py-10 text-navy lg:flex lg:items-center lg:justify-between lg:px-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-navy/60">Need a tailored scope?</p>
              <h2 className="mt-3 text-3xl font-extrabold lg:text-4xl">Let’s define the right investment.</h2>
            </div>
            <Button asChild variant="navy" size="xl" className="mt-7 lg:mt-0">
              <Link to="/contact">Request a proposal <ArrowUpRight /></Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-navy text-cream">
        <div className="site-container grid gap-12 py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow>How pricing works</Eyebrow>
            <h2 className="display-md mt-6">A clear estimate, then a confirmed proposal.</h2>
            <p className="statement-copy max-w-xl">We review your brief, define the scope, and confirm the final investment before production begins.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[["01","Brief"],["02","Scope"],["03","Proposal"]].map(([number, label]) => (
              <div key={number} className="rounded-2xl border border-navy/15 bg-white p-6">
                <span className="text-lg font-extrabold text-gold">{number}</span>
                <p className="mt-5 text-xl font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </Page>
  );
}
