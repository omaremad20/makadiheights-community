import type { Metadata } from "next";
import { Suspense } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { SourceDocuments } from "@/components/documents/source-documents";
import { Badge, Card, Container, Notice, PageHeader } from "@/components/ui/primitives";
import { ANNOUNCEMENT_MAY_2025 as A } from "@/lib/content/announcement-may-2025";

export const metadata: Metadata = {
  title: "Community Announcement — May 2025",
  description: "Answers to homeowner questions, the 2025 events calendar and community updates from Makadi Heights Community Management.",
};

function EventsCalendar() {
  return (
    <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {A.events.map((m) => (
        <li key={m.month} className="rounded-2xl border border-line bg-white p-4">
          <p className="font-display text-lg text-brand-dark">{m.month}</p>
          <ul className="mt-2 space-y-2">
            {m.items.map((e) => (
              <li key={e.name} className="text-sm">
                <span className="block font-medium text-ink">{e.name}</span>
                <span className="inline-flex items-center gap-1 text-xs text-muted">
                  <MapPin className="size-3" aria-hidden /> {e.location}
                </span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

export default function AnnouncementPage() {
  return (
    <>
      <PageHeader eyebrow="Community Announcement" title={A.title} description={<span className="inline-flex items-center gap-2"><CalendarDays className="size-4" aria-hidden /> Published {A.date} by Community Management</span>} />
      <Container className="py-10 sm:py-14">
        <div className="mx-auto max-w-3xl space-y-10">
          <Notice title="Published in May 2025">
            This announcement reflects plans and offers as of May 2025. Some dates and offers have since passed — contact Community Management for
            the latest status.
          </Notice>

          <div className="space-y-4 font-serif text-lg leading-relaxed text-ink/90">
            {A.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <section aria-labelledby="qa">
            <h2 id="qa" className="font-display text-2xl text-ink sm:text-3xl">
              Your questions, answered
            </h2>
            <ol className="mt-6 space-y-4">
              {A.questions.map((item, i) => (
                <li key={item.q}>
                  <Card className="p-5 sm:p-6">
                    <div className="flex gap-3">
                      <Badge>Q{i + 1}</Badge>
                      <h3 className="font-medium leading-snug text-ink">{item.q}</h3>
                    </div>
                    <div className="mt-3 space-y-3 text-[0.9375rem] leading-relaxed text-muted">
                      {item.a.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                    {"events" in item && item.events ? <EventsCalendar /> : null}
                    {"fees" in item && item.fees ? (
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl bg-brand-50 p-4">
                          <p className="text-sm font-semibold text-ink">Public service elements</p>
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                            {item.fees.elements.map((e) => (
                              <li key={e}>{e}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-xl bg-brand-50 p-4">
                          <p className="text-sm font-semibold text-ink">Public service calculation base</p>
                          <ul className="mt-2 space-y-2 text-sm text-muted">
                            {item.fees.calculation.map((e) => (
                              <li key={e}>{e}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-2 text-sm text-muted sm:col-span-2">
                          {item.fees.notes.map((n) => (
                            <p key={n}>{n}</p>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </Card>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="news" className="space-y-4">
            <p className="font-serif text-lg leading-relaxed text-ink/90">{A.closing}</p>
            <h2 id="news" className="sr-only">
              More news
            </h2>
            {A.news.map((n) => (
              <Card key={n.title} className="p-5 sm:p-6">
                <h3 className="font-display text-xl text-ink">{n.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{n.body}</p>
              </Card>
            ))}
          </section>

          <div className="space-y-3 font-serif text-lg leading-relaxed text-ink/90">
            {A.signOff.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <Suspense fallback={null}>
            <SourceDocuments ids={[A.documentId]} title="Original announcement" />
          </Suspense>
        </div>
      </Container>
    </>
  );
}
