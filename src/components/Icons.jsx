function Svg({ className = "h-5 w-5", children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function IconMenu({ className }) {
  return (
    <Svg className={className || "h-6 w-6"}>
      <path d="M4 7h16M4 12h16M4 17h12" />
    </Svg>
  );
}

export function IconClose({ className }) {
  return (
    <Svg className={className || "h-6 w-6"}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  );
}

export function IconSearch({ className }) {
  return (
    <Svg className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" />
    </Svg>
  );
}

export function IconChevron({ className }) {
  return (
    <Svg className={className || "h-4 w-4"}>
      <path d="M6 9l6 6 6-6" />
    </Svg>
  );
}

export function IconCheck({ className }) {
  return (
    <Svg className={className}>
      <path d="M5 12.5l4.2 4.2L19 7.5" />
    </Svg>
  );
}

export function IconStar({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className || "h-4 w-4"} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3.2l2.4 5.1 5.6.7-4.1 3.8 1.1 5.5L12 15.8 7 18.3l1.1-5.5L4 9l5.6-.7L12 3.2z"
      />
    </svg>
  );
}

export function IconArrow({ className }) {
  return (
    <Svg className={className || "h-4 w-4"}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  );
}
