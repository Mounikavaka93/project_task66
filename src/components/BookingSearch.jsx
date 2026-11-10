import { useId } from "react";
import { locationGroups } from "../data/fleet";
import { cx } from "../utils/cx";
import { controlClass } from "../utils/styles";
import { durationLabel, hasErrors, rentalDays, toDateTimeLocal, validateSearch } from "../utils/trip";
import { IconChevron } from "./Icons";
import { Button, Field } from "./ui";

const earliestPickup = toDateTimeLocal(new Date());

function LocationSelect({ id, value, invalid, disabled, onChange }) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={cx(controlClass(invalid), "appearance-none pr-10", disabled && "bg-sand text-muted")}
      >
        {locationGroups().map(([city, places]) => (
          <optgroup key={city} label={city}>
            {places.map((place) => (
              <option key={place.id} value={place.id}>
                {place.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <IconChevron className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted" />
    </div>
  );
}

export function BookingFields({ value, onChange, errors = {} }) {
  const baseId = useId();
  const pickupId = `${baseId}-pickup`;
  const dropoffId = `${baseId}-dropoff`;
  const fromId = `${baseId}-from`;
  const toId = `${baseId}-to`;
  const sameId = `${baseId}-same`;
  const valid = !hasErrors(validateSearch(value));
  const days = valid ? rentalDays(value.pickupAt, value.returnAt) : 0;

  function update(field, fieldValue) {
    const next = { ...value, [field]: fieldValue };
    if (field === "sameLocation") {
      next.sameLocation = Boolean(fieldValue);
      if (fieldValue) next.dropoffLocation = next.pickupLocation;
    }
    if (field === "pickupLocation" && next.sameLocation) {
      next.dropoffLocation = fieldValue;
    }
    if (field === "pickupAt" && next.returnAt && new Date(next.returnAt) <= new Date(fieldValue)) {
      const adjusted = new Date(fieldValue);
      if (!Number.isNaN(adjusted.getTime())) {
        adjusted.setDate(adjusted.getDate() + 1);
        next.returnAt = toDateTimeLocal(adjusted);
      }
    }
    onChange(next);
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field id={pickupId} label="Pickup location" error={errors.pickupLocation}>
        <LocationSelect
          id={pickupId}
          value={value.pickupLocation}
          invalid={Boolean(errors.pickupLocation)}
          onChange={(next) => update("pickupLocation", next)}
        />
      </Field>
      <Field id={dropoffId} label="Drop-off location" error={errors.dropoffLocation}>
        <LocationSelect
          id={dropoffId}
          value={value.dropoffLocation}
          invalid={Boolean(errors.dropoffLocation)}
          disabled={value.sameLocation}
          onChange={(next) => update("dropoffLocation", next)}
        />
      </Field>
      <Field id={fromId} label="Pickup date and time" error={errors.pickupAt}>
        <input
          id={fromId}
          type="datetime-local"
          value={value.pickupAt}
          min={earliestPickup}
          aria-invalid={Boolean(errors.pickupAt) || undefined}
          aria-describedby={errors.pickupAt ? `${fromId}-error` : undefined}
          onChange={(event) => update("pickupAt", event.target.value)}
          className={controlClass(Boolean(errors.pickupAt))}
        />
      </Field>
      <Field id={toId} label="Return date and time" error={errors.returnAt} hint={days ? durationLabel(days) : undefined}>
        <input
          id={toId}
          type="datetime-local"
          value={value.returnAt}
          min={value.pickupAt || undefined}
          aria-invalid={Boolean(errors.returnAt) || undefined}
          aria-describedby={errors.returnAt ? `${toId}-error` : undefined}
          onChange={(event) => update("returnAt", event.target.value)}
          className={controlClass(Boolean(errors.returnAt))}
        />
      </Field>
      <label htmlFor={sameId} className="flex items-center gap-3 text-sm font-semibold text-ink sm:col-span-2">
        <input
          id={sameId}
          type="checkbox"
          checked={value.sameLocation}
          onChange={(event) => update("sameLocation", event.target.checked)}
          className="h-4 w-4 accent-pine"
        />
        Return to the same location
      </label>
    </div>
  );
}

export default function BookingSearch({ value, onChange, onSubmit, errors, submitLabel = "Search cars" }) {
  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="rounded-[28px] border border-white/40 bg-cream p-4 shadow-[0_30px_80px_-36px_rgba(0,0,0,0.65)] sm:p-6"
    >
      <BookingFields value={value} onChange={onChange} errors={errors} />
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">You will see the full total before you confirm.</p>
        <Button type="submit" className="w-full sm:w-auto">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
