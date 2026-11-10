import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BookingSearch from "../components/BookingSearch";
import CarCard from "../components/CarCard";
import { IconArrow } from "../components/Icons";
import { ButtonLink, Container, SectionHeading } from "../components/ui";
import { useBooking } from "../hooks/useBooking";
import { cars, cities, featuredCars, images, lowestDaily, popularCars } from "../data/fleet";
import { usePageTitle } from "../hooks/usePageTitle";
import { hasErrors, money, searchToQuery, validateSearch } from "../utils/trip";

const steps = [
  {
    number: "01",
    title: "Set the route",
    text: "Choose pickup and drop-off desks, then the hours you actually need the car.",
  },
  {
    number: "02",
    title: "Compare the fleet",
    text: "Filter by type, brand, price, and transmission. Reserved cars stay visible, marked as such.",
  },
  {
    number: "03",
    title: "Confirm the total",
    text: "Daily, weekly, and monthly rates combine automatically. Extras and tax show before you reserve.",
  },
];

const notes = [
  {
    name: "Maya K.",
    city: "Los Angeles",
    text: "Picked up the M5 at LAX an hour after landing. The confirmation total matched the car page.",
  },
  {
    name: "Andre P.",
    city: "Miami",
    text: "A nine-day trip used the weekly rate, and the leftover days were spelled out in the breakdown.",
  },
  {
    name: "Lena S.",
    city: "Chicago",
    text: "Filtered to automatics under $120 and held the Camry before the ride to O'Hare.",
  },
];

