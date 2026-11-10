import { useMemo, useState } from "react";
import { defaultSearch } from "../utils/trip";
import { BookingContext } from "./booking-store";

export function BookingProvider({ children }) {
  const [search, setSearch] = useState(defaultSearch);

  const value = useMemo(() => ({ search, setSearch }), [search]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}
