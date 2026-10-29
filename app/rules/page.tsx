import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, BookOpen, Gavel } from "lucide-react";
import { ContentSection } from "@/components/content/content-section";
import { SourceDocuments } from "@/components/documents/source-documents";
import { Card, Container, ErrorState, PageHeader, Skeleton } from "@/components/ui/primitives";
import { getContentSections } from "@/lib/data/queries";

export const metadata: Metadata = {
  title: "Rules & Regulations",
  description: "Tenants' rules and regulations, the penalties list and the community guidelines for Makadi Heights.",
};

async function TenantRules() {
  const result = await getContentSections("tenant-rules");
  if (!result.ok) return <ErrorState message={result.message} />;
  return (
    <>
      {result.data.map((s) => (
        <ContentSection key={s.id} section={s} ordered />
      ))}
    </>
  );
}

export default function RulesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Community guidelines"
        title="Rules & Regulations"
        description="The rules that keep Makadi Heights safe, calm and well cared for — for owners, tenants and their guests."
      />
      <Container className="space-y-12 py-10 sm:py-14">
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/rules/penalties" className="group">
            <Card className="flex h-full items-start gap-4 p-5 transition-colors group-hover:border-brand group-hover:bg-brand-50">
              <Gavel className="mt-0.5 size-6 shrink-0 text-brand-dark" aria-hidden />
              <span>
                <span className="block font-display text-xl text-ink">Penalties list</span>
                <span className="mt-1 block text-sm text-muted">All 29 violations and their fines in EGP, searchable by category.</span>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-dark">
                  View penalties <ArrowRight className="size-4" aria-hidden />
                </span>
              </span>
            </Card>
          </Link>
          <Link href="/documents#homeowner-manual" className="group">
            <Card className="flex h-full items-start gap-4 p-5 transition-colors group-hover:border-brand group-hover:bg-brand-50">
              <BookOpen className="mt-0.5 size-6 shrink-0 text-brand-dark" aria-hidden />
              <span>
                <span className="block font-display text-xl text-ink">Homeowner Manual</span>
                <span className="mt-1 block text-sm text-muted">
                  General guidelines, pools and lagoons, the Clubhouse, entry and exit permits, and the pets policy.
                </span>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-dark">
                  Open the manual <ArrowRight className="size-4" aria-hidden />
                </span>
              </span>
            </Card>
          </Link>
        </div>

        <section id="tenant-rules" className="scroll-mt-24 space-y-4">
          <Suspense fallback={<Skeleton className="h-[40rem]" />}>
            <TenantRules />
          </Suspense>
          <p className="text-sm text-muted">
            The original document is signed by both the owner and the tenant. Translated from the Arabic original; download it below for the
            signed bilingual version.
          </p>
        </section>

        <Suspense fallback={null}>
          <SourceDocuments ids={["tenant-rules", "penalties-list", "homeowner-manual"]} />
        </Suspense>
      </Container>
    </>
  );
}
