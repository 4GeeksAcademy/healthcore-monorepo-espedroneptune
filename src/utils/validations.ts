import type { Claim, Clinician, ClinicianRole } from "../types";

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const PATIENT_ID_PATTERN = /^HC-[A-Za-z0-9]{6}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const CLINICIAN_ROLES: ClinicianRole[] = [
  "physician",
  "nurse_practitioner",
  "nurse",
  "medical_assistant",
];

function parseIsoDate(value: string): number | null {
  if (!ISO_DATE_PATTERN.test(value)) {
    return null;
  }

  const timestamp = Date.parse(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== value) {
    return null;
  }

  return Math.floor(timestamp / DAY_IN_MS);
}

function referenceDay(asOfDate: string): number {
  return parseIsoDate(asOfDate) ?? Math.floor(Date.now() / DAY_IN_MS);
}

export function validateClaim(
  claim: Claim,
  knownLocationIds: string[],
  asOfDate = new Date().toISOString().slice(0, 10),
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const submissionDay = parseIsoDate(claim.submissionDate);

  if (!Number.isFinite(claim.claimAmount) || claim.claimAmount <= 0) {
    errors.push("claimAmount must be greater than 0.");
  }
  if (submissionDay === null) {
    errors.push("submissionDate must be a valid ISO 8601 date.");
  } else if (submissionDay > referenceDay(asOfDate)) {
    errors.push("submissionDate must not be in the future.");
  }
  if (!knownLocationIds.includes(claim.locationId)) {
    errors.push("locationId must match a known clinic ID.");
  }
  if (claim.status === "denied" && !claim.denialReason) {
    errors.push("denialReason is required when status is denied.");
  }
  if (!PATIENT_ID_PATTERN.test(claim.patientId)) {
    errors.push("patientId must start with HC- followed by 6 alphanumeric characters.");
  }

  return { valid: errors.length === 0, errors };
}

export function validateClinician(
  clinician: Clinician,
  asOfDate = new Date().toISOString().slice(0, 10),
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const licenceExpiryDay = parseIsoDate(clinician.licenceExpiryDate);

  if (!Number.isFinite(clinician.cmeHoursRequired) || clinician.cmeHoursRequired < 0) {
    errors.push("cmeHoursRequired must be greater than or equal to 0.");
  }
  if (!Number.isFinite(clinician.cmeHoursLogged) || clinician.cmeHoursLogged < 0) {
    errors.push("cmeHoursLogged must be greater than or equal to 0.");
  }
  if (licenceExpiryDay === null) {
    errors.push("licenceExpiryDate must be a valid ISO 8601 date.");
  } else if (licenceExpiryDay < referenceDay(asOfDate)) {
    errors.push("licenceExpiryDate has expired.");
  }
  if (!CLINICIAN_ROLES.includes(clinician.role)) {
    errors.push("role must be one of the defined clinician roles.");
  }

  return { valid: errors.length === 0, errors };
}

export function isDenialRateAboveThreshold(rate: number, threshold = 8): boolean {
  return rate > threshold;
}

export function isNoShowRateAboveThreshold(rate: number, threshold = 20): boolean {
  return rate > threshold;
}