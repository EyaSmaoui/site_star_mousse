import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { registerServiceWorker } from "./serviceWorkerRegistration";
import "./index.css";

const gaId = import.meta.env.VITE_GA_ID || "";
window.STAR_MOUSSE_GA_ID = gaId;
window.STAR_MOUSSE_HAS_GA =
  gaId &&
  gaId.indexOf("%") !== 0 &&
  gaId !== ("G-" + "PLACEHOLDER");

if (window.STAR_MOUSSE_HAS_GA) {
  const gaScript = document.createElement("script");
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(gaScript);
}

window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}
window.gtag = window.gtag || gtag;

gtag("js", new Date());
if (window.STAR_MOUSSE_HAS_GA) {
  gtag("config", gaId, {
    page_path: window.location.pathname,
    anonymize_ip: true,
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const scheduleServiceWorker = window.requestIdleCallback || ((callback) => window.setTimeout(callback, 3000));
scheduleServiceWorker(() => {
  registerServiceWorker();
});
