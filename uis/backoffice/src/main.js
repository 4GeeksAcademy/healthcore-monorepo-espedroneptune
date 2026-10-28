import "./styles.css";
import {
  filterClaims,
  filterAppointmentsByStatus,
  sortClaimsById,
  sortAppointmentsByDate,
  groupClaimsBy,
} from "../../../src/utils/collections.ts";
import {
  findClaimById,
  findClinicianById,
  binarySearchClaimById,
} from "../../../src/utils/search.ts";
import {
  calculateDenialRate,
  denialRateByPayer,
  denialRateByLocation,
  flagHighDenialPayers,
  calculateNoShowCost,
  noShowRateByLocation,
  flagHighNoShowLocations,
  generateCMEReport,
  getCliniciansAtRisk,
  getCliniciansWithExpiringLicences,
} from "../../../src/utils/transformations.ts";
import {
  validateClaim,
  validateClinician,
  isDenialRateAboveThreshold,
  isNoShowRateAboveThreshold,
} from "../../../src/utils/validations.ts";

const locations = [
  {
    locationId: "us-tx-001", name: "HealthCore Austin Central", city: "Austin", stateOrCountry: "TX", country: "US", phone: "(512) 340-8800",
    averageConsultationFee: { primary_care: 180, chronic_disease: 220, preventive: 150, specialist: 320, womens_health: 240, paediatric: 175, mental_health: 200 },
  },
  {
    locationId: "us-fl-001", name: "HealthCore Miami", city: "Miami", stateOrCountry: "FL", country: "US", phone: "(305) 510-7700",
    averageConsultationFee: { primary_care: 195, chronic_disease: 235, preventive: 160, specialist: 340, womens_health: 255, paediatric: 185, mental_health: 215 },
  },
  {
    locationId: "us-ga-001", name: "HealthCore Atlanta", city: "Atlanta", stateOrCountry: "GA", country: "US", phone: "(404) 330-9900",
    averageConsultationFee: { primary_care: 170, chronic_disease: 210, preventive: 145, specialist: 310, womens_health: 230, paediatric: 165, mental_health: 190 },
  },
];

const claims = [
  { claimId: "CLM-000001", patientId: "HC-A3F291", locationId: "us-tx-001", serviceType: "primary_care", payerName: "BlueCross", payerId: "BC001", submissionDate: "2025-03-10", claimAmount: 180, status: "approved", resubmitted: false },
  { claimId: "CLM-000002", patientId: "HC-B7K442", locationId: "us-fl-001", serviceType: "specialist", payerName: "Aetna", payerId: "AET002", submissionDate: "2025-03-11", claimAmount: 340, status: "denied", denialReason: "missing_authorisation", resubmitted: false },
  { claimId: "CLM-000003", patientId: "HC-C2M881", locationId: "us-ga-001", serviceType: "chronic_disease", payerName: "Medicare", payerId: "MED003", submissionDate: "2025-03-12", claimAmount: 210, status: "approved", resubmitted: false },
  { claimId: "CLM-000004", patientId: "HC-D9P553", locationId: "us-tx-001", serviceType: "preventive", payerName: "BlueCross", payerId: "BC001", submissionDate: "2025-03-13", claimAmount: 150, status: "denied", denialReason: "coding_error", resubmitted: true },
  { claimId: "CLM-000005", patientId: "HC-E4Q117", locationId: "us-fl-001", serviceType: "mental_health", payerName: "Cigna", payerId: "CIG004", submissionDate: "2025-03-14", claimAmount: 215, status: "pending", resubmitted: false },
];

const appointments = [
  { appointmentId: "APT-000001", patientId: "HC-A3F291", locationId: "us-tx-001", serviceType: "primary_care", scheduledDate: "2025-03-10", scheduledTime: "09:00", status: "completed", confirmedAt: "2025-03-09T14:00:00Z" },
  { appointmentId: "APT-000002", patientId: "HC-F6R228", locationId: "us-fl-001", serviceType: "specialist", scheduledDate: "2025-03-11", scheduledTime: "11:30", status: "no_show", noShowReason: "Patient did not call to cancel" },
  { appointmentId: "APT-000003", patientId: "HC-G1S774", locationId: "us-tx-001", serviceType: "chronic_disease", scheduledDate: "2025-03-12", scheduledTime: "14:00", status: "no_show", noShowReason: "Unreachable before appointment" },
  { appointmentId: "APT-000004", patientId: "HC-H8T390", locationId: "us-ga-001", serviceType: "preventive", scheduledDate: "2025-03-13", scheduledTime: "10:00", status: "completed", confirmedAt: "2025-03-12T09:30:00Z" },
  { appointmentId: "APT-000005", patientId: "HC-I5U661", locationId: "us-fl-001", serviceType: "mental_health", scheduledDate: "2025-03-14", scheduledTime: "16:00", status: "no_show", noShowReason: "Transportation issue reported" },
];

