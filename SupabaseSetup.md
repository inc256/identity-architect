# CYTIC Website Supabase Setup

The public website reads published CMS content from the owner-managed Supabase
project. The site does not use Supabase-managed hosting or deployment
infrastructure. Configure the project URL and keys in the local environment and
in the chosen self-hosted deployment environment.

## Environment variables

Copy `.env.example` to an ignored local environment file such as `.env.local`
and replace each placeholder with values from the owner’s Supabase project.
Set the same values in the deployment environment before building and running
the application.

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` configure the browser
  client. Use only the anon/publishable key here; it is public in the built site
  and relies on Row Level Security for access control.
- `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` configure server-side public
  reads.
- `SUPABASE_SERVICE_ROLE_KEY` is used only by the server-side quote submission
  handler to save a validated and server-priced request. Keep it private in
  server environment configuration; never use a `VITE_` prefix or expose it in
  source code, client bundles, or logs.
- `VITE_SUPABASE_PROJECT_ID` is optional and is not used by the site client.

## Vercel deployment

Build from the repository root with `npm run build`. The Nitro Vite plugin
detects Vercel's build environment and generates `.vercel/output` with the
server function and static assets. Keep that generated directory out of Git;
deployments should build it from the current source rather than reuse a
checked-in output directory.

The tracked `.env` file has been removed from Git and ignored. If it was
previously committed, rotate any private key that was ever present in it.

## Required Supabase content

Apply the CMS schema, Storage buckets, and RLS policies to the owner’s
self-hosted Supabase project before deploying the site. The public client uses
the anon/publishable key and expects:

- `cms_website_settings`: the row with `id = true`, with a JSON `settings`
  object containing `public_email`, `phone`, `instagram`, `linkedin`,
  `show_quote`, and `maintenance_mode`.
- `cms_website_services`: published service rows with `id`, `parent_id`,
  `name`, `description`, `sort_order`, and `status`.
- `cms_portfolio_projects`: published rows with `id`, `title`, `slug`,
  `project_url`, `service`, `year`, `summary`, `description`, ordered
  `image_paths`, `featured`, and `status`.
- `cms_blog_posts`: published rows with `id`, `title`, `slug`, `category`,
  `author`, `excerpt`, text `body`, optional `image_path`, `publish_date`,
  `created_at`, and `status`.
- Public read access, through RLS, only to published CMS content and the
  `blog-images` and `portofio-images` public Storage buckets. Keep CMS edits,
  uploads, quote request reads, and other private data restricted to authorized
  users.

The CMS schema and its policies are owned and applied to the owner’s Supabase
project; do not broaden RLS or add preview-project credentials to make reads
succeed. If a query fails, check the deployed URL/key, table/column names,
record status, and the owner-applied policies.

## Website behavior

- Home and Services show published parent services with their published child
  services.
- Work lists only published projects, preserves image order, and uses the
  first image as the card cover. Work previews are grouped by their actual
  image orientation. Optional project links are restricted to `http` and
  `https`.
- Project detail pages use the existing `description` field for case-study
  copy. To label sections, start a line with `Challenge`, `Thinking`,
  `Identity`, `Expression`, `Digital`, or `Outcome`, optionally followed by a
  colon. Unheaded descriptions display as a Project overview. The first
  project image is the featured visual; remaining images appear in the gallery.
- Blog lists and article pages show only posts whose status is `Published`.
  Keep future/scheduled content in the `Scheduled` status; the publication date
  is display and sort metadata, not the visibility gate. Article body content is rendered safely as text;
  Markdown headings (`#`, `##`, `###`) and images (`![Alt text](storage/path)`)
  are supported. Upload inline images to the public `blog-images` bucket and
  use their bucket-relative storage paths in the body.
- Apply `drizzle/migrations/0002_cms_blog_public_read.sql` after creating
  `cms_blog_posts`. It grants anonymous/authenticated read access only to rows
  marked `Published`; it does not grant CMS write access.
- Missing images use a designed fallback. Empty collections show an empty
  state; Supabase errors are logged with the error code and fail the page
  explicitly.
- Website settings drive public contact links, the quote entry points, and the
  maintenance page. An unset `show_quote` keeps the quote flow visible;
  explicitly setting it to `false` hides the quote links.
- The quote handler validates the submitted scope and recalculates the price on
  the server before inserting a `New` request. It does not read the saved
  request back or expose its generated quote ID to the browser.

For quote field mapping and legacy database-column compatibility, see
[`QuoteReadMe.md`](./QuoteReadMe.md).

## Smoke test

1. Confirm the public and server environment variables are configured in the
   intended environments; verify no service-role key appears in the browser
   build.
2. Publish a parent service and child service; verify they appear on Home and
   Services.
3. Publish a portfolio project with multiple images and an optional external
   link; verify the ordered gallery and safe link.
4. Verify a draft article stays private, then publish an article and verify its
   card and page.
5. Submit a quote and verify success in the CMS. Confirm the browser cannot
   read submitted quote rows or see the generated quote ID.
