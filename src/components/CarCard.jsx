import { Link } from "react-router-dom";
import { hasErrors, money, quoteRental, rentalDays, searchToQuery, validateSearch } from "../utils/trip";
import { IconArrow, IconStar } from "./Icons";
import { CarImage } from "./ui";

export default function CarCard({ car, trip }) {
  const tripReady = trip && !hasErrors(validateSearch(trip));
  const days = tripReady ? rentalDays(trip.pickupAt, trip.returnAt) : 0;
  const estimate = days > 0 ? quoteRental(car, days).subtotal : null;
  const to = `/cars/${car.id}${trip ? `?${searchToQuery(trip)}` : ""}`;

  return (
    <Link
      to={to}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-card shadow-[0_18px_50px_-36px_rgba(22,24,29,0.7)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-32px_rgba(22,24,29,0.65)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-sand">
        <CarImage
          src={car.images[0].src}
          alt={car.images[0].alt}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <span
          className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-bold ${
            car.available ? "bg-cream text-pine" : "bg-ink/85 text-cream"
          }`}
        >
          {car.available ? "Available" : "Reserved"}
        </span>
        <span className="absolute top-3 right-3 rounded-full bg-cream/90 px-2.5 py-1 text-xs font-bold text-ink">
          {car.type}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{car.brand}</p>
        <h3 className="mt-1 font-serif text-2xl font-medium text-ink">{car.name}</h3>
        <p className="mt-1 text-sm text-muted">{car.model}</p>
        <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-ink-soft">
          <span>{car.seats} seats</span>
          <span>{car.transmission}</span>
          <span>{car.fuel}</span>
        </p>
        <p className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-ink">
          <IconStar className="h-4 w-4 text-ember" />
          {car.rating.toFixed(1)}
          <span className="font-medium text-muted">({car.reviews})</span>
        </p>
        {!car.available && car.statusNote ? <p className="mt-2 text-sm text-muted">{car.statusNote}</p> : null}
        <div className="mt-5 flex items-end justify-between gap-3 border-t border-line pt-4">
          <div>
            <p className="font-serif text-3xl leading-none text-ink">
              {money(car.daily)}
              <span className="font-sans text-sm font-medium text-muted"> / day</span>
            </p>
            {estimate ? (
              <p className="mt-1 text-xs text-muted">
                {days}-day estimate {money(estimate)}
              </p>
            ) : (
              <p className="mt-1 text-xs text-muted">or {money(car.weekly)} / week</p>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-bold text-ember transition group-hover:gap-2">
            View
            <IconArrow />
          </span>
        </div>
      </div>
    </Link>
  );
}
