import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Page, Eyebrow } from "@/components/site/SiteShell";
import { calculateQuote, emptyQuote, formatDuration, formatUGX, getQuoteItemDuration, getQuoteItemPrice, type QuoteState } from "@/lib/quote";
import { submitQuote } from "@/lib/quote.functions";

export const Route = createFileRoute("/quote/")({
  head: () => ({
    meta: [
      { title: "Build Your Quote — CYTIC Branding Agency" },
      { name: "description", content: "Configure your brand project and get an estimated investment in minutes." },
    ],
    links: [{ rel: "canonical", href: "/quote" }],
  }),
  component: QuoteBuilder,
});

const stages = ["I'm starting a business", "I'm growing an existing business", "I'm rebranding", "I'm an established company", "I'm not sure yet"];
const strategy = ["Brand Discovery", "Brand Strategy", "Brand Positioning"];
const identity = ["Logo Design", "Visual Identity", "Brand Guidelines"];
const digital = ["Landing page", "Company website", "E-commerce", "Web application", "Android", "iOS", "Cross-platform", "Not sure"];
const timelines = ["As soon as possible", "Within 1 month", "1–3 months", "3+ months", "I'm just exploring"];
const contactMethods = ["Email", "Phone", "WhatsApp"];
const isStartupOrUncertain = (stage: string) => stage === "I'm starting a business" || stage === "I'm not sure yet";
const descriptions: Record<string, string> = {
  "Brand Discovery": "Understand the business, audience, challenge, and opportunity.",
  "Brand Strategy": "Define the brand's direction, purpose, and strategic foundation.",
  "Brand Positioning": "Clarify how the brand should stand apart in its market.",
  "Logo Design": "Create the core mark people use to recognize the brand.",
  "Visual Identity": "Build the visual language across type, color, layout, and imagery.",
  "Brand Guidelines": "Document how the identity should be used consistently.",
  Naming: "Develop a distinctive and usable name for the business or offer.",
  "Landing page": "Create a focused single page for one offer, campaign, or launch.",
  "Company website": "Design a multi-page website for the business and its audiences.",
  "E-commerce": "Create a digital storefront for products, payments, and transactions.",
  "Web application": "Plan and design a browser-based product with custom functionality.",
  Android: "Design a native Android product experience.",
  iOS: "Design a native iOS product experience.",
  "Cross-platform": "Plan one app experience that works across multiple platforms.",
  "Not sure": "Share what you know and we will help clarify the digital scope.",
};

