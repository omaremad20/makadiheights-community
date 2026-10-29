import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { ContentSection } from "@/components/content/content-section";
import { SourceDocuments } from "@/components/documents/source-documents";
import { Badge, Card, Container, EmptyState, ErrorState, PageHeader, Skeleton } from "@/components/ui/primitives";
import { getContentSections, getShuttleRoutes } from "@/lib/data/queries";
import type { ShuttleRoute } from "@/lib/data/types";

export const metadata: Metadata = {
  title: "Shuttle Bus Schedule",
  description: "Shuttle bus times between Makadi Heights and Hurghada (winter update), including the Friday adjustment.",
};

const TITLES: Record<ShuttleRoute["direction"], { from: string; to: string }> = {
  makadi_to_hurghada: { from: "Makadi", to: "Hurghada" },
  hurghada_to_makadi: { from: "Hurghada", to: "Makadi" },
};

function RouteTable({ route }: { route: ShuttleRoute }) {
  const t = TITLES[route.direction];
  const headingId = `route-${route.direction}`;
  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="flex items-center gap-3 font-display text-2xl text-ink sm:text-3xl">
        From {t.from} <ArrowRight className="size-5 text-brand" aria-label="to" /> {t.to}
      </h2>

      {/* Desktop / tablet: the timetable as in the source */}
      <Card className="mt-5 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[44rem] border-collapse text-left text-[0.9375rem]">
          <caption className="sr-only">
            Shuttle departures from {t.from} to {t.to}. A dash means the trip does not stop there.
          </caption>
          <thead>
            <tr className="border-b border-line bg-brand-50">
              <th scope="col" className="w-16 px-4 py-3 text-xs font-semibold text-subtle uppercase">
                <span className="sr-only">Period</span>
              </th>
              {route.stops.map((s) => (
                <th key={s.id} scope="col" className="px-4 py-3 align-bottom">
                  <span className="block font-semibold text-ink">{s.name}</span>
                  {s.detail ? <span className="block text-xs font-normal text-muted">{s.detail}</span> : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {route.trips.map((trip) => (
              <tr key={trip.id} className="border-b border-line last:border-0">
                <th scope="row" className="px-4 py-3">
                  <Badge tone={trip.period === "AM" ? "brand" : "neutral"}>{trip.period}</Badge>
                </th>
                {route.stops.map((s) => (
                  <td key={s.id} className="px-4 py-3 tabular-nums">
                    {trip.times[s.id] ? (
                      <span className="font-medium text-ink">{trip.times[s.id]}</span>
                    ) : (
                      <span className="text-subtle" aria-label="No stop">
                        —
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Mobile: one card per trip */}
      <ol className="mt-5 space-y-3 md:hidden">
        {route.trips.map((trip) => {
          const served = route.stops.filter((s) => trip.times[s.id]);
          const first = served[0];
          const last = served[served.length - 1];
          return (
            <li key={trip.id}>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-ink tabular-nums">
                    {first ? trip.times[first.id] : ""} → {last ? trip.times[last.id] : ""}{" "}
                    <span className="text-sm text-muted">{trip.period}</span>
                  </p>
                  <Badge tone={trip.period === "AM" ? "brand" : "neutral"}>{trip.period}</Badge>
                </div>
                <ol className="mt-3 space-y-1.5 border-l-2 border-brand-200 pl-4">
                  {served.map((s) => (
                    <li key={s.id} className="flex justify-between gap-3 text-sm">
                      <span className="text-muted">
                        {s.name}
                        {s.detail ? <span className="text-subtle"> · {s.detail}</span> : null}
                      </span>
                      <span className="font-medium text-ink tabular-nums">{trip.times[s.id]}</span>
                    </li>
                  ))}
                </ol>
              </Card>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

async function Schedule() {
  const [routes, notes] = await Promise.all([getShuttleRoutes(), getContentSections("shuttle")]);
  if (!routes.ok) return <ErrorState message={routes.message} />;
  if (routes.data.every((r) => r.trips.length === 0)) return <EmptyState title="No shuttle times published yet" />;
  return (
    <div className="space-y-12">
      {notes.ok ? notes.data.map((s) => <ContentSection key={s.id} section={s} />) : null}
      {routes.data.map((r) => (
        <RouteTable key={r.direction} route={r} />
      ))}
    </div>
  );
}

export default function ShuttlePage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Shuttle Bus Schedule"
        description="Winter timetable between Makadi Heights and Hurghada. Times are shown exactly as published; a dash means the trip does not stop there."
      />
      <Container className="space-y-12 py-10 sm:py-14">
        <Suspense fallback={<Skeleton className="h-96" />}>
          <Schedule />
        </Suspense>
        <Suspense fallback={null}>
          <SourceDocuments ids={["shuttle-schedule"]} />
        </Suspense>
      </Container>
    </>
  );
}
