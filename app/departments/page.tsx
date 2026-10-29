import type { Metadata } from "next";
import { Suspense } from "react";
import { DepartmentCard } from "@/components/departments/department-card";
import { SourceDocuments } from "@/components/documents/source-documents";
import { CardGridSkeleton, Container, EmptyState, ErrorState, PageHeader } from "@/components/ui/primitives";
import { getDepartments } from "@/lib/data/queries";

export const metadata: Metadata = {
  title: "Departments & Contacts",
  description: "Phone numbers, emails, working hours and responsibilities of every Makadi Heights department.",
};

async function DepartmentList() {
  const result = await getDepartments();
  if (!result.ok) return <ErrorState message={result.message} />;
  if (result.data.length === 0) return <EmptyState title="No departments listed yet" />;
  const departments = result.data;

  return (
    <>
      <nav aria-label="Jump to department" className="mb-8 flex flex-wrap gap-2">
        {departments.map((d) => (
          <a key={d.id} href={`#${d.id}`} className="rounded-full border border-line bg-white px-3 py-1.5 text-sm text-muted hover:border-brand hover:text-brand-dark">
            {d.name}
          </a>
        ))}
      </nav>
      <div className="grid gap-5 md:grid-cols-2">
        {departments.map((d) => (
          <DepartmentCard key={d.id} department={d} />
        ))}
      </div>
    </>
  );
}

export default function DepartmentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Directory"
        title="Departments & Contacts"
        description="Reach the right Makadi Heights team directly. Tap a number to call or an address to email."
      />
      <Container className="space-y-12 py-10 sm:py-14">
        <Suspense fallback={<CardGridSkeleton count={6} />}>
          <DepartmentList />
        </Suspense>
        <Suspense fallback={null}>
          <SourceDocuments ids={["departments-index", "homeowner-manual"]} />
        </Suspense>
      </Container>
    </>
  );
}
