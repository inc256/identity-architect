# CYTIC Self-Quote System

The self-quote is an initial project estimate and scoping tool. It is not a final quotation, invoice, contract, or binding commercial offer. The real project value may change as the scope, complexity, deliverables, revisions, quantities, functionality, integrations, and requirements become clearer. CYTIC reviews the submitted requirements before preparing a formal proposal.

## Core Files

| Area | File |
| --- | --- |
| Quote flow | `src/routes/quote.index.tsx` |
| Pricing engine | `src/lib/quote.ts` |
| Server validation and save | `src/lib/quote.functions.ts` |
| Confirmation and estimate download | `src/routes/quote.confirmation.tsx` |
| Service definitions | `src/data/site.ts` |
| Database table | `public.quote_requests` |

## CYTIC Service Structure

The self-quote must use the current four-service structure. Do not expose the previous standalone Strategy, Identity, Naming, Expression, or Digital requirement categories as top-level services.

### 01 — Digital Products

**Preview shown before selection:**
> Websites, e-commerce platforms, web applications, mobile applications, and custom digital products.

**Services found under this category:**
- Business Websites
- E-commerce Websites
- Web Applications
- Mobile Applications — Android
- Mobile Applications — iOS
- Mobile Applications — Multiplatform
- Custom Digital Products

### 02 — Brand Identity & Logo Design

**Preview shown before selection:**
> Logos, campaign visuals, and graphic design for building a recognizable brand presence.

**Services found under this category:**
- Logo Design
- Campaign Design
- Graphic Design

### 03 — UI/UX Design

**Preview shown before selection:**
> User interface and experience design for websites, mobile apps, and web applications, from wireframes to prototypes.

**Services found under this category:**
- Website UI/UX
- Mobile App UI/UX
- Web App UI/UX
- Wireframes & Prototypes

### 04 — Merchandise Branding

**Preview shown before selection:**
> Branding for promotional wear, packaging, and product labels.

**Services found under this category:**
- Promotional Wear
- Packaging & Product Labels

## Service Selection UX

The user must be able to understand what each category contains **before selecting it**.

On the main service-selection screen, each of the four categories should be presented as a service card containing:

1. Service name
2. Short one-sentence description/preview
3. A small “Includes” or “Explore” hint listing the relevant sub-services
4. Starting-price indication where appropriate
5. Selection control

Example:

```text
DIGITAL PRODUCTS
Websites, e-commerce, web apps, mobile apps & custom digital products.

Includes:
Business Websites · E-commerce · Web Apps · Mobile Apps · Custom Products

Starting from UGX 1,000,000+
[ Select ]
```

The preview is informational. The user should not have to select a category merely to discover what services are available inside it.

After selecting a category, show the detailed sub-service choices relevant to that category. The user can select one or multiple sub-services where appropriate.

The UI should not overwhelm the user by displaying every pricing item in a long list before the user chooses a category.

## Recommended Quote Flow

The quote follows the current four-service structure and uses six steps:

1. **Service groups**
   - Show the four CYTIC service cards with previews before selection.
   - Allow one or multiple top-level services to be selected.

2. **Service details**
   - Once a top-level service is selected, reveal its relevant sub-services.
   - Ask only the scope questions relevant to the selected service.
   - Keep the service selection and scope state independent so changing one service group does not overwrite another group's answers.

3. **Business information**
   - Industry is always collected.
   - Project description is required and must contain at least 10 characters.
   - Business name may be collected when relevant and is optional.
   - Current website may be collected for existing businesses; it is optional and must never block continuation.

4. **Scope and requirements**
   - Collect quantities, pages, screens, platforms, features, products, or other scope information only when relevant.
   - Avoid asking irrelevant questions for services that were not selected.

5. **Contact details**
   - Full name
   - Email
   - Phone
   - Preferred contact

6. **Estimate**
   - Starting-from estimate
   - Possible estimate range when additional scope is detected
   - Automatically calculated service-based delivery range
   - Selected services and sub-services
   - Estimate disclaimer
   - Request Detailed Proposal action

The progress indicator should reflect the actual implemented number of steps. Do not hard-code `Step N of 6` if the implementation changes the number of steps.