function QuoteBuilder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [quote, setQuote] = useState<QuoteState>(emptyQuote);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const estimate = useMemo(() => calculateQuote(quote), [quote]);
  const namingSelected = quote.selectedServices.includes("Naming");
  const digitalSelected = quote.digitalRequirements.length > 0;
  const totalSteps = 8;

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("cytic-quote");
      if (saved) setQuote({ ...emptyQuote, ...JSON.parse(saved) });
    } catch { /* Ignore invalid session data. */ }
  }, []);
  useEffect(() => { sessionStorage.setItem("cytic-quote", JSON.stringify(quote)); }, [quote]);

  const update = <K extends keyof QuoteState>(key: K, value: QuoteState[K]) => setQuote((current) => ({ ...current, [key]: value }));
  const toggleService = (value: string) => update("selectedServices", quote.selectedServices.includes(value) ? quote.selectedServices.filter((item) => item !== value) : [...quote.selectedServices, value]);
  const toggleDigital = (value: string) => update("digitalRequirements", quote.digitalRequirements.includes(value) ? quote.digitalRequirements.filter((item) => item !== value) : [...quote.digitalRequirements, value]);
  const valid = () => {
    if (step === 1) return !!quote.businessStage;
    if (step === 2) return quote.selectedServices.some((item) => strategy.includes(item));
    if (step === 3) return quote.selectedServices.some((item) => identity.includes(item));
    if (step === 4) return namingSelected || digitalSelected;
    if (step === 5) return !!quote.industry.trim() && quote.projectDescription.trim().length >= 10;
    if (step === 6) return !!quote.timeline;
    if (step === 7) return !!quote.fullName && quote.email.includes("@") && quote.phone.length >= 6;
    return true;
  };
  const next = () => { if (!valid()) { setError(step === 5 ? "Add your industry and a project description of at least 10 characters. Website and business name are optional." : "Complete this step to continue."); return; } setError(""); setStep((current) => Math.min(totalSteps, current + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const back = () => { setError(""); setStep((current) => Math.max(1, current - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const submit = async () => {
    if (!valid()) { setError("Complete the required details before submitting."); return; }
    setSubmitting(true); setError("");
    try {
      const result = await submitQuote({ data: quote });
      sessionStorage.setItem("cytic-confirmation", JSON.stringify({ ...result, selectedServices: quote.selectedServices, businessName: quote.businessName }));
      sessionStorage.removeItem("cytic-quote");
      await navigate({ to: "/quote/confirmation" });
    } catch (caught) { setError(caught instanceof Error ? caught.message : "We couldn't submit your brief."); }
    finally { setSubmitting(false); }
  };

  return <Page><section className="quote-shell bg-navy text-cream"><div className="site-container py-12 lg:py-20">
    <div className="quote-top"><Link to="/" className="arrow-link"><ArrowLeft /> Exit quote</Link><span>Step {step} of {totalSteps}</span></div>
    <div className="progress-track"><span style={{ width: `${step / totalSteps * 100}%` }} /></div>
    <div className="quote-grid"><div className="quote-main">
      {step === 1 && <Step title="Where are you with your business?" eyebrow="Business stage"><Choices items={stages} selected={[quote.businessStage]} onClick={(value) => update("businessStage", value)} /></Step>}
      {step === 2 && <Step title="What strategy does your brand need?" eyebrow="Step 2 · Strategy"><Choices items={strategy} selected={quote.selectedServices} onClick={toggleService} /></Step>}
      {step === 3 && <Step title="What identity does your brand need?" eyebrow="Step 3 · Identity"><Choices items={identity} selected={quote.selectedServices} onClick={toggleService} /></Step>}
      {step === 4 && <Step title="Do you need naming or digital work?" eyebrow="Step 4 · Naming and digital requirements"><div className="service-choices"><fieldset><legend>Naming</legend><Choice label="Naming" description={descriptions.Naming} active={namingSelected} onClick={() => toggleService("Naming")} /></fieldset><fieldset><legend>Digital experience</legend>{digital.map((item) => <Choice key={item} label={item} description={descriptions[item]} active={quote.digitalRequirements.includes(item)} onClick={() => toggleDigital(item)} />)}</fieldset></div></Step>}
      {step === 5 && <Step title="Tell us about the project." eyebrow="Business information"><div className="form-grid">
        {namingSelected && <Field label="Business name"><Input value={quote.businessName} onChange={(event) => update("businessName", event.target.value)} placeholder="Your business name" /></Field>}
        <Field label="Industry"><Input value={quote.industry} onChange={(event) => update("industry", event.target.value)} placeholder="Your industry" /></Field>
        {!isStartupOrUncertain(quote.businessStage) && <Field label="Current website"><Input value={quote.website} onChange={(event) => update("website", event.target.value)} placeholder="https://" /></Field>}
        <Field label="Project description" full><Textarea value={quote.projectDescription} onChange={(event) => update("projectDescription", event.target.value)} placeholder="What are you building, changing, or trying to achieve?" /></Field>
      </div></Step>}
      {step === 6 && <Step title="When do you want to start?" eyebrow="Timeline"><Choices items={timelines} selected={[quote.timeline]} onClick={(value) => update("timeline", value)} /></Step>}
      {step === 7 && <Step title="Where should we send the next steps?" eyebrow="Contact details"><div className="form-grid"><Field label="Full name"><Input value={quote.fullName} onChange={(event) => update("fullName", event.target.value)} placeholder="Your name" /></Field><Field label="Email"><Input type="email" value={quote.email} onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" /></Field><Field label="Phone"><Input value={quote.phone} onChange={(event) => update("phone", event.target.value)} placeholder="Your phone number" /></Field><Field label="Preferred contact"><select className="quote-select" value={quote.preferredContact} onChange={(event) => update("preferredContact", event.target.value)}>{contactMethods.map((method) => <option key={method} value={method}>{method}</option>)}</select></Field></div></Step>}
      {step === 8 && <Step title="Your project total." eyebrow="Estimate"><div className="estimate-panel"><p>CALCULATED PROJECT TOTAL</p><h2>{formatUGX(estimate.selectedTotal)}</h2><span>Estimated completion: {formatDuration(estimate.minDays)} – {formatDuration(estimate.maxDays)}</span><ul>{estimate.selectedItems.map((service) => { const duration = getQuoteItemDuration(service); return <li key={service}><Check /><span><strong>{service}</strong><small>{formatUGX(getQuoteItemPrice(service))} · {duration[0] ? `${formatDuration(duration[0])} – ${formatDuration(duration[1])}` : "Duration to be confirmed"}</small></span></li>; })}</ul><p className="disclaimer">This is an estimate based on the information provided. The real project value may change during development as the scope, complexity, deliverables, revisions, and requirements become clearer. Final pricing and timeline will be confirmed after CYTIC review.</p></div></Step>}
      {error && <p className="quote-error" role="alert">{error}</p>}
      <div className="quote-controls">{step > 1 && <Button variant="ghost" size="xl" onClick={back}><ArrowLeft /> Back</Button>}{step < 8 && <Button variant="gold" size="xl" onClick={next}>Continue <ArrowRight /></Button>}{step === 8 && <Button variant="gold" size="xl" onClick={submit} disabled={submitting}>{submitting ? "Sending..." : "Request Detailed Proposal"} <ArrowRight /></Button>}</div>
    </div><aside className="live-estimate" aria-label="Live quote estimate"><span>Live total</span><strong>{estimate.selectedTotal > 0 ? formatUGX(estimate.selectedTotal) : "Select services"}</strong><div><span>{quote.selectedServices.length} service{quote.selectedServices.length === 1 ? "" : "s"} selected</span><span>{quote.digitalRequirements.length} digital requirement{quote.digitalRequirements.length === 1 ? "" : "s"}</span></div><p>Exact checked-item total. This is an estimate and may change as the project scope and requirements develop.</p></aside></div>
  </div></section></Page>;
}

function Step({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) { return <div className="quote-step"><Eyebrow light>{eyebrow}</Eyebrow><h1>{title}</h1>{children}</div>; }
function Choices({ items, selected, onClick }: { items: readonly string[]; selected: string[]; onClick: (value: string) => void }) { return <div className="choices">{items.map((item) => <Choice key={item} label={item} description={descriptions[item]} active={selected.includes(item)} onClick={() => onClick(item)} />)}</div>; }
function Choice({ label, description, active, onClick }: { label: string; description?: string; active: boolean; onClick: () => void }) { return <button type="button" className={active ? "selected" : ""} onClick={onClick}><span><strong>{label}</strong>{description && <small>{description}</small>}</span><i>{active ? <Check /> : "+"}</i></button>; }
function Field({ label, children, full = false }: { label: string; children: ReactNode; full?: boolean }) { return <label className={full ? "full" : ""}><span>{label}</span>{children}</label>; }
