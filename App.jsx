import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowUp,
  Atom,
  BookOpen,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  Download,
  ExternalLink,
  Flower2,
  GraduationCap,
  Heart,
  Leaf,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Play,
  ShieldCheck,
  Sparkles,
  Target,
  X,
  Share2,
  Smartphone,
  Route,
} from "lucide-react";
import { Facebook, Instagram, Youtube, WhatsApp } from "./SocialIcons";
import OpeningExperience, {
  shouldPlayOpening,
  rememberOpening,
} from "./OpeningExperience";
import { site } from "./data/website";
import {
  FinderBanner,
  PathFinder,
  ShareContent,
  InstallContent,
  MotionButton,
  useMotionPreferences,
  useInstallShortcut,
  AgeBandGuide,
} from "./ModernFeatures";
import {
  contact,
  social,
  programs,
  floraPrograms,
  gallery,
  videos,
  faqs,
  sources,
} from "./data/siteContent";

const icons = {
  book: BookOpen,
  atom: Atom,
  flower: Flower2,
  cap: GraduationCap,
  chat: MessageCircle,
  code: Code2,
};
const externalProps = { target: "_blank", rel: "noopener noreferrer" };
const waHref = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent("Hello ISCA / Flora Play School! I would like to know more about your programmes.")}`;
const navigation = [
  ["about", "Our story"],
  ["programmes", "Programmes"],
  ["flora", "Flora Play School"],
  ["life", "Our community"],
  ["contact", "Contact"],
];

function Button({
  children,
  onClick,
  href,
  className = "",
  variant = "primary",
  arrow = true,
  ...props
}) {
  const content = (
    <>
      {children}
      {arrow && <ArrowUpRight size={18} strokeWidth={1.8} />}
    </>
  );
  return href ? (
    <a
      href={href}
      className={`button button-${variant} ${className}`}
      {...props}
    >
      {content}
    </a>
  ) : (
    <button
      onClick={onClick}
      className={`button button-${variant} ${className}`}
      {...props}
    >
      {content}
    </button>
  );
}

function Eyebrow({ children, light = false, green = false }) {
  return (
    <div className={`eyebrow ${light ? "light" : ""} ${green ? "green" : ""}`}>
      <span />
      {children}
    </div>
  );
}

function Star({ className = "", color = "currentColor" }) {
  return (
    <svg
      aria-hidden="true"
      className={`star ${className}`}
      viewBox="0 0 100 100"
      fill="none"
    >
      <path
        d="M50 0 59 32 83 17 68 41 100 50 68 59 83 83 59 68 50 100 41 68 17 83 32 59 0 50 32 41 17 17 41 32Z"
        fill={color}
      />
    </svg>
  );
}

function FlowerArt({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 180 220"
      fill="none"
    >
      <path
        d="M90 208V107"
        stroke="#167355"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M87 166C49 166 40 143 38 127c31-1 48 9 49 39ZM95 185c38 0 48-23 50-39-31-1-49 10-50 39Z"
        fill="#36A87D"
      />
      <path
        d="M88 81c-44 30-53-25-25-36C49 10 93 1 102 37c35-18 56 23 26 42 30 26-9 62-31 34-33 29-63-8-35-31"
        fill="#FFE169"
      />
      <circle cx="93" cy="72" r="22" fill="#EB6758" />
      <path
        d="m85 73 1 3m14-3 1 3"
        stroke="#54281C"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M89 83c3 3 8 3 11-1"
        stroke="#54281C"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Dialog({ title, children, onClose, className = "" }) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    const appRoot = document.getElementById("root");
    const oldInert = appRoot.inert;
    const oldAriaHidden = appRoot.getAttribute("aria-hidden");
    appRoot.inert = true;
    appRoot.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "hidden";
    ref.current?.querySelector("[data-initial-focus]")?.focus();
    const handle = (event) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key === "Tab") {
        const elements = [
          ...ref.current.querySelectorAll(
            'button, a[href], input, select, textarea, summary, video, iframe, [tabindex="0"]',
          ),
        ].filter((el) => !el.disabled && el.getClientRects().length);
        const first = elements[0],
          last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handle);
    return () => {
      document.body.style.overflow = oldOverflow;
      appRoot.inert = oldInert;
      if (oldAriaHidden === null) appRoot.removeAttribute("aria-hidden");
      else appRoot.setAttribute("aria-hidden", oldAriaHidden);
      document.removeEventListener("keydown", handle);
      if (previous?.isConnected && previous.getClientRects().length)
        previous.focus({ preventScroll: true });
      else {
        const fallback = document.querySelector(".nav-enquire");
        if (fallback?.getClientRects().length)
          fallback.focus({ preventScroll: true });
      }
    };
  }, []);
  return createPortal(
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <section
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className={`dialog ${className}`}
      >
        <button
          className="dialog-close icon-button"
          aria-label="Close dialog"
          onClick={onClose}
          data-initial-focus
        >
          <X size={21} />
        </button>
        <h2 id="dialog-title" className="sr-only">
          {title}
        </h2>
        {children}
      </section>
    </div>,
    document.body,
  );
}

function Enquiry({ initialProgram = "", initialMessage = "", onClose }) {
  const [method, setMethod] = useState("whatsapp");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    program: initialProgram || "Not sure yet",
    message: initialMessage,
    consent: false,
  });
  const [error, setError] = useState("");
  const [prepared, setPrepared] = useState(null);
  const update = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));
    setPrepared(null);
    setError("");
  };
  const submit = (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) {
      setError("Please enter your name (at least two characters).");
      return;
    }
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < 8 || digits.length > 15) {
      setError(
        "Please enter a valid contact number, including your country code if needed.",
      );
      return;
    }
    if (!form.consent) {
      setError("Please agree to share your enquiry with the team.");
      return;
    }
    const text = `Hello ${form.program.toLowerCase().includes("flora") ? "Flora Play School" : "ISCA"}!\n\nMy name is ${form.name.trim()}.\nContact number: ${form.phone.trim()}\nI am interested in: ${form.program}.\n${form.message.trim() ? `\n${form.message.trim()}\n` : ""}\nPlease share the current programme availability, fees and visit / demo options.\n\nEnquiry prepared on the ISCA website.`;
    const recipient = form.program.toLowerCase().includes("flora")
      ? contact.floraEmail
      : contact.email;
    const url =
      method === "whatsapp"
        ? `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`
        : `mailto:${recipient}?subject=${encodeURIComponent(`Programme enquiry — ${form.program}`)}&body=${encodeURIComponent(text)}`;
    setPrepared({ url, text, method });
    if (method === "whatsapp")
      window.open(url, "_blank", "noopener,noreferrer");
    else window.location.href = url;
  };
  return (
    <Dialog
      title="Let’s find your next step"
      onClose={onClose}
      className="enquiry-dialog"
    >
      <div className="enquiry-header">
        <span className="mini-icon">
          <MessageCircle size={24} />
        </span>
        <Eyebrow>START A CONVERSATION</Eyebrow>
        <h3>
          Let’s find your
          <br />
          <span>next step.</span>
        </h3>
        <p>
          Tell us what you’re looking for. We’ll prepare a message for the right
          team.
        </p>
      </div>
      <div
        className="method-tabs"
        role="group"
        aria-label="Enquiry contact method"
      >
        <button
          className={method === "whatsapp" ? "active" : ""}
          onClick={() => {
            setMethod("whatsapp");
            setPrepared(null);
          }}
        >
          <MessageCircle size={17} /> WhatsApp
        </button>
        <button
          className={method === "email" ? "active" : ""}
          onClick={() => {
            setMethod("email");
            setPrepared(null);
          }}
        >
          <Mail size={17} /> Email
        </button>
      </div>
      <form onSubmit={submit} className="enquiry-form">
        <div className="form-row">
          <label>
            Your name
            <input
              autoComplete="name"
              name="name"
              value={form.name}
              onChange={update}
              placeholder="Parent / learner name"
              required
              maxLength={80}
            />
          </label>
          <label>
            Contact number
            <input
              autoComplete="tel"
              inputMode="tel"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={update}
              placeholder="e.g. +91 98765 43210"
              required
              maxLength={22}
            />
          </label>
        </div>
        <label>
          I’m interested in
          <select name="program" value={form.program} onChange={update}>
            <option>Not sure yet</option>
            {programs.map((p) => (
              <option key={p.id}>
                {p.id === "flora" ? "Flora Play School" : p.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Anything you’d like us to know?{" "}
          <span className="optional">Optional</span>
          <textarea
            name="message"
            value={form.message}
            onChange={update}
            placeholder="Your class, preferred subject, or a question for the team…"
            maxLength={500}
            rows={3}
          />
        </label>
        <label className="consent">
          <input
            type="checkbox"
            name="consent"
            checked={form.consent}
            onChange={update}
            required
          />
          <span>
            I agree to share these details with ISCA / Flora through my chosen
            app.
          </span>
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" className="form-submit">
          {method === "whatsapp"
            ? "Continue to WhatsApp"
            : "Prepare email enquiry"}
        </Button>
        <p className="privacy-note">
          <ShieldCheck size={15} />
          No details are saved here. Nothing is sent until you send the message
          in your chosen app.
        </p>
        {prepared && (
          <div className="prepared-message" role="status">
            <Check size={18} />
            <div>
              <strong>Your message is ready — not sent yet.</strong>
              <p>
                Complete the enquiry in{" "}
                {prepared.method === "whatsapp" ? "WhatsApp" : "your email app"}
                .
              </p>
              <a
                href={prepared.url}
                {...(prepared.method === "whatsapp" ? externalProps : {})}
              >
                Open your prepared{" "}
                {prepared.method === "whatsapp" ? "WhatsApp message" : "email"}{" "}
                <ArrowUpRight size={14} />
              </a>
              <details className="message-preview">
                <summary>View or copy your message</summary>
                <textarea
                  readOnly
                  value={prepared.text}
                  aria-label="Prepared enquiry message"
                  rows={6}
                />
              </details>
            </div>
          </div>
        )}
      </form>
    </Dialog>
  );
}

function ProgrammeDialog({ program, onClose, onEnquire }) {
  const Icon = icons[program.icon];
  return (
    <Dialog
      title={program.title}
      onClose={onClose}
      className="programme-dialog"
    >
      <div className={`programme-dialog-hero ${program.color}`}>
        <span className="programme-icon">
          <Icon size={38} />
        </span>
        <div className="card-eyebrow">{program.eyebrow}</div>
        <h3>{program.title}</h3>
      </div>
      <div className="programme-dialog-body">
        <p>{program.detail}</p>
        <ul>
          {program.highlights.map((h) => (
            <li key={h}>
              <Check size={18} />
              {h}
            </li>
          ))}
        </ul>
        <div className="info-note">{program.note}</div>
        <Button
          onClick={() =>
            onEnquire(
              program.id === "flora" ? "Flora Play School" : program.title,
            )
          }
        >
          {program.action}
        </Button>
        <a className="source-link" href={program.source} {...externalProps}>
          View the published information <ExternalLink size={13} />
        </a>
      </div>
    </Dialog>
  );
}

function GalleryDialog({ item, onClose, onNavigate, index, total }) {
  const touch = useRef(null);
  useEffect(() => {
    const handle = (e) => {
      if (e.key === "ArrowRight") onNavigate(1);
      if (e.key === "ArrowLeft") onNavigate(-1);
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onNavigate]);
  return (
    <Dialog title={item.title} onClose={onClose} className="gallery-dialog">
      <div
        className="lightbox-image"
        onTouchStart={(e) => {
          if (e.touches.length === 1)
            touch.current = {
              x: e.touches[0].clientX,
              y: e.touches[0].clientY,
            };
          else touch.current = null;
        }}
        onTouchEnd={(e) => {
          const t = touch.current;
          const end = e.changedTouches[0];
          if (t && end) {
            const dx = end.clientX - t.x,
              dy = end.clientY - t.y;
            if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4)
              onNavigate(dx < 0 ? 1 : -1);
          }
          touch.current = null;
        }}
      >
        <img key={item.id} src={item.image} alt={item.alt} />
        <button
          className="lightbox-arrow previous"
          onClick={() => onNavigate(-1)}
          aria-label="Previous gallery image"
        >
          <ChevronLeft />
        </button>
        <button
          className="lightbox-arrow next"
          onClick={() => onNavigate(1)}
          aria-label="Next gallery image"
        >
          <ChevronRight />
        </button>
        <span className="image-count">
          {index + 1} / {total}
        </span>
      </div>
      <div className="lightbox-copy">
        <div className="card-eyebrow">{item.date}</div>
        <h3>{item.title}</h3>
        <p>{item.caption}</p>
        <a className="source-link" href={item.source} {...externalProps}>
          {item.sourceLabel} <ExternalLink size={14} />
        </a>
      </div>
    </Dialog>
  );
}

function VideoDialog({ video, onClose }) {
  const [loadYoutube, setLoadYoutube] = useState(false);
  return (
    <Dialog title={video.title} onClose={onClose} className="video-dialog">
      <div
        className={`video-player ${video.id === "intro" || video.id === "flora-archive" ? "portrait" : ""}`}
      >
        {video.type === "local" ? (
          <video
            controls
            playsInline
            autoPlay
            muted
            preload="metadata"
            poster={video.poster}
            src={video.path}
            aria-label={video.title}
          >
            <p>
              Your browser cannot play this clip.{" "}
              <a href={video.source} {...externalProps}>
                Watch the original post.
              </a>
            </p>
          </video>
        ) : loadYoutube ? (
          <iframe
            title={video.title}
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <div className="youtube-consent">
            <img
              src={video.poster}
              alt="Preview of ISCA’s convex lens lesson"
            />
            <div>
              <Button onClick={() => setLoadYoutube(true)} arrow={false}>
                <Play size={18} fill="currentColor" />
                Play here · loads YouTube
              </Button>
              <span>YouTube’s privacy terms apply once the player loads.</span>
            </div>
          </div>
        )}
      </div>
      <div className="lightbox-copy">
        <div className="card-eyebrow">{video.published}</div>
        <h3>{video.title}</h3>
        <p>{video.description}</p>
        <details className="video-description">
          <summary>Text description / caption summary</summary>
          <p>{video.transcript}</p>
        </details>
        <a className="source-link" href={video.source} {...externalProps}>
          Watch the original <ExternalLink size={14} />
        </a>
      </div>
    </Dialog>
  );
}

function SourcesDialog({ onClose }) {
  return (
    <Dialog
      title="Sources & content notes"
      onClose={onClose}
      className="sources-dialog"
    >
      <Eyebrow>BUILT ON REAL INFORMATION</Eyebrow>
      <h3>
        Our sources.
        <br />
        Your peace of mind.
      </h3>
      <p className="dialog-intro">
        Public material reviewed on {contact.researchDate}. Programme details
        are published claims, not independent accreditation or outcome
        verification.
      </p>
      <div className="source-list">
        {sources.map((s, i) => (
          <a key={s.url} href={s.url} {...externalProps}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <div>
              <strong>{s.name}</strong>
              <p>{s.detail}</p>
            </div>
            <ArrowUpRight size={19} />
          </a>
        ))}
      </div>
      <div className="info-note">
        The supplied ISCA logo is used unchanged. Other school imagery comes
        from the supplied Maps listing and public official Facebook / YouTube
        material; there are no stock school photographs. Instagram links are
        included, but automated Instagram media access was blocked. Confirm
        media ownership, guardian consent, current fees and programme
        availability before public launch.
      </div>
      <a
        href="/downloads/research-and-website-copy.md"
        className="source-link"
        download="ISCA-Flora-Research-and-Website-Copy.md"
      >
        Download the research & website copy <Download size={15} />
      </a>
    </Dialog>
  );
}

function PrivacyDialog({ onClose }) {
  return (
    <Dialog
      title="Privacy & enquiry information"
      onClose={onClose}
      className="privacy-dialog"
    >
      <Eyebrow>A SIMPLE, CLEAR APPROACH</Eyebrow>
      <h3>
        Your enquiry.
        <br />
        Your choice.
      </h3>
      <p>
        This site does not save enquiry forms, use analytics, or require an
        account. Your form details stay in the open page until you choose to
        hand them to WhatsApp or your email application.
      </p>
      <p>
        No enquiry is sent automatically. You must send the prepared message in
        the application you select. WhatsApp, email providers, Google Maps,
        YouTube and social platforms follow their own privacy policies.
      </p>
      <p>
        School images, fonts and local clips are served with this site. The
        interactive map and YouTube player load only when you request them. No
        student portal, online payment system or admission confirmation service
        is offered here.
      </p>
      <p>
        The optional home-screen / offline feature caches only public site files
        on your device. Enquiry fields and video streams are never cached.
        Clearing this site’s browser data removes the offline files. A
        session-only flag remembers whether the opening animation has played; it
        contains no contact or enquiry details.
      </p>
      <p>
        For questions, contact ISCA at{" "}
        <a href={`mailto:${contact.email}`}>{contact.email}</a> or Flora at{" "}
        <a href={`mailto:${contact.floraEmail}`}>{contact.floraEmail}</a>.
      </p>
    </Dialog>
  );
}

function IllustratedMap({ loaded, onLoad }) {
  if (loaded)
    return (
      <iframe
        className="google-map"
        title="ISCA location at 26 Topsia Road, Kolkata"
        src={`https://maps.google.com/maps?q=${contact.coordinates.lat},${contact.coordinates.lng}&z=17&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    );
  return (
    <div className="illustrated-map">
      <svg
        viewBox="0 0 600 420"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Illustrative location map; open Google Maps for accurate directions"
      >
        <defs>
          <pattern
            id="blocks"
            width="110"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <rect x="9" y="9" width="82" height="71" rx="13" fill="#e7e9de" />
          </pattern>
        </defs>
        <rect width="600" height="420" fill="#f1f2e9" />
        <rect width="600" height="420" fill="url(#blocks)" />
        <path
          d="M-20 100c122 55 185 29 278 99s165 11 350 81"
          stroke="white"
          strokeWidth="42"
          fill="none"
        />
        <path
          d="M328-30c-61 123 29 207-6 280s-51 147-24 200"
          stroke="white"
          strokeWidth="33"
          fill="none"
        />
        <path
          d="M-20 100c122 55 185 29 278 99s165 11 350 81"
          stroke="#dadfce"
          strokeWidth="2"
          strokeDasharray="8 8"
          fill="none"
        />
        <path
          d="M60 387C112 328 54 225 138 129s61-123 63-143"
          stroke="#bedab9"
          strokeWidth="15"
          fill="none"
        />
        <rect x="385" y="17" width="134" height="86" rx="20" fill="#d0dfc4" />
        <rect x="421" y="315" width="116" height="74" rx="17" fill="#d0dfc4" />
        <text
          x="357"
          y="253"
          transform="rotate(15 357 253)"
          fontSize="13"
          fontFamily="Plus Jakarta Sans, sans-serif"
          fill="#808575"
        >
          Topsia Road
        </text>
        <text
          x="40"
          y="70"
          fontSize="13"
          letterSpacing="3"
          fontFamily="Plus Jakarta Sans, sans-serif"
          fill="#858976"
        >
          TOPSIA · KOLKATA
        </text>
      </svg>
      <div className="map-pin">
        <div className="pin-circle">
          <MapPin size={27} />
        </div>
        <div>
          <strong>ISCA & Flora</strong>
          <span>26 Topsia Road</span>
        </div>
      </div>
      <button className="load-map" onClick={onLoad}>
        <MapPin size={17} />
        Load interactive Google Map <ArrowUpRight size={15} />
      </button>
      <span className="map-disclaimer">Illustrative map · not to scale</span>
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("");
  const [programFilter, setProgramFilter] = useState("all");
  const [programQuery, setProgramQuery] = useState("");
  const [floraTab, setFloraTab] = useState("mont1");
  const [galleryFilter, setGalleryFilter] = useState("all");
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [showAllVideos, setShowAllVideos] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [modal, setModal] = useState(null);
  const [scroll, setScroll] = useState(0);
  const [online, setOnline] = useState(navigator.onLine);
  const motion = useMotionPreferences();
  const [opening, setOpening] = useState(shouldPlayOpening);
  const completeOpening = React.useCallback(() => {
    rememberOpening();
    setOpening(false);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("opening-active", opening);
    return () => document.documentElement.classList.remove("opening-active");
  }, [opening]);
  const install = useInstallShortcut();
  const galleryRef = useRef(null);
  const menuRef = useRef(null);
  const [galleryPosition, setGalleryPosition] = useState(0);
  const closeModal = React.useCallback(() => setModal(null), []);
  const enquire = (program = "", message = "") => {
    setMenuOpen(false);
    setModal({ type: "enquiry", program, message });
  };
  const findPath = () => {
    setMenuOpen(false);
    setModal({ type: "finder" });
  };
  const shareWebsite = async () => {
    const data = {
      title: site.shareTitle,
      text: "Every learner. Every possibility. Meet ISCA & Flora Play School in Topsia, Kolkata.",
      url: `${site.origin}/`,
    };
    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch (error) {
        if (error.name === "AbortError") return;
      }
    }
    setModal({ type: "share" });
  };
  const addShortcut = async () => {
    try {
      if (await install.install()) return;
    } catch {}
    setModal({ type: "install" });
  };
  const moveGallery = (delta) => {
    const el = galleryRef.current;
    const card = el?.querySelector(".gallery-item");
    if (card)
      el.scrollBy({
        left: delta * (card.offsetWidth + 16),
        behavior: motion.off ? "instant" : "smooth",
      });
  };
  const selectedFlora = floraPrograms.find((f) => f.id === floraTab);
  const handleFloraKey = (event, id) => {
    const current = floraPrograms.findIndex((f) => f.id === id);
    let next = current;
    if (event.key === "ArrowRight") next = (current + 1) % floraPrograms.length;
    else if (event.key === "ArrowLeft")
      next = (current + floraPrograms.length - 1) % floraPrograms.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = floraPrograms.length - 1;
    else return;
    event.preventDefault();
    setFloraTab(floraPrograms[next].id);
    document.getElementById(`tab-${floraPrograms[next].id}`)?.focus();
  };
  const filteredPrograms = programs.filter((p) => {
    const matchesCategory =
      programFilter === "all" || p.category === programFilter;
    const searchable = [
      p.title,
      p.description,
      p.eyebrow,
      ...p.tags,
      ...p.highlights,
    ]
      .join(" ")
      .toLowerCase();
    return (
      matchesCategory && searchable.includes(programQuery.trim().toLowerCase())
    );
  });
  const filteredGallery = gallery.filter(
    (g) => galleryFilter === "all" || g.category === galleryFilter,
  );
  const shownGallery = showAllGallery
    ? filteredGallery
    : filteredGallery.slice(0, 4);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY,
        max = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty(
        "--scroll-progress",
        max > 0 ? Math.min(y / max, 1) : 0,
      );
      // Only rerender when crossing a UI threshold, not on every scrolling pixel.
      setScroll(y > 1100 ? 1101 : y > 15 ? 16 : 0);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    update();
    const navObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActiveNav(e.target.id)),
      { rootMargin: "-20% 0px -60% 0px" },
    );
    document
      .querySelectorAll("main section[id]")
      .forEach((s) => navObserver.observe(s));
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      navObserver.disconnect();
    };
  }, []);
  useEffect(() => {
    document.documentElement.classList.add("enhanced");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.07 },
    );
    document
      .querySelectorAll("[data-reveal]:not(.revealed)")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [
    programFilter,
    programQuery,
    galleryFilter,
    showAllGallery,
    showAllVideos,
  ]);
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuRef.current?.focus();
      }
    };
    const outside = (e) => {
      if (menuOpen && !e.target.closest(".site-header")) setMenuOpen(false);
    };
    window.addEventListener("keydown", fn);
    document.addEventListener("pointerdown", outside);
    return () => {
      window.removeEventListener("keydown", fn);
      document.removeEventListener("pointerdown", outside);
    };
  }, [menuOpen]);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
    el.scrollTo({ left: 0, behavior: "instant" });
    setGalleryPosition(0);
  }, [galleryFilter, showAllGallery]);
  const openGallery = (id) => setModal({ type: "gallery", id });
  const navigateGallery = React.useCallback(
    (delta) =>
      setModal((m) => {
        const index = gallery.findIndex((g) => g.id === m.id);
        return {
          type: "gallery",
          id: gallery[(index + delta + gallery.length) % gallery.length].id,
        };
      }),
    [],
  );
  const modalGallery =
    modal?.type === "gallery" && gallery.find((g) => g.id === modal.id);

  return (
    <>
      <div className="reading-progress" aria-hidden="true" />
      {!online && (
        <div className="offline-banner" role="status">
          You’re offline. Public pages and saved photos remain available. Maps,
          streaming videos and message handoffs need internet.
        </div>
      )}
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="topbar">
        <div className="container">
          <span>
            <Sparkles size={13} /> Education with morality{" "}
            <span className="top-divider">/</span> Since 2012
          </span>
          <div>
            <a href={contact.map} {...externalProps}>
              <MapPin size={13} /> Topsia, Kolkata
            </a>
            <span className="top-divider">/</span>
            <a href={`tel:${contact.phoneRaw}`}>
              <Phone size={12} />
              {contact.phone}
            </a>
          </div>
        </div>
      </div>
      <header className={`site-header ${scroll > 15 ? "scrolled" : ""}`}>
        <div className="container nav-container">
          <a
            className="brand"
            href="#home"
            aria-label="ISCA home"
            onClick={() => setMenuOpen(false)}
          >
            <img
              src="/media/isca-logo-small.png"
              alt="Original ISCA emblem"
              width="57"
              height="53"
            />
            <div>
              <strong>
                ISCA<span className="brand-dot">.</span>
              </strong>
              <span>Science, Commerce & Arts</span>
            </div>
          </a>
          <nav
            className={menuOpen ? "open" : ""}
            aria-label="Main navigation"
            id="main-nav"
          >
            {navigation.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={activeNav === id ? "location" : undefined}
                className={activeNav === id ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                {label}
                {id === "flora" && <span className="flora-nav-dot" />}
              </a>
            ))}
            <button className="mobile-finder" onClick={findPath}>
              <Route size={18} />
              Find my learning path
              <ArrowUpRight size={16} />
            </button>
            <Button className="mobile-enquire" onClick={() => enquire()}>
              Let’s talk
            </Button>
          </nav>
          <Button className="nav-enquire" onClick={() => enquire()}>
            Let’s talk
          </Button>
          <button
            ref={menuRef}
            className="menu-toggle icon-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main id="main">
        <section className="hero" id="home">
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="hero-topline">
                <div className="hero-kicker">
                  <span className="status-dot" /> A LEARNING FAMILY IN KOLKATA
                </div>
                <MotionButton motion={motion} />
              </div>
              <h1 className="hero-headline">
                <span className="hero-word-line">
                  <span className="hero-word-text">Big dreams.</span>
                </span>
                <span className="hero-word-line">
                  <span className="hero-word-text">Bright minds.</span>
                </span>
                <span className="hero-word-line hero-word-line-accent">
                  <span className="hero-accent hero-word-text">
                    Better futures.
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 480 24"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M5 16C85 1 308 3 473 13M53 22c130-10 266-8 380-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </span>
              </h1>
              <p>
                From a little one’s first discovery to a student’s next big
                ambition. Find your place to learn, grow and become — at ISCA &
                Flora Play School.
              </p>
              <div className="hero-actions">
                <Button href="#programmes">Explore our programmes</Button>
                <button
                  className="watch-intro"
                  onClick={() => setModal({ type: "video", id: "annual" })}
                >
                  <span>
                    <Play size={15} fill="currentColor" />
                  </span>
                  Meet our learning family
                </button>
              </div>
              <div className="hero-assist-links">
                <button className="hero-finder-link" onClick={findPath}>
                  <Route size={16} />
                  Not sure? Find my learning path
                  <ArrowRight size={16} />
                </button>
                <button
                  className="hero-opening-link"
                  onClick={() => setOpening(true)}
                  disabled={motion.off}
                  title={
                    motion.off
                      ? "Opening follows your reduced-motion preference"
                      : "Replay the Learn. Grow. Become. opening"
                  }
                >
                  <Play size={14} />
                  Watch the welcome
                </button>
              </div>
              <div className="hero-bottom-line">
                <span className="tiny-flower">
                  <Flower2 size={22} />
                </span>
                <span>
                  Little beginnings. <strong>Limitless possibilities.</strong>
                </span>
              </div>
            </div>
            <div className="hero-visual" aria-label="Real moments from ISCA">
              <div className="visual-blue-shape" />
              <div className="visual-grid" />
              <Star className="hero-star" color="#F6D85B" />
              <svg
                className="hero-scribble"
                viewBox="0 0 120 90"
                aria-hidden="true"
              >
                <path
                  d="M10 76c21-42 98 10 88-28C89 17 57 45 48 21c-3-9 3-17 10-18M52 8l6-5 5 7"
                  fill="none"
                  stroke="#D75D4D"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <button
                className="hero-main-photo"
                onClick={() => openGallery("students")}
                aria-label="View Celebrating the journey, together at the ISCA Annual Function"
              >
                <img
                  src="/media/annual-students.webp"
                  alt="Students celebrating the journey together with certificates at ISCA’s 2026 Annual Function"
                  fetchPriority="high"
                  width="720"
                  height="480"
                />
                <div className="hero-photo-caption">
                  <span className="white-dot" /> REAL MOMENTS. REAL GROWTH.
                  <ArrowUpRight size={16} />
                </div>
              </button>
              <div className="morality-card">
                <span>
                  <BookOpen size={22} />
                </span>
                <div>
                  More than learning.<strong>Education with morality.</strong>
                </div>
              </div>
              <button
                className="hero-classroom hero-syllabus"
                onClick={() => setModal({ type: "video", id: "intro" })}
                aria-label="Watch Education beyond the syllabus"
              >
                <img
                  src="/media/isca-introduction.webp"
                  alt="Education beyond the syllabus: thumbnail of ISCA’s official learning message"
                  width="541"
                  height="312"
                />
                <span>
                  <Play size={12} />
                  Education beyond the syllabus <ArrowUpRight size={14} />
                </span>
              </button>
              <div className="hero-flora-badge">
                <Flower2 size={25} />
                <div>
                  One family.<strong>Many beginnings.</strong>
                </div>
              </div>
              <span className="visual-photo-credit">
                ISCA Annual Function · September 2026
              </span>
            </div>
          </div>
          <div className="container hero-facts">
            <div>
              <span className="fact-number">
                2012<span>↗</span>
              </span>
              <div>
                <strong>Our beginning</strong>
                <span>A learning journey in Topsia</span>
              </div>
            </div>
            <div>
              <span className="fact-number">VII–XII</span>
              <div>
                <strong>Stronger foundations</strong>
                <span>School learning & beyond</span>
              </div>
            </div>
            <div>
              <span className="fact-number">
                2.5–5.5<span className="fact-years">yrs</span>
              </span>
              <div>
                <strong>A joyful first chapter</strong>
                <span>At Flora Play School</span>
              </div>
            </div>
          </div>
        </section>

        <div className="learning-rail" aria-hidden="true">
          <div>
            {Array.from({ length: 3 }, (_, i) => (
              <React.Fragment key={i}>
                <span>SCIENCE</span>
                <Star />
                <span>COMMERCE</span>
                <Star />
                <span>ARTS</span>
                <Star />
                <span>EARLY YEARS</span>
                <Star />
                <span>ENDLESS POSSIBILITIES</span>
                <Star />
              </React.Fragment>
            ))}
          </div>
        </div>

        <section className="programmes section-space" id="programmes">
          <div className="container">
            <div className="section-heading" data-reveal>
              <div>
                <Eyebrow>YOUR JOURNEY, YOUR WAY</Eyebrow>
                <h2>
                  Find your
                  <br />
                  <span className="text-blue">next chapter.</span>
                </h2>
              </div>
              <p>
                Different stages. Different dreams.
                <br />A thoughtful place to take the next step.
              </p>
            </div>
            <div className="programme-search" data-reveal>
              <label htmlFor="programme-search">
                A clearer way to find your next step
              </label>
              <div className="programme-search-row">
                <span aria-hidden="true">
                  <BookOpen size={20} />
                </span>
                <input
                  id="programme-search"
                  type="search"
                  value={programQuery}
                  onChange={(event) => setProgramQuery(event.target.value)}
                  placeholder="Search NEET, Commerce, English, Montessori…"
                  autoComplete="off"
                  aria-label="Search programmes"
                />
                {programQuery && (
                  <button
                    className="search-clear"
                    onClick={() => setProgramQuery("")}
                    aria-label="Clear programme search"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              <p className="programme-search-count" role="status">
                {filteredPrograms.length}{" "}
                {filteredPrograms.length === 1 ? "programme" : "programmes"}{" "}
                found. Current batches are confirmed by the team.
              </p>
            </div>
            <div
              className="filter-row"
              role="group"
              aria-label="Filter programmes"
              data-reveal
            >
              {[
                ["all", "All programmes"],
                ["school", "School & college"],
                ["entrance", "Entrance prep"],
                ["early", "Early years"],
                ["skills", "Life skills"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  aria-pressed={programFilter === id}
                  className={programFilter === id ? "active" : ""}
                  onClick={() => setProgramFilter(id)}
                >
                  {label}
                  {id === "all" && <span>06</span>}
                </button>
              ))}
            </div>
            {filteredPrograms.length === 0 && (
              <div className="search-empty">
                <Sparkles size={26} />
                <h3>A different question? We’re here.</h3>
                <p>
                  No published pathway matches this search and filter. Try a
                  subject or contact the team.
                </p>
                <button
                  className="button button-primary"
                  onClick={() => {
                    setProgramQuery("");
                    setProgramFilter("all");
                  }}
                >
                  Reset search and filters
                  <ArrowRight size={17} />
                </button>
              </div>
            )}
            <div className="programme-grid" aria-live="polite">
              {filteredPrograms.map((p, i) => {
                const Icon = icons[p.icon];
                return (
                  <article
                    key={p.id}
                    className={`programme-card ${p.color}`}
                    data-reveal
                    style={{ "--delay": `${(i % 3) * 65}ms` }}
                  >
                    <div className="programme-card-top">
                      <span className="programme-icon">
                        <Icon size={30} strokeWidth={1.6} />
                      </span>
                      <span className="card-index">
                        {String(programs.indexOf(p) + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="card-eyebrow">{p.eyebrow}</div>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                    <div className="programme-tags">
                      {p.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                    <button
                      className="card-action"
                      onClick={() => setModal({ type: "program", id: p.id })}
                    >
                      Explore programme
                      <span>
                        <ArrowUpRight size={20} />
                      </span>
                    </button>
                  </article>
                );
              })}
            </div>
            <FinderBanner onOpen={findPath} />
            <div className="programmes-footer" data-reveal>
              <span>
                <MessageCircle size={17} />
                Not sure where to begin?
              </span>
              <button onClick={() => enquire()}>
                Let’s figure it out together <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>

        <section className="about section-space" id="about">
          <div className="container about-grid">
            <div className="about-visual" data-reveal>
              <div className="about-image-wrap">
                <img
                  src="/media/isca-classroom.webp"
                  alt="Inside ISCA: individual desks and the institute’s classroom in Topsia"
                  loading="lazy"
                  width="1032"
                  height="774"
                />
                <button
                  className="photo-expand"
                  onClick={() => openGallery("classroom")}
                  aria-label="Enlarge classroom photograph"
                >
                  <ArrowUpRight size={23} />
                </button>
                <span className="image-origin">
                  From our Google Maps listing
                </span>
              </div>
              <div className="heritage-stamp">
                <svg viewBox="0 0 150 150" aria-hidden="true">
                  <defs>
                    <path
                      id="stamp-circle"
                      d="M75,75m-56,0a56,56 0 1,1 112,0a56,56 0 1,1-112,0"
                    />
                  </defs>
                  <text>
                    <textPath href="#stamp-circle" textLength="346">
                      EDUCATION WITH MORALITY · SINCE 2012 ·{" "}
                    </textPath>
                  </text>
                </svg>
                <BookOpen size={37} strokeWidth={1.3} />
              </div>
              <div className="about-address">
                <MapPin size={20} />
                <div>
                  <strong>Rooted in Topsia.</strong>
                  <span>26 Topsia Road, Kolkata</span>
                </div>
              </div>
            </div>
            <div className="about-copy" data-reveal>
              <Eyebrow>KNOWLEDGE. CHARACTER. POSSIBILITY.</Eyebrow>
              <h2>
                A local beginning.
                <br />A lasting <span className="text-blue">belief.</span>
              </h2>
              <p className="lead">
                Good education helps you understand the world — and find your
                place in it.
              </p>
              <p>
                ISCA — The Institute of Science, Commerce & Arts — is a learning
                centre in Topsia, Kolkata. Our journey began in 2012, with an
                idea that still guides us:{" "}
                <strong>education with morality.</strong>
              </p>
              <p>
                Today, our learning family connects school and undergraduate
                subject support, entrance-exam preparation, and the early-years
                beginnings of Flora Play School.
              </p>
              <div className="values-list">
                <div>
                  <span>
                    <Target size={21} />
                  </span>
                  <div>
                    <h3>Understand, not just memorise.</h3>
                    <p>Concept-based learning at the heart of preparation.</p>
                  </div>
                </div>
                <div>
                  <span>
                    <BookOpen size={21} />
                  </span>
                  <div>
                    <h3>Practice with purpose.</h3>
                    <p>Regular tests and a focus on syllabus progress.</p>
                  </div>
                </div>
                <div>
                  <span>
                    <Heart size={21} />
                  </span>
                  <div>
                    <h3>Guidance for the journey.</h3>
                    <p>
                      A conversation about learning, character and what’s next.
                    </p>
                  </div>
                </div>
              </div>
              <a
                className="text-link"
                href={social.iscaFacebook}
                {...externalProps}
              >
                Get to know ISCA <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </section>

        <section className="flora-section" id="flora">
          <div className="container flora-grid">
            <div className="flora-copy" data-reveal>
              <div className="flora-brand">
                <img
                  src="/media/flora-logo.webp"
                  alt="Flora Play School’s official logo"
                  loading="lazy"
                  width="719"
                  height="720"
                />
                <div>
                  <span>THE EARLY-YEARS CHAPTER OF OUR FAMILY</span>
                  <strong>
                    Flora Play School<span>✿</span>
                  </strong>
                </div>
              </div>
              <h2>
                Small steps.
                <br />
                <span>
                  Wonderful
                  <br className="flora-break" /> beginnings.
                </span>
              </h2>
              <p>
                A nurturing introduction to learning, friendship and
                self-expression. A place for little discoveries — and a whole
                lot of growing.
              </p>
              <div
                className="flora-tabs"
                role="tablist"
                aria-label="Flora programme stages"
              >
                {floraPrograms.map((f) => (
                  <button
                    role="tab"
                    key={f.id}
                    id={`tab-${f.id}`}
                    aria-selected={floraTab === f.id}
                    tabIndex={floraTab === f.id ? 0 : -1}
                    aria-controls="flora-panel"
                    className={floraTab === f.id ? "active" : ""}
                    onClick={() => setFloraTab(f.id)}
                    onKeyDown={(e) => handleFloraKey(e, f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div
                className="flora-programme"
                role="tabpanel"
                id="flora-panel"
                aria-labelledby={`tab-${floraTab}`}
              >
                <span className="age-label">
                  <Leaf size={14} />
                  {selectedFlora.age}
                </span>
                <h3>{selectedFlora.title}</h3>
                <p>{selectedFlora.text}</p>
                <div className="flora-themes">
                  {selectedFlora.themes.map((t) => (
                    <span key={t}>
                      <Check size={13} />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <AgeBandGuide onSelect={setFloraTab} />
              <div className="flora-actions">
                <Button
                  variant="green"
                  onClick={() => enquire("Flora Play School")}
                >
                  Plan a school visit
                </Button>
                <a
                  href={social.floraInstagram}
                  {...externalProps}
                  aria-label="Visit Flora Play School on Instagram"
                >
                  <Instagram size={20} />
                  <ArrowUpRight size={14} />
                </a>
              </div>
              <p className="flora-note">
                Published age bands. The school will confirm eligibility and
                current availability.
              </p>
            </div>
            <div className="flora-visual" data-reveal>
              <FlowerArt className="flora-flower" />
              <Star className="flora-star" color="#E7B954" />
              <span className="flora-doodle-text">
                let them
                <br />
                <span>blossom.</span>
                <svg aria-hidden="true" viewBox="0 0 95 70">
                  <path
                    d="M6 8c20 48 23 60 62 38m-12-2 12 2-7 12"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
              <button
                className="flora-photo"
                onClick={() => openGallery("flora-stage")}
                aria-label="View Flora’s children at the annual function"
              >
                <img
                  src="/media/flora-performance.webp"
                  alt="Flora’s little learners performing together on the annual function stage"
                  loading="lazy"
                  width="720"
                  height="480"
                />
                <span>
                  <Flower2 size={18} />
                  Our little stars, shining together.
                  <ArrowUpRight size={18} />
                </span>
              </button>
              <div className="flora-photo-footnote">
                <span className="status-dot" />
                REAL FLORA MOMENTS · SEPTEMBER 2026
              </div>
              <div className="flora-wonder-card">
                <span>A little curiosity.</span>
                <strong>A world of possibility.</strong>
                <Sparkles size={19} />
              </div>
            </div>
          </div>
        </section>

        <section className="school-life section-space" id="life">
          <div className="container">
            <div className="section-heading" data-reveal>
              <div>
                <Eyebrow>THE MOMENTS THAT MAKE US</Eyebrow>
                <h2>
                  More than a classroom.
                  <br />
                  <span className="text-blue">A community.</span>
                </h2>
              </div>
              <p>
                Real people. Shared milestones.
                <br />A glimpse of life in our learning family.
              </p>
            </div>
            <div className="gallery-top" data-reveal>
              <div
                className="filter-row"
                role="group"
                aria-label="Filter photo gallery"
              >
                {[
                  ["all", "All moments"],
                  ["isca", "ISCA life"],
                  ["flora", "Flora"],
                  ["classroom", "Our classroom"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    aria-pressed={galleryFilter === id}
                    onClick={() => {
                      setGalleryFilter(id);
                      setShowAllGallery(false);
                    }}
                    className={galleryFilter === id ? "active" : ""}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <span className="media-authentic">
                <ShieldCheck size={15} />
                From our own public channels
              </span>
            </div>
            <div className="gallery-mobile-toolbar">
              <span>
                Swipe to explore<span aria-hidden="true">↔</span>
              </span>
              <div>
                <button
                  onClick={() => moveGallery(-1)}
                  aria-label="Scroll gallery left"
                >
                  <ChevronLeft size={19} />
                </button>
                <span className="gallery-position" aria-live="polite">
                  {Math.min(galleryPosition + 1, shownGallery.length)} /{" "}
                  {shownGallery.length}
                </span>
                <button
                  onClick={() => moveGallery(1)}
                  aria-label="Scroll gallery right"
                >
                  <ChevronRight size={19} />
                </button>
              </div>
            </div>
            <div
              ref={galleryRef}
              onScroll={(e) => {
                const card = e.currentTarget.querySelector(".gallery-item");
                if (card)
                  setGalleryPosition(
                    Math.round(
                      e.currentTarget.scrollLeft / (card.offsetWidth + 16),
                    ),
                  );
              }}
              className={`gallery-grid ${shownGallery.length < 3 ? "gallery-small" : ""}`}
              aria-live="polite"
            >
              {shownGallery.map((g, i) => (
                <button
                  key={g.id}
                  className={`gallery-item gallery-${i}`}
                  onClick={() => openGallery(g.id)}
                  data-reveal
                >
                  <img
                    src={g.image}
                    alt={g.alt}
                    loading="lazy"
                    width={g.category === "classroom" ? "1032" : "720"}
                    height={g.category === "classroom" ? "774" : "480"}
                  />
                  <span className="gallery-item-arrow">
                    <ArrowUpRight size={22} />
                  </span>
                  <div className="gallery-caption">
                    <span>{g.date}</span>
                    <h3>{g.title}</h3>
                  </div>
                </button>
              ))}
            </div>
            <div className="gallery-bottom" data-reveal>
              <span>
                Photos from the official ISCA event reel and supplied Google
                Maps listing.
              </span>
              {filteredGallery.length > 4 && (
                <button
                  className="text-link"
                  onClick={() => setShowAllGallery(!showAllGallery)}
                >
                  {showAllGallery
                    ? "Show fewer moments"
                    : "More moments from ISCA"}{" "}
                  <ArrowRight size={17} />
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="watch-section">
          <div className="container">
            <div className="section-heading" data-reveal>
              <div>
                <Eyebrow light>WATCH. DISCOVER. CONNECT.</Eyebrow>
                <h2>
                  A little closer to
                  <br />
                  our learning <span>world.</span>
                </h2>
              </div>
              <a
                className="watch-channel"
                href={social.youtube}
                {...externalProps}
              >
                <Youtube size={21} />
                Find us on YouTube <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="video-grid">
              {(showAllVideos ? videos : videos.slice(0, 3)).map((v, i) => (
                <article
                  className="video-card"
                  key={v.id}
                  data-reveal
                  style={{ "--delay": `${i * 70}ms` }}
                >
                  <button
                    className="video-thumbnail"
                    onClick={() => setModal({ type: "video", id: v.id })}
                    aria-label={`Watch: ${v.title}`}
                  >
                    <img
                      src={v.poster}
                      alt={v.title}
                      loading="lazy"
                      width="720"
                      height="480"
                    />
                    <span className="video-play">
                      <Play size={22} fill="currentColor" />
                    </span>
                    <span className="video-duration">{v.duration}</span>
                  </button>
                  <div className="card-eyebrow">{v.label}</div>
                  <h3>
                    <button
                      onClick={() => setModal({ type: "video", id: v.id })}
                    >
                      {v.title}
                      <ArrowUpRight size={18} />
                    </button>
                  </h3>
                </article>
              ))}
            </div>
            <div className="watch-bottom" data-reveal>
              <span>
                <Play size={13} />
                Original institute media. No stock school videos.
              </span>
              <button onClick={() => setShowAllVideos(!showAllVideos)}>
                {showAllVideos
                  ? "Hide archive"
                  : "View Flora’s archived welcome reel"}{" "}
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </section>

        <section className="faq-section section-space">
          <div className="container faq-grid">
            <div data-reveal>
              <Eyebrow>A FEW THINGS YOU MAY WONDER</Eyebrow>
              <h2>
                Good questions.
                <br />
                <span className="text-blue">Clear answers.</span>
              </h2>
              <p>
                Choosing a place to learn is a big decision. We’re here to help
                you take the next step.
              </p>
              <button className="text-link" onClick={() => enquire()}>
                Ask us something else <ArrowUpRight size={17} />
              </button>
              <Star className="faq-star" color="#F4D960" />
            </div>
            <div className="faq-list" data-reveal>
              {faqs.map((f, i) => (
                <div
                  className={`faq-item ${openFaq === i ? "open" : ""}`}
                  key={f.question}
                >
                  <h3>
                    <button
                      aria-expanded={openFaq === i}
                      aria-controls={`faq-${i}`}
                      onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                    >
                      <span className="faq-number">0{i + 1}</span>
                      {f.question}
                      <span className="faq-indicator">
                        {openFaq === i ? "−" : "+"}
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-${i}`}
                    className="faq-answer"
                    hidden={openFaq !== i}
                  >
                    <p>{f.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="container">
            <div className="section-heading" data-reveal>
              <div>
                <Eyebrow>EVERY NEXT STEP STARTS WITH HELLO</Eyebrow>
                <h2>
                  Let’s talk about
                  <br />
                  <span className="text-blue">your tomorrow.</span>
                </h2>
              </div>
              <Button onClick={() => enquire()}>Start an enquiry</Button>
            </div>
            <div className="contact-grid" data-reveal>
              <div className="contact-details">
                <div className="contact-location">
                  <span className="contact-icon">
                    <MapPin size={23} />
                  </span>
                  <div>
                    <span className="card-eyebrow">COME SAY HELLO</span>
                    <h3>
                      Rooted in Topsia.
                      <br />
                      Ready for your next step.
                    </h3>
                    <address>
                      {contact.address}
                      <span>{contact.landmark}</span>
                    </address>
                    <a
                      className="text-link"
                      href={contact.map}
                      {...externalProps}
                    >
                      Get directions <ArrowUpRight size={16} />
                    </a>
                  </div>
                </div>
                <div className="contact-methods">
                  <div>
                    <Phone size={20} />
                    <div>
                      <span>GIVE US A CALL</span>
                      <a href={`tel:${contact.phoneRaw}`}>{contact.phone}</a>
                      <a href={`tel:${contact.secondaryPhoneRaw}`}>
                        {contact.secondaryPhone}
                      </a>
                    </div>
                  </div>
                  <div>
                    <Mail size={20} />
                    <div>
                      <span>DROP US A NOTE</span>
                      <a href={`mailto:${contact.email}`}>{contact.email}</a>
                      <a href={`mailto:${contact.floraEmail}`}>
                        {contact.floraEmail}
                      </a>
                    </div>
                  </div>
                </div>
                <p className="visit-note">
                  <CalendarDays size={15} />
                  Please call ahead to arrange a demo class or school visit.
                </p>
              </div>
              <div className="contact-map">
                <IllustratedMap
                  loaded={mapLoaded}
                  onLoad={() => setMapLoaded(true)}
                />
                <a
                  className="map-external"
                  href={contact.map}
                  {...externalProps}
                  aria-label="Open ISCA location in Google Maps"
                >
                  <ArrowUpRight size={20} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div>
              <Eyebrow light>ISCA & FLORA PLAY SCHOOL</Eyebrow>
              <h2>
                Every learner.
                <br />
                Every <span>possibility.</span>
                <Star color="#F3D45C" />
              </h2>
            </div>
            <Button variant="yellow" onClick={() => enquire()}>
              Begin your next chapter
            </Button>
          </div>
          <div className="footer-main">
            <div className="footer-brand">
              <a className="brand" href="#home">
                <span className="footer-logo">
                  <img
                    src="/media/isca-logo-small.png"
                    alt="ISCA emblem"
                    width="57"
                    height="53"
                  />
                </span>
                <div>
                  <strong>
                    ISCA<span className="brand-dot">.</span>
                  </strong>
                  <span>Science, Commerce & Arts</span>
                </div>
              </a>
              <p>
                Education with morality.
                <br />
                Learning, growing and becoming
                <br />
                in Topsia, Kolkata — since 2012.
              </p>
              <div className="social-icons">
                <a
                  href={social.iscaInstagram}
                  {...externalProps}
                  aria-label="ISCA official Instagram"
                >
                  <Instagram size={19} />
                </a>
                <a
                  href={social.iscaFacebook}
                  {...externalProps}
                  aria-label="ISCA Facebook"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href={social.youtube}
                  {...externalProps}
                  aria-label="ISCA YouTube"
                >
                  <Youtube size={20} />
                </a>
                <a href={waHref} {...externalProps} aria-label="ISCA WhatsApp">
                  <MessageCircle size={19} />
                </a>
              </div>
            </div>
            <div className="footer-links">
              <h3>EXPLORE</h3>
              {navigation.map(([id, label]) => (
                <a key={id} href={`#${id}`}>
                  {label}
                </a>
              ))}
            </div>
            <div className="footer-links">
              <h3>OUR LEARNING FAMILY</h3>
              <a href={social.iscaInstagram} {...externalProps}>
                ISCA official <ArrowUpRight size={13} />
              </a>
              <a href={social.iscaKolkataInstagram} {...externalProps}>
                ISCA Kolkata <ArrowUpRight size={13} />
              </a>
              <a href={social.floraInstagram} {...externalProps}>
                Flora Instagram <ArrowUpRight size={13} />
              </a>
              <a href={social.floraFacebook} {...externalProps}>
                Flora Facebook <ArrowUpRight size={13} />
              </a>
              <a
                href="/downloads/isca-flora-programme-overview.pdf"
                download="ISCA-Flora-Programme-Overview.pdf"
              >
                Programme overview <Download size={13} />
              </a>
            </div>
            <div className="footer-contact">
              <h3>FIND US</h3>
              <address>
                26 Topsia Road
                <br />
                Beside Belal Masjid
                <br />
                Kolkata, West Bengal 700039
              </address>
              <a href={`tel:${contact.phoneRaw}`}>
                {contact.phone}
                <ArrowUpRight size={14} />
              </a>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} ISCA & Flora Play School.</span>
            <div>
              <button onClick={() => setModal({ type: "sources" })}>
                Sources & content notes
              </button>
              <span>·</span>
              <button onClick={() => setModal({ type: "privacy" })}>
                Privacy & enquiries
              </button>
              <button onClick={shareWebsite}>
                <Share2 size={15} />
                Share website
              </button>
              <a href="#home">
                Back to top <ArrowUp size={13} />
              </a>
            </div>
          </div>
          <div className="app-tools">
            <div className="app-tools-copy">
              <Smartphone size={28} />
              <span>
                <strong>Keep your next step close.</strong>
                <small>Save the website to your home screen.</small>
              </span>
            </div>
            <div className="experience-tools">
              <button
                onClick={() => setOpening(true)}
                disabled={motion.off}
                title={
                  motion.off
                    ? "Opening motion follows your animation preference"
                    : "Watch the Learn. Grow. Become. opening again"
                }
              >
                <Play size={16} />
                Replay opening
              </button>
              <button onClick={addShortcut} disabled={install.installed}>
                <Download size={17} />
                {install.installed
                  ? "Shortcut installed"
                  : "Add to home screen"}
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
          <p className="footer-information">
            Programme information is based on public material. Please confirm
            current availability, eligibility, fees and schedules with the team.
          </p>
        </div>
      </footer>
      <div
        className="mobile-dock"
        role="group"
        aria-label="Mobile quick actions"
      >
        <a
          className={activeNav === "programmes" ? "active" : ""}
          href="#programmes"
        >
          <BookOpen size={20} />
          <span>Explore</span>
        </a>
        <a className={activeNav === "flora" ? "active" : ""} href="#flora">
          <Flower2 size={20} />
          <span>Flora</span>
        </a>
        <button className="dock-enquire" onClick={() => enquire()}>
          <MessageCircle size={21} />
          <span>Enquire</span>
        </button>
        <a href={`tel:${contact.phoneRaw}`}>
          <Phone size={20} />
          <span>Call us</span>
        </a>
        <a
          className="dock-whatsapp"
          href={waHref}
          {...externalProps}
          aria-label="WhatsApp"
        >
          <WhatsApp size={21} />
          <span>WhatsApp</span>
        </a>
      </div>
      <a
        className="floating-whatsapp"
        href={waHref}
        {...externalProps}
        aria-label="Chat with ISCA or Flora Play School on WhatsApp"
      >
        <MessageCircle size={24} />
        <span>Let’s chat</span>
      </a>
      {scroll > 1100 && (
        <button
          className="back-to-top"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches
                ? "instant"
                : "smooth",
            })
          }
          aria-label="Back to top"
        >
          <ArrowUp size={19} />
        </button>
      )}

      {opening && (
        <OpeningExperience onComplete={completeOpening} reduced={motion.off} />
      )}

      {modal?.type === "enquiry" && (
        <Enquiry
          initialProgram={modal.program}
          initialMessage={modal.message}
          onClose={closeModal}
        />
      )}
      {modal?.type === "program" && (
        <ProgrammeDialog
          program={programs.find((p) => p.id === modal.id)}
          onClose={closeModal}
          onEnquire={enquire}
        />
      )}
      {modalGallery && (
        <GalleryDialog
          item={modalGallery}
          index={gallery.indexOf(modalGallery)}
          total={gallery.length}
          onClose={closeModal}
          onNavigate={navigateGallery}
        />
      )}
      {modal?.type === "video" && (
        <VideoDialog
          key={modal.id}
          video={videos.find((v) => v.id === modal.id)}
          onClose={closeModal}
        />
      )}
      {modal?.type === "finder" && (
        <Dialog
          title="Find my learning path"
          onClose={closeModal}
          className="finder-dialog"
        >
          <PathFinder onEnquire={enquire} />
        </Dialog>
      )}
      {modal?.type === "share" && (
        <Dialog
          title="Share ISCA and Flora Play School"
          onClose={closeModal}
          className="share-dialog"
        >
          <ShareContent />
        </Dialog>
      )}
      {modal?.type === "install" && (
        <Dialog
          title="Add ISCA to your home screen"
          onClose={closeModal}
          className="install-dialog"
        >
          <InstallContent />
        </Dialog>
      )}
      {modal?.type === "sources" && <SourcesDialog onClose={closeModal} />}
      {modal?.type === "privacy" && <PrivacyDialog onClose={closeModal} />}
    </>
  );
}
