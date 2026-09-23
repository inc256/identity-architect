import novaImage from "@/assets/project-nova.jpg";
import koraImage from "@/assets/project-kora.jpg";
import miraImage from "@/assets/project-mira.jpg";

export type ServiceItem = { label: string; detail: string };

export const services: { id: string; number: string; title: string; line: string; items: readonly ServiceItem[] }[] = [
  { id: "strategy", number: "01", title: "Strategy", line: "Clarify the direction behind the brand.", items: [
    { label: "Brand Discovery", detail: "Understand the business, audience, challenge, and opportunity." },
    { label: "Brand Strategy", detail: "Define the brand direction, purpose, and long-term positioning." },
    { label: "Brand Positioning", detail: "Clarify how the brand should stand apart in the market." },
    { label: "Naming", detail: "Develop a strong, memorable name and naming strategy for the business or offer." },
  ] },
  { id: "identity", number: "02", title: "Identity", line: "Build a recognizable visual system.", items: [
    { label: "Logo Design", detail: "Create a distinctive symbol that anchors the brand." },
    { label: "Visual Identity", detail: "Shape the full visual language across typography, color, and imagery." },
    { label: "Brand Guidelines", detail: "Document how the identity should be used consistently across touchpoints." },
  ] },
  { id: "expression", number: "03", title: "Expression", line: "Shape the campaign idea and its expression.", items: [
    { label: "Campaign Design", detail: "Turn the brand story into campaigns that feel coherent and compelling." },
  ] },
  { id: "digital", number: "04", title: "Digital", line: "Extend the brand into digital products.", items: [
    { label: "Landing Pages", detail: "Create a focused conversion experience for a campaign, offer, or announcement." },
    { label: "Website Design", detail: "Design a brand-led website that communicates clearly and converts better." },
    { label: "UI/UX Design", detail: "Map user flows and design digital interfaces that are intuitive and polished." },
    { label: "E-commerce", detail: "Build an online storefront with product presentation, conversion, and trust cues." },
    { label: "Web Application", detail: "Design and structure complex browser-based products and customer journeys." },
    { label: "Android App", detail: "Craft a mobile experience built for Android usability and product goals." },
    { label: "iOS App", detail: "Design a native iOS experience with strong user experience and clarity." },
    { label: "Cross-platform App", detail: "Create one consistent product experience across multiple devices and platforms." },
    { label: "Digital Brand Experience", detail: "Align digital touchpoints into a seamless brand experience across channels." },
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
