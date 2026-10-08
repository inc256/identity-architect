import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import heroImage from "@/assets/cytic-hero.png";
import logoMark from "@/assets/CYTIC_Logo_512p.png";
import { Button } from "@/components/ui/button";
import { ArrowLink, CTA, Eyebrow, Page } from "@/components/site/SiteShell";
import { services } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "CYTIC CREATIVES | Digital products and brands." },
    { name: "description", content: "CYTIC CREATIVES is a subsidiary of Namielus Group Limited, creating digital products, digital experiences, and distinctive brands." },
    { property: "og:title", content: "CYTIC CREATIVES | Digital products and brands." },
    { property: "og:description", content: "Digital products, digital presence, brand development, and brand applications." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/" }], scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context":"https://schema.org", "@type":"ProfessionalService", name:"CYTIC CREATIVES", description:"Digital products, digital presence, brand development, and brand applications.", parentOrganization:{"@type":"Organization","name":"Namielus Group Limited"} }) }] }),
  component: Home,
});
function Home() { return <Page>
  <section className="hero bg-navy text-cream"><div className="site-container hero-copy grid gap-10 pb-8 pt-20 lg:grid-cols-12 lg:pt-28"><div className="lg:col-span-12"><Eyebrow light>Subsidiary of Namielus Group Limited</Eyebrow><h1 className="hero-title mt-8">Identity that hits <span>differently.</span></h1></div><p className="max-w-lg text-lg leading-relaxed text-cream/75 lg:col-span-5 lg:col-start-7">We design and build digital experiences and brand systems that help businesses grow with confidence.</p><div className="flex flex-wrap gap-3 lg:col-span-6 lg:col-start-7"><Button asChild variant="gold" size="xl"><Link to="/quote">Get a Quote <ArrowUpRight/></Link></Button><Button asChild variant="cream" size="xl" className="hero-work-button"><Link to="/services">Explore Our Services <ArrowDown/></Link></Button></div></div><div className="site-container hero-media pb-8"><div className="hero-image"><img src={heroImage} alt="Art-directed collection of premium brand identity materials" width={1536} height={1024}/><div className="hero-stamp"><img src={logoMark} alt="" aria-hidden="true"/>CYTIC CREATIVES</div></div></div></section>
  <section className="cream-section"><div className="site-container grid gap-10 py-24 lg:grid-cols-12 lg:py-36"><div className="lg:col-span-3"><Eyebrow>What we do</Eyebrow></div><div className="lg:col-span-8 lg:col-start-5"><h2 className="display-lg">We make digital products and brands that work.</h2><p className="statement-copy">From usable interfaces to memorable visual systems, we build the details people notice and the experiences they trust.</p><ArrowLink to="/services">What we do</ArrowLink></div></div></section>
  {/* Work section paused until CYTIC projects are ready. */}
  <section className="capabilities-section bg-navy text-cream"><div className="site-container py-24 lg:py-32"><div className="section-heading border-cream/20"><div><Eyebrow light>Capabilities</Eyebrow><h2 className="display-lg mt-5">From strategy<br/>to expression.</h2></div><p className="text-cream/65">One connected system, built to make your business unmistakable.</p></div><div className="capability-grid">{services.map((service)=><article className="capability-card" key={service.id}><span>{service.number}</span><h3>{service.title}</h3><p>{service.line}</p><Link to="/services" aria-label={`Explore ${service.title} services`}>Explore <ArrowUpRight/></Link></article>)}</div><div className="mt-12"><ArrowLink to="/services">See Our Services</ArrowLink></div></div></section>
  <CTA/>
 </Page> }