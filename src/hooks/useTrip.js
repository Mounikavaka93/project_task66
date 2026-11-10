import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useBooking } from "./useBooking";
import { searchFromQuery } from "../utils/trip";

export function useTrip() {
  const [params] = useSearchParams();
  const { search, setSearch } = useBooking();
  const trip = useMemo(() => searchFromQuery(params) || search, [params, search]);

  useEffect(() => {
    const fromUrl = searchFromQuery(params);
    if (!fromUrl) return;
    const same =
      search.pickupLocation === fromUrl.pickupLocation &&
      search.dropoffLocation === fromUrl.dropoffLocation &&
      search.pickupAt === fromUrl.pickupAt &&
      search.returnAt === fromUrl.returnAt;
    if (!same) setSearch(fromUrl);
  }, [params, search, setSearch]);

  return trip;
}