The Business stage is intentionally not part of the quote flow.

## Scope Questions

Scope questions must be conditional. Only show questions that help CYTIC understand the selected service.

### Digital Products

Relevant scope can include:
- Product type
- Platform
- Number of pages or screens
- Key features
- E-commerce/product requirements
- Authentication/accounts
- Admin/dashboard requirements
- Integrations
- Payments
- Other technical requirements

Do not assume every digital product needs every question.

### Brand Identity & Logo Design

Relevant scope can include:
- Logo Design
- Campaign Design
- Graphic Design
- Number/type of requested graphics or campaign assets
- Existing brand information/assets where relevant

### UI/UX Design

Relevant scope can include:
- Website UI/UX
- Mobile App UI/UX
- Web App UI/UX
- Number of pages/screens
- Wireframes
- Prototypes
- Existing requirements or product documentation where relevant

### Merchandise Branding

Relevant scope can include:
- Promotional Wear
- Packaging & Product Labels
- Quantity
- Number of designs/variants
- Product/package type
- Printing/production requirements when relevant

For merchandise, quantity is particularly important. A displayed starting price is not automatically the final price for a large quantity or complex production requirement.

## Important State Rules

The quote state must represent the new four-service model. Remove obsolete state fields that only supported the previous Strategy/Identity/Naming/Digital structure unless they are required for a specific new scope question.

The quote should retain only data that is actually collected and used by the new flow.

The full active quote is saved in browser `sessionStorage` under:

```text
cytic-quote
```

After successful submission, that key is removed. Confirmation data is written under:

```text
cytic-confirmation
```

If the database still contains legacy columns from the previous quote model, they must not control the new client experience. Keep a documented compatibility value only when the database requires it, or migrate the schema safely while preserving historical records.

## Starting-From Prices

All prices are UGX starting prices. The `+` means the final estimate can increase depending on scope, complexity, deliverables, quantities, functionality, revisions, integrations, production requirements, and other project requirements.

### 01 — Digital Products

| Service | Starting From |
| --- | ---: |
| Business Websites | UGX 1,200,000+ |
| E-commerce Websites | UGX 2,000,000+ |
| Web Applications | UGX 1,000,000+ |
| Mobile Applications — Android | UGX 1,000,000+ |
| Mobile Applications — iOS | UGX 1,000,000+ |
| Mobile Applications — Multiplatform | UGX 2,000,000+ |
| Custom Digital Products | UGX 3,000,000+ |

### 02 — Brand Identity & Logo Design

| Service | Starting From |
| --- | ---: |
| Logo Design | UGX 100,000+ |
| Campaign Design | UGX 400,000+ |
| Graphic Design | UGX 50,000+ |

### 03 — UI/UX Design

| Service | Starting From |
| --- | ---: |
| Website UI/UX | UGX 500,000+ |
| Mobile App UI/UX | UGX 800,000+ |
| Web App UI/UX | UGX 500,000+ |
| Wireframes & Prototypes | UGX 600,000+ |

### 04 — Merchandise Branding

| Service | Starting From |
| --- | ---: |
| Promotional Wear | UGX 30,000+ |
| Packaging & Product Labels | UGX 50,000+ |

## Pricing Rules

The pricing engine must use the prices above as the current starting-price source of truth.

Do not retain the previous pricing items such as Brand Discovery, Brand Strategy, Brand Positioning, Naming, Visual Identity, Brand Guidelines, Landing Page, Digital Brand Experience, or the old Digital requirement prices as selectable services.

A selectable service must never be missing from the pricing configuration.

The `+` symbol is important: these are starting prices, not fixed package prices.

### Digital Products

Digital product pricing should begin with the selected product type and then account for scope and complexity. The quote should be able to increase the estimate when requirements such as additional pages/screens, functionality, integrations, authentication, dashboards, payments, or other technical requirements are identified.

### Brand Identity & Logo Design

Pricing starts from the selected design service. If the user requests multiple design services or a larger quantity of campaign/graphic assets, the estimate may increase according to scope.

### UI/UX Design

