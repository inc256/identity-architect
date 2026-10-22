import logoMark from "@/assets/CYTIC_Logo_512p.png";

export function ContentLoading() {
  return (
    <main className="site-status-page site-loading" aria-busy="true" aria-live="polite">
      <div className="site-status-card">
        <img src={logoMark} alt="" aria-hidden="true" className="site-status-logo" />
        <p className="eyebrow">
          <span aria-hidden="true" /> CYTIC CREATIVES
        </p>
        <h1 className="display-md">Setting the stage.</h1>
        <p className="site-status-copy">We’re bringing your next experience into focus.</p>
        <div className="site-loading-track" aria-hidden="true">
          <span />
        </div>
      </div>
    </main>
  );
}
