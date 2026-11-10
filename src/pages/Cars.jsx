import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookingSearch from "../components/BookingSearch";
import CarCard from "../components/CarCard";
import FleetFilters from "../components/FleetFilters";
import { IconChevron, IconSearch } from "../components/Icons";
import { Button, Container } from "../components/ui";
import { useBooking } from "../hooks/useBooking";
import { cars, getLocation } from "../data/fleet";
import { usePageTitle } from "../hooks/usePageTitle";
import { useTrip } from "../hooks/useTrip";
import { cx } from "../utils/cx";
import { countActiveFilters, filterCars, initialFilters, sortOptions } from "../utils/fleetView";
import { controlClass } from "../utils/styles";
import { durationLabel, formatWhen, hasErrors, rentalDays, searchToQuery, validateSearch } from "../utils/trip";

export default function Cars() {
  const trip = useTrip();
  const navigate = useNavigate();
  const { setSearch } = useBooking();
  const tripErrors = validateSearch(trip);
  const tripReady = !hasErrors(tripErrors);
  const [editing, setEditing] = useState(!tripReady);
  const [draft, setDraft] = useState(trip);
  const [errors, setErrors] = useState({});
  const [filters, setFilters] = useState(initialFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const closeRef = useRef(null);
  usePageTitle("Fleet");

  const visible = useMemo(() => filterCars(cars, filters), [filters]);
  const active = countActiveFilters(filters);
  const pickup = getLocation(trip.pickupLocation);
  const dropoff = getLocation(trip.dropoffLocation);
  const days = tripReady ? rentalDays(trip.pickupAt, trip.returnAt) : 0;

  useEffect(() => {
    if (!filtersOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [filtersOpen]);

  function openEditor() {
    setDraft(trip);
    setErrors({});
    setEditing(true);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateSearch(draft);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    setSearch(draft);
    setEditing(false);
    navigate(`/cars?${searchToQuery(draft)}`);
  }

  return (
    <div className="pb-20">
      <Container className="pt-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ember">Fleet</p>
        <h1 className="mt-3 max-w-2xl font-serif text-4xl leading-tight font-medium sm:text-5xl">Find a car for this trip.</h1>

        <div className="mt-6 rounded-[28px] border border-line bg-card p-4 sm:p-5">
          {editing ? (
            <BookingSearch
              value={draft}
              onChange={setDraft}
              onSubmit={handleSubmit}
              errors={errors}
              submitLabel="Update trip"
            />
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-ink">
                  {pickup ? pickup.name : "Pickup"} → {dropoff ? dropoff.name : "Drop-off"}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {formatWhen(trip.pickupAt)} – {formatWhen(trip.returnAt)}
                  {days ? ` · ${durationLabel(days)}` : ""}
                </p>
              </div>
              <Button variant="ghost" onClick={openEditor}>
                Edit trip
              </Button>
            </div>
          )}
        </div>

        <div className="mt-8 lg:grid lg:grid-cols-[280px_1fr] lg:items-start lg:gap-8">
          <aside className="sticky top-24 hidden lg:block">
            <div className="rounded-[28px] border border-line bg-card p-5">
              <FleetFilters filters={filters} setFilters={setFilters} resultCount={visible.length} />
            </div>
          </aside>

          <div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <IconSearch className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-muted" />
                <label htmlFor="fleet-search" className="sr-only">
                  Search cars
                </label>
                <input
                  id="fleet-search"
                  type="search"
                  value={filters.query}
                  onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
                  placeholder="Search make, model, or type"
                  className={cx(controlClass(false), "pl-11")}
                />
              </div>
              <div className="relative sm:w-56">
                <label htmlFor="fleet-sort" className="sr-only">
                  Sort cars
                </label>
                <select
                  id="fleet-sort"
                  value={filters.sort}
                  onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}
                  className={cx(controlClass(false), "appearance-none pr-10")}
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <IconChevron className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted" />
              </div>
              <button
                type="button"
                className="h-12 rounded-full border border-line bg-white px-5 text-sm font-bold lg:hidden"
                onClick={() => setFiltersOpen(true)}
              >
                Filters{active ? ` (${active})` : ""}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-ink" aria-live="polite">
                {visible.length} {visible.length === 1 ? "car" : "cars"}
              </p>
              {filters.types.map((type) => (
                <FilterChip key={type} label={type} onRemove={() => setFilters((current) => ({ ...current, types: current.types.filter((item) => item !== type) }))} />
              ))}
              {filters.brands.map((brand) => (
                <FilterChip key={brand} label={brand} onRemove={() => setFilters((current) => ({ ...current, brands: current.brands.filter((item) => item !== brand) }))} />
              ))}
              {filters.priceTier !== "any" ? (
                <FilterChip
                  label={filters.priceTier === "value" ? "Under $120" : filters.priceTier === "mid" ? "$120 – $199" : "$200 and up"}
                  onRemove={() => setFilters((current) => ({ ...current, priceTier: "any" }))}
                />
              ) : null}
              {filters.transmission !== "all" ? (
                <FilterChip
                  label={filters.transmission}
                  onRemove={() => setFilters((current) => ({ ...current, transmission: "all" }))}
                />
              ) : null}
              {filters.availableOnly ? (
                <FilterChip label="Available now" onRemove={() => setFilters((current) => ({ ...current, availableOnly: false }))} />
              ) : null}
              {active ? (
                <button type="button" className="text-sm font-bold text-ember" onClick={() => setFilters(initialFilters)}>
                  Clear all
                </button>
              ) : null}
            </div>

            {visible.length ? (
              <div className="mt-6 grid items-stretch gap-6 sm:grid-cols-2">
                {visible.map((car) => (
                  <CarCard key={car.id} car={car} trip={tripReady ? trip : null} />
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-[28px] border border-dashed border-line bg-cream px-6 py-16 text-center">
                <h2 className="font-serif text-3xl font-medium">No cars match.</h2>
                <p className="mx-auto mt-2 max-w-md text-muted">
                  {filters.query.trim()
                    ? `Nothing in the fleet matches “${filters.query.trim()}”. Try another word or clear the filters.`
                    : "Widen the price, change the type, or show reserved cars too."}
                </p>
                <Button className="mt-6" onClick={() => setFilters(initialFilters)}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>

      {filtersOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button type="button" className="absolute inset-0 bg-ink/50" aria-label="Close filters" onClick={() => setFiltersOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-title"
            className="absolute inset-y-0 right-0 w-[min(100%,400px)] overflow-y-auto bg-cream p-5 shadow-2xl"
          >
            <button ref={closeRef} type="button" className="mb-4 text-sm font-bold text-ink" onClick={() => setFiltersOpen(false)}>
              Close
            </button>
            <FleetFilters
              filters={filters}
              setFilters={setFilters}
              resultCount={visible.length}
              onClose={() => setFiltersOpen(false)}
              titleId="filter-title"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="rounded-full bg-sand px-3 py-1 text-xs font-bold text-ink"
    >
      {label} ×
    </button>
  );
}
