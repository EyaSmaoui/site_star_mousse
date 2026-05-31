import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { hasAccess, ROLES } from "./utils/authUtils";

import Home from "./pages/Home";
import Auth from "./pages/Auth/Auth";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import Products from "./pages/Store/Articles";
import Promos from "./pages/Store/Promos";
import Cart from "./pages/Store/Cart";
import About from "./pages/Info/About";
import Help from "./pages/Info/Help";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Profile from "./pages/Admin/Profile";
import ManageClients from "./pages/Admin/ManageClients";
import ManageManagers from "./pages/Admin/ManageManagers";
import AddEmployer from "./pages/Admin/AddEmployer";
import Quiz from "./quiz";
import ClientDashboard from "./pages/Client/ClientDashboard";
import ClientMyOrders from "./pages/Client/ClientMyOrders";
import ClientReviews from "./pages/Client/ClientReviews";
import ClientRecommendations from "./pages/Client/ClientRecommendations";
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard";
import EmployeeOrders from "./pages/Employee/EmployeeOrders";
import EmployeeStock from "./pages/Employee/EmployeeStock";
import EmployeeProfile from "./pages/Employee/EmployeeProfile";
import EmployeeClients from "./pages/Employee/EmployeeClients";
import EmployeeSettings from "./pages/Employee/EmployeeSettings";
import AdminOrders from "./pages/Admin/AdminOrders";
import ChatbotAssistant from "./components/ChatbotAssistant";

import {
  RelaxPlus,
  MedicoPlus,
  Tendresse,
  VenisePlus,
  SoftPlus,
  ConfortPlus,
  RelaxPillow,
  TendressePillow,
  MedicoPillow,
  VenisePillow,
  GelPillow,
  AromaLavande,
  AromaMenthe,
  OceanPuff,
  AnatoliaGel,
  BebeConfortPlus,
  BebeSoft,
  BebeVenise,
} from "./pages/Product/index.js";

