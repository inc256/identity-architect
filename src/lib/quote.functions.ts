import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { calculateQuote, PRICING_VERSION, type QuoteState } from "./quote";

const quoteSchema = z.object({
  selectedServices: z.array(z.string()).min(1),
  selectedSubServices: z.array(z.string()).min(1),
  businessName: z.string(),
  industry: z.string().min(1),
  website: z.string(),
  projectDescription: z.string().min(10),
  projectType: z.string(),
  platform: z.string(),
  scopeDetails: z.string(),
  quantity: z.string(),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  preferredContact: z.string().min(1),
});

export const submitQuote = createServerFn({ method: "POST" }).validator((input) => quoteSchema.parse(input)).handler(async ({ data }) => {
  const quote = data as QuoteState;
  const estimate = calculateQuote(quote);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: row, error } = await supabaseAdmin.from("quote_requests").insert({
    quote_id: "", full_name: quote.fullName, business_name: quote.businessName, email: quote.email, phone: quote.phone,
    preferred_contact: quote.preferredContact, industry: quote.industry, current_website: quote.website || null,
    project_description: quote.projectDescription, selected_services: quote.selectedServices,
    brand_scope: quote.scopeDetails || "Not provided", digital_requirements: quote.selectedSubServices,
    estimated_price: estimate.amount, estimated_weeks_min: Math.ceil(estimate.estimatedDaysMin / 7), estimated_weeks_max: Math.ceil(estimate.estimatedDaysMax / 7), pricing_version: PRICING_VERSION,
  }).select("quote_id, estimated_price, estimated_weeks_min, estimated_weeks_max").single();

  if (error || !row) throw new Error("We couldn't save your quote. Please try again.");

  return {
    ...row,
    email_sent: false,
    confirmation_status: "pending_confirmation",
    email_provider: "supabase-only",
    contact_email: null,
  };
});
