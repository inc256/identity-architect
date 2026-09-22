import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { calculateQuote, PRICING_VERSION, type QuoteState } from "./quote";

const quoteSchema = z.object({
  businessStage: z.string().min(1), selectedServices: z.array(z.string()).min(1), brandScope: z.enum(["essential", "complete", "signature"]),
  digitalRequirements: z.array(z.string()), businessName: z.string().min(1), industry: z.string().min(1), website: z.string(), onlinePresence: z.string(),
  projectDescription: z.string().min(10), timeline: z.string().min(1), fullName: z.string().min(2), email: z.string().email(), phone: z.string().min(6), preferredContact: z.string().min(1),
});
export const submitQuote = createServerFn({ method: "POST" }).inputValidator((input) => quoteSchema.parse(input)).handler(async ({ data }) => {
  const quote = data as QuoteState;
  const estimate = calculateQuote(quote);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: row, error } = await supabaseAdmin.from("quote_requests").insert({
    quote_id: "", full_name: quote.fullName, business_name: quote.businessName, email: quote.email, phone: quote.phone,
    preferred_contact: quote.preferredContact, business_stage: quote.businessStage, industry: quote.industry, current_website: quote.website || null,
    online_presence: quote.onlinePresence || null, project_description: quote.projectDescription, selected_services: quote.selectedServices,
    brand_scope: quote.brandScope, digital_requirements: quote.digitalRequirements, timeline: quote.timeline, estimated_price: estimate.amount,
    estimated_weeks_min: estimate.minWeeks, estimated_weeks_max: estimate.maxWeeks, pricing_version: PRICING_VERSION,
  }).select("quote_id, estimated_price, estimated_weeks_min, estimated_weeks_max").single();
  if (error || !row) throw new Error("We couldn't save your quote. Please try again.");
  return row;
});
