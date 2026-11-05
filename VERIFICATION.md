# Verification and deployment handoff

Completed November 6, 2026 (Asia/Taipei).

## Commands

- `npm run lint`: passed JavaScript syntax, JSON configuration, HTML/CSS hygiene and reduced-motion/print rule checks. This is a project-specific validator using Node, not ESLint.
- `npm run build`: passed all lint checks plus 26-slide integrity, four chapters, required topics, speaker notes, example-state assertions, local asset existence, API independence and Vercel configuration. Generated the downloadable speaking guide.
- No runtime package dependencies, clinic environment variables or network downloads are needed for the build.

## Browser verification already completed

- All 26 slides were navigated and checked at the desktop viewport. No slide content exceeded its canvas in that check; there was no page-width overflow and the cover image loaded.
- All 26 slides were navigated at a 390px phone breakpoint. No horizontal page overflow was found. Longer slides scroll vertically and tables have their own horizontal scroll region.
- Visually reviewed the cover, complete patient-workflow diagram, ETL example before/after and phone ETL layout.
- Verified the searchable slide index, direct jump to a result, speaker-note content, the ETL example's four inclusions/two exclusions, keyboard Home navigation and saved slide restoration.
- The last complete-workflow text-size increase and final source-check changes passed the file checks. Remaining live laboratory/identity controls, fullscreen and print-dialog verification could not be completed because browser access became disabled in Work settings. Their example render states are checked by the build; fullscreen and printing depend on the browser.

## Vercel handoff

Deploy this project folder, not the clinic frontend/backend folders. Select the folder as the Root Directory when it is part of a larger repository.

- Framework: Other
- Build Command: npm run build
- Output Directory: dist
- Environment variables: none

The included `vercel.json` supplies these settings. The project is configured for Vercel but has not been deployed to the user's Vercel account. Local command success does not verify account-specific deployment settings.
