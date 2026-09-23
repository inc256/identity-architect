# CYTIC Self-Quote System

The self-quote is an initial project estimate and scoping tool. It is not a final quotation, invoice, contract, or binding commercial offer. The real project value may change during development as the scope, complexity, deliverables, revisions, and requirements become clearer. CYTIC reviews the submitted requirements before preparing a formal proposal.

## Core Files

| Area | File |
| --- | --- |
| Quote flow | `src/routes/quote.index.tsx` |
| Pricing engine | `src/lib/quote.ts` |
| Server validation and save | `src/lib/quote.functions.ts` |
| Confirmation and estimate download | `src/routes/quote.confirmation.tsx` |
| Service definitions | `src/data/site.ts` |
| Database table | `public.quote_requests` |

## Current Quote Flow

The quote has eight steps. Progress is stored in `step` and displayed as `Step N of 8`.

1. **Business stage**
   - I'm starting a business
   - I'm growing an existing business
   - I'm rebranding
   - I'm an established company
   - I'm not sure yet

2. **Strategy**
   - Brand Discovery
   - Brand Strategy
   - Brand Positioning

3. **Identity**
   - Logo Design
   - Visual Identity
   - Brand Guidelines

4. **Naming and digital requirements**
   - Naming is selected here when needed.
   - Digital requirements appear only here, never in the Strategy or Identity steps.
   - Landing page, Company website, E-commerce, Web application, Android, iOS, Cross-platform, Not sure

5. **Business information**
   - Industry is always collected.
   - Project description is required and must contain at least 10 characters.
   - Business name appears only when Naming is selected; it is optional.
   - Current website appears only when the business stage is not `I'm starting a business` and not `I'm not sure yet`; it is optional and never blocks continuation.
   - Online presence is not collected.

6. **Timeline**
   - As soon as possible
   - Within 1 month
   - 1–3 months
   - 3+ months
   - I'm just exploring

7. **Contact details**
   - Full name
   - Email
   - Phone
   - Preferred contact

8. **Estimate**
   - Starting-from estimate
   - Possible range when extra scope is detected
   - Indicative timeline
   - Selected services
   - Estimate disclaimer
   - Request Detailed Proposal action

## Important State Rules

`QuoteState` is defined in `src/lib/quote.ts` and intentionally does not contain `brandScope` or `onlinePresence`.

The database migration still has a legacy required `brand_scope` column. Until that schema is migrated, the server writes `Not selected` to that column for compatibility. It is not shown or used by the client quote flow.

The full active quote is saved in browser `sessionStorage` under:

```text
cytic-quote
```

After successful submission, that key is removed. Confirmation data is written under:

```text
cytic-confirmation
```

## Starting-From Prices

All prices are UGX starting prices. The `+` means the final estimate can increase with complexity, deliverables, functionality, revisions, integrations, and project requirements.

| Category | Service | Starting from |
| --- | --- | ---: |
| Identity | Logo Design | UGX 50,000+ |
| Strategy | Brand Discovery | UGX 800,000+ |
| Strategy | Brand Strategy | UGX 1,000,000+ |
| Strategy | Brand Positioning | UGX 800,000+ |
| Strategy | Naming | UGX 100,000+ |
| Identity | Visual Identity | UGX 1,600,000+ |
| Identity | Brand Guidelines | UGX 800,000+ |
| Expression | Campaign Design | UGX 850,000+ |
| Digital | Landing Page | UGX 600,000+ |
| Digital | Website Design | UGX 1,000,000+ |
| Digital | UI/UX Design | UGX 800,000+ |
| Digital | E-commerce | UGX 2,500,000+ |
| Digital | Web Application | UGX 3,000,000+ |
| Digital | Android App | UGX 800,000+ |
| Digital | iOS App | UGX 800,000+ |
| Digital | Cross-platform App | UGX 2,000,000+ |
| Digital | Digital Brand Experience | UGX 1,000,000+ |

Removed from selectable quote services:

- Brand Messaging
- Business Materials
- Marketing Materials
- Packaging
- Brand Collateral

## Calculation

The current engine is additive, not package-multiplier based:

```text
serviceStartingTotal = sum(selected service prices)
digitalStartingTotal = sum(selected digital requirement prices)
rawAmount = max(UGX 1,800,000, serviceStartingTotal + digitalStartingTotal)
startingFrom = round rawAmount up to the nearest UGX 50,000
```

Current digital requirement starting prices:

- Landing page: UGX 600,000
- Company website: UGX 1,000,000
- E-commerce: UGX 2,500,000
- Web application: UGX 3,000,000
- Android: UGX 800,000
- iOS: UGX 800,000
- Cross-platform: UGX 2,000,000
- Not sure: no additional starting price

The engine also adds a provisional upper-range buffer when multiple digital requirements or more than four services are selected. This is a temporary scope signal until dedicated complexity and deliverable questions are added.

Timeline is indicative only. It uses a base duration, selected digital complexity, and service count. It must not be treated as a promised delivery date.

## Service Completion Durations

The estimate step lists every selected service and its individual duration. The project completion range is calculated by summing the minimum and maximum duration for all selected services and digital requirements.

