import { useState } from "react";
import { Link } from "react-router-dom";
import { cx } from "../utils/cx";
import { buttonClass } from "../utils/styles";

export function Container({ className, children }) {
  return <div className={cx("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}

export function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-ember">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-sm text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, text, light = false, as: Tag = "h2" }) {
  return (
    <div className="max-w-2xl">
      <p className={cx("text-xs font-bold uppercase tracking-[0.2em]", light ? "text-gold" : "text-ember")}>{eyebrow}</p>
      <Tag className={cx("mt-3 font-serif text-4xl leading-[1.08] font-medium sm:text-5xl", light ? "text-cream" : "text-ink")}>
        {title}
      </Tag>
      {text ? <p className={cx("mt-4 text-lg leading-relaxed", light ? "text-cream/75" : "text-muted")}>{text}</p> : null}
    </div>
  );
}

export function Button({ variant = "primary", className, children, type = "button", ...props }) {
  return (
    <button type={type} className={cx(buttonClass(variant), className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({ to, variant = "primary", className, children }) {
  return (
    <Link to={to} className={cx(buttonClass(variant), className)}>
      {children}
    </Link>
  );
}

export function CarImage({ src, alt, className, priority = false }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={cx("grid place-items-center bg-pine text-cream", className)}>
        <span className="px-4 text-center font-serif text-2xl">Photo unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
