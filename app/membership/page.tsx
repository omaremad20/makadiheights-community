import type { Metadata } from "next";
import { Suspense } from "react";
import { SourceDocuments } from "@/components/documents/source-documents";
import { MembershipSections } from "@/components/membership/membership-sections";
import { Container, PageHeader, Skeleton } from "@/components/ui/primitives";
import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Membership & Pricing",
  description: "2026 Clubhouse and beach membership prices with a calculator that adds 14% VAT.",
};

export default function MembershipPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Membership & Pricing"
        description="Clubhouse memberships for 2026, with or without beach access at Serenity. Calculate your total including 14% VAT."
      >
        <LinkButton href="/serenity" variant="secondary">
          Serenity Beach access
        </LinkButton>
      </PageHeader>
      <Container className="space-y-14 py-10 sm:py-14">
        <Suspense fallback={<Skeleton className="h-[30rem]" />}>
          <MembershipSections />
        </Suspense>
        <Suspense fallback={null}>
          <SourceDocuments ids={["price-beach-clubhouse", "price-clubhouse-only"]} title="Original price lists" />
        </Suspense>
      </Container>
    </>
  );
}
