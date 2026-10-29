/**
 * Phone helpers. Numbers are stored exactly as they appear in the sources;
 * these helpers only build `tel:` links and a readable display form.
 */

const EG_MOBILE = /^(?:\+20|0020|0)?(1[0125]\d{8})$/;

function digitsOnly(value: string) {
  return value.replace(/[^\d+]/g, "");
}

export function telHref(phone: string) {
  const compact = digitsOnly(phone);
  const mobile = compact.match(EG_MOBILE);
  if (mobile) return `tel:+20${mobile[1]}`;
  return `tel:${compact}`;
}

export function formatPhone(phone: string) {
  const compact = digitsOnly(phone);
  const mobile = compact.match(EG_MOBILE);
  if (mobile) {
    const n = mobile[1];
    return `+20 ${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`;
  }
  return phone.trim();
}

export function mailtoHref(email: string) {
  return `mailto:${email.trim()}`;
}

export function formatMoney(amount: number, currency = "EGP") {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${currency} ${formatted}`;
}
