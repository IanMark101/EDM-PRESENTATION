# CareRecord speaking guide

Fictional patient and prices; no live clinic data.

## 1. Connected care. Trusted data.

CareRecord is a clinic data-management system. It connects patient registration, consultations, laboratory reports and billing, while keeping each responsibility with the right staff role.

This presentation follows one fictional patient from arrival to payment. Then it shows how that workflow demonstrates the EDM concepts in the reference PowerPoint.

Evidence: Existing CareRecord sign-in screen; shared/domain.ts role definitions; integration.pptx.pdf slides 3 and 11.

## 2. Why develop CareRecord?

The problem is fragmented information. A clinic can have useful records in each department but still struggle to connect them safely.

Different spellings do not prove that two records describe the same person. Missing visit links can also cause uncertainty about which consultation a result or charge belongs to. We developed the system to make these connections controlled and visible.

Our objective is to connect the work without giving everybody unrestricted access. Each record needs a reliable patient identity, a visit link and a responsible person.

The expected benefits are clearer handoffs and more reliable information. We should measure those benefits in actual use before claiming specific time savings or error reductions.

Evidence: Reference slides 2, 6, 10 and 11 describe silos, duplicate identities and unreliable data. | Patient and Visit schema relations; role-scoped services; reference slides 9 and 12.

## 3. Connect. Govern. Check.

We selected the healthcare and laboratory situation from the PowerPoint. CareRecord includes electronic medical record functions, laboratory information functions and billing functions.

The current system integrates these departments internally through one backend and database. That is an honest clinic-scale EDM implementation. It is not yet a network of independent hospital systems synchronizing continuously.

Integration means connecting information. Governance means defining ownership, access and accountability. Data quality management means checking accuracy, completeness and consistency.

A lab result demonstrates all three at once: it is linked to a patient and visit, approved by laboratory staff, and checked for required details before release. These concepts are the foundation of the project, rather than separate decorative modules.

Integration occurs internally when staff actions use the application API to update linked records. WebSocket notifications and periodic refreshes help the next department see its work.

The second path is a controlled JSON source import for laboratory or billing records. Imports validate data, retain source references and hold uncertain identities. The whole file commits together, so a rejected row does not leave a partly saved file. New billing imports must also match completed services and manager-approved prices. These are useful integration methods, but they are not external-system CDC or an insurance connector.

Pricing shows the three concepts together. The charge links to a completed consultation or approved test, the account manager controls its approved price, and the system checks that a valid price exists and the linked service has not already been charged. Billing reviews the charge and records payment.

Evidence: backend/prisma/schema.prisma: Patient, Visit, LabReport and Invoice; reference slide 11. | Reference slide 3; shared/domain.ts; clinic.service.ts; server.ts visibleData(). | frontend app/lib/backend.ts; clinic.routes.ts; importsService(); realtime/notifications.ts; reference slide 8.

## 4. One patient, from arrival to payment.

To make the system easy to understand, we will follow Ana Reyes, a fictional patient. Her permanent patient reference is P-DEMO-01. This consultation has its own visit reference, V-DEMO-01.

The difference matters: a person can return many times. The patient record identifies the person, while a visit identifies one episode of care. Lab reports and invoices need both links.

Registration begins with identity, not simply typing a name. The application validates basic fields and checks for a possible existing patient with the same normalized name and birth date.

A warning prompts staff to investigate. If this is a different person, staff must record evidence for creating a separate record. The software does not automatically merge people because their names look alike.

Registration now checks Ana in. This creates a waiting visit rather than another patient record. The assigned doctor receives the handoff in the work list and notifications.

The doctor starts that visit to begin the consultation. Registration can cancel a waiting check-in with a reason, while a consultation already in progress belongs to the doctor.

The doctor documents the reason for the visit, relevant history, allergy review, findings, assessment and plan. A structured consultation needs an assessment and care plan when completed.

A test can be requested after the consultation has started. Signing the consultation creates the billing handoff. Laboratory work can continue on its own branch, so the presentation should not imply that all test results must be finished before billing begins.

Laboratory staff receive a request linked to Ana and her visit. They enter measurements or a flexible result, units, specimen details and collection time.

An incomplete draft can be saved. Approval requires required details and an explicit staff check. Urgent reports also require a recorded direct contact with the responsible clinician. Result values become available to doctors after approval, not while the report is still a draft.

A notification means the result is available. It does not prove that the doctor has reviewed it. The application requires a separate confirmation and a recorded follow-up decision.

The assigned doctor reviews the approved report and chooses when to release it. A correction requires a new review and release before the patient can see the updated result.

Registration verifies Ana’s identity in person and gives her a one-time setup code. Ana opens Patient sign-in, sets her own password and can return to see her completed visits, released laboratory results and bills. Her account can only retrieve records linked to her own patient number.

