import type { Metadata } from "next";
import { Suspense } from "react";
import { BusinessDirectory } from "@/components/commercial/business-directory";
import { SourceDocuments } from "@/components/documents/source-documents";
import { CardGridSkeleton, Container, EmptyState, ErrorState, PageHeader } from "@/components/ui/primitives";
import { getBusinessDirectory } from "@/lib/data/queries";

export const metadata: Metadata = {
  title: "Commercial Directory",
  description: "Shops, restaurants and services across Makadi Heights, with phone numbers and map locations.",
};

async function Directory() {
  const result = await getBusinessDirectory();
  if (!result.ok) return <ErrorState message={result.message} />;
  if (result.data.businesses.length === 0) return <EmptyState title="No businesses listed yet" />;
  return <BusinessDirectory groups={result.data.groups} businesses={result.data.businesses} />;
}

export default function CommercialPage() {
  return (
    <>
      <PageHeader
        eyebrow="It’s all in town"
        title="Commercial Directory"
        description="From your morning coffee to a clinic visit, a new phone line or a horse ride — the shops, restaurants and services open across Makadi Heights."
      />
      <Container className="space-y-12 py-10 sm:py-14">
        <Suspense fallback={<CardGridSkeleton count={9} />}>
          <Directory />
        </Suspense>
        <Suspense fallback={null}>
          <SourceDocuments ids={["commercial-index", "commercial-phones"]} />
        </Suspense>
      </Container>
    </>
  );
}
