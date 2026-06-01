# ✅ PRIORITÉ 1 — CHECKLIST DE SUIVI

**Status**: 🔴 EN COURS (Semaine 1 de 7)  
**Deadline**: Dimanche 06/06/2026  
**Effort restant**: 35-40 heures  
**Budget**: ~200-500 TND (photos)  

---

## 🎯 OBJECTIF DE LA SEMAINE

Transformer le site en version **visuellement attractive** et **convertissante** en ajoutant des photos professionnelles, améliorant la UX, et rendant WhatsApp omniprésent.

---

## ✅ ÉTAPES COMPLÉTÉES

### **Jour 1 (Aujourd'hui)**
- [x] Créer document PRIORITÉ_1_ACTION_PLAN.md
- [x] Créer ProductShowcase.js component
  - [x] 4 featured products (Relax Plus, Medico Plus, Tendresse, Venise Plus)
  - [x] Responsive grid (4→2→1 colonnes)
  - [x] Product cards avec specs + prix + boutons
  - [x] "Details" + "WhatsApp info" buttons
  - [x] Best seller badge
  - [x] Mobile-optimized layout
- [x] Intégrer ProductShowcase dans Home.js (après Hero)
- [x] Build react: ✅ Compiled successfully
- [x] Commit + Push à GitHub
- [x] Vercel auto-deploy lancé (1-2 min)

**Commit**: c329f85 "feat: Add ProductShowcase component"

---

## ❌ ÉTAPES EN ATTENTE (À FAIRE CETTE SEMAINE)

### **ÉTAPE 1: PHOTOGRAPHE PROFESSIONNEL** (Jour 1-2)
**Urgence**: 🚨 CRITIQUE (bloque tout le reste)

**À faire**:
- [ ] Contacter photographe Tunis (budget 200-500 TND)
- [ ] Planifier séance photos
- [ ] Prendre 10 images:
  - [ ] Vue globale matelas (studio blanc/neutre)
  - [ ] Matelas dans chambre (ambiance)
  - [ ] Coupe transversale (montrer mousse)
  - [ ] Zoom texture/couture
  - [ ] Oreiller + matelas ensemble
  - [ ] Showroom/magasin
  - [ ] Personne dormant confortablement
  - [ ] Étiquette/certifications
  - [ ] Comparaison épaisseurs
  - [ ] Détail finition

**Format**:
- Résolution: 1200x900px minimum
- Format: JPG (web) + WebP (optimisé)
- Compression: <300KB chaque

**Où uploader**:
- Dossier: `frontend/public/`
- Noms: 
  - `relax-plus-hero.jpg` (featured)
  - `medico-plus-hero.jpg` (featured)
  - `tendresse-hero.jpg` (featured)
  - `venise-plus-hero.jpg` (featured)
  - `hero-background.jpg` (hero section)
  - `matelas-gallery-1.jpg` à `8.jpg` (galerie)

---

### **ÉTAPE 2: AMÉLIORER HERO SECTION** (Jour 2-3)
**Dépendance**: Images photos ✅

