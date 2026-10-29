"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { FileText, Languages, Search } from "lucide-react";
import { Badge, EmptyState } from "@/components/ui/primitives";
import { DocumentActions, type DocumentLinks } from "./document-actions";

export type LibraryItem = DocumentLinks & {
  id: string;
  category: string;
  description: string;
  language: string;
};

export function DocumentLibrary({ items }: { items: LibraryItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [highlight, setHighlight] = useState<string | null>(null);
  const q = useDeferredValue(query.trim().toLowerCase());
  const categories = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.category)))], [items]);

  // Support deep links such as /documents#homeowner-manual
  useEffect(() => {
    const apply = () => {
      const id = window.location.hash.slice(1);
      if (!id || !items.some((i) => i.id === id)) return;
      setHighlight(id);
      requestAnimationFrame(() => document.getElementById(`doc-${id}`)?.scrollIntoView({ block: "center" }));
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [items]);

  const filtered = items.filter(
    (i) => (category === "All" || i.category === category) && (!q || `${i.title} ${i.description} ${i.category}`.toLowerCase().includes(q)),
  );

  return (
    <div>
      <div className="flex flex-col gap-3">
        <label className="relative block lg:w-80">
          <span className="sr-only">Search documents</span>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or topic…"
            className="h-11 w-full rounded-full border border-line bg-white pr-4 pl-10 text-[0.9375rem] placeholder:text-subtle focus:border-brand-dark focus:outline-none"
          />
        </label>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible md:pb-0" role="group" aria-label="Filter by category">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className="h-9 shrink-0 rounded-full border border-line px-3.5 text-sm text-muted transition-colors hover:border-brand hover:text-brand-dark aria-pressed:border-brand-dark aria-pressed:bg-brand-dark aria-pressed:text-white"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-5 text-sm text-muted" aria-live="polite">
        {filtered.length} of {items.length} documents
      </p>

      {filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No matching documents">Try another word or category.</EmptyState>
        </div>
      ) : (
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {filtered.map((doc) => (
            <li
              key={doc.id}
              id={`doc-${doc.id}`}
              className={`flex scroll-mt-28 flex-col rounded-2xl border bg-white p-5 shadow-card transition-colors ${
                highlight === doc.id ? "border-brand-dark ring-2 ring-brand-200" : "border-line"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-dark ring-1 ring-brand-200">
                  <FileText className="size-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <h2 className="font-display text-xl leading-snug text-ink">{doc.title}</h2>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <Badge>{doc.category}</Badge>
                    {doc.fileType ? <Badge tone="neutral">{doc.fileType.toUpperCase()}</Badge> : null}
                    <Badge tone="neutral">
                      <Languages className="size-3" aria-hidden /> {doc.language}
                    </Badge>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{doc.description}</p>
              {doc.fileType === "docx" ? (
                <p className="mt-2 text-xs text-subtle">Word document — read it on its portal page or download the original.</p>
              ) : null}
              <div className="mt-auto pt-4">
                <DocumentActions doc={doc} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
