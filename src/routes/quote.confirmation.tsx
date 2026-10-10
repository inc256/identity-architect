import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Page, Eyebrow } from "@/components/site/SiteShell";
import { formatDuration, formatUGX, getQuoteItemPrice } from "@/lib/quote";

type Confirmation = {
  estimated_price: number;
  estimated_weeks_min: number;
  estimated_weeks_max: number;
  estimated_days_min: number;
  estimated_days_max: number;
  selectedServices: string[];
  selectedSubServices: string[];
  businessName: string;
  scopeAdjustment: number;
};

const estimateDisclaimer =
  "This is an estimate based on the information provided. The real project value may change as the scope, complexity, deliverables, revisions, quantities, functionality, integrations, and requirements become clearer. It is not a final quotation or contract. CYTIC will review your requirements before preparing a detailed proposal.";

export const Route = createFileRoute("/quote/confirmation")({
  head: () => ({
    meta: [{ title: "Quote Received — CYTIC CREATIVES" }, { name: "robots", content: "noindex" }],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const [data, setData] = useState<Confirmation | null>(null);
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("cytic-confirmation");
      if (saved) setData(JSON.parse(saved));
    } catch (error) {
      console.error("[Quote] Invalid confirmation data in this browser session", error);
      sessionStorage.removeItem("cytic-confirmation");
    }
  }, []);

  const download = () => {
    if (!data) return;
    const text = [
      "CYTIC CREATIVES",
      "ESTIMATE — NOT A FINAL CONTRACT",
      "",
      `Business: ${data.businessName || "Not provided"}`,
      `Starting-from estimate: ${formatUGX(data.estimated_price)}+`,
      `Indicative delivery: ${formatDuration(data.estimated_days_min)} to ${formatDuration(data.estimated_days_max)}`,
      "",
      "Selected services:",
      ...data.selectedServices.map((service) => `- ${service}`),
      "",
      "Selected sub-services and starting prices:",
      ...data.selectedSubServices.map(
        (item) => `- ${item}: ${formatUGX(getQuoteItemPrice(item))}+`,
      ),
      ...(data.scopeAdjustment > 0
        ? ["", `Scope-based adjustment: ${formatUGX(data.scopeAdjustment)}`]
        : []),
      "",
      estimateDisclaimer,
    ].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `CYTIC-estimate-${new Date().toISOString().slice(0, 10)}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Page>
      <section className="confirmation bg-navy text-cream">
        <div className="site-container py-24 lg:py-32">
          <Eyebrow light>Request received</Eyebrow>
          <h1 className="display-xl">
            Your quote is
            <br />
            saved for review.
          </h1>
          {data ? (
            <div className="confirmation-grid">
              <div className="confirmation-summary">
                <span>Starting-from estimate</span>
                <strong>{formatUGX(data.estimated_price)}+</strong>
                <span>Indicative delivery</span>
                <strong>
                  {formatDuration(data.estimated_days_min)} –{" "}
                  {formatDuration(data.estimated_days_max)}
                </strong>
                <span>Selected services</span>
                {data.selectedServices.map((service) => (
                  <strong key={service}>{service}</strong>
                ))}
              </div>
              <div>
                <h2>Selected sub-services</h2>
                {data.selectedSubServices.map((item) => (
                  <p key={item}>
                    <Check />
                    <span>
                      {item} — starting from {formatUGX(getQuoteItemPrice(item))}+
                    </span>
                  </p>
                ))}
                {data.scopeAdjustment > 0 && (
                  <p className="mt-4 text-cream/70">
                    Scope-based adjustment: {formatUGX(data.scopeAdjustment)}
                  </p>
                )}
                <h2 className="mt-8">What happens next.</h2>
                {[
                  "CYTIC reviews your brief and project scope.",
                  "We confirm the next steps with you.",
                  "We prepare a detailed proposal for your project.",
                ].map((item) => (
                  <p key={item}>
                    <Check />
                    {item}
                  </p>
                ))}
                <p className="mt-4 text-cream/70">
                  Your request has been saved and is waiting for review by the CYTIC team.
                </p>
              </div>
              <p className="disclaimer confirmation-disclaimer">{estimateDisclaimer}</p>
            </div>
          ) : (
            <p className="mt-10 text-cream/70">
              Your confirmation details are available in the browser session used to submit the
              quote.
            </p>
          )}
          <div className="mt-12 flex flex-wrap gap-3">
            <Button asChild variant="gold" size="xl">
              <Link to="/">
                <ArrowLeft /> Back to CYTIC
              </Link>
            </Button>
            {data && (
              <Button
                variant="outline"
                size="xl"
                className="border-cream/40 text-cream hover:bg-cream hover:text-navy"
                onClick={download}
              >
                <Download /> Download Estimate
              </Button>
            )}
          </div>
        </div>
      </section>
    </Page>
  );
}
