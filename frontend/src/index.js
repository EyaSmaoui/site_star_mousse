import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { registerServiceWorker } from "./serviceWorkerRegistration";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "./styles/bootstrap-theme.css";
import "./styles/home-template.css";

const gaId = import.meta.env.VITE_GA_ID || "";
const CONSENT_STORAGE_KEY = "starMousse-cookie-preferences";
window.STAR_MOUSSE_GA_ID = gaId;
window.STAR_MOUSSE_HAS_GA =
  gaId &&
  gaId.indexOf("%") !== 0 &&
  gaId !== ("G-" + "PLACEHOLDER");

window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}
window.gtag = window.gtag || gtag;

const getSavedAnalyticsConsent = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY) || "null");
    return saved?.analytics === true || (saved?.analytics === undefined && saved?.accepted === true);
  } catch {
    return false;
  }
};

window.STAR_MOUSSE_ANALYTICS_CONSENT = getSavedAnalyticsConsent();
gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied" });
gtag("js", new Date());

const enableGoogleAnalytics = () => {
  if (!window.STAR_MOUSSE_HAS_GA || !getSavedAnalyticsConsent()) return;
  window.STAR_MOUSSE_ANALYTICS_CONSENT = true;
  gtag("consent", "update", { analytics_storage: "granted" });
  if (!document.querySelector(`script[data-star-mousse-ga="${gaId}"]`)) {
    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.dataset.starMousseGa = gaId;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(gaScript);
    gtag("config", gaId, { send_page_view: false, anonymize_ip: true });
  }
};

if (window.STAR_MOUSSE_ANALYTICS_CONSENT) {
  enableGoogleAnalytics();
}
window.addEventListener("cookie-preferences-saved", (event) => {
  window.STAR_MOUSSE_ANALYTICS_CONSENT = event.detail?.analytics === true;
  if (window.STAR_MOUSSE_ANALYTICS_CONSENT) enableGoogleAnalytics();
  else if (window.STAR_MOUSSE_HAS_GA) gtag("consent", "update", { analytics_storage: "denied" });
});

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