function GlobalBrandTheme() {
  return (
    <style>{`
      :root {
        --sm-bg: #fbfaf8;
        --sm-surface: #ffffff;
        --sm-surface-warm: #f8f3ed;
        --sm-ink: #151522;
        --sm-text: #242436;
        --sm-muted: #6f7180;
        --sm-border: #ebe6df;
        --sm-brand: #b52f2f;
        --sm-brand-dark: #8f2424;
        --sm-gold: #f4c84f;
        --sm-gold-soft: #fff5cf;
        --sm-shadow: 0 22px 60px rgba(21, 21, 34, 0.1);
        --bg-dark: var(--sm-bg);
        --bg-card: var(--sm-surface);
        --accent-blue: var(--sm-brand);
        --accent-purple: var(--sm-gold);
        --text-main: var(--sm-text);
        --text-muted: var(--sm-muted);
        --glass-border: rgba(21, 21, 34, 0.1);
      }

      html, body, #root, .App {
        background: var(--sm-bg) !important;
        color: var(--sm-text) !important;
        font-family: 'DM Sans', 'Segoe UI', system-ui, -apple-system, sans-serif !important;
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
          radial-gradient(circle at 12% 18%, rgba(181,47,47,0.08), transparent 28%),
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
        background: rgba(255,255,255,0.82) !important;
        border-color: rgba(181,47,47,0.16) !important;
        box-shadow: 0 14px 34px rgba(21,21,34,0.06) !important;
        color: var(--sm-brand) !important;
        font-weight: 800 !important;
      }

      .ssn-btn-primary,
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

      .ssn-btn-primary:hover,
      .ssn-btn-main:hover,
      .ssn-btn-buy:hover,
      .ssn-btn-order:hover,
      .ssn-cta:hover,
      .sm-submit:hover:not(:disabled),
      .qz-btn-primary:hover {
        background: var(--sm-brand-dark) !important;
        box-shadow: 0 16px 36px rgba(181, 47, 47, 0.22) !important;
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
        box-shadow: 0 0 0 4px rgba(181, 47, 47, 0.08) !important;
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
        border-color: rgba(181,47,47,0.22) !important;
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

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return null;
  }
};

const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  return Boolean(token && token !== 'null' && token !== 'undefined');
};

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

function AppContent() {
  const location = useLocation();
  const showThemeToggle = PRIVATE_PREFIXES.some((path) => location.pathname.startsWith(path));
  const showChatbot = !CHATBOT_HIDE_PREFIXES.some((path) => location.pathname.startsWith(path));
  const [toastTheme, setToastTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    const syncTheme = () => setToastTheme(document.documentElement.dataset.theme || "light");
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!showThemeToggle) {
      document.documentElement.dataset.theme = "light";
    }
  }, [showThemeToggle]);

  return (
    <div className="App">
      {showThemeToggle && <ThemeToggle />}
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
      />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Auth />} />
        <Route path="/login/admin" element={<Auth role="admin" />} />
        <Route path="/login/employee" element={<Auth role="employee" />} />
        <Route path="/login/client" element={<Auth role="client" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/products" element={<Products />} />
        <Route path="/promos" element={<Promos />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />

        <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} element={<AdminDashboard />} />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} element={<AdminDashboard />} />} />
        <Route path="/client-dashboard" element={<ProtectedRoute allowedRoles={[ROLES.CLIENT, ROLES.USER]} element={<ClientDashboard />} />} />
        <Route path="/client-orders" element={<ProtectedRoute allowedRoles={[ROLES.CLIENT, ROLES.USER]} element={<ClientMyOrders />} />} />
        <Route path="/client-reviews" element={<ProtectedRoute allowedRoles={[ROLES.CLIENT, ROLES.USER]} element={<ClientReviews />} />} />
        <Route path="/client-recommendations" element={<ProtectedRoute allowedRoles={[ROLES.CLIENT, ROLES.USER]} element={<ClientRecommendations />} />} />
        <Route path="/employee-dashboard" element={<ProtectedRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.MANAGER, ROLES.ADMIN]} element={<EmployeeDashboard />} />} />
        <Route path="/employer/dashboard" element={<ProtectedRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.MANAGER, ROLES.ADMIN]} element={<EmployeeDashboard />} />} />
        <Route path="/employer/orders" element={<ProtectedRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.MANAGER, ROLES.ADMIN]} element={<EmployeeOrders />} />} />
        <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} element={<AdminOrders />} />} />
        <Route path="/employer/inventory" element={<ProtectedRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.MANAGER, ROLES.ADMIN]} element={<EmployeeStock />} />} />
        <Route path="/employer/clients" element={<ProtectedRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.MANAGER, ROLES.ADMIN]} element={<EmployeeClients />} />} />
        <Route path="/employer/profile" element={<ProtectedRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.MANAGER, ROLES.ADMIN]} element={<EmployeeProfile />} />} />
        <Route path="/employer/settings" element={<ProtectedRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.MANAGER, ROLES.ADMIN]} element={<EmployeeSettings />} />} />
        <Route path="/profile" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} element={<Profile />} />} />
        <Route path="/manage-clients" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} element={<ManageClients />} />} />
        <Route path="/manage-managers" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} element={<ManageManagers />} />} />
        <Route path="/add-employer" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} element={<AddEmployer />} />} />
        <Route path="/quiz" element={<Quiz />} />

        <Route path="/product/relax-plus" element={<RelaxPlus />} />
        <Route path="/product/medico-plus" element={<MedicoPlus />} />
        <Route path="/product/tendresse" element={<Tendresse />} />
        <Route path="/product/venise-plus" element={<VenisePlus />} />
        <Route path="/product/soft-plus" element={<SoftPlus />} />
        <Route path="/product/confort-plus" element={<ConfortPlus />} />
        <Route path="/product/relax-pillow" element={<RelaxPillow />} />
        <Route path="/product/tendresse-pillow" element={<TendressePillow />} />
        <Route path="/product/medico-pillow" element={<MedicoPillow />} />
        <Route path="/product/venise-pillow" element={<VenisePillow />} />
        <Route path="/product/gel-pillow" element={<GelPillow />} />
        <Route path="/product/aroma-lavande" element={<AromaLavande />} />
        <Route path="/product/aroma-menthe" element={<AromaMenthe />} />
        <Route path="/product/ocean-puff" element={<OceanPuff />} />
        <Route path="/product/anatolia-gel" element={<AnatoliaGel />} />
        <Route path="/product/bebe-confort-plus" element={<BebeConfortPlus />} />
        <Route path="/product/bebe-soft" element={<BebeSoft />} />
        <Route path="/product/bebe-venise" element={<BebeVenise />} />

        <Route path="*" element={<Home />} />
      </Routes>
      {showChatbot && <ChatbotAssistant />}
      <GlobalBrandTheme />
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  );
}

export default App;
