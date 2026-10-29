import { Check } from "lucide-react";
import type { ContentSection as Section } from "@/lib/data/types";
import { Card, Notice } from "@/components/ui/primitives";

/** Renders an editorial section (title, optional intro, bullet items) from `content_sections`. */
export function ContentSection({ section, ordered = false }: { section: Section; ordered?: boolean }) {
  if (section.tone !== "default") {
    return (
      <Notice tone={section.tone === "warning" ? "warning" : "notice"} title={section.title}>
        {section.intro ? <p>{section.intro}</p> : null}
        {section.items.length > 0 ? (
          <ul className={`space-y-1.5 ${section.intro ? "mt-2" : ""}`}>
            {section.items.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-current opacity-50" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </Notice>
    );
  }

  const List = ordered ? "ol" : "ul";
  return (
    <Card as="section" className="p-5 sm:p-6">
      <h2 className="font-display text-xl text-ink sm:text-2xl">{section.title}</h2>
      {section.intro ? <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{section.intro}</p> : null}
      {section.items.length > 0 ? (
        <List className="mt-4 space-y-2.5">
          {section.items.map((item, i) => (
            <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink/90">
              {ordered ? (
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-semibold text-brand-dark ring-1 ring-brand-200">
                  {i + 1}
                </span>
              ) : (
                <Check className="mt-1 size-4 shrink-0 text-brand-dark" aria-hidden />
              )}
              <span>{item}</span>
            </li>
          ))}
        </List>
      ) : null}
    </Card>
  );
}