Pricing starts from the selected UI/UX service. The estimate may increase according to the number of screens/pages, complexity, flows, prototype requirements, and other project requirements.

### Merchandise Branding

Merchandise pricing must account for quantity and scope. The displayed starting prices are entry points, not per-project guarantees.

For example, Promotional Wear starts from UGX 30,000+, but the final estimate may depend on the quantity, garment/product type, number of designs, branding method, and production requirements.

## Calculation Model

The previous calculation model used separate Strategy, Identity, and Digital totals with a minimum project value. That model is obsolete for the new CYTIC service structure.

The new calculation model should be scope-aware:

```text
selectedItems = selected sub-services
baseStartingTotal = sum(starting prices for selected sub-services)
scopeAdjustments = calculated from relevant scope/quantity/complexity questions
rawEstimate = baseStartingTotal + scopeAdjustments
startingFrom = round according to the configured pricing rules
```

Do not introduce a new arbitrary minimum project price unless CYTIC explicitly decides on one.

The estimate should never be reduced simply because multiple services are selected. Any package discount or bundled pricing must be an explicit CYTIC commercial rule rather than an automatic assumption.

The server remains the source of truth and must recalculate the estimate from validated selections and scope data.

## Service Completion Durations

Delivery ranges are calculated from the selected top-level service and are displayed as indicative ranges. The range must be stored in the same pricing configuration as the service and shown consistently on the estimate.

| Service | Delivery range |
| --- | --- |
| Digital Products | 3 weeks to 3 months |
| Brand Identity & Logo Design | 3 days to 2 weeks |
| UI/UX Design | 1 week to 1 month |
| Merchandise Branding | 3 days to 2 weeks |

The Business stage and user-selected timeline are no longer part of the quote flow. Clients do not choose a delivery window; the application determines the relevant range automatically from the selected service.

## Estimate Display

The estimate page should show:

- Quote ID
- Selected top-level services
- Selected sub-services
- Starting price for each selected item
- Scope-based adjustments where appropriate
- Starting-from estimate or estimate range
- Indicative timeline only when a valid duration model is configured
- Next steps
- Estimate disclaimer
- Request Detailed Proposal action

The estimate should be easy for a client to understand without requiring them to know CYTIC's internal pricing logic.

## Server and Database Flow

```text
Client completes quote
        ↓
submitQuote()
        ↓
Zod server validation
        ↓
Server validates selected services and scope
        ↓
Server recalculates price from current pricing configuration
        ↓
Supabase insert into public.quote_requests
        ↓
Database generates CYTIC-Q-YYYY-NNN
        ↓
Confirmation data returned
```

The server is the source of truth. Never trust a price or estimate sent by the browser.

`submitQuote()` validates and recalculates the request on the server, then inserts
through the server-only Supabase client. `SUPABASE_SERVICE_ROLE_KEY` must remain
in server environment configuration and must never use a `VITE_` prefix. The
insert does not read the saved row back or expose its generated quote ID; the
confirmation only includes the server-calculated estimate. Status is fixed to
`New`.

The existing table also requires the legacy `business_stage` and `timeline`
columns. Since the current flow does not ask for a business stage or client
chosen timeline, new rows store `Not provided` for `business_stage` and the
automatically calculated indicative delivery range in `timeline`. Optional
business names use `Not provided` only to satisfy the table's non-null
constraint.

`submitQuote()` validates and recalculates the request on the server, then inserts
through the server-only Supabase client. `SUPABASE_SERVICE_ROLE_KEY` must remain
in server environment configuration and must never use a `VITE_` prefix. The
server selects only the generated quote ID and estimate fields from its own
insert for the immediate confirmation; the anonymous browser client does not
read quote-request rows. Status is fixed to `New`.

The existing table also requires the legacy `business_stage` and `timeline`
columns. Since the current flow does not ask for a business stage or client
chosen timeline, new rows store `Not provided` for `business_stage` and the
automatically calculated indicative delivery range in `timeline`. Optional
business names use `Not provided` only to satisfy the table's non-null
constraint.

The saved record should include, where applicable:

- Client details
- Business context
- Selected top-level services
- Selected sub-services
- Scope/requirements
- Estimated price
- Estimated delivery range
- Pricing version
- Status
- Timestamps

