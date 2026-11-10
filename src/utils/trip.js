import { getLocation } from "../data/fleet";

export const ADDONS = [
  {
    id: "protection",
    name: "Premium protection",
    detail: "Lowers the damage deductible if the car comes back marked.",
    daily: 24,
  },
  {
    id: "driver",
    name: "Additional driver",
    detail: "Puts a second licensed driver on the agreement.",
    daily: 12,
  },
  {
    id: "seat",
    name: "Child seat",
    detail: "Fitted at pickup. Mention the size in your notes.",
    daily: 8,
  },
];

export const TAX_RATE = 0.09;

function pad(value) {
  return String(value).padStart(2, "0");
}

export function toDateTimeLocal(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function toDateInput(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function defaultSearch() {
  const pickup = new Date();
  pickup.setDate(pickup.getDate() + 2);
  pickup.setHours(10, 0, 0, 0);
  const dropoff = new Date(pickup);
  dropoff.setDate(dropoff.getDate() + 3);
  return {
    pickupLocation: "lax",
    dropoffLocation: "lax",
    pickupAt: toDateTimeLocal(pickup),
    returnAt: toDateTimeLocal(dropoff),
    sameLocation: true,
  };
}

export function latestBirthdate() {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 21);
  return toDateInput(date);
}

export function hasErrors(errors) {
  return Object.values(errors).some(Boolean);
}

export function validateSearch(search) {
  const errors = {};
  if (!getLocation(search.pickupLocation)) {
    errors.pickupLocation = "Choose a pickup location.";
  }
  if (!getLocation(search.dropoffLocation)) {
    errors.dropoffLocation = "Choose a drop-off location.";
  }

  const pickup = new Date(search.pickupAt);
  const dropoff = new Date(search.returnAt);
  const pickupValid = Boolean(search.pickupAt) && !Number.isNaN(pickup.getTime());
  const dropoffValid = Boolean(search.returnAt) && !Number.isNaN(dropoff.getTime());

  if (!search.pickupAt) errors.pickupAt = "Choose a pickup date and time.";
  else if (!pickupValid) errors.pickupAt = "Enter a valid pickup date and time.";

  if (!search.returnAt) errors.returnAt = "Choose a return date and time.";
  else if (!dropoffValid) errors.returnAt = "Enter a valid return date and time.";

  if (pickupValid) {
    const earliest = new Date();
    earliest.setMinutes(earliest.getMinutes() - 5);
    if (pickup < earliest) errors.pickupAt = "Pickup has to be in the future.";
  }

  if (pickupValid && dropoffValid && dropoff <= pickup) {
    errors.returnAt = "Return has to be after pickup.";
  }

  return errors;
}

export function searchToQuery(search) {
  const params = new URLSearchParams();
  params.set("pickup", search.pickupLocation);
  params.set("dropoff", search.dropoffLocation);
  params.set("from", search.pickupAt);
  params.set("to", search.returnAt);
  return params.toString();
}

export function searchFromQuery(params) {
  const pickupLocation = params.get("pickup");
  const dropoffLocation = params.get("dropoff");
  const pickupAt = params.get("from");
  const returnAt = params.get("to");
  if (!pickupLocation || !dropoffLocation || !pickupAt || !returnAt) return null;
  return {
    pickupLocation,
    dropoffLocation,
    pickupAt,
    returnAt,
    sameLocation: pickupLocation === dropoffLocation,
  };
}

export function rentalDays(pickupAt, returnAt) {
  const start = new Date(pickupAt);
  const end = new Date(returnAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  const ms = end.getTime() - start.getTime();
  if (ms <= 0) return 0;
  return Math.ceil(ms / 86_400_000);
}

export function durationLabel(days) {
  if (!days) return "Add your dates";
  return days === 1 ? "1 day" : `${days} days`;
}

export function quoteRental(car, days) {
  const lines = [];
  let remaining = days;

  if (remaining >= 30) {
    const months = Math.floor(remaining / 30);
    lines.push({
      label: months === 1 ? "1 month" : `${months} months`,
      amount: months * car.monthly,
    });
    remaining -= months * 30;
  }

  if (remaining >= 7) {
    const weeks = Math.floor(remaining / 7);
    lines.push({
      label: weeks === 1 ? "1 week" : `${weeks} weeks`,
      amount: weeks * car.weekly,
    });
    remaining -= weeks * 7;
  }

  if (remaining > 0) {
    lines.push({
      label: remaining === 1 ? "1 day" : `${remaining} days`,
      amount: remaining * car.daily,
    });
  }

  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
  const dailyTotal = days * car.daily;
  return {
    days,
    lines,
    subtotal,
    savings: Math.max(0, dailyTotal - subtotal),
  };
}

export function priceTrip(car, days, addonIds = []) {
  const rental = quoteRental(car, days);
  const addons = ADDONS.filter((addon) => addonIds.includes(addon.id)).map((addon) => ({
    id: addon.id,
    name: addon.name,
    detail: `${money(addon.daily)} × ${days} ${days === 1 ? "day" : "days"}`,
    amount: addon.daily * days,
  }));
  const extras = addons.reduce((sum, addon) => sum + addon.amount, 0);
  const tax = Math.round((rental.subtotal + extras) * TAX_RATE);
  return {
    ...rental,
    addons,
    extras,
    tax,
    total: rental.subtotal + extras + tax,
  };
}

export function money(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export function formatWhen(value) {
  if (!value) return "Add a time";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Add a time";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function ageFrom(dob) {
  if (!dob) return null;
  const birth = new Date(`${dob}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const month = today.getMonth() - birth.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
}

export function validateCustomer(values) {
  const errors = {};
  const name = values.fullName.trim().replace(/\s+/g, " ");

  if (name.length < 2 || name.length > 60) {
    errors.fullName = "Enter your full name.";
  } else if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(name)) {
    errors.fullName = "Use letters, spaces, hyphens, or apostrophes.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  const digits = values.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) {
    errors.phone = "Enter a phone number with 10 to 15 digits.";
  }

  const license = values.license.replace(/[\s-]/g, "");
  if (!/^[A-Za-z0-9]{5,16}$/.test(license)) {
    errors.license = "Enter 5–16 letters or numbers.";
  }

  if (!values.dob) {
    errors.dob = "Enter your date of birth.";
  } else {
    const age = ageFrom(values.dob);
    if (age === null) errors.dob = "Enter a valid date of birth.";
    else if (age < 21) errors.dob = "The primary driver must be at least 21.";
    else if (age > 100) errors.dob = "Check the date of birth.";
  }

  if (values.notes.length > 240) {
    errors.notes = "Keep notes to 240 characters.";
  }

  if (!values.agreed) {
    errors.agreed = "Confirm that the driver is 21 or older and licensed.";
  }

  return errors;
}

export function makeReference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let value = "HX-";
  for (let index = 0; index < 6; index += 1) {
    value += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return value;
}
