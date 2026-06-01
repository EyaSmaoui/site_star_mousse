# 🚀 Next.js 14 Migration Plan — Star Mousse

**Status:** READY FOR IMPLEMENTATION  
**Priority:** PHASE 2 (Weeks 2-3)  
**Impact:** +300% SEO visibility, -70% FCP time, +40% conversion (faster loads)

---

## 📋 EXECUTIVE SUMMARY

**Current State:**
- React 18 SPA (Single Page Application) with react-router-dom
- 100% Client-Side Rendering (CSR) = 0% Google indexation
- ~30 routes, 15+ page components
- Backend: Node.js Express API @ http://localhost:5000
- Hosted on Vercel (static build only)

**Target State:**
- Next.js 14 with App Router
- Server-Side Rendering (SSR) for public pages + Static Site Generation (SSG) for products
- All routes migrated maintaining backward compatibility
- API routes proxying to existing backend
- Full SEO optimization (sitemap, robots, open graph per-page)
- Performance: FCP <1.5s (vs current 5-8s)

**Timeline:** 40-50 hours (3-5 days of focused work)  
**Risk Level:** MEDIUM (complex migration, but isolated from production)

---

## 🗺️ ROUTE MAPPING & PRIORITY

### TIER 1: PUBLIC PAGES (SSR) — HIGHEST PRIORITY
These pages need Google visibility + SEO. Use Next.js SSR.

| Route | Component | Status | SSR/SSG | Effort | Notes |
|-------|-----------|--------|---------|--------|-------|
| `/` | Home | ✅ Exists | SSR | 3h | Hero + ProductShowcase + testimonials |
| `/nos-matelas` | Matelas (Products) | ✅ Exists | SSG | 2h | Product grid, revalidate 1h |
| `/product/:slug` | ProductTemplate | ✅ Exists | SSG | 3h | Dynamic routes, product details |
| `/contact` | Contact | ✅ Exists | SSR | 1h | Form + GoogleMaps |
| `/about` | About | ✅ Exists | SSR | 1h | Company info |
| `/help` | Help | ✅ Exists | SSR | 1h | FAQ, support |
| `/promos` | Promos | ✅ Exists | SSG | 1h | Promotional offers |
| `/quiz` | Quiz | ✅ Exists | CSR* | 2h | Interactive, needs client-side state |

**Subtotal Tier 1:** ~14-15 hours

---

### TIER 2: E-COMMERCE PAGES (CSR with Auth) — IMPORTANT
These are protected or require real-time data. Use Client Components with middleware auth.

| Route | Component | Status | Type | Effort | Notes |
|-------|-----------|--------|------|--------|-------|
| `/cart` | Cart | ✅ Exists | CSR | 1h | Shopping cart state |
| `/products` | Articles (legacy) | ✅ Exists | SSR | 1h | Alternative to /nos-matelas |

**Subtotal Tier 2:** ~2 hours

---

### TIER 3: AUTHENTICATION PAGES (CSR) — MEDIUM PRIORITY
These must stay CSR (interactive forms, login state). Use Client Components.

| Route | Component | Status | Type | Effort | Notes |
|-------|-----------|--------|------|--------|-------|
| `/login` | Auth (all variants) | ✅ Exists | CSR | 2h | Role-based /login, /login/admin, etc. |
| `/register` | Register | ✅ Exists | CSR | 1h | Registration form |
| `/forgot-password` | ForgotPassword | ✅ Exists | CSR | 0.5h | Password reset request |
| `/reset-password/:token` | ResetPassword | ✅ Exists | CSR | 0.5h | Token-based reset |

**Subtotal Tier 3:** ~4 hours

---

### TIER 4: PROTECTED DASHBOARDS (CSR + Middleware) — LOWER PRIORITY
Admin, Employee, Client dashboards. Use Client Components + middleware for auth checks.

