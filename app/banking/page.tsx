import type { Metadata } from "next";
import { Suspense } from "react";
import { Landmark } from "lucide-react";
import { SourceDocuments } from "@/components/documents/source-documents";
import { CopyButton } from "@/components/ui/copy-button";
import { PhoneLink } from "@/components/ui/contact-links";
import { Badge, Card, CardGridSkeleton, Container, EmptyState, ErrorState, Notice, PageHeader } from "@/components/ui/primitives";
import { getBankAccounts, getDepartments } from "@/lib/data/queries";
import type { BankAccount } from "@/lib/data/types";

export const metadata: Metadata = {
  title: "Banking & Payments",
  description: "CIB bank account numbers, IBANs and SWIFT code for payments to Makadi Heights for Tourist Development.",
};

function Field({ label, value, copy = false, mono = false }: { label: string; value: string; copy?: boolean; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <dt className="text-xs font-medium tracking-wide text-subtle uppercase">{label}</dt>
        <dd className={`mt-0.5 text-ink ${mono ? "font-mono text-[0.95rem] tracking-wide break-all" : "text-[0.9375rem] break-words"}`}>{value}</dd>
      </div>
      {copy ? <CopyButton value={value} label={label} /> : null}
    </div>
  );
}

function AccountCard({ account }: { account: BankAccount }) {
  return (
    <Card as="article" className="p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-dark ring-1 ring-brand-200">
            <Landmark className="size-5" aria-hidden />
          </span>
          <div>
            <h2 className="font-display text-xl text-ink">{account.currency} account</h2>
            <p className="text-sm text-muted">{account.bank_name}</p>
          </div>
        </div>
        <Badge>{account.currency}</Badge>
      </div>
      <dl className="mt-4 divide-y divide-line border-t border-line">
        <Field label="Account holder" value={account.account_holder} copy />
        <Field label="Account number" value={account.account_number} copy mono />
        {account.iban ? <Field label="IBAN" value={account.iban} copy mono /> : null}
        {account.swift_code ? <Field label="SWIFT / BIC" value={account.swift_code} copy mono /> : null}
        {account.branch_address ? <Field label="Branch address" value={account.branch_address} /> : null}
      </dl>
    </Card>
  );
}

async function Accounts() {
  const result = await getBankAccounts();
  if (!result.ok) return <ErrorState message={result.message} />;
  if (result.data.length === 0) return <EmptyState title="No bank accounts listed yet" />;
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {result.data.map((a) => (
        <AccountCard key={a.id} account={a} />
      ))}
    </div>
  );
}

async function FinanceContact() {
  const result = await getDepartments();
  if (!result.ok) return null;
  const finance = result.data.find((d) => d.id === "finance");
  if (!finance) return null;
  const phones = finance.contacts.filter((c) => c.kind === "phone");
  return (
    <Notice title="Questions about a payment?">
      Contact the {finance.name}
      {finance.working_hours ? ` (${finance.working_hours})` : ""}:
      <span className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
        {phones.map((p) => (
          <PhoneLink key={p.id} phone={p.value} />
        ))}
      </span>
    </Notice>
  );
}

export default function BankingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Banking & Payments"
        description="Bank transfer details for payments to Makadi Heights. Use the copy buttons to paste numbers exactly as shown."
      />
      <Container className="space-y-10 py-10 sm:py-14">
        <Suspense fallback={<CardGridSkeleton count={4} />}>
          <Accounts />
        </Suspense>
        <Suspense fallback={null}>
          <FinanceContact />
        </Suspense>
        <Suspense fallback={null}>
          <SourceDocuments ids={["bank-details"]} />
        </Suspense>
      </Container>
    </>
  );
}
