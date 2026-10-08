import { getCurrentLocale, onLocaleChange, t } from "./main.js";

const form = document.querySelector("#patient-enquiry-form");

if (form) {
  const summary = document.querySelector("#form-error-summary");
  const concern = form.elements.health_concern;
  const count = document.querySelector("#concern-count");
  const warning = document.querySelector("#hours-warning");
  const successPanel = document.querySelector("#success-panel");
  const errorNodes = new Map([...form.querySelectorAll("[data-error-for]")].map((node) => [node.dataset.errorFor, node]));
  const controls = new Map([...form.elements].filter((item) => item.name).map((item) => [item.name, item]));
  const clinicDetails = {
    "HealthCore Austin Central": { timezone: "America/Chicago", weekdayClose: 20 },
    "HealthCore Austin North": { timezone: "America/Chicago", weekdayClose: 19 },
    "HealthCore San Antonio": { timezone: "America/Chicago", weekdayClose: 18 },
    "HealthCore Miami": { timezone: "America/New_York", weekdayClose: 20 },
    "HealthCore Orlando": { timezone: "America/New_York", weekdayClose: 18 },
    "HealthCore Atlanta": { timezone: "America/New_York", weekdayClose: 19 }
  };
  const conditionalGroups = {
    patient_id: { wrapper: document.querySelector("#patient-id-group"), input: controls.get("patient_id") },
    insurance_provider: { wrapper: document.querySelector("#insurance-provider-group"), input: controls.get("insurance_provider") },
    insurance_member_id: { wrapper: document.querySelector("#insurance-member-group"), input: controls.get("insurance_member_id") }
  };
  const visited = new Set();
  let submitted = false;

  function fieldControl(name) {
    const field = controls.get(name);
    return field?.type === "radio" ? form.querySelector(`[name="${name}"]`) : field;
  }

  function groupValue(name) {
    return form.querySelector(`[name="${name}"]:checked`)?.value ?? "";
  }

  function setError(name, message) {
    const node = errorNodes.get(name);
    const field = controls.get(name);
    if (node) node.textContent = message;
    const group = field?.type === "radio" ? form.querySelectorAll(`[name="${name}"]`) : [field];
    group.forEach((control) => {
      if (!control) return;
      control.setAttribute("aria-invalid", String(Boolean(message)));
    });
  }

  function isoDateInZone(timeZone) {
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
    return `${values.year}-${values.month}-${values.day}`;
  }

  function addIsoDays(isoDate, days) {
    const date = new Date(`${isoDate}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  }

  function ageOnDate(birthDate, today) {
    const [birthYear, birthMonth, birthDay] = birthDate.split("-").map(Number);
    const [todayYear, todayMonth, todayDay] = today.split("-").map(Number);
    return todayYear - birthYear - (todayMonth < birthMonth || (todayMonth === birthMonth && todayDay < birthDay) ? 1 : 0);
  }

  function earliestBusinessDate(today) {
    let date = today;
    do {
      date = addIsoDays(date, 1);
      const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
      if (weekday !== 0 && weekday !== 6) return date;
    } while (true);
  }

  function dateLimits() {
    const clinic = clinicDetails[controls.get("preferred_clinic").value];
    const timeZone = clinic?.timezone ?? "America/Chicago";
    const today = isoDateInZone(timeZone);
    return { today, earliest: earliestBusinessDate(today), latest: addIsoDays(today, 60) };
  }

  function updateDateAttributes() {
    const limits = dateLimits();
    controls.get("date_of_birth").max = limits.today;
    controls.get("preferred_date").min = limits.earliest;
    controls.get("preferred_date").max = limits.latest;
  }

  function validate(name) {
    const field = controls.get(name);
    const raw = field?.type === "radio" ? groupValue(name) : field?.value ?? "";
    const value = raw.trim();
    let message = "";

    switch (name) {
      case "first_name":
      case "last_name": {
        const key = name === "first_name" ? "error_first_name" : "error_last_name";
        if (value.length < 2 || value.length > 50 || !/^\p{L}+$/u.test(value)) message = t(key);
        break;
      }
      case "date_of_birth": {
        const today = isoDateInZone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
        if (!value || value > today || ageOnDate(value || today, today) > 120) message = t("error_date_of_birth");
        break;
      }
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = t("error_email");
        break;
      case "phone": {
        const digits = value.replace(/\D/g, "");
        if (!/^\+\d[\d\s().-]*$/.test(value) || digits.length < 7 || digits.length > 15) message = t("error_phone");
        break;
      }
      case "preferred_language":
        if (!value) message = t("error_preferred_language");
        break;
      case "preferred_clinic":
        if (!clinicDetails[value]) message = t("error_preferred_clinic");
        break;
      case "preferred_date": {
        const { earliest, latest } = dateLimits();
        if (!value || value < earliest || value > latest) message = t("error_preferred_date");
        break;
      }
      case "preferred_time":
        if (!value) message = t("error_preferred_time");
        break;
      case "service_type":
        if (!value) message = t("error_service_type");
        else if (value === "Paediatric Care") {
          const birthDate = controls.get("date_of_birth").value;
          const today = isoDateInZone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
          if (!birthDate || ageOnDate(birthDate, today) >= 18) message = t("error_paediatric");
        }
        break;
      case "new_patient":
        if (!value) message = t("error_new_patient");
        break;
      case "has_insurance":
        if (!value) message = t("error_has_insurance");
        break;
      case "insurance_provider":
        if (groupValue("has_insurance") === "yes" && !value) message = t("error_insurance_provider");
        else if (value.length > 100) message = t("error_provider_length");
        break;
      case "insurance_member_id":
        if (groupValue("has_insurance") === "yes" && !/^[a-z0-9]{6,20}$/i.test(value)) message = t("error_member_id");
        break;
      case "patient_id":
        if (groupValue("new_patient") === "no" && value && !/^HC-[A-Za-z0-9]{6}$/.test(value)) message = t("error_patient_id");
        break;
      case "health_concern":
        if (value.length < 20) message = t("error_concern_short", { count: Math.max(0, 20 - value.length) });
        else if (value.length > 500) message = t("error_concern_long");
        break;
      case "contact_consent":
        if (!field.checked) message = t("error_consent");
        break;
      default:
        break;
    }

    setError(name, message);
    return !message;
  }

  function updateConditionals({ clearHidden = true } = {}) {
    const patientReturning = groupValue("new_patient") === "no";
    const insured = groupValue("has_insurance") === "yes";
    for (const name of ["patient_id"]) {
      const { wrapper, input } = conditionalGroups[name];
      wrapper.hidden = !patientReturning;
      input.disabled = !patientReturning;
      if (!patientReturning && clearHidden) input.value = "";
    }
    for (const name of ["insurance_provider", "insurance_member_id"]) {
      const { wrapper, input } = conditionalGroups[name];
      wrapper.hidden = !insured;
      input.disabled = !insured;
      input.required = insured;
      if (!insured && clearHidden) input.value = "";
    }
    if (!patientReturning) setError("patient_id", "");
    if (!insured) {
      setError("insurance_provider", "");
      setError("insurance_member_id", "");
    }
  }

  function updateHoursWarning() {
    const clinic = clinicDetails[controls.get("preferred_clinic").value];
    const isEvening = controls.get("preferred_time").value === "evening";
    const hasWarning = isEvening && clinic && clinic.weekdayClose < 20;
    warning.textContent = hasWarning ? t("warning_hours") : "";
    warning.hidden = !hasWarning;
  }

  function updateCounter() {
    const remaining = 500 - concern.value.length;
    count.textContent = remaining >= 0
      ? t("counter_remaining", { count: remaining })
      : t("counter_over", { count: Math.abs(remaining) });
  }

  function allNames() {
    return ["first_name", "last_name", "date_of_birth", "email", "phone", "preferred_language", "preferred_clinic", "preferred_date", "preferred_time", "service_type", "new_patient", "has_insurance", "insurance_provider", "insurance_member_id", "patient_id", "health_concern", "contact_consent"];
  }

  function validateAll() {
    updateConditionals({ clearHidden: false });
    updateDateAttributes();
    const invalid = allNames().filter((name) => !controls.get(name).disabled && !validate(name));
    return invalid;
  }

  function showErrorsForVisited() {
    for (const name of visited) {
      if (!controls.get(name)?.disabled) validate(name);
    }
  }

  form.addEventListener("blur", (event) => {
    const name = event.target.name;
    if (!name) return;
    visited.add(name);
    validate(name);
  }, true);

  form.addEventListener("input", (event) => {
    const name = event.target.name;
    if (name === "health_concern") updateCounter();
    if (name === "date_of_birth" && (visited.has("service_type") || submitted)) validate("service_type");
    if (name && (visited.has(name) || submitted)) validate(name);
  });

  form.addEventListener("change", (event) => {
    const name = event.target.name;
    if (name === "new_patient" || name === "has_insurance") updateConditionals();
    if (name === "preferred_clinic") updateDateAttributes();
    if (name === "preferred_clinic" || name === "preferred_time") updateHoursWarning();
    if (name === "date_of_birth" && (visited.has("service_type") || submitted)) validate("service_type");
    if (name && (visited.has(name) || submitted)) validate(name);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitted = true;
    const invalid = validateAll();
    if (invalid.length) {
      summary.textContent = t("error_summary");
      summary.hidden = false;
      const firstInvalid = fieldControl(invalid[0]);
      firstInvalid?.focus();
      return;
    }
    summary.hidden = true;
    form.querySelectorAll("input, select, textarea").forEach((control) => {
      if (control.type === "radio" || control.type === "checkbox") control.checked = false;
      else control.value = "";
      control.removeAttribute("aria-invalid");
    });
    errorNodes.forEach((node) => { node.textContent = ""; });
    updateConditionals();
    updateCounter();
    form.hidden = true;
    document.querySelector(".form-aside").hidden = true;
    successPanel.hidden = false;
    successPanel.focus();
  });

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      visited.clear();
      submitted = false;
      summary.hidden = true;
      summary.textContent = "";
      successPanel.hidden = true;
      form.hidden = false;
      document.querySelector(".form-aside").hidden = false;
      errorNodes.forEach((node) => { node.textContent = ""; });
      form.querySelectorAll("[aria-invalid]").forEach((node) => node.removeAttribute("aria-invalid"));
      updateConditionals();
      updateCounter();
      updateDateAttributes();
      updateHoursWarning();
    });
  });

  onLocaleChange(() => {
    updateCounter();
    updateHoursWarning();
    if (submitted) {
      validateAll();
      if (!summary.hidden) summary.textContent = t("error_summary");
    } else {
      showErrorsForVisited();
    }
  });

  updateConditionals();
  updateDateAttributes();
  updateCounter();
  form.querySelector('[type="submit"]').disabled = false;
}