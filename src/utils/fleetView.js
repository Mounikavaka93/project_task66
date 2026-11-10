export const priceTiers = [
  { id: "any", label: "Any price", min: 0, max: Infinity },
  { id: "value", label: "Under $120", min: 0, max: 119 },
  { id: "mid", label: "$120 – $199", min: 120, max: 199 },
  { id: "premium", label: "$200 and up", min: 200, max: Infinity },
];

export const sortOptions = [
  { id: "recommended", label: "Recommended" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "name", label: "Name" },
  { id: "rating", label: "Top rated" },
];

export const initialFilters = {
  query: "",
  types: [],
  brands: [],
  transmission: "all",
  priceTier: "any",
  availableOnly: false,
  sort: "recommended",
};

export function countActiveFilters(filters) {
  let count = 0;
  if (filters.query.trim()) count += 1;
  if (filters.types.length) count += 1;
  if (filters.brands.length) count += 1;
  if (filters.transmission !== "all") count += 1;
  if (filters.priceTier !== "any") count += 1;
  if (filters.availableOnly) count += 1;
  return count;
}

export function filterCars(list, filters) {
  const tier = priceTiers.find((item) => item.id === filters.priceTier) || priceTiers[0];
  const query = filters.query.trim().toLowerCase();

  const matched = list.filter((car) => {
    if (query) {
      const haystack = [car.brand, car.name, car.model, car.type, car.fuel, car.color, car.transmission]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (filters.types.length && !filters.types.includes(car.type)) return false;
    if (filters.brands.length && !filters.brands.includes(car.brand)) return false;
    if (filters.transmission !== "all" && car.transmission !== filters.transmission) return false;
    if (filters.availableOnly && !car.available) return false;
    if (car.daily < tier.min || car.daily > tier.max) return false;
    return true;
  });

  return matched.sort((a, b) => {
    switch (filters.sort) {
      case "price-asc":
        return a.daily - b.daily;
      case "price-desc":
        return b.daily - a.daily;
      case "name":
        return `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`);
      case "rating":
        return b.rating - a.rating;
      default:
        return (
          Number(b.available) - Number(a.available) ||
          Number(b.featured) - Number(a.featured) ||
          b.rating - a.rating
        );
    }
  });
}
