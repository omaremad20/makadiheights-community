import { Phone, Ticket } from "lucide-react";
import { ContentSection } from "@/components/content/content-section";
import { MembershipCalculator } from "@/components/membership/membership-calculator";
import { Card, ErrorState, SectionHeading } from "@/components/ui/primitives";
import { getContentSections, getMembershipCatalog } from "@/lib/data/queries";
import { formatMoney, formatPhone, telHref } from "@/lib/format";
import type { MembershipCatalog, MembershipPackage } from "@/lib/data/types";

function PriceTable({ pkg, vatRate, currency }: { pkg: MembershipPackage; vatRate: number; currency: string }) {
  const hasExtra = pkg.prices.some((p) => p.additional_member_price != null);
  const money = (n: number) => formatMoney(n, currency);
  const withVat = (n: number) => Math.round(n * 100 * (1 + vatRate)) / 100;
  return (
    <Card as="article" className="overflow-hidden">
      <div className="border-b border-line px-5 py-4">
        <h3 className="font-display text-xl text-ink">{pkg.name}</h3>
        {pkg.description ? <p className="mt-0.5 text-sm text-muted">{pkg.description}</p> : null}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{pkg.name} prices</caption>
          <thead>
            <tr className="bg-brand-50 text-xs text-subtle uppercase">
              <th scope="col" className="px-5 py-2.5 font-semibold">Duration</th>
              <th scope="col" className="px-5 py-2.5 text-right font-semibold">Price excl. VAT</th>
              <th scope="col" className="px-5 py-2.5 text-right font-semibold">Incl. VAT</th>
              {hasExtra ? <th scope="col" className="px-5 py-2.5 text-right font-semibold">Additional member excl. VAT</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {pkg.prices.map((p) => (
              <tr key={p.duration_key}>
                <th scope="row" className="px-5 py-2.5 font-medium text-ink">{p.duration_label}</th>
                <td className="px-5 py-2.5 text-right whitespace-nowrap tabular-nums">{money(p.base_price)}</td>
                <td className="px-5 py-2.5 text-right font-medium whitespace-nowrap text-brand-dark tabular-nums">{money(withVat(p.base_price))}</td>
                {hasExtra ? (
                  <td className="px-5 py-2.5 text-right whitespace-nowrap tabular-nums">{p.additional_member_price != null ? money(p.additional_member_price) : "—"}</td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function DayTicketsCard({ catalog }: { catalog: MembershipCatalog }) {
  if (catalog.dayTickets.length === 0) return null;
  const phone = catalog.settings.reservations_phone;
  return (
    <Card className="p-5 sm:p-6">
      <h3 className="inline-flex items-center gap-2 font-display text-xl text-ink">
        <Ticket className="size-5 text-brand-dark" aria-hidden /> Daily tickets
      </h3>
      <ul className="mt-3 divide-y divide-line">
        {catalog.dayTickets.map((t) => (
          <li key={t.id} className="flex items-center justify-between gap-4 py-2.5 text-[0.9375rem]">
            <span className="text-ink">
              {t.label}
              {t.note ? <span className="block text-xs text-muted">{t.note}</span> : null}
            </span>
            <span className="text-right">
              <span className="font-semibold text-brand-dark tabular-nums">{formatMoney(t.price, catalog.settings.currency)}</span>
              {t.tax_included ? <span className="block text-xs text-muted">Tax included</span> : null}
            </span>
          </li>
        ))}
      </ul>
      {phone ? (
        <p className="mt-3 text-sm text-muted">
          For reservations call{" "}
          <a href={telHref(phone)} className="inline-flex items-center gap-1 font-medium text-brand-dark tabular-nums hover:underline">
            <Phone className="size-3.5" aria-hidden />
            {formatPhone(phone)}
          </a>
        </p>
      ) : null}
    </Card>
  );
}

/**
 * Membership packages + calculator, shared by /membership and /serenity so both
 * read the same Supabase prices. `packageFilter` narrows which price tables are shown.
 */
export async function MembershipSections({
  packageFilter,
  defaultPackageId,
  showNotes = true,
  headingLevelTitle = "Membership packages",
  calculatorFirst = true,
}: {
  packageFilter?: (p: MembershipPackage) => boolean;
  defaultPackageId?: string;
  showNotes?: boolean;
  headingLevelTitle?: string;
  calculatorFirst?: boolean;
}) {
  const [catalog, notes] = await Promise.all([getMembershipCatalog(), getContentSections("membership")]);
  if (!catalog.ok) return <ErrorState message={catalog.message} />;
  const { packages, settings } = catalog.data;
  const shown = packageFilter ? packages.filter(packageFilter) : packages;
  const vatPercent = `${Math.round(settings.vat_rate * 10000) / 100}%`;

  const calculator = (
      <section aria-labelledby="calculator">
        <SectionHeading
          id="calculator"
          title="Membership calculator"
          description={`Pick a package, a duration and any additional members. Listed prices exclude VAT; ${vatPercent} is added once to give the final price.`}
        />
        <MembershipCalculator packages={packages} settings={settings} defaultPackageId={defaultPackageId} />
      </section>
  );
  const packagesSection = (
      <section aria-labelledby="packages">
        <SectionHeading id="packages" title={headingLevelTitle} description="2026 price list. Prices are per package and exclude VAT unless stated." />
        <div className="grid gap-5 lg:grid-cols-2">
          {shown.map((p) => (
            <PriceTable key={p.id} pkg={p} vatRate={settings.vat_rate} currency={settings.currency} />
          ))}
        </div>
      </section>
  );

  return (
    <div className="space-y-14">
      {calculatorFirst ? calculator : null}
      {packagesSection}
      {calculatorFirst ? null : calculator}
      {showNotes ? (
        <section aria-label="Tickets and notes" className="grid gap-5 lg:grid-cols-2">
          <DayTicketsCard catalog={catalog.data} />
          {notes.ok ? notes.data.filter((s) => s.id === "membership-courts").map((s) => <ContentSection key={s.id} section={s} />) : null}
          <div className="lg:col-span-2">
            {notes.ok ? notes.data.filter((s) => s.id === "membership-notes").map((s) => <ContentSection key={s.id} section={s} />) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