The account manager first enters the clinic-approved consultation fee and laboratory test prices under Service prices. No example prices are installed automatically. Billing owns the invoice and payment record. A completed consultation is required before a bill can be prepared, and the database allows one invoice per visit.

For this fictional example, the account manager has approved 500 pesos for consultation and 250 pesos for the laboratory test. Billing selects the completed consultation and approved test, and the system fills their prices from that list. Each charge identifies its service record and who set the price. Ana pays 500 pesos, leaving 250 pesos due. These are teaching amounts, not actual clinic prices. The system records a payment; it does not itself process a bank or card transaction.

This is the full workflow. Registration establishes identity and checks the patient in. The doctor starts the visit, documents care, requests tests as needed and signs the consultation.

The laboratory branch ends with an approved report and explicit doctor review. The financial branch can begin once the consultation is signed, with later approved services added to the same bill. Payment and receipt recording complete the financial work. Approved later services are added to the existing bill with a reason, using their active approved prices. Reviewers handle uncertain identities and reports; account managers maintain staff access and the price list.

Evidence: Patient has many visits; LabReport and Invoice each reference a patient and visit in the Prisma schema. | clinic.service.ts patientsService(); shared/domain.ts validatePatient() and identityKey(). | clinic.service.ts checkInsService() and visitsService(); VisitWorkflow.queueKey uniqueness. | clinic.service.ts visitsService() and labsService(); shared/clinical.ts cleanClinical(). | clinic.service.ts labsService(); shared/domain.ts labProblems(); server.ts visibleData(). | operations.service.ts doctorReviewService() and patientResultReleaseService(); patient-portal.service.ts; labsService() corrections. | billing.service.ts managedInvoicesService(); pricing.service.ts servicePricesService(); shared/billing.ts chargeOffers(); Invoice.visitId unique; operations.service.ts printable documents. | checkInsService(), visitsService(), labsService(), doctorReviewService(), invoicesService() and reviewsService().

## 5. Six staff roles. Controlled access.

There are six staff roles. Registration handles identity and arrival. Doctors handle consultations and clinical decisions. Laboratory staff handle reports. Billing handles invoices and payments.

The reviewer handles identity checks and reporting. The account manager handles staff access and enters the clinic-approved service prices. Patients use separate accounts with read-only access to their own records.

Activity history lets authorized staff page through recorded events and filter by role, action or date. Setup and result release leave their own entries.

Governance is more than hiding a button. The backend restricts the action itself and controls what information is returned to the browser.

An account manager manages accounts without receiving patient records. Billing staff receive financial records and service names without clinical notes or lab values. Doctors are limited by patient assignment. These boundaries demonstrate ownership and controlled access; they are not a claim that the system alone establishes regulatory compliance.

Clinical corrections must be accountable. The system retains earlier signed consultation or approved lab content when it is corrected, together with the reason and responsible actor.

Version checks also protect simultaneous editing. If a staff member saves an outdated version, the system asks them to refresh instead of silently overwriting a newer record. Audit entries support traceability, although the current audit storage is not a formally immutable external archive.

Only the account manager can add, change or disable service prices. Price changes require a reason and an activity entry. Billing receives read-only approved prices and cannot replace them with an arbitrary amount. Each new bill line keeps its service reference, responsible staff member, approved price and who set it. Changing the price list affects future charges; saved charges keep their original amounts.

Evidence: shared/domain.ts ROLES, ROLE_NAMES and ROLE_DETAILS; pricing.service.ts servicePricesService(); billing.service.ts linkedCharge(); clinic workspace navigation. | shared/domain.ts assertRole(); security.ts roleCanReadPatient(); server.ts visibleData(); clinic.controller.ts. | clinic.service.ts visit/lab correction history; record.repository.ts updateWithHistory(); history.service.ts; ActivityHistory model.

## 6. Uncertain data waits. Incomplete results stay drafts.

Quality management is visible in how uncertain information is treated. An imported source record is checked against patient number, normalized name, birth date and visit relationship.

If those details do not safely match, the source is held and an identity-review task is created. Registration or a reviewer verifies evidence and either links it or keeps it separate. Even a safely matched lab import becomes a draft, so identity matching never replaces laboratory approval.

Billing has checks too: a service needs an active manager-approved price, the selected consultation or report must belong to the correct patient and visit, and a linked service cannot be charged twice. A changed price list makes the user review the latest amounts before saving. Billing imports and identity-linking decisions cannot bypass these checks. Earlier bills remain payable, and older charges without source links are labeled honestly rather than given invented history.

Evidence: clinic.service.ts importsService(), reviewsService() and materializeImport(); billing.service.ts linkedCharge() and pricedImportItems(); reference slides 6 and 11.

