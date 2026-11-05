# CareRecord speaking guide

Fictional patient and prices; no live clinic data.

## 1. Connected care. Trusted data.

CareRecord is a clinic data-management system. It connects patient registration, consultations, laboratory reports and billing, while keeping each responsibility with the right staff role.

This presentation follows one fictional patient from arrival to payment. Then it shows how that workflow demonstrates the EDM concepts in the reference PowerPoint.

Evidence: Existing CareRecord sign-in screen; shared/domain.ts role definitions; integration.pptx.pdf slides 3 and 11.

## 2. One patient. Disconnected records.

The problem is fragmented information. A clinic can have useful records in each department but still struggle to connect them safely.

Different spellings do not prove that two records describe the same person. Missing visit links can also cause uncertainty about which consultation a result or charge belongs to. We developed the system to make these connections controlled and visible.

Evidence: Reference slides 2, 6, 10 and 11 describe silos, duplicate identities and unreliable data.

## 3. Give each record a clear place.

Our objective is to connect the work without giving everybody unrestricted access. Each record needs a reliable patient identity, a visit link and a responsible person.

The expected benefits are clearer handoffs and more reliable information. We should measure those benefits in actual use before claiming specific time savings or error reductions.

Evidence: Patient and Visit schema relations; role-scoped services; reference slides 9 and 12.

## 4. A connected clinic workspace.

We selected the healthcare and laboratory situation from the PowerPoint. CareRecord includes electronic medical record functions, laboratory information functions and billing functions.

The current system integrates these departments internally through one backend and database. That is an honest clinic-scale EDM implementation. It is not yet a network of independent hospital systems synchronizing continuously.

Evidence: backend/prisma/schema.prisma: Patient, Visit, LabReport and Invoice; reference slide 11.

## 5. Connect. Govern. Check.

Integration means connecting information. Governance means defining ownership, access and accountability. Data quality management means checking accuracy, completeness and consistency.

A lab result demonstrates all three at once: it is linked to a patient and visit, approved by laboratory staff, and checked for required details before release. These concepts are the foundation of the project, rather than separate decorative modules.

Evidence: Reference slide 3; shared/domain.ts; clinic.service.ts; server.ts visibleData().

## 6. Six roles. Clear responsibilities.

There are six staff roles. Registration handles identity and arrival. Doctors handle consultations and clinical decisions. Laboratory staff handle reports. Billing handles invoices and payments.

The reviewer supports identity decisions and reporting. The account manager handles staff access. A patient portal is not part of the current application, so the patient is the subject of the workflow rather than a seventh software role.

Evidence: shared/domain.ts ROLES, ROLE_NAMES and ROLE_DETAILS; clinic workspace navigation.

## 7. Follow Ana through the clinic.

To make the system easy to understand, we will follow Ana Reyes, a fictional patient. Her permanent patient reference is P-DEMO-01. This consultation has its own visit reference, V-DEMO-01.

The difference matters: a person can return many times. The patient record identifies the person, while a visit identifies one episode of care. Lab reports and invoices need both links.

Evidence: Patient has many visits; LabReport and Invoice each reference a patient and visit in the Prisma schema.

## 8. Confirm the person before the record.

Registration begins with identity, not simply typing a name. The application validates basic fields and checks for a possible existing patient with the same normalized name and birth date.

A warning prompts staff to investigate. If this is a different person, staff must record evidence for creating a separate record. The software does not automatically merge people because their names look alike.

Evidence: clinic.service.ts patientsService(); shared/domain.ts validatePatient() and identityKey().

## 9. Arrival becomes a doctor handoff.

Registration now checks Ana in. This creates a waiting visit rather than another patient record. The assigned doctor receives the handoff in the work list and notifications.

The doctor starts that visit to begin the consultation. Registration can cancel a waiting check-in with a reason, while a consultation already in progress belongs to the doctor.

Evidence: clinic.service.ts checkInsService() and visitsService(); VisitWorkflow.queueKey uniqueness.

## 10. Document care. Request what is needed.

The doctor documents the reason for the visit, relevant history, allergy review, findings, assessment and plan. A structured consultation needs an assessment and care plan when completed.

A test can be requested after the consultation has started. Signing the consultation creates the billing handoff. Laboratory work can continue on its own branch, so the presentation should not imply that all test results must be finished before billing begins.

