import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  Bus,
  Building2,
  ClipboardList,
  CreditCard,
  FileText,
  Gavel,
  Megaphone,
  ShieldAlert,
  Store,
  Umbrella,
  WalletCards,
} from "lucide-react";
import { Container, Eyebrow, Skeleton } from "@/components/ui/primitives";
import { PhoneLink } from "@/components/ui/contact-links";
import { getDepartments, getDocuments, getSiteSettings } from "@/lib/data/queries";
import { toDocumentLinks } from "@/lib/documents";
import { DocumentActions } from "@/components/documents/document-actions";
import { mailtoHref } from "@/lib/format";

const WELCOME_LINKS = [
  { label: "Your Homeowner Manual", href: "/documents#homeowner-manual" },
  { label: "Our Community Guidelines", href: "/rules" },
  { label: "The Latest Offers & Updates", href: "/announcements/may-2025" },
  { label: "Town management contact numbers", href: "/departments" },
  { label: "Commercial index (Shops & Restaurants)", href: "/commercial" },
  { label: "Serenity beach announcement", href: "/serenity" },
];

const SHORTCUTS = [
  { href: "/departments", label: "Departments & Contacts", text: "Call or email the right team", Icon: Building2 },
  { href: "/commercial", label: "Commercial Directory", text: "Shops, cafés and services in town", Icon: Store },
  { href: "/security", label: "Security & Emergency", text: "24/7 numbers and safety guidance", Icon: ShieldAlert },
  { href: "/shuttle", label: "Shuttle Bus", text: "Times to and from Hurghada", Icon: Bus },
  { href: "/serenity", label: "Serenity Beach", text: "Access, discounts and menu", Icon: Umbrella },
  { href: "/membership", label: "Membership & Pricing", text: "2026 prices with 14% VAT", Icon: WalletCards },
  { href: "/banking", label: "Banking & Payments", text: "CIB accounts and IBANs", Icon: CreditCard },
  { href: "/forms", label: "Online Forms", text: "Delegation and move-in permits", Icon: ClipboardList },
  { href: "/rules", label: "Rules & Penalties", text: "Tenant rules and fines", Icon: Gavel },
  { href: "/announcements/may-2025", label: "Announcements", text: "May 2025 community update", Icon: Megaphone },
  { href: "/documents", label: "All Documents", text: "Preview or download originals", Icon: FileText },
];

async function WelcomeHours() {
  const result = await getSiteSettings();
  const hours = result.ok ? result.data.community_hours : null;
  const email = result.ok ? result.data.community_email : null;
  return (
    <p>
      If you have any questions or need assistance, please don’t hesitate to reach out to the community team
      {hours ? <> on a daily basis from {hours}</> : null}
      {email ? (
        <>
          {" "}
          at{" "}
          <a href={mailtoHref(email)} className="font-medium text-brand-dark underline decoration-brand-200 underline-offset-4 hover:decoration-brand-dark">
            {email}
          </a>
        </>
      ) : null}
      .
    </p>
  );
}

async function KeyContacts() {
  const result = await getDepartments();
  if (!result.ok) return null;
  const pick = ["community-management", "security", "maintenance"];
  const departments = pick.map((id) => result.data.find((d) => d.id === id)).filter((d) => d !== undefined);
  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {departments.map((d) => {
        const phone = d.contacts.find((c) => c.kind === "phone");
        return (
          <li key={d.id} className="rounded-2xl border border-line bg-white p-4 shadow-card">
            <p className="text-sm font-medium text-ink">{d.name}</p>
            {d.working_hours ? <p className="text-xs text-subtle">{d.working_hours}</p> : null}
            {phone ? <PhoneLink phone={phone.value} className="mt-2" /> : null}
          </li>
        );
      })}
    </ul>
  );
}