| Category | Service | Minimum | Maximum |
| --- | --- | --- | --- |
| Identity | Logo Design | 5 days | 2 weeks |
| Strategy | Brand Discovery | 3 days | 1 week |
| Strategy | Brand Strategy | 3 days | 1 week |
| Strategy | Brand Positioning | 3 days | 1 week |
| Strategy | Naming | 2 days | 5 days |
| Identity | Visual Identity | 1 week | 2 weeks |
| Identity | Brand Guidelines | 2 days | 5 days |
| Expression | Campaign Design | 2 days | 5 days |
| Digital | Landing Page | 1 week | 2 weeks |
| Digital | Website Design | 2 weeks | 3 months |
| Digital | UI/UX Design | 2 weeks | 4 weeks |
| Digital | E-commerce | 1 month | 3 months |
| Digital | Web Application | 3 weeks | 3 months |
| Digital | Android App | 3 weeks | 3 months |
| Digital | iOS App | 3 weeks | 3 months |
| Digital | Cross-platform App | 1 month | 6 months |
| Digital | Digital Brand Experience | 3 weeks | 2 months |

The source of truth is `pricingConfig.durations` in `src/lib/quote.ts`. Durations are stored internally as day values so ranges can be added consistently. The UI keeps short durations readable: fewer than 7 days remain days, durations below a month remain weeks and days, 28 days is shown as 1 month, and longer durations are shown as months plus remaining days. Durations of 12 months or more are shown as years plus any remaining months or days.

The estimate displays:

- Every selected service and digital requirement
- The price for each selected item
- The minimum and maximum duration for each item
- The combined minimum and maximum project completion range

## Server and Database Flow

```text
Client completes quote
        ↓
submitQuote()
        ↓
Zod server validation
        ↓
Server recalculates price and timeline
        ↓
Supabase insert into public.quote_requests
        ↓
Database generates CYTIC-Q-YYYY-NNN
        ↓
Confirmation data returned
```

The server is the source of truth. Never trust a price or estimate sent by the browser.

The saved record includes client details, business context, selected services, digital requirements, timeline preference, estimated price, estimated weeks, pricing version, status, and timestamps. New records start with `New`.

Supported statuses:

`New`, `Reviewing`, `Contacted`, `Proposal Sent`, `Approved`, `In Progress`, `Completed`, `Declined`.

## Safe Change Guide

### Change a price

1. Update the matching value in `pricingConfig.services` or `pricingConfig.digitalRequirements` in `src/lib/quote.ts`.
2. Update the price table in this document.
3. Increment `PRICING_VERSION`.
4. Test the estimate and confirmation download.

### Add a selectable service

1. Add it to the appropriate list in `src/data/site.ts`.
2. Add its starting price to `pricingConfig.services`.
3. Add any digital detection or requirement rules.
4. Update the server validation if the data shape changes.
5. Update this document.
6. Test one-service and multi-service quotes.

A selectable service must never be missing from the pricing configuration.

### Change conditional fields

Update all three together:

- UI conditions and `valid()` in `src/routes/quote.index.tsx`
- `QuoteState` and `emptyQuote` in `src/lib/quote.ts`
- `quoteSchema` and database mapping in `src/lib/quote.functions.ts`

### Remove a field permanently

Remove it from client state, validation, submission mapping, confirmation rendering, and documentation. If its database column is still required, either retain a clearly documented compatibility value or create a database migration to make it nullable/remove it. Preserve historical records.

### Change the estimate model

Update `calculateQuote()`, increment `PRICING_VERSION`, update the confirmation/download wording, and test the minimum, rounding, additive digital requirements, multiple services, and incomplete input.

## Confirmation Rules

The confirmation page shows the quote ID, starting-from estimate, indicative timeline, selected services, next steps, and a downloadable text estimate.

Every confirmation and download must state:

> This is an estimate based on the information provided. The real project value may change during development as the scope, complexity, deliverables, revisions, and requirements become clearer. It is not a final quotation or contract. CYTIC will review your requirements before preparing a detailed proposal.

## Verification Checklist

After quote changes:

1. Run `npm run build`.
2. Open `/quote`.
3. Confirm the eight-step flow and progress indicator.
4. Confirm Strategy, Identity, and Naming are separate from Digital.
5. Confirm Digital requirements appear only on step 4.
6. Select Naming and confirm Business Name appears on step 5.
7. Do not select Naming and confirm Business Name is absent.
8. Choose startup or not sure and confirm Current Website is absent.
9. Choose growing, rebranding, or established and confirm Current Website appears.
10. Confirm Online Presence is absent.
11. Test one and multiple digital requirements.
12. Verify starting-from estimate, range, timeline, and disclaimer.
13. Submit with Supabase configured and verify confirmation/download.
14. Verify the saved pricing version.

## Commercial Safety Rules

- Prices are starting estimates, not guaranteed final costs.
- The self-quote is not a final quotation or contract.
- Recalculate on the server.
- Version commercial pricing changes.
- Never silently alter historical pricing rules.
- Keep service labels consistent across UI, pricing, server, database, and this document.
- Complex projects must be allowed to exceed displayed starting prices.
- Final scope and price are confirmed in the formal proposal.
