import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, Phone, Siren } from "lucide-react";
import { ContentSection } from "@/components/content/content-section";
import { SourceDocuments } from "@/components/documents/source-documents";
import { EmailLink } from "@/components/ui/contact-links";
import { Card, Container, ErrorState, PageHeader, Skeleton } from "@/components/ui/primitives";
import { getContentSections, getDepartments, getEmergencyContacts } from "@/lib/data/queries";
import { formatPhone, telHref } from "@/lib/format";

export const metadata: Metadata = {
  title: "Security & Emergency",
  description: "Emergency numbers and security guidance for Makadi Heights residents.",
};

type ResolvedContact = { id: string; service: string; phone: string | null; availability: string | null; isEmergency: boolean };

async function EmergencyNumbers() {
  const [contacts, departments] = await Promise.all([getEmergencyContacts(), getDepartments()]);
  if (!contacts.ok) return <ErrorState message={contacts.message} />;

  // Department rows reuse the department's phone so numbers are maintained in one place.
  const resolved: ResolvedContact[] = contacts.data.map((c) => {
    const dept = c.department_id && departments.ok ? departments.data.find((d) => d.id === c.department_id) : undefined;
    const phone = c.phone ?? dept?.contacts.find((x) => x.kind === "phone")?.value ?? null;
    return { id: c.id, service: c.service, phone, availability: c.availability, isEmergency: c.is_emergency };
  });
  const emergency = resolved.filter((c) => c.isEmergency);
  const other = resolved.filter((c) => !c.isEmergency);

  return (
    <div className="space-y-8">
      <section aria-labelledby="emergency">
        <h2 id="emergency" className="flex items-center gap-2 font-display text-2xl text-ink sm:text-3xl">
          <Siren className="size-6 text-danger-700" aria-hidden /> Emergency numbers
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {emergency.map((c) =>
            c.phone ? (
              <li key={c.id}>
                <a
                  href={telHref(c.phone)}
                  className="group flex h-full items-center justify-between gap-4 rounded-2xl border border-danger-200 bg-danger-50 p-4 transition-colors hover:border-danger-700"
                >
                  <span>
                    <span className="block font-medium text-ink">{c.service}</span>
                    <span className="mt-0.5 block font-display text-2xl text-danger-700 tabular-nums">{formatPhone(c.phone)}</span>
                    {c.availability ? <span className="mt-0.5 block text-xs text-muted">{c.availability}</span> : null}
                  </span>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-danger-700 text-white">
                    <Phone className="size-5" aria-hidden />
                    <span className="sr-only">Call</span>
                  </span>
                </a>
              </li>
            ) : null,
          )}
        </ul>
      </section>

      {other.length > 0 ? (
        <section aria-labelledby="other-contacts">
          <h2 id="other-contacts" className="font-display text-xl text-ink sm:text-2xl">
            Non-emergency contacts
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {other.map((c) =>
              c.phone ? (
                <li key={c.id}>
                  <Card className="flex items-center justify-between gap-4 p-4">
                    <div>
                      <p className="font-medium text-ink">{c.service}</p>
                      {c.availability ? (
                        <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-muted">
                          <Clock className="size-3.5" aria-hidden /> {c.availability}
                        </p>
                      ) : null}
                    </div>
                    <a href={telHref(c.phone)} className="inline-flex items-center gap-2 font-medium text-brand-dark tabular-nums hover:underline">
                      <Phone className="size-4 text-brand" aria-hidden />
                      {formatPhone(c.phone)}
                    </a>
                  </Card>
                </li>
              ) : null,
            )}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

async function Guidance() {
  const [sections, departments] = await Promise.all([getContentSections("security"), getDepartments()]);
  if (!sections.ok) return <ErrorState message={sections.message} />;
  const overview = sections.data.find((s) => s.id === "security-overview");
  const feedback = sections.data.find((s) => s.id === "security-feedback");
  const rest = sections.data.filter((s) => s !== overview && s !== feedback);
  const feedbackEmails = departments.ok
    ? ["security", "community-management"]
        .map((id) => departments.data.find((d) => d.id === id))
        .flatMap((d) => (d ? d.contacts.filter((c) => c.kind === "email").map((c) => ({ dept: d.name, email: c.value })) : []))
    : [];

  return (
    <div className="space-y-6">
      {overview ? (
        <div>
          <h2 className="font-display text-2xl text-ink sm:text-3xl">{overview.title}</h2>
          {overview.intro ? <p className="mt-2 max-w-3xl text-[0.9375rem] leading-relaxed text-muted">{overview.intro}</p> : null}
        </div>
      ) : null}
      <div className="grid gap-5 lg:grid-cols-2">
        {rest.map((s) => (
          <ContentSection key={s.id} section={s} />
        ))}
      </div>
      {feedback ? (
        <Card className="p-5 sm:p-6">
          <h2 className="font-display text-xl text-ink">{feedback.title}</h2>
          {feedback.intro ? <p className="mt-1.5 text-[0.9375rem] text-muted">{feedback.intro}</p> : null}
          <ul className="mt-3 space-y-2">
            {feedbackEmails.map((f) => (
              <li key={f.email} className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
                <span className="text-sm text-muted sm:w-48">{f.dept}</span>
                <EmailLink email={f.email} />
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}

export default function SecurityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Your safety is our priority"
        title="Security & Emergency"
        description="Save these numbers. In an emergency, contact the security team for immediate assistance while reaching out to emergency services."
      />
      <Container className="space-y-14 py-10 sm:py-14">
        <Suspense fallback={<Skeleton className="h-56" />}>
          <EmergencyNumbers />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-96" />}>
          <Guidance />
        </Suspense>
        <Suspense fallback={null}>
          <SourceDocuments ids={["security-awareness"]} />
        </Suspense>
      </Container>
    </>
  );
}
