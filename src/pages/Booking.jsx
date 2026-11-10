import { useEffect, useId, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BookingFields } from "../components/BookingSearch";
import { IconCheck } from "../components/Icons";
import { Button, ButtonLink, CarImage, Container, Field } from "../components/ui";
import { useBooking } from "../hooks/useBooking";
import { getCar, getLocation, getSimilar } from "../data/fleet";
import { usePageTitle } from "../hooks/usePageTitle";
import { useTrip } from "../hooks/useTrip";
import { cx } from "../utils/cx";
import { controlClass } from "../utils/styles";
import {
  ADDONS,
  durationLabel,
  formatWhen,
  hasErrors,
  latestBirthdate,
  makeReference,
  money,
  priceTrip,
  rentalDays,
  searchToQuery,
  validateCustomer,
  validateSearch,
} from "../utils/trip";

const emptyCustomer = {
  fullName: "",
  email: "",
  phone: "",
  license: "",
  dob: "",
  notes: "",
  agreed: false,
};

export default function Booking() {
  const { id } = useParams();
  const car = getCar(id);
  const routedTrip = useTrip();
  const { setSearch } = useBooking();
  const [trip, setTrip] = useState(routedTrip);
  const [customer, setCustomer] = useState(emptyCustomer);
  const [addons, setAddons] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [confirmation, setConfirmation] = useState(null);
  const confirmRef = useRef(null);
  const formId = useId();

  usePageTitle(car ? `Book the ${car.name}` : "Car not found");

  const tripErrors = validateSearch(trip);
  const tripReady = !hasErrors(tripErrors);
  const days = tripReady ? rentalDays(trip.pickupAt, trip.returnAt) : 0;
  const quote = car && tripReady ? priceTrip(car, days, addons) : null;
  const customerErrors = submitted ? validateCustomer(customer) : {};

  useEffect(() => {
    if (!attempt) return;
    document.querySelector("[aria-invalid='true']")?.focus();
  }, [attempt]);

  useEffect(() => {
    if (confirmation) confirmRef.current?.focus();
  }, [confirmation]);

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

  if (confirmation) {
    return (
      <Confirmation
        car={car}
        confirmation={confirmation}
        headingRef={confirmRef}
        onEdit={() => setConfirmation(null)}
      />
    );
  }

  function updateCustomer(field, value) {
    setCustomer((current) => ({ ...current, [field]: value }));
  }

  function toggleAddon(addonId) {
    setAddons((current) => (current.includes(addonId) ? current.filter((item) => item !== addonId) : [...current, addonId]));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    const nextCustomer = validateCustomer(customer);
    const nextTrip = validateSearch(trip);
    if (!car.available || hasErrors(nextCustomer) || hasErrors(nextTrip)) {
      setAttempt((value) => value + 1);
      return;
    }
    setSearch(trip);
    setConfirmation({
      reference: makeReference(),
      trip,
      customer: {
        ...customer,
        fullName: customer.fullName.trim().replace(/\s+/g, " "),
        email: customer.email.trim(),
      },
      quote,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const pickup = getLocation(trip.pickupLocation);
  const dropoff = getLocation(trip.dropoffLocation);
  const similar = getSimilar(car, 2);

  return (
    <div className="pb-20">
      <Container className="pt-8">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <Link to="/" className="hover:text-ink">Home</Link>
          <span aria-hidden="true"> / </span>
          <Link to={`/cars/${car.id}?${searchToQuery(trip)}`} className="hover:text-ink">{car.name}</Link>
          <span aria-hidden="true"> / </span>
          <span className="text-ink">Booking</span>
        </nav>
        <h1 className="mt-4 font-serif text-4xl font-medium sm:text-5xl">Confirm your booking.</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted">
          Check the desks and the hours, then add the driver. The total updates as the dates and extras change.
        </p>

        {!car.available ? (
          <p role="status" className="mt-6 rounded-2xl bg-sand px-4 py-3 text-sm text-ink">
            This {car.name} is reserved{car.statusNote ? ` — ${car.statusNote}` : ""}. You can review the price, then choose another car.
          </p>
        ) : null}

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <form noValidate onSubmit={handleSubmit} className="order-2 space-y-8 lg:order-1">
            <section className="rounded-[28px] border border-line bg-card p-5 sm:p-6">
              <h2 className="font-serif text-2xl font-medium">Pickup and drop-off</h2>
              <div className="mt-5">
                <BookingFields value={trip} onChange={setTrip} errors={tripErrors} />
              </div>
            </section>

            <section className="rounded-[28px] border border-line bg-card p-5 sm:p-6">
              <h2 className="font-serif text-2xl font-medium">Driver</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field id={`${formId}-name`} label="Full name" error={customerErrors.fullName}>
                  <input
                    id={`${formId}-name`}
                    name="name"
                    autoComplete="name"
                    value={customer.fullName}
                    aria-invalid={Boolean(customerErrors.fullName) || undefined}
                    aria-describedby={customerErrors.fullName ? `${formId}-name-error` : undefined}
                    onChange={(event) => updateCustomer("fullName", event.target.value)}
                    className={controlClass(Boolean(customerErrors.fullName))}
                  />
                </Field>
                <Field id={`${formId}-email`} label="Email" error={customerErrors.email}>
                  <input
                    id={`${formId}-email`}
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={customer.email}
                    aria-invalid={Boolean(customerErrors.email) || undefined}
                    aria-describedby={customerErrors.email ? `${formId}-email-error` : undefined}
                    onChange={(event) => updateCustomer("email", event.target.value)}
                    className={controlClass(Boolean(customerErrors.email))}
                  />
                </Field>
                <Field id={`${formId}-phone`} label="Phone" error={customerErrors.phone}>
                  <input
                    id={`${formId}-phone`}
                    name="tel"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="(323) 555-0148"
                    value={customer.phone}
                    aria-invalid={Boolean(customerErrors.phone) || undefined}
                    aria-describedby={customerErrors.phone ? `${formId}-phone-error` : undefined}
                    onChange={(event) => updateCustomer("phone", event.target.value)}
                    className={controlClass(Boolean(customerErrors.phone))}
                  />
                </Field>
                <Field id={`${formId}-license`} label="Driver's license" error={customerErrors.license}>
                  <input
                    id={`${formId}-license`}
                    autoComplete="off"
                    spellCheck={false}
                    value={customer.license}
                    aria-invalid={Boolean(customerErrors.license) || undefined}
                    aria-describedby={customerErrors.license ? `${formId}-license-error` : undefined}
                    onChange={(event) => updateCustomer("license", event.target.value)}
                    className={controlClass(Boolean(customerErrors.license))}
                  />
                </Field>
                <Field id={`${formId}-dob`} label="Date of birth" error={customerErrors.dob} hint="Primary driver must be 21 or older.">
                  <input
                    id={`${formId}-dob`}
                    type="date"
                    autoComplete="bday"
                    max={latestBirthdate()}
                    min="1926-01-01"
                    value={customer.dob}
                    aria-invalid={Boolean(customerErrors.dob) || undefined}
                    aria-describedby={customerErrors.dob ? `${formId}-dob-error` : undefined}
                    onChange={(event) => updateCustomer("dob", event.target.value)}
                    className={controlClass(Boolean(customerErrors.dob))}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field id={`${formId}-notes`} label="Notes" error={customerErrors.notes} hint={`${customer.notes.length}/240`}>
                    <textarea
                      id={`${formId}-notes`}
                      rows={4}
                      maxLength={240}
                      value={customer.notes}
                      aria-invalid={Boolean(customerErrors.notes) || undefined}
                      aria-describedby={customerErrors.notes ? `${formId}-notes-error` : undefined}
                      onChange={(event) => updateCustomer("notes", event.target.value)}
                      className={cx(controlClass(Boolean(customerErrors.notes)), "h-auto py-3")}
                    />
                  </Field>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-line bg-card p-5 sm:p-6">
              <h2 className="font-serif text-2xl font-medium">Extras</h2>
              <div className="mt-5 grid gap-3">
                {ADDONS.map((addon) => {
                  const checked = addons.includes(addon.id);
                  return (
                    <label
                      key={addon.id}
                      className={cx(
                        "flex cursor-pointer gap-3 rounded-2xl border p-4 transition",
                        checked ? "border-ink bg-sand" : "border-line bg-white hover:border-ink",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAddon(addon.id)}
                        className="mt-1 h-4 w-4 accent-pine"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline justify-between gap-2 font-semibold">
                          {addon.name}
                          <span>{money(addon.daily)} / day</span>
                        </span>
                        <span className="mt-1 block text-sm text-muted">{addon.detail}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>

            <div>
              <label className="flex items-start gap-3 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={customer.agreed}
                  aria-invalid={Boolean(customerErrors.agreed) || undefined}
                  onChange={(event) => updateCustomer("agreed", event.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-pine"
                />
                I confirm the primary driver is at least 21 and holds a valid license.
              </label>
              {customerErrors.agreed ? <p className="mt-2 text-sm text-ember">{customerErrors.agreed}</p> : null}
            </div>

            <Button type="submit" className="w-full sm:w-auto" disabled={!car.available}>
              Confirm reservation
            </Button>
          </form>

          <aside className="order-1 lg:sticky lg:top-24 lg:order-2">
            <div className="overflow-hidden rounded-[28px] border border-line bg-card">
              <CarImage src={car.images[0].src} alt={car.images[0].alt} className="aspect-[16/9] w-full object-cover" />
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{car.brand}</p>
                <h2 className="mt-1 font-serif text-3xl font-medium">{car.name}</h2>
                <p className="mt-1 text-sm text-muted">
                  {car.transmission} · {car.fuel} · {car.seats} seats
                </p>
                <dl className="mt-5 space-y-3 border-t border-line pt-4 text-sm">
                  <div>
                    <dt className="text-muted">Pickup</dt>
                    <dd className="font-semibold">{pickup ? `${pickup.name}, ${pickup.city}` : "Choose a location"}</dd>
                    <dd className="text-muted">{formatWhen(trip.pickupAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Drop-off</dt>
                    <dd className="font-semibold">{dropoff ? `${dropoff.name}, ${dropoff.city}` : "Choose a location"}</dd>
                    <dd className="text-muted">{formatWhen(trip.returnAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Duration</dt>
                    <dd className="font-semibold">{durationLabel(days)}</dd>
                  </div>
                </dl>

                {quote ? (
                  <div className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
                    {quote.lines.map((line) => (
                      <div key={line.label} className="flex justify-between gap-3">
                        <span>{line.label}</span>
                        <span className="font-semibold">{money(line.amount)}</span>
                      </div>
                    ))}
                    {quote.addons.map((addon) => (
                      <div key={addon.id} className="flex justify-between gap-3">
                        <span>{addon.name}</span>
                        <span className="font-semibold">{money(addon.amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between gap-3">
                      <span>Estimated taxes and fees (9%)</span>
                      <span className="font-semibold">{money(quote.tax)}</span>
                    </div>
                    <div className="flex items-end justify-between gap-3 border-t border-line pt-3">
                      <span className="font-bold">Total</span>
                      <span className="font-serif text-3xl leading-none">{money(quote.total)}</span>
                    </div>
                    {quote.savings > 0 ? (
                      <p className="text-sm font-bold text-moss">You save {money(quote.savings)} versus paying daily.</p>
                    ) : null}
                    <p className="text-xs leading-relaxed text-muted">
                      Billed in 24-hour blocks, rounded up. Weekly and monthly rates replace daily blocks when they apply.
                    </p>
                  </div>
                ) : (
                  <p className="mt-5 border-t border-line pt-4 text-sm text-ember">
                    Fix the pickup and return times to calculate a total.
                  </p>
                )}
              </div>
            </div>
            {!car.available && similar.length ? (
              <p className="mt-4 text-sm text-muted">
                Still free:{" "}
                {similar.map((item, index) => (
                  <span key={item.id}>
                    {index ? ", " : ""}
                    <Link className="font-semibold text-ember" to={`/cars/${item.id}?${searchToQuery(trip)}`}>
                      {item.name}
                    </Link>
                  </span>
                ))}
              </p>
            ) : null}
          </aside>
        </div>
      </Container>
    </div>
  );
}

function Confirmation({ car, confirmation, headingRef, onEdit }) {
  const pickup = getLocation(confirmation.trip.pickupLocation);
  const dropoff = getLocation(confirmation.trip.dropoffLocation);
  const { quote, customer, reference } = confirmation;

  return (
    <Container className="py-10">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[32px] bg-pine text-cream">
        <div className="px-6 py-10 sm:px-10">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-ember">
            <IconCheck className="h-7 w-7" />
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-gold">Reservation held</p>
          <h1 ref={headingRef} tabIndex={-1} className="mt-3 font-serif text-4xl font-medium outline-none sm:text-5xl">
            You are booked, {customer.fullName.split(" ")[0]}.
          </h1>
          <p className="mt-4 max-w-xl text-cream/75">
            Save this reference. This demo does not take payment, and the reservation lives in this browser session only.
          </p>
          <p className="mt-6 font-serif text-5xl tracking-wide">{reference}</p>
        </div>
        <div className="bg-cream px-6 py-8 text-ink sm:px-10">
          <h2 className="font-serif text-2xl font-medium">
            {car.brand} {car.name}
          </h2>
          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted">Pickup</dt>
              <dd className="font-semibold">{pickup ? `${pickup.name}, ${pickup.city}` : "Pickup"}</dd>
              <dd>{formatWhen(confirmation.trip.pickupAt)}</dd>
            </div>
            <div>
              <dt className="text-muted">Drop-off</dt>
              <dd className="font-semibold">{dropoff ? `${dropoff.name}, ${dropoff.city}` : "Drop-off"}</dd>
              <dd>{formatWhen(confirmation.trip.returnAt)}</dd>
            </div>
            <div>
              <dt className="text-muted">Driver</dt>
              <dd className="font-semibold">{customer.fullName}</dd>
              <dd>{customer.email}</dd>
              <dd>{customer.phone}</dd>
            </div>
            <div>
              <dt className="text-muted">Duration and total</dt>
              <dd className="font-semibold">{durationLabel(quote.days)}</dd>
              <dd className="font-serif text-3xl">{money(quote.total)}</dd>
            </div>
          </dl>
          {customer.notes ? <p className="mt-4 text-sm text-muted">Notes: {customer.notes}</p> : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/cars">Back to the fleet</ButtonLink>
            <Button variant="ghost" onClick={onEdit}>
              Edit this booking
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
