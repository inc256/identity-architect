import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import logoText from "@/assets/CYTIC_Logo_Text_512p.png";

const nav = [["Home", "/"], // ["Work", "/work"],
  ["Services", "/services"], ["Process", "/process"], ["About", "/about"]] as const;
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  useEffect(() => { if (open) document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, [open]);
  return <header className="site-header"><div className="site-container flex min-h-[4.25rem] items-center justify-between lg:min-h-[5rem]">
    <Link to="/" className="brand-lockup" aria-label="CYTIC home"><img src={logoText} alt="CYTIC" className="brand-wordmark" /></Link>
    <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">{nav.map(([label,to]) => <Link key={to} to={to} className="nav-link" activeProps={{ className: "nav-link nav-active" }}>{label}</Link>)}</nav>
    <Button asChild variant="gold" size="lg" className="hidden lg:inline-flex"><Link to="/quote">Build Your Quote <ArrowUpRight /></Link></Button>
    <Button variant="ghost" size="icon" className="lg:hidden" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</Button>
  </div>{open && <div className="mobile-menu"><nav className="site-container flex min-h-[calc(100svh-4.25rem)] flex-col justify-center gap-2 py-4" aria-label="Mobile navigation">{nav.map(([label,to], i) => <Link key={to} to={to} onClick={() => setOpen(false)} className="mobile-link"><span>0{i+1}</span>{label}</Link>)}<Button asChild variant="gold" size="xl" className="mt-4"><Link to="/quote" onClick={() => setOpen(false)}>Build Your Quote <ArrowUpRight/></Link></Button></nav></div>}</header>;
}
export function SiteFooter() { return <footer className="bg-navy text-cream"><div className="site-container py-16 lg:py-24"><div className="grid gap-14 border-b border-cream/20 pb-16 lg:grid-cols-2"><div><img src={logoText} alt="CYTIC" className="brand-wordmark brand-wordmark-footer"/><p className="mt-5 text-xl">Identity that hits differently.</p></div><div className="grid grid-cols-2 gap-8 text-sm"><div className="flex flex-col gap-3">{[...nav,["Contact","/contact"],["Build Your Quote","/quote"]].map(([l,t])=><Link key={t} to={t} className="footer-link">{l}</Link>)}</div><div className="flex flex-col gap-3 text-cream/60"><span>YouTube</span><span>TikTok</span><span>Instagram</span><span>LinkedIn</span><span>X</span><span>Facebook</span></div></div></div><div className="flex flex-col gap-5 pt-7 text-xs text-cream/55 sm:flex-row sm:justify-between"><p>© CYTIC Branding Agency</p><div className="flex gap-5"><Link to="/privacy">Privacy Policy</Link><Link to="/terms">Terms & Conditions</Link></div></div></div></footer> }
export function Page({ children }: { children: ReactNode }) { return <><SiteHeader/><main>{children}</main><SiteFooter/></>; }
export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) { return <p className={`eyebrow ${light ? "text-gold" : "text-navy/65"}`}><span aria-hidden="true"/> {children}</p>; }
export function ArrowLink({ to, children }: { to: "/work"|"/services"|"/process"|"/about"|"/contact"|"/quote"|"/"; children: ReactNode }) { return <Link to={to} className="arrow-link">{children}<ArrowUpRight /></Link>; }
export function CTA() { return <section className="bg-gold text-navy"><div className="site-container grid gap-10 py-20 lg:grid-cols-[1fr_auto] lg:items-end lg:py-28"><h2 className="display-lg max-w-4xl">Build something distinct.</h2><Button asChild variant="navy" size="xl" className="cta-quote-button"><Link to="/quote">Build Your Quote <ArrowUpRight/></Link></Button></div></section>; }
