import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-sm font-semibold tracking-[0.18em] text-brand-dark uppercase">404</p>
      <h1 className="mt-3 font-display text-4xl text-ink">Page not found</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">The page you are looking for does not exist or has moved.</p>
      <div className="mt-8 flex justify-center gap-3">
        <LinkButton href="/">Back to home</LinkButton>
        <LinkButton href="/documents" variant="secondary">
          All documents
        </LinkButton>
      </div>
    </Container>
  );
}
