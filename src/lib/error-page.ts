export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="theme-color" content="#00075d" />
    <title>A small detour — CYTIC CREATIVES</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      * { box-sizing: border-box; }
      body { font: 15px/1.6 Manrope, system-ui, -apple-system, sans-serif; background: #00075d; color: #e8dcc8; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 35rem; width: 100%; text-align: center; padding: clamp(2rem, 7vw, 4rem); border: 1px solid #e8dcc833; background: #ffffff08; }
      .logo { display: block; width: 4rem; height: 4rem; margin: 0 auto 2rem; }
      .eyebrow { color: #c6a75e; font-size: .7rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
      h1 { font-size: clamp(2.5rem, 8vw, 4.5rem); line-height: .98; letter-spacing: -.05em; margin: 1.5rem 0 1rem; }
      p { color: #e8dcc8b3; margin: 0 0 1.75rem; }
      .actions { display: flex; gap: .75rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: .8rem 1.2rem; font: inherit; font-weight: 700; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #c6a75e; color: #00075d; }
      .secondary { background: transparent; color: #e8dcc8; border-color: #e8dcc855; }
    </style>
  </head>
  <body>
    <div class="card">
      <img class="logo" src="/favicon.svg" alt="" />
      <div class="eyebrow">CYTIC CREATIVES</div>
      <h1>A small detour.</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
