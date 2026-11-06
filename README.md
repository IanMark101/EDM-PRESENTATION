# CareRecord presentation

A standalone static frontend with 9 slides about the clinic problem, complete patient workflow, governance, integration, data quality and ETL. It uses the existing CareRecord theme and a real sign-in screenshot. All patient examples and prices are fictional.

The deck reflects manager-controlled service prices and charges linked to completed consultations or approved tests. It explains that billing uses approved prices, that saved bills retain their amounts, and that the current clinic scope supports one standard consultation fee plus separate test prices. Different fees by doctor/visit type, discounts and insurance pricing remain future work.

No clinic backend, database, environment variables or secret credentials are needed. Assets and fonts are local, and there are no runtime package dependencies.

## Local use

```sh
npm run lint
npm run build
npm run dev
```

Open the Local URL printed by the server. The default port is 4173; pass `--port 4174` after `npm run dev --` to change it. You can also open `dist/index.html` directly for an offline presentation.

## Deploy to Vercel

Upload or push **this folder** as its own project. If it is inside a larger repository, set Vercel's **Root Directory** to `care-record-presentation`.

- Framework preset: **Other**
- Build command: **npm run build**
- Output directory: **dist**
- Environment variables: **none**

`vercel.json` already provides the framework, build and output configuration. The build validates ready-to-serve static files; it does not need a compiler or network downloads. Slide URLs use hash navigation, so no SPA server rewrite is needed.

## Presenting

Use the arrows, Space, Page Up/Down, or previous/next buttons. Home and End jump to the first and last slide. F toggles fullscreen, and ? shows shortcuts. The slide counter is informational. Notes, slide-index and printer controls have been removed from the presentation. A separate speaking guide remains available as `dist/CareRecord-speaking-guide.md`.

The laboratory and ETL interactions are educational simulations. They do not call the clinic API or change clinic records. The separate speaking guide retains the detailed explanations from the original 26-slide version, grouped under the nine current slides.

Fullscreen presents only the current slide, with no toolbar or footer. Use the arrow keys, Space or Page Up/Down to navigate. Press Esc or F to leave fullscreen; the normal navigation and fullscreen controls return.

Normal and fullscreen views center the heading, visual content and footnote together. Department colors stay consistent throughout: identity blue, clinical green, laboratory teal, billing amber, review/reporting plum and account governance slate. The complete workflow, permission cards, quality gates, ETL example and fictional payment summary explain the data relationships without connecting to the clinic system.

## Checks

`npm run lint` runs the Node syntax checker on every shipped JavaScript file, validates JSON configuration and checks source text hygiene. `npm run build` performs those checks plus slide integrity, required topics, references, static assets and Vercel configuration checks. Neither command installs packages or uses clinic credentials.

## Sources and licensing

Content follows the provided `integration.pptx.pdf` (especially slides 3-7, 11, 13, 15 and 18) and the CareRecord implementation reviewed in the surrounding workspace. Per-slide speaker notes identify the relevant services or concepts.

Inter and Playfair Display are bundled with their Open Font License notices in `dist/assets/fonts/`. Icons are generated from the existing CareRecord `lucide-react` dependency; its license is included in `dist/assets/`. The sign-in screenshot contains no credentials or patient records.