**Routes (18 total):**
- `/admin-dashboard`, `/admin/dashboard` (AdminDashboard)
- `/profile` (Profile)
- `/manage-clients`, `/manage-managers`, `/add-employer` (Admin CRUD)
- `/client-dashboard`, `/client-orders`, `/client-reviews`, `/client-recommendations` (Client)
- `/employee-dashboard`, `/employer/dashboard`, `/employer/orders`, `/employer/inventory`, `/employer/clients`, `/employer/profile`, `/employer/settings` (Employee)

**Implementation:** Batch all as CSR + middleware auth check  
**Effort:** ~8 hours (create middleware + convert components)

**Subtotal Tier 4:** ~8 hours

---

## 📊 IMPLEMENTATION PHASES

### PHASE 1: Setup & Core Infrastructure (8-10 hours)

**1.1 Initialize Next.js Project**
```bash
cd C:\site_star_mousse
npx create-next-app@latest frontend --typescript --tailwind --app --eslint
cd frontend
```

**1.2 Directory Structure**
```
C:\site_star_mousse\frontend\
├── src/
│   ├── app/                    # App Router pages (TIER 1)
│   │   ├── page.tsx            # Home /
│   │   ├── layout.tsx          # Root layout
│   │   ├── nos-matelas/
│   │   │   └── page.tsx        # /nos-matelas
│   │   ├── product/
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # /product/:slug
│   │   ├── contact/
│   │   │   └── page.tsx        # /contact
│   │   ├── about/
│   │   │   └── page.tsx        # /about
│   │   ├── api/                # API routes
│   │   │   ├── auth/
│   │   │   ├── products/
│   │   │   └── ...
│   │   └── (auth)/             # Route group for auth pages
│   │       ├── login/
│   │       ├── register/
│   │       └── ...
│   ├── components/             # Reusable components
│   │   ├── TopContactHeader.tsx
│   │   ├── GoogleMapsEmbed.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── ProductShowcase.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── api.ts              # API client (proxy to backend)
│   │   ├── auth.ts             # Auth utilities
│   │   └── utils.ts
│   ├── middleware.ts           # Protected routes auth
│   └── env.ts                  # Environment variables
├── public/                      # Static assets
│   ├── images/
│   ├── logo.png
│   └── ...
├── next.config.js              # Image optimization, redirects
├── tailwind.config.ts           # Tailwind (or keep CSS-in-JS)
├── .env.local                   # API_BASE_URL=http://localhost:5000
└── package.json
```

**1.3 Configure next.config.js**
- Image optimization (next/image)
- Redirects (old routes → new)
- Rewrites (API proxy)
- Environment variables
- ISR (Incremental Static Regeneration) timing

**1.4 Setup Middleware**
- `middleware.ts` for protected routes
- Check auth token (JWT from localStorage or cookies)
- Redirect unauthenticated users to /login

**1.5 Environment & API Client**
- `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:5000`
- Create `lib/api.ts` with axios/fetch wrapper
- Handle CORS for backend calls

**Effort:** 8-10 hours

---

### PHASE 2: Migrate TIER 1 Public Pages (14-15 hours)

**Strategy:** SSR for dynamic content, SSG for static/semi-static content

**2.1 Convert Home → `app/page.tsx`**
- Import Home component logic
- Use `<TopContactHeader>`, `<ProductShowcase>`, hero
- Fetch featured products on server (getServerSideProps → direct fetch)
- Set SEO: `<Metadata>` export
- Build time: 1-2 seconds

**2.2 Convert Products → `app/nos-matelas/page.tsx`**
- Fetch product list from backend
- SSG with revalidation every 1 hour (ISR)
- Product grid component
- Breadcrumbs

**2.3 Convert Product Details → `app/product/[slug]/page.tsx`**
- Dynamic routes with `generateStaticParams()` for SSG
- Fetch product by slug
- Product image gallery, specs, CTA
- Per-product metadata (Open Graph with product image)
- Build time: ~30 products = 15-30 seconds

**2.4 Convert Contact → `app/contact/page.tsx`**
- SSR (forms need real-time validation)
- GoogleMapsEmbed component
- Form submission to backend

