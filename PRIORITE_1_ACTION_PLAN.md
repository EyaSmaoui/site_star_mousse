# ⚡ PRIORITÉ 1 — ACTION CETTE SEMAINE

**Objectif**: Transformer le site en version visuellement attrayante + fonctionnelle  
**Timeline**: 7 jours  
**Effort**: 40-50 heures  
**Impact**: +50% visuellement, +30% conversions  

---

## 🎯 TOP 5 ACTIONS CRITIQUES

### 1️⃣ **PHOTOS MATELAS** (Le plus urgent!)
**Status**: ❌ MANQUANT  
**Impact**: -70% engagement sans images  

**À faire**:
- [ ] Prendre 8-10 photos professionnelles:
  - [ ] Vue globale matelas seul (studio blanc)
  - [ ] Matelas dans chambre (ambiance)
  - [ ] Coupe transversale montrant mousse
  - [ ] Zoom texture mousse
  - [ ] Détail couture/finition
  - [ ] Oreiller + matelas ensemble
  - [ ] Showroom (magasin)
  - [ ] Personne dormant confortablement
  - [ ] Détail étiquette/certifications
  - [ ] Comparaison épaisseurs côte-à-côte

**Format recommandé**:
- Résolution: 1200x900px minimum
- Format: JPG (pour web) + WebP (optimisé)
- Compression: < 300KB chaque

**Où placer**:
1. Hero section (image grande)
2. Galerie produits (grille 8 photos)
3. Cartes produits (image représentative)
4. Page /nos-matelas (showcase)
5. Fiches produits individuelles

**Budget**: Photographe professionnel Tunisie ~ 200-500 TND

---

### 2️⃣ **HÉRO SECTION AMÉLIORÉ**
**Status**: ⚠️ EXISTANT mais à améliorer  
**Impact**: +40% click-through rate  

**Problèmes actuels**:
- Image de fond faible
- Titre pas assez impactant
- Pas d'urgence/CTA action

**À faire**:
```jsx
<HeroSection>
  // Background: Photo matelas premium (couleur brand: rouge #b52f2f)
  <BackgroundImage src="/hero-matelas-premium.jpg" />
  
  // Contenu overlay
  <HeroContent>
    <BadgePromo>
      🎁 Livraison offerte partout en Tunisie
    </BadgePromo>
    
    <h1>
      Dormir Mieux, Vivre Mieux 💤
      <br/>
      <span className="accent">Avec le Matelas Relax Plus</span>
    </h1>
    
    <p>
      Confort garantie 10 ans. Paiement à la livraison.
      Rejoignez 500+ clients satisfaits en Tunisie.
    </p>
    
    <CTAButtons>
      <PrimaryButton>Découvrir nos matelas</PrimaryButton>
      <SecondaryButton>💬 Discuter sur WhatsApp</SecondaryButton>
    </CTAButtons>
    
    <TrustStats>
      ⭐ 4.8/5 (127 avis) | 🚚 Livraison 24-48h | ✅ Paiement sûr
    </TrustStats>
  </HeroContent>
  
  // Côté droit: Image matelas glamour
  <HeroImage src="/matelas-relax-plus-hero.jpg" />
</HeroSection>
```

