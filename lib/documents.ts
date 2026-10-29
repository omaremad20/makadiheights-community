import type { DocumentLinks } from "@/components/documents/document-actions";
import type { PortalDocument } from "@/lib/data/types";
import { documentDownloadUrl, documentUrl } from "@/lib/storage";

/** Converts a document row into the serialisable link set used by <DocumentActions>. */
export function toDocumentLinks(doc: PortalDocument, pageLabel?: string): DocumentLinks {
  return {
    title: doc.title,
    fileType: doc.file_type,
    viewUrl: doc.storage_path ? documentUrl(doc.storage_path) : null,
    downloadUrl: doc.storage_path ? documentDownloadUrl(doc.storage_path) : null,
    pageHref: doc.portal_href,
    pageLabel,
  };
}

export function findDocument(docs: PortalDocument[], id: string) {
  return docs.find((d) => d.id === id) ?? null;
}
