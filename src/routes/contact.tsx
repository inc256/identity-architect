import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Page, Eyebrow } from "@/components/site/SiteShell";
import { useWebsiteSettings } from "@/lib/website-settings";
import { getSocialUrl } from "@/lib/cms";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact CYTIC CREATIVES" },
      {
        name: "description",
        content:
          "Have an idea? Let CYTIC CREATIVES build a digital product or brand experience for you.",
      },
      { property: "og:title", content: "Have an idea? — CYTIC CREATIVES" },
      {
        property: "og:description",
        content: "Let’s build a digital product or brand experience that works.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const settings = useWebsiteSettings();
  const instagramUrl = getSocialUrl(settings.instagram, "instagram");
  const linkedinUrl = getSocialUrl(settings.linkedin, "linkedin");
  return (
    <Page>
      <section className="contact-page bg-navy text-cream">
        <div className="site-container grid gap-16 py-32 lg:grid-cols-2">
          <div>
            <Eyebrow light>Contact</Eyebrow>
            <h1 className="display-xl mt-7">Have an idea?</h1>
            <p className="mt-8 max-w-xl text-xl text-cream/70">
              Let’s build a digital product or brand experience that works.
            </p>
            {settings.show_quote !== false && (
              <Button asChild variant="gold" size="xl" className="mt-10">
                <Link to="/quote">
                  Build Your Quote <ArrowUpRight />
                </Link>
              </Button>
            )}
          </div>
          <div className="contact-list">
            {settings.public_email && (
              <div>
                <span>Email</span>
                <strong>
                  <a href={`mailto:${settings.public_email}`}>{settings.public_email}</a>
                </strong>
              </div>
            )}
            {settings.phone && (
              <div>
                <span>Phone</span>
                <strong>
                  <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}>{settings.phone}</a>
                </strong>
              </div>
            )}
            <div>
              <span>Location</span>
              <strong>Uganda-Kampala, East Africa</strong>
            </div>
            {(instagramUrl || linkedinUrl) && (
              <div>
                <span>Social</span>
                <strong className="flex flex-wrap gap-4">
                  {instagramUrl && (
                    <a href={instagramUrl} target="_blank" rel="noreferrer">
                      Instagram
                    </a>
                  )}
                  {linkedinUrl && (
                    <a href={linkedinUrl} target="_blank" rel="noreferrer">
                      LinkedIn
                    </a>
                  )}
                </strong>
              </div>
            )}
            {!settings.public_email && !settings.phone && !instagramUrl && !linkedinUrl && (
              <p>Contact details have not been published yet.</p>
            )}
          </div>
        </div>
      </section>
    </Page>
  );
}
