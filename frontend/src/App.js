import React, { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { hasAccess, ROLES, getStoredUser, getToken } from "./utils/authUtils";
import Home from "./pages/Home";

import CookiesModal from "./components/CookiesModal";
import PromoModal from "./components/PromoModal";

import WhatsAppWidget from "./components/WhatsAppWidget";
import Breadcrumbs from "./components/Breadcrumbs";
import SEO from "./components/SEO";
import TopContactHeader from "./components/TopContactHeader";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

const Auth = lazy(() => import("./pages/Auth/Auth"));
const Register = lazy(() => import("./pages/Auth/Register"));
const ForgotPassword = lazy(() => import("./pages/Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword"));
const Products = lazy(() => import("./pages/Store/Articles"));
const Promos = lazy(() => import("./pages/Store/Promos"));
const Cart = lazy(() => import("./pages/Store/Cart"));
const About = lazy(() => import("./pages/Info/About"));
const Help = lazy(() => import("./pages/Info/Help"));
const Contact = lazy(() => import("./pages/Contact"));
const B2BExport = lazy(() => import("./pages/B2BExport"));
const InternationalRoadmap = lazy(() => import("./pages/InternationalRoadmap"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const Profile = lazy(() => import("./pages/Admin/Profile"));
const ManageClients = lazy(() => import("./pages/Admin/ManageClients"));
const ManageManagers = lazy(() => import("./pages/Admin/ManageManagers"));
const AddEmployer = lazy(() => import("./pages/Admin/AddEmployer"));
const Quiz = lazy(() => import("./quiz"));
const ClientDashboard = lazy(() => import("./pages/Client/ClientDashboard"));
const ClientMyOrders = lazy(() => import("./pages/Client/ClientMyOrders"));
const ClientReviews = lazy(() => import("./pages/Client/ClientReviews"));
const ClientRecommendations = lazy(() => import("./pages/Client/ClientRecommendations"));
const EmployeeDashboard = lazy(() => import("./pages/Employee/EmployeeDashboard"));
const EmployeeOrders = lazy(() => import("./pages/Employee/EmployeeOrders"));
const EmployeeStock = lazy(() => import("./pages/Employee/EmployeeStock"));
const EmployeeProfile = lazy(() => import("./pages/Employee/EmployeeProfile"));
const EmployeeClients = lazy(() => import("./pages/Employee/EmployeeClients"));
const AdminOrders = lazy(() => import("./pages/Admin/AdminOrders"));
const ChatbotAssistant = lazy(() => import("./components/ChatbotAssistant"));
const ProductTemplate = lazy(() => import("./components/ProductTemplate"));
const Matelas = lazy(() => import("./pages/Store/Matelas"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const LegalTerms = lazy(() => import("./pages/LegalTerms"));
const ReviewHost = lazy(() => import("./components/ReviewHost"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

function GlobalBrandTheme() {
  return (
    <style>{`
      :root {
        --sm-bg: #fafaf8;
        --sm-surface: #ffffff;
        --sm-surface-warm: #f8f3ed;
        --sm-ink: #0a0a0a;
        --sm-text: #0a0a0a;
        --sm-muted: #6b6b6b;
        --sm-border: #e2e2de;
        --sm-brand: #0a0a0a;
        --sm-brand-dark: #1f1f1f;
        --sm-gold: #b78b3f;
        --sm-gold-soft: #fff5cf;
        --sm-shadow: 0 22px 60px rgba(10, 10, 10, 0.08);
        --bg-dark: var(--sm-bg);
        --bg-card: var(--sm-surface);
        --accent-blue: var(--sm-brand);
        --accent-purple: var(--sm-gold);
        --text-main: var(--sm-text);
        --text-muted: var(--sm-muted);
        --glass-border: rgba(10, 10, 10, 0.08);
      }

      html, body, #root, .App {
        background: var(--sm-bg) !important;
        color: var(--sm-text) !important;
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif !important;
      }

      .ssn-page,
      .qz-page,
      .sm-auth-page {
        background: var(--sm-bg) !important;
        color: var(--sm-text) !important;
      }

      .ssn-products-hero,
      .ssn-promo-hero,
      .ssn-about-hero,
      .ssn-help-hero,
      .qz-hero,
      .sm-auth-page {
        background:
          radial-gradient(circle at 12% 18%, rgba(183, 139, 63,0.08), transparent 28%),
          linear-gradient(180deg, #fbfaf8 0%, #ffffff 100%) !important;
        border-bottom: 1px solid var(--sm-border) !important;
      }

      .ssn-section-products,
      .ssn-section-values,
      .ssn-section-faq,
      .ssn-section-vision,
      .ssn-section-flash,
      .qz-section,
      .qz-main {
        background:
          linear-gradient(180deg, #ffffff 0%, #f8f3ed 100%) !important;
        border-color: var(--sm-border) !important;
      }

      .ssn-section-packs,
      .ssn-section-gallery,
      .ssn-section-contact,
      .ssn-section-cta {
        background: #ffffff !important;
        border-color: var(--sm-border) !important;
      }

      .ssn-hero-title,
      .ssn-section-title,
      .ssn-section-header h2,
      .ssn-gallery-head h2,
      .ssn-cta-inner h2,
      .qz-hero h1,
      .qz-card h2,
      .sm-title {
        color: var(--sm-ink) !important;
        letter-spacing: 0 !important;
      }

      .ssn-hero-desc,
      .ssn-section-sub,
      .ssn-section-header p,
      .ssn-gallery-head p,
      .ssn-cta-inner p,
      .qz-hero p,
      .sm-subtitle,
      .ssn-card-body p,
      .ssn-footer-desc {
        color: var(--sm-muted) !important;
      }

      .ssn-badge,
      .ssn-section-kicker,
      .qz-badge,
      .sm-logo-dot,
      .sm-title em,
      .ssn-hero-title em,
      .ssn-hero-title .accent,
      .ssn-gallery-head h2 em,
      .ssn-vision-content em,
      .ssn-contact-hours span,
      .ssn-foot a,
      .sm-foot a,
      .sm-forgot {
        color: var(--sm-brand) !important;
      }

      .ssn-badge,
      .qz-badge {
        background: rgba(255,255,255,0.92) !important;
        border-color: rgba(10,10,10,0.08) !important;
        box-shadow: 0 14px 34px rgba(10,10,10,0.06) !important;
        color: var(--sm-brand) !important;
        font-weight: 800 !important;
      }

      .ssn-btn-main,
      .ssn-btn-buy,
      .ssn-btn-order,
      .ssn-cta,
      .sm-submit,
      .qz-btn-primary,
      .btn-primary-glow,
      .btn-send,
      .ssn-mobile-cart,
      [style*="background: #4a4ade"],
      [style*="background:#4a4ade"],
      [style*="background: rgb(74, 74, 222)"],
      [style*="background: #f97316"],
      [style*="background:#f97316"],
      [style*="background: rgb(249, 115, 22)"] {
        background: var(--sm-brand) !important;
        border-color: var(--sm-brand) !important;
        color: #ffffff !important;
      }

      .ssn-btn-main:hover,
      .ssn-btn-buy:hover,
      .ssn-btn-order:hover,
      .ssn-cta:hover,
      .sm-submit:hover:not(:disabled),
      .qz-btn-primary:hover {
        background: var(--sm-brand-dark) !important;
        box-shadow: 0 16px 36px rgba(183, 139, 63, 0.22) !important;
      }

      .ssn-btn-secondary:hover,
      .ssn-gal-btn:hover,
      .sm-social:hover,
      .ssn-size:hover,
      .qz-option:hover,
      .qz-option.active,
      .sm-input:focus,
      [style*="border-color: #4a4ade"],
      [style*="border-color:#4a4ade"],
      [style*="border-color: #f97316"],
      [style*="border-color:#f97316"] {
        border-color: var(--sm-brand) !important;
        color: var(--sm-brand) !important;
        box-shadow: 0 0 0 4px rgba(183, 139, 63, 0.08) !important;
      }

      .ssn-card,
      .ssn-quiz-card,
      .ssn-pack-card,
      .ssn-help-card,
      .ssn-value-card,
      .ssn-flash-card,
      .ssn-faq-card,
      .ssn-contact-card,
      .ssn-gal-card,
      .sm-card,
      .qz-card,
      .glass-card,
      [style*="background: #ffffff"],
      [style*="background: #fff"],
      [style*="background-color: #ffffff"],
      [style*="background-color: #fff"] {
        border-color: var(--sm-border) !important;
      }

      .ssn-card,
      .ssn-pack-card,
      .ssn-flash-card,
      .ssn-value-card,
      .ssn-faq-card,
      .ssn-contact-card,
      .sm-card,
      .qz-card {
        border-radius: 8px !important;
        box-shadow: 0 18px 46px rgba(21,21,34,0.07) !important;
      }

      .ssn-card:hover,
      .ssn-pack-card:hover,
      .ssn-flash-card:hover,
      .ssn-value-card:hover,
      .ssn-faq-card:hover {
        transform: translateY(-5px) !important;
        box-shadow: 0 26px 70px rgba(21,21,34,0.13) !important;
      }

      .ssn-card-img,
      .ssn-flash-card-img,
      .ssn-pack-img,
      .ssn-value-icon,
      .ssn-pack-item-icon,
      .ssn-faq-icon-wrap {
        background: linear-gradient(145deg, #f8f3ed, #ffffff) !important;
      }

      .ssn-tag,
      .ssn-discount,
      .ssn-flash-discount,
      .ssn-flash-tag,
      .ssn-pack-badge,
      .ssn-pack-discount-pill {
        background: var(--sm-brand) !important;
        color: #ffffff !important;
      }

      .ssn-rating,
      .ssn-flash-time,
      .ssn-pack-discount-pill {
        background: var(--sm-gold-soft) !important;
        border-color: rgba(244,200,79,0.42) !important;
        color: var(--sm-ink) !important;
      }

      .ssn-new-price,
      .ssn-price,
      .ssn-pack-new,
      .ssn-current-price,
      .ssn-price-main {
        color: var(--sm-ink) !important;
      }

      .ssn-filters button,
      .qz-option,
      .sm-tab,
      .ssn-size,
      .ssn-size-btn,
      .ssn-size-opt,
      .ssn-size-item {
        border-radius: 999px !important;
      }

      [style*="background: #fdf6ef"],
      [style*="background:#fdf6ef"],
      [style*="background: rgb(253, 246, 239)"],
      [style*="background-color: #fdf6ef"],
      [style*="background-color:#fdf6ef"],
      [style*="background: #fff7ed"],
      [style*="background:#fff7ed"],
      [style*="background: rgb(255, 247, 237)"] {
        background: var(--sm-bg) !important;
      }

      [style*="color: #4a4ade"],
      [style*="color:#4a4ade"],
      [style*="color: rgb(74, 74, 222)"],
      [style*="color: #f97316"],
      [style*="color:#f97316"],
      [style*="color: rgb(249, 115, 22)"] {
        color: var(--sm-brand) !important;
      }

      [style*="background: #1a1a2e"],
      [style*="background:#1a1a2e"],
      [style*="background: #0f172a"],
      [style*="background:#0f172a"],
      [style*="background: rgb(26, 26, 46)"] {
        background: var(--sm-ink) !important;
      }

      [style*="color: #1a1a2e"],
      [style*="color:#1a1a2e"],
      [style*="color: #0f172a"],
      [style*="color:#0f172a"] {
        color: var(--sm-ink) !important;
      }

      .ssn-dot.active,
      .ssn-progress-bar,
      .qz-progress-fill,
      .qz-step-num,
      .sm-check.on,
      .sm-logo-dot {
        background: var(--sm-brand) !important;
      }

      .theme-toggle {
        color: var(--sm-brand) !important;
        border-color: rgba(10,10,10,0.18) !important;
      }
      .theme-toggle__icon {
        background: var(--sm-brand) !important;
        color: #ffffff !important;
      }
    `}</style>
  );
}

const PRIVATE_PREFIXES = [
  "/admin-dashboard",
  "/admin",
  "/manage-",
  "/add-employer",
  "/profile",
  "/employee-dashboard",
  "/employer",
  "/client-",
  "/login",
];

const CHATBOT_HIDE_PREFIXES = [
  "/admin-dashboard",
  "/admin",
  "/manage-",
  "/add-employer",
  "/profile",
  "/employee-dashboard",
  "/employer",
];

// App-level auth helpers now use shared utility functions
const isLoggedIn = () => Boolean(getToken());

const ProtectedRoute = ({ element, allowedRoles }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  const user = getStoredUser();
  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!hasAccess(user, allowedRoles)) {
      return <Navigate to="/login" replace />;
    }
  }

  return element;
};

function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
      title={isDark ? "Mode clair" : "Mode sombre"}
    >
      <span className="theme-toggle__icon">{isDark ? "☀" : "☾"}</span>
      <span className="theme-toggle__label">{isDark ? "Clair" : "Sombre"}</span>
    </button>
  );
}

function AppLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setVisible(false), 650);
    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!visible) return null;

  return (
    <div className="sm-app-loader" role="status" aria-label="Chargement">
      <svg className="sm-app-loader-circular" viewBox="25 25 50 50" aria-hidden="true">
        <circle className="sm-app-loader-path" cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10"></circle>
      </svg>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const hideOnPaths = ["/employer/orders", "/employer/inventory", "/admin-dashboard", "/admin/dashboard", "/manage-managers", "/manage-", "/add-employer", "/profile", "/products"];
  const hideForEmployer = location.pathname.startsWith("/employer");
  const showThemeToggle = PRIVATE_PREFIXES.some((path) => location.pathname.startsWith(path)) && !hideOnPaths.some(p => location.pathname.startsWith(p)) && !hideForEmployer;
  const showWhatsAppWidget = false;
  const showChatbot = !CHATBOT_HIDE_PREFIXES.some((path) => location.pathname.startsWith(path));
  const [chatbotReady, setChatbotReady] = useState(false);
  const [toastTheme, setToastTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    const syncTheme = () => setToastTheme(document.documentElement.dataset.theme || "light");
    syncTheme();
    const observer = new window.MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    if (window.history && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        send_to: "GLA",
        page_path: location.pathname + location.search,
        page_location: window.location.href,
      });
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!showThemeToggle) {
      document.documentElement.dataset.theme = "light";
    }
  }, [showThemeToggle]);

  useEffect(() => {
    if (!showChatbot) {
      setChatbotReady(false);
      return undefined;
    }

    const scheduleIdle = window.requestIdleCallback || ((callback) => window.setTimeout(callback, 2500));
    const cancelIdle = window.cancelIdleCallback || window.clearTimeout;
    const idleId = scheduleIdle(() => setChatbotReady(true));
    return () => cancelIdle(idleId);
  }, [showChatbot]);

  return (
    <div className="App">
      <style>{`
        .sm-app-loader {
          position: fixed;
          inset: 0;
          z-index: 9000;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.94);
        }
        .sm-app-loader-circular {
          width: 54px;
          height: 54px;
          animation: sm-loader-rotate 1.4s linear infinite;
        }
        .sm-app-loader-path {
          stroke: #0a0a0a;
          stroke-linecap: round;
          animation: sm-loader-dash 1.4s ease-in-out infinite;
        }
        @keyframes sm-loader-rotate {
          100% { transform: rotate(360deg); }
        }
        @keyframes sm-loader-dash {
          0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
          50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
          100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
        }
      `}</style>
      <AppLoader />
      <SEO />
      <TopContactHeader />
      <NavBar />
      {showThemeToggle && <ThemeToggle />}
      <Breadcrumbs />
      {showWhatsAppWidget && <WhatsAppWidget />}
      <CookiesModal />
      <PromoModal />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={toastTheme === "dark" && showThemeToggle ? "dark" : "light"}
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
        progressClassName="custom-toast-progress"
      />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />

        <Route path="/login" element={<Auth />} />
        <Route path="/login/admin" element={<Auth role="admin" />} />
        <Route path="/login/employee" element={<Auth role="employee" />} />
        <Route path="/login/manager" element={<Auth role="gestionnaire" />} />
        <Route path="/login/client" element={<Auth role="client" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/products" element={<Products />} />
        <Route path="/nos-matelas" element={<Matelas />} />
        <Route path="/promos" element={<Promos />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        <Route path="/about" element={<About />} />
        <Route path="/b2b-export" element={<B2BExport />} />
        <Route path="/roadmap-international" element={<InternationalRoadmap />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/legal-terms" element={<LegalTerms />} />

        <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} element={<AdminDashboard />} />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} element={<AdminDashboard />} />} />
        <Route path="/client-dashboard" element={<ProtectedRoute allowedRoles={[ROLES.CLIENT, ROLES.USER]} element={<ClientDashboard />} />} />
        <Route path="/client-orders" element={<ProtectedRoute allowedRoles={[ROLES.CLIENT, ROLES.USER]} element={<ClientMyOrders />} />} />
        <Route path="/client-reviews" element={<ProtectedRoute allowedRoles={[ROLES.CLIENT, ROLES.USER]} element={<ClientReviews />} />} />
        <Route path="/client-recommendations" element={<ProtectedRoute allowedRoles={[ROLES.CLIENT, ROLES.USER]} element={<ClientRecommendations />} />} />
        <Route path="/employee-dashboard" element={<ProtectedRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.MANAGER, ROLES.GESTIONNAIRE, ROLES.ADMIN]} element={<EmployeeDashboard />} />} />
        <Route path="/employer/dashboard" element={<ProtectedRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.MANAGER, ROLES.GESTIONNAIRE, ROLES.ADMIN]} element={<EmployeeDashboard />} />} />
        <Route path="/employer/orders" element={<ProtectedRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.MANAGER, ROLES.GESTIONNAIRE, ROLES.ADMIN]} element={<EmployeeOrders />} />} />
        <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} element={<AdminOrders />} />} />
        <Route path="/employer/inventory" element={<ProtectedRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.MANAGER, ROLES.GESTIONNAIRE, ROLES.ADMIN]} element={<EmployeeStock />} />} />
        <Route path="/employer/clients" element={<ProtectedRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.MANAGER, ROLES.GESTIONNAIRE, ROLES.ADMIN]} element={<EmployeeClients />} />} />
        <Route path="/employer/profile" element={<ProtectedRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.MANAGER, ROLES.GESTIONNAIRE, ROLES.ADMIN]} element={<EmployeeProfile />} />} />
        <Route path="/profile" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} element={<Profile />} />} />
        <Route path="/manage-clients" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} element={<ManageClients />} />} />
        <Route path="/manage-managers" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} element={<ManageManagers />} />} />
        <Route path="/add-employer" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} element={<AddEmployer />} />} />
        <Route path="/quiz" element={<Quiz />} />

        <Route path="/product/:slug" element={<ProductTemplate />} />
        <Route path="/product-detail/:productId" element={<ProductDetail />} />
        <Route path="/order-tracking" element={<OrderTracking />} />
        <Route path="/admin-panel" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} element={<AdminPanel />} />} />

        <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
      {showChatbot && chatbotReady && (
        <Suspense fallback={null}>
          <ChatbotAssistant />
        </Suspense>
      )}
      <Footer />
      <GlobalBrandTheme />
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
      <Suspense fallback={null}>
        <ReviewHost />
      </Suspense>
    </Router>
  );
}

export default App;

