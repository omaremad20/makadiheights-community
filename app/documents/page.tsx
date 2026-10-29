import type { Metadata } from "next";
import { Suspense } from "react";
import { DocumentLibrary, type LibraryItem } from "@/components/documents/document-library";
import { CardGridSkeleton, Container, EmptyState, ErrorState, PageHeader } from "@/components/ui/primitives";
import { getDocuments } from "@/lib/data/queries";
import { toDocumentLinks } from "@/lib/documents";

export const metadata: Metadata = {
  title: "All Documents",
  description: "Every Makadi Heights community document in one place — preview, download or open the matching portal page.",
};

const PAGE_LABELS: Record<string, string> = {
  "/departments": "Departments page",
  "/commercial": "Directory page",
  "/banking": "Banking page",
  "/shuttle": "Schedule page",
  "/security": "Security page",
  "/serenity": "Serenity page",
  "/serenity#menu": "Serenity page",
  "/membership": "Calculator",
  "/forms/delegation": "Fill in online",
  "/forms/tenant": "Fill in online",
  "/rules/penalties": "Penalties page",
  "/rules#tenant-rules": "Rules page",
  "/announcements/may-2025": "Read online",
};

async function Library() {
  const result = await getDocuments();
  if (!result.ok) return <ErrorState message={result.message} />;
  if (result.data.length === 0) return <EmptyState title="No documents published yet" />;
  const items: LibraryItem[] = result.data.map((d) => ({
    ...toDocumentLinks(d, d.portal_href ? PAGE_LABELS[d.portal_href] : undefined),
    id: d.id,
    category: d.category,
    description: d.description,
    language: d.language,
  }));
  return <DocumentLibrary items={items} />;
}

export default function DocumentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Library"
        title="All Documents"
        description="The original community documents. Preview PDFs in your browser, download any file, or open the portal page that presents it in English."
      />
      <Container className="py-10 sm:py-14">
        <Suspense fallback={<CardGridSkeleton count={8} />}>
          <Library />
        </Suspense>
      </Container>
    </>
  );
}
