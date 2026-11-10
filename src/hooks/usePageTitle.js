import { useEffect } from "react";

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Halcyon` : "Halcyon — Rental Cars";
    return () => {
      document.title = "Halcyon — Rental Cars";
    };
  }, [title]);
}
