import novaImage from "@/assets/project-nova.jpg";
import koraImage from "@/assets/project-kora.jpg";
import miraImage from "@/assets/project-mira.jpg";

export type ServiceItem = { label: string; detail: string };

export const services: { id: string; number: string; title: string; line: string; items: readonly ServiceItem[] }[] = [
  { id: "digital-products", number: "01", title: "Digital Products", line: "Purpose-built business websites, applications, and custom digital products.", items: [
    { label: "Business Websites", detail: "Professional websites that communicate your value clearly." },
    { label: "E-commerce Websites", detail: "Online stores built to present products and drive sales." },
    { label: "Web Applications", detail: "Responsive applications designed around real business workflows." },
    { label: "Mobile Applications", detail: "Polished mobile experiences for Android and iOS users." },
    { label: "Custom Digital Products", detail: "Tailored digital solutions built around your specific needs." },
  ] },
  { id: "brand-identity-logo-design", number: "02", title: "Brand Identity & Logo Design", line: "Distinctive visual identities and brand communications that keep your business recognizable.", items: [
    { label: "Logo Design", detail: "A memorable brand mark designed to anchor your identity." },
    { label: "Campaign Design", detail: "Focused campaign visuals that connect your message with your audience." },
    { label: "Graphics Design", detail: "Consistent design assets across digital and print touchpoints." },
  ] },
  { id: "ui-ux-design", number: "03", title: "UI/UX Design", line: "Clear, intuitive interfaces shaped around user needs and business goals.", items: [
    { label: "Website UI/UX", detail: "Thoughtful website experiences that guide users with confidence." },
    { label: "Mobile App UI/UX", detail: "User-centered mobile interfaces designed for clarity and ease." },
    { label: "Web App UI/UX", detail: "Web application experiences built around efficient workflows." },
    { label: "Wireframes & Prototypes", detail: "Interactive concepts that validate structure, flow, and direction." },
  ] },
  { id: "merchandise-branding", number: "04", title: "Merchandise Branding", line: "Consistent brand applications across promotional products and packaging.", items: [
    { label: "Promotional Wear", detail: "Branded clothing and apparel that carry your identity outward." },
    { label: "Packaging & Product Labels", detail: "Packaging and labels designed to make your brand memorable." },
  ] },
] as const;

export const projects = [
  { slug: "nova", name: "NOVA", industry: "Technology", services: "Brand Strategy · Identity · Digital", image: novaImage, width: 1200, height: 1504, intro: "A conceptual identity system for technology with a clearer human signal.", challenge: "Make an ambitious technology idea feel credible, useful, and unmistakably human.", thinking: "We built the concept around navigation: a precise signal that turns complexity into direction.", outcome: "A flexible identity designed to move from first pitch to product interface without losing recognition." },
  { slug: "kora", name: "KORA", industry: "Hospitality", services: "Rebrand · Identity · Packaging", image: koraImage, width: 1536, height: 1024, intro: "A conceptual hospitality brand shaped around quiet, considered detail.", challenge: "Create a premium presence that feels warm rather than formal, and memorable without excess.", thinking: "The system uses restraint as character—tactile materials, a singular mark, and space to breathe.", outcome: "A hospitable identity that can live naturally across menus, packaging, spaces, and service." },
  { slug: "mira", name: "MIRA", industry: "Finance", services: "Strategy · Identity · Digital", image: miraImage, width: 1200, height: 1504, intro: "A conceptual finance identity designed to make progress feel tangible.", challenge: "Build trust in a category where brands often look and sound the same.", thinking: "We translated progress into a measured graphic language—calm, exact, and built for clarity.", outcome: "A distinct system that carries confidence from business materials into the digital product." },
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