## 7. ETL turns checked records into reports.

Extract means gathering data. Transform means selecting valid records and putting them into a consistent shape. Load means saving that transformed data to the reporting target.

In CareRecord, the reviewer selects Update figures. The backend reads a consistent snapshot, selects eligible records, transforms their reporting fields and saves the facts together. That implements the ETL idea from slides 4 through 7. It is a batch refresh in the same database, not a continuously synchronized external warehouse.

Here we have six example source records. There is one signed consultation and one consultation draft. There is one valid approved laboratory report and one laboratory draft. There is also an invoice and a valid payment entry on that invoice.

The reporting refresh selects four facts: the signed visit, approved report, invoice and payment. The two drafts remain operational work and do not count as completed activity. This demonstrates extraction, selection and transformation, and loading into reporting copies. It does not measure a real clinic.

The reviewer can understand completed consultations and approved laboratory activity without receiving the full clinical content. In this fictional example the manager-approved consultation and test fees total 750 pesos, with 500 pesos paid and 250 pesos remaining. The price list is setup information; the six example source records and four selected reporting facts stay the same. Reporting uses the saved bill amounts, so a later price-list change does not rewrite this bill or its financial history.

A payment received tomorrow should count as tomorrow’s receipt even if the bill was issued today. The reporting code separates these concepts. Figures reflect the latest refresh, while current identity questions and incomplete-report counts are separate quality measures. Reporting removes direct clinical and contact fields but still retains linkable source keys internally.

Evidence: server.ts refreshWarehouse(); clinic.repository.ts transaction(); warehouse facts/runs models; reference slides 4-7. | server.ts refreshWarehouse() eligibility filters, four fact kinds and reporting replacement; reference slides 4-7. | shared/analytics.ts reportSummary(); analytics-workspace.tsx; clinic.service.ts reportExportService(); server.ts quality counters.

## 8. How CareRecord aligns with the PowerPoint.

CareRecord itself uses a Next.js frontend and an Express backend. Prisma manages access to PostgreSQL, configured for Neon. The backend owns authentication, permissions and business rules.

Operational records and reporting facts are different tables within the same database. A reporting refresh copies selected fields instead of exporting full clinical content. This presentation is a separate static website and has no access to that database.

The alignment comes from demonstrated behavior. Slide 3 defines the three concepts; we demonstrate them through linked records, controlled responsibilities and checks. Slides 4 to 7 explain ETL; our reporting refresh implements the same process.

Slide 11 is our chosen healthcare example. Slide 13 is a broader architecture analogy. Slides 15 and 18 include external systems, insurance and regulatory expectations, so we describe that wider alignment as partial. The other industry situations are alternatives, not additional modules we must implement.

We can confidently present the internal workflow, access controls, data checks, manager-controlled prices, charges linked to completed services, imports and reporting. The current price list supports one standard consultation fee across the clinic and separate prices for each laboratory test. Different consultation fees by doctor, specialty or first versus follow-up visit are not implemented. Free or discounted charges and insurance pricing also need separate support.

We have not implemented continuous connections to independent EMR, LIS or insurance systems. Formal compliance and accreditation also need organizational procedures, hosting controls and operational evidence beyond application code. Being precise about scope makes the project explanation stronger.

For the live demonstration, prepare fictional records and individual role accounts in advance. Have the account manager enter the approved practice fees first. Then show the normal journey and open a bill to explain where its service records and prices came from. The presentation uses fictional amounts and never accesses clinic accounts.

Show how an incomplete report is blocked and how an uncertain import is held. After the doctor reviews and releases the result, show it in the patient portal. Use Activity history to find the release event, then refresh the reporting figures and explain which records count. Keep credentials out of the presentation.

Evidence: Frontend and backend package.json files; frontend API adapter; backend index.ts; Prisma schema and repositories. | integration.pptx.pdf, slides 3-7, 11, 13, 15 and 18. Code mapping documented in the source review. | Codebase review and reference slides 8, 12, 15 and 18. No external connector or insurance workflow found. | pricing.service.ts; billing.service.ts; shared/billing.ts; frontend service-prices.tsx and billing-charges.tsx; actual role workspaces and demonstration checklist.

## 9. Connected care. Trusted data.

If asked what we are making, say: CareRecord is a clinic data-management system that connects patient registration, consultations, laboratory records and billing. It uses role-based access, validation, approvals and audit history to keep information trustworthy, then prepares checked data for reporting.

The patient journey demonstrates the operational value. Integration, governance, data quality and ETL explain why that journey is an Enterprise Data Management project.

Evidence: Synthesis of the implemented CareRecord workflows and the supplied EDM lesson.
