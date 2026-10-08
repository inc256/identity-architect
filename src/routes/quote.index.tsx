import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Page, Eyebrow } from "@/components/site/SiteShell";
import { calculateQuote, emptyQuote, formatDuration, formatUGX, getQuoteItemPrice, type QuoteState } from "@/lib/quote";
import { submitQuote } from "@/lib/quote.functions";

export const Route = createFileRoute("/quote/")({
  head: () => ({
    meta: [
      { title: "Build Your Quote — CYTIC CREATIVES" },
      { name: "description", content: "Configure your digital product or brand project and get an estimated investment in minutes." },
    ],
    links: [{ rel: "canonical", href: "/quote" }],
  }),
  component: QuoteBuilder,
});

type ServiceGroup = {
  id: string;
  title: string;
  preview: string;
  includes: string;
  startingFrom: string;
  items: readonly string[];
};

const serviceGroups: readonly ServiceGroup[] = [
  { id: "digital-products", title: "Digital Products", preview: "Websites, e-commerce, web apps, mobile apps, and custom digital products.", includes: "Business Websites · E-commerce · Web Apps · Mobile Apps · Custom Products", startingFrom: "UGX 1,200,000+", items: ["Business Websites", "E-commerce Websites", "Web Applications", "Mobile Applications — Android", "Mobile Applications — iOS", "Mobile Applications — Multiplatform", "Custom Digital Products"] },
  { id: "brand-identity-logo-design", title: "Brand Identity & Logo Design", preview: "Logos, campaign visuals, and graphic design for a recognizable brand presence.", includes: "Logo Design · Campaign Design · Graphic Design", startingFrom: "UGX 100,000+", items: ["Logo Design", "Campaign Design", "Graphic Design"] },
  { id: "ui-ux-design", title: "UI/UX Design", preview: "User interface and experience design from wireframes to polished prototypes.", includes: "Website UI/UX · Mobile App UI/UX · Web App UI/UX · Prototypes", startingFrom: "UGX 500,000+", items: ["Website UI/UX", "Mobile App UI/UX", "Web App UI/UX", "Wireframes & Prototypes"] },
  { id: "merchandise-branding", title: "Merchandise Branding", preview: "Branding for promotional wear, packaging, and product labels.", includes: "Promotional Wear · Packaging & Labels", startingFrom: "UGX 30,000+", items: ["Promotional Wear", "Packaging & Product Labels"] },
] as const;

const contactMethods = ["Email", "Phone", "WhatsApp"];
const productTypes = ["Website", "E-commerce website", "Web application", "Mobile application", "Custom digital product"];
const platforms = ["Android", "iOS", "Multiplatform", "Web only", "Not sure"];
const scopeLabels: Record<string, string> = {
  "Digital Products": "Describe the product type, platforms, features, pages, integrations, authentication, payments, and other relevant requirements.",
  "Brand Identity & Logo Design": "Share the requested design work, asset quantity, existing brand materials, and any important visual requirements.",
  "UI/UX Design": "Describe the number of screens, flows, prototypes, existing product documentation, and any design constraints.",
  "Merchandise Branding": "Share the product type, quantity, number of designs, branding method, and production requirements.",
};

const groupForService = (service: string) => serviceGroups.find((group) => group.items.includes(service));
const stepCount = 8;

