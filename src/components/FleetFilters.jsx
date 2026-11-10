import { brands, cars, carTypes } from "../data/fleet";
import { cx } from "../utils/cx";
import { countActiveFilters, initialFilters, priceTiers } from "../utils/fleetView";
import { Button } from "./ui";

export default function FleetFilters({ filters, setFilters, resultCount, onClose, titleId }) {
  const active = countActiveFilters(filters);

  function toggle(key, value) {
    setFilters((current) => {
      const has = current[key].includes(value);
      return {
        ...current,
        [key]: has ? current[key].filter((item) => item !== value) : [...current[key], value],
      };
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 id={titleId} className="font-serif text-2xl font-medium">Filters</h2>
        {active ? (
          <button
            type="button"
            className="text-sm font-bold text-ember"
            onClick={() => setFilters(initialFilters)}
          >
            Clear
          </button>
        ) : null}
      </div>

      <fieldset className="mt-6">
        <legend className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Car type</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {carTypes.map((type) => {
            const selected = filters.types.includes(type);
            return (
              <button
                key={type}
                type="button"
                aria-pressed={selected}
                onClick={() => toggle("types", type)}
                className={cx(
                  "rounded-full border px-3 py-1.5 text-sm font-semibold transition",
                  selected ? "border-ink bg-ink text-cream" : "border-line bg-white text-ink hover:border-ink",
                )}
              >
                {type}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Brand</legend>
        <div className="mt-3 space-y-2">
          {brands.map((brand) => {
            const count = cars.filter((car) => car.brand === brand).length;
            return (
              <label key={brand} className="flex cursor-pointer items-center justify-between gap-3 text-sm">
                <span className="inline-flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => toggle("brands", brand)}
                    className="h-4 w-4 accent-pine"
                  />
                  {brand}
                </span>
                <span className="text-muted">{count}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Daily price</legend>
        <div className="mt-3 grid gap-2">
          {priceTiers.map((tier) => {
            const selected = filters.priceTier === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilters((current) => ({ ...current, priceTier: tier.id }))}
                className={cx(
                  "rounded-2xl border px-3 py-2 text-left text-sm font-semibold transition",
                  selected ? "border-ink bg-ink text-cream" : "border-line bg-white hover:border-ink",
                )}
              >
                {tier.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Transmission</legend>
        <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="Transmission">
          {[
            ["all", "All"],
            ["Automatic", "Auto"],
            ["Manual", "Manual"],
          ].map(([value, label]) => {
            const selected = filters.transmission === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilters((current) => ({ ...current, transmission: value }))}
                className={cx(
                  "rounded-full border px-2 py-2 text-sm font-semibold transition",
                  selected ? "border-ink bg-ink text-cream" : "border-line bg-white hover:border-ink",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="mt-6 flex cursor-pointer items-center gap-2.5 text-sm font-semibold">
        <input
          type="checkbox"
          checked={filters.availableOnly}
          onChange={(event) => setFilters((current) => ({ ...current, availableOnly: event.target.checked }))}
          className="h-4 w-4 accent-pine"
        />
        Available now
      </label>

      {onClose ? (
        <Button type="button" className="mt-6 w-full" onClick={onClose}>
          Show {resultCount} {resultCount === 1 ? "car" : "cars"}
        </Button>
      ) : null}
    </div>
  );
}
