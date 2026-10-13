import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Atom,
  BookOpen,
  Check,
  ChevronLeft,
  Code2,
  Copy,
  Download,
  Flower2,
  GraduationCap,
  Heart,
  Lightbulb,
  MessageCircle,
  Pause,
  Play,
  Share2,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { programs } from "./data/siteContent";
import { site } from "./data/website";

export function useMotionPreferences() {
  const [systemReduced, setSystemReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [paused, setPaused] = useState(false);
  const off = paused || systemReduced;
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = (e) => setSystemReduced(e.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("motion-paused", off);
    return () => document.documentElement.classList.remove("motion-paused");
  }, [off]);
  return { off, systemReduced, toggle: () => setPaused((v) => !v) };
}

export function MotionButton({ motion, className = "" }) {
  return (
    <button
      className={`motion-button ${className}`}
      onClick={motion.toggle}
      disabled={motion.systemReduced}
      aria-pressed={motion.off}
      title={
        motion.systemReduced
          ? "Your device prefers reduced motion"
          : "Control decorative animations"
      }
    >
      {motion.off ? <Play size={14} /> : <Pause size={14} />}
      <span>
        {motion.systemReduced
          ? "Reduced motion"
          : motion.off
            ? "Resume animations"
            : "Pause animations"}
      </span>
    </button>
  );
}

const audiences = [
  {
    id: "early",
    label: "A little learner",
    sub: "Flora · published ages 2.5–5.5",
    icon: Flower2,
    color: "green",
  },
  {
    id: "school",
    label: "A school student",
    sub: "Classes VII–XII",
    icon: BookOpen,
    color: "blue",
  },
  {
    id: "entrance",
    label: "An entrance aspirant",
    sub: "JEE / NEET enquiries",
    icon: Atom,
    color: "coral",
  },
  {
    id: "college",
    label: "A college learner",
    sub: "B.Com / B.A subject support",
    icon: GraduationCap,
    color: "yellow",
  },
  {
    id: "skills",
    label: "A skills explorer",
    sub: "Confirm current advertised tracks",
    icon: Lightbulb,
    color: "blue",
  },
];
const goals = {
  early: [
    "Montessori 1 · 2.5–3.5 years",
    "Montessori 2 · 3.5–4.5 years",
    "L.K.G / KG · 4.5–5.5 years",
    "Help me check eligibility",
  ],
  school: [
    "Science subject support",
    "Commerce subject support",
    "Arts subject support",
    "Help me choose subjects",
  ],
  entrance: ["JEE preparation", "NEET preparation", "Explore both options"],
  college: [
    "B.Com subject support",
    "B.A subject support",
    "Discuss my semester / syllabus",
  ],
  skills: ["Spoken English", "Computers & coding", "Check available tracks"],
};

