import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { ExternalLink, MapPin, UtensilsCrossed } from "lucide-react";
import { ContentSection } from "@/components/content/content-section";
import { DocumentActions } from "@/components/documents/document-actions";
import { SourceDocuments } from "@/components/documents/source-documents";
import { MembershipSections } from "@/components/membership/membership-sections";
import { LinkButton } from "@/components/ui/button";
import { Card, Container, ErrorState, Eyebrow, SectionHeading, Skeleton } from "@/components/ui/primitives";
import { getContentSections, getDocuments } from "@/lib/data/queries";
import { findDocument, toDocumentLinks } from "@/lib/documents";

export const metadata: Metadata = {
  title: "Serenity Beach",
  description: "Beach access at Serenity Alpha Hotel, resident discounts, beach rules, the Serenity menu and beach membership prices.",
};

// Google lists the hotel as "SRNTY Sea Reef", the current name of Serenity Alpha Beach, Makadi Bay.
const HOTEL_LOCATION = {
  embedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3555.8529215057847!2d33.91555227510347!3d26.97155657661222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145287e48edf6e4d%3A0x1c578e257cb014ac!2sSRNTY%20Sea%20Reef!5e0!3m2!1sen!2seg!4v1793280041998!5m2!1sen!2seg",
  shareUrl: "https://maps.app.goo.gl/3y6WoAqdFF9LhjBu6",
};

const SECTION_IDS = {
  access: ["serenity-access", "serenity-facilities"],
  discounts: ["serenity-facility-discounts", "serenity-fnb-discounts"],
  rules: ["serenity-rules"],
};

async function BeachAccess() {
  const result = await getContentSections("serenity");
  if (!result.ok) return <ErrorState message={result.message} />;
  const byId = new Map(result.data.map((s) => [s.id, s]));
  const pick = (ids: string[]) => ids.map((id) => byId.get(id)).filter((s) => s !== undefined);
  const intro = byId.get("serenity-intro");

  return (
    <div className="space-y-12">
      {intro ? (
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">{intro.title}</h2>
            {intro.intro ? <p className="mt-4 font-serif text-lg leading-relaxed text-ink/85">{intro.intro}</p> : null}
          </div>
          <Image
            src="/brand/serenity-beach.webp"
            alt="Sunbeds and umbrellas on the beach at Serenity Alpha Hotel"
            width={1476}
            height={672}
            sizes="(min-width: 1024px) 34rem, 100vw"
            className="h-auto w-full rounded-3xl border border-line object-cover shadow-card"
            priority
          />
        </div>
      ) : null}

      <section aria-labelledby="access" className="space-y-5">
        <SectionHeading id="access" title="Access & facilities" />
        <div className="grid gap-5 lg:grid-cols-2">
          {pick(SECTION_IDS.access).map((s) => (
            <ContentSection key={s.id} section={s} />
          ))}
        </div>
      </section>

      <section aria-labelledby="discounts" className="space-y-5">
        <SectionHeading id="discounts" title="Exclusive discounts for residents" description="Present your valid Homeowner Card to enjoy these offers." />
        <div className="grid gap-5 lg:grid-cols-2">
          {pick(SECTION_IDS.discounts).map((s) => (
            <ContentSection key={s.id} section={{ ...s, intro: s.id === "serenity-facility-discounts" ? null : s.intro }} />
          ))}
        </div>
      </section>

      <section aria-label="Beach rules">
        {pick(SECTION_IDS.rules).map((s) => (
          <ContentSection key={s.id} section={s} />
        ))}
      </section>
    </div>
  );
}

async function MenuCard() {
  const result = await getDocuments();
  if (!result.ok) return <ErrorState message={result.message} />;
  const menu = findDocument(result.data, "serenity-menu");
  if (!menu) return null;
  return (
    <Card className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
      <div className="flex gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-dark ring-1 ring-brand-200">
          <UtensilsCrossed className="size-6" aria-hidden />
        </span>
        <div>
          <h2 id="menu-title" className="font-display text-2xl text-ink">
            {menu.title}
          </h2>
          <p className="mt-1 max-w-xl text-[0.9375rem] text-muted">{menu.description}</p>
        </div>
      </div>
      <DocumentActions doc={toDocumentLinks(menu)} size="md" showPage={false} />
    </Card>
  );
}

function HotelLocation() {
  return (
    <section id="location" aria-labelledby="location-title" className="scroll-mt-24">
      <SectionHeading
        id="location-title"
        title="Serenity Hotel Location"
        description="Serenity Alpha Hotel, Makadi Bay. On Google Maps the hotel appears as SRNTY Sea Reef, its current name."
        action={
          <LinkButton href={HOTEL_LOCATION.shareUrl} external variant="secondary">
            <MapPin aria-hidden /> Open in Google Maps <ExternalLink aria-hidden />
          </LinkButton>
        }
      />
      <Card className="overflow-hidden">
        <div className="relative aspect-[4/3] w-full bg-brand-50 sm:aspect-[16/9] lg:aspect-[21/9]">
          <iframe
            src={HOTEL_LOCATION.embedUrl}
            title="Map showing the location of Serenity Alpha Hotel (SRNTY Sea Reef), Makadi Bay"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </Card>
    </section>
  );
}

export default function SerenityPage() {
  return (
    <>
      <header className="border-b border-line bg-brand-50">
        <Container className="py-10 sm:py-14">
          <Eyebrow>Serenity Alpha Hotel</Eyebrow>
          <h1 className="mt-2 font-display text-4xl leading-tight text-ink sm:text-5xl">Serenity Beach</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Beach access, resident discounts, the Serenity menu and beach memberships — everything for the sun, sea and serenity.
          </p>
          <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-2">
            {[
              ["#access", "Access"],
              ["#discounts", "Discounts"],
              ["#menu", "Menu"],
              ["#location", "Location"],
              ["#packages", "Packages"],
              ["#calculator", "Calculator"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-muted hover:border-brand hover:text-brand-dark">
                {label}
              </a>
            ))}
          </nav>
        </Container>
      </header>

      <Container className="space-y-16 py-10 sm:py-14">
        <Suspense fallback={<Skeleton className="h-[36rem]" />}>
          <BeachAccess />
        </Suspense>

        <section id="menu" aria-labelledby="menu-title" className="scroll-mt-24">
          <Suspense fallback={<Skeleton className="h-32" />}>
            <MenuCard />
          </Suspense>
        </section>

        <HotelLocation />

        <Suspense fallback={<Skeleton className="h-[30rem]" />}>
          <MembershipSections
            packageFilter={(p) => p.access === "beach_and_clubhouse"}
            defaultPackageId="beach-clubhouse-2"
            headingLevelTitle="Beach & Clubhouse packages"
            showNotes={false}
            calculatorFirst={false}
          />
        </Suspense>

        <Suspense fallback={null}>
          <SourceDocuments ids={["serenity-beach-access", "price-beach-clubhouse", "price-clubhouse-only"]} />
        </Suspense>
      </Container>
    </>
  );
}
