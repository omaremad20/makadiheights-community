import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardList, KeyRound } from "lucide-react";
import { Card, Container, PageHeader } from "@/components/ui/primitives";
import { DELEGATION_FORM, TENANT_FORM } from "@/lib/forms/definitions";

export const metadata: Metadata = {
  title: "Online Forms",
  description: "Fill in the Makadi Heights delegation and move-in permit forms online and download them as PDF.",
};

const ITEMS = [
  { href: "/forms/delegation", def: DELEGATION_FORM, Icon: KeyRound },
  { href: "/forms/tenant", def: TENANT_FORM, Icon: ClipboardList },
];

export default function FormsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Paperwork"
        title="Online Forms"
        description="Fill in a form, preview it and download a completed PDF to print, sign and email. Your answers stay on your device — nothing is submitted or stored."
      />
      <Container className="py-10 sm:py-14">
        <ul className="grid gap-5 md:grid-cols-2">
          {ITEMS.map(({ href, def, Icon }) => (
            <li key={href}>
              <Link href={href} className="group block h-full">
                <Card className="flex h-full flex-col p-6 transition-colors group-hover:border-brand group-hover:bg-brand-50">
                  <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-dark ring-1 ring-brand-200 group-hover:bg-white">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <p className="mt-4 text-sm text-muted">{def.subtitle}</p>
                  <h2 className="font-display text-2xl text-ink">{def.title}</h2>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{def.description}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-brand-dark">
                    Fill in online <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
