/**
 * Shared server-side validation for the site's forms (contact,
 * member application, sponsor inquiry). Kept dependency-free and framework
 * agnostic so it can be unit tested in isolation and reused by every
 * API route handler under `src/app/api`.
 */

export type FieldErrors = Record<string, string>;

export type ValidationResult<T> =
  | { valid: true; errors?: undefined; data: T; isBot: boolean }
  | { valid: false; errors: FieldErrors; data?: undefined; isBot?: undefined };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LIMITS = {
  name: 120,
  email: 254,
  phone: 32,
  subject: 60,
  message: 4000,
  company: 160,
} as const;

/** Trims and strips control/zero-width characters that have no business in form text. */
export function sanitizeText(input: unknown): string {
  if (typeof input !== "string") return "";
  // Strip control characters and zero-width/BOM characters.
  return input.replace(/[\u0000-\u001F\u007F\u200B-\u200D\uFEFF]/g, "").trim();
}

export function isValidEmail(value: string): boolean {
  return value.length > 0 && value.length <= LIMITS.email && EMAIL_RE.test(value);
}

function readField(data: Record<string, unknown>, key: string): string {
  return sanitizeText(data[key]);
}

/**
 * Honeypot check: a hidden field ("website") that real users never fill in.
 * Bots that auto-fill every input trip it. Callers should still report
 * success to avoid tipping the bot off, just skip actually delivering it.
 */
function isHoneypotTripped(data: Record<string, unknown>): boolean {
  return sanitizeText(data.website).length > 0;
}

function asRecord(body: unknown): Record<string, unknown> {
  return typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
}

export type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export const CONTACT_SUBJECTS = [
  "Allgemeine Anfrage",
  "Sponsoring",
  "Presse",
  "Mitmachen / Bewerbung",
  "Sonstiges",
] as const;

export function validateContactForm(body: unknown): ValidationResult<ContactFormData> {
  const data = asRecord(body);
  const errors: FieldErrors = {};

  const name = readField(data, "name");
  const email = readField(data, "email");
  const subject = readField(data, "subject") || CONTACT_SUBJECTS[0];
  const message = readField(data, "message");

  if (!name) errors.name = "Bitte gib deinen Namen an.";
  else if (name.length > LIMITS.name) errors.name = "Name ist zu lang.";

  if (!email) errors.email = "Bitte gib deine E-Mail-Adresse an.";
  else if (!isValidEmail(email)) errors.email = "Bitte gib eine gültige E-Mail-Adresse an.";

  if (!(CONTACT_SUBJECTS as readonly string[]).includes(subject)) {
    errors.subject = "Ungültiger Betreff.";
  }

  if (!message) errors.message = "Bitte gib eine Nachricht an.";
  else if (message.length > LIMITS.message) errors.message = "Nachricht ist zu lang.";

  if (!data.consent) errors.consent = "Bitte stimme der Datenverarbeitung zu.";

  if (Object.keys(errors).length > 0) return { valid: false, errors };
  return {
    valid: true,
    isBot: isHoneypotTripped(data),
    data: { name, email, subject, message },
  };
}

export type MemberApplicationFormData = {
  name: string;
  email: string;
  phone: string;
  department: string;
  message: string;
};

export const MEMBER_DEPARTMENTS = [
  "Project Management",
  "Workshop",
  "Chassis and Ergonomics",
  "Electrics",
  "Powertrain",
  "Aerodynamics",
  "Suspension and Steering Systems",
  "Driverless",
  "Vehicle Dynamics",
  "Testing and Data Acquisition",
  "Media and Marketing",
  "Business Plan",
  "Sponsoring",
  "Eventmanagement",
  "Finance",
  "Noch unentschlossen",
] as const;

export function validateMemberApplicationForm(
  body: unknown
): ValidationResult<MemberApplicationFormData> {
  const data = asRecord(body);
  const errors: FieldErrors = {};

  const name = readField(data, "name");
  const email = readField(data, "email");
  const phone = readField(data, "phone");
  const department = readField(data, "department") || MEMBER_DEPARTMENTS[0];
  const message = readField(data, "message");

  if (!name) errors.name = "Bitte gib deinen Namen an.";
  else if (name.length > LIMITS.name) errors.name = "Name ist zu lang.";

  if (!email) errors.email = "Bitte gib deine E-Mail-Adresse an.";
  else if (!isValidEmail(email)) errors.email = "Bitte gib eine gültige E-Mail-Adresse an.";

  if (phone && phone.length > LIMITS.phone) errors.phone = "Telefonnummer ist zu lang.";

  if (!(MEMBER_DEPARTMENTS as readonly string[]).includes(department)) {
    errors.department = "Ungültiger Fachbereich.";
  }

  if (message.length > LIMITS.message) errors.message = "Nachricht ist zu lang.";

  if (!data.consent) errors.consent = "Bitte stimme der Datenverarbeitung zu.";

  if (Object.keys(errors).length > 0) return { valid: false, errors };
  return {
    valid: true,
    isBot: isHoneypotTripped(data),
    data: { name, email, phone, department, message },
  };
}

export type SponsorFormData = {
  company: string;
  contact: string;
  email: string;
  phone: string;
  tier: string;
  message: string;
};

export const SPONSOR_TIERS = [
  "Platin",
  "Gold",
  "Silber",
  "Partner",
  "Noch unentschlossen",
] as const;

export function validateSponsorForm(body: unknown): ValidationResult<SponsorFormData> {
  const data = asRecord(body);
  const errors: FieldErrors = {};

  const company = readField(data, "company");
  const contact = readField(data, "contact");
  const email = readField(data, "email");
  const phone = readField(data, "phone");
  const tier = readField(data, "tier") || SPONSOR_TIERS[SPONSOR_TIERS.length - 1];
  const message = readField(data, "message");

  if (!company) errors.company = "Bitte gib den Firmennamen an.";
  else if (company.length > LIMITS.company) errors.company = "Firmenname ist zu lang.";

  if (!contact) errors.contact = "Bitte gib eine Ansprechperson an.";
  else if (contact.length > LIMITS.name) errors.contact = "Name ist zu lang.";

  if (!email) errors.email = "Bitte gib eine E-Mail-Adresse an.";
  else if (!isValidEmail(email)) errors.email = "Bitte gib eine gültige E-Mail-Adresse an.";

  if (phone && phone.length > LIMITS.phone) errors.phone = "Telefonnummer ist zu lang.";

  if (!(SPONSOR_TIERS as readonly string[]).includes(tier)) {
    errors.tier = "Ungültige Sponsoring-Stufe.";
  }

  if (message.length > LIMITS.message) errors.message = "Nachricht ist zu lang.";

  if (!data.consent) errors.consent = "Bitte stimme der Datenverarbeitung zu.";

  if (Object.keys(errors).length > 0) return { valid: false, errors };
  return {
    valid: true,
    isBot: isHoneypotTripped(data),
    data: { company, contact, email, phone, tier, message },
  };
}
