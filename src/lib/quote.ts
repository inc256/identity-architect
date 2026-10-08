export const PRICING_VERSION = "2026-cytic-pricing-v2";
export const pricingConfig = {
  rounding: 50000,
  services: {
    "Business Websites": 1200000,
    "E-commerce Websites": 2000000,
    "Web Applications": 1000000,
    "Mobile Applications — Android": 1000000,
    "Mobile Applications — iOS": 1000000,
    "Mobile Applications — Multiplatform": 2000000,
    "Custom Digital Products": 3000000,
    "Logo Design": 100000,
    "Campaign Design": 400000,
    "Graphic Design": 50000,
    "Website UI/UX": 500000,
    "Mobile App UI/UX": 800000,
    "Web App UI/UX": 500000,
    "Wireframes & Prototypes": 600000,
    "Promotional Wear": 30000,
    "Packaging & Product Labels": 50000,
  },
  timelines: {
    "Digital Products": { minDays: 21, maxDays: 90 },
    "Brand Identity & Logo Design": { minDays: 3, maxDays: 14 },
    "UI/UX Design": { minDays: 7, maxDays: 30 },
    "Merchandise Branding": { minDays: 3, maxDays: 14 },
  },
} as const;

export type QuoteState = {
  selectedServices: string[];
  selectedSubServices: string[];
  businessName: string;
  industry: string;
  website: string;
  projectDescription: string;
  projectType: string;
  platform: string;
  scopeDetails: string;
  quantity: string;
  fullName: string;
  email: string;
  phone: string;
  preferredContact: string;
};

export const emptyQuote: QuoteState = {
  selectedServices: [],
  selectedSubServices: [],
  businessName: "",
  industry: "",
  website: "",
  projectDescription: "",
  projectType: "",
  platform: "",
  scopeDetails: "",
  quantity: "",
  fullName: "",
  email: "",
  phone: "",
  preferredContact: "Email",
};

export function getSelectedQuoteItems(q: QuoteState) {
  return q.selectedSubServices;
}

export function getQuoteItemPrice(item: string) {
  return pricingConfig.services[item as keyof typeof pricingConfig.services] ?? 0;
}

export function calculateQuote(q: QuoteState) {
  const selectedTotal = q.selectedSubServices.reduce((sum, item) => sum + getQuoteItemPrice(item), 0);
  const scopeAdjustment = q.selectedServices.includes("Merchandise Branding") && q.quantity ? Math.max(0, Number(q.quantity) - 1) * 50000 : 0;
  const amount = Math.ceil((selectedTotal + scopeAdjustment) / pricingConfig.rounding) * pricingConfig.rounding;
  const upperEstimate = amount + (q.selectedSubServices.length > 1 ? 500000 : 0);
  const selectedItems = getSelectedQuoteItems(q);
  const durations = q.selectedServices
    .map((service) => pricingConfig.timelines[service as keyof typeof pricingConfig.timelines])
    .filter((duration): duration is NonNullable<typeof duration> => Boolean(duration));
  const estimatedDaysMin = durations.length ? Math.max(...durations.map((duration) => duration.minDays)) : 0;
  const estimatedDaysMax = durations.length ? Math.max(...durations.map((duration) => duration.maxDays)) : 0;

  return { amount, startingFrom: amount, selectedTotal, upperEstimate, selectedItems, scopeAdjustment, estimatedDaysMin, estimatedDaysMax };
}

export const formatUGX = (amount: number) => `UGX ${new Intl.NumberFormat("en-UG").format(amount)}`;
export const formatDuration = (days: number) => {
  if (days >= 30) return `${Math.round(days / 7)} month${Math.round(days / 7) === 1 ? "" : "s"}`;
  return `${days} day${days === 1 ? "" : "s"}`;
};
