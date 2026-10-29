import { FileText } from "lucide-react";
import { getDocuments } from "@/lib/data/queries";
import { toDocumentLinks } from "@/lib/documents";
import { DocumentActions } from "./document-actions";

/**
 * "Original documents" strip shown at the end of a page, for the source files
 * the page was built from. Reads document metadata from Supabase.
 */
export async function SourceDocuments({ ids, title = "Original documents" }: { ids: string[]; title?: string }) {
  const result = await getDocuments();
  if (!result.ok) return null;
  const docs = ids.map((id) => result.data.find((d) => d.id === id)).filter((d) => d !== undefined);
  if (docs.length === 0) return null;

  return (
    <section aria-labelledby="source-documents" className="rounded-2xl border border-line bg-brand-50 p-5 sm:p-6">
      <h2 id="source-documents" className="font-display text-xl text-ink">
        {title}
      </h2>
      <ul className="mt-4 divide-y divide-line">
        {docs.map((doc) => (
          <li key={doc.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 gap-3">
              <FileText className="mt-0.5 size-5 shrink-0 text-brand-dark" aria-hidden />
              <div className="min-w-0">
                <p className="font-medium text-ink">{doc.title}</p>
                <p className="text-sm text-muted">
                  {doc.file_type?.toUpperCase()} · {doc.language}
                </p>
              </div>
            </div>
            <DocumentActions doc={toDocumentLinks(doc)} showPage={false} />
          </li>
        ))}
      </ul>
    </section>
  );
}