export function PathFinder({ onEnquire }) {
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("");
  const heading = useRef(null);
  const stage = !audience ? 1 : !goal ? 2 : 3;
  const selectedAudience = audiences.find((a) => a.id === audience);
  const id =
    audience === "early"
      ? "flora"
      : audience === "college"
        ? "undergraduate"
        : audience === "skills"
          ? goal === "Spoken English"
            ? "english"
            : "digital"
          : audience;
  const result = programs.find((p) => p.id === id);
  useEffect(() => {
    if (audience || goal) heading.current?.focus({ preventScroll: true });
  }, [audience, goal]);
  return (
    <div className="finder-content">
      <div className="eyebrow">
        <span />A SMALL QUESTION. A CLEARER NEXT STEP.
      </div>
      <div
        className="finder-progress"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={3}
        aria-valuenow={stage}
        aria-valuetext={`Step ${stage} of 3`}
        aria-label="Programme finder progress"
      >
        {[1, 2, 3].map((i) => (
          <span key={i} className={i <= stage ? "active" : ""} />
        ))}
      </div>
      <h3 ref={heading} tabIndex={-1}>
        {stage === 1 ? (
          <>
            Who are we
            <br />
            <span className="text-blue">planning for?</span>
          </>
        ) : stage === 2 ? (
          <>
            What would you
            <br />
            <span className="text-blue">like to explore?</span>
          </>
        ) : (
          <>
            Your next
            <br />
            <span className="text-blue">conversation.</span>
          </>
        )}
      </h3>
      <p className="finder-intro">
        {stage === 1
          ? "Choose a starting point. No scores, pressure or admission decisions."
          : stage === 2
            ? `A little more about your interest as ${selectedAudience.label.toLowerCase()}.`
            : "Here’s a published pathway to discuss with the team. They’ll confirm what is currently available."}
      </p>
      {stage === 1 && (
        <div className="finder-options">
          {audiences.map((a) => {
            const Icon = a.icon;
            return (
              <button
                key={a.id}
                className={`finder-option ${a.color}`}
                onClick={() => setAudience(a.id)}
              >
                <span className="finder-option-icon">
                  <Icon size={22} />
                </span>
                <span>
                  <strong>{a.label}</strong>
                  <small>{a.sub}</small>
                </span>
                <ArrowUpRight size={18} />
              </button>
            );
          })}
        </div>
      )}
      {stage === 2 && (
        <div className="finder-goals">
          {goals[audience].map((g) => (
            <button key={g} onClick={() => setGoal(g)}>
              <span>{g}</span>
              <ArrowRight size={18} />
            </button>
          ))}
        </div>
      )}
      {stage === 3 && (
        <div className={`finder-result ${result.color}`}>
          <span className="card-eyebrow">{result.eyebrow}</span>
          <h4>{result.title}</h4>
          <p>{result.description}</p>
          <div className="finder-selection">
            <Check size={16} />
            <span>{goal}</span>
          </div>
          <div className="info-note">
            {result.note}
            {audience === "skills" && goal === "Check available tracks"
              ? " Ask about both English and computer tracks."
              : ""}
          </div>
          <button
            className="button button-primary"
            onClick={() =>
              onEnquire(
                result.id === "flora" ? "Flora Play School" : result.title,
                `I would like to discuss ${goal.toLowerCase()}. Please confirm eligibility and the currently available options.`,
              )
            }
          >
            Talk about this pathway
            <ArrowUpRight size={18} />
          </button>
          <p className="finder-disclaimer">
            <ShieldCheck size={14} />
            An enquiry, not an admission application or a booking.
          </p>
        </div>
      )}
      {stage > 1 && (
        <button
          className="finder-back"
          onClick={() => (goal ? setGoal("") : setAudience(""))}
        >
          <ChevronLeft size={17} />
          Back one step
        </button>
      )}
    </div>
  );
}

export function FinderBanner({ onOpen }) {
  return (
    <div className="finder-banner" data-reveal>
      <div className="finder-banner-art" aria-hidden="true">
        <span>
          <BookOpen size={28} />
        </span>
        <span>
          <Flower2 size={26} />
        </span>
        <span>
          <Atom size={26} />
        </span>
      </div>
      <div>
        <div className="card-eyebrow">A LITTLE GUIDANCE GOES A LONG WAY</div>
        <h3>
          One question closer
          <br />
          to your next chapter.
        </h3>
        <p>Find a starting point that fits your stage.</p>
      </div>
      <button className="button button-primary" onClick={onOpen}>
        Find my learning path
        <SparkIcon />
      </button>
    </div>
  );
}
function SparkIcon() {
  return <ArrowUpRight size={18} />;
}

export function ShareContent() {
  const [copied, setCopied] = useState(false);
  const [manual, setManual] = useState(false);
  const input = useRef(null);
  const url = `${site.origin}/`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setManual(false);
    } catch {
      setManual(true);
      input.current?.focus();
      input.current?.select();
    }
  };
  return (
    <div className="share-content">
      <div className="eyebrow">
        <span />
        PASS ON A LITTLE POSSIBILITY
      </div>
      <h3>
        One learning family.
        <br />
        <span className="text-blue">Worth sharing.</span>
      </h3>
      <img
        className="share-card-preview"
        src={site.socialImage}
        alt="ISCA and Flora sharing card with the original ISCA emblem and Education with morality"
        width="1200"
        height="630"
      />
      <label className="share-url">
        Official website link
        <input
          ref={input}
          readOnly
          value={url}
          aria-label="Website link to share"
        />
      </label>
      <button className="button button-primary" onClick={copy}>
        {copied ? <Check size={18} /> : <Copy size={18} />}{" "}
        {copied ? "Link copied" : "Copy website link"}
      </button>
      <p className="share-status" role="status">
        {copied
          ? "Ready to paste into your favourite app."
          : manual
            ? "Copying is restricted here. Select and copy the link above."
            : "The branded preview appears when sharing the published website. Platforms may cache older previews."}
      </p>
    </div>
  );
}

