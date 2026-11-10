import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IconClose, IconMenu } from "./Icons";
import { ButtonLink } from "./ui";
import { cx } from "../utils/cx";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/cars", label: "Fleet" },
  { to: "/#drive", label: "How it works" },
  { to: "/#locations", label: "Cities" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(() => window.scrollY > 12);
  const [open, setOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const overlay = pathname === "/";
  const solid = !overlay || scrolled || open;
  const light = overlay && !solid;

  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function linkClass(active) {
    return cx(
      "rounded-full px-1 py-2 text-sm font-semibold transition hover:opacity-70",
      light ? "text-cream" : "text-ink",
      active && "underline decoration-ember decoration-2 underline-offset-[10px]",
    );
  }

  function isActive(link) {
    if (link.end) return pathname === "/";
    if (link.to === "/cars") return pathname.startsWith("/cars");
    return false;
  }

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid ? "border-b border-line bg-cream/95 backdrop-blur" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ember font-serif text-lg text-white">H</span>
          <span className={cx("font-serif text-2xl tracking-tight", light ? "text-cream" : "text-ink")}>Halcyon</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={linkClass(isActive(link))}
              aria-current={isActive(link) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <ButtonLink to="/cars">Book a car</ButtonLink>
        </div>

        <button
          type="button"
          className={cx(
            "grid h-11 w-11 place-items-center rounded-full border lg:hidden",
            light ? "border-white/30 text-cream" : "border-line text-ink",
          )}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </div>

      {open ? (
        <nav id="mobile-nav" className="border-t border-line bg-cream lg:hidden" aria-label="Mobile">
          <div className="mx-auto flex w-full max-w-6xl flex-col px-5 py-4 sm:px-8">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="border-b border-line py-3 text-base font-semibold text-ink"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <ButtonLink to="/cars" className="mt-4 w-full">
              Book a car
            </ButtonLink>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