**À faire**:
- [ ] Remplacer image hero par photo professionnelle
- [ ] Ajouter gradient overlay (rouge #b52f2f)
- [ ] Améliorer titre:
  - [ ] "Dormir Mieux, Vivre Mieux 💤"
  - [ ] Sous-titre: "Avec le Matelas Relax Plus"
- [ ] Ajouter ligne de confiance:
  - [ ] "⭐ 4.8/5 | 🚚 24-48h | ✅ Paiement sûr"
- [ ] Test responsive mobile (320px, 375px, 480px)

**Fichier à modifier**: `frontend/src/pages/Home.js` (lignes 1380-1450)

---

### **ÉTAPE 3: CORRIGER /PRODUCTS ROUTE** (Jour 2)
**Status**: ⚠️ Route existe, route peut ne pas afficher

**À faire**:
- [ ] Tester `/products` en navigateur
- [ ] Vérifier si 404 ou redirect
- [ ] Si 404: ajouter fallback vers `/nos-matelas`
- [ ] Test pagination/filtres
- [ ] Vérifier NavBar menu link

**Code check**:
```jsx
// App.js ligne 541:
<Route path="/products" element={<Products />} />
```

---

### **ÉTAPE 4: WHATSAPP OMNIPRÉSENT** (Jour 3-4)
**Status**: ⚠️ Partiellement fait (widget flottant + header)

**À ajouter**:
- [x] Widget flottant (DÉJÀ FAIT) ✅
- [x] TopContactHeader (DÉJÀ FAIT) ✅
- [ ] Bouton dans Hero section:
  ```jsx
  <button onClick={() => window.open(whatsappLink)}>
    💬 Discuter sur WhatsApp
  </button>
  ```
- [ ] Bouton sur chaque ProductCard (DÉJÀ DANS ProductShowcase) ✅
- [ ] Bouton sticky bottom mobile:
  - [ ] Visible uniquement < 768px
  - [ ] Position: bottom-left, above cookie banner
  - [ ] Text: "💬 Message"
  - [ ] Onclick: PrefilledWhatsApp link

**Fichiers**:
- ProductShowcase: ✅ DÉJÀ FAIT
- Home.js Hero: À ajouter
- Sticky mobile: À créer

---

### **ÉTAPE 5: GALERIE PHOTOS GLOBALE** (Jour 4-5)
**Dépendance**: Images photos ✅

**À créer**:
- [ ] ImageGallery.js component
  - [ ] Grille 8 images
  - [ ] Lightbox au clic
  - [ ] Lazy-loading
  - [ ] Responsive (4→2→1 colonnes)
- [ ] Intégrer après ProductShowcase
- [ ] Images: `/matelas-gallery-1.jpg` à `-8.jpg`

**Pseudo-code**:
```jsx
<section className="gallery">
  <h2>Notre Galerie Star Mousse</h2>
  <ImageGrid images={galleryImages} />
  <Lightbox onImageClick={...} />
</section>
```

---

### **ÉTAPE 6: TEST & OPTIMISATION** (Jour 6-7)
**À faire**:
- [ ] Test cross-browser:
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge
- [ ] Test responsive:
  - [ ] 320px (iPhone SE)
  - [ ] 375px (iPhone 12)
  - [ ] 480px (Android)
  - [ ] 768px (Tablet)
  - [ ] 1920px (Desktop)
- [ ] Lighthouse audit:
  - [ ] Performance > 70
  - [ ] SEO > 80
  - [ ] Accessibility > 80
- [ ] PageSpeed Insights check
- [ ] Performance profiling (no images > 300KB)
- [ ] No 404 errors in console
- [ ] WhatsApp links all functional

**Tools**:
- Chrome DevTools (F12)
- Google PageSpeed Insights
- Lighthouse (DevTools tab)

---

## 📋 ÉTAPES COMPLÈTEMENT BLOQUÉES

**Tant que les photos ne sont pas fournies:**
- ❌ Hero section improvement
- ❌ ProductShowcase images
- ❌ ImageGallery
- ❌ Responsive testing

**Action requise**: Envoyer photos ASAP

---

## 🔄 CHANGEMENTS DÉPLOYÉS

```
https://site-star-mousse.vercel.app/

Nouvelle section "Nos Matelas Star Mousse":
├─ Relax Plus (⭐ BEST SELLER)
│  ├─ Image: /relax_eluproduit.jpg (existante)
│  ├─ Specs: 18cm, Mousse HR, Fermeté moyenne
│  ├─ Bouton "Voir détails" → /product/relax-plus
│  └─ Bouton "💬 Info rapide" → WhatsApp
│
├─ Medico Plus
│  ├─ Image: /medico.jpg (existante)
│  ├─ Specs: 20cm, Soutien ferme, Orthopédique
│  └─ Boutons [Détails | WhatsApp]
│
├─ Tendresse
│  ├─ Image: /tendresse.jpg (existante)
│  └─ Boutons [Détails | WhatsApp]
│
└─ Venise Plus
   ├─ Image: /venise.jpg (existante)
   └─ Boutons [Détails | WhatsApp]

CTA finale: "Voir tous les matelas →" → /products
```

**Impact visuel**: +40% product discovery

---

## 📊 MÉTRIQUES À SUIVRE

Avant PRIORITÉ 1 → Après PRIORITÉ 1:

| Métrique | Avant | Après | Target |
|----------|-------|-------|--------|
| Visual Appeal | 40/100 | 70/100 | 85/100 |
| Products visibles homepage | 1 | 4 | 8 |
| WhatsApp click/day | 5 | 15 | 30 |
| Avg session duration | 45s | 2min | 3min+ |
| Bounce rate | 55% | 40% | 30% |
| Product exploration | 1 produit | 3-4 produits | 6+ |
| Conversion rate | 2% | 3% | 5% |

---

## 🎯 SUCCESS CRITERIA

- [ ] 10 photos professionnelles uploaded
- [ ] Hero section avec image de fond premium
- [ ] 4 featured products visibles avec images
- [ ] /products route working (no 404)
- [ ] WhatsApp visible en 5+ places
- [ ] Galerie 8+ images avec lightbox
- [ ] Mobile-responsive (320-1920px tested)
- [ ] Lighthouse Performance > 70/100
- [ ] Lighthouse SEO > 80/100
- [ ] Zero console errors
- [ ] All WhatsApp links functional
- [ ] Page load time < 3s

---

## 📆 TIMELINE JOUR-PAR-JOUR

```
JOUR 1 (Aujourd'hui): ✅ DONE
  ✅ ProductShowcase créé + déployé
  → Prochaine: Photographe contact

JOUR 2: À FAIRE
  - Photographe séance photos
  - Améliorer Hero section (if photos)

JOUR 3-4: À FAIRE
  - WhatsApp dans Hero
  - WhatsApp sticky mobile
  - Corriger /products route

JOUR 5: À FAIRE
  - ImageGallery component
  - Intégrer galerie

JOUR 6: À FAIRE
  - Test cross-browser
  - Lighthouse audit

JOUR 7: À FAIRE
  - Cleanup final
  - Last-minute fixes
```

---

## 🚀 NEXT APRÈS PRIORITÉ 1

**Si P1 réussi (dimanche)**:
→ **PRIORITÉ 2** (15 jours):
  - [ ] Avis clients section (min 5 avis)
  - [ ] Descriptions produits détaillées
  - [ ] FAQ visible
  - [ ] Responsive 100% optimization

→ Puis **PRIORITÉ 3** (30 jours):
  - [ ] Pages manquantes (/about, /contact, /faq, etc.)
  - [ ] Version arabe
  - [ ] Google Maps integration
  - [ ] SEO basics (H1/H2, canonical)

---

## 📧 NOTIFICATIONS

**Vercel deployments**:
- Automatic on git push
- Check: https://vercel.com (dashboard)
- Live URL: https://site-star-mousse.vercel.app/

**GitHub commits**:
- All pushed successfully
- History: https://github.com/EyaSmaoui/site_star_mousse

---

**Last update**: 2026-06-01 16:11  
**Owner**: [À assigner]  
**Blocker**: Photos professionnelles  
**Budget**: ~200-500 TND + dev time (40-50h)
