import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Page, Eyebrow } from "@/components/site/SiteShell";
import { formatUGX } from "@/lib/quote";

type Confirmation = { quote_id: string; estimated_price: number; estimated_weeks_min: number; estimated_weeks_max: number; selectedServices: string[]; businessName: string };

export const Route = createFileRoute("/quote/confirmation")({
  head: () => ({ meta: [{ title: "Quote Received — CYTIC Branding Agency" }, { name: "robots", content: "noindex" }] }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const [data, setData] = useState<Confirmation | null>(null);
  useEffect(() => { try { const saved = sessionStorage.getItem("cytic-confirmation"); if (saved) setData(JSON.parse(saved)); } catch { /* Ignore invalid session data. */ } }, []);
  const download = () => {
    if (!data) return;
    const text = `CYTIC BRANDING AGENCY\nESTIMATE — NOT A FINAL CONTRACT\n\nQuote ID: ${data.quote_id}\nBusiness: ${data.businessName}\nEstimated investment: ${formatUGX(data.estimated_price)}\nEstimated timeline: ${data.estimated_weeks_min}–${data.estimated_weeks_max} weeks\n\nSelected services:\n${data.selectedServices.map((item) => `- ${item}`).join("\n")}\n\nThis is an estimate based on the information provided. The real project value may change during development as the scope, complexity, deliverables, revisions, and requirements become clearer. Final pricing and timeline will be confirmed after CYTIC review.`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${data.quote_id}-estimate.txt`; anchor.click(); URL.revokeObjectURL(url);
  };
  return <Page><section className="confirmation bg-navy text-cream"><div className="site-container py-24 lg:py-32"><Eyebrow light>Brief received</Eyebrow><h1 className="display-xl">Your project is<br />on our radar.</h1>{data ? <div className="confirmation-grid"><div className="confirmation-summary"><span>Quote ID</span><strong>{data.quote_id}</strong><span>Estimated investment</span><strong>Starting from {formatUGX(data.estimated_price)}+</strong><span>Estimated timeline</span><strong>{data.estimated_weeks_min}–{data.estimated_weeks_max} weeks</strong></div><div><h2>What happens next.</h2>{["We review your brief.", "We contact you.", "We confirm scope.", "We prepare the official proposal."].map((item) => <p key={item}><Check />{item}</p>)}</div></div> : <p className="mt-10 text-cream/70">Your confirmation details are available in the browser session used to submit the quote.</p>}<div className="mt-12 flex flex-wrap gap-3"><Button asChild variant="gold" size="xl"><Link to="/"><ArrowLeft /> Back to CYTIC</Link></Button>{data && <Button variant="outline" size="xl" className="border-cream/40 text-cream hover:bg-cream hover:text-navy" onClick={download}><Download /> Download Estimate</Button>}</div></div></section></Page>;
}
