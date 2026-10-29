"use client";

import { RotateCcw } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container className="py-24 text-center">
      <p className="text-sm font-semibold tracking-[0.18em] text-brand-dark uppercase">Something went wrong</p>
      <h1 className="mt-3 font-display text-4xl text-ink">This page could not be loaded</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">Please try again. If the problem continues, contact Community Management.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Button onClick={reset}>
          <RotateCcw aria-hidden /> Try again
        </Button>
        <LinkButton href="/" variant="secondary">
          Back to home
        </LinkButton>
      </div>
    </Container>
  );
}
