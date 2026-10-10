export function ContentLoading() {
  return (
    <main className="site-container min-h-[50vh] py-24" aria-busy="true" aria-live="polite">
      <p className="text-sm text-muted-foreground">Loading published content…</p>
    </main>
  );
}
