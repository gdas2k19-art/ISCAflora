import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight } from "lucide-react";
import "./OpeningExperience.css";

const KEY = "isca-opening-seen-v1";
export function shouldPlayOpening() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return false;
  if (new URLSearchParams(window.location.search).get("intro") === "1")
    return true;
  if (window.__ISCA_OPENING_SEEN__) return false;
  try {
    return sessionStorage.getItem(KEY) !== "1";
  } catch {
    return true;
  }
}
export function rememberOpening() {
  window.__ISCA_OPENING_SEEN__ = true;
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    /* Opaque preview/private contexts still work. */
  }
}

/** A finite brand story, not an artificial asset loader. Nothing waits for external media. */
export default function OpeningExperience({ onComplete, reduced = false }) {
  const [finishing, setFinishing] = useState(false);
  const logo = useRef(null);
  const skip = useRef(null);
  const done = useRef(onComplete);
  done.current = onComplete;
  useEffect(() => {
    const root = document.getElementById("root");
    const oldInert = root.inert,
      oldHidden = root.getAttribute("aria-hidden");
    const oldOverflow = document.body.style.overflow;
    const previous = document.activeElement;
    root.inert = true;
    root.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() =>
      skip.current?.focus({ preventScroll: true }),
    );
    const fly = setTimeout(() => {
      const from = logo.current?.getBoundingClientRect();
      const image = logo.current?.querySelector("img").getBoundingClientRect();
      const to = document
        .querySelector(".site-header .brand>img")
        ?.getBoundingClientRect();
      if (from && image && to && image.width) {
        logo.current.style.setProperty(
          "--fly-x",
          `${to.x + to.width / 2 - from.x - from.width / 2}px`,
        );
        logo.current.style.setProperty(
          "--fly-y",
          `${to.y + to.height / 2 - from.y - from.height / 2}px`,
        );
        logo.current.style.setProperty("--fly-scale", to.width / image.width);
      }
      setFinishing(true);
    }, 2150);
    const finish = setTimeout(() => done.current(), 2950);
    const keys = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        done.current();
      }
      if (event.key === "Tab") {
        event.preventDefault();
        skip.current?.focus();
      }
    };
    document.addEventListener("keydown", keys);
    return () => {
      clearTimeout(fly);
      clearTimeout(finish);
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", keys);
      document.body.style.overflow = oldOverflow;
      root.inert = oldInert;
      if (oldHidden === null) root.removeAttribute("aria-hidden");
      else root.setAttribute("aria-hidden", oldHidden);
      if (
        previous &&
        previous !== document.body &&
        previous !== document.documentElement &&
        previous.isConnected &&
        previous.getClientRects().length
      )
        previous.focus({ preventScroll: true });
      else
        document
          .querySelector(".site-header .brand")
          ?.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    if (reduced) done.current();
  }, [reduced]);

  return createPortal(
    <section
      className={`opening-experience ${finishing ? "opening-finishing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="ISCA opening experience"
      aria-describedby="opening-message"
    >
      <div className="opening-backdrop" aria-hidden="true">
        <div className="opening-mesh" />
        <div className="opening-aura opening-aura-blue" />
        <div className="opening-aura opening-aura-green" />
        <div className="opening-grain" />
      </div>
      <div className="opening-topline">
        <span>
          ISCA <i /> FLORA PLAY SCHOOL
        </span>
        <button ref={skip} className="opening-skip" onClick={onComplete}>
          Skip opening animation
          <ArrowRight size={16} />
        </button>
      </div>
      <div className="opening-stage">
        <svg
          className="opening-universe"
          viewBox="0 0 1000 700"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="opening-orbit"
              x1="80"
              y1="250"
              x2="900"
              y2="560"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#88a3ff" />
              <stop offset=".38" stopColor="#f5da70" />
              <stop offset=".73" stopColor="#f18372" />
              <stop offset="1" stopColor="#5bdfb2" />
            </linearGradient>
            <linearGradient
              id="opening-book"
              x1="115"
              y1="260"
              x2="245"
              y2="340"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#d6e0ff" />
              <stop offset="1" stopColor="#8bafff" />
            </linearGradient>
          </defs>
          <g
            className="opening-orbits"
            stroke="url(#opening-orbit)"
            strokeWidth="1.5"
          >
            <path
              className="opening-trace orbit-one"
              pathLength="1"
              d="M94 406C138 166 676 110 895 306S770 565 520 555 114 613 94 406Z"
            />
            <path
              className="opening-trace orbit-two"
              pathLength="1"
              d="M172 218C461 39 906 254 826 468S214 638 152 441 356 222 526 297"
            />
            <path
              className="opening-trace orbit-three"
              pathLength="1"
              d="M85 346C279 538 814 495 914 243"
            />
            <circle
              className="opening-centre-ring"
              cx="500"
              cy="335"
              r="133"
              stroke="#c4d5ff"
              strokeOpacity=".24"
              strokeDasharray="2 11"
            />
          </g>
          <g
            className="opening-book-symbol"
            stroke="url(#opening-book)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              className="opening-trace"
              pathLength="1"
              d="M180 296C156 279 132 275 112 280V356C137 351 159 356 180 372 201 356 225 351 249 356V280C224 275 201 279 180 296Z"
              fill="#4061e715"
            />
            <path
              className="opening-trace"
              pathLength="1"
              d="M180 296V372M125 297c16-1 28 2 41 10m-41 6c16-1 28 3 41 10m-41 6c16-1 28 3 41 10m27-32c13-8 25-11 41-10m-41 26c13-7 25-11 41-10"
            />
            <path
              className="opening-trace book-base"
              pathLength="1"
              d="M102 289v77c25-6 51 0 78 16 26-16 53-22 79-16v-77"
              stroke="#f3da77"
              strokeOpacity=".65"
            />
          </g>
          <g className="opening-atom" stroke="#a9c3ff" strokeWidth="2.5">
            <ellipse
              className="opening-trace"
              pathLength="1"
              cx="812"
              cy="297"
              rx="66"
              ry="24"
              transform="rotate(-28 812 297)"
            />
            <ellipse
              className="opening-trace"
              pathLength="1"
              cx="812"
              cy="297"
              rx="66"
              ry="24"
              transform="rotate(32 812 297)"
            />
            <ellipse
              className="opening-trace"
              pathLength="1"
              cx="812"
              cy="297"
              rx="66"
              ry="24"
              transform="rotate(92 812 297)"
            />
            <circle
              className="opening-nucleus"
              cx="812"
              cy="297"
              r="7"
              fill="#f7d96a"
              stroke="none"
            />
          </g>
          <g
            className="opening-flower"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              className="opening-trace flower-stem"
              pathLength="1"
              d="M797 565V477M797 536c-22-1-38-12-44-29 23-1 37 8 44 29m1 16c20-2 35-13 39-28-21 1-34 9-39 28"
              stroke="#60d5a2"
              strokeWidth="3.5"
            />
            <g className="opening-petals">
              <path
                d="M794 473c-28 13-49-14-24-29-23-27 6-48 25-26 16-28 47-9 33 17 32 8 19 41-9 33-2 31-38 33-25 5Z"
                fill="#f7da6c18"
                stroke="#f7da6c"
                strokeWidth="3"
              />
              <circle cx="800" cy="450" r="14" fill="#ef7866" />
              <circle
                cx="800"
                cy="450"
                r="24"
                stroke="#f7da6c"
                strokeOpacity=".2"
              />
            </g>
          </g>
          <g
            className="opening-math"
            stroke="#f68a7b"
            strokeWidth="2.6"
            strokeLinecap="round"
          >
            <path
              className="opening-trace"
              pathLength="1"
              d="m177 477-16 16 16 16m44-32 16 16-16 16m-14-41-14 50M296 182v24m-12-12h24"
            />
          </g>
          <g className="opening-sparks">
            <path
              className="opening-star"
              d="m671 144 8 19 20-1-14 15 6 20-20-10-17 11 3-20-15-13 20-2Z"
              fill="#f8db6d"
            />
            <circle cx="318" cy="480" r="4" fill="#60d5a2" />
            <circle cx="662" cy="486" r="4" fill="#f68a7b" />
            <circle cx="369" cy="167" r="3" fill="#a7c1ff" />
            <circle cx="606" cy="222" r="3" fill="#f8db6d" />
          </g>
        </svg>
        <div ref={logo} className="opening-logo">
          <div className="opening-logo-shine" />
          <img
            src="/media/isca-logo-small.png"
            alt="The supplied original ISCA emblem"
            width="400"
            height="373"
            fetchPriority="high"
          />
        </div>
        <div className="opening-story" id="opening-message">
          <span className="opening-kicker">
            ONE LEARNING FAMILY. ENDLESS POSSIBILITY.
          </span>
          <h2>
            <span>Learn.</span> <span>Grow.</span> <span>Become.</span>
          </h2>
          <p>
            ISCA <span>×</span> Flora Play School
          </p>
        </div>
      </div>
      <div className="opening-bottomline">
        <span className="opening-bottom-dot" />
        Education with morality.
        <span className="opening-bottom-divider" />
        Since 2012.
      </div>
    </section>,
    document.body,
  );
}