New records start with `New`.

Supported statuses:

`New`, `Reviewing`, `Contacted`, `Proposal Sent`, `Approved`, `In Progress`, `Completed`, `Declined`.

## Safe Change Guide

### Change a price

1. Update the matching value in the pricing configuration in `src/lib/quote.ts`.
2. Update the price table in this document.
3. Increment `PRICING_VERSION`.
4. Test the estimate and confirmation download.

### Add a selectable sub-service

1. Add it under the correct top-level service in `src/data/site.ts`.
2. Add its starting price to the pricing configuration.
3. Add its preview/description if it is displayed in the service-selection UI.
4. Add relevant scope questions if required.
5. Update server validation if the data shape changes.
6. Update this document.
7. Test one-service and multi-service quotes.

A selectable sub-service must never be missing from the pricing configuration.

### Change a service preview

Keep the preview short and client-friendly. It should explain what the category contains before selection without becoming a full service description.

For example:

```text
DIGITAL PRODUCTS
Websites, e-commerce, web apps, mobile apps & custom digital products.
```

The preview should remain aligned with the actual selectable sub-services.

### Change conditional fields

Update all relevant layers together:

- UI conditions and validation in `src/routes/quote.index.tsx`
- `QuoteState` and `emptyQuote` in `src/lib/quote.ts`
- `quoteSchema` and database mapping in `src/lib/quote.functions.ts`
- Service definitions in `src/data/site.ts` when applicable
- This README

### Remove a field permanently

Remove it from client state, validation, submission mapping, confirmation rendering, and documentation. If its database column is still required, either retain a clearly documented compatibility value or create a database migration to make it nullable/remove it. Preserve historical records.

### Change the estimate model

Update `calculateQuote()`, increment `PRICING_VERSION`, update the confirmation/download wording, and test:

- One selected service
- Multiple selected services
- One sub-service
- Multiple sub-services
- Quantity-based merchandise estimates
- Scope adjustments
- Missing/incomplete input
- Price rounding
- Confirmation/download

## Confirmation Rules

The confirmation page shows the quote ID, estimate, selected services/sub-services, next steps, and a downloadable estimate.

Every confirmation and download must state:

> This is an estimate based on the information provided. The real project value may change as the scope, complexity, deliverables, revisions, quantities, functionality, integrations, and requirements become clearer. It is not a final quotation or contract. CYTIC will review your requirements before preparing a detailed proposal.

## Verification Checklist

After quote changes:

1. Run `npm run build`.
2. Open `/quote`.
3. Confirm the current four top-level services are displayed.
4. Confirm every top-level service has a useful preview before selection.
5. Confirm the preview accurately reflects the sub-services available inside the category.
6. Select Digital Products and verify all seven digital product options are available.
7. Select Brand Identity & Logo Design and verify Logo Design, Campaign Design, and Graphic Design.
8. Select UI/UX Design and verify Website UI/UX, Mobile App UI/UX, Web App UI/UX, and Wireframes & Prototypes.
9. Select Merchandise Branding and verify Promotional Wear and Packaging & Product Labels.
10. Confirm obsolete Strategy, Identity, Naming, Expression, Landing Page, and Digital Brand Experience selections are absent.
11. Confirm the displayed starting prices match the current pricing table.
12. Confirm merchandise scope/quantity questions appear when relevant.
13. Confirm irrelevant scope questions remain hidden.
14. Test one service and multiple services.
15. Verify the estimate is recalculated on the server.
16. Verify the estimate disclaimer is shown.
17. Submit with Supabase configured and verify confirmation/download.
18. Verify the saved pricing version.

## Commercial Safety Rules

- Prices are starting estimates, not guaranteed final costs.
- The self-quote is not a final quotation or contract.
- Recalculate prices on the server.
- Version commercial pricing changes.
- Never silently alter historical pricing rules.
- Keep service labels consistent across UI, pricing, server, database, and this document.
- Complex projects must be allowed to exceed displayed starting prices.
- Merchandise estimates must account for quantity and production scope where applicable.
- Final scope and price are confirmed in the formal proposal.