export function useInstallShortcut() {
  const [prompt, setPrompt] = useState(null);
  const [installed, setInstalled] = useState(
    () => window.matchMedia("(display-mode: standalone)").matches,
  );
  useEffect(() => {
    const capture = (event) => {
      event.preventDefault();
      setPrompt(event);
    };
    const completed = () => {
      setInstalled(true);
      setPrompt(null);
    };
    window.addEventListener("beforeinstallprompt", capture);
    window.addEventListener("appinstalled", completed);
    return () => {
      window.removeEventListener("beforeinstallprompt", capture);
      window.removeEventListener("appinstalled", completed);
    };
  }, []);
  const install = async () => {
    if (!prompt) return false;
    try {
      await prompt.prompt();
      await prompt.userChoice;
    } finally {
      setPrompt(null);
    }
    return true;
  };
  return { installed, canPrompt: !!prompt, install };
}

export function InstallContent() {
  return (
    <div className="install-content">
      <span className="install-icon">
        <Smartphone size={34} />
      </span>
      <div className="eyebrow">
        <span />
        KEEP POSSIBILITY CLOSE
      </div>
      <h3>
        Your learning family.
        <br />
        <span className="text-blue">One tap away.</span>
      </h3>
      <p>
        Add the published website to your home screen for quick access. No
        account needed.
      </p>
      <div className="install-steps">
        <div>
          <strong>iPhone / iPad</strong>
          <p>Open the site in Safari → Share → Add to Home Screen.</p>
        </div>
        <div>
          <strong>Android / desktop</strong>
          <p>
            Open the site in Chrome or Edge → browser menu → Install app or Add
            to Home Screen, when offered.
          </p>
        </div>
      </div>
      <div className="info-note">
        Installation needs a normal browser and the deployed HTTPS website. The
        preview viewer may not offer installation. Public pages, photos and the
        programme overview can work offline after a complete first load; maps,
        streaming videos and message handoffs need internet.
      </div>
      <a
        className="source-link"
        href={`${site.origin}/`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open the published website
        <ArrowUpRight size={16} />
      </a>
    </div>
  );
}

// A published age-band guide, not an automatic eligibility/admission decision.
export function AgeBandGuide({ onSelect }) {
  const [age, setAge] = useState("");
  const [result, setResult] = useState(null);
  const check = (event) => {
    event.preventDefault();
    const n = Number(age);
    if (!Number.isFinite(n) || age === "" || n < 0 || n > 18) return;
    const stage =
      n >= 2.5 && n < 3.5
        ? "mont1"
        : n >= 3.5 && n < 4.5
          ? "mont2"
          : n >= 4.5 && n <= 5.5
            ? "kg"
            : null;
    const labels = {
      mont1: "Montessori 1 · 2.5–3.5 years",
      mont2: "Montessori 2 · 3.5–4.5 years",
      kg: "L.K.G / KG · 4.5–5.5 years",
    };
    setResult(
      stage
        ? `${labels[stage]}. This is a published guide only; the school confirms cut-offs, eligibility and current availability.`
        : "This age is outside the published 2.5–5.5 range. Please contact Flora to discuss eligibility; no admission decision is made here.",
    );
    if (stage) onSelect(stage);
  };
  return (
    <div className="age-guide">
      <div className="age-guide-heading">
        <Flower2 size={18} />
        <h3>Find a little learner’s starting point.</h3>
      </div>
      <p id="age-guide-note">
        Use age in years, for example 3.5. No name or birth date is needed, and
        this value is not saved.
      </p>
      <form onSubmit={check}>
        <label>
          Child’s age in years
          <input
            type="number"
            inputMode="decimal"
            min="0"
            max="18"
            step="0.1"
            required
            value={age}
            onChange={(event) => {
              setAge(event.target.value);
              setResult(null);
            }}
            placeholder="e.g. 3.5"
            aria-describedby="age-guide-note"
          />
        </label>
        <button type="submit">
          Check published age band
          <ArrowRight size={16} />
        </button>
      </form>
      {result && (
        <p className="age-guide-result" role="status">
          {result}
        </p>
      )}
    </div>
  );
}
