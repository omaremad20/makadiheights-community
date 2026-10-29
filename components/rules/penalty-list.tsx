"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Search, Scale } from "lucide-react";
import type { Penalty } from "@/lib/data/types";
import { formatMoney } from "@/lib/format";
import { Badge, EmptyState } from "@/components/ui/primitives";

export function PenaltyList({ penalties }: { penalties: Penalty[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const q = useDeferredValue(query.trim().toLowerCase());
  const categories = useMemo(() => Array.from(new Set(penalties.map((p) => p.category))), [penalties]);

  const filtered = penalties.filter(
    (p) => (category === "all" || p.category === category) && (!q || `${p.id} ${p.description} ${p.qualifier ?? ""}`.toLowerCase().includes(q)),
  );

  return (
    <div>
      <div className="flex flex-col gap-3">
        <label className="relative block lg:w-80">
          <span className="sr-only">Search penalties</span>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search violations…"
            className="h-11 w-full rounded-full border border-line bg-white pr-4 pl-10 text-[0.9375rem] placeholder:text-subtle focus:border-brand-dark focus:outline-none"
          />
        </label>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible md:pb-0" role="group" aria-label="Filter by category">
          {["all", ...categories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className="h-9 shrink-0 rounded-full border border-line px-3.5 text-sm text-muted transition-colors hover:border-brand hover:text-brand-dark aria-pressed:border-brand-dark aria-pressed:bg-brand-dark aria-pressed:text-white"
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-5 text-sm text-muted" aria-live="polite">
        Showing {filtered.length} of {penalties.length} penalties
      </p>

      {filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No matching penalties">Try another word or category.</EmptyState>
        </div>
      ) : (
        <div className="mt-4 space-y-10">
          {categories
            .filter((c) => filtered.some((p) => p.category === c))
            .map((c) => (
              <section key={c} aria-label={c}>
                <h2 className="font-display text-xl text-ink sm:text-2xl">{c}</h2>
                <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white shadow-card">
                  {filtered
                    .filter((p) => p.category === c)
                    .map((p) => (
                      <li key={p.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:px-5">
                        <div className="flex gap-3">
                          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-semibold text-brand-dark ring-1 ring-brand-200 tabular-nums">
                            {p.id}
                          </span>
                          <div>
                            <p className="text-[0.9375rem] leading-relaxed text-ink">{p.description}</p>
                            {p.qualifier ? (
                              <p className="mt-1.5">
                                <Badge tone="warning">
                                  <Scale className="size-3" aria-hidden /> {p.qualifier}
                                </Badge>
                              </p>
                            ) : null}
                          </div>
                        </div>
                        <p className="shrink-0 pl-10 font-display text-xl text-danger-700 tabular-nums sm:pl-0 sm:text-right">
                          {formatMoney(p.amount_egp)}
                          {p.amount_suffix ? <span aria-label=" plus additional charges">{p.amount_suffix}</span> : null}
                        </p>
                      </li>
                    ))}
                </ul>
              </section>
            ))}
        </div>
      )}
    </div>
  );
}
