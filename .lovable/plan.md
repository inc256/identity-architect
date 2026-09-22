# CYTIC Branding Agency Website

## Goal
Build a complete, production-ready CYTIC website that feels like a world-class branding studio: bold, minimal, editorial, highly visual, and unmistakably CYTIC. The experience will center the exact motto **“Identity that hits differently.”**, foreground selected work, explain the full brand system, and turn qualified visitors into stored quote requests.

## Visual direction
- Build an original editorial system inspired by high-end branding studios without copying Koto’s layouts, work, wording, media, or code.
- Use CYTIC Navy `#1F2A44` as the anchor, Warm Cream `#E8DCC8` as the breathing surface, and Premium Gold `#C6A75E` as a restrained accent.
- Use a premium modern sans-serif, oversized multi-line headlines, compact uppercase labels, strict grid lines, asymmetric compositions, and minimal shadows/rounding.
- Generate a cohesive set of clearly fictional concept visuals for NOVA, KORA, and MIRA; label them as placeholder concepts and keep the data/assets easy to replace.
- Add restrained reveal, mask, image-scale, arrow, sticky, and cursor-response motion with reduced-motion fallbacks.
- Create deliberately recomposed tablet/mobile layouts, including a compact menu and touch-friendly quote flow.

## Public website
- Shared sticky navigation, mobile drawer, global footer, strong contact/quote calls to action, and accessible focus/keyboard behavior.
- `/` — hero, brand statement, asymmetric selected-work grid, service overview, “A logo is only the beginning,” audiences, process, final CTA.
- `/work` — editorial project index with replaceable concept projects.
- `/work/$slug` — reusable case-study template covering challenge, thinking, identity, expression, digital, outcome, and next-project CTA.
- `/services` — four interactive pillars: Strategy, Identity, Expression, Digital. App Development is prominent under Digital; Social Media is excluded.
- `/process` — large-number five-stage process presentation.
- `/about` — purpose, vision, mission, personality, differentiation, and “Distinct by design.”
- `/contact` — quote-first contact page with clearly labeled placeholders for email, phone, location, and social profiles.
- `/privacy` and `/terms` — concise placeholder legal pages clearly marked for CYTIC review.
- Every content route gets unique titles, descriptions, Open Graph metadata, Twitter metadata, and canonical URLs. Add sitemap and robots coverage plus organization/professional-service structured data where appropriate.

## Quote experience
- `/quote` — premium six-step configuration flow with progress, back/forward controls, session persistence, accessible validation, and context-aware digital questions.
- Keep all service pricing, package multipliers, complexity rules, digital adjustments, add-ons, minimum project price, and timeline rules in one typed pricing module; never show the formula.
- Show a clear estimate summary with selected services, package, investment in UGX, timeline, disclaimer, “Adjust My Quote,” and continuation action.
- Capture full name, business name, email, phone, project details, and preferred contact method before final submission.
- `/quote/confirmation` — show the generated CYTIC quote ID, estimate, selected services, next steps, return action, and a downloadable estimate marked as non-contractual.
- Preserve quote state during the session and prevent incomplete or invalid submission.

## Data and backend
- Use Lovable Cloud for persistent quote submissions.
- Create a `quote_requests` table containing the quote ID, contact details, business context, service selections, package, digital requirements, timeline, calculated estimate, status, project description, and timestamps.
- Restrict public access to submission only; do not expose stored leads publicly. Keep admin/status fields ready for a future lightweight dashboard without building that dashboard now.
- Generate sequential IDs in the format `CYTIC-Q-YYYY-001` on the server/database side.
- Recalculate and validate estimates on the server from the centralized pricing rules before storing them, so submitted totals cannot be manipulated in the browser.
- Keep project, service, case-study, and pricing content in reusable typed data modules.

## Technical implementation
- Build reusable site shell, navigation, footer, editorial section primitives, project grid/cards, service pillars, process timeline, audience selector, quote steps, summary, and estimate document.
- Use optimized generated assets with stable aspect ratios, responsive loading, lazy loading below the first view, and minimal dependencies.
- Add focused tests for quote calculations, conditional digital logic, validation, and identifier formatting.
- Validate the finished experience in the live preview at desktop and mobile sizes, including navigation, case studies, the complete quote journey, persistence, submission, confirmation, download, accessibility basics, and no visible overlaps.

## Content assumptions
- NOVA, KORA, and MIRA are explicitly presented as replaceable concept projects, never as real CYTIC clients.
- Pricing values are configurable placeholders in UGX until CYTIC supplies approved rates.
- Contact and social details remain clearly labeled placeholders; no details are invented.
- No testimonials, awards, clients, statistics, or performance claims are fabricated.

## Delivery boundary
- Included now: the complete public site, reusable case studies, working estimate builder, secure quote storage, confirmation, and downloadable estimate.
- Prepared but not exposed now: future admin status management and editable pricing UI.
