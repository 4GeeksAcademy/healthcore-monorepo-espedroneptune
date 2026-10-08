import "../css/input.css";

const translations = {
  en: {
    skip_to_content: "Skip to content", menu_open: "Open menu", menu_close: "Close menu", brand_name: "HealthCore", brand_home: "HealthCore home", nav_label: "Primary navigation", language_group: "Choose language", social_label: "Social media", application_form_label: "Patient enquiry form", additional_info_label: "Additional information", hero_image_alt: "Clinician speaking with a patient during a consultation",
    landing_description: "Accessible outpatient healthcare across HealthCore clinics in the US and UK. Same-day appointments, extended hours, and bilingual care.", application_description: "Send a patient enquiry to HealthCore. Our front desk team will follow up to confirm your appointment details.",
    nav_home: "Home", nav_services: "Services", nav_locations: "Locations", nav_contact: "Contact",
    header_cta: "Request an appointment", hero_eyebrow: "Care, on your terms", hero_title: "Healthcare that fits your life",
    hero_subtitle: "12 outpatient clinics across the US and UK offering same-day appointments, extended hours, and bilingual care — so you can get the attention you need, when you need it.",
    hero_cta: "Request an appointment", hero_note: "A member of our front desk team will follow up to confirm details.", hero_image_caption: "Care that listens first",
    services_eyebrow: "Care for every stage", services_title: "One network. Thoughtful care.",
    service_primary_title: "Primary Care & Chronic Disease", service_primary_one: "Same-day appointments with primary care physicians", service_primary_two: "Ongoing management of diabetes, hypertension, and asthma",
    service_specialist_title: "Specialist Consultations", service_specialist_one: "Cardiology, endocrinology, pulmonology, and women's health", service_specialist_two: "Referrals coordinated within the HealthCore network",
    service_preventive_title: "Preventive Health & Wellbeing", service_preventive_one: "Screenings, vaccinations, and annual check-ups", service_preventive_two: "Mental health counselling and psychiatry referrals",
    reasons_eyebrow: "Built around your day", reasons_title: "Good care should be easier to reach.", reasons_body: "From a same-day visit to ongoing support, our network is designed to make care fit real life.",
    reason_same_title: "Same-day appointments", reason_same_body: "Available at most locations.", reason_hours_title: "Extended hours", reason_hours_body: "Weekdays until 7pm or 8pm, with Saturdays available.",
    reason_bilingual_title: "Bilingual staff", reason_bilingual_body: "English and Spanish support at US locations.", reason_network_title: "A connected network", reason_network_body: "12 clinics across Texas, Florida, Georgia, and the United Kingdom.",
    locations_eyebrow: "Six US locations", locations_title: "Care close to home.", locations_intro: "Find a HealthCore clinic in Texas, Florida, or Georgia. Call directly for urgent assistance.",
    hours_austin_central: "Mon–Fri 7am–8pm · Sat 9am–3pm", hours_austin_north: "Mon–Fri 8am–7pm", hours_san_antonio: "Mon–Fri 8am–6pm · Sat 9am–1pm", hours_miami: "Mon–Fri 7am–8pm · Sat 9am–4pm", hours_orlando: "Mon–Fri 8am–6pm", hours_atlanta: "Mon–Fri 8am–7pm",
    contact_eyebrow: "We're here to help", contact_title: "Questions? Talk with us.", contact_general: "General enquiries", contact_austin: "Austin HQ", contact_miami: "Miami", contact_uk: "UK (London)", contact_cta: "Request an appointment", copyright: "© 2025 HealthCore. All rights reserved.",
    form_back_home: "Back to home", form_eyebrow: "Patient enquiry", form_title: "Request an appointment", form_intro: "Tell us a little about yourself and the care you need. A member of our front desk team will contact you to confirm your appointment details.", required_note: "Required fields",
    group_personal: "About you", label_first_name: "First name", label_last_name: "Last name", hint_name: "Use letters only, including accented letters.", label_dob: "Date of birth", label_email: "Email address", label_phone: "Phone number", hint_phone: "Include + and your country code, for example +1 305 555 0191.", label_language: "Preferred language", option_select_language: "Select a language", option_english: "English", option_spanish: "Spanish",
    group_preferences: "Your care preferences", label_clinic: "Preferred clinic", option_select_clinic: "Select a clinic", label_date: "Preferred date", hint_date: "Choose a date at least one business day from today, within the next 60 days.", label_time: "Preferred time of day", option_select_time: "Select a time of day", time_morning: "Morning (7am–12pm)", time_afternoon: "Afternoon (12pm–5pm)", time_evening: "Evening (5pm–8pm)", label_service: "Service needed", option_select_service: "Select a type of care",
    service_opt_primary: "Primary Care", service_opt_chronic: "Chronic Disease Management", service_opt_specialist: "Specialist Consultation", service_opt_preventive: "Preventive Health", service_opt_womens: "Women's Health", service_opt_paediatric: "Paediatric Care", service_opt_mental: "Mental Health",
    group_visit: "Visit details", label_new_patient: "Is this your first visit to HealthCore?", label_insurance: "Do you have health insurance?", option_yes: "Yes", option_no: "No", label_patient_id: "Patient ID (optional)", hint_patient_id: "Format: HC- followed by 6 letters or numbers.", label_insurance_provider: "Insurance provider", label_member_id: "Member ID", hint_member_id: "Use 6–20 letters or numbers.",
    group_concern: "A little more about your care", label_concern: "Brief description of your health concern", hint_concern: "Please do not include information you do not want shared with the front desk.", counter_remaining: "{count} characters remaining", counter_over: "{count} characters over the limit",
    group_contact: "Contact permission", label_consent: "I consent to HealthCore contacting me", submit_button: "Submit enquiry", clear_button: "Clear form", privacy_note: "This demo form does not send or store your information.",
    aside_urgent_eyebrow: "Need urgent assistance?", aside_urgent_title: "Call your clinic directly.", aside_urgent_body: "For urgent assistance, please call your preferred clinic using the numbers listed on our website.", aside_locations_link: "View clinic locations ↗",
    partnership_note: "Are you a healthcare provider or organisation looking to partner with HealthCore? Contact our operations team at",
    success_title: "Thank you for reaching out to HealthCore.", success_received: "We have received your enquiry. A member of our front desk team will contact you within 1 business day to confirm your appointment details and answer any questions.", success_urgent: "If you need urgent assistance, please call your preferred clinic directly using the numbers listed on our website.", success_close: "We look forward to caring for you.", success_home: "Return to HealthCore",
    error_first_name: "First name must contain only letters and be at least 2 characters", error_last_name: "Last name must contain only letters and be at least 2 characters",
    error_date_of_birth: "Enter a valid date of birth. Patient must be between 0 and 120 years old", error_email: "Enter a valid email address (example: name@provider.com)", error_phone: "Phone must include a country code (example: +1 305 555 0191)", error_preferred_language: "Select your preferred language", error_preferred_clinic: "Select the clinic you would like to visit", error_preferred_date: "Select a date at least 1 business day from today and no more than 60 days ahead", error_preferred_time: "Select your preferred time of day", error_service_type: "Select the type of care you are looking for", error_paediatric: "Paediatric Care is available for patients under 18. Please check the date of birth or select a different service.", error_new_patient: "Please indicate whether this is your first visit to HealthCore", error_has_insurance: "Please indicate whether you have health insurance", error_insurance_provider: "Please enter your insurance provider name", error_provider_length: "Insurance provider name must be 100 characters or fewer", error_member_id: "Member ID must be between 6 and 20 alphanumeric characters", error_patient_id: "Patient ID must start with HC- followed by 6 letters or numbers", error_concern_short: "Please describe your health concern in at least 20 characters ({count} characters remaining)", error_concern_long: "Please limit your health concern to 500 characters", error_consent: "You must consent to being contacted before submitting this form", error_summary: "Please review the highlighted fields and try again.", warning_hours: "This clinic closes before 8pm. An evening appointment may not be available; our team will confirm by phone."
  },
  es: {
    skip_to_content: "Saltar al contenido", menu_open: "Abrir menú", menu_close: "Cerrar menú", brand_name: "HealthCore", brand_home: "Inicio de HealthCore", nav_label: "Navegación principal", language_group: "Elegir idioma", social_label: "Redes sociales", application_form_label: "Formulario de consulta para pacientes", additional_info_label: "Información adicional", hero_image_alt: "Profesional de salud conversando con un paciente durante una consulta",
    landing_description: "Atención médica ambulatoria accesible en las clínicas HealthCore de EE. UU. y el Reino Unido. Citas el mismo día, horarios extendidos y atención bilingüe.", application_description: "Envía una consulta de paciente a HealthCore. Nuestro equipo de recepción se comunicará contigo para confirmar los detalles de tu cita.",
    nav_home: "Inicio", nav_services: "Servicios", nav_locations: "Ubicaciones", nav_contact: "Contacto",
    header_cta: "Solicitar una cita", hero_eyebrow: "Atención a tu manera", hero_title: "Atención médica que se adapta a tu vida",
    hero_subtitle: "12 clínicas ambulatorias en EE. UU. y el Reino Unido ofrecen citas el mismo día, horarios extendidos y atención bilingüe para que recibas la atención que necesitas cuando la necesitas.",
    hero_cta: "Solicitar una cita", hero_note: "Un miembro de nuestro equipo de recepción se comunicará contigo para confirmar los detalles.", hero_image_caption: "Atención que primero escucha",
    services_eyebrow: "Atención en cada etapa", services_title: "Una red. Atención cercana.",
    service_primary_title: "Atención primaria y enfermedades crónicas", service_primary_one: "Citas el mismo día con médicos de atención primaria", service_primary_two: "Manejo continuo de diabetes, hipertensión y asma",
    service_specialist_title: "Consultas con especialistas", service_specialist_one: "Cardiología, endocrinología, neumología y salud de la mujer", service_specialist_two: "Referencias coordinadas dentro de la red HealthCore",
    service_preventive_title: "Salud preventiva y bienestar", service_preventive_one: "Exámenes de detección, vacunas y chequeos anuales", service_preventive_two: "Asesoramiento de salud mental y referencias a psiquiatría",
    reasons_eyebrow: "Pensado para tu día", reasons_title: "Recibir buena atención debería ser más fácil.", reasons_body: "Desde una consulta el mismo día hasta el apoyo continuo, nuestra red está diseñada para adaptarse a la vida real.",
    reason_same_title: "Citas el mismo día", reason_same_body: "Disponibles en la mayoría de las ubicaciones.", reason_hours_title: "Horarios extendidos", reason_hours_body: "Entre semana hasta las 7 u 8 p. m.; también abrimos los sábados.",
    reason_bilingual_title: "Personal bilingüe", reason_bilingual_body: "Atención en inglés y español en las ubicaciones de EE. UU.", reason_network_title: "Una red conectada", reason_network_body: "12 clínicas en Texas, Florida, Georgia y el Reino Unido.",
    locations_eyebrow: "Seis ubicaciones en EE. UU.", locations_title: "Atención cerca de ti.", locations_intro: "Encuentra una clínica HealthCore en Texas, Florida o Georgia. Para recibir ayuda urgente, llama directamente.",
    hours_austin_central: "Lun–Vie 7 a. m.–8 p. m. · Sáb 9 a. m.–3 p. m.", hours_austin_north: "Lun–Vie 8 a. m.–7 p. m.", hours_san_antonio: "Lun–Vie 8 a. m.–6 p. m. · Sáb 9 a. m.–1 p. m.", hours_miami: "Lun–Vie 7 a. m.–8 p. m. · Sáb 9 a. m.–4 p. m.", hours_orlando: "Lun–Vie 8 a. m.–6 p. m.", hours_atlanta: "Lun–Vie 8 a. m.–7 p. m.",
    contact_eyebrow: "Estamos para ayudarte", contact_title: "¿Tienes preguntas? Hablemos.", contact_general: "Consultas generales", contact_austin: "Oficina central de Austin", contact_miami: "Miami", contact_uk: "Reino Unido (Londres)", contact_cta: "Solicitar una cita", copyright: "© 2025 HealthCore. Todos los derechos reservados.",
    form_back_home: "Volver al inicio", form_eyebrow: "Consulta de paciente", form_title: "Solicita una cita", form_intro: "Cuéntanos un poco sobre ti y la atención que necesitas. Un miembro de nuestro equipo de recepción se comunicará contigo para confirmar los detalles de tu cita.", required_note: "Campos obligatorios",
    group_personal: "Sobre ti", label_first_name: "Nombre", label_last_name: "Apellido", hint_name: "Usa solo letras, incluidas las letras acentuadas.", label_dob: "Fecha de nacimiento", label_email: "Correo electrónico", label_phone: "Número de teléfono", hint_phone: "Incluye + y el código de tu país, por ejemplo, +1 305 555 0191.", label_language: "Idioma preferido", option_select_language: "Selecciona un idioma", option_english: "Inglés", option_spanish: "Español",
    group_preferences: "Tus preferencias de atención", label_clinic: "Clínica preferida", option_select_clinic: "Selecciona una clínica", label_date: "Fecha preferida", hint_date: "Elige una fecha al menos un día hábil desde hoy y dentro de los próximos 60 días.", label_time: "Horario preferido", option_select_time: "Selecciona un horario", time_morning: "Mañana (7 a. m.–12 p. m.)", time_afternoon: "Tarde (12–5 p. m.)", time_evening: "Noche (5–8 p. m.)", label_service: "Atención que necesitas", option_select_service: "Selecciona un tipo de atención",
    service_opt_primary: "Atención primaria", service_opt_chronic: "Manejo de enfermedades crónicas", service_opt_specialist: "Consulta con especialista", service_opt_preventive: "Salud preventiva", service_opt_womens: "Salud de la mujer", service_opt_paediatric: "Atención pediátrica", service_opt_mental: "Salud mental",
    group_visit: "Detalles de la visita", label_new_patient: "¿Es tu primera visita a HealthCore?", label_insurance: "¿Tienes seguro médico?", option_yes: "Sí", option_no: "No", label_patient_id: "ID de paciente (opcional)", hint_patient_id: "Formato: HC- seguido de 6 letras o números.", label_insurance_provider: "Aseguradora", label_member_id: "Número de afiliado", hint_member_id: "Usa entre 6 y 20 letras o números.",
    group_concern: "Cuéntanos un poco más", label_concern: "Breve descripción de tu problema de salud", hint_concern: "No incluyas información que no quieras compartir con el equipo de recepción.", counter_remaining: "Quedan {count} caracteres", counter_over: "Excedes el límite por {count} caracteres",
    group_contact: "Permiso de contacto", label_consent: "Doy permiso a HealthCore para que se comunique conmigo", submit_button: "Enviar consulta", clear_button: "Borrar formulario", privacy_note: "Este formulario de demostración no envía ni guarda tu información.",
    aside_urgent_eyebrow: "¿Necesitas ayuda urgente?", aside_urgent_title: "Llama directamente a tu clínica.", aside_urgent_body: "Si necesitas ayuda urgente, llama a tu clínica preferida usando los números publicados en nuestro sitio web.", aside_locations_link: "Ver ubicaciones de las clínicas ↗",
    partnership_note: "¿Eres un profesional de la salud o una organización que desea asociarse con HealthCore? Comunícate con nuestro equipo de operaciones en",
    success_title: "Gracias por comunicarte con HealthCore.", success_received: "Recibimos tu consulta. Un miembro de nuestro equipo de recepción se comunicará contigo dentro de 1 día hábil para confirmar los detalles de tu cita y responder tus preguntas.", success_urgent: "Si necesitas ayuda urgente, llama directamente a tu clínica preferida usando los números publicados en nuestro sitio web.", success_close: "Esperamos poder atenderte.", success_home: "Volver a HealthCore",
    error_first_name: "El nombre solo debe contener letras y tener al menos 2 caracteres", error_last_name: "El apellido solo debe contener letras y tener al menos 2 caracteres",
    error_date_of_birth: "Ingresa una fecha de nacimiento válida. El paciente debe tener entre 0 y 120 años", error_email: "Ingresa un correo electrónico válido (ejemplo: nombre@proveedor.com)", error_phone: "El teléfono debe incluir un código de país (ejemplo: +1 305 555 0191)", error_preferred_language: "Selecciona tu idioma preferido", error_preferred_clinic: "Selecciona la clínica que deseas visitar", error_preferred_date: "Selecciona una fecha que sea al menos 1 día hábil desde hoy y no más de 60 días después", error_preferred_time: "Selecciona tu horario preferido", error_service_type: "Selecciona el tipo de atención que necesitas", error_paediatric: "La atención pediátrica está disponible para pacientes menores de 18 años. Revisa la fecha de nacimiento o selecciona otro servicio.", error_new_patient: "Indica si esta es tu primera visita a HealthCore", error_has_insurance: "Indica si tienes seguro médico", error_insurance_provider: "Ingresa el nombre de tu aseguradora", error_provider_length: "El nombre de la aseguradora debe tener 100 caracteres o menos", error_member_id: "El número de afiliado debe tener entre 6 y 20 caracteres alfanuméricos", error_patient_id: "El ID de paciente debe comenzar con HC- seguido de 6 letras o números", error_concern_short: "Describe tu problema de salud en al menos 20 caracteres (quedan {count} caracteres)", error_concern_long: "Limita la descripción de tu problema de salud a 500 caracteres", error_consent: "Debes dar permiso para que nos comuniquemos contigo antes de enviar este formulario", error_summary: "Revisa los campos marcados e inténtalo de nuevo.", warning_hours: "Esta clínica cierra antes de las 8 p. m. Es posible que no haya citas por la noche; nuestro equipo lo confirmará por teléfono."
  }
};