**Couleurs**:
- Fond dégradé: `linear-gradient(135deg, #b52f2f 0%, rgba(181,47,47,0.7) 100%)`
- Texte blanc (#fff) avec ombre

**Font**:
- Titre: Syne 600+ (grande)
- Sous-titre: DM Sans 400 (lisible)

---

### 3️⃣ **CORRIGER /PRODUCTS ROUTE**
**Status**: ❌ RETOURNE 404  
**Impact**: Utilisateurs perdus → perte de ventes  

**À faire**:
- [ ] Tester route `/products` dans navigateur
- [ ] Vérifier `App.js` pour route definition
- [ ] Si 404 persiste: ajouter fallback redirect vers `/nos-matelas`
- [ ] Test pagination/filtre (si appliqués)

**Code check**:
```jsx
// Dans App.js Routes section:
<Route path="/products" element={<Products />} />
// OU redirect:
<Route path="/products" element={<Navigate to="/nos-matelas" />} />
```

---

### 4️⃣ **WHATSAPP VISIBILITÉ MAXIMALE**
**Status**: ⚠️ Bouton flottant créé mais isolé  
**Impact**: +25% conversions directes  

**À ajouter**:
- [x] ✅ Widget flottant (DÉJÀ FAIT)
- [ ] Bouton header TopContactHeader (DÉJÀ FAIT)
- [ ] **Ajouter**: Bouton dans Hero section
- [ ] **Ajouter**: Bouton sur chaque carte produit
- [ ] **Ajouter**: Bouton sticky bottom mobile

**Code**:
```jsx
// Sur chaque ProductCard:
<ProductCard>
  <Image src={product.image} />
  <h3>{product.name}</h3>
  <Price>{product.price} TND</Price>
  <p>{product.description}</p>
  
  {/* NEW */}
  <ButtonGroup>
    <button className="btn-primary" onClick={() => navigate(productRoute)}>
      Voir détails
    </button>
    <button className="btn-whatsapp" onClick={() => window.open(whatsappLink)}>
      💬 WhatsApp: Info rapide
    </button>
  </ButtonGroup>
</ProductCard>
```

---

### 5️⃣ **SHOWCASER 3-4 PRODUITS PHARES**
**Status**: ❌ Seulement Relax Plus en avant  
**Impact**: +30% exploration produits  

**À ajouter** (nouvelle section après Hero):

```jsx
<section className="featured-products">
  <h2>Nos Matelas Star Mousse</h2>
  <p>Choisissez le confort qui vous convient</p>
  
  <ProductGrid columns={4}>
    {/* PRODUIT 1 */}
    <ProductCard featured>
      <Badge>⭐ BEST SELLER</Badge>
      <Image src="/relax-plus-hero.jpg" />
      <h3>Matelas Relax Plus</h3>
      <p>Ergonomique, soutien optimal</p>
      <Specs>
        <span>18cm</span>
        <span>Mousse HR</span>
        <span>Fermeté moyenne</span>
      </Specs>
      <Price>999 TND</Price>
      <ButtonGroup>
        <Button primary onClick={() => navigate('/product/relax-plus')}>
          Découvrir
        </Button>
        <Button secondary onClick={openWhatsApp}>
          💬 Info
        </Button>
      </ButtonGroup>
    </ProductCard>
    
    {/* PRODUIT 2 */}
    <ProductCard>
      <Image src="/medico-plus-hero.jpg" />
      <h3>Matelas Medico Plus</h3>
      <p>Spécial mal de dos</p>
      <Specs>20cm | Soutien ferme</Specs>
      <Price>1,199 TND</Price>
      <ButtonGroup>...</ButtonGroup>
    </ProductCard>
    
    {/* PRODUIT 3 */}
    <ProductCard>
      <Image src="/tendresse-hero.jpg" />
      <h3>Matelas Tendresse</h3>
      <p>Confort enveloppant</p>
      <Specs>16cm | Mousse HR</Specs>
      <Price>799 TND</Price>
      <ButtonGroup>...</ButtonGroup>
    </ProductCard>
    
    {/* PRODUIT 4 */}
    <ProductCard>
      <Image src="/venise-plus-hero.jpg" />
      <h3>Matelas Venise Plus</h3>
      <p>Ressorts ensachés premium</p>
      <Specs>22cm | Ressorts</Specs>
      <Price>1,499 TND</Price>
      <ButtonGroup>...</ButtonGroup>
    </ProductCard>
  </ProductGrid>
  
  <CTA>
    <Button large>Voir tous les matelas →</Button>
  </CTA>
</section>
```

**Images nécessaires**:
- `/relax-plus-hero.jpg`
- `/medico-plus-hero.jpg`
- `/tendresse-hero.jpg`
- `/venise-plus-hero.jpg`

---

## 📋 CHECKLIST SEMAINE 1

### **Jour 1-2: Photographie**
- [ ] Planifier séance photos (8-10 images)
- [ ] Organiser avec photographe ou DIY
- [ ] Prendre photos en studio + chambre + showroom
- [ ] Exporter en JPG + WebP
- [ ] Uploader dans `/frontend/public/`

### **Jour 2-3: Amélioration Hero**
- [ ] Mettre à jour Hero CSS (background image)
- [ ] Ajouter badge promo
- [ ] Améliorer typographie titre
- [ ] Ajouter trust stats line
- [ ] Test responsive mobile

### **Jour 3-4: Corriger Routes**
- [ ] Tester `/products` route
- [ ] Vérifier App.js routing
- [ ] Corriger si 404
- [ ] Test navigation menu

### **Jour 4-5: WhatsApp Everywhere**
- [ ] Ajouter bouton Hero section
- [ ] Ajouter bouton ProductCard
- [ ] Ajouter sticky bottom (mobile)
- [ ] Tester tous les liens
- [ ] Vérifier message pré-rempli

### **Jour 5-6: Featured Products Section**
- [ ] Créer composant ProductCard
- [ ] Créer section FeaturedProducts
- [ ] Mapper 3-4 produits
- [ ] Ajouter images
- [ ] Style + responsive

### **Jour 7: Test & Cleanup**
- [ ] Test cross-browser (Chrome, Firefox, Safari, Edge)
- [ ] Test mobile (320px, 375px, 480px, 768px)
- [ ] Lighthouse audit
- [ ] Performance check
- [ ] Commit + Push

---

## 🖼️ COMPOSANTS À CRÉER/MODIFIER

### **1. Améliorer Home.js (Hero section)**
```
Modifier:
- Ligne 1424-1446 (ssn-hero-visual)
- Ajouter background image
- Améliorer CSS gradient
```

### **2. Créer ProductCard.js (réutilisable)**
```
Nouveau composant:
- Image + Title + Description
- Specs (size, type, firmness)
- Price + Buttons (Details + WhatsApp)
- Badge (BEST SELLER, etc)
```

### **3. Créer FeaturedProducts.js**
```
Nouveau section:
- Grid layout (4 colonnes desktop, 2 tablette, 1 mobile)
- Afficher 3-4 produits
- Chaque ProductCard
- CTA finale "Voir tous"
```

### **4. Créer ImageGallery.js**
```
Nouveau composant:
- Grille 8-10 images
- Lightbox au clic
- Lazy-loading
- Responsive
```

---

## 📸 IMAGES MANQUANTES

**À acquérir URGENT**:
```
/relax-plus-hero.jpg          (hero section + featured)
/medico-plus-hero.jpg         (featured cards)
/tendresse-hero.jpg           (featured cards)
/venise-plus-hero.jpg         (featured cards)
/hero-background.jpg          (hero section background)
/matelas-gallery-1.jpg        (gallery)
/matelas-gallery-2.jpg        (gallery)
/matelas-gallery-3.jpg        (gallery)
/matelas-gallery-4.jpg        (gallery)
/matelas-gallery-5.jpg        (gallery)
/matelas-gallery-6.jpg        (gallery)
/matelas-gallery-7.jpg        (gallery)
/matelas-gallery-8.jpg        (gallery)
```

**Total**: 14 images (déjà disponibles: ~6)

---

## 💰 IMPACT ATTENDU

| Métrique | Avant | Après | Gain |
|----------|-------|-------|------|
| Visual Appeal | 40/100 | 85/100 | +112% |
| Bounce rate | 55% | 35% | -36% |
| Time on page | 45s | 2min 30s | +233% |
| Conversion rate | 2% | 3% | +50% |
| Product exploration | 1 produit | 3-4 produits | +300% |
| WhatsApp clicks | 5/day | 15/day | +200% |

---

## ✅ SUCCÈS CRITERIA

- [ ] Hero section with professional background image
- [ ] 8+ product photos visible on homepage
- [ ] 3-4 featured products with images + buttons
- [ ] WhatsApp visible in 5+ places
- [ ] All routes working (no 404s)
- [ ] Mobile-responsive (tested 320px-1920px)
- [ ] Lighthouse score > 70/100
- [ ] Page load < 3 seconds

---

## 🚀 NEXT STEPS APRÈS P1

**Si P1 réussi** (fin semaine):
→ Lancer **PRIORITÉ 2** (15 jours):
  - Avis clients section
  - Descriptions produits détaillées
  - FAQ visible
  - Responsive optimization

→ Puis **PRIORITÉ 3** (30 jours):
  - Pages manquantes (/about, /contact, etc.)
  - Version arabe
  - Google Maps integration
  - SEO basics (H1/H2, meta tags)

---

**Deadline**: Fin semaine (dimanche 06/06/2026)  
**Owner**: [À assigner]  
**Budget photos**: ~200-500 TND  
**Effort dev**: 40-50 heures