Evidence: clinic.service.ts visitsService() and labsService(); shared/clinical.ts cleanClinical().

## 11. A draft is not a released result.

Laboratory staff receive a request linked to Ana and her visit. They enter measurements or a flexible result, units, specimen details and collection time.

An incomplete draft can be saved. Approval requires required details and an explicit staff check. Urgent reports also require a recorded direct contact with the responsible clinician. Result values become available to doctors after approval, not while the report is still a draft.

Evidence: clinic.service.ts labsService(); shared/domain.ts labProblems(); server.ts visibleData().

## 12. Delivering a result is not reviewing it.

A notification means the result is available. It does not prove that the doctor has reviewed it. The application requires a separate confirmation and a recorded follow-up decision.

This review is attached to the approved version. If laboratory staff correct and reapprove the report, the previous doctor review does not automatically cover the changed result. The doctor needs to review the new approved version.

Evidence: operations.service.ts doctorReviewService(); shared/clinical.ts needsDoctorReview(); labsService() corrections.

## 13. One visit. One itemized bill.

Billing owns the financial record. A signed consultation is required before a bill can be prepared, and the database allows one invoice per visit.

In our example the consultation is 500 pesos and the laboratory service is 250 pesos. Ana pays 500 pesos, leaving 250 pesos due. These are teaching amounts, not actual clinic prices. The system records a payment; it does not itself process a bank or card transaction. Additional services are added to the existing invoice with a reason.

Evidence: clinic.service.ts invoicesService(); billing.repository.ts createBillOnce(); Invoice.visitId unique; operations.service.ts printable documents.

## 14. The complete journey, connected.

This is the full workflow. Registration establishes identity and checks the patient in. The doctor starts the visit, documents care, requests tests as needed and signs the consultation.

The laboratory branch ends with an approved report and explicit doctor review. The financial branch can begin once the consultation is signed, with later approved services added to the same bill. Payment and receipt recording complete the financial work. Reviewers handle uncertain identities and reports; account managers support access.

Evidence: checkInsService(), visitsService(), labsService(), doctorReviewService(), invoicesService() and reviewsService().

## 15. Access follows responsibility.

Governance is more than hiding a button. The backend restricts the action itself and controls what information is returned to the browser.

An account manager manages accounts without receiving patient records. Billing staff receive financial records and service names without clinical notes or lab values. Doctors are limited by patient assignment. These boundaries demonstrate ownership and controlled access; they are not a claim that the system alone establishes regulatory compliance.

Evidence: shared/domain.ts assertRole(); security.ts roleCanReadPatient(); server.ts visibleData(); clinic.controller.ts.

## 16. A correction should leave a history.

Clinical corrections must be accountable. The system retains earlier signed consultation or approved lab content when it is corrected, together with the reason and responsible actor.

Version checks also protect simultaneous editing. If a staff member saves an outdated version, the system asks them to refresh instead of silently overwriting a newer record. Audit entries support traceability, although the current audit storage is not a formally immutable external archive.

Evidence: clinic.service.ts visit/lab correction history; record.repository.ts updateWithHistory(); ActivityHistory model.

## 17. Uncertain data waits for a check.

Quality management is visible in how uncertain information is treated. An imported source record is checked against patient number, normalized name, birth date and visit relationship.

If those details do not safely match, the source is held and an identity-review task is created. Registration or a reviewer verifies evidence and either links it or keeps it separate. Even a safely matched lab import becomes a draft, so identity matching never replaces laboratory approval.

Evidence: clinic.service.ts importsService(), reviewsService() and materializeImport(); reference slides 6 and 11.

## 18. Two practical ways information connects.

Integration occurs internally when staff actions use the application API to update linked records. WebSocket notifications and periodic refreshes help the next department see its work.

The second path is a controlled JSON source import for laboratory or billing records. Imports validate data, retain source references and hold uncertain identities. The whole file commits together, so a rejected row does not leave a partly saved file. These are useful integration methods, but they are not external-system CDC or an insurance connector.

Evidence: frontend app/lib/backend.ts; clinic.routes.ts; importsService(); realtime/notifications.ts; reference slide 8.

## 19. From clinic activity to checked reports.

