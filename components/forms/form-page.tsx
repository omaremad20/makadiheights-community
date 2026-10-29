import { Suspense } from "react";
import { SourceDocuments } from "@/components/documents/source-documents";
import { OnlineForm } from "@/components/forms/online-form";
import { Container, PageHeader } from "@/components/ui/primitives";
import { LinkButton } from "@/components/ui/button";
import { FORMS } from "@/lib/forms/definitions";

export function FormPage({ formId }: { formId: keyof typeof FORMS }) {
  const def = FORMS[formId];
  return (
    <>
      <PageHeader eyebrow={`Online form · ${def.subtitle}`} title={def.title} description={def.description}>
        <LinkButton href="/forms" variant="secondary">
          All forms
        </LinkButton>
      </PageHeader>
      <Container className="py-10 sm:py-14">
        <div className="mx-auto max-w-3xl space-y-12">
          <OnlineForm formId={formId} />
          <Suspense fallback={null}>
            <SourceDocuments ids={[def.documentId]} title="Original Word form" />
          </Suspense>
        </div>
      </Container>
    </>
  );
}
