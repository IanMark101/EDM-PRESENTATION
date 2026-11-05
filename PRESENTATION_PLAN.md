# CareRecord presentation plan

Purpose: explain what the project is, why it exists, the complete role handoffs, and how its implementation demonstrates the supplied EDM lesson.

Audience: a student presenter and a classroom/project-review audience. Use plain English on slides and fuller speaking prompts in notes. No invented outcome statistics, production-compliance claims, or implied external connections.

Design: preserve CareRecord's forest (#2c3b31), sage (#4a7053), light neutral surfaces, Inter body type, Playfair Display headlines, restrained 8px corners and soft focus states. DESIGN_VARIANCE 4, MOTION_INTENSITY 3, VISUAL_DENSITY 4. Native CSS and JavaScript, no external runtime dependencies. Use a real, non-sensitive sign-in screenshot and semantic diagrams; avoid decorative stock imagery or simulated product screenshots. Light theme matches the existing application and a projected slide deck.

## Storyboard

| Slide | Topic | What the audience should understand |
|---|---|---|
| 1 | Connected care, trusted data | The project's identity and central purpose |
| 2 | The problem: fragmented records | Separate records lead to uncertain identity and slow handoffs |
| 3 | Why develop CareRecord? | Shared identity, clear ownership, checked data and reporting |
| 4 | One system, connected departments | The application contains EMR-like, LIS-like and billing workflows |
| 5 | The three EDM pillars | Integration connects; governance controls; quality checks |
| 6 | Six roles, clear responsibilities | Each role has a distinct job and access scope |
| 7 | Meet the example patient | A fictional patient/visit will anchor the explanation |
| 8 | Registration | Verify identity, check duplicates, assign a doctor |
| 9 | Check-in | A waiting visit and doctor handoff are created |
| 10 | Consultation | The doctor records care and can request a test during the visit |
| 11 | Laboratory | Drafts are completed, checked and approved before result release |
| 12 | Doctor follow-up | Approved report versions require explicit doctor review |
| 13 | Billing and payment | Signed consultation, itemized bill, payment and receipt |
| 14 | Complete workflow | Clinical and financial branches share patient/visit identity |
| 15 | Governance in practice | Access scope is enforced by the backend |
| 16 | Accountability and correction | Versions, evidence and audit history preserve responsibility |
| 17 | Data quality | Uncertain matches are held; incomplete reports cannot be approved |
| 18 | Integration in practice | Internal APIs and controlled JSON imports connect information |
| 19 | Extract, transform, load | The implemented reporting refresh is application-level batch ETL |
| 20 | Worked ETL example | Six example source records yield four selected reporting facts |
| 21 | Reporting | Counts and balances reflect selected checked copies, not live totals |
| 22 | Architecture | Browser, Next.js, Express, Prisma and PostgreSQL responsibilities |
| 23 | PowerPoint alignment | Map actual features to reference slides 3-7, 11, 13, 15 and 18 |
| 24 | Implemented and future scope | External EMR/LIS/insurance and formal compliance are not claimed |
| 25 | Demonstration guide | Present a convincing end-to-end scenario with quality gates |
| 26 | Project explanation and closing | A concise, accurate explanation the presenter can use |

## Presentation behavior

- Previous/next controls, keyboard arrows, Space, Page Up/Down, Home/End and stable slide URLs.
- Slide index with chapters and search. Native dialog focus management.
- Speaker-note panel per slide, downloadable speaking guide, fullscreen and print-all-slides.
- Educational interactions cover the three EDM concepts, laboratory completeness, identity-match outcomes, ETL phases and a reporting refresh example. All use fictional examples and never call the clinic API.
- Responsive layouts: readable stacked content on phones; spacious slide canvas for projection.
- Accessible button labels, retained focus visibility, reduced-motion handling and print styles.

## Verification

Check source syntax, slide uniqueness/counts, required topics, source references, assets and interactions. Inspect representative layouts and all slide overflow in the browser. Test next/previous, index search/navigation, notes, educational interactions, URL restoration and mobile layout. Deliver a standalone frontend configured for the user's own Vercel deployment. The user selected Vercel after initial private draft registration; no Sites source upload or publication is needed. Keep all clinic credentials and operational data out of this project.
