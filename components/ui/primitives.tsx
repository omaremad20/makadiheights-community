import type { ReactNode } from "react";
import { AlertTriangle, Info, Inbox } from "lucide-react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function Card({ children, className = "", as: Tag = "div", id }: { children: ReactNode; className?: string; as?: "div" | "article" | "section" | "li"; id?: string }) {
  return (
    <Tag id={id} className={`rounded-2xl border border-line bg-white shadow-card ${className}`}>
      {children}
    </Tag>
  );
}

export function Badge({ children, tone = "brand" }: { children: ReactNode; tone?: "brand" | "neutral" | "danger" | "warning" }) {
  const tones = {
    brand: "bg-brand-50 text-brand-dark ring-brand-200",
    neutral: "bg-neutral-50 text-muted ring-line",
    danger: "bg-danger-50 text-danger-700 ring-danger-200",
    warning: "bg-warning-50 text-warning-800 ring-warning-200",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold tracking-[0.18em] text-brand-dark uppercase">{children}</p>;
}

export function PageHeader({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description?: ReactNode; children?: ReactNode }) {
  return (
    <header className="border-b border-line bg-brand-50">
      <Container className="py-10 sm:py-14">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h1 className="mt-2 font-display text-4xl leading-tight text-ink sm:text-5xl">{title}</h1>
        {description ? <div className="mt-3 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{description}</div> : null}
        {children ? <div className="mt-6 flex flex-wrap gap-3">{children}</div> : null}
      </Container>
    </header>
  );
}

export function SectionHeading({ id, title, description, action }: { id?: string; title: string; description?: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 id={id} className="font-display text-2xl text-ink sm:text-3xl">
          {title}
        </h2>
        {description ? <p className="mt-1.5 max-w-2xl text-[0.9375rem] leading-relaxed text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Notice({ title, children, tone = "notice" }: { title?: string; children: ReactNode; tone?: "notice" | "warning" | "danger" }) {
  const tones = {
    notice: { box: "border-brand-200 bg-brand-50", icon: "text-brand-dark", Icon: Info },
    warning: { box: "border-warning-200 bg-warning-50", icon: "text-warning-800", Icon: AlertTriangle },
    danger: { box: "border-danger-200 bg-danger-50", icon: "text-danger-700", Icon: AlertTriangle },
  } as const;
  const t = tones[tone];
  return (
    <div className={`flex gap-3 rounded-xl border p-4 ${t.box}`} role={tone === "notice" ? "note" : "alert"}>
      <t.Icon className={`mt-0.5 size-5 shrink-0 ${t.icon}`} aria-hidden />
      <div className="text-[0.9375rem] leading-relaxed text-ink">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className={title ? "mt-1" : ""}>{children}</div>
      </div>
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line px-6 py-12 text-center">
      <Inbox className="size-8 text-subtle" aria-hidden />
      <p className="mt-3 font-medium text-ink">{title}</p>
      {children ? <div className="mt-1 text-sm text-muted">{children}</div> : null}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <Notice tone="danger" title="Something went wrong">
      {message}
    </Notice>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-brand-100/70 ${className}`} aria-hidden />;
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className="h-44" />
      ))}
    </div>
  );
}
