// ============================================================
// CK · Programme detail modal
// Click a programme card → anonymized contribution detail.
// All content here is craft/method level only — no employer,
// client, joint-venture, colleague, document or contract names.
// ============================================================
(function () {
  const DATA = {
    terminal: {
      era: "2025 — now · Aviation · Riyadh",
      title: "King Salman International Airport",
      intro: "Senior BIM Manager and author of the project's BIM Management Plan, owning the information-management function for the Delivery Partner on one of the world's largest aviation megaprojects — governing digital delivery end-to-end across procurement, design, construction and handover, to ISO 19650.",
      contributions: [
        "Authored and owns the project BIM Management Plan — the governing framework that translates the client's Exchange Information Requirements into BIM objectives, BIM uses, roles, workflows and stage gates across the whole programme.",
        "Procurement & tender: shaped and reviewed RFPs and tender documentation so BIM requirements were contractually enforceable, evaluated bidders' pre-appointment BEPs and capability/capacity assessments, answered BIM tender queries, reviewed key-personnel CVs, and gave the client a formal selection recommendation.",
        "Stood up and governs a multi-platform common data environment to ISO 19650 — EDMS for transmittals, a model-collaboration cloud and an issue/coordination platform — with the full WIP → Shared → Published → Archived lifecycle, onboarding and data-security controls.",
        "Owns model reviews and QA/QC against the EIR, BEP and Level of Information Need — geometry and model-health integrity, parameter and classification completeness, COBie/asset-data mapping, IFC-export and coordinate/geospatial compliance — issuing validation reports and tracking fixes to stage-gate readiness.",
        "Automated classification, attribute validation and a no-code, API-connected delivery-tracking tool wired into the CDE — auto-classifying objects, enforcing correct data and replacing siloed spreadsheets with near-real-time planned-vs-actual KPIs.",
        "Plans and chairs the BIM meeting calendar — kick-off/onboarding, BEP reviews, weekly progress and design-coordination, and monthly interface meetings — capturing minutes, decisions and action logs and driving clash/issue resolution; also leads BIM's role in interface management across packages and parties.",
        "Commercial & quantities: established model-based quantity verification supporting cost planning and estimating, so quantities and expenditure forecasts draw from validated model data.",
        "Drives asset information and digital handover — tracking asset data against the AIR, flagging gaps and shaping the handover/AIM package — alongside BIM risk management, competency/training and the project's software and technical standards.",
      ],
      achievements: [
        "Authored the single governing BIM plan adopted across the programme's appointed parties — one ISO 19650-compliant definition of how digital delivery runs from tender to handover.",
        "Automated model-data validation and quantity verification — targeting a 25–30% reduction in rework and cutting manual data capture by up to ~4 weeks per project, while giving the client auditable quality at every stage gate.",
        "Established metrics-driven reporting — progress reports and performance/KPI dashboards — for real-time visibility of delivery, coordination and compliance across the supply chain.",
      ],
    },
    linecity: {
      era: "2023 — 2025 · Giga-project · NEOM",
      title: "NEOM",
      intro: "BIM Manager in the technical-consultancy arm of a next-generation giga-project — setting the standards, running the model reviews and automating the workflow that kept dozens of reviewers aligned.",
      contributions: [
        "Led ISO 19650 compliance reviews of multi-discipline federated models — attribute checks, clash detection and visual walkthroughs — logging non-conformances within set turnaround times via structured comment-resolution sheets.",
        "Audited and coordinated models across the toolchain: Solibri for clash and revision comparison, Navisworks for federation, Civil 3D/Revit for discipline models, with a standardised audit checklist.",
        "Authored programme procedures spanning GIS & BIM, asset naming, classification, drafting and stage review/approval — embedding naming and classification checks into the delivery gate.",
        "Built Power Automate workflow automation (with forms and task boards) to coordinate package reviews and assign work across the team by discipline.",
        "Developed Power BI reporting for review throughput, average review time and consultant performance, plus a spreadsheet MIDP/deliverables checker validating submissions against the plan.",
      ],
      achievements: [
        "Built a review-distribution automation across 40+ reviewers and 7 disciplines — recurring six-figure annual savings.",
        "Stood up the department's first metrics-driven review pipeline, giving visibility of volume, turnaround and consultant performance.",
        "Raised submission quality across the design supply chain through automated MIDP, classification and naming checks.",
      ],
    },
    viaduct: {
      era: "2020 — 2023 · High-speed rail · UK",
      title: "HS2",
      intro: "BIM Manager / BIM Lead heading a ~10-person digital-engineering team on the UK's new high-speed railway, across multiple delivery sections.",
      contributions: [
        "Created and managed federated reality + design digital-twin models and pioneered their adoption across the wider programme.",
        "Owned the end-to-end flow of model information to ISO 19650, ensuring permanent- and temporary-works content was clash-checked and coordinated before sharing.",
        "Built dynamic model registers pulling live metadata (revision, suitability, status) straight from the CDE via Power Automate + FME, with Power BI dashboards surfacing weekly changes and lagging teams.",
        "Developed FME automation for model QA — attribute validation, component-catalogue handling and a design-review tool — enforcing data quality before sharing.",
        "Ran a source-vs-target verification routine comparing document-management models against the synced digital twin to prove data integrity and rebuild trust in the platform.",
        "Managed external-stakeholder information, promoted GIS tooling for spatial coordination, and delivered ISO 19650 briefings, software training and workshops.",
      ],
      achievements: [
        "Cut the weekly model-register update from roughly a full day to about 30 minutes through automation, while improving accuracy by sourcing directly from the CDE.",
        "Pioneered programme-wide digital-twin adoption and restored confidence by closing the source-to-twin gap (verification routinely near 100%).",
        "Consistently topped internal digital audits across delivery sections; information management held up to external ISO 19650 certification scrutiny without a non-conformance.",
      ],
    },
    reactor: {
      era: "2018 — 2020 · Nuclear energy · UK",
      title: "Hinkley Point C",
      intro: "Senior Digital Engineer on safety-critical reinforced-concrete structures for the UK's first nuclear new-build in a generation — providing the construction-stage modelling and buildability assurance behind design-to-construction handover.",
      contributions: [
        "Checked reinforcement models for classified, safety-critical structures against contractor input and data requirements before sign-off.",
        "Produced construction-stage information — pour models and drawings — in Tekla Structures and AutoCAD to drive on-site planning, sequencing and procurement.",
        "Ran clash detection and multi-discipline coordination in Navisworks Manage, resolving conflicts through the design process.",
        "Performed cross-contract and as-built analysis, checking as-built profiles against design information and feeding discrepancies back to site and client.",
        "Used reality-capture / point-cloud workflows to bring site conditions into the engineering models.",
        "Solved Revit→IFC user-defined-attribute export, unblocking an adjacent team to adopt a better-suited Revit toolchain.",
      ],
      achievements: [
        "Re-detailed and optimised a full quadrant of a major reinforced-concrete raft slab by ~50% to substantiate a standardisation concern — strengthening the team's position on construction-duration risk.",
        "Removed a cross-discipline workflow blocker by cracking the Revit-to-IFC attribute export.",
        "Rated expert-level across Revit, Navisworks and Civil 3D; contributed to successful structural sign-off milestones.",
      ],
    },
    water: {
      era: "2014 — 2018 · Water · Yorkshire, UK",
      title: "Yorkshire's water network",
      intro: "Hands-on BIM design engineer and Project Leader who both built the models and led delivery of water-infrastructure schemes — from survey to site — where his BIM career began.",
      contributions: [
        "Authored and presented an 'intelligent pipe-network design' workflow integrating PAS128 utility-survey data into a coordinated Civil 3D → Revit → Navisworks pipeline.",
        "Built parametric Revit families and Dynamo scripts that auto-generated existing pipe networks from survey data, applying survey-confidence envelopes by PAS128 category.",
        "Produced Civil 3D models from topographical survey — surfaces, pipe networks, alignments, long sections and earthworks takeoffs — feeding a standardised drawing-production workflow.",
        "Carried out 3D coordination and clash detection in Navisworks for design review and construction setting-out.",
        "Modelled process and structural assets in Revit (e.g. a clarifier building with design options) and built reusable parametric product families and calc templates.",
        "Applied lifting-design requirements (safe-working-load schedules, lifting points, maintenance access) and led his own delivery schemes on site.",
      ],
      achievements: [
        "Built a Dynamo automation turning survey data into a PAS128-compliant utility network in Revit — removing hours of manual modelling per scheme and embedding survey-confidence zones to cut excavation-strike risk.",
        "Created a library of parametric families and design/calc templates that cut repeat design time and drove deliverable consistency.",
        "Established and shared a standardised BIM-in-water methodology as an internal knowledge-share, with outputs suitable for visualisation.",
      ],
    },
  };

  const modal = document.getElementById("progModal");
  if (!modal) return;
  const dialog = modal.querySelector(".pmodal__dialog");
  const elEra = document.getElementById("progModalEra");
  const elTitle = document.getElementById("progModalTitle");
  const elIntro = document.getElementById("progModalIntro");
  const elContrib = document.getElementById("progModalContrib");
  const elAchieve = document.getElementById("progModalAchieve");
  const closeEls = modal.querySelectorAll("[data-close]");
  let lastTrigger = null;

  function fill(list, items) {
    list.innerHTML = "";
    items.forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      list.appendChild(li);
    });
  }

  function open(key, trigger) {
    const d = DATA[key];
    if (!d) return;
    lastTrigger = trigger || null;
    elEra.textContent = d.era;
    elTitle.textContent = d.title;
    elIntro.textContent = d.intro;
    fill(elContrib, d.contributions);
    fill(elAchieve, d.achievements);
    modal.classList.add("is-open");
    if (window.__lenis) window.__lenis.stop();        // lock page scroll behind the modal
    document.addEventListener("keydown", onKey);
    requestAnimationFrame(() => dialog.focus());
    if (window.umami) window.umami.track("programme-detail-view", { programme: d.title });
  }

  function close() {
    modal.classList.remove("is-open");
    if (window.__lenis) window.__lenis.start();        // resume page scroll
    document.removeEventListener("keydown", onKey);
    if (lastTrigger && typeof lastTrigger.focus === "function") lastTrigger.focus();
    lastTrigger = null;
  }

  function onKey(e) {
    if (e.key === "Escape") { close(); return; }
    if (e.key === "Tab") {
      // simple focus trap within the dialog
      const f = dialog.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  closeEls.forEach((el) => el.addEventListener("click", close));

  // Wire each programme card. The whole card is a convenience target;
  // the .pcard__more button is the canonical accessible control.
  document.querySelectorAll(".pcard[data-model]").forEach((card) => {
    const key = card.dataset.model;
    if (!DATA[key]) return;
    const moreBtn = card.querySelector(".pcard__more");
    if (moreBtn) moreBtn.addEventListener("click", (e) => { e.stopPropagation(); open(key, moreBtn); });
    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;            // let the photo-credit link work
      if (e.target.closest(".pcard__more")) return; // handled above
      open(key, moreBtn || card);
    });
  });
})();