**2.5 Convert About, Help, Promos → Simple SSR pages**
- Static content, 1 hour cache

**2.6 Convert Quiz → `app/quiz/page.tsx` (Client Component)**
- Use `'use client'` directive
- Interactive state management
- Socket.io or API calls for results

**Effort:** 14-15 hours

---

### PHASE 3: Migrate TIER 2 & TIER 3 Auth Pages (6 hours)

**3.1 Create Route Group for Auth Pages**
```
app/(auth)/
├── login/page.tsx             # /login
├── login/admin/page.tsx        # /login/admin (variant)
├── register/page.tsx           # /register
├── forgot-password/page.tsx    # /forgot-password
└── reset-password/[token]/page.tsx  # /reset-password/:token
```

**3.2 Convert Auth Components**
- All use `'use client'` (interactive forms)
- Import existing Auth, Register, ForgotPassword, ResetPassword components
- Connect to backend API
- Store JWT in localStorage or httpOnly cookie

**3.3 Convert Cart**
- `app/cart/page.tsx` (Client Component)
- State management: Zustand or React Context
- Sync with backend cart API

**Effort:** 6 hours

---

### PHASE 4: Migrate TIER 4 Protected Dashboards (8 hours)

**4.1 Create Protected Routes Middleware**
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  
  // Redirect to /login if accessing protected routes without token
  if (request.pathname.startsWith('/admin-dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Check role from decoded token (JWT)
  // Redirect if insufficient permissions
}
```

**4.2 Create Protected Layout**
```
app/(protected)/
├── layout.tsx                  # Sidebar, auth check
├── admin/
│   ├── dashboard/page.tsx      # /admin-dashboard
│   ├── clients/page.tsx        # /manage-clients
│   ├── orders/page.tsx         # /admin/orders
│   └── ...
├── client/
│   ├── dashboard/page.tsx      # /client-dashboard
│   ├── orders/page.tsx         # /client-orders
│   └── ...
└── employee/
    ├── dashboard/page.tsx      # /employee-dashboard
    ├── orders/page.tsx         # /employer/orders
    └── ...
```

**4.3 Convert All Dashboard Components**
- Use `'use client'` for interactive dashboards
- Fetch user data from `/api/auth/me`
- Display role-specific content

**Effort:** 8 hours

---

### PHASE 5: Testing, Optimization & Deployment (5-8 hours)

**5.1 Testing**
- Local build: `npm run build`
- Test all routes SSR/SSG rendering
- Test protected routes + auth flow
- Test API calls to backend
- Performance: Lighthouse audit (target: >90 Performance)

**5.2 SEO Optimization**
- Per-page metadata (title, description, Open Graph)
- Generate sitemap.xml (dynamic with next/sitemap)
- robots.txt
- Structured data (schema.org)

**5.3 Image Optimization**
- Use `next/image` for all product images
- WebP conversion
- Lazy loading
- Responsive sizes

**5.4 Deploy to Vercel**
- Push to GitHub
- Vercel auto-deploys from main
- Test in production
- Setup custom domain (starmousse.tn)

**5.5 Redirect Old Domain**
- vercel.app domain → starmousse.tn
- Keep /api routes accessible

**Effort:** 5-8 hours

---

## 🔌 API INTEGRATION STRATEGY

### Option A: Direct Backend Calls (Recommended)
```typescript
// lib/api.ts
export async function getProducts() {
  const res = await fetch('http://localhost:5000/api/products', {
    next: { revalidate: 3600 } // ISR: revalidate every 1 hour
  });
  return res.json();
}
```

**Pros:**
- Simple, direct calls from Server Components
- ISR caching built-in
- No extra infrastructure

**Cons:**
- Backend must be accessible from Vercel (if deploying cloud)

### Option B: API Routes (Proxy)
```typescript
// app/api/products/route.ts
export async function GET() {
  const data = await fetch('http://localhost:5000/api/products');
  return Response.json(data);
}
```

**Pros:**
- Encapsulates backend details
- Can add middleware/logging
- CORS handled by Next.js

**Cons:**
- Extra round trip through Next.js server

**DECISION:** Use **Option A** (direct calls) for simplicity. If CORS issues, switch to Option B.

---

## 📊 EFFORT BREAKDOWN

| Phase | Component | Effort | Total |
|-------|-----------|--------|-------|
| 1 | Setup + Infrastructure | 8-10h | 8-10h |
| 2 | TIER 1 Public Pages | 14-15h | 22-25h |
| 3 | TIER 2-3 Auth Pages | 6h | 28-31h |
| 4 | TIER 4 Dashboards | 8h | 36-39h |
| 5 | Testing + Deployment | 5-8h | 41-47h |
| **TOTAL** | **Full Migration** | **41-47h** | **41-47h** |

**Parallelizable:** Phase 2 and Phase 4 can run simultaneously with 2 developers.  
**For single developer:** 5-6 days of full-time work (40-50 hours over 5-6 days)

---

## ⚠️ RISKS & MITIGATION

| Risk | Severity | Mitigation |
|------|----------|-----------|
| **Breaking API calls** | HIGH | Create detailed API mapping before migration. Test each endpoint. |
| **Auth token loss** | HIGH | Use httpOnly cookies instead of localStorage. Implement refresh token flow. |
| **CORS issues with backend** | MEDIUM | Setup API routes as proxy if direct calls fail. |
| **Build time explosion** | MEDIUM | Use ISR (revalidate: 3600) instead of full SSG. Limit dynamic routes. |
| **Component import errors** | MEDIUM | Refactor React imports gradually. Check for react-router-dom usage (replace with Next.js Link). |
| **CSS-in-JS conflicts** | LOW | Keep existing CSS-in-JS or migrate to Tailwind. Use `<style>` tags in components. |
| **Downtime during migration** | LOW | Keep old React build live during migration. Test new Next.js build fully before switching traffic. |

---

## 🎯 SUCCESS CRITERIA

| Metric | Target | Current | Improvement |
|--------|--------|---------|------------|
| **Google Indexation** | 100% pages crawlable | 0% (SPA) | +∞ |
| **First Contentful Paint (FCP)** | <1.5s | 5-8s | 70% faster |
| **Lighthouse Performance** | >90 | ~30 | +60 points |
| **SEO Score** | >80 | ~20 | +60 points |
| **All routes accessible** | 100% | 100% | ✓ (maintained) |
| **No downtime** | 0s | N/A | ✓ (blue-green deploy) |

---

## 📅 RECOMMENDED SCHEDULE

```
Day 1: Phase 1 (Setup) + Phase 2a (Home + Products) — 10-12 hours
Day 2: Phase 2b (Product detail) + Phase 2c (Contact/About) — 10-12 hours
Day 3: Phase 3 (Auth) + Phase 4a (Dashboards setup) — 10 hours
Day 4: Phase 4b (Dashboard migration) + Phase 5a (Testing) — 10 hours
Day 5: Phase 5b-5d (SEO, images, deployment) + QA — 8-10 hours

Total: 48-54 hours → 5-6 days full-time OR 2-3 weeks part-time (10h/week)
```

---

## ✅ NEXT STEPS

1. **Get approval** on this migration plan
2. **Backup current frontend** (git tag current version)
3. **Start Phase 1** (create-next-app + setup)
4. **Run parallel PRIORITÉ 1** (add product photos + hero improvements while Phase 1 runs)
5. **Test locally** before pushing to Vercel

---

## 📚 REFERENCES

- **Next.js 14 Docs:** https://nextjs.org/docs
- **App Router Guide:** https://nextjs.org/docs/app
- **Image Optimization:** https://nextjs.org/docs/app/building-your-application/optimizing/images
- **ISR:** https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration
- **Middleware:** https://nextjs.org/docs/app/building-your-application/routing/middleware

---

**Created:** 2026-06-01  
**Status:** READY FOR REVIEW & APPROVAL  
**Questions?** Ask before starting Phase 1.
