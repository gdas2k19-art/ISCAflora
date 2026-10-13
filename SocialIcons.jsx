import React from "react";
const base = (size, props) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  ...props,
});
export function Instagram({ size = 24, ...props }) {
  return (
    <svg {...base(size, props)}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".85" fill="currentColor" stroke="none" />
    </svg>
  );
}
export function Facebook({ size = 24, ...props }) {
  return (
    <svg {...base(size, props)}>
      <path
        d="M14 21v-8h3l.5-4H14V7c0-1.2.5-2 2-2h2V1.5h-3c-3.1 0-5 1.9-5 5V9H7v4h3v8"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
export function Youtube({ size = 24, ...props }) {
  return (
    <svg {...base(size, props)}>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsApp({ size = 24, ...props }) {
  return (
    <svg {...base(size, props)}>
      <path d="M20.3 11.7a8.3 8.3 0 0 1-12.3 7.3l-4.7 1.5 1.5-4.6a8.3 8.3 0 1 1 15.5-4.2Z" />
      <path
        d="M8.2 7.1c.3-.2.6-.1.8.2l1 1.6c.2.3.2.6-.1.9l-.7.7c.7 1.3 1.8 2.4 3.2 3.1l.7-.9c.2-.3.5-.3.8-.1l1.8.9c.4.2.4.5.3.8-.3.9-1.1 1.4-2.1 1.3-2.8-.4-6.3-3.7-6.7-6.4-.1-.8.3-1.7 1-2.1Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
