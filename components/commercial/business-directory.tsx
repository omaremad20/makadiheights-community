"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { MapPin, Phone, Search, X } from "lucide-react";
import type { Business, BusinessGroup } from "@/lib/data/types";
import { formatPhone, telHref } from "@/lib/format";
import { buttonClasses } from "@/components/ui/button";
import { Badge, EmptyState } from "@/components/ui/primitives";

function normalise(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function BusinessCard({ business }: { business: Business }) {
  return (
    <li className="flex flex-col rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-xl leading-tight text-ink">{business.name}</h3>
          <p className="mt-1 text-sm font-medium text-brand-dark">{business.category}</p>
        </div>
        {business.area ? (
          <Badge>
            <MapPin className="size-3" aria-hidden />
            {business.area}
          </Badge>
        ) : null}
      </div>
      {business.description ? <p className="mt-2 text-sm leading-relaxed text-muted">{business.description}</p> : null}

      {business.phones.length > 0 ? (
        <ul className="mt-3 space-y-1">
          {business.phones.map((p) => (
            <li key={p.id} className="text-sm text-muted tabular-nums">
              {formatPhone(p.phone)}
              {p.label ? <span className="text-subtle"> · {p.label}</span> : null}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        {business.phones.map((p, i) => (
          <a
            key={p.id}
            href={telHref(p.phone)}
            className={buttonClasses({ size: "sm", variant: i === 0 ? "primary" : "secondary" })}
            aria-label={`Call ${business.name} on ${formatPhone(p.phone)}`}
          >
            <Phone aria-hidden /> {business.phones.length > 1 ? `Call ${i + 1}` : "Call"}
          </a>
        ))}
        {business.map_url ? (
          <a
            href={business.map_url}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses({ size: "sm", variant: "secondary" })}
            aria-label={`View ${business.name} location on Google Maps (opens in a new tab)`}
          >
            <MapPin aria-hidden /> View location
          </a>
        ) : null}
        {business.phones.length === 0 && !business.map_url ? (
          <p className="text-xs text-subtle">No phone number or map location listed yet.</p>
        ) : null}
      </div>
    </li>
  );
}

export function BusinessDirectory({ groups, businesses }: { groups: BusinessGroup[]; businesses: Business[] }) {
  const [query, setQuery] = useState("");
  const [groupId, setGroupId] = useState<string>("all");
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const q = normalise(deferredQuery.trim());
    return businesses.filter((b) => {
      if (groupId !== "all" && b.group_id !== groupId) return false;
      if (!q) return true;
      return normalise(`${b.name} ${b.category} ${b.area ?? ""} ${b.description ?? ""}`).includes(q);
    });
  }, [businesses, deferredQuery, groupId]);

  const visibleGroups = groups.filter((g) => filtered.some((b) => b.group_id === g.id));
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    businesses.forEach((b) => m.set(b.group_id, (m.get(b.group_id) ?? 0) + 1));
    return m;
  }, [businesses]);

  return (
    <div>
      <div className="sticky top-16 z-10 -mx-4 border-b border-line bg-white/95 px-4 py-3 backdrop-blur sm:top-[4.5rem] sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
        <div className="flex flex-col gap-3">
          <label className="relative block lg:w-80">
            <span className="sr-only">Search businesses</span>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search businesses…"
              className="h-11 w-full rounded-full border border-line bg-white pr-10 pl-10 text-[0.9375rem] placeholder:text-subtle focus:border-brand-dark focus:outline-none"
            />
            {query ? (
              <button type="button" onClick={() => setQuery("")} className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-subtle hover:text-ink" aria-label="Clear search">
                <X className="size-4" aria-hidden />
              </button>
            ) : null}
          </label>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible md:pb-0" role="group" aria-label="Filter by category">
            {[{ id: "all", name: "All" }, ...groups].map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGroupId(g.id)}
                aria-pressed={groupId === g.id}
                className="h-9 shrink-0 rounded-full border border-line px-3.5 text-sm text-muted transition-colors hover:border-brand hover:text-brand-dark aria-pressed:border-brand-dark aria-pressed:bg-brand-dark aria-pressed:text-white"
              >
                {g.name}
                <span className="ml-1.5 text-xs opacity-70">{g.id === "all" ? businesses.length : counts.get(g.id) ?? 0}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-5 text-sm text-muted" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "business" : "businesses"}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No matching businesses">Try a different name or clear the filters.</EmptyState>
        </div>
      ) : (
        <div className="mt-4 space-y-12">
          {visibleGroups.map((g) => (
            <section key={g.id} aria-labelledby={`group-${g.id}`}>
              <h2 id={`group-${g.id}`} className="font-display text-2xl text-ink">
                {g.name}
              </h2>
              {g.description ? <p className="mt-1 text-sm text-muted">{g.description}</p> : null}
              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered
                  .filter((b) => b.group_id === g.id)
                  .map((b) => (
                    <BusinessCard key={b.id} business={b} />
                  ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
