import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { calculateQuote, PRICING_VERSION, type QuoteState } from "./quote";

const AGENCY_EMAIL = "cyticbrandingagency@gmail.com";
const quoteSchema = z.object({
  businessStage: z.string().min(1), selectedServices: z.array(z.string()).min(1),
  digitalRequirements: z.array(z.string()), businessName: z.string(), industry: z.string().min(1), website: z.string(),
  projectDescription: z.string().min(10), timeline: z.string().min(1), fullName: z.string().min(2), email: z.string().email(), phone: z.string().min(6), preferredContact: z.string().min(1),
});

function formatQuoteEmailBody(quote: QuoteState, estimate: ReturnType<typeof calculateQuote>) {
  const selectedServices = quote.selectedServices.length ? quote.selectedServices.join(", ") : "No services selected";
  const digitalRequirements = quote.digitalRequirements.length ? quote.digitalRequirements.join(", ") : "None";
  return `CYTIC BRANDING AGENCY
Quote request received

Client: ${quote.fullName}
Email: ${quote.email}
Phone: ${quote.phone}
Preferred contact: ${quote.preferredContact}
Business stage: ${quote.businessStage}
Business name: ${quote.businessName || "Not provided"}
Industry: ${quote.industry}
Website: ${quote.website || "Not provided"}

Project description:
${quote.projectDescription}

Selected services:
${selectedServices}

Digital requirements:
${digitalRequirements}

Estimated investment: ${estimate.amount}
Estimated timeline: ${estimate.minWeeks}–${estimate.maxWeeks} weeks

Please confirm next steps and send the client a formal proposal.`;
}

async function sendQuoteEmail(quote: QuoteState, estimate: ReturnType<typeof calculateQuote>) {
  const resendApiKey = process.env["RESEND_API_KEY"];
  const resendFrom = process.env["RESEND_FROM"] || "CYTIC <noreply@cyticbrandingagency.com>";

  if (!resendApiKey) {
    console.info("[Quote email] RESEND_API_KEY not configured. Quote saved for manual confirmation.", {
      to: AGENCY_EMAIL,
      subject: `New quote request from ${quote.fullName}`,
      quoteId: quote.email,
    });
    return { sent: false, provider: "manual-review" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resendFrom,
      to: [AGENCY_EMAIL],
      reply_to: quote.email,
      subject: `New quote request from ${quote.fullName}`,
      text: formatQuoteEmailBody(quote, estimate),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Quote email] Failed to send quote notification.", { status: response.status, body: errorText });
    return { sent: false, provider: "resend-error" };
  }

  return { sent: true, provider: "resend" };
}

export const submitQuote = createServerFn({ method: "POST" }).validator((input) => quoteSchema.parse(input)).handler(async ({ data }) => {
  const quote = data as QuoteState;
  const estimate = calculateQuote(quote);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: row, error } = await supabaseAdmin.from("quote_requests").insert({
    quote_id: "", full_name: quote.fullName, business_name: quote.businessName, email: quote.email, phone: quote.phone,
    preferred_contact: quote.preferredContact, business_stage: quote.businessStage, industry: quote.industry, current_website: quote.website || null,
    project_description: quote.projectDescription, selected_services: quote.selectedServices,
    brand_scope: "Not selected", digital_requirements: quote.digitalRequirements, timeline: quote.timeline, estimated_price: estimate.amount,
    estimated_weeks_min: estimate.minWeeks, estimated_weeks_max: estimate.maxWeeks, pricing_version: PRICING_VERSION,
  }).select("quote_id, estimated_price, estimated_weeks_min, estimated_weeks_max").single();
  if (error || !row) throw new Error("We couldn't save your quote. Please try again.");

  const emailStatus = await sendQuoteEmail(quote, estimate);
  return {
    ...row,
    email_sent: emailStatus.sent,
    confirmation_status: "pending_confirmation",
    email_provider: emailStatus.provider,
    contact_email: AGENCY_EMAIL,
  };
});
