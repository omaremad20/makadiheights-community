import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Clock, Globe, Mail, Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/data/queries";
import { mailtoHref, telHref } from "@/lib/format";
import { NAV_GROUPS } from "@/lib/navigation";
import { Container } from "@/components/ui/primitives";

async function FooterContact() {
  const result = await getSiteSettings();
  if (!result.ok) return null;
  const s = result.data;
  return (
    <ul className="space-y-3 text-sm">
      {s.community_email ? (
        <li>
          <a href={mailtoHref(s.community_email)} className="inline-flex items-center gap-2 font-medium text-brand-dark hover:underline">
            <Mail className="size-4 text-brand" aria-hidden />
            {s.community_email}
          </a>
        </li>
      ) : null}
      {s.community_hours ? (
        <li className="inline-flex items-center gap-2 text-muted">
          <Clock className="size-4 text-brand" aria-hidden />
          Community team, daily {s.community_hours}
        </li>
      ) : null}
      {s.hotline ? (
        <li>
          <a href={telHref(s.hotline)} className="inline-flex items-center gap-2 text-muted hover:text-brand-dark">
            <Phone className="size-4 text-brand" aria-hidden />
            Hotline {s.hotline}
          </a>
        </li>
      ) : null}
      {s.website ? (
        <li>
          <a href={s.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted hover:text-brand-dark">
            <Globe className="size-4 text-brand" aria-hidden />
            {s.website.replace(/^https?:\/\//, "")}
          </a>
        </li>
      ) : null}
    </ul>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-brand-50">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.3fr_2fr]">
        <div>
          <Image src="/brand/makadi-heights-wordmark.png" alt="Makadi Heights by Orascom Development" width={1040} height={212} className="h-9 w-auto" />
          <p className="mt-4 max-w-sm font-serif text-lg leading-snug text-ink">Community Portal — everything you need for life at Makadi Heights.</p>
          <div className="mt-5">
            <Suspense fallback={<div className="h-24" aria-hidden />}>
              <FooterContact />
            </Suspense>
          </div>
        </div>
        <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-3">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="text-xs font-semibold tracking-[0.18em] text-subtle uppercase">{group.label}</p>
              <ul className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-muted hover:text-brand-dark">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </Container>
      <div className="border-t border-line">
        <Container className="flex flex-col gap-2 py-5 text-xs text-subtle sm:flex-row sm:justify-between">
          <p>© Makadi Heights by Orascom Development. Information provided by Community Management.</p>
          <p>Read-only information portal — no personal data is collected.</p>
        </Container>
      </div>
    </footer>
  );
}
