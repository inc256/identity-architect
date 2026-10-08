import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Page, Eyebrow } from "@/components/site/SiteShell";
import { formatUGX } from "@/lib/quote";

type Confirmation = { quote_id: string; estimated_price: number; estimated_weeks_min: number; estimated_weeks_max: number; selectedServices: string[]; selectedSubServices: string[]; businessName: string; confirmation_status?: string; email_sent?: boolean; contact_email?: string | null };

export const Route = createFileRoute("/quote/confirmation")({
  head: () => ({ meta: [{ title: "Quote Received — CYTIC CREATIVES" }, { name: "robots", content: "noindex" }] }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const [data, setData] = useState<Confirmation | null>(null);
  useEffect(() => { try { const saved = sessionStorage.getItem("cytic-confirmation"); if (saved) setData(JSON.parse(saved)); } catch { /* Ignore invalid session data. */ } }, []);
  const download = () => {
    if (!data) return;
    const text = `CYTIC CREATIVES\nESTIMATE — NOT A FINAL CONTRACT\n\nQuote ID: ${data.quote_id}\nBusiness: ${data.businessName}\nEstimated investment: ${formatUGX(data.estimated_price)}+\n\nSelected services:\n${data.selectedServices.map((service) => `- ${service}`).join("\n")}\n\nSelected sub-services:\n${data.selectedSubServices.map((item) => `- ${item}`).join("\n")}\n\nThis is an estimate based on the information provided. The real project value may change as the scope, complexity, deliverables, quantities, functionality, integrations, and requirements become clearer. It is not a final quotation or contract. CYTIC will review your requirements before preparing a detailed proposal.`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${data.quote_id}-estimate.txt`; anchor.click(); URL.revokeObjectURL(url);
  };
  return <Page><section className="confirmation bg-navy text-cream"><div className="site-container py-24 lg:py-32"><Eyebrow light>Awaiting confirmation</Eyebrow><h1 className="display-xl">Your quote has<br />been saved for review.</h1>{data ? <div className="confirmation-grid"><div className="confirmation-summary"><span>Quote ID</span><strong>{data.quote_id}</strong><span>Estimated investment</span><strong>Starting from {formatUGX(data.estimated_price)}+</strong><span>Estimated timeline</span><strong>{data.estimated_weeks_min}–{data.estimated_weeks_max} weeks</strong></div><div><h2>What happens next.</h2>{["Your request has been saved to the CYTIC database.", "We review the brief and project scope.", "We confirm the next steps with you.", "We send the final proposal and approval details."].map((item) => <p key={item}><Check />{item}</p>)}<p className="mt-4 text-cream/70">{data.email_sent === false ? "Your request is waiting for confirmation from the CYTIC team." : "Your quote is saved and waiting for review from the CYTIC team."}</p></div></div> : <p className="mt-10 text-cream/70">Your confirmation details are available in the browser session used to submit the quote.</p>}<div className="mt-12 flex flex-wrap gap-3"><Button asChild variant="gold" size="xl"><Link to="/"><ArrowLeft /> Back to CYTIC</Link></Button>{data && <Button variant="outline" size="xl" className="border-cream/40 text-cream hover:bg-cream hover:text-navy" onClick={download}><Download /> Download Estimate</Button>}</div></div></section></Page>;
}
