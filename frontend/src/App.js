import React, { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { hasAccess, ROLES, getStoredUser, getToken } from "./utils/authUtils";
import HomeTemplate from "./pages/HomeTemplate";

import CookiesModal from "./components/CookiesModal";
import PromoModal from "./components/PromoModal";

import WhatsAppWidget from "./components/WhatsAppWidget";
import Breadcrumbs from "./components/Breadcrumbs";
import SEO from "./components/SEO";
import TopContactHeader from "./components/TopContactHeader";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import AppErrorBoundary from "./components/AppErrorBoundary";

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
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const NotFound = lazy(() => import("./pages/NotFound"));

function GlobalBrandTheme() {
  return (
    <style>{`
      :root {
        --sm-bg: #f7f3ec;
        --sm-surface: #fffdf8;
        --sm-surface-warm: #f3e9dc;
        --sm-ink: #1f2d35;
        --sm-text: #26343d;
        --sm-muted: #68747b;
        --sm-border: rgba(31, 45, 53, 0.14);
        --sm-brand: #b85c38;
        --sm-brand-dark: #8f4028;
        --sm-gold: #c89b5b;
        --sm-gold-soft: #f5e8d7;
        --sm-shadow: 0 18px 46px rgba(31, 45, 53, 0.10);
        --bg-dark: var(--sm-bg);
        --bg-card: var(--sm-surface);
        --accent-blue: var(--sm-brand);
        --accent-purple: var(--sm-gold);
        --text-main: var(--sm-text);
        --text-muted: var(--sm-muted);
        --glass-border: rgba(10, 10, 10, 0.08);
        --page-title-display: block;
        --direction-multiplier: 1;
        --e-global-color-text: #100739;
        --e-global-typography-text-font-family: "Noto Sans";
        --e-global-typography-text-font-size: 16px;
        --e-global-typography-text-font-weight: 400;
        --e-global-typography-text-line-height: 1.6em;
      }

      html, body, #root, .App {
        background: var(--sm-bg) !important;
        color: var(--e-global-color-text) !important;
        font-family: var(--e-global-typography-text-font-family), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        font-size: var(--e-global-typography-text-font-size) !important;
        font-weight: var(--e-global-typography-text-font-weight) !important;
        line-height: var(--e-global-typography-text-line-height) !important;
      }

      .ssn-page,
      .qz-page,
      .sm-auth-page {
        background: var(--sm-bg) !important;
        color: var(--sm-text) !important;
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
      .ssn-btn-card,
      .ssn-card .ssn-btn-card,
      .ssn-brand-action,
      .ssn-hero-slider-btn,
      .ssn-showcase-cta-btn {
        background: linear-gradient(135deg, var(--sm-brand) 0%, var(--sm-brand-dark) 100%) !important;
        border-color: var(--sm-brand) !important;
        color: #ffffff !important;
      }

      .ssn-btn-main:hover,
      .ssn-btn-buy:hover,
      .ssn-btn-order:hover,
      .ssn-cta:hover,
      .sm-submit:hover:not(:disabled),
      .qz-btn-primary:hover,
      .ssn-brand-action:hover,
      .ssn-showcase-cta-btn:hover {
        background: linear-gradient(135deg, var(--sm-brand-dark) 0%, #71311f 100%) !important;
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

      .elementor *,
      .elementor ::after,
      .elementor ::before,
      *,
      ::after,
      ::before {
        box-sizing: border-box !important;
      }

      .elementor-element,
      .App {
        --widgets-spacing: 20px 20px;
        --widgets-spacing-row: 20px;
        --widgets-spacing-column: 20px;
        --flex-direction: initial;
        --flex-wrap: initial;
        --justify-content: initial;
        --align-items: initial;
        --align-content: initial;
        --gap: initial;
        --flex-basis: initial;
        --flex-grow: initial;
        --flex-shrink: initial;
        --order: initial;
        --align-self: initial;
      }

      .elementor-section .elementor-container,
      .ssn-container,
      .ssn-hero-inner,
      .ssn-products-inner,
      .ssn-star-mousse-inner,
      .ssn-reviews-inner,
      .ssn-footer-main,
      .ssn-footer-bottom {
        position: relative !important;
        width: 100% !important;
        max-width: 1300px !important;
        margin-inline: auto !important;
      }

      .elementor-section .elementor-container {
        display: flex !important;
      }

      .elementor-section.elementor-section-boxed > .elementor-container {
        max-width: 1300px !important;
      }

      .elementor-section.elementor-section-items-middle > .elementor-container,
      .ssn-hero-inner {
        align-items: center !important;
      }

      .elementor-118 .elementor-element.elementor-element-120907bb > .elementor-container,
      .ssn-hero-shell,
      .ssn-products-hero,
      .ssn-promo-hero,
      .ssn-about-hero,
      .ssn-help-hero {
        min-height: 600px !important;
      }

      /* Star Mousse full visual refresh */
      :root {
        --sm-bg: #f7f3ec;
        --sm-surface: #fffdf8;
        --sm-surface-warm: #f3e9dc;
        --sm-ink: #1f2d35;
        --sm-text: #26343d;
        --sm-muted: #68747b;
        --sm-border: rgba(31, 45, 53, 0.14);
        --sm-brand: #b85c38;
        --sm-brand-dark: #8f4028;
        --sm-gold: #c89b5b;
        --sm-gold-soft: #f5e8d7;
        --sm-coral: #c96a45;
        --sm-sky: #31515b;
        --sm-shadow: 0 18px 46px rgba(31, 45, 53, 0.10);
        --e-global-color-text: #100739;
        --e-global-typography-text-font-family: "Noto Sans";
        --e-global-typography-text-font-size: 16px;
        --e-global-typography-text-font-weight: 400;
        --e-global-typography-text-line-height: 1.6em;
        --bg-dark: var(--sm-bg);
        --bg-card: var(--sm-surface);
        --accent-blue: var(--sm-brand);
        --accent-purple: var(--sm-gold);
        --text-main: var(--sm-text);
        --text-muted: var(--sm-muted);
        --glass-border: rgba(10, 10, 10, 0.08);
      }

      html,
      body,
      #root,
      .App,
      .ssn-page,
      .qz-page,
      .sm-auth-page {
        background: var(--sm-bg) !important;
        color: var(--sm-text) !important;
      }

      .ssn-header,
      .ssn-nav,
      .ssn-mobile-panel,
      .ssn-mobile-bottom-panel {
        background: rgba(255, 253, 249, 0.98) !important;
        border-color: rgba(21, 60, 55, 0.12) !important;
        backdrop-filter: blur(18px) !important;
      }

      .ssn-header.scrolled {
        box-shadow: 0 16px 42px rgba(23, 33, 29, 0.1) !important;
      }

      .ssn-link,
      .ssn-dropdown-trigger,
      .ssn-mobile-link,
      .ssn-mobile-panel-item {
        color: #465b57 !important;
        letter-spacing: 0 !important;
      }

      .ssn-link:hover,
      .ssn-link.active,
      .ssn-dropdown-trigger:hover,
      .ssn-dropdown-trigger.active,
      .ssn-mobile-link:hover,
      .ssn-mobile-panel-item.active {
        color: #c85c35 !important;
      }

      .ssn-products-hero,
      .ssn-promo-hero,
      .ssn-about-hero,
      .ssn-help-hero,
      .sm-auth-page,
      .ssn-hero-shell {
        background:
          linear-gradient(135deg, rgba(31, 55, 65, 0.88), rgba(184, 92, 56, 0.74)),
          url('/showroom4.jpg') center/cover no-repeat !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;
      }

      .qz-hero {
        background:
          radial-gradient(circle at 8% 10%, rgba(200, 155, 91, 0.22), transparent 28%),
          linear-gradient(135deg, #fffdf8 0%, #f3e9dc 100%) !important;
        border-bottom: 1px solid var(--sm-border) !important;
      }

      .ssn-section-products,
      .ssn-section-values,
      .ssn-section-faq,
      .ssn-section-vision,
      .ssn-section-flash,
      .ssn-section-packs,
      .ssn-section-gallery,
      .ssn-section-contact,
      .ssn-section-cta,
      .ssn-star-mousse-section,
      .ssn-reviews-section,
      .ssn-section-quiz,
      .qz-section,
      .qz-main {
        background: linear-gradient(180deg, #fffdf8 0%, #f3e9dc 100%) !important;
        border-color: var(--sm-border) !important;
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
      .ssn-review-card,
      .ssn-star-mousse-card,
      .sm-card,
      .qz-card,
      .glass-card,
      .review-card,
      [style*="background: #ffffff"],
      [style*="background: #fff"],
      [style*="background-color: #ffffff"],
      [style*="background-color: #fff"] {
        background: rgba(255, 253, 248, 0.98) !important;
        border: 1px solid var(--sm-border) !important;
        border-radius: 8px !important;
        box-shadow: var(--sm-shadow) !important;
      }

      .ssn-card:hover,
      .ssn-pack-card:hover,
      .ssn-flash-card:hover,
      .ssn-value-card:hover,
      .ssn-faq-card:hover,
      .ssn-star-mousse-card:hover,
      .review-card:hover {
        transform: translateY(-4px) !important;
        box-shadow: 0 24px 60px rgba(23, 33, 29, 0.14) !important;
      }

      .ssn-btn-main,
      .ssn-btn-buy,
      .ssn-btn-order,
      .ssn-cta,
      .ssn-btn-primary,
      .ssn-account,
      .sm-submit,
      .qz-btn-primary,
      .btn-primary-glow,
      .btn-send,
      .ssn-mobile-search button,
      .ssn-star-mousse-cart,
      [style*="background: #4a4ade"],
      [style*="background:#4a4ade"],
      [style*="background: rgb(74, 74, 222)"],
      [style*="background: #f97316"],
      [style*="background:#f97316"],
      [style*="background: rgb(249, 115, 22)"] {
        background: linear-gradient(135deg, var(--sm-brand), var(--sm-brand-dark)) !important;
        border-color: transparent !important;
        color: #ffffff !important;
        border-radius: 8px !important;
        box-shadow: 0 12px 28px rgba(18, 71, 63, 0.18) !important;
      }

      .ssn-btn-main:hover,
      .ssn-btn-buy:hover,
      .ssn-btn-order:hover,
      .ssn-cta:hover,
      .ssn-btn-primary:hover,
      .ssn-account:hover,
      .sm-submit:hover:not(:disabled),
      .qz-btn-primary:hover,
      .btn-primary-glow:hover:not(:disabled) {
        background: linear-gradient(135deg, var(--sm-brand-dark), var(--sm-brand)) !important;
        box-shadow: 0 18px 38px rgba(18, 71, 63, 0.24) !important;
      }

      .ssn-login,
      .ssn-btn-secondary,
      .ssn-gal-btn,
      .sm-social,
      .qz-option,
      .ssn-size,
      .ssn-size-btn,
      .ssn-size-opt,
      .ssn-size-item,
      .ssn-star-mousse-step,
      .filter-select,
      input,
      select,
      textarea {
        background: #ffffff !important;
        border-color: var(--sm-border) !important;
        color: var(--sm-ink) !important;
        border-radius: 8px !important;
      }

      input:focus,
      select:focus,
      textarea:focus,
      .ssn-btn-secondary:hover,
      .ssn-gal-btn:hover,
      .sm-social:hover,
      .ssn-size:hover,
      .qz-option:hover,
      .qz-option.active,
      .sm-input:focus {
        border-color: var(--sm-brand) !important;
        color: var(--sm-brand) !important;
        box-shadow: 0 0 0 4px rgba(18, 71, 63, 0.1) !important;
      }

      .ssn-badge,
      .ssn-section-kicker,
      .qz-badge,
      .sm-title em,
      .ssn-hero-title em,
      .ssn-hero-title .accent,
      .ssn-gallery-head h2 em,
      .ssn-vision-content em,
      .ssn-contact-hours span,
      .ssn-foot a,
      .sm-foot a,
      .sm-forgot,
      .ssn-price,
      .ssn-new-price,
      .ssn-pack-new,
      .ssn-current-price,
      .ssn-price-main,
      .ssn-star-mousse-price {
        color: var(--sm-brand) !important;
      }

      .ssn-tag,
      .ssn-discount,
      .ssn-flash-discount,
      .ssn-flash-tag,
      .ssn-pack-badge,
      .ssn-pack-discount-pill,
      .ssn-star-mousse-badge {
        background: var(--sm-coral) !important;
        color: #ffffff !important;
        border-radius: 999px !important;
      }

      .ssn-rating,
      .ssn-flash-time,
      .review-stars-summary,
      .ssn-review-stars {
        background: var(--sm-gold-soft) !important;
        border-color: rgba(197, 155, 66, 0.38) !important;
        color: #6c4a08 !important;
      }

      .ssn-card-img,
      .ssn-flash-card-img,
      .ssn-pack-img,
      .ssn-value-icon,
      .ssn-pack-item-icon,
      .ssn-faq-icon-wrap,
      .ssn-star-mousse-image {
        background: linear-gradient(145deg, #eee4d5, #fffdf8) !important;
        border-radius: 8px !important;
      }

      .ssn-footer {
        background:
          linear-gradient(135deg, rgba(11, 48, 43, 0.98), rgba(23, 33, 29, 0.98)),
          url('/showroom6.jpg') center/cover no-repeat !important;
      }

      .admin-main,
      .employee-main,
      .client-main,
      .sm-internal-main {
        background: linear-gradient(180deg, #f7f3ec 0%, #fffdf8 100%) !important;
      }

      @media (max-width: 640px) {
        .ssn-products-hero,
        .ssn-promo-hero,
        .ssn-about-hero,
        .ssn-help-hero,
        .qz-hero,
        .sm-auth-page {
          background:
            linear-gradient(180deg, rgba(255, 253, 248, 0.97), rgba(243, 233, 220, 0.95)),
            url('/showroom4.jpg') center/cover no-repeat !important;
        }

        .ssn-hero-shell {
          background:
            linear-gradient(110deg, rgba(31,55,65,0.98) 0%, rgba(31,55,65,0.9) 46%, rgba(184,92,56,0.58) 100%),
            url('/showroom4.jpg') center/cover no-repeat !important;
        }
      }

      /* Final Star Mousse interface system */
      :root {
        --sm-bg: #f6f2eb;
        --sm-surface: #fffdf9;
        --sm-surface-warm: #efe4d5;
        --sm-ink: #20343b;
        --sm-text: #33464c;
        --sm-muted: #718087;
        --sm-border: rgba(32, 52, 59, 0.14);
        --sm-brand: #b85c38;
        --sm-brand-dark: #8f4028;
        --sm-gold: #c89b5b;
        --sm-gold-soft: #f5e8d7;
        --sm-radius: 16px;
        --sm-shadow: 0 18px 50px rgba(32, 52, 59, 0.1);
      }

      html,
      body,
      #root,
      .App {
        background: var(--sm-bg) !important;
        color: var(--sm-text) !important;
      }

      .ssn-header {
        background: rgba(255, 253, 249, 0.94) !important;
        border-bottom: 1px solid var(--sm-border) !important;
        box-shadow: 0 8px 30px rgba(32, 52, 59, 0.06) !important;
        backdrop-filter: blur(18px) !important;
      }

      .ssn-nav {
        min-height: 76px !important;
      }

      .ssn-logo,
      .ssn-link,
      .ssn-dropdown-trigger,
      .ssn-account,
      .ssn-login,
      .ssn-cart,
      .ssn-mobile-header-icon {
        color: var(--sm-ink) !important;
      }

      .ssn-logo {
        font-weight: 800 !important;
        letter-spacing: -0.03em !important;
      }

      .ssn-logo::before {
        background: var(--sm-brand) !important;
      }

      .ssn-link:hover,
      .ssn-dropdown-trigger:hover,
      .ssn-account:hover,
      .ssn-login:hover,
      .ssn-cart:hover {
        color: var(--sm-brand) !important;
      }

      .ssn-search {
        background: var(--sm-bg) !important;
        border-color: var(--sm-border) !important;
      }

      .ssn-search input {
        color: var(--sm-ink) !important;
      }

      .ssn-dropdown-menu {
        background: var(--sm-surface) !important;
        border: 1px solid var(--sm-border) !important;
        border-radius: var(--sm-radius) !important;
        box-shadow: var(--sm-shadow) !important;
      }

      .ssn-dropdown-menu a:hover,
      .ssn-menu-title:hover {
        background: var(--sm-surface-warm) !important;
        color: var(--sm-brand-dark) !important;
      }

      .ssn-cta-pill,
      .ssn-mobile-cart,
      .ssn-btn-main,
      .ssn-btn-buy,
      .ssn-btn-order,
      .ssn-cta,
      .ssn-btn-card,
      .sm-submit,
      .qz-btn-primary {
        background: var(--sm-brand) !important;
        border-color: var(--sm-brand) !important;
        border-radius: 999px !important;
        box-shadow: 0 10px 24px rgba(184, 92, 56, 0.18) !important;
      }

      .ssn-cta-pill:hover,
      .ssn-mobile-cart:hover,
      .ssn-btn-main:hover,
      .ssn-btn-buy:hover,
      .ssn-btn-order:hover,
      .ssn-cta:hover,
      .ssn-btn-card:hover,
      .sm-submit:hover:not(:disabled) {
        background: var(--sm-brand-dark) !important;
        border-color: var(--sm-brand-dark) !important;
        transform: translateY(-2px);
      }

      .ssn-card,
      .ssn-pack-card,
      .ssn-flash-card,
      .ssn-value-card,
      .ssn-faq-card,
      .ssn-contact-card,
      .ssn-gal-card,
      .sm-card,
      .qz-card,
      .glass-card {
        background: var(--sm-surface) !important;
        border: 1px solid var(--sm-border) !important;
        border-radius: var(--sm-radius) !important;
        box-shadow: var(--sm-shadow) !important;
      }

      .ssn-card:hover,
      .ssn-pack-card:hover,
      .ssn-flash-card:hover,
      .ssn-value-card:hover,
      .ssn-faq-card:hover {
        box-shadow: 0 24px 60px rgba(32, 52, 59, 0.15) !important;
      }

      .ssn-hero-title,
      .ssn-section-title,
      .ssn-section-header h2,
      .ssn-gallery-head h2,
      .ssn-cta-inner h2,
      .qz-hero h1,
      .qz-card h2,
      .sm-title,
      .sm-headline {
        color: var(--sm-ink) !important;
      }

      .ssn-hero-desc,
      .ssn-section-sub,
      .ssn-section-header p,
      .ssn-gallery-head p,
      .ssn-cta-inner p,
      .qz-hero p,
      .sm-subtitle,
      .sm-desc {
        color: var(--sm-muted) !important;
      }

      .ssn-badge,
      .ssn-section-kicker,
      .qz-badge,
      .sm-logo-dot,
      .sm-title em,
      .sm-headline em {
        color: var(--sm-brand) !important;
      }

      .ssn-page,
      .qz-page,
      .sm-internal-main,
      .admin-main,
      .employee-main,
      .client-main {
        background: var(--sm-bg) !important;
      }

      .ssn-mobile-panel,
      .ssn-mobile-bottom-panel {
        background: rgba(255, 253, 249, 0.98) !important;
        border-color: var(--sm-border) !important;
      }

      .ssn-mobile-link,
      .ssn-mobile-login,
      .ssn-mobile-panel-item {
        color: var(--sm-ink) !important;
      }

      .ssn-footer {
        background: linear-gradient(135deg, #20343b 0%, #31515b 100%) !important;
      }

      .sm-app-loader {
        background: rgba(246, 242, 235, 0.96) !important;
      }

      .sm-app-loader-path {
        stroke: var(--sm-brand) !important;
      }

      /* Authentication uses the same warm premium system as the storefront. */
      .sm-auth {
        background: var(--sm-bg) !important;
      }

      .sm-left {
        background: linear-gradient(145deg, #20343b 0%, #31515b 62%, #8f4028 150%) !important;
      }

      .sm-left-bg {
        background:
          radial-gradient(circle at 18% 20%, rgba(200, 155, 91, 0.32), transparent 28%),
          linear-gradient(145deg, #20343b 0%, #31515b 62%, #8f4028 150%) !important;
      }

      .sm-blob-1 {
        background: var(--sm-gold) !important;
      }

      .sm-blob-2 {
        background: var(--sm-brand) !important;
      }

      .sm-blob-3 {
        background: #e7c58f !important;
      }

      .sm-headline em,
      .sm-logo-dot,
      .sm-check.on {
        color: var(--sm-gold) !important;
        background: var(--sm-gold) !important;
      }

      .sm-right {
        background: var(--sm-surface) !important;
      }

      .sm-tabs {
        background: var(--sm-bg) !important;
      }

      .sm-tab.active {
        color: var(--sm-ink) !important;
        background: var(--sm-surface) !important;
        box-shadow: 0 6px 18px rgba(32, 52, 59, 0.1) !important;
      }

      .sm-input {
        background: var(--sm-surface) !important;
        border-color: var(--sm-border) !important;
        color: var(--sm-ink) !important;
        border-radius: 12px !important;
      }

      .sm-input:focus {
        border-color: var(--sm-brand) !important;
        box-shadow: 0 0 0 4px rgba(184, 92, 56, 0.14) !important;
      }

      /* Consistent internal navigation surfaces. */
      .admin-sidebar,
      .employee-sidebar,
      .client-sidebar {
        background: #20343b !important;
        border-color: rgba(255,255,255,0.12) !important;
      }

      .admin-mobile-bar,
      .employee-mobile-bar,
      .client-mobile-bar {
        background: var(--sm-surface) !important;
        border-color: var(--sm-border) !important;
        color: var(--sm-ink) !important;
      }

      .sidebar-nav a,
      .sidebar-nav button {
        border-radius: 10px !important;
      }

      .sm-route-loading {
        min-height: 40vh;
        display: grid;
        place-items: center;
        color: var(--sm-ink);
        font-size: 15px;
        font-weight: 700;
      }

      .sm-runtime-error {
        min-height: 70vh;
        display: grid;
        place-items: center;
        padding: 32px 20px;
        background: var(--sm-bg);
      }

      .sm-runtime-error-card {
        max-width: 520px;
        padding: 42px 34px;
        color: var(--sm-ink);
        background: var(--sm-surface);
        border: 1px solid var(--sm-border);
        border-radius: 24px;
        box-shadow: var(--sm-shadow);
        text-align: center;
      }

      .sm-runtime-error-mark {
        width: 48px;
        height: 48px;
        display: grid;
        place-items: center;
        margin: 0 auto 18px;
        color: #fff;
        background: var(--sm-brand);
        border-radius: 50%;
        font-size: 24px;
        font-weight: 800;
      }

      .sm-runtime-error-kicker {
        margin: 0 0 8px;
        color: var(--sm-brand);
        font-size: 11px;
        font-weight: 800;
        letter-spacing: .14em;
        text-transform: uppercase;
      }

      .sm-runtime-error-card h1 {
        margin: 0 0 12px;
        color: var(--sm-ink);
        font-family: var(--font-serif), Georgia, serif;
        font-size: clamp(1.8rem, 4vw, 2.5rem);
      }

      .sm-runtime-error-card p:not(.sm-runtime-error-kicker) {
        margin: 0;
        color: var(--sm-muted);
        line-height: 1.7;
      }

      .sm-runtime-error-card button {
        min-height: 48px;
        margin-top: 24px;
        padding: 0 22px;
        color: #fff;
        background: var(--sm-brand);
        border: 0;
        border-radius: 999px;
        font-weight: 800;
        cursor: pointer;
      }

      .sm-runtime-error-card button:hover {
        background: var(--sm-brand-dark);
      }

      .sm-checkout-page {
        color: var(--sm-ink);
        background: var(--sm-bg) !important;
      }

      .sm-checkout-page .max-w-2xl {
        max-width: 1080px;
      }

      .sm-checkout-page h1,
      .sm-checkout-page h2 {
        color: var(--sm-ink) !important;
      }

      .sm-checkout-page form,
      .sm-checkout-page .bg-white {
        background: var(--sm-surface) !important;
        border: 1px solid var(--sm-border);
        border-radius: 24px !important;
        box-shadow: var(--sm-shadow) !important;
      }

      .sm-checkout-page input:not([type="radio"]):not([type="checkbox"]),
      .sm-checkout-page select,
      .sm-checkout-page textarea {
        min-height: 48px;
        color: var(--sm-ink);
        background: #fff;
        border: 1px solid #d8d1c5 !important;
        border-radius: 12px !important;
      }

      .sm-checkout-page input:focus,
      .sm-checkout-page select:focus,
      .sm-checkout-page textarea:focus {
        border-color: var(--sm-brand) !important;
        box-shadow: 0 0 0 3px rgba(184,92,56,.15) !important;
      }

      .sm-checkout-page .text-gray-600,
      .sm-checkout-page .text-gray-700 {
        color: var(--sm-muted) !important;
      }

      .sm-checkout-page .bg-gray-50 {
        background: var(--sm-surface-warm) !important;
      }

      .sm-checkout-page .bg-blue-600 {
        background: var(--sm-brand) !important;
      }

      .sm-checkout-page [class~="hover:bg-blue-700"]:hover {
        background: var(--sm-brand-dark) !important;
      }

      .sm-checkout-steps {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: -20px 0 26px;
        color: var(--sm-muted);
        font-size: 12px;
        font-weight: 800;
        letter-spacing: .03em;
        text-transform: uppercase;
      }

      .sm-checkout-steps span {
        padding: 8px 12px;
        background: rgba(255,253,248,.72);
        border: 1px solid var(--sm-border);
        border-radius: 999px;
      }

      .sm-checkout-steps .is-active {
        color: #fff;
        background: var(--sm-ink);
        border-color: var(--sm-ink);
      }

      @media (max-width: 768px) {
        .ssn-nav {
          min-height: 64px !important;
        }

        .ssn-header {
          box-shadow: 0 5px 20px rgba(32, 52, 59, 0.08) !important;
        }

        .sm-left {
          min-height: 320px !important;
          padding: 32px 24px !important;
        }

        .sm-left-footer,
        .sm-pills {
          display: none !important;
        }

        .sm-right {
          padding: 34px 20px !important;
        }

        .sm-checkout-steps {
          flex-wrap: wrap;
          margin-top: -12px;
        }
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
    const sendPageView = () => {
      if (window.STAR_MOUSSE_ANALYTICS_CONSENT !== true || typeof window.gtag !== "function") return;
      window.gtag("event", "page_view", {
        send_to: window.STAR_MOUSSE_GA_ID,
        page_path: location.pathname + location.search,
        page_location: window.location.href,
      });
    };
    const handleConsent = (event) => {
      if (event.detail?.analytics === true) sendPageView();
    };
    sendPageView();
    window.addEventListener("cookie-preferences-saved", handleConsent);
    return () => window.removeEventListener("cookie-preferences-saved", handleConsent);
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
    <div className="App bs-ecommerce-shell">
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
      <AppErrorBoundary>
        <Suspense fallback={<div className="sm-route-loading" role="status">Chargement…</div>}>
          <Routes>
          <Route path="/" element={<HomeTemplate />} />

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
        <Route path="/order-tracking" element={<OrderTracking />} />
        <Route path="/admin-panel" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} element={<AdminPanel />} />} />

        <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AppErrorBoundary>
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
