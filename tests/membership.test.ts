import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateMembership } from "../lib/membership.ts";
import { formatPhone, telHref } from "../lib/format.ts";

test("adds 14% VAT exactly once to the base price", () => {
  const q = calculateMembership({ basePrice: 24300, vatRate: 0.14 });
  assert.equal(q.subtotal, 24300);
  assert.equal(q.tax, 3402);
  assert.equal(q.total, 27702);
});

test("includes additional members before tax", () => {
  const q = calculateMembership({ basePrice: 8400, vatRate: 0.14, additionalMembers: 2, additionalMemberPrice: 1500 });
  assert.equal(q.additionalTotal, 3000);
  assert.equal(q.subtotal, 11400);
  assert.equal(q.tax, 1596);
  assert.equal(q.total, 12996);
});

test("rounds to the nearest piastre", () => {
  const q = calculateMembership({ basePrice: 2062, vatRate: 0.14 });
  assert.equal(q.tax, 288.68);
  assert.equal(q.total, 2350.68);
});

test("rejects additional members when the package lists no price for them", () => {
  assert.throws(() => calculateMembership({ basePrice: 15750, vatRate: 0.14, additionalMembers: 1, additionalMemberPrice: null }));
});

test("ignores negative or fractional member counts", () => {
  const q = calculateMembership({ basePrice: 1000, vatRate: 0.14, additionalMembers: -3, additionalMemberPrice: 100 });
  assert.equal(q.additionalMembers, 0);
  assert.equal(q.total, 1140);
});

test("builds tel: links without altering short codes", () => {
  assert.equal(telHref("01289403344"), "tel:+201289403344");
  assert.equal(telHref("+201222259900"), "tel:+201222259900");
  assert.equal(telHref("16110"), "tel:16110");
  assert.equal(telHref("122"), "tel:122");
  assert.equal(formatPhone("+201222259900"), "+20 122 225 9900");
  // Malformed numbers from the source are kept as-is rather than "corrected".
  assert.equal(telHref("011142429857"), "tel:011142429857");
  assert.equal(formatPhone("011142429857"), "011142429857");
});
