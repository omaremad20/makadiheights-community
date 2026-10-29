import type { Metadata } from "next";
import { Suspense } from "react";
import { ContentSection } from "@/components/content/content-section";
import { SourceDocuments } from "@/components/documents/source-documents";
import { PenaltyList } from "@/components/rules/penalty-list";
import { Container, EmptyState, ErrorState, PageHeader, Skeleton } from "@/components/ui/primitives";
import { LinkButton } from "@/components/ui/button";
import { getContentSections, getPenalties } from "@/lib/data/queries";

export const metadata: Metadata = {
  title: "Penalties List",
  description: "Fines for violations of the Makadi Heights community rules, in EGP.",
};

async function Penalties() {
  const [penalties, notes] = await Promise.all([getPenalties(), getContentSections("penalties")]);
  if (!penalties.ok) return <ErrorState message={penalties.message} />;
  if (penalties.data.length === 0) return <EmptyState title="No penalties published" />;
  return (
    <div className="space-y-8">
      {notes.ok ? notes.data.map((s) => <ContentSection key={s.id} section={s} />) : null}
      <PenaltyList penalties={penalties.data} />
    </div>
  );
}

export default function PenaltiesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Rules & Regulations"
        title="Penalties List"
        description="Fines applied for violations inside Makadi Heights. Amounts are in Egyptian pounds (EGP). Translated from the Arabic original."
      >
        <LinkButton href="/rules" variant="secondary">
          Tenant rules
        </LinkButton>
      </PageHeader>
      <Container className="space-y-12 py-10 sm:py-14">
        <Suspense fallback={<Skeleton className="h-[40rem]" />}>
          <Penalties />
        </Suspense>
        <Suspense fallback={null}>
          <SourceDocuments ids={["penalties-list"]} />
        </Suspense>
      </Container>
    </>
  );
}
