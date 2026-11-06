/* All patient details and financial amounts in these slides are fictional examples. */
(() => {
  const icon = name => window.CARE_ICONS[name] || '';
  const toneFor = name => ({ UsersRound: 'identity', Fingerprint: 'identity', CalendarDays: 'identity', Stethoscope: 'clinical', FlaskConical: 'laboratory', ReceiptText: 'billing', CreditCard: 'billing', ListChecks: 'review', History: 'review', ShieldCheck: 'governance', LockKeyhole: 'governance', Link: 'identity', ClipboardCheck: 'laboratory', Database: 'review', ChartNoAxesCombined: 'review' }[name] || 'clinical');
  const badge = (name, tone = toneFor(name)) => `<span class="visual-icon" data-tone="${tone}">${icon(name)}</span>`;
  const lead = text => `<p class="slide-lead">${text}</p>`;
  const note = text => `<p class="slide-footnote">${text}</p>`;
  const pricingFlow = () => `<div class="pricing-handoff" aria-label="Where billing prices come from">${[
    ['ShieldCheck','Account manager','Sets approved prices','governance'],
    ['Link','System','Links service + price','clinical'],
    ['ReceiptText','Billing','Reviews bill, records payment','billing'],
  ].map(([name,title,detail,tone],index) => `${index ? icon('ArrowRight') : ''}<div data-tone="${tone}">${icon(name)}<span><strong>${title}</strong><small>${detail}</small></span></div>`).join('')}</div>`;
  window.CARE_DECK = [
    {
      id: "welcome",
      chapter: "The need",
      title: "Connected care. Trusted data.",
      cover: true,
      render: () => `<div class="cover-layout"><div class="cover-copy"><p class="cover-context">CareRecord · Enterprise Data Management</p><h1 id="slide-title">Connected care.<br>Trusted data.</h1><p class="cover-description">How one clinic connects its people, patient records and decisions.</p><button class="action" data-action="next" type="button">Begin the story ${icon('ArrowRight')}</button></div><figure class="cover-visual"><img src="./assets/carerecord-sign-in.png" width="1280" height="720" alt="The actual CareRecord staff sign-in screen in its green and white theme"><figcaption>CareRecord staff sign-in. One entry point, six distinct responsibilities.</figcaption><div class="cover-connections"><span>${icon('Stethoscope')}Clinical care</span><span>${icon('FlaskConical')}Laboratory</span><span>${icon('ReceiptText')}Billing</span></div></figure></div>`,
      notes: [
        "CareRecord is a clinic data-management system. It connects patient registration, consultations, laboratory reports and billing, while keeping each responsibility with the right staff role.",
        "This presentation follows one fictional patient from arrival to payment. Then it shows how that workflow demonstrates the EDM concepts in the reference PowerPoint."
],
      evidence: "Existing CareRecord sign-in screen; shared/domain.ts role definitions; integration.pptx.pdf slides 3 and 11."
    },
    {
      id: "the-problem",
      chapter: "The need",
      title: "Why develop CareRecord?",
      render: () => `${lead('Separate records create uncertain identities, slow handoffs and unreliable reports.')}<div class="silos"><div data-tone="identity">${icon('UsersRound')}<h3>Reception</h3><strong>Ana Reyes</strong><p>Patient details in one list.</p></div><div data-tone="clinical">${icon('Stethoscope')}<h3>Consultation</h3><strong>ANA REYES</strong><p>Visit notes in another record.</p></div><div data-tone="laboratory">${icon('FlaskConical')}<h3>Laboratory</h3><strong>Ana R. Reyes?</strong><p>A result with an uncertain match.</p></div><div data-tone="billing">${icon('ReceiptText')}<h3>Billing</h3><strong>Which visit?</strong><p>A charge without a clear link.</p></div></div><div class="solution-strip">${badge('Fingerprint','identity')}<div><strong>CareRecord connects the work.</strong><p>Shared identity, clear responsibility, checked information and traceable changes.</p></div></div>${note('Illustrative fragmentation scenario, not a claim about a measured clinic or a real patient.')}`,
      notes: [
        "The problem is fragmented information. A clinic can have useful records in each department but still struggle to connect them safely.",
        "Different spellings do not prove that two records describe the same person. Missing visit links can also cause uncertainty about which consultation a result or charge belongs to. We developed the system to make these connections controlled and visible.",
        "Our objective is to connect the work without giving everybody unrestricted access. Each record needs a reliable patient identity, a visit link and a responsible person.",
        "The expected benefits are clearer handoffs and more reliable information. We should measure those benefits in actual use before claiming specific time savings or error reductions."
],
      evidence: "Reference slides 2, 6, 10 and 11 describe silos, duplicate identities and unreliable data. | Patient and Visit schema relations; role-scoped services; reference slides 9 and 12."
    },
    {
      id: "three-pillars",
      chapter: "The need",
      title: "Connect. Govern. Check.",
      render: () => `${lead('These three EDM concepts turn connected clinic records into information staff can trust.')}<div class="concept-trio">${[
 ['Link','Integration','Connect the records.','Patient and visit links join consultations, lab results and bills.','identity'],
 ['ShieldCheck','Governance','Control responsibility.','Staff roles, approved prices and correction history define responsibility.','governance'],
 ['ClipboardCheck','Data quality','Check before release.','Validate identity, completeness, timestamps and patient/visit matches.','laboratory'],
 ].map(([name,title,verb,detail,tone]) => `<div data-tone="${tone}">${badge(name,tone)}<h3>${title}</h3><strong>${verb}</strong><p>${detail}</p></div>`).join('')}</div><div class="compact-connection"><span>Internal APIs + department JSON</span>${icon('ArrowRight')}<strong>Checked, linked records</strong>${icon('ArrowRight')}<span>Reporting copies</span></div>${note('CareRecord currently integrates departments within one application database. Independent EMR/LIS/insurance connections are future scope.')}`,
      notes: [
        "We selected the healthcare and laboratory situation from the PowerPoint. CareRecord includes electronic medical record functions, laboratory information functions and billing functions.",
        "The current system integrates these departments internally through one backend and database. That is an honest clinic-scale EDM implementation. It is not yet a network of independent hospital systems synchronizing continuously.",
        "Integration means connecting information. Governance means defining ownership, access and accountability. Data quality management means checking accuracy, completeness and consistency.",
        "A lab result demonstrates all three at once: it is linked to a patient and visit, approved by laboratory staff, and checked for required details before release. These concepts are the foundation of the project, rather than separate decorative modules.",
        "Integration occurs internally when staff actions use the application API to update linked records. WebSocket notifications and periodic refreshes help the next department see its work.",
        "The second path is a controlled JSON source import for laboratory or billing records. Imports validate data, retain source references and hold uncertain identities. The whole file commits together, so a rejected row does not leave a partly saved file. New billing imports must also match completed services and manager-approved prices. These are useful integration methods, but they are not external-system CDC or an insurance connector.",
        "Pricing shows the three concepts together. The charge links to a completed consultation or approved test, the account manager controls its approved price, and the system checks that a valid price exists and the linked service has not already been charged. Billing reviews the charge and records payment."
],
      evidence: "backend/prisma/schema.prisma: Patient, Visit, LabReport and Invoice; reference slide 11. | Reference slide 3; shared/domain.ts; clinic.service.ts; server.ts visibleData(). | frontend app/lib/backend.ts; clinic.routes.ts; importsService(); realtime/notifications.ts; reference slide 8."
    },
    {
      id: "complete-workflow",
      chapter: "The patient journey",
      title: "One patient, from arrival to payment.",
      render: () => `${lead('Ana Reyes · Patient P-DEMO-01 · Visit V-DEMO-01. One identity connects every handoff.')}<div class="journey-overview"><div class="journey-row" data-tone="clinical"><span class="lane-label">Arrival and care</span><div>${icon('UsersRound')}<strong>Register</strong><small>Verify identity, assign doctor</small></div><span class="flow-arrow">→</span><div>${icon('CalendarDays')}<strong>Check in</strong><small>Create waiting visit</small></div><span class="flow-arrow">→</span><div>${icon('Stethoscope')}<strong>Consult</strong><small>Document, request tests, sign</small></div></div><div class="journey-row branch-lane" data-tone="laboratory"><span class="lane-label">Laboratory branch</span><div>${icon('FileInput')}<strong>Test request</strong><small>After consultation starts</small></div><span class="flow-arrow">→</span><div>${icon('FlaskConical')}<strong>Check and approve</strong><small>Laboratory staff</small></div><span class="flow-arrow">→</span><div>${icon('Stethoscope')}<strong>Review and plan</strong><small>Assigned doctor</small></div></div><div class="journey-row" data-tone="billing"><span class="lane-label">Financial branch</span><div>${icon('ReceiptText')}<strong>Prepare invoice</strong><small>Completed services + approved prices</small></div><span class="flow-arrow">→</span><div>${icon('CreditCard')}<strong>Record payment</strong><small>Billing staff</small></div><span class="flow-arrow">→</span><div>${icon('FileText')}<strong>Print receipt</strong><small>For a saved payment</small></div></div></div>${pricingFlow()}${note('Fictional example. Billing starts after the consultation is completed. Approved tests can be added later to the same bill. The doctor records result review separately. No patient portal.')}`,
      notes: [
        "To make the system easy to understand, we will follow Ana Reyes, a fictional patient. Her permanent patient reference is P-DEMO-01. This consultation has its own visit reference, V-DEMO-01.",
        "The difference matters: a person can return many times. The patient record identifies the person, while a visit identifies one episode of care. Lab reports and invoices need both links.",
        "Registration begins with identity, not simply typing a name. The application validates basic fields and checks for a possible existing patient with the same normalized name and birth date.",
        "A warning prompts staff to investigate. If this is a different person, staff must record evidence for creating a separate record. The software does not automatically merge people because their names look alike.",
        "Registration now checks Ana in. This creates a waiting visit rather than another patient record. The assigned doctor receives the handoff in the work list and notifications.",
        "The doctor starts that visit to begin the consultation. Registration can cancel a waiting check-in with a reason, while a consultation already in progress belongs to the doctor.",
        "The doctor documents the reason for the visit, relevant history, allergy review, findings, assessment and plan. A structured consultation needs an assessment and care plan when completed.",
        "A test can be requested after the consultation has started. Signing the consultation creates the billing handoff. Laboratory work can continue on its own branch, so the presentation should not imply that all test results must be finished before billing begins.",
        "Laboratory staff receive a request linked to Ana and her visit. They enter measurements or a flexible result, units, specimen details and collection time.",
        "An incomplete draft can be saved. Approval requires required details and an explicit staff check. Urgent reports also require a recorded direct contact with the responsible clinician. Result values become available to doctors after approval, not while the report is still a draft.",
        "A notification means the result is available. It does not prove that the doctor has reviewed it. The application requires a separate confirmation and a recorded follow-up decision.",
        "This review is attached to the approved version. If laboratory staff correct and reapprove the report, the previous doctor review does not automatically cover the changed result. The doctor needs to review the new approved version.",
        "The account manager first enters the clinic-approved consultation fee and laboratory test prices under Service prices. No example prices are installed automatically. Billing owns the invoice and payment record. A completed consultation is required before a bill can be prepared, and the database allows one invoice per visit.",
        "For this fictional example, the account manager has approved 500 pesos for consultation and 250 pesos for the laboratory test. Billing selects the completed consultation and approved test, and the system fills their prices from that list. Each charge identifies its service record and who set the price. Ana pays 500 pesos, leaving 250 pesos due. These are teaching amounts, not actual clinic prices. The system records a payment; it does not itself process a bank or card transaction.",
        "This is the full workflow. Registration establishes identity and checks the patient in. The doctor starts the visit, documents care, requests tests as needed and signs the consultation.",
        "The laboratory branch ends with an approved report and explicit doctor review. The financial branch can begin once the consultation is signed, with later approved services added to the same bill. Payment and receipt recording complete the financial work. Approved later services are added to the existing bill with a reason, using their active approved prices. Reviewers handle uncertain identities and reports; account managers maintain staff access and the price list."
],
      evidence: "Patient has many visits; LabReport and Invoice each reference a patient and visit in the Prisma schema. | clinic.service.ts patientsService(); shared/domain.ts validatePatient() and identityKey(). | clinic.service.ts checkInsService() and visitsService(); VisitWorkflow.queueKey uniqueness. | clinic.service.ts visitsService() and labsService(); shared/clinical.ts cleanClinical(). | clinic.service.ts labsService(); shared/domain.ts labProblems(); server.ts visibleData(). | operations.service.ts doctorReviewService(); shared/clinical.ts needsDoctorReview(); labsService() corrections. | billing.service.ts managedInvoicesService(); pricing.service.ts servicePricesService(); shared/billing.ts chargeOffers(); Invoice.visitId unique; operations.service.ts printable documents. | checkInsService(), visitsService(), labsService(), doctorReviewService(), invoicesService() and reviewsService()."
    },
    {
      id: "governance",
      chapter: "Trusted data",
      title: "Six roles. Controlled responsibilities.",
      render: () => `${lead('Each role receives the information it needs. The backend enforces the boundary.')}<div class="permission-grid">${[
        ['UsersRound','Registration','Identity, assignment and check-in','Clinical notes and result values withheld'],
        ['Stethoscope','Doctor','Assigned patients and approved results','Assignment limits access; draft results withheld'],
        ['FlaskConical','Laboratory','Test requests, results and approval','Consultation notes and doctor plans withheld'],
        ['ReceiptText','Billing','Completed services, approved prices and payments','Prices read-only; clinical content withheld'],
        ['ListChecks','Reviewer','Identity checks, quality and reporting','Clinical content withheld; audit detail redacted'],
        ['ShieldCheck','Account manager','Staff access, service prices and clinic settings','Patient, laboratory and invoice records withheld'],
      ].map(([name,title,allowed,boundary]) => `<div class="permission-card" data-tone="${toneFor(name)}"><div class="permission-heading">${badge(name)}<h3>${title}</h3></div><p class="permission-allow">${icon('Check')}<span>${allowed}</span></p><p class="permission-boundary">${icon('LockKeyhole')}<span>${boundary}</span></p></div>`).join('')}</div>${note('Corrections retain earlier signed/approved content and reasons. Audit history records actions; version checks reject stale edits.')}`,
      notes: [
        "There are six staff roles. Registration handles identity and arrival. Doctors handle consultations and clinical decisions. Laboratory staff handle reports. Billing handles invoices and payments.",
        "The reviewer supports identity decisions and reporting. The account manager handles staff access and enters the clinic-approved service prices. This is our authorized application role for maintaining the price list; the clinic decides who approves its fees. A patient portal is not part of the current application, so the patient is the subject of the workflow rather than a seventh software role.",
        "Governance is more than hiding a button. The backend restricts the action itself and controls what information is returned to the browser.",
        "An account manager manages accounts without receiving patient records. Billing staff receive financial records and service names without clinical notes or lab values. Doctors are limited by patient assignment. These boundaries demonstrate ownership and controlled access; they are not a claim that the system alone establishes regulatory compliance.",
        "Clinical corrections must be accountable. The system retains earlier signed consultation or approved lab content when it is corrected, together with the reason and responsible actor.",
        "Version checks also protect simultaneous editing. If a staff member saves an outdated version, the system asks them to refresh instead of silently overwriting a newer record. Audit entries support traceability, although the current audit storage is not a formally immutable external archive.",
        "Only the account manager can add, change or disable service prices. Price changes require a reason and an activity entry. Billing receives read-only approved prices and cannot replace them with an arbitrary amount. Each new bill line keeps its service reference, responsible staff member, approved price and who set it. Changing the price list affects future charges; saved charges keep their original amounts."
],
      evidence: "shared/domain.ts ROLES, ROLE_NAMES and ROLE_DETAILS; pricing.service.ts servicePricesService(); billing.service.ts linkedCharge(); clinic workspace navigation. | shared/domain.ts assertRole(); security.ts roleCanReadPatient(); server.ts visibleData(); clinic.controller.ts. | clinic.service.ts visit/lab correction history; record.repository.ts updateWithHistory(); ActivityHistory model."
    },
    {
      id: "data-quality",
      chapter: "Trusted data",
      title: "Uncertain data waits. Incomplete results stay drafts.",
      render: state => { const complete = state.lab === 'complete'; return `${lead('Automated checks support human review at two important gates.')}<div class="quality-summary"><div class="quality-case" data-tone="identity"><div class="quality-case-heading">${badge('Fingerprint','identity')}<h3>Identity gate</h3></div><div class="identity-comparison"><span>Clinic record<strong>Ana Reyes</strong></span>${icon('CircleAlert')}<span>Source record<strong>Ana R. Reyes?</strong></span></div><p>Check patient number, name, birth date and visit.</p><div class="quality-outcome">${icon('LockKeyhole')}<strong>Hold for identity review.</strong></div><small>Registration or a reviewer links with evidence, or keeps separate. A matched lab import is still a draft.</small></div><div class="quality-case" data-tone="laboratory"><div class="quality-case-heading">${badge('FlaskConical')}<h3>Report gate</h3></div><div class="segmented" role="group" aria-label="Laboratory completeness example"><button type="button" data-action="lab" data-value="incomplete" aria-pressed="${!complete}">Incomplete draft</button><button type="button" data-action="lab" data-value="complete" aria-pressed="${complete}">Checked report</button></div><p>Patient/visit match, result, unit, collection time and staff confirmation.</p><div class="quality-outcome ${complete ? 'is-approved' : ''}">${icon(complete ? 'CircleCheck' : 'LockKeyhole')}<strong>${complete ? 'Ready for approval' : 'Approval stays blocked'}</strong></div><small>${complete ? 'The doctor receives approved content and records follow-up. A correction requires a fresh review.' : 'Save the draft; complete missing details before release. Urgent results require recorded clinician contact.'}</small></div></div>${note('Also checked: patient duplicates, dates, approved prices, repeated linked charges and payment limits. Clinical correctness remains with qualified staff.')}`; },
      notes: [
        "Quality management is visible in how uncertain information is treated. An imported source record is checked against patient number, normalized name, birth date and visit relationship.",
        "If those details do not safely match, the source is held and an identity-review task is created. Registration or a reviewer verifies evidence and either links it or keeps it separate. Even a safely matched lab import becomes a draft, so identity matching never replaces laboratory approval.",
        "Billing has checks too: a service needs an active manager-approved price, the selected consultation or report must belong to the correct patient and visit, and a linked service cannot be charged twice. A changed price list makes the user review the latest amounts before saving. Billing imports and identity-linking decisions cannot bypass these checks. Earlier bills remain payable, and older charges without source links are labeled honestly rather than given invented history."
],
      evidence: "clinic.service.ts importsService(), reviewsService() and materializeImport(); billing.service.ts linkedCharge() and pricedImportItems(); reference slides 6 and 11."
    },
    {
      id: "etl",
      chapter: "Trusted data",
      title: "ETL turns checked records into reports.",
      render: state => { const loaded = !!state.loaded; return `${lead('The reviewer selects Update figures: Extract → Transform → Load.')}<div class="compact-etl"><div class="compact-stages">${[
 ['Database','Extract','Read consultations, lab reports, invoices and payments.','identity'],
 ['ClipboardCheck','Transform','Select checked records; standardize fields and dates.','laboratory'],
 ['ChartNoAxesCombined','Load','Save reporting facts together for charts and CSV.','review'],
 ].map(([name,title,detail,tone]) => `<div data-tone="${tone}">${badge(name,tone)}<div><h3>${title}</h3><p>${detail}</p></div></div>`).join('')}</div><div class="compact-etl-result"><span class="example-label">Fictional reporting example</span><div class="etl-result-numbers"><span><strong>6</strong>source records</span>${icon('ArrowRight')}<span><strong>${loaded ? '4' : '0'}</strong>${loaded ? 'checked facts' : 'facts loaded'}</span></div><div class="compact-facts">${[['Stethoscope','Signed visit'],['FlaskConical','Approved lab'],['ReceiptText','Invoice'],['CreditCard','Payment']].map(([name,title]) => `<span class="${loaded ? 'included' : 'pending'}">${icon(loaded ? 'Check' : name)}${title}</span>`).join('')}</div><p class="draft-exclusion">${icon('X')}2 drafts excluded: consultation + laboratory</p><button type="button" class="action" data-action="${loaded ? 'reset-load' : 'load'}">${icon(loaded ? 'RefreshCw' : 'Database')}${loaded ? 'Reset example' : 'Update example figures'}</button></div></div><div class="compact-finance"><span>Example priced bill <strong>₱750 charged</strong></span><span><strong>₱500 received</strong></span><span><strong>₱250 due</strong></span><small>Fictional approved fees: ₱500 consultation + ₱250 test.</small></div>${note('Manual batch ETL in the same PostgreSQL database, from one consistent snapshot. Charts/CSV omit names, notes and result values; internal keys remain linkable. This example never calls the clinic API.')}`; },
      notes: [
        "Extract means gathering data. Transform means selecting valid records and putting them into a consistent shape. Load means saving that transformed data to the reporting target.",
        "In CareRecord, the reviewer selects Update figures. The backend reads a consistent snapshot, selects eligible records, transforms their reporting fields and saves the facts together. That implements the ETL idea from slides 4 through 7. It is a batch refresh in the same database, not a continuously synchronized external warehouse.",
        "Here we have six example source records. There is one signed consultation and one consultation draft. There is one valid approved laboratory report and one laboratory draft. There is also an invoice and a valid payment entry on that invoice.",
        "The reporting refresh selects four facts: the signed visit, approved report, invoice and payment. The two drafts remain operational work and do not count as completed activity. This demonstrates extraction, selection and transformation, and loading into reporting copies. It does not measure a real clinic.",
        "The reviewer can understand completed consultations and approved laboratory activity without receiving the full clinical content. In this fictional example the manager-approved consultation and test fees total 750 pesos, with 500 pesos paid and 250 pesos remaining. The price list is setup information; the six example source records and four selected reporting facts stay the same. Reporting uses the saved bill amounts, so a later price-list change does not rewrite this bill or its financial history.",
        "A payment received tomorrow should count as tomorrow’s receipt even if the bill was issued today. The reporting code separates these concepts. Figures reflect the latest refresh, while current identity questions and incomplete-report counts are separate quality measures. Reporting removes direct clinical and contact fields but still retains linkable source keys internally."
],
      evidence: "server.ts refreshWarehouse(); clinic.repository.ts transaction(); warehouse facts/runs models; reference slides 4-7. | server.ts refreshWarehouse() eligibility filters, four fact kinds and reporting replacement; reference slides 4-7. | shared/analytics.ts reportSummary(); analytics-workspace.tsx; clinic.service.ts reportExportService(); server.ts quality counters."
    },
    {
      id: "alignment",
      chapter: "The evidence",
      title: "How CareRecord aligns with the PowerPoint.",
      render: () => `${lead('The healthcare/laboratory case is demonstrated by connected work, controlled access and checked reports.')}<div class="compact-evidence"><div class="alignment-ledger">${[
 ['3','Link','Integration + governance + DQM','Linked records, role ownership and quality gates','identity'],
 ['4-7','Database','Extract, transform, load','Operational data → checked reporting facts','review'],
 ['11, 13','FlaskConical','EMR + LIS + billing / integration hub','Consultations, lab results and financial handoffs','laboratory'],
 ].map(([ref,name,title,detail,tone]) => `<div data-tone="${tone}"><span class="reference-number"><small>Reference</small><strong>${ref}</strong></span>${badge(name,tone)}<div><h3>${title}</h3><p>${detail}</p></div></div>`).join('')}</div><div class="compact-scope"><div><h3>${icon('CircleCheck')}Implemented</h3><p>Clinic workflows, role controls, identity checks, approved prices, linked charges, imports and reporting.</p><small>One standard consultation fee + separate test prices.</small></div><div><h3>${icon('ArrowUpRight')}Future / separately verified</h3><p>Fees by doctor or visit type, insurance, live EMR/LIS/CDC, enterprise scale and formal HIPAA / ISO 15189 evidence.</p><small>External/compliance targets: reference slides 15 and 18.</small></div></div></div><div class="compact-architecture"><span>Next.js frontend</span>${icon('ArrowRight')}<span>Express rules / API</span>${icon('ArrowRight')}<span>Prisma + PostgreSQL</span></div>${note('A governed clinic EDM prototype; security features alone do not establish compliance. Demonstrate price setup, the patient journey, blocked approvals, a held import and reporting.')}`,
      notes: [
        "CareRecord itself uses a Next.js frontend and an Express backend. Prisma manages access to PostgreSQL, configured for Neon. The backend owns authentication, permissions and business rules.",
        "Operational records and reporting facts are different tables within the same database. A reporting refresh copies selected fields instead of exporting full clinical content. This presentation is a separate static website and has no access to that database.",
        "The alignment comes from demonstrated behavior. Slide 3 defines the three concepts; we demonstrate them through linked records, controlled responsibilities and checks. Slides 4 to 7 explain ETL; our reporting refresh implements the same process.",
        "Slide 11 is our chosen healthcare example. Slide 13 is a broader architecture analogy. Slides 15 and 18 include external systems, insurance and regulatory expectations, so we describe that wider alignment as partial. The other industry situations are alternatives, not additional modules we must implement.",
        "We can confidently present the internal workflow, access controls, data checks, manager-controlled prices, charges linked to completed services, imports and reporting. The current price list supports one standard consultation fee across the clinic and separate prices for each laboratory test. Different consultation fees by doctor, specialty or first versus follow-up visit are not implemented. Free or discounted charges and insurance pricing also need separate support.",
        "We have not implemented continuous connections to independent EMR, LIS or insurance systems. Formal compliance and accreditation also need organizational procedures, hosting controls and operational evidence beyond application code. Being precise about scope makes the project explanation stronger.",
        "For the live demonstration, prepare fictional records and individual role accounts in advance. Have the account manager enter the approved practice fees first. Then show the normal journey and open a bill to explain where its service records and prices came from. The presentation uses fictional amounts and never accesses clinic accounts.",
        "For example, an incomplete lab report cannot be approved, an uncertain import is held for checking, and billing does not receive clinical notes. Complete the report and show the doctor’s follow-up decision. Finally refresh reporting and explain why drafts are excluded. Keep credentials off the screen and out of the presentation."
],
      evidence: "Frontend and backend package.json files; frontend API adapter; backend index.ts; Prisma schema and repositories. | integration.pptx.pdf, slides 3-7, 11, 13, 15 and 18. Code mapping documented in the source review. | Codebase review and reference slides 8, 12, 15 and 18. No external connector or insurance workflow found. | pricing.service.ts; billing.service.ts; shared/billing.ts; frontend service-prices.tsx and billing-charges.tsx; actual role workspaces and demonstration checklist."
    },
    {
      id: "closing",
      chapter: "The evidence",
      title: "Connected care. Trusted data.",
      customHeading: true,
      render: () => `<div class="closing-finale"><div class="finale-brand">${icon('Activity')}<span>CareRecord</span></div><h2 id="slide-title">Connected care.<br><span>Trusted data.</span></h2><p class="finale-summary">One patient journey, with connected records<br>and clear responsibility at every handoff.</p><div class="finale-pillars">${[
        ['Link','Integration','Connect the records.','identity'],
        ['ShieldCheck','Governance','Control responsibility.','governance'],
        ['ClipboardCheck','Data quality','Check before release.','laboratory'],
        ['Database','ETL reporting','Report checked activity.','review'],
      ].map(([name,title,detail,tone]) => `<div data-tone="${tone}">${badge(name,tone)}<strong>${title}</strong><span>${detail}</span></div>`).join('')}</div><div class="finale-bottom"><span>Thank you. Questions & discussion.</span><button type="button" class="action secondary" data-action="restart">Back to the beginning ${icon('ArrowLeft')}</button></div></div>`,
      notes: [
        "If asked what we are making, say: CareRecord is a clinic data-management system that connects patient registration, consultations, laboratory records and billing. It uses role-based access, validation, approvals and audit history to keep information trustworthy, then prepares checked data for reporting.",
        "The patient journey demonstrates the operational value. Integration, governance, data quality and ETL explain why that journey is an Enterprise Data Management project."
],
      evidence: "Synthesis of the implemented CareRecord workflows and the supplied EDM lesson."
    }
  ];
})();