Extract means gathering data. Transform means selecting valid records and putting them into a consistent shape. Load means saving that transformed data to the reporting target.

In CareRecord, the reviewer selects Update figures. The backend reads a consistent snapshot, selects eligible records, transforms their reporting fields and saves the facts together. That implements the ETL idea from slides 4 through 7. It is a batch refresh in the same database, not a continuously synchronized external warehouse.

Evidence: server.ts refreshWarehouse(); clinic.repository.ts transaction(); warehouse facts/runs models; reference slides 4-7.

## 20. Six source records. Four checked facts.

Here we have six example source records. There is one signed consultation and one consultation draft. There is one valid approved laboratory report and one laboratory draft. There is also an invoice and a valid payment entry on that invoice.

The reporting refresh selects four facts: the signed visit, approved report, invoice and payment. The two drafts remain operational work and do not count as completed activity. This demonstrates extraction, selection and transformation, and loading into reporting copies. It does not measure a real clinic.

Evidence: server.ts refreshWarehouse() eligibility filters, four fact kinds and reporting replacement; reference slides 4-7.

## 21. Reports explain checked activity.

The reviewer can understand completed consultations and approved laboratory activity without receiving the full clinical content. The example bill has 750 pesos charged, 500 pesos paid and 250 pesos remaining.

A payment received tomorrow should count as tomorrow’s receipt even if the bill was issued today. The reporting code separates these concepts. Figures reflect the latest refresh, while current identity questions and incomplete-report counts are separate quality measures. Reporting removes direct clinical and contact fields but still retains linkable source keys internally.

Evidence: shared/analytics.ts reportSummary(); analytics-workspace.tsx; clinic.service.ts reportExportService(); server.ts quality counters.

## 22. Where the system’s responsibilities live.

CareRecord itself uses a Next.js frontend and an Express backend. Prisma manages access to PostgreSQL, configured for Neon. The backend owns authentication, permissions and business rules.

Operational records and reporting facts are different tables within the same database. A reporting refresh copies selected fields instead of exporting full clinical content. This presentation is a separate static website and has no access to that database.

Evidence: Frontend and backend package.json files; frontend API adapter; backend index.ts; Prisma schema and repositories.

## 23. The lesson is visible in the code.

The alignment comes from demonstrated behavior. Slide 3 defines the three concepts; we demonstrate them through linked records, controlled responsibilities and checks. Slides 4 to 7 explain ETL; our reporting refresh implements the same process.

Slide 11 is our chosen healthcare example. Slide 13 is a broader architecture analogy. Slides 15 and 18 include external systems, insurance and regulatory expectations, so we describe that wider alignment as partial. The other industry situations are alternatives, not additional modules we must implement.

Evidence: integration.pptx.pdf, slides 3-7, 11, 13, 15 and 18. Code mapping documented in the source review.

## 24. Be precise about the project’s scope.

We can confidently present the internal workflow, access controls, data checks, imports and reporting. We should also state the limits clearly.

We have not implemented continuous connections to independent EMR, LIS or insurance systems. Formal compliance and accreditation also need organizational procedures, hosting controls and operational evidence beyond application code. Being precise about scope makes the project explanation stronger.

Evidence: Codebase review and reference slides 8, 12, 15 and 18. No external connector or insurance workflow found.

## 25. Demonstrate the handoffs and the checks.

For the live demonstration, prepare fictional records and individual role accounts in advance. Show the normal journey, then show that controls affect behavior.

For example, an incomplete lab report cannot be approved, an uncertain import is held for checking, and billing does not receive clinical notes. Complete the report and show the doctor’s follow-up decision. Finally refresh reporting and explain why drafts are excluded. Keep credentials off the screen and out of the presentation.

Evidence: Actual workflow services and frontend role workspaces; demonstration checklist derived from the implemented system.

## 26. Connected records. Clear responsibilities.

If asked what we are making, say: CareRecord is a clinic data-management system that connects patient registration, consultations, laboratory records and billing. It uses role-based access, validation, approvals and audit history to keep information trustworthy, then prepares checked data for reporting.

The patient journey demonstrates the operational value. Integration, governance, data quality and ETL explain why that journey is an Enterprise Data Management project.

Evidence: Synthesis of the implemented CareRecord workflows and the supplied EDM lesson.
