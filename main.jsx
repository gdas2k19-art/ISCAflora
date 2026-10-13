import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    if (this.state.error)
      return (
        <main
          style={{
            fontFamily: "sans-serif",
            padding: "12vh 25px",
            maxWidth: 650,
            margin: "auto",
          }}
        >
          <img src="/media/isca-logo-small.png" alt="ISCA" width="90" />
          <h1>Let’s get you to the right team.</h1>
          <p>
            This page could not load correctly. Please refresh, or contact ISCA
            / Flora directly.
          </p>
          <p>
            <a href="tel:+917003561315">+91 70035 61315</a>
          </p>
          <p>
            <a href="mailto:iscawb@gmail.com">iscawb@gmail.com</a>
          </p>
          <button onClick={() => window.location.reload()}>
            Refresh the website
          </button>
        </main>
      );
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);

// Public assets only. Never register a worker in development or the portable file viewer.
if (
  import.meta.env.PROD &&
  !window.__ISCA_PORTABLE_PREVIEW__ &&
  /^https?:$/.test(location.protocol) &&
  window.isSecureContext &&
  "serviceWorker" in navigator
) {
  window.addEventListener(
    "load",
    () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    },
    { once: true },
  );
}
