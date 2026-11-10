import { ButtonLink, Container } from "../components/ui";
import { usePageTitle } from "../hooks/usePageTitle";

export default function NotFound() {
  usePageTitle("Page not found");

  return (
    <Container className="py-24">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-ember">404</p>
      <h1 className="mt-3 max-w-xl font-serif text-5xl leading-tight font-medium">That page has left the garage.</h1>
      <p className="mt-4 max-w-md text-lg text-muted">The link may be old. The fleet is still parked and ready to compare.</p>
      <ButtonLink to="/" className="mt-8">
        Back home
      </ButtonLink>
    </Container>
  );
}
