export const PRICING_VERSION = "2026-placeholder-v1";
export const pricingConfig = {
  minimum: 1800000,
  packageMultipliers: { essential: 1, complete: 1.35, signature: 1.75 },
  services: {
    "Brand Discovery": 650000, "Brand Strategy": 1200000, "Brand Positioning": 800000, Naming: 900000, "Brand Messaging": 750000,
    "Logo Design": 900000, "Visual Identity": 1600000, "Brand Guidelines": 800000,
    "Marketing Materials": 550000, Packaging: 900000, "Business Materials": 450000, "Campaign Design": 850000, "Brand Collateral": 550000,
    "Website Design": 1800000, "UI/UX Design": 1700000, "App Development": 4500000, "Digital Brand Experience": 1400000, "Landing Page": 950000,
  },
  digitalMultipliers: { "Landing page": 1, "Company website": 1.25, "E-commerce": 1.55, "Web application": 1.8, Android: 1.25, iOS: 1.25, "Cross-platform": 1.45, "Not sure": 1 },
} as const;

export type QuoteState = {
  businessStage: string; selectedServices: string[]; brandScope: "" | keyof typeof pricingConfig.packageMultipliers;
  digitalRequirements: string[]; businessName: string; industry: string; website: string; onlinePresence: string;
  projectDescription: string; timeline: string; fullName: string; email: string; phone: string; preferredContact: string;
};
export const emptyQuote: QuoteState = { businessStage: "", selectedServices: [], brandScope: "", digitalRequirements: [], businessName: "", industry: "", website: "", onlinePresence: "", projectDescription: "", timeline: "", fullName: "", email: "", phone: "", preferredContact: "Email" };
export function isDigitalService(name: string) { return ["Website Design", "UI/UX Design", "App Development", "Digital Brand Experience", "Landing Page"].includes(name); }
export function calculateQuote(q: QuoteState) {
  const base = q.selectedServices.reduce((sum, item) => sum + (pricingConfig.services[item as keyof typeof pricingConfig.services] ?? 0), 0);
  const packageMultiplier = q.brandScope ? pricingConfig.packageMultipliers[q.brandScope] : 1;
  const digitalMultiplier = q.digitalRequirements.reduce((max, item) => Math.max(max, pricingConfig.digitalMultipliers[item as keyof typeof pricingConfig.digitalMultipliers] ?? 1), 1);
  const amount = Math.max(pricingConfig.minimum, Math.round((base * packageMultiplier * digitalMultiplier) / 50000) * 50000);
  const scopeWeeks = q.brandScope === "signature" ? 4 : q.brandScope === "complete" ? 2 : 0;
  const digitalWeeks = q.selectedServices.some((s) => s === "App Development") ? 8 : q.selectedServices.some(isDigitalService) ? 4 : 0;
  const serviceWeeks = Math.min(5, Math.ceil(q.selectedServices.length / 3));
  return { amount, minWeeks: 3 + scopeWeeks + digitalWeeks + serviceWeeks, maxWeeks: 5 + scopeWeeks + digitalWeeks + serviceWeeks };
}
export const formatUGX = (amount: number) => `UGX ${new Intl.NumberFormat("en-UG").format(amount)}`;
