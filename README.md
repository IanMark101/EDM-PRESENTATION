# CareRecord presentation

A standalone static frontend with 26 slides about the clinic problem, complete patient workflow, governance, integration, data quality and ETL. It uses the existing CareRecord theme and a real sign-in screenshot. All patient examples and prices are fictional.

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

Use the arrows, Space, Page Up/Down, or previous/next buttons. Home and End jump to the first and last slide. N opens speaker notes, O opens the searchable slide index, F toggles fullscreen, and ? shows shortcuts. Notes can be downloaded as a speaking guide. The print button prints all slides and can save a PDF through the browser.

The identity, laboratory and ETL interactions are educational simulations. They do not call the clinic API or change clinic records.

## Checks

`npm run lint` runs the Node syntax checker on every shipped JavaScript file, validates JSON configuration and checks source text hygiene. `npm run build` performs those checks plus slide integrity, required topics, references, static assets and Vercel configuration checks. Neither command installs packages or uses clinic credentials.

## Sources and licensing

Content follows the provided `integration.pptx.pdf` (especially slides 3-7, 11, 13, 15 and 18) and the CareRecord implementation reviewed in the surrounding workspace. Per-slide speaker notes identify the relevant services or concepts.

Inter and Playfair Display are bundled with their Open Font License notices in `dist/assets/fonts/`. Icons are generated from the existing CareRecord `lucide-react` dependency; its license is included in `dist/assets/`. The sign-in screenshot contains no credentials or patient records.
