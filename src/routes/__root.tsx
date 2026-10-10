import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { ContentLoading } from "@/components/site/ContentLoading";
import { Page } from "@/components/site/SiteShell";
import { getWebsiteSettings } from "@/lib/cms";
import { WebsiteSettingsContext } from "@/lib/website-settings";

function NotFoundComponent() {
  return (
    <Page>
      <div className="site-status-content bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-7xl font-bold text-foreground">404</h1>
          <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Go home
            </Link>
          </div>
        </div>
      </div>
    </Page>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: () => getWebsiteSettings(),
  pendingComponent: ContentLoading,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "robots", content: "index, follow" },
      { name: "cache-control", content: "no-store, no-cache, must-revalidate, proxy-revalidate" },
      { name: "pragma", content: "no-cache" },
      { name: "expires", content: "0" },
      { title: "CYTIC CREATIVES" },
      {
        name: "description",
        content:
          "CYTIC CREATIVES is a subsidiary of Namielus Group Limited, creating digital products, digital experiences, and distinctive brands.",
      },
      { name: "author", content: "CYTIC CREATIVES" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/svg+xml" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const settings = Route.useLoaderData();

  return (
    <QueryClientProvider client={queryClient}>
      <WebsiteSettingsContext.Provider value={settings}>
        {settings.maintenance_mode ? <MaintenancePage /> : <Outlet />}
      </WebsiteSettingsContext.Provider>
    </QueryClientProvider>
  );
}

function MaintenancePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-6 text-cream">
      <div className="max-w-2xl py-20">
        <p className="eyebrow text-gold">
          <span aria-hidden="true" /> CYTIC CREATIVES
        </p>
        <h1 className="display-lg mt-8">We’ll be back soon.</h1>
        <p className="mt-8 text-lg leading-relaxed text-cream/70">
          Our website is temporarily unavailable while we make updates. Please check back soon.
        </p>
      </div>
    </main>
  );
}
