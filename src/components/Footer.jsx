import { Link } from "react-router-dom";
import { Container } from "./ui";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-pine-deep text-cream">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-3xl">Halcyon</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/70">
            Rental cars with the total written down before you confirm. Airport and downtown desks in six cities.
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link className="hover:text-gold" to="/cars">Fleet</Link></li>
            <li><Link className="hover:text-gold" to="/#drive">How it works</Link></li>
            <li><Link className="hover:text-gold" to="/#locations">Cities</Link></li>
            <li><Link className="hover:text-gold" to="/#faq">Questions</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Desks</p>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li>Los Angeles</li>
            <li>San Diego</li>
            <li>San Francisco</li>
            <li>Miami</li>
            <li>New York</li>
            <li>Chicago</li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Visit</p>
          <p className="mt-4 text-sm leading-relaxed text-cream/80">
            Desks open 6:00–23:00 local time.
            <br />
            Roadside help is staffed all night.
          </p>
          <p className="mt-3 text-sm text-cream">
            <a className="hover:text-gold" href="tel:+13235550148">(323) 555-0148</a>
          </p>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-5 text-sm text-cream/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Halcyon</p>
          <p>Demo booking experience. No payment is taken.</p>
        </Container>
      </div>
    </footer>
  );
}
