export type ServiceItem = { label: string; detail: string };

export const businessAddress = "Afri Courts, 69 Buganda Rd, Kampala";
export const businessMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessAddress)}`;

export const services: {
  id: string;
  number: string;
  title: string;
  line: string;
  items: readonly ServiceItem[];
}[] = [
  {
    id: "digital-products",
    number: "01",
    title: "Digital Products",
    line: "Websites, e-commerce platforms, web applications, mobile applications, and custom digital products.",
    items: [
      {
        label: "Business Websites",
        detail: "Professional websites that communicate your value clearly.",
      },
      {
        label: "E-commerce Websites",
        detail: "Online stores built to present products and drive sales.",
      },
      {
        label: "Web Applications",
        detail: "Responsive applications designed around real business workflows.",
      },
      {
        label: "Mobile Applications — Android",
        detail: "Native Android applications for mobile users.",
      },
      {
        label: "Mobile Applications — iOS",
        detail: "Native iOS applications for iPhone and iPad users.",
      },
      {
        label: "Mobile Applications — Multiplatform",
        detail: "One application experience built for multiple mobile platforms.",
      },
      {
        label: "Custom Digital Products",
        detail: "Tailored digital solutions built around your specific needs.",
      },
    ],
  },
  {
    id: "brand-identity-logo-design",
    number: "02",
    title: "Brand Identity & Logo Design",
    line: "Logos, campaign visuals, and graphic design for building a recognizable brand presence.",
    items: [
      { label: "Logo Design", detail: "A memorable brand mark designed to anchor your identity." },
      {
        label: "Campaign Design",
        detail: "Focused campaign visuals that connect your message with your audience.",
      },
      {
        label: "Graphic Design",
        detail: "Consistent design assets across digital and print touchpoints.",
      },
    ],
  },
  {
    id: "ui-ux-design",
    number: "03",
    title: "UI/UX Design",
    line: "User interface and experience design for websites, mobile apps, and web applications, from wireframes to prototypes.",
    items: [
      {
        label: "Website UI/UX",
        detail: "Thoughtful website experiences that guide users with confidence.",
      },
      {
        label: "Mobile App UI/UX",
        detail: "User-centered mobile interfaces designed for clarity and ease.",
      },
      {
        label: "Web App UI/UX",
        detail: "Web application experiences built around efficient workflows.",
      },
      {
        label: "Wireframes & Prototypes",
        detail: "Interactive concepts that validate structure, flow, and direction.",
      },
    ],
  },
  {
    id: "merchandise-branding",
    number: "04",
    title: "Merchandise Branding",
    line: "Branding for promotional wear, packaging, and product labels.",
    items: [
      {
        label: "Promotional Wear",
        detail: "Branded clothing and apparel that carry your identity outward.",
      },
      {
        label: "Packaging & Product Labels",
        detail: "Packaging and labels designed to make your brand memorable.",
      },
    ],
  },
] as const;

export const process = [
  ["01", "Discover", "We understand your business, audience, ambition, and challenge."],
  ["02", "Define", "We establish the strategic foundation of the brand."],
  ["03", "Design", "We translate strategy into a distinctive visual identity."],
  ["04", "Build", "We develop the brand system and experiences it needs."],
  ["05", "Launch", "We prepare the brand to show up consistently and confidently."],
] as const;

export const audiences = [
  ["Starting something", "For founders turning an idea into a real business."],
  ["Growing something", "For businesses ready to build a stronger presence."],
  ["Rebuilding something", "For companies ready for a new identity."],
  ["Scaling something", "For established businesses that need a brand built for their next stage."],
] as const;