let currentLocale = localStorage.getItem("healthcore-language") === "es" ? "es" : "en";
const localeListeners = new Set();

export function t(key, values = {}) {
  let message = translations[currentLocale][key] ?? translations.en[key] ?? key;
  for (const [name, value] of Object.entries(values)) message = message.replaceAll(`{${name}}`, String(value));
  return message;
}

export function getCurrentLocale() {
  return currentLocale;
}

export function onLocaleChange(listener) {
  localeListeners.add(listener);
  return () => localeListeners.delete(listener);
}

function applyLocale(locale) {
  currentLocale = locale === "es" ? "es" : "en";
  document.documentElement.lang = currentLocale;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder));
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.i18nAria));
  });
  document.querySelectorAll("[data-i18n-alt]").forEach((node) => {
    node.setAttribute("alt", t(node.dataset.i18nAlt));
  });
  document.querySelectorAll("[data-i18n-meta]").forEach((node) => {
    node.setAttribute("content", t(node.dataset.i18nMeta));
  });
  document.querySelectorAll("[data-locale-target]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.localeTarget === currentLocale));
  });
  const menuToggle = document.querySelector(".menu-toggle");
  if (menuToggle) menuToggle.setAttribute("aria-label", t(menuToggle.getAttribute("aria-expanded") === "true" ? "menu_close" : "menu_open"));
  document.title = location.pathname.endsWith("application.html")
    ? `${t("form_title")} | HealthCore`
    : `${t("brand_name")} | ${t("hero_title")}`;
  localStorage.setItem("healthcore-language", currentLocale);
  localeListeners.forEach((listener) => listener(currentLocale));
  window.dispatchEvent(new CustomEvent("healthcore:localechange", { detail: { locale: currentLocale } }));
}

document.querySelectorAll("[data-locale-target]").forEach((button) => {
  button.addEventListener("click", () => applyLocale(button.dataset.localeTarget));
});

applyLocale(currentLocale);

const menuToggle = document.querySelector(".menu-toggle");
const primaryNavigation = document.querySelector("#primary-navigation");
if (menuToggle && primaryNavigation) {
  function setMenuOpen(open) {
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", t(open ? "menu_close" : "menu_open"));
    primaryNavigation.classList.toggle("is-open", open);
  }

  menuToggle.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });
  primaryNavigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
  document.addEventListener("pointerdown", (event) => {
    if (menuToggle.getAttribute("aria-expanded") === "true" && !event.target.closest(".site-header")) setMenuOpen(false);
  });
  window.matchMedia("(min-width: 960px)").addEventListener("change", (event) => {
    if (event.matches) setMenuOpen(false);
  });
}

const sectionLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
if (sectionLinks.length && "IntersectionObserver" in window) {
  const sections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top)[0];
    if (!visible) return;
    sectionLinks.forEach((link) => {
      if (link.hash === `#${visible.target.id}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-120px 0px -65% 0px", threshold: 0 });
  sections.forEach((section) => observer.observe(section));
}