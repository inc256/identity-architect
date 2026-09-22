import novaImage from "@/assets/project-nova.jpg";
import koraImage from "@/assets/project-kora.jpg";
import miraImage from "@/assets/project-mira.jpg";

export const services = [
  { id: "strategy", number: "01", title: "Strategy", line: "Define what the brand stands for.", items: ["Brand Discovery", "Brand Strategy", "Brand Positioning", "Naming", "Brand Messaging"] },
  { id: "identity", number: "02", title: "Identity", line: "Give the brand a recognizable identity.", items: ["Logo Design", "Visual Identity", "Typography", "Color Systems", "Brand Guidelines"] },
  { id: "expression", number: "03", title: "Expression", line: "Bring the identity into the real world.", items: ["Marketing Materials", "Packaging", "Business Materials", "Campaign Design", "Brand Collateral"] },
  { id: "digital", number: "04", title: "Digital", line: "Build the brand’s products and experiences.", items: ["Website Design", "UI/UX Design", "App Development", "Digital Brand Experience", "Landing Pages"] },
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
