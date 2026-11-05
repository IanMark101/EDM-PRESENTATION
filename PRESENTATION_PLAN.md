# CareRecord presentation plan

Purpose: explain what the project is, why it exists, the complete role handoffs, and how its implementation demonstrates the supplied EDM lesson.

Audience: a student presenter and a classroom/project-review audience. Use plain English on slides and fuller speaking prompts in notes. No invented outcome statistics, production-compliance claims, or implied external connections.

Design: preserve CareRecord's forest (#2c3b31), sage (#4a7053), light neutral surfaces, Inter body type, Playfair Display headlines, restrained 8px corners and soft focus states. DESIGN_VARIANCE 4, MOTION_INTENSITY 3, VISUAL_DENSITY 4. Native CSS and JavaScript, no external runtime dependencies. Use a real, non-sensitive sign-in screenshot and semantic diagrams; avoid decorative stock imagery or simulated product screenshots. Light theme matches the existing application and a projected slide deck.

Visual revision: preserve the brand with DESIGN_VARIANCE 5, MOTION_INTENSITY 3 and VISUAL_DENSITY 4. Use one consistent semantic palette across the deck: identity blue, clinical green, laboratory teal, billing amber, review/reporting plum and governance slate. Color communicates role or state and always accompanies text/icons. Redesign permissions, source connections, reporting and lesson alignment as visual explanations. The closing slide has one custom headline plus a four-concept recap. A shared content composition centers normal and fullscreen layouts; long content remains accessible by scrolling.

## Storyboard

| Slide | Topic | What the audience should understand |
|---|---|---|
| 1 | Connected care, trusted data | The project's identity and central purpose |
| 2 | Why develop CareRecord? | Fragmented records create identity questions and slow handoffs; shared identity connects the work |
| 3 | Connect, govern, check | Integration, governance and quality work together through internal APIs, source imports and linked records |
| 4 | Complete patient workflow | Registration, check-in and consultation lead to laboratory approval/doctor review and invoice/payment/receipt branches |
| 5 | Six roles and accountability | All six responsibilities, access boundaries, correction history, audit entries and version checks |
| 6 | Data quality gates | Hold uncertain identities; save incomplete results as drafts; release only checked reports |
| 7 | ETL and reporting example | Extract, transform and load; six sources become four checked facts, with two drafts excluded and financial totals explained |
| 8 | PowerPoint alignment and scope | Reference concepts mapped to implemented features, architecture, future work and a demonstration outline |
| 9 | Connected care, trusted data | One closing headline and a visual recap of integration, governance, quality and ETL |

The deck is condensed from 26 slides to nine. Related topics share visual diagrams instead of repeating explanatory paragraphs. Every original speaking-note paragraph and source reference is retained in the separate speaking guide under its corresponding new slide. This keeps the complete explanation available without adding on-screen slides.

## Presentation behavior

- Previous/next controls, keyboard arrows, Space, Page Up/Down, Home/End and stable slide URLs.
- Fullscreen shows only the slide. Normal view retains the brand, fullscreen control, navigation and keyboard help.
- Notes, slide-index and printer controls remain removed. Detailed speaking prompts are in a separate Markdown guide.
- Educational interactions demonstrate laboratory completeness and a reporting refresh. Identity matching is explained visually. All examples are fictional and never call the clinic API.
- Responsive layouts: readable stacked content on phones; spacious slide canvas for projection.
- Accessible button labels, retained focus visibility, reduced-motion handling and print styles.

## Verification

Check source syntax, nine-slide integrity, the full patient handoffs, six roles, quality/ETL outcomes, source references and assets. Verify retained speaking-note coverage and parse the stylesheets/rendered fragments. Live browser checks cover navigation, educational interactions, URL restoration, normal/fullscreen centering and mobile overflow when browser access is available; report that limitation when it is disabled. Deliver a standalone frontend configured for the user's own Vercel deployment. The user selected Vercel after initial private draft registration; no Sites source upload or publication is needed. Keep all clinic credentials and operational data out of this project.
