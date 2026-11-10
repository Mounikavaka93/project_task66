import { Link, useParams } from "react-router-dom";
import CarCard from "../components/CarCard";
import Gallery from "../components/Gallery";
import { IconCheck, IconStar } from "../components/Icons";
import { ButtonLink, Container } from "../components/ui";
import { getCar, getLocation, getSimilar } from "../data/fleet";
import { usePageTitle } from "../hooks/usePageTitle";
import { useTrip } from "../hooks/useTrip";
import { cx } from "../utils/cx";
import {
  durationLabel,
  formatWhen,
  hasErrors,
  money,
  quoteRental,
  rentalDays,
  searchToQuery,
  validateSearch,
} from "../utils/trip";

export default function CarDetails() {
  const { id } = useParams();
  const car = getCar(id);
  const trip = useTrip();
  usePageTitle(car ? `${car.brand} ${car.name}` : "Car not found");

  if (!car) {
    return (
      <Container className="py-20">
        <h1 className="font-serif text-4xl font-medium">That car is not in the fleet.</h1>
        <ButtonLink to="/cars" className="mt-8">
          Browse the fleet
        </ButtonLink>
      </Container>
    );
  }

  const tripReady = !hasErrors(validateSearch(trip));
  const days = tripReady ? rentalDays(trip.pickupAt, trip.returnAt) : 0;
  const quote = days ? quoteRental(car, days) : null;
  const query = searchToQuery(trip);
  const bookTo = `/book/${car.id}?${query}`;
  const pickup = getLocation(trip.pickupLocation);
  const dropoff = getLocation(trip.dropoffLocation);
  const similar = getSimilar(car);
  const highlight = days >= 30 ? "monthly" : days >= 7 ? "weekly" : days > 0 ? "daily" : "";

  return (
    <div className="pb-20">
      <Container className="pt-8">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <Link to="/" className="hover:text-ink">Home</Link>
          <span aria-hidden="true"> / </span>
          <Link to={`/cars?${query}`} className="hover:text-ink">Fleet</Link>
          <span aria-hidden="true"> / </span>
          <span className="text-ink">{car.name}</span>
        </nav>

        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="order-2 lg:order-1">
            <Gallery images={car.images} name={`${car.brand} ${car.name}`} />
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">{car.brand}</p>
            <h1 className="mt-2 font-serif text-4xl leading-tight font-medium sm:text-5xl">{car.name}</h1>
            <p className="mt-2 text-muted">{car.model}</p>
            <p className="mt-3 inline-flex items-center gap-1 text-sm font-semibold">
              <IconStar className="h-4 w-4 text-ember" />
              {car.rating.toFixed(1)}
              <span className="font-medium text-muted">({car.reviews} trip notes)</span>
            </p>
            <p
              className={cx(
                "mt-4 inline-flex rounded-full px-3 py-1 text-xs font-bold",
                car.available ? "bg-sand text-pine" : "bg-ink text-cream",
              )}
            >
              {car.available ? "Available" : "Reserved"}
            </p>
            {!car.available && car.statusNote ? <p className="mt-2 text-sm text-muted">{car.statusNote}</p> : null}
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">{car.blurb}</p>
            <ul className="mt-4 flex flex-wrap gap-2 text-sm text-ink-soft">
              {[`${car.seats} seats`, car.transmission, car.fuel, car.mileage].map((item) => (
                <li key={item} className="rounded-full bg-sand px-3 py-1">{item}</li>
              ))}
            </ul>

            <div className="mt-6 rounded-[28px] bg-sand p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft">Your trip</p>
              {quote ? (
                <>
                  <p className="mt-2 font-serif text-4xl">{money(quote.subtotal)}</p>
                  <p className="mt-1 text-sm text-muted">{durationLabel(days)} before taxes and extras</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {pickup?.name} · {formatWhen(trip.pickupAt)}
                    <br />
                    {dropoff?.name} · {formatWhen(trip.returnAt)}
                  </p>
                  {quote.savings > 0 ? (
                    <p className="mt-3 text-sm font-bold text-moss">You save {money(quote.savings)} versus the daily rate.</p>
                  ) : null}
                </>
              ) : (
                <p className="mt-2 text-sm text-ink-soft">Add a pickup and return to see a trip total. Daily rate is {money(car.daily)}.</p>
              )}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              {car.available ? (
                <ButtonLink to={bookTo} className="w-full sm:w-auto">
                  Book now
                </ButtonLink>
              ) : (
                <ButtonLink to={`/cars?${query}`} variant="dark" className="w-full sm:w-auto">
                  Choose another car
                </ButtonLink>
              )}
              <p className="self-center text-sm text-muted">From {money(car.daily)} / day</p>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="font-serif text-3xl font-medium">About this car</h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">{car.description}</p>
            <h2 className="mt-10 font-serif text-3xl font-medium">Features</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {car.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm">
                  <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-moss" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-3xl font-medium">Specifications</h2>
            <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[28px] border border-line bg-line">
              {car.specs.map((spec) => (
                <div key={spec.label} className="bg-card px-4 py-3">
                  <dt className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{spec.label}</dt>
                  <dd className="mt-1 text-sm font-semibold">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="font-serif text-3xl font-medium">Rental rates</h2>
          <p className="mt-3 max-w-2xl text-muted">
            A week uses the weekly rate. A month uses the monthly rate. Extra days stay on the daily rate, so a longer trip costs less per day.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <RateCard
              title="Daily"
              amount={car.daily}
              note="Per 24-hour block"
              active={highlight === "daily"}
            />
            <RateCard
              title="Weekly"
              amount={car.weekly}
              note="7 days"
              save={car.daily * 7 - car.weekly}
              active={highlight === "weekly"}
            />
            <RateCard
              title="Monthly"
              amount={car.monthly}
              note="30 days"
              save={car.daily * 30 - car.monthly}
              active={highlight === "monthly"}
            />
          </div>
        </div>

        {similar.length ? (
          <div className="mt-16">
            <h2 className="font-serif text-3xl font-medium">Similar cars</h2>
            <div className="mt-6 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
              {similar.map((item) => (
                <CarCard key={item.id} car={item} trip={tripReady ? trip : null} />
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </div>
  );
}

function RateCard({ title, amount, note, save = 0, active }) {
  return (
    <article className={cx("rounded-[28px] border p-5 transition", active ? "border-ink bg-ink text-cream" : "border-line bg-card text-ink")}>
      <p className={cx("text-xs font-bold uppercase tracking-[0.16em]", active ? "text-gold" : "text-muted")}>{title}</p>
      <p className="mt-3 font-serif text-4xl">{money(amount)}</p>
      <p className={cx("mt-2 text-sm", active ? "text-cream/75" : "text-muted")}>{note}</p>
      {save > 0 ? (
        <p className={cx("mt-3 text-sm font-bold", active ? "text-gold" : "text-moss")}>Save {money(save)} versus daily</p>
      ) : null}
      {active ? <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-gold">Applies to your dates</p> : null}
    </article>
  );
}