const clinicians = [
  { clinicianId: "CLN-000001", firstName: "Marcus", lastName: "Reid", role: "physician", locationId: "us-tx-001", licenceState: "TX", licenceExpiryDate: "2026-06-30", cmeHoursRequired: 40, cmeHoursLogged: 28, cmeYearStartDate: "2025-01-01" },
  { clinicianId: "CLN-000002", firstName: "Sandra", lastName: "Flores", role: "nurse_practitioner", locationId: "us-fl-001", licenceState: "FL", licenceExpiryDate: "2025-05-15", cmeHoursRequired: 30, cmeHoursLogged: 6, cmeYearStartDate: "2025-01-01" },
  { clinicianId: "CLN-000003", firstName: "David", lastName: "Okafor", role: "physician", locationId: "us-ga-001", licenceState: "GA", licenceExpiryDate: "2027-01-01", cmeHoursRequired: 40, cmeHoursLogged: 40, cmeYearStartDate: "2025-01-01" },
];

const viewCopy = {
  overview: ["Operations overview", "A working view of billing performance, missed visits, and clinician compliance."],
  claims: ["Claims", "Search submitted claims, review denials, and compare payer performance."],
  attendance: ["No-show impact", "Estimate missed-visit revenue by clinic and inspect appointment outcomes."],
  cme: ["CME compliance", "Track clinician progress through the current education cycle and licence window."],
};

const $ = (selector) => document.querySelector(selector);
const asOfDate = () => $("#as-of-date").value || "2025-03-15";
const weekEndingDate = () => $("#week-ending").value || "2025-03-16";
const locationName = (id) => locations.find((location) => location.locationId === id)?.name ?? id;
const shortLocation = (id) => locations.find((location) => location.locationId === id)?.city ?? id;
const formatRate = (rate) => `${Number(rate).toFixed(2)}%`;
const formatMoney = (amount) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(amount);
const formatDate = (date) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[character]);

function initializeLocationOptions() {
  const options = locations.map((location) => `<option value="${location.locationId}">${escapeHtml(location.name)}</option>`).join("");
  $("#claim-location").insertAdjacentHTML("beforeend", options);
  $("#appointment-location").insertAdjacentHTML("beforeend", options);
}

function setView(view) {
  document.querySelectorAll(".view-tab").forEach((tab) => {
    const active = tab.dataset.view === view;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.id = `tab-${tab.dataset.view}`;
  });
  document.querySelectorAll(".view-panel").forEach((panel) => {
    panel.hidden = panel.id !== `view-${view}`;
  });
  $("#page-title").textContent = viewCopy[view][0];
  $("#page-subtitle").textContent = viewCopy[view][1];
  $("#live-message").textContent = `${viewCopy[view][0]} view selected`;
}

function renderMetrics() {
  const denialRate = calculateDenialRate(claims);
  const noShowTotal = locations.reduce(
    (sum, location) => sum + calculateNoShowCost(appointments, location, weekEndingDate()),
    0,
  );
  const report = generateCMEReport(clinicians, asOfDate());
  const completed = report.filter((entry) => entry.complianceStatus === "complete").length;
  const eligibleVisits = appointments.filter((appointment) => ["completed", "no_show"].includes(appointment.status)).length;
  const noShows = filterAppointmentsByStatus(appointments, ["no_show"]).length;

  $("#metric-denial").textContent = formatRate(denialRate);
  $("#metric-denial-detail").textContent = `${claims.filter((claim) => claim.status === "denied").length} of ${claims.length} claims denied`;
  $("#metric-cost").textContent = formatMoney(noShowTotal);
  $("#metric-cost-detail").textContent = `${noShows} missed visits · ${eligibleVisits} completed or missed`;
  $("#metric-cme").textContent = `${completed} / ${clinicians.length}`;
  $("#metric-cme-detail").textContent = `${getCliniciansAtRisk(clinicians, asOfDate()).length} clinicians at risk or overdue`;
}

