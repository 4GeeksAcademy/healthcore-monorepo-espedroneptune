import type { Appointment, Claim, CMEReport, Clinician, Location } from "../types";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function calendarDay(value: string): number {
  return Math.floor(Date.parse(value) / DAY_IN_MS);
}

function roundTo(value: number, decimalPlaces: number): number {
  return Number(value.toFixed(decimalPlaces));
}

export function calculateDenialRate(claims: Claim[]): number {
  if (claims.length === 0) {
    throw new Error("Cannot calculate a denial rate for an empty claims array.");
  }

  const deniedCount = claims.filter((claim) => claim.status === "denied").length;
  return roundTo((deniedCount / claims.length) * 100, 2);
}

export function denialRateByPayer(claims: Claim[]): Record<string, number> {
  const groups = new Map<string, Claim[]>();
  for (const claim of claims) {
    const group = groups.get(claim.payerName);
    if (group) {
      group.push(claim);
    } else {
      groups.set(claim.payerName, [claim]);
    }
  }

  return Object.fromEntries(
    [...groups].map(([payerName, payerClaims]) => [payerName, calculateDenialRate(payerClaims)]),
  );
}

export function denialRateByLocation(claims: Claim[]): Record<string, number> {
  const groups = new Map<string, Claim[]>();
  for (const claim of claims) {
    const group = groups.get(claim.locationId);
    if (group) {
      group.push(claim);
    } else {
      groups.set(claim.locationId, [claim]);
    }
  }

  return Object.fromEntries(
    [...groups].map(([locationId, locationClaims]) => [locationId, calculateDenialRate(locationClaims)]),
  );
}

export function flagHighDenialPayers(claims: Claim[], threshold = 8): string[] {
  return Object.entries(denialRateByPayer(claims))
    .filter(([, rate]) => rate > threshold)
    .map(([payerName]) => payerName);
}

export function calculateNoShowCost(
  appointments: Appointment[],
  location: Location,
  weekEndingDate: string,
): number {
  const endDay = calendarDay(weekEndingDate);
  const startDay = endDay - 6;
  const total = appointments.reduce((sum, appointment) => {
    const appointmentDay = calendarDay(appointment.scheduledDate);
    if (
      !Number.isFinite(appointmentDay) ||
      appointment.locationId !== location.locationId ||
      appointment.status !== "no_show" ||
      appointmentDay < startDay ||
      appointmentDay > endDay
    ) {
      return sum;
    }

    const fee = location.averageConsultationFee[appointment.serviceType];
    return sum + (Number.isFinite(fee) ? fee : 0);
  }, 0);

  return roundTo(total, 2);
}

export function noShowRateByLocation(appointments: Appointment[]): Record<string, number> {
  const totals = new Map<string, { eligible: number; noShows: number }>();

  for (const appointment of appointments) {
    let locationTotals = totals.get(appointment.locationId);
    if (!locationTotals) {
      locationTotals = { eligible: 0, noShows: 0 };
      totals.set(appointment.locationId, locationTotals);
    }

    if (appointment.status === "completed" || appointment.status === "no_show") {
      locationTotals.eligible += 1;
      if (appointment.status === "no_show") {
        locationTotals.noShows += 1;
      }
    }
  }

  return Object.fromEntries(
    [...totals].map(([locationId, { eligible, noShows }]) => [
      locationId,
      eligible === 0 ? 0 : roundTo((noShows / eligible) * 100, 2),
    ]),
  );
}

export function flagHighNoShowLocations(appointments: Appointment[], threshold = 20): string[] {
  return Object.entries(noShowRateByLocation(appointments))
    .filter(([, rate]) => rate > threshold)
    .map(([locationId]) => locationId);
}

function cycleDates(startDate: string): { startDay: number; nextStartDay: number; endDay: number } {
  const start = new Date(`${startDate}T00:00:00.000Z`);
  const nextStart = new Date(
    Date.UTC(start.getUTCFullYear() + 1, start.getUTCMonth(), start.getUTCDate()),
  );
  const startDay = Math.floor(start.getTime() / DAY_IN_MS);
  const nextStartDay = Math.floor(nextStart.getTime() / DAY_IN_MS);
  return { startDay, nextStartDay, endDay: nextStartDay - 1 };
}

export function generateCMEReport(clinicians: Clinician[], asOfDate: string): CMEReport[] {
  const asOfDay = calendarDay(asOfDate);

  return clinicians.map((clinician) => {
    const { startDay, nextStartDay, endDay } = cycleDates(clinician.cmeYearStartDate);
    const hoursRequired = clinician.cmeHoursRequired;
    const hoursLogged = clinician.cmeHoursLogged;
    const percentComplete = hoursRequired === 0 ? 100 : roundTo((hoursLogged / hoursRequired) * 100, 1);
    const isComplete = hoursLogged >= hoursRequired;
    const cycleEnded = asOfDay > endDay;
    const cycleActive = asOfDay >= startDay && !cycleEnded;
    const elapsedShare = Math.max(
      0,
      Math.min(1, (asOfDay - startDay) / (nextStartDay - startDay)),
    );

    let complianceStatus: CMEReport["complianceStatus"] = "on_track";
    if (isComplete) {
      complianceStatus = "complete";
    } else if (cycleEnded) {
      complianceStatus = "overdue";
    } else if (cycleActive && elapsedShare * 100 - percentComplete > 15) {
      complianceStatus = "at_risk";
    }

    return {
      clinicianId: clinician.clinicianId,
      fullName: `${clinician.firstName} ${clinician.lastName}`,
      role: clinician.role,
      locationId: clinician.locationId,
      hoursRequired,
      hoursLogged,
      hoursRemaining: Math.max(0, hoursRequired - hoursLogged),
      percentComplete,
      daysRemainingInCycle: Math.max(0, endDay - asOfDay),
      complianceStatus,
      licenceExpiryDate: clinician.licenceExpiryDate,
      licenceDaysRemaining: calendarDay(clinician.licenceExpiryDate) - asOfDay,
    };
  });
}

export function getCliniciansAtRisk(clinicians: Clinician[], asOfDate: string): Clinician[] {
  const reports = generateCMEReport(clinicians, asOfDate);
  return clinicians.filter(
    (_, index) => reports[index].complianceStatus === "at_risk" || reports[index].complianceStatus === "overdue",
  );
}

export function getCliniciansWithExpiringLicences(
  clinicians: Clinician[],
  asOfDate: string,
  daysThreshold: number,
): Clinician[] {
  const asOfDay = calendarDay(asOfDate);
  return clinicians.filter((clinician) => {
    const daysRemaining = calendarDay(clinician.licenceExpiryDate) - asOfDay;
    return daysRemaining >= 0 && daysRemaining <= daysThreshold;
  });
}