async function FeaturedDocuments() {
  const result = await getDocuments();
  if (!result.ok) return null;
  const ids = ["homeowner-manual", "serenity-menu", "shuttle-schedule"];
  const docs = ids.map((id) => result.data.find((d) => d.id === id)).filter((d) => d !== undefined);
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {docs.map((doc) => (
        <li key={doc.id} className="flex flex-col justify-between gap-5 rounded-2xl border border-line bg-white p-5 shadow-card">
          <div>
            <p className="text-xs font-medium text-subtle">{doc.category}</p>
            <p className="mt-1 font-display text-xl text-ink">{doc.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{doc.description}</p>
          </div>
          <DocumentActions doc={toDocumentLinks(doc)} showPage={false} />
        </li>
      ))}
    </ul>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="border-b border-line bg-brand-50">
        <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
          <div className="animate-fade-up">
            <Eyebrow>Community Portal</Eyebrow>
            <h1 className="mt-3 font-display text-4xl leading-[1.1] text-ink sm:text-5xl lg:text-[3.5rem]">Welcome home to Makadi Heights</h1>
            <div className="mt-6 space-y-4 font-serif text-lg leading-relaxed text-ink/85">
              <p>Dear Valued Homeowners,</p>
              <p>Greetings from the Community Management.</p>
              <p>
                We’re delighted to welcome you to your new home at Makadi Heights. It’s a pleasure to have you as part of our growing community,
                and we’re excited to see you make this space your own.
              </p>
            </div>
          </div>
          <div className="animate-fade-up rounded-3xl border border-line bg-white p-6 shadow-card [animation-delay:120ms] sm:p-7">
            <p className="font-serif text-lg text-ink">In this portal you’ll find:</p>
            <ul className="mt-4 divide-y divide-line">
              {WELCOME_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="group flex items-center justify-between gap-3 py-3 text-[0.9375rem] font-medium text-brand-dark">
                    {item.label}
                    <ArrowRight className="size-4 shrink-0 text-brand transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 border-t border-line pt-5 text-sm leading-relaxed text-muted">
              <p className="mb-3">
                These resources contain helpful information to support a smooth transition into your new home and to help you get familiar
                with the Makadi Heights lifestyle.
              </p>
              <Suspense fallback={<Skeleton className="h-10" />}>
                <WelcomeHours />
              </Suspense>
            </div>
          </div>
        </Container>
      </section>

      <Container className="space-y-16 py-14">
        <section aria-labelledby="explore">
          <h2 id="explore" className="font-display text-2xl text-ink sm:text-3xl">
            Explore the portal
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SHORTCUTS.map(({ href, label, text, Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex h-full items-start gap-3.5 rounded-2xl border border-line bg-white p-4 shadow-card transition-colors hover:border-brand hover:bg-brand-50"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-dark ring-1 ring-brand-200 transition-colors group-hover:bg-white">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block font-medium text-ink">{label}</span>
                    <span className="block text-sm text-muted">{text}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="key-contacts">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 id="key-contacts" className="font-display text-2xl text-ink sm:text-3xl">
              Key contacts
            </h2>
            <Link href="/departments" className="text-sm font-medium text-brand-dark hover:underline">
              All departments →
            </Link>
          </div>
          <Suspense fallback={<div className="grid gap-3 sm:grid-cols-3"><Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" /></div>}>
            <KeyContacts />
          </Suspense>
        </section>

        <section aria-labelledby="featured-docs">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 id="featured-docs" className="font-display text-2xl text-ink sm:text-3xl">
              Popular documents
            </h2>
            <Link href="/documents" className="text-sm font-medium text-brand-dark hover:underline">
              All documents →
            </Link>
          </div>
          <Suspense fallback={<div className="grid gap-4 md:grid-cols-3"><Skeleton className="h-52" /><Skeleton className="h-52" /><Skeleton className="h-52" /></div>}>
            <FeaturedDocuments />
          </Suspense>
        </section>
      </Container>
    </>
  );
}