function renderBars(container, entries, isAlert) {
  if (!entries.length) {
    container.innerHTML = '<p class="search-note">No records in this view.</p>';
    return;
  }
  container.innerHTML = entries.map(([label, rate]) => {
    const width = Math.max(0, Math.min(100, rate));
    const alert = isAlert(rate);
    return `<div class="bar-row"><div class="bar-label"><span>${escapeHtml(label)}</span><strong class="${alert ? "text-alert" : ""}">${formatRate(rate)}</strong></div><div class="bar-track" aria-label="${formatRate(rate)}"><div class="bar-fill ${alert ? "is-alert" : ""}" style="width:${width}%"></div></div></div>`;
  }).join("");
}

function renderOverview() {
  const payerRates = denialRateByPayer(claims);
  const highPayers = flagHighDenialPayers(claims);
  const locationRates = noShowRateByLocation(appointments);
  const highNoShowLocations = flagHighNoShowLocations(appointments);
  const reports = generateCMEReport(clinicians, asOfDate());
  const atRisk = getCliniciansAtRisk(clinicians, asOfDate());
  const expiring = getCliniciansWithExpiringLicences(clinicians, asOfDate(), 90);

  renderBars(
    $("#overview-payer-bars"),
    Object.entries(payerRates),
    (rate) => isDenialRateAboveThreshold(rate),
  );
  renderBars(
    $("#overview-location-bars"),
    Object.entries(locationRates).map(([id, rate]) => [shortLocation(id), rate]),
    (rate) => isNoShowRateAboveThreshold(rate),
  );
  $("#overview-payer-flags").innerHTML = highPayers.length
    ? `<span class="text-alert">Above 8%:</span> ${highPayers.map(escapeHtml).join(", ")}`
    : '<span class="text-good">No payers exceed the 8% benchmark.</span>';
  $("#overview-location-flags").innerHTML = highNoShowLocations.length
    ? `<span class="text-alert">Above 20%:</span> ${highNoShowLocations.map((id) => escapeHtml(shortLocation(id))).join(", ")}`
    : '<span class="text-good">No clinic exceeds the 20% alert level.</span>';

  const attention = [
    ...highPayers.map((payer) => ({ title: `${payer} denial rate`, detail: "Payer exceeds the 8% benchmark", value: formatRate(payerRates[payer]) })),
    ...highNoShowLocations.map((id) => ({ title: `${shortLocation(id)} no-show rate`, detail: "Clinic exceeds the 20% alert level", value: formatRate(locationRates[id]) })),
    ...atRisk.map((clinician) => ({ title: `${clinician.firstName} ${clinician.lastName}`, detail: "CME cycle is at risk or overdue", value: clinician.clinicianId })),
    ...expiring.map((clinician) => ({ title: `${clinician.firstName} ${clinician.lastName}`, detail: "Licence expires within 90 days", value: formatDate(clinician.licenceExpiryDate) })),
  ];
  $("#attention-list").innerHTML = attention.length
    ? attention.map((item) => `<div class="attention-item"><span class="attention-pin" aria-hidden="true"></span><span><strong>${escapeHtml(item.title)}</strong><br /><small>${escapeHtml(item.detail)}</small></span><span class="attention-value">${escapeHtml(item.value)}</span></div>`).join("")
    : '<div class="attention-item"><span class="attention-pin is-clear" aria-hidden="true"></span><span><strong>No alerts for this report date</strong><br /><small>All thresholds are within range.</small></span></div>';

  const claimChecks = claims.map((claim) => validateClaim(claim, locations.map((location) => location.locationId), asOfDate()));
  const clinicianChecks = clinicians.map((clinician) => validateClinician(clinician, asOfDate()));
  const passedClaims = claimChecks.filter((result) => result.valid).length;
  const passedClinicians = clinicianChecks.filter((result) => result.valid).length;
  const errors = [...claimChecks, ...clinicianChecks].reduce((count, result) => count + result.errors.length, 0);
  $("#quality-summary").textContent = errors === 0 ? "All sample records pass the available validators." : `${errors} validation issue${errors === 1 ? "" : "s"} found.`;
  $("#quality-detail").innerHTML = `<span>${passedClaims} / ${claims.length} claims pass validation</span><span>${passedClinicians} / ${clinicians.length} clinicians pass validation</span><span>${reports.length} CME reports generated for ${formatDate(asOfDate())}</span>`;
}

