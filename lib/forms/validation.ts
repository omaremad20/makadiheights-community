import type { FormDefinition, FormField } from "./definitions";

export type FormValues = Record<string, string>;
export type FormErrors = Record<string, string>;

/** Characters the PDF's standard font (WinAnsi) can print. English/Latin script only. */
const PRINTABLE = /^[\x20-\x7E -ÿ‘’“”–—]*$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s()-]{6,20}$/;

export function allFields(def: FormDefinition): FormField[] {
  return def.sections.flatMap((s) => s.fields);
}

export function validateField(field: FormField, values: FormValues): string | null {
  const value = (values[field.name] ?? "").trim();
  if (!value) return field.required ? `${field.label} is required.` : null;
  if (!PRINTABLE.test(value)) return "Please use English (Latin) characters only.";
  if (field.maxLength && value.length > field.maxLength) return `Please keep this under ${field.maxLength} characters.`;
  if (field.type === "email" && !EMAIL.test(value)) return "Please enter a valid email address.";
  if (field.type === "tel" && !PHONE.test(value)) return "Please enter a valid phone number (digits, spaces, + or -).";
  if (field.type === "date") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Please enter a valid date.";
    if (field.notBefore) {
      const other = (values[field.notBefore] ?? "").trim();
      if (other && value < other) return "This date must be on or after the start date.";
    }
  }
  return null;
}

export function validateForm(def: FormDefinition, values: FormValues): FormErrors {
  const errors: FormErrors = {};
  for (const field of allFields(def)) {
    const message = validateField(field, values);
    if (message) errors[field.name] = message;
  }
  return errors;
}

/** YYYY-MM-DD → DD/MM/YYYY, the format used on the printed form. */
export function formatFormDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}/${m}/${y}` : iso;
}

export function todayIso() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
