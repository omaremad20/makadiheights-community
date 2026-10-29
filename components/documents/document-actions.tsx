"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Download, ExternalLink, Eye, Loader2, X } from "lucide-react";
import { Button, LinkButton, buttonClasses } from "@/components/ui/button";

export type DocumentLinks = {
  title: string;
  fileType: "pdf" | "docx" | null;
  viewUrl: string | null;
  downloadUrl: string | null;
  pageHref?: string | null;
  pageLabel?: string;
};

/**
 * Preview / Download / Open-page actions for one document.
 * PDFs preview in an in-page viewer on larger screens; on phones (where
 * embedded PDFs are unreliable) Preview opens the browser's own viewer.
 * Word files are offered as downloads, with the native page as the readable version.
 */
export function DocumentActions({ doc, size = "sm", showPage = true }: { doc: DocumentLinks; size?: "sm" | "md"; showPage?: boolean }) {
  const [open, setOpen] = useState(false);
  const canPreview = doc.fileType === "pdf" && !!doc.viewUrl;

  return (
    <div className="flex flex-wrap gap-2">
      {canPreview ? (
        <>
          <Button variant="primary" size={size} onClick={() => setOpen(true)} className="hidden md:inline-flex">
            <Eye aria-hidden /> Preview
          </Button>
          <LinkButton href={doc.viewUrl!} external variant="primary" size={size} className="md:hidden">
            <Eye aria-hidden /> Preview
          </LinkButton>
        </>
      ) : null}
      {doc.downloadUrl ? (
        <LinkButton href={doc.downloadUrl} download variant={canPreview ? "secondary" : "primary"} size={size} aria-label={`Download ${doc.title}`}>
          <Download aria-hidden /> Download{doc.fileType ? ` ${doc.fileType.toUpperCase()}` : ""}
        </LinkButton>
      ) : null}
      {showPage && doc.pageHref ? (
        <LinkButton href={doc.pageHref} variant="ghost" size={size}>
          {doc.pageLabel ?? "Open page"} <ArrowRight aria-hidden />
        </LinkButton>
      ) : null}
      {open && canPreview ? <PdfPreviewDialog doc={doc} onClose={() => setOpen(false)} /> : null}
    </div>
  );
}

export function PdfPreviewDialog({ doc, onClose }: { doc: DocumentLinks; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      if (dialog.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      aria-label={`Preview: ${doc.title}`}
      className="m-auto h-[min(92dvh,60rem)] w-[min(96vw,64rem)] max-w-none overflow-hidden rounded-2xl border border-line bg-white p-0 shadow-raised backdrop:bg-brand-900/40"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <p className="min-w-0 truncate font-medium text-ink">{doc.title}</p>
          <div className="flex shrink-0 items-center gap-2">
            {doc.viewUrl ? (
              <a href={doc.viewUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses({ variant: "ghost", size: "sm" })}>
                <ExternalLink aria-hidden /> <span className="hidden sm:inline">New tab</span>
              </a>
            ) : null}
            {doc.downloadUrl ? (
              <a href={doc.downloadUrl} download="" className={buttonClasses({ variant: "secondary", size: "sm" })}>
                <Download aria-hidden /> <span className="hidden sm:inline">Download</span>
              </a>
            ) : null}
            <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close preview" autoFocus>
              <X aria-hidden />
            </Button>
          </div>
        </div>
        <div className="relative flex-1 bg-brand-50">
          {!loaded ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-muted" role="status">
              <Loader2 className="size-6 animate-spin text-brand-dark" aria-hidden />
              Loading document…
            </div>
          ) : null}
          <iframe src={doc.viewUrl ?? undefined} title={doc.title} className="relative h-full w-full" onLoad={() => setLoaded(true)} />
        </div>
        <p className="border-t border-line px-4 py-2 text-xs text-muted">
          Not displaying? Open it in a{" "}
          <a href={doc.viewUrl ?? "#"} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-dark underline">
            new tab
          </a>{" "}
          or{" "}
          <a href={doc.downloadUrl ?? "#"} download="" className="font-medium text-brand-dark underline">
            download it
          </a>
          .
        </p>
      </div>
    </dialog>
  );
}
