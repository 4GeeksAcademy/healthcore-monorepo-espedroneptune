import type { Appointment, AppointmentStatus, Claim } from "../types";

type ClaimFilter = Partial<Pick<Claim, "locationId" | "status" | "payerName" | "serviceType">>;

export function filterClaims(claims: Claim[], filters: ClaimFilter): Claim[] {
  return claims.filter((claim) =>
    Object.entries(filters).every(
      ([key, value]) => value === undefined || claim[key as keyof Claim] === value,
    ),
  );
}

export function filterAppointmentsByStatus(
  appointments: Appointment[],
  statuses: AppointmentStatus[],
): Appointment[] {
  return appointments.filter((appointment) => statuses.includes(appointment.status));
}

export function sortClaimsById(claims: Claim[], direction: "asc" | "desc"): Claim[] {
  const multiplier = direction === "asc" ? 1 : -1;
  return [...claims].sort((left, right) => multiplier * left.claimId.localeCompare(right.claimId));
}

export function sortAppointmentsByDate(
  appointments: Appointment[],
  direction: "asc" | "desc",
): Appointment[] {
  const multiplier = direction === "asc" ? 1 : -1;
  return [...appointments].sort(
    (left, right) => multiplier * left.scheduledDate.localeCompare(right.scheduledDate),
  );
}

export function groupClaimsBy(
  claims: Claim[],
  key: "locationId" | "payerName" | "status" | "serviceType",
): Record<string, Claim[]> {
  const groups = new Map<string, Claim[]>();

  for (const claim of claims) {
    const groupKey = claim[key];
    const group = groups.get(groupKey);
    if (group) {
      group.push(claim);
    } else {
      groups.set(groupKey, [claim]);
    }
  }

  return Object.fromEntries(groups);
}