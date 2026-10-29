"use client";

import { useId, useState } from "react";
import { Calculator, Minus, Plus } from "lucide-react";
import type { MembershipPackage, MembershipSettings } from "@/lib/data/types";
import { calculateMembership } from "@/lib/membership";
import { formatMoney } from "@/lib/format";
import { Notice } from "@/components/ui/primitives";

const MAX_ADDITIONAL = 20;

export function MembershipCalculator({
  packages,
  settings,
  defaultPackageId,
}: {
  packages: MembershipPackage[];
  settings: MembershipSettings;
  defaultPackageId?: string;
}) {
  const usable = packages.filter((p) => p.prices.length > 0);
  const [packageId, setPackageId] = useState(defaultPackageId && usable.some((p) => p.id === defaultPackageId) ? defaultPackageId : usable[0]?.id);
  const pkg = usable.find((p) => p.id === packageId) ?? usable[0];
  const [durationKey, setDurationKey] = useState(pkg?.prices[0]?.duration_key);
  const [additional, setAdditional] = useState(0);
  const uid = useId();

  const price = pkg?.prices.find((p) => p.duration_key === durationKey) ?? pkg?.prices[0];
  const canAddMembers = !!pkg?.allows_additional_members && price?.additional_member_price != null;
  const extra = canAddMembers ? additional : 0;

  let quote: ReturnType<typeof calculateMembership> | null = null;
  if (price) {
    try {
      quote = calculateMembership({
        basePrice: price.base_price,
        vatRate: settings.vat_rate,
        additionalMembers: extra,
        additionalMemberPrice: price.additional_member_price,
      });
    } catch {
      quote = null;
    }
  }

  if (!pkg) {
    return <Notice tone="warning">Membership prices are not available at the moment.</Notice>;
  }

  const money = (n: number) => formatMoney(n, settings.currency);
  const vatPercent = `${Math.round(settings.vat_rate * 10000) / 100}%`;

  return (
    <div className="grid gap-6 rounded-3xl border border-line bg-white p-5 shadow-card sm:p-7 lg:grid-cols-[1.35fr_1fr] lg:gap-8">
      <div className="space-y-6">
        <fieldset>
          <legend className="text-sm font-semibold text-ink">1. Choose a package</legend>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {usable.map((p) => (
              <label
                key={p.id}
                className="relative flex cursor-pointer flex-col rounded-2xl border border-line p-4 transition-colors hover:border-brand has-checked:border-brand-dark has-checked:bg-brand-50 has-focus-visible:outline-2 has-focus-visible:outline-brand-dark"
              >
                <input
                  type="radio"
                  name={`${uid}-package`}
                  value={p.id}
                  checked={p.id === pkg.id}
                  onChange={() => {
                    setPackageId(p.id);
                    if (!p.prices.some((x) => x.duration_key === durationKey)) setDurationKey(p.prices[0]?.duration_key);
                    if (!p.allows_additional_members) setAdditional(0);
                  }}
                  className="sr-only"
                />
                <span className="font-medium text-ink">{p.name}</span>
                {p.description ? <span className="mt-0.5 text-sm text-muted">{p.description}</span> : null}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold text-ink">2. Choose a duration</legend>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {pkg.prices.map((p) => (
              <label
                key={p.duration_key}
                className="flex cursor-pointer items-center justify-center rounded-xl border border-line px-2 py-2.5 text-center text-sm font-medium text-muted transition-colors hover:border-brand has-checked:border-brand-dark has-checked:bg-brand-dark has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-brand-dark"
              >
                <input
                  type="radio"
                  name={`${uid}-duration`}
                  value={p.duration_key}
                  checked={p.duration_key === price?.duration_key}
                  onChange={() => setDurationKey(p.duration_key)}
                  className="sr-only"
                />
                {p.duration_label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <p id={`${uid}-extra`} className="text-sm font-semibold text-ink">
            3. Additional members <span className="font-normal text-muted">(child or adult)</span>
          </p>
          {canAddMembers ? (
            <div className="mt-3 flex items-center gap-4">
              <div className="inline-flex items-center rounded-full border border-line" role="group" aria-labelledby={`${uid}-extra`}>
                <button
                  type="button"
                  onClick={() => setAdditional((n) => Math.max(0, n - 1))}
                  disabled={additional === 0}
                  className="grid size-10 place-items-center rounded-full text-brand-dark hover:bg-brand-50 disabled:opacity-40"
                  aria-label="Remove one additional member"
                >
                  <Minus className="size-4" aria-hidden />
                </button>
                <output className="w-10 text-center font-semibold text-ink tabular-nums" aria-live="polite">
                  {additional}
                </output>
                <button
                  type="button"
                  onClick={() => setAdditional((n) => Math.min(MAX_ADDITIONAL, n + 1))}
                  disabled={additional >= MAX_ADDITIONAL}
                  className="grid size-10 place-items-center rounded-full text-brand-dark hover:bg-brand-50 disabled:opacity-40"
                  aria-label="Add one additional member"
                >
                  <Plus className="size-4" aria-hidden />
                </button>
              </div>
              <p className="text-sm text-muted">{money(price!.additional_member_price!)} each, before VAT</p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted">This package is for {pkg.people_included === 1 ? "one person" : `${pkg.people_included} people`}; the price list does not include additional members for it.</p>
          )}
        </div>
      </div>

      <div className="flex flex-col rounded-2xl bg-brand-50 p-5 ring-1 ring-brand-200 sm:p-6" aria-live="polite">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand-dark">
          <Calculator className="size-4" aria-hidden /> Your estimate
        </p>
        <p className="mt-1 text-sm text-muted">
          {pkg.name} · {price?.duration_label}
        </p>
        {quote ? (
          <>
            <dl className="mt-5 space-y-2.5 text-[0.9375rem]">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Base price</dt>
                <dd className="font-medium text-ink tabular-nums">{money(quote.basePrice)}</dd>
              </div>
              {quote.additionalMembers > 0 ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">
                    Additional members ({quote.additionalMembers} × {money(quote.additionalMemberPrice)})
                  </dt>
                  <dd className="font-medium text-ink tabular-nums">{money(quote.additionalTotal)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4 border-t border-brand-200 pt-2.5">
                <dt className="text-muted">Subtotal (VAT excluded)</dt>
                <dd className="font-medium text-ink tabular-nums">{money(quote.subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">VAT ({vatPercent})</dt>
                <dd className="font-medium text-ink tabular-nums">{money(quote.tax)}</dd>
              </div>
            </dl>
            <div className="mt-5 border-t border-brand-200 pt-4">
              <p className="text-sm text-muted">Total including VAT</p>
              <p className="font-display text-4xl text-brand-dark tabular-nums">{money(quote.total)}</p>
            </div>
            <p className="mt-auto pt-5 text-xs leading-relaxed text-muted">
              Total = (base price{quote.additionalMembers > 0 ? " + additional members" : ""}) × {+(1 + settings.vat_rate).toFixed(4)}. Prices are from the 2026
              price lists, which exclude VAT; {vatPercent} VAT is added once. Final amounts are confirmed by Community Management.
            </p>
          </>
        ) : (
          <p className="mt-4 text-sm text-muted">Select a package and duration to see the price.</p>
        )}
      </div>
    </div>
  );
}