function renderClaims() {
  const filters = {};
  if ($("#claim-location").value) filters.locationId = $("#claim-location").value;
  if ($("#claim-status").value) filters.status = $("#claim-status").value;
  const direction = $("#claim-sort").value;
  const query = $("#claim-search").value.trim().toLowerCase();
  const visibleClaims = sortClaimsById(filterClaims(claims, filters), direction).filter((claim) =>
    `${claim.claimId} ${claim.payerName} ${claim.locationId}`.toLowerCase().includes(query),
  );

  if (query) {
    const exactClaim = findClaimById(claims, $("#claim-search").value.trim());
    const sortedClaims = sortClaimsById(claims, "asc");
    const exactIndex = binarySearchClaimById(sortedClaims, $("#claim-search").value.trim());
    const found = exactClaim && exactIndex >= 0;
    $("#claim-search-note").textContent = found
      ? `Exact match found at sorted index ${exactIndex}.`
      : `${visibleClaims.length} matching claim${visibleClaims.length === 1 ? "" : "s"}.`;
  } else {
    $("#claim-search-note").textContent = "Search by claim ID, payer, or clinic ID.";
  }

  $("#claims-count").textContent = `${visibleClaims.length} / ${claims.length} CLAIMS`;
  $("#claims-body").innerHTML = visibleClaims.length
    ? visibleClaims.map((claim) => `<tr><td class="mono">${escapeHtml(claim.claimId)}</td><td>${escapeHtml(claim.payerName)}</td><td>${escapeHtml(shortLocation(claim.locationId))}</td><td>${escapeHtml(claim.serviceType.replaceAll("_", " "))}</td><td>${formatMoney(claim.claimAmount)}</td><td><span class="status-label status-${claim.status}">${escapeHtml(claim.status.replaceAll("_", " "))}</span></td><td>${escapeHtml(claim.denialReason?.replaceAll("_", " ") ?? "—")}</td></tr>`).join("")
    : '<tr><td colspan="7">No claims match these filters.</td></tr>';

  const groups = groupClaimsBy(visibleClaims, "payerName");
  $("#claim-groups").innerHTML = Object.entries(groups).length
    ? Object.entries(groups).map(([payer, payerClaims]) => `<span>${escapeHtml(payer)} · ${payerClaims.length}</span>`).join("")
    : "—";
}

function renderAttendance() {
  const selectedLocation = $("#appointment-location").value;
  const selectedStatus = $("#appointment-status").value;
  const location = locations.find((entry) => entry.locationId === selectedLocation);
  const ending = weekEndingDate();
  const totalCost = location
    ? calculateNoShowCost(appointments, location, ending)
    : locations.reduce((sum, entry) => sum + calculateNoShowCost(appointments, entry, ending), 0);
  const rateByLocation = noShowRateByLocation(appointments);
  const eligibleVisits = appointments.filter((appointment) =>
    (!selectedLocation || appointment.locationId === selectedLocation) && ["completed", "no_show"].includes(appointment.status),
  );
  const missedVisits = eligibleVisits.filter((appointment) => appointment.status === "no_show").length;
  const rate = selectedLocation
    ? rateByLocation[selectedLocation] ?? 0
    : eligibleVisits.length === 0 ? 0 : Number(((missedVisits / eligibleVisits.length) * 100).toFixed(2));
  const alerts = flagHighNoShowLocations(appointments);
  let visible = selectedStatus === "all"
    ? [...appointments]
    : filterAppointmentsByStatus(appointments, [selectedStatus]);
  if (selectedLocation) visible = visible.filter((appointment) => appointment.locationId === selectedLocation);
  visible = sortAppointmentsByDate(visible, "asc");

  $("#attendance-cost").textContent = formatMoney(totalCost);
  $("#attendance-cost-caption").textContent = `${location ? location.name : "All sample clinics"} · 7 calendar days through ${ending ? formatDate(ending) : "—"}`;
  $("#attendance-rate").textContent = formatRate(rate);
  $("#attendance-rate-caption").textContent = `${missedVisits} no-shows / ${eligibleVisits.length} completed or missed visits`;
  $("#attendance-alert").textContent = selectedLocation
    ? alerts.includes(selectedLocation) ? "Above threshold" : "Within threshold"
    : `${alerts.length} of ${locations.length} clinics`;
  $("#attendance-alert").className = selectedLocation && alerts.includes(selectedLocation) ? "text-alert" : "";

  $("#appointments-body").innerHTML = visible.length
    ? visible.map((appointment) => `<tr><td class="mono">${escapeHtml(appointment.appointmentId)}</td><td>${escapeHtml(shortLocation(appointment.locationId))}</td><td>${escapeHtml(formatDate(appointment.scheduledDate))}</td><td class="mono">${escapeHtml(appointment.scheduledTime)}</td><td>${escapeHtml(appointment.serviceType.replaceAll("_", " "))}</td><td><span class="status-label status-${appointment.status}">${escapeHtml(appointment.status.replaceAll("_", " "))}</span></td><td>${escapeHtml(appointment.noShowReason ?? "—")}</td></tr>`).join("")
    : '<tr><td colspan="7">No appointments match these filters.</td></tr>';
}

