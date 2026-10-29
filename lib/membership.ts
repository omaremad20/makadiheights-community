/**
 * Membership price calculation.
 *
 * The 2026 price lists are VAT excluded. The final price is the listed base
 * price plus 14% tax, applied exactly once to the subtotal:
 *
 *   subtotal = package base price + additional members × additional price
 *   tax      = subtotal × VAT rate
 *   total    = subtotal + tax
 *
 * Amounts are calculated in piastres (integer) to avoid floating-point drift,
 * and rounded to the nearest piastre.
 */
export type MembershipQuote = {
  basePrice: number;
  additionalMembers: number;
  additionalMemberPrice: number;
  additionalTotal: number;
  subtotal: number;
  vatRate: number;
  tax: number;
  total: number;
};

const toPiastres = (egp: number) => Math.round(egp * 100);
const fromPiastres = (p: number) => p / 100;

export function calculateMembership(input: {
  basePrice: number;
  vatRate: number;
  additionalMembers?: number;
  additionalMemberPrice?: number | null;
}): MembershipQuote {
  const additionalMembers = Math.max(0, Math.floor(input.additionalMembers ?? 0));
  const additionalMemberPrice = input.additionalMemberPrice ?? 0;

  if (!Number.isFinite(input.basePrice) || input.basePrice < 0) throw new Error("Invalid base price");
  if (!Number.isFinite(input.vatRate) || input.vatRate < 0) throw new Error("Invalid VAT rate");
  if (additionalMembers > 0 && input.additionalMemberPrice == null) {
    throw new Error("This package does not list a price for additional members");
  }

  const base = toPiastres(input.basePrice);
  const additional = toPiastres(additionalMemberPrice) * additionalMembers;
  const subtotal = base + additional;
  const tax = Math.round(subtotal * input.vatRate);

  return {
    basePrice: fromPiastres(base),
    additionalMembers,
    additionalMemberPrice,
    additionalTotal: fromPiastres(additional),
    subtotal: fromPiastres(subtotal),
    vatRate: input.vatRate,
    tax: fromPiastres(tax),
    total: fromPiastres(subtotal + tax),
  };
}