const questions = [
  {
    q: "How is the price calculated?",
    a: "Rentals are billed in 24-hour blocks, rounded up. Seven days use the weekly rate, thirty days use the monthly rate, and leftover days use the daily rate. Optional extras are added per day, then an estimated 9% for taxes and fees.",
  },
  {
    q: "Can I drop the car off somewhere else?",
    a: "Yes. Uncheck “Return to the same location” and choose another desk. One-way trips use the same rates in this demo.",
  },
  {
    q: "Why is a car marked reserved?",
    a: "It stays in the fleet so you can compare the spec and the price, but it cannot be booked until it is back. The car page says when.",
  },
  {
    q: "Who is allowed to drive?",
    a: "The primary driver must be at least 21 and hold a valid license. A second driver can be added on the booking page.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { search, setSearch } = useBooking();
  const [draft, setDraft] = useState(search);
  const [errors, setErrors] = useState({});
  usePageTitle("");

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateSearch(draft);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    setSearch(draft);
    navigate(`/cars?${searchToQuery(draft)}`);
  }

  function cityTo(locationId) {
    const next = {
      ...search,
      pickupLocation: locationId,
      dropoffLocation: search.sameLocation ? locationId : search.dropoffLocation,
      sameLocation: search.sameLocation || search.dropoffLocation === locationId,
    };
    return `/cars?${searchToQuery(next)}`;
  }

  return (
    <>
      <section className="relative flex min-h-[100svh] items-end overflow-hidden">
        <img
          src={images.hero}
          alt="White Chevrolet Camaro lit inside a private garage"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/40 to-ink/85" />
        <Container className="relative z-10 pt-28 pb-12 sm:pb-16">
          <div className="rise max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Rental cars</p>
            <h1 className="mt-4 font-serif text-5xl leading-[1.02] font-medium text-cream sm:text-6xl lg:text-7xl">
              The right car, ready when you are.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/80">
              Pick a city, set your hours, and compare the fleet. Daily, weekly, and monthly rates stay visible through checkout.
            </p>
            <dl className="mt-8 grid max-w-xl grid-cols-3 gap-4 text-cream sm:gap-8">
              <div>
                <dt className="font-serif text-3xl">{money(lowestDaily())}</dt>
                <dd className="text-sm text-cream/70">starting daily rate</dd>
              </div>
              <div>
                <dt className="font-serif text-3xl">{cities.length}</dt>
                <dd className="text-sm text-cream/70">cities with desks</dd>
              </div>
              <div>
                <dt className="font-serif text-3xl">{cars.length}</dt>
                <dd className="text-sm text-cream/70">cars to compare</dd>
              </div>
            </dl>
          </div>
          <div className="rise mt-8" style={{ animationDelay: "120ms" }}>
            <BookingSearch value={draft} onChange={setDraft} onSubmit={handleSubmit} errors={errors} />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Featured"
            title="Flagship cars this week."
            text="A short list for people who already know the kind of drive they want."
          />
          <div className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} trip={search} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-cream py-16 sm:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Popular"
              title="Often booked next."
              text="Sedans, wagons, and the SUV that fits a group."
            />
            <Link to="/cars" className="inline-flex items-center gap-2 text-sm font-bold text-ember">
              See the full fleet
              <IconArrow />
            </Link>
          </div>
          <div className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {popularCars.map((car) => (
              <CarCard key={car.id} car={car} trip={search} />
            ))}
          </div>
        </Container>
      </section>

      <section id="drive" className="scroll-mt-24 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="Three steps, then the keys."
            text="No counter menu. The number you confirm is the number on the reservation."
          />
          <ol className="mt-10 grid items-stretch gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <li key={step.number} className="h-full rounded-[28px] border border-line bg-card p-6">
                <p className="font-serif text-4xl text-ember">{step.number}</p>
                <h3 className="mt-4 font-serif text-2xl font-medium">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="pb-16 sm:pb-20">
        <Container>
          <div className="grid overflow-hidden rounded-[32px] bg-pine lg:grid-cols-2">
            <img
              src={images.highway}
              alt="A van driving toward red rock cliffs"
              className="h-72 w-full object-cover lg:h-full lg:min-h-[420px]"
            />
            <div className="px-6 py-8 sm:px-10 sm:py-12">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">The trip</p>
              <h2 className="mt-3 font-serif text-4xl leading-tight font-medium text-cream sm:text-5xl">
                Airport for the tight connection. Downtown when the day starts later.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-cream/75">
                Desks open from 6:00 to 23:00. Return the car where you picked it up, or send it to another city in the network.
              </p>
              <ButtonLink to="/cars" variant="primary" className="mt-8">
                Find a desk
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <section id="locations" className="scroll-mt-24 bg-cream py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Cities" title="Six cities, twelve desks." text="Start at the airport or closer to where you are staying." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => (
              <Link
                key={city.name}
                to={cityTo(city.locationId)}
                className="flex h-full flex-col rounded-[28px] border border-line bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-ink"
              >
                <h3 className="font-serif text-3xl font-medium">{city.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{city.blurb}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-ember">
                  Cars in {city.name}
                  <IconArrow />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <img
              src={images.drive}
              alt="A driver heading into the city at dusk"
              className="h-80 w-full rounded-[32px] object-cover sm:h-[28rem]"
            />
            <div>
              <SectionHeading eyebrow="Trip notes" title="What people mention after they drop the keys." />
              <div className="mt-8 space-y-4">
                {notes.map((note) => (
                  <figure key={note.name} className="rounded-[28px] border border-line bg-card p-5">
                    <blockquote className="leading-relaxed text-ink">{note.text}</blockquote>
                    <figcaption className="mt-3 text-sm font-semibold text-muted">
                      {note.name}
                      <span className="font-medium"> · {note.city}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="faq" className="scroll-mt-24 bg-cream py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Questions" title="Before you reserve." />
          <div className="mt-8 max-w-3xl">
            {questions.map((item) => (
              <details key={item.q} className="group border-b border-line py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-lg font-semibold text-ink">
                  {item.q}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-lg transition duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pt-3 leading-relaxed text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ink py-16 sm:py-20">
        <Container className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            light
            eyebrow="Ready"
            title="Set the time. Pick the car."
            text="The fleet is small on purpose. Every car on the list can be opened, compared, and reserved when it is free."
          />
          <ButtonLink to="/cars">Browse the fleet</ButtonLink>
        </Container>
      </section>
    </>
  );
}