function renderCME() {
  const report = generateCMEReport(clinicians, asOfDate());
  const atRisk = getCliniciansAtRisk(clinicians, asOfDate());
  const expiring = getCliniciansWithExpiringLicences(clinicians, asOfDate(), 90);
  const query = $("#clinician-search").value.trim().toLowerCase();
  const exactClinician = query ? findClinicianById(clinicians, $("#clinician-search").value.trim()) : null;
  const visible = report.filter((entry) =>
    !query || entry.clinicianId.toLowerCase().includes(query) || entry.fullName.toLowerCase().includes(query),
  );

  $("#cme-summary").innerHTML = `<span><strong>${report.filter((entry) => entry.complianceStatus === "complete").length}</strong> complete</span><span><strong>${atRisk.length}</strong> at risk or overdue</span><span><strong>${expiring.length}</strong> licences expiring within 90 days</span>`;
  $("#clinician-search-note").textContent = query
    ? exactClinician ? `Exact match: ${exactClinician.firstName} ${exactClinician.lastName}.` : `${visible.length} matching clinician${visible.length === 1 ? "" : "s"}.`
    : "Search by clinician ID or name.";
  $("#cme-body").innerHTML = visible.length
    ? visible.map((entry) => {
      const progress = Math.max(0, Math.min(100, entry.percentComplete));
      return `<tr><td><strong>${escapeHtml(entry.fullName)}</strong><br /><span class="mono">${escapeHtml(entry.clinicianId)}</span></td><td>${escapeHtml(entry.role.replaceAll("_", " "))}<br /><span class="muted-cell">${escapeHtml(shortLocation(entry.locationId))}</span></td><td class="mono">${entry.hoursLogged} / ${entry.hoursRequired} h</td><td><div class="progress-cell"><span>${entry.percentComplete.toFixed(1)}%</span><span class="mono">${entry.hoursRemaining} h left</span><div class="progress-track"><span class="${entry.complianceStatus === "at_risk" || entry.complianceStatus === "overdue" ? "is-low" : ""}" style="width:${progress}%"></span></div></div></td><td class="mono">${entry.daysRemainingInCycle}</td><td>${escapeHtml(formatDate(entry.licenceExpiryDate))}</td><td class="mono">${entry.licenceDaysRemaining}</td><td><span class="status-label status-${entry.complianceStatus}">${escapeHtml(entry.complianceStatus.replaceAll("_", " "))}</span></td></tr>`;
    }).join("")
    : '<tr><td colspan="8">No clinicians match this search.</td></tr>';
}

function renderAll() {
  renderMetrics();
  renderOverview();
  renderClaims();
  renderAttendance();
  renderCME();
  const date = asOfDate();
  $("#heading-kicker").innerHTML = `MONDAY OPERATIONS REPORT <span>—</span> ${date ? escapeHtml(formatDate(date).toUpperCase()) : "SELECT A REPORT DATE"}`;
}

initializeLocationOptions();
setView("overview");
document.querySelectorAll(".view-tab").forEach((tab) => tab.addEventListener("click", () => setView(tab.dataset.view)));
[
  "#as-of-date", "#week-ending", "#claim-location", "#claim-status", "#claim-sort",
  "#claim-search", "#appointment-location", "#appointment-status", "#clinician-search",
].forEach((selector) => $(selector).addEventListener("input", renderAll));
$("#claim-location").addEventListener("change", renderAll);
$("#claim-status").addEventListener("change", renderAll);
$("#claim-sort").addEventListener("change", renderAll);
$("#appointment-location").addEventListener("change", renderAll);
$("#appointment-status").addEventListener("change", renderAll);
renderAll();