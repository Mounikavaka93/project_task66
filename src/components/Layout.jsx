import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { cx } from "../utils/cx";

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}

export default function Layout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <a
        href="#content"
        className="absolute -left-[999px] top-4 z-[70] rounded-full bg-white px-4 py-2 text-sm font-bold text-ink focus:left-4"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="content" tabIndex={-1} key={pathname} className={cx("page-in outline-none", pathname === "/" ? "" : "pt-24")}>
        <Outlet />
      </main>
      <Footer />
      <ScrollManager />
    </div>
  );
}
