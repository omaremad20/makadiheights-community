import { Check, Clock, Mail, Phone } from "lucide-react";
import type { Department } from "@/lib/data/types";
import { mailtoHref, telHref } from "@/lib/format";
import { buttonClasses } from "@/components/ui/button";
import { Badge, Card } from "@/components/ui/primitives";
import { EmailLink, PhoneLink } from "@/components/ui/contact-links";

export function DepartmentCard({ department }: { department: Department }) {
  const phones = department.contacts.filter((c) => c.kind === "phone");
  const emails = department.contacts.filter((c) => c.kind === "email");
  const primaryPhone = phones[0];
  const primaryEmail = emails[0];
  const isEmergency = department.id === "security";

  return (
    <Card as="article" id={department.id} className="flex scroll-mt-24 flex-col p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="font-display text-xl text-ink sm:text-2xl">{department.name}</h2>
        {isEmergency ? <Badge tone="danger">24/7 emergency</Badge> : null}
      </div>
      {department.summary ? <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{department.summary}</p> : null}

      <div className="mt-4 space-y-2">
        {phones.map((p) => (
          <div key={p.id}>
            <PhoneLink phone={p.value} label={p.label} />
          </div>
        ))}
        {emails.map((e) => (
          <div key={e.id} className="min-w-0">
            <EmailLink email={e.value} />
          </div>
        ))}
        {department.working_hours ? (
          <p className="inline-flex items-center gap-2 text-sm text-muted">
            <Clock className="size-4 text-brand" aria-hidden /> {department.working_hours}
          </p>
        ) : null}
      </div>

      {department.responsibilities.length > 0 ? (
        <details className="group mt-5 rounded-xl border border-line bg-brand-50/60 open:bg-white">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-xl px-4 py-3 text-sm font-medium text-brand-dark [&::-webkit-details-marker]:hidden">
            Responsibilities &amp; services
            <span className="text-xs text-subtle group-open:hidden">Show</span>
            <span className="hidden text-xs text-subtle group-open:inline">Hide</span>
          </summary>
          <ul className="space-y-2 px-4 pb-4">
            {department.responsibilities.map((r) => (
              <li key={r} className="flex gap-2.5 text-sm leading-relaxed text-ink/85">
                <Check className="mt-0.5 size-4 shrink-0 text-brand-dark" aria-hidden />
                {r}
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      {department.notes ? <p className="mt-4 text-sm leading-relaxed text-muted">{department.notes}</p> : null}

      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        {primaryPhone ? (
          <a href={telHref(primaryPhone.value)} className={buttonClasses({ size: "sm", variant: isEmergency ? "primary" : "secondary" })}>
            <Phone aria-hidden /> Call
          </a>
        ) : null}
        {primaryEmail ? (
          <a href={mailtoHref(primaryEmail.value)} className={buttonClasses({ size: "sm", variant: "secondary" })}>
            <Mail aria-hidden /> Email
          </a>
        ) : null}
      </div>
    </Card>
  );
}