function QuoteBuilder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [quote, setQuote] = useState<QuoteState>(emptyQuote);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const estimate = useMemo(() => calculateQuote(quote), [quote]);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("cytic-quote");
      if (saved) setQuote({ ...emptyQuote, ...JSON.parse(saved) });
    } catch { /* Ignore invalid session data. */ }
  }, []);
  useEffect(() => { sessionStorage.setItem("cytic-quote", JSON.stringify(quote)); }, [quote]);

  const update = <K extends keyof QuoteState>(key: K, value: QuoteState[K]) => setQuote((current) => ({ ...current, [key]: value }));
  const toggleService = (value: string) => {
    const selected = quote.selectedServices.includes(value)
      ? quote.selectedServices.filter((item) => item !== value)
      : [...quote.selectedServices, value];
    update("selectedServices", selected);
    if (!selected.includes(value)) {
      update("selectedSubServices", quote.selectedSubServices.filter((item) => groupForService(item)?.id !== value));
    }
  };
  const toggleSubService = (value: string) => {
    const selected = quote.selectedSubServices.includes(value)
      ? quote.selectedSubServices.filter((item) => item !== value)
      : [...quote.selectedSubServices, value];
    update("selectedSubServices", selected);
  };

  const valid = () => {
    if (step === 1) return quote.selectedServices.length > 0;
    if (step === 2) return quote.selectedSubServices.length > 0;
    if (step === 3) return !!quote.industry.trim() && quote.projectDescription.trim().length >= 10;
    if (step === 4) {
      if (!quote.selectedServices.includes("Merchandise Branding")) return true;
      const quantity = Number(quote.quantity);
      return Number.isFinite(quantity) && quantity > 0;
    }
    if (step === 5) return !!quote.fullName.trim() && quote.email.includes("@") && quote.phone.length >= 6;
    return true;
  };

  const next = () => {
    if (!valid()) {
      setError(step === 3 ? "Add your industry and a project description of at least 10 characters." : step === 4 ? "Enter a valid quantity for merchandise branding." : "Complete this step to continue.");
      return;
    }
    setError("");
    setStep((current) => Math.min(stepCount, current + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => { setError(""); setStep((current) => Math.max(1, current - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const submit = async () => {
    if (!valid()) { setError("Complete the required details before submitting."); return; }
    setSubmitting(true); setError("");
    try {
      const result = await submitQuote({ data: quote });
      sessionStorage.setItem("cytic-confirmation", JSON.stringify({ ...result, selectedServices: quote.selectedServices, selectedSubServices: quote.selectedSubServices, businessName: quote.businessName }));
      sessionStorage.removeItem("cytic-quote");
      await navigate({ to: "/quote/confirmation" });
    } catch (caught) { setError(caught instanceof Error ? caught.message : "We couldn't submit your brief."); }
    finally { setSubmitting(false); }
  };

  const selectedGroups = serviceGroups.filter((group) => quote.selectedServices.includes(group.title));
  const totalLabel = quote.selectedSubServices.length === 1 ? "service selected" : "services selected";

  return <Page><section className="quote-shell bg-navy text-cream"><div className="site-container py-12 lg:py-20">
    <div className="quote-top"><Link to="/" className="arrow-link"><ArrowLeft /> Exit quote</Link><span>Step {step} of {stepCount}</span></div>
    <div className="progress-track"><span style={{ width: `${(step / stepCount) * 100}%` }} /></div>
    <div className="quote-grid"><div className="quote-main">
      {step === 1 && <Step title="What do you need?" eyebrow="Step 1 · Service groups"><div className="service-card-grid">{serviceGroups.map((service) => <ServiceCard key={service.id} service={service} active={quote.selectedServices.includes(service.title)} onClick={() => toggleService(service.title)} />)}</div></Step>}
      {step === 2 && <Step title="Define the selected services." eyebrow="Step 2 · Service details"><div className="service-choices">{selectedGroups.length > 0 ? selectedGroups.map((group) => <fieldset key={group.id}><legend>{group.title}</legend>{group.items.map((item) => <Choice key={item} label={item} description={scopeLabels[group.title]} active={quote.selectedSubServices.includes(item)} onClick={() => toggleSubService(item)} />)}</fieldset>) : <p className="empty-state">Select a service group to continue.</p>}</div></Step>}
      {step === 3 && <Step title="Tell us about the project." eyebrow="Step 3 · Business information"><div className="form-grid">
        <Field label="Industry"><Input value={quote.industry} onChange={(event) => update("industry", event.target.value)} placeholder="Your industry" /></Field>
        <Field label="Business name"><Input value={quote.businessName} onChange={(event) => update("businessName", event.target.value)} placeholder="Your business name" /></Field>
        <Field label="Current website"><Input value={quote.website} onChange={(event) => update("website", event.target.value)} placeholder="https://" /></Field>
        <Field label="Project description" full><Textarea value={quote.projectDescription} onChange={(event) => update("projectDescription", event.target.value)} placeholder="What are you building, changing, or trying to achieve?" /></Field>
      </div></Step>}
      {step === 4 && <Step title="Project scope and requirements." eyebrow="Step 4 · Scope"><div className="form-grid">
        {quote.selectedServices.includes("Digital Products") && <Field label="Product type"><select className="quote-select" value={quote.projectType} onChange={(event) => update("projectType", event.target.value)}><option value="">Select a product type</option>{productTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></Field>}
        {quote.selectedServices.includes("Digital Products") && <Field label="Platform"><select className="quote-select" value={quote.platform} onChange={(event) => update("platform", event.target.value)}><option value="">Select a platform</option>{platforms.map((platform) => <option key={platform} value={platform}>{platform}</option>)}</select></Field>}
        {quote.selectedServices.some((service) => service !== "Merchandise Branding") && <Field label="Relevant requirements" full><Textarea value={quote.scopeDetails} onChange={(event) => update("scopeDetails", event.target.value)} placeholder="Pages, screens, features, integrations, payments, authentication, or other requirements." /></Field>}
        {quote.selectedServices.includes("Merchandise Branding") && <Field label="Quantity" full><Input value={quote.quantity} onChange={(event) => update("quantity", event.target.value)} placeholder="Number of items or units" /></Field>}
        {quote.selectedServices.includes("Brand Identity & Logo Design") && <Field label="Design requirements" full><Textarea value={quote.scopeDetails} onChange={(event) => update("scopeDetails", event.target.value)} placeholder="Number of graphics or campaign assets, existing brand information, and other requirements." /></Field>}
        {quote.selectedServices.includes("UI/UX Design") && <Field label="Design requirements" full><Textarea value={quote.scopeDetails} onChange={(event) => update("scopeDetails", event.target.value)} placeholder="Number of screens, flows, wireframes, prototypes, or product documentation." /></Field>}
        {!quote.selectedServices.some((service) => service !== "Merchandise Branding") && <p className="empty-state">No additional scope questions are required for the selected services.</p>}
      </div></Step>}
      {step === 5 && <Step title="Where should we send the next steps?" eyebrow="Contact details"><div className="form-grid"><Field label="Full name"><Input value={quote.fullName} onChange={(event) => update("fullName", event.target.value)} placeholder="Your name" /></Field><Field label="Email"><Input type="email" value={quote.email} onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" /></Field><Field label="Phone"><Input value={quote.phone} onChange={(event) => update("phone", event.target.value)} placeholder="Your phone number" /></Field><Field label="Preferred contact"><select className="quote-select" value={quote.preferredContact} onChange={(event) => update("preferredContact", event.target.value)}>{contactMethods.map((method) => <option key={method} value={method}>{method}</option>)}</select></Field></div></Step>}
      {step === 6 && <Step title="Your project estimate." eyebrow="Estimate"><div className="estimate-panel"><p>STARTING-FROM ESTIMATE</p><h2>{formatUGX(estimate.startingFrom)}</h2><span>Estimated delivery: {formatDuration(estimate.estimatedDaysMin)} – {formatDuration(estimate.estimatedDaysMax)}</span><ul>{estimate.selectedItems.map((service) => <li key={service}><Check /><span><strong>{service}</strong><small>{formatUGX(getQuoteItemPrice(service))} starting price</small></span></li>)}</ul>{estimate.scopeAdjustment > 0 && <p className="estimate-adjustment">Additional merchandise quantity may increase this estimate by {formatUGX(estimate.scopeAdjustment)}.</p>}<p className="disclaimer">This is an estimate based on the information provided. The real project value may change as the scope, complexity, deliverables, quantities, functionality, integrations, and requirements become clearer. It is not a final quotation or contract. CYTIC will review your requirements before preparing a detailed proposal.</p><Button asChild variant="gold" size="xl" className="mt-6"><Link to="/contact">Request a detailed proposal <ArrowRight /></Link></Button></div></Step>}
      {error && <p className="quote-error" role="alert">{error}</p>}
      <div className="quote-controls">{step > 1 && <Button variant="ghost" size="xl" onClick={back}><ArrowLeft /> Back</Button>}{step < 6 && <Button variant="gold" size="xl" onClick={next}>Continue <ArrowRight /></Button>}{step === 6 && <Button variant="gold" size="xl" onClick={submit} disabled={submitting}>{submitting ? "Sending quote..." : "Send Quote for Review"} <ArrowRight /></Button>}</div>
    </div><aside className="live-estimate" aria-label="Live quote estimate"><span>Live total</span><strong>{estimate.selectedTotal > 0 ? formatUGX(estimate.startingFrom) : "Select services"}</strong><div><span>{quote.selectedSubServices.length} {totalLabel}</span><span>{quote.selectedServices.length} service group{quote.selectedServices.length === 1 ? "" : "s"}</span></div><p>Starting prices are not fixed final costs. Additional scope may increase the estimate.</p></aside></div>
  </div></section></Page>;
}

function Step({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) { return <div className="quote-step"><Eyebrow light>{eyebrow}</Eyebrow><h1>{title}</h1>{children}</div>; }
function Choices({ items, selected, onClick }: { items: readonly string[]; selected: string[]; onClick: (value: string) => void }) { return <div className="choices">{items.map((item) => <Choice key={item} label={item} description={undefined} active={selected.includes(item)} onClick={() => onClick(item)} />)}</div>; }
function Choice({ label, description, active, onClick }: { label: string; description?: string; active: boolean; onClick: () => void }) { return <button type="button" className={active ? "selected" : ""} onClick={onClick}><span><strong>{label}</strong>{description && <small>{description}</small>}</span><i>{active ? <Check /> : <Plus />}</i></button>; }
function ServiceCard({ service, active, onClick }: { service: ServiceGroup; active: boolean; onClick: () => void }) { return <button type="button" className={`service-card ${active ? "selected" : ""}`} onClick={onClick}><span className="service-card-title">{service.title}</span><p>{service.preview}</p><small>Includes: {service.includes}</small><strong>{service.startingFrom}</strong><i>{active ? <X /> : <Plus />}</i></button>; }
function Field({ label, children, full = false }: { label: string; children: ReactNode; full?: boolean }) { return <label className={full ? "full" : ""}><span>{label}</span>{children}</label>; }
