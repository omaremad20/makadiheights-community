import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Megaphone } from "lucide-react";
import { Card, Container, PageHeader } from "@/components/ui/primitives";
import { ANNOUNCEMENT_MAY_2025 } from "@/lib/content/announcement-may-2025";

export const metadata: Metadata = { title: "Announcements" };

export default function AnnouncementsPage() {
  return (
    <>
      <PageHeader eyebrow="Community" title="Announcements" description="Updates and answers from Makadi Heights Community Management." />
      <Container className="py-10 sm:py-14">
        <Link href="/announcements/may-2025" className="group block max-w-2xl">
          <Card className="flex items-start gap-4 p-5 transition-colors group-hover:border-brand group-hover:bg-brand-50">
            <Megaphone className="mt-0.5 size-6 shrink-0 text-brand-dark" aria-hidden />
            <span>
              <span className="block text-sm text-muted">{ANNOUNCEMENT_MAY_2025.date}</span>
              <span className="block font-display text-xl text-ink">{ANNOUNCEMENT_MAY_2025.title}</span>
              <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand-dark">
                Read the announcement <ArrowRight className="size-4" aria-hidden />
              </span>
            </span>
          </Card>
        </Link>
      </Container>
    </>
  );
}
