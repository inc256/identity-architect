import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Check, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Page, Eyebrow } from "@/components/site/SiteShell";
import { services as serviceDefinitions } from "@/data/site";
import {
  calculateQuote,
  emptyQuote,
  formatDuration,
  formatUGX,
  getQuoteItemPrice,
  type QuoteState,
} from "@/lib/quote";
import { submitQuote } from "@/lib/quote.functions";

export const Route = createFileRoute("/quote/")({
  head: () => ({
    meta: [
      { title: "Build Your Quote — CYTIC CREATIVES" },
      {
        name: "description",
        content:
          "Configure your digital product or brand project and get an estimated investment in minutes.",
      },
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

const serviceGroups: ServiceGroup[] = serviceDefinitions.map((service) => {
  const items = service.items.map((item) => item.label);
  const startingPrice = Math.min(...items.map(getQuoteItemPrice));
  return {
    id: service.id,
    title: service.title,
    preview: service.line,
    includes: items.join(" · "),
    startingFrom: `${formatUGX(startingPrice)}+`,
    items,
  };
});

const contactMethods = ["Email", "Phone", "WhatsApp"] as const;
const contactMethodSet = new Set<string>(contactMethods);
const productTypes = [
  "Website",
  "E-commerce website",
  "Web application",
  "Mobile application",
  "Custom digital product",
];
const platforms = ["Android", "iOS", "Multiplatform", "Web only", "Not sure"];
const scopeLabels: Record<string, string> = {
  "Digital Products":
    "Describe the pages or screens, features, integrations, authentication, payments, and other technical requirements.",
  "Brand Identity & Logo Design":
    "Share the requested design work, number or type of assets, existing brand materials, and visual requirements.",
  "UI/UX Design":
    "Describe the number of screens, user flows, prototype needs, existing product documentation, and design constraints.",
};
const stepCount = 6;

const quoteDraftSchema = z.object({
  selectedServices: z.array(z.string()).optional(),
  selectedSubServices: z.array(z.string()).optional(),
  businessName: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().optional(),
  projectDescription: z.string().optional(),
  projectType: z.string().optional(),
  platform: z.string().optional(),
  scopeDetails: z
    .object({
      "digital-products": z.string().optional(),
      "brand-identity-logo-design": z.string().optional(),
      "ui-ux-design": z.string().optional(),
      "merchandise-branding": z.string().optional(),
    })
    .optional(),
  quantity: z.string().optional(),
  fullName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  preferredContact: z.string().optional(),
});

function restoreQuoteDraft(value: unknown): QuoteState {
  const parsed = quoteDraftSchema.safeParse(value);
  if (!parsed.success) return emptyQuote;
  const selectedServices = (parsed.data.selectedServices ?? []).filter((service) =>
    serviceGroups.some((group) => group.title === service),
  );
  const selectedSubServices = (parsed.data.selectedSubServices ?? []).filter((item) => {
    const group = serviceGroups.find((candidate) => candidate.items.includes(item));
    return group && selectedServices.includes(group.title);
  });
  const preferredContact = parsed.data.preferredContact;
  return {
    ...emptyQuote,
    ...parsed.data,
    selectedServices,
    selectedSubServices,
    preferredContact:
      preferredContact && contactMethodSet.has(preferredContact)
        ? preferredContact
        : emptyQuote.preferredContact,
    scopeDetails: {
      "digital-products": parsed.data.scopeDetails?.["digital-products"] ?? "",
      "brand-identity-logo-design": parsed.data.scopeDetails?.["brand-identity-logo-design"] ?? "",
      "ui-ux-design": parsed.data.scopeDetails?.["ui-ux-design"] ?? "",
      "merchandise-branding": parsed.data.scopeDetails?.["merchandise-branding"] ?? "",
    },
  };
}

function QuoteBuilder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [quote, setQuote] = useState<QuoteState>(emptyQuote);
  const [restored, setRestored] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const estimate = useMemo(() => calculateQuote(quote), [quote]);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("cytic-quote");
      if (saved) setQuote(restoreQuoteDraft(JSON.parse(saved)));
    } catch {
      sessionStorage.removeItem("cytic-quote");
    } finally {
      setRestored(true);
    }
  }, []);
  useEffect(() => {
    if (restored) sessionStorage.setItem("cytic-quote", JSON.stringify(quote));
  }, [quote, restored]);

  const update = <K extends keyof QuoteState>(key: K, value: QuoteState[K]) =>
    setQuote((current) => ({ ...current, [key]: value }));
  const updateScope = (key: keyof QuoteState["scopeDetails"], value: string) => {
    setQuote((current) => ({
      ...current,
      scopeDetails: { ...current.scopeDetails, [key]: value },
    }));
  };

  const toggleService = (value: string) => {
    const selected = quote.selectedServices.includes(value)
      ? quote.selectedServices.filter((item) => item !== value)
      : [...quote.selectedServices, value];
    setQuote((current) => ({
      ...current,
      selectedServices: selected,
      selectedSubServices: current.selectedSubServices.filter((item) => {
        const group = serviceGroups.find((candidate) => candidate.items.includes(item));
        return selected.includes(group?.title ?? "");
      }),
    }));
  };

  const toggleSubService = (value: string) => {
    update(
      "selectedSubServices",
      quote.selectedSubServices.includes(value)
        ? quote.selectedSubServices.filter((item) => item !== value)
        : [...quote.selectedSubServices, value],
    );
  };

  const valid = () => {
    if (step === 1) return quote.selectedServices.length > 0;
    if (step === 2) return quote.selectedSubServices.length > 0;
    if (step === 3) return !!quote.industry.trim() && quote.projectDescription.trim().length >= 10;
    if (step === 4 && quote.selectedServices.includes("Merchandise Branding")) {
      const quantity = /^\d+$/.test(quote.quantity) ? Number(quote.quantity) : Number.NaN;
      return Number.isSafeInteger(quantity) && quantity > 0;
    }
    if (step === 5)
      return (
        !!quote.fullName.trim() &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quote.email) &&
        quote.phone.trim().length >= 6 &&
        contactMethodSet.has(quote.preferredContact)
      );
    return true;
  };

  const next = () => {
    if (!valid()) {
      setError(
        step === 3
          ? "Add your industry and a project description of at least 10 characters."
          : step === 4
            ? "Enter a whole quantity greater than zero for merchandise branding."
            : "Complete this step to continue.",
      );
      return;
    }
    setError("");
    setStep((current) => Math.min(stepCount, current + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setError("");
    setStep((current) => Math.max(1, current - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    if (!valid()) {
      setError("Complete the required details before submitting.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const result = await submitQuote({ data: quote });
      sessionStorage.setItem(
        "cytic-confirmation",
        JSON.stringify({
          ...result,
          selectedServices: quote.selectedServices,
          selectedSubServices: quote.selectedSubServices,
          businessName: quote.businessName,
          scopeAdjustment: estimate.scopeAdjustment,
        }),
      );
      sessionStorage.removeItem("cytic-quote");
      await navigate({ to: "/quote/confirmation" });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We couldn't submit your brief.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedGroups = serviceGroups.filter((group) =>
    quote.selectedServices.includes(group.title),
  );
  const totalLabel =
    quote.selectedSubServices.length === 1 ? "service selected" : "services selected";

  return (
    <Page>
      <section className="quote-shell bg-navy text-cream">
        <div className="site-container py-12 lg:py-20">
          <div className="quote-top">
            <Link to="/" className="arrow-link">
              <ArrowLeft /> Exit quote
            </Link>
            <span>
              Step {step} of {stepCount}
            </span>
          </div>
          <div className="progress-track">
            <span style={{ width: `${(step / stepCount) * 100}%` }} />
          </div>
          <div className="quote-grid">
            <div className="quote-main">
              {step === 1 && (
                <Step title="What do you need?" eyebrow="Step 1 · Service groups">
                  <div className="service-card-grid">
                    {serviceGroups.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        active={quote.selectedServices.includes(service.title)}
                        onClick={() => toggleService(service.title)}
                      />
                    ))}
                  </div>
                </Step>
              )}
              {step === 2 && (
                <Step title="Define the selected services." eyebrow="Step 2 · Service details">
                  <div className="service-choices">
                    {selectedGroups.length > 0 ? (
                      selectedGroups.map((group) => (
                        <fieldset key={group.id}>
                          <legend>{group.title}</legend>
                          {group.items.map((item) => (
                            <Choice
                              key={item}
                              label={item}
                              description={scopeLabels[group.title]}
                              active={quote.selectedSubServices.includes(item)}
                              onClick={() => toggleSubService(item)}
                            />
                          ))}
                        </fieldset>
                      ))
                    ) : (
                      <p className="empty-state">Select a service group to continue.</p>
                    )}
                  </div>
                </Step>
              )}
              {step === 3 && (
                <Step title="Tell us about the project." eyebrow="Step 3 · Business information">
                  <div className="form-grid">
                    <Field label="Industry">
                      <Input
                        value={quote.industry}
                        onChange={(event) => update("industry", event.target.value)}
                        placeholder="Your industry"
                      />
                    </Field>
                    <Field label="Business name (optional)">
                      <Input
                        value={quote.businessName}
                        onChange={(event) => update("businessName", event.target.value)}
                        placeholder="Your business name"
                      />
                    </Field>
                    <Field label="Current website (optional)">
                      <Input
                        type="url"
                        value={quote.website}
                        onChange={(event) => update("website", event.target.value)}
                        placeholder="https://"
                      />
                    </Field>
                    <Field label="Project description" full>
                      <Textarea
                        value={quote.projectDescription}
                        onChange={(event) => update("projectDescription", event.target.value)}
                        placeholder="What are you building, changing, or trying to achieve?"
                      />
                    </Field>
                  </div>
                </Step>
              )}
              {step === 4 && (
                <Step title="Project scope and requirements." eyebrow="Step 4 · Scope">
                  <div className="form-grid">
                    {quote.selectedServices.includes("Digital Products") && (
                      <>
                        <Field label="Product type">
                          <select
                            className="quote-select"
                            value={quote.projectType}
                            onChange={(event) => update("projectType", event.target.value)}
                          >
                            <option value="">Select a product type</option>
                            {productTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Platform">
                          <select
                            className="quote-select"
                            value={quote.platform}
                            onChange={(event) => update("platform", event.target.value)}
                          >
                            <option value="">Select a platform</option>
                            {platforms.map((platform) => (
                              <option key={platform} value={platform}>
                                {platform}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Digital product requirements" full>
                          <Textarea
                            value={quote.scopeDetails["digital-products"]}
                            onChange={(event) =>
                              updateScope("digital-products", event.target.value)
                            }
                            placeholder={scopeLabels["Digital Products"]}
                          />
                        </Field>
                      </>
                    )}
                    {quote.selectedServices.includes("Brand Identity & Logo Design") && (
                      <Field label="Brand design requirements" full>
                        <Textarea
                          value={quote.scopeDetails["brand-identity-logo-design"]}
                          onChange={(event) =>
                            updateScope("brand-identity-logo-design", event.target.value)
                          }
                          placeholder={scopeLabels["Brand Identity & Logo Design"]}
                        />
                      </Field>
                    )}
                    {quote.selectedServices.includes("UI/UX Design") && (
                      <Field label="UI/UX requirements" full>
                        <Textarea
                          value={quote.scopeDetails["ui-ux-design"]}
                          onChange={(event) => updateScope("ui-ux-design", event.target.value)}
                          placeholder={scopeLabels["UI/UX Design"]}
                        />
                      </Field>
                    )}
                    {quote.selectedServices.includes("Merchandise Branding") && (
                      <>
                        <Field label="Merchandise quantity">
                          <Input
                            type="number"
                            min="1"
                            step="1"
                            value={quote.quantity}
                            onChange={(event) => update("quantity", event.target.value)}
                            placeholder="Number of items or units"
                          />
                        </Field>
                        <Field label="Product and production requirements">
                          <Textarea
                            value={quote.scopeDetails["merchandise-branding"]}
                            onChange={(event) =>
                              updateScope("merchandise-branding", event.target.value)
                            }
                            placeholder="Product or package type, design variants, branding method, printing, and production requirements."
                          />
                        </Field>
                      </>
                    )}
                    {!selectedGroups.some((group) => group.id !== "merchandise-branding") &&
                      !quote.selectedServices.includes("Merchandise Branding") && (
                        <p className="empty-state">
                          No additional scope questions are required for the selected services.
                        </p>
                      )}
                  </div>
                </Step>
              )}
              {step === 5 && (
                <Step
                  title="Where should we send the next steps?"
                  eyebrow="Step 5 · Contact details"
                >
                  <div className="form-grid">
                    <Field label="Full name">
                      <Input
                        autoComplete="name"
                        value={quote.fullName}
                        onChange={(event) => update("fullName", event.target.value)}
                        placeholder="Your name"
                      />
                    </Field>
                    <Field label="Email">
                      <Input
                        type="email"
                        autoComplete="email"
                        value={quote.email}
                        onChange={(event) => update("email", event.target.value)}
                        placeholder="you@example.com"
                      />
                    </Field>
                    <Field label="Phone">
                      <Input
                        type="tel"
                        autoComplete="tel"
                        value={quote.phone}
                        onChange={(event) => update("phone", event.target.value)}
                        placeholder="Your phone number"
                      />
                    </Field>
                    <Field label="Preferred contact">
                      <select
                        className="quote-select"
                        value={quote.preferredContact}
                        onChange={(event) => update("preferredContact", event.target.value)}
                      >
                        {contactMethods.map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </Step>
              )}
              {step === 6 && (
                <Step title="Your project estimate." eyebrow="Step 6 · Estimate">
                  <div className="estimate-panel">
                    <p>STARTING-FROM ESTIMATE</p>
                    <h2>{formatUGX(estimate.startingFrom)}+</h2>
                    <span>
                      Indicative delivery: {formatDuration(estimate.estimatedDaysMin)} –{" "}
                      {formatDuration(estimate.estimatedDaysMax)}
                    </span>
                    <h3 className="mt-8">Selected services</h3>
                    <ul>
                      {quote.selectedServices.map((service) => (
                        <li key={service}>
                          <Check />
                          <span>
                            <strong>{service}</strong>
                          </span>
                        </li>
                      ))}
                    </ul>
                    <h3 className="mt-6">Selected sub-services</h3>
                    <ul>
                      {estimate.selectedItems.map((service) => (
                        <li key={service}>
                          <Check />
                          <span>
                            <strong>{service}</strong>
                            <small>{formatUGX(getQuoteItemPrice(service))} starting price</small>
                          </span>
                        </li>
                      ))}
                    </ul>
                    {estimate.scopeAdjustment > 0 && (
                      <p className="estimate-adjustment">
                        Scope-based merchandise adjustment: {formatUGX(estimate.scopeAdjustment)}.
                      </p>
                    )}
                    <p className="disclaimer">
                      This is an estimate based on the information provided. The real project value
                      may change as the scope, complexity, deliverables, quantities, functionality,
                      integrations, and requirements become clearer. It is not a final quotation or
                      contract. CYTIC will review your requirements before preparing a detailed
                      proposal.
                    </p>
                  </div>
                </Step>
              )}
              {error && (
                <p className="quote-error" role="alert">
                  {error}
                </p>
              )}
              <div className="quote-controls">
                {step > 1 && (
                  <Button variant="ghost" size="xl" onClick={back}>
                    <ArrowLeft /> Back
                  </Button>
                )}
                {step < stepCount && (
                  <Button variant="gold" size="xl" onClick={next}>
                    Continue <ArrowRight />
                  </Button>
                )}
                {step === stepCount && (
                  <Button variant="gold" size="xl" onClick={submit} disabled={submitting}>
                    {submitting ? "Sending quote..." : "Request Detailed Proposal"} <ArrowRight />
                  </Button>
                )}
              </div>
            </div>
            <aside className="live-estimate" aria-label="Live quote estimate">
              <span>Live total</span>
              <strong>
                {estimate.selectedTotal > 0
                  ? `${formatUGX(estimate.startingFrom)}+`
                  : "Select services"}
              </strong>
              <div>
                <span>
                  {quote.selectedSubServices.length} {totalLabel}
                </span>
                <span>
                  {quote.selectedServices.length} service group
                  {quote.selectedServices.length === 1 ? "" : "s"}
                </span>
              </div>
              <p>
                Starting prices are not fixed final costs. Additional scope may increase the
                estimate.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </Page>
  );
}

function Step({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <div className="quote-step">
      <Eyebrow light>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      {children}
    </div>
  );
}

function Choice({
  label,
  description,
  active,
  onClick,
}: {
  label: string;
  description?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" className={active ? "selected" : ""} onClick={onClick}>
      <span>
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
      <i>{active ? <Check /> : <Plus />}</i>
    </button>
  );
}

function ServiceCard({
  service,
  active,
  onClick,
}: {
  service: ServiceGroup;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" className={`service-card ${active ? "selected" : ""}`} onClick={onClick}>
      <span className="service-card-title">{service.title}</span>
      <p>{service.preview}</p>
      <small>Includes: {service.includes}</small>
      <strong>Starting from {service.startingFrom}</strong>
      <i>{active ? <X /> : <Plus />}</i>
    </button>
  );
}

function Field({
  label,
  children,
  full = false,
}: {
  label: string;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <label className={full ? "full" : ""}>
      <span>{label}</span>
      {children}
    </label>
  );
}
