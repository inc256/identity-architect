import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import logoText from "@/assets/CYTIC_Logo_Text_512p.png";
import { businessAddress, businessMapUrl } from "@/data/site";
import { useWebsiteSettings } from "@/lib/website-settings";
import { getSocialUrl } from "@/lib/cms";

const nav = [
  ["Home", "/"],
  ["Work", "/work"],
  ["Services", "/services"],
  ["Blog", "/blog"],
  ["Contact Us", "/contact"],
  ["Quote", "/quote"],
  ["About", "/about"],
] as const;
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const settings = useWebsiteSettings();
  const visibleNav = nav.filter(([label]) => label !== "Quote" || settings.show_quote !== false);
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return (
    <header className="site-header">
      <div className="site-container site-header-inner flex items-center justify-between">
        <Link to="/" className="brand-lockup" aria-label="CYTIC home">
          <img src={logoText} alt="CYTIC" className="brand-wordmark" />
        </Link>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {visibleNav.map(([label, to]) => (
            <Link
              key={to}
              to={to}
              className="nav-link"
              activeProps={{ className: "nav-link nav-active" }}
            >
              {label}
            </Link>
          ))}
        </nav>
        {settings.show_quote !== false && (
          <Button asChild variant="gold" size="lg" className="hidden lg:inline-flex">
            <Link to="/quote">
              Get a Quote <ArrowUpRight />
            </Link>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <div className="mobile-menu">
          <nav
            className="site-container flex flex-col gap-2 pt-5 pb-8"
            aria-label="Mobile navigation"
          >
            {visibleNav.map(([label, to], i) => (
              <Link key={to} to={to} onClick={() => setOpen(false)} className="mobile-link">
                <span>0{i + 1}</span>
                {label}
              </Link>
            ))}
            {settings.show_quote !== false && (
              <Button asChild variant="gold" size="xl" className="mt-4">
                <Link to="/quote" onClick={() => setOpen(false)}>
                  Get a Quote <ArrowUpRight />
                </Link>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
export function SiteFooter() {
  const settings = useWebsiteSettings();
  const links = nav.filter(([label]) => label !== "Quote" || settings.show_quote !== false);
  const instagramUrl = getSocialUrl(settings.instagram, "instagram");
  const linkedinUrl = getSocialUrl(settings.linkedin, "linkedin");
  return (
    <footer className="site-footer bg-navy text-cream">
      <div className="site-container site-footer-inner">
        <div className="site-footer-main grid border-b border-cream/20 lg:grid-cols-2">
          <div>
            <img
              src={logoText}
              alt="CYTIC CREATIVES"
              className="brand-wordmark brand-wordmark-footer"
            />
            <p className="mt-5 text-xl">A subsidiary of Namielus Group Limited.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div className="flex flex-col gap-3">
              {links.map(([l, t]) => (
                <Link key={t} to={t} className="footer-link">
                  {l}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3 text-cream/60">
              <a href={businessMapUrl} target="_blank" rel="noreferrer" className="footer-link">
                {businessAddress}
              </a>
              {settings.public_email && (
                <a href={`mailto:${settings.public_email}`} className="footer-link">
                  {settings.public_email}
                </a>
              )}
              {settings.phone && (
                <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="footer-link">
                  {settings.phone}
                </a>
              )}
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noreferrer" className="footer-link">
                  Instagram
                </a>
              )}
              {linkedinUrl && (
                <a href={linkedinUrl} target="_blank" rel="noreferrer" className="footer-link">
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="site-footer-bottom flex flex-col text-xs text-cream/55 sm:flex-row sm:justify-between">
          <p>© CYTIC CREATIVES</p>
        </div>
      </div>
    </footer>
  );
}
export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="site-page-shell">
      <SiteHeader />
      <main className="site-page-main">{children}</main>
      <SiteFooter />
    </div>
  );
}
export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={`eyebrow ${light ? "text-gold" : "text-navy/65"}`}>
      <span aria-hidden="true" /> {children}
    </p>
  );
}
export function ArrowLink({
  to,
  children,
}: {
  to: "/work" | "/services" | "/about" | "/contact" | "/quote" | "/";
  children: ReactNode;
}) {
  return (
    <Link to={to} className="arrow-link">
      {children}
      <ArrowUpRight />
    </Link>
  );
}
export function CTA() {
  const settings = useWebsiteSettings();
  if (settings.show_quote === false) return null;
  return (
    <section className="bg-gold text-navy">
      <div className="site-container site-cta-inner grid lg:grid-cols-[1fr_auto] lg:items-end">
        <h2 className="display-lg max-w-4xl">Build something distinct.</h2>
        <Button asChild variant="cream" size="xl">
          <Link to="/quote">
            Get a Quote <ArrowUpRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}
