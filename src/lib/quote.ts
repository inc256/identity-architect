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
  scopeDetails: {
    "digital-products": string;
    "brand-identity-logo-design": string;
    "ui-ux-design": string;
    "merchandise-branding": string;
  };
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
  scopeDetails: {
    "digital-products": "",
    "brand-identity-logo-design": "",
    "ui-ux-design": "",
    "merchandise-branding": "",
  },
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
  const price = pricingConfig.services[item as keyof typeof pricingConfig.services];
  if (price === undefined) {
    throw new Error(`Missing starting price for quote service "${item}".`);
  }
  return price;
}

export function calculateQuote(q: QuoteState) {
  const selectedTotal = q.selectedSubServices.reduce(
    (sum, item) => sum + getQuoteItemPrice(item),
    0,
  );
  const quantity = /^\d+$/.test(q.quantity) ? Number(q.quantity) : Number.NaN;
  const scopeAdjustment =
    q.selectedServices.includes("Merchandise Branding") &&
    Number.isSafeInteger(quantity) &&
    quantity > 1
      ? (quantity - 1) * 50000
      : 0;
  const amount =
    Math.ceil((selectedTotal + scopeAdjustment) / pricingConfig.rounding) * pricingConfig.rounding;
  const selectedItems = getSelectedQuoteItems(q);
  const durations = q.selectedServices
    .map((service) => pricingConfig.timelines[service as keyof typeof pricingConfig.timelines])
    .filter((duration): duration is NonNullable<typeof duration> => Boolean(duration));
  const estimatedDaysMin = durations.length
    ? Math.max(...durations.map((duration) => duration.minDays))
    : 0;
  const estimatedDaysMax = durations.length
    ? Math.max(...durations.map((duration) => duration.maxDays))
    : 0;

  return {
    amount,
    startingFrom: amount,
    selectedTotal,
    selectedItems,
    scopeAdjustment,
    estimatedDaysMin,
    estimatedDaysMax,
  };
}

export const formatUGX = (amount: number) => `UGX ${new Intl.NumberFormat("en-UG").format(amount)}`;
export const formatDuration = (days: number) => {
  if (days >= 30 && days % 30 === 0) return `${days / 30} month${days === 30 ? "" : "s"}`;
  if (days >= 7 && days % 7 === 0) return `${days / 7} week${days === 7 ? "" : "s"}`;
  return `${days} day${days === 1 ? "" : "s"}`;
};
