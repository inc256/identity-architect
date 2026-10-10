import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  calculateQuote,
  formatDuration,
  PRICING_VERSION,
  pricingConfig,
  type QuoteState,
} from "./quote";
import { services as serviceDefinitions } from "@/data/site";

const serviceNames = Object.keys(pricingConfig.timelines);
const subServiceNames = Object.keys(pricingConfig.services);
const serviceGroupByItem = Object.fromEntries(
  serviceDefinitions.flatMap((service) =>
    service.items.map((item) => [item.label, service.title] as const),
  ),
);
const selectableItems = serviceDefinitions.flatMap((service) =>
  service.items.map((item) => item.label),
);

if (
  serviceNames.some(
    (service) => !serviceDefinitions.some((definition) => definition.title === service),
  ) ||
  serviceDefinitions.some((service) => !serviceNames.includes(service.title)) ||
  selectableItems.some((item) => !subServiceNames.includes(item)) ||
  subServiceNames.some((item) => !serviceGroupByItem[item])
) {
  throw new Error("Quote service definitions and pricing configuration are out of sync.");
}

const quoteSchema = z
  .object({
    selectedServices: z
      .array(z.string().refine((value) => serviceNames.includes(value)))
      .min(1)
      .max(serviceNames.length),
    selectedSubServices: z
      .array(z.string().refine((value) => subServiceNames.includes(value)))
      .min(1)
      .max(subServiceNames.length),
    businessName: z.string().max(160),
    industry: z.string().trim().min(1).max(120),
    website: z.string().max(500),
    projectDescription: z.string().trim().min(10).max(3000),
    projectType: z
      .string()
      .max(100)
      .refine(
        (value) =>
          value === "" ||
          [
            "Website",
            "E-commerce website",
            "Web application",
            "Mobile application",
            "Custom digital product",
          ].includes(value),
      ),
    platform: z
      .string()
      .max(100)
      .refine(
        (value) =>
          value === "" ||
          ["Android", "iOS", "Multiplatform", "Web only", "Not sure"].includes(value),
      ),
    scopeDetails: z.object({
      "digital-products": z.string().max(3000),
      "brand-identity-logo-design": z.string().max(3000),
      "ui-ux-design": z.string().max(3000),
      "merchandise-branding": z.string().max(3000),
    }),
    quantity: z.string().max(12).regex(/^\d*$/),
    fullName: z.string().trim().min(2).max(160),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().min(6).max(40),
    preferredContact: z.enum(["Email", "Phone", "WhatsApp"]),
  })
  .superRefine((quote, context) => {
    if (new Set(quote.selectedServices).size !== quote.selectedServices.length) {
      context.addIssue({
        code: "custom",
        path: ["selectedServices"],
        message: "Duplicate service groups are not allowed.",
      });
    }
    if (new Set(quote.selectedSubServices).size !== quote.selectedSubServices.length) {
      context.addIssue({
        code: "custom",
        path: ["selectedSubServices"],
        message: "Duplicate sub-services are not allowed.",
      });
    }
    for (const item of quote.selectedSubServices) {
      if (!quote.selectedServices.includes(serviceGroupByItem[item])) {
        context.addIssue({
          code: "custom",
          path: ["selectedSubServices"],
          message: "Every selected sub-service must belong to a selected service group.",
        });
      }
    }
    for (const service of quote.selectedServices) {
      if (!quote.selectedSubServices.some((item) => serviceGroupByItem[item] === service)) {
        context.addIssue({
          code: "custom",
          path: ["selectedServices"],
          message: "Select at least one sub-service for every selected service group.",
        });
      }
    }
    if (quote.selectedServices.includes("Merchandise Branding")) {
      const quantity = /^\d+$/.test(quote.quantity) ? Number(quote.quantity) : Number.NaN;
      if (!Number.isSafeInteger(quantity) || quantity < 1) {
        context.addIssue({
          code: "custom",
          path: ["quantity"],
          message: "Enter a whole merchandise quantity greater than zero.",
        });
      }
    }
  });

export const submitQuote = createServerFn({ method: "POST" })
  .validator((input) => quoteSchema.parse(input))
  .handler(async ({ data }) => {
    const quote = data as QuoteState;
    const estimate = calculateQuote(quote);
    const scopeDetails = {
      projectType: quote.selectedServices.includes("Digital Products") ? quote.projectType : "",
      platform: quote.selectedServices.includes("Digital Products") ? quote.platform : "",
      digitalProducts: quote.selectedServices.includes("Digital Products")
        ? quote.scopeDetails["digital-products"]
        : "",
      brandIdentityLogoDesign: quote.selectedServices.includes("Brand Identity & Logo Design")
        ? quote.scopeDetails["brand-identity-logo-design"]
        : "",
      uiUxDesign: quote.selectedServices.includes("UI/UX Design")
        ? quote.scopeDetails["ui-ux-design"]
        : "",
      merchandiseBranding: quote.selectedServices.includes("Merchandise Branding")
        ? quote.scopeDetails["merchandise-branding"]
        : "",
      merchandiseQuantity: quote.selectedServices.includes("Merchandise Branding")
        ? quote.quantity
        : "",
    };
    const deliveryRange = `${formatDuration(estimate.estimatedDaysMin)} to ${formatDuration(estimate.estimatedDaysMax)}`;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("quote_requests").insert({
      quote_id: "",
      full_name: quote.fullName,
      business_name: quote.businessName.trim() || "Not provided",
      email: quote.email,
      phone: quote.phone,
      preferred_contact: quote.preferredContact,
      business_stage: "Not provided",
      industry: quote.industry,
      current_website: quote.website.trim() || null,
      online_presence: null,
      project_description: quote.projectDescription,
      selected_services: quote.selectedServices,
      brand_scope: JSON.stringify(scopeDetails),
      digital_requirements: {
        selectedSubServices: quote.selectedSubServices,
        scope: scopeDetails,
      },
      timeline: `Indicative delivery: ${deliveryRange}`,
      estimated_price: estimate.amount,
      estimated_weeks_min: Math.max(1, Math.ceil(estimate.estimatedDaysMin / 7)),
      estimated_weeks_max: Math.max(1, Math.ceil(estimate.estimatedDaysMax / 7)),
      pricing_version: PRICING_VERSION,
      status: "New",
    });

    if (error) {
      console.error("[Supabase] Quote request insert failed", {
        code: error.code,
        message: error.message,
      });
      throw new Error("We couldn't save your quote. Please try again or contact CYTIC directly.");
    }
    return {
      estimated_price: estimate.amount,
      estimated_weeks_min: Math.max(1, Math.ceil(estimate.estimatedDaysMin / 7)),
      estimated_weeks_max: Math.max(1, Math.ceil(estimate.estimatedDaysMax / 7)),
      estimated_days_min: estimate.estimatedDaysMin,
      estimated_days_max: estimate.estimatedDaysMax,
      email_sent: false,
      confirmation_status: "pending_confirmation",
      email_provider: "supabase-only",
      contact_email: null,
    };
  });
