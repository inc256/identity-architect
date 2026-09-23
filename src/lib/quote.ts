export const PRICING_VERSION = "2026-cytic-pricing-v1";
export const pricingConfig = {
  minimum: 1800000,
  rounding: 50000,
  services: {
    "Brand Discovery": 800000, "Brand Strategy": 1000000, "Brand Positioning": 800000, Naming: 100000,
    "Logo Design": 50000, "Visual Identity": 1600000, "Brand Guidelines": 800000,
    "Campaign Design": 850000,
    "Landing Page": 600000, "Website Design": 1000000, "UI/UX Design": 800000, "E-commerce": 2500000,
    "Web Application": 3000000, "Android App": 800000, "iOS App": 800000, "Cross-platform App": 2000000,
    "Digital Brand Experience": 1000000,
  },
  digitalRequirements: { "Landing page": 600000, "Company website": 1000000, "E-commerce": 2500000, "Web application": 3000000, Android: 800000, iOS: 800000, "Cross-platform": 2000000, "Not sure": 0 },
  durations: {
    "Logo Design": [5, 10], "Brand Discovery": [3, 5], "Brand Strategy": [3, 5], "Brand Positioning": [3, 5], Naming: [2, 5],
    "Visual Identity": [5, 10], "Brand Guidelines": [2, 5], "Campaign Design": [2, 5], "Landing Page": [5, 10],
    "Website Design": [10, 60], "UI/UX Design": [10, 20], "E-commerce": [20, 60], "Web Application": [15, 60],
    "Android App": [15, 60], "iOS App": [15, 60], "Cross-platform App": [20, 120], "Digital Brand Experience": [15, 40],
  },
} as const;

export type QuoteState = {
  businessStage: string; selectedServices: string[]; digitalRequirements: string[];
  businessName: string; industry: string; website: string;
  projectDescription: string; timeline: string; fullName: string; email: string; phone: string; preferredContact: string;
};
export const emptyQuote: QuoteState = { businessStage: "", selectedServices: [], digitalRequirements: [], businessName: "", industry: "", website: "", projectDescription: "", timeline: "", fullName: "", email: "", phone: "", preferredContact: "Email" };
const digitalLabels: Record<string, string> = { "Landing page": "Landing Page", "Company website": "Website Design", "E-commerce": "E-commerce", "Web application": "Web Application", Android: "Android App", iOS: "iOS App", "Cross-platform": "Cross-platform App", "Not sure": "Not sure" };
export function getSelectedQuoteItems(q: QuoteState) { return [...q.selectedServices, ...q.digitalRequirements.map((item) => digitalLabels[item] ?? item)]; }
export function formatDuration(days: number) {
  if (days <= 0) return "To be confirmed";
  if (days < 7) return `${days} day${days === 1 ? "" : "s"}`;
  if (days < 30) {
    if (days >= 28) return "1 month";
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    return remainingDays ? `${weeks} week${weeks === 1 ? "" : "s"} and ${remainingDays} day${remainingDays === 1 ? "" : "s"}` : `${weeks} week${weeks === 1 ? "" : "s"}`;
  }
  const months = Math.floor(days / 30);
  const remainingDays = days % 30;
  if (months >= 12) {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    const parts = [`${years} year${years === 1 ? "" : "s"}`];
    if (remainingMonths) parts.push(`${remainingMonths} month${remainingMonths === 1 ? "" : "s"}`);
    if (remainingDays) parts.push(`${remainingDays} day${remainingDays === 1 ? "" : "s"}`);
    return parts.join(" and ");
  }
  return remainingDays ? `${months} month${months === 1 ? "" : "s"} and ${remainingDays} day${remainingDays === 1 ? "" : "s"}` : `${months} month${months === 1 ? "" : "s"}`;
}
export function getQuoteItemPrice(item: string) { return pricingConfig.services[item as keyof typeof pricingConfig.services] ?? 0; }
export function getQuoteItemDuration(item: string) { return pricingConfig.durations[item as keyof typeof pricingConfig.durations] ?? [0, 0]; }
export function isDigitalService(name: string) { return ["Landing Page", "Website Design", "UI/UX Design", "E-commerce", "Web Application", "Android App", "iOS App", "Cross-platform App", "Digital Brand Experience"].includes(name); }
export function calculateQuote(q: QuoteState) {
  const serviceStartingTotal = q.selectedServices.reduce((sum, item) => sum + (pricingConfig.services[item as keyof typeof pricingConfig.services] ?? 0), 0);
  const digitalStartingTotal = q.digitalRequirements.reduce((sum, item) => sum + (pricingConfig.digitalRequirements[item as keyof typeof pricingConfig.digitalRequirements] ?? 0), 0);
  const selectedTotal = serviceStartingTotal + digitalStartingTotal;
  const selectedItems = getSelectedQuoteItems(q);
  const [minDays, maxDays] = selectedItems.reduce(([min, max], item) => { const duration = pricingConfig.durations[item as keyof typeof pricingConfig.durations]; return [min + (duration?.[0] ?? 0), max + (duration?.[1] ?? 0)]; }, [0, 0]);
  const amount = Math.max(pricingConfig.minimum, selectedTotal);
  const startingFrom = Math.ceil(amount / pricingConfig.rounding) * pricingConfig.rounding;
  const complexityBuffer = q.digitalRequirements.length > 1 ? 500000 : 0;
  const upperEstimate = startingFrom + complexityBuffer + (q.selectedServices.length > 4 ? 500000 : 0);
  return { amount: startingFrom, startingFrom, selectedTotal, upperEstimate, minDays, maxDays, minWeeks: Math.ceil(minDays / 5), maxWeeks: Math.ceil(maxDays / 5), selectedItems };
}
export const formatUGX = (amount: number) => `UGX ${new Intl.NumberFormat("en-UG").format(amount)}`;
