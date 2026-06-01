# ⚡ WHAT TO DO RIGHT NOW (Sans Photos)

**Temps disponible:** 30-45 minutes pendant que vous préparez les photos  
**Impact:** Préparer le site pour maximum conversion dès réception photos

---

## 🔥 5 CHOSES À FAIRE MAINTENANT (15 min chacune)

### 1. ✅ Setup Google Analytics 4 (15 min)
**Why:** Mesurer l'impact des changements PRIORITÉ 1  
**How:**

```html
<!-- Add to frontend/public/index.html, after <title> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXX'); // Replace with your GA4 ID
</script>
```

**Next Steps:**
1. Go to Google Analytics
2. Create property for site-star-mousse.vercel.app
3. Get G-XXXXXXXX ID
4. Replace in index.html
5. Build & deploy

**Impact:** Track homepage views, product clicks, contact form submissions

---

### 2. ✅ Add Product Data JSON (15 min)
**Why:** Prepare ProductShowcase to load real images dynamically  
**How:**

Create `frontend/public/products.json`:

```json
{
  "products": [
    {
      "id": 1,
      "slug": "relax-plus",
      "name": "Relax Plus",
      "description": "Matelas ergonomique mousse HR haute densité",
      "price": "899 TND",
      "image": "/relax-plus-hero.jpg",
      "alt": "Matelas Relax Plus - Ergonomique et confortable",
      "specs": {
        "épaisseur": "18cm",
        "densité": "45kg/m³",
        "taille": "160x200cm",
        "type": "Mousse HR"
      },
      "features": ["Ergonomique", "Garantie 10 ans", "Livraison gratuite"]
    },
    {
      "id": 2,
      "slug": "medico-plus",
      "name": "Medico Plus",
      "description": "Matelas orthopédique avec mousse mémoire",
      "price": "1199 TND",
      "image": "/medico-plus-detail.jpg",
      "alt": "Matelas Medico Plus - Orthopédique",
      "specs": {
        "épaisseur": "20cm",
        "densité": "50kg/m³",
        "taille": "160x200cm",
        "type": "Mousse mémoire"
      },
      "features": ["Orthopédique", "Soutien optimal", "Garantie 10 ans"]
    },
    {
      "id": 3,
      "slug": "tendresse",
      "name": "Tendresse",
      "description": "Matelas confortable avec ressorts ensachés",
      "price": "1299 TND",
      "image": "/tendresse-lifestyle.jpg",
      "alt": "Matelas Tendresse - Confort premium",
      "specs": {
        "épaisseur": "22cm",
        "densité": "55kg/m³",
        "taille": "160x200cm",
        "type": "Ressorts ensachés"
      },
      "features": ["Ressorts ensachés", "Très confortable", "Garantie 10 ans"]
    },
    {
      "id": 4,
      "slug": "venise-plus",
      "name": "Venise Plus",
      "description": "Matelas haut de gamme avec pillow top",
      "price": "1599 TND",
      "image": "/venise-plus-hero.jpg",
      "alt": "Matelas Venise Plus - Luxe et confort",
      "specs": {
        "épaisseur": "25cm",
        "densité": "60kg/m³",
        "taille": "160x200cm",
        "type": "Mousse + Pillow top"
      },
      "features": ["Pillow top", "Luxe", "Garantie 10 ans"]
    }
  ]
}
```

**Then update `ProductShowcase.js`:**
```jsx
import { useEffect, useState } from 'react';

export default function ProductShowcase() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/products.json')
      .then(r => r.json())
      .then(data => setProducts(data.products));
  }, []);

  return (
    // Use products.map() with real data + images
  );
}
```

**Impact:** Flexible product management, easy to update

---

### 3. ✅ Create Product Templates in Matelas.js (15 min)
**Why:** Make /product/:slug pages work with real data  
**How:**

Update `frontend/src/pages/Store/Matelas.js` to export product array:

```jsx
export const PRODUCTS = [
  {
    id: 1,
    slug: 'relax-plus',
    name: 'Relax Plus',
    // ... (copy from products.json above)
  },
  // ... more products
];
```

Then in `ProductTemplate.js`, fetch by slug:
```jsx
import { PRODUCTS } from './Matelas';

export default function ProductTemplate() {
  const { slug } = useParams();
  const product = PRODUCTS.find(p => p.slug === slug);
  
  if (!product) return <div>Product not found</div>;
  
  return (
    <div>
      <img src={product.image} alt={product.alt} />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      {/* ... more details */}
    </div>
  );
}
```

**Impact:** All /product/:slug pages now work dynamically

---

### 4. ✅ Add og:image meta tag (15 min)
**Why:** WhatsApp/Facebook preview needs image  
**How:**

You said you'll send `og-image.jpg` (1200x630px). When you do:

```bash
# Upload to:
C:\site_star_mousse\frontend\public\og-image.jpg
```

Then update `frontend/public/index.html`:
```html
<meta property="og:image" content="https://site-star-mousse.vercel.app/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/jpeg" />
```

**Impact:** Better WhatsApp/Facebook previews (+30% CTR on social shares)

---

### 5. ✅ Test /contact Page on Mobile (15 min)
**Why:** Verify new page works on all devices  
**How:**

1. Go to https://site-star-mousse.vercel.app/contact
2. Test on mobile (iPhone, Android)
3. Check:
   - Form loads ✓
   - GoogleMaps loads ✓
   - Contact buttons clickable ✓
   - Form submittable ✓
4. If any issues, fix before deploying main features

**Impact:** Ensure UX improvements work everywhere

---

## 📋 CHECKLIST (COPY THIS)

```
☐ 1. Setup Google Analytics 4 (get GA4 ID from Google)
☐ 2. Create products.json with 4 products + images
☐ 3. Update ProductShowcase to use products.json
☐ 4. Create og-image.jpg (1200x630px) with showroom photo
☐ 5. Test /contact page on mobile
☐ 6. Build: npm run build (should have 0 errors)
☐ 7. Commit: git add . && git commit -m "Prep for PRIORITÉ 1 finalization"
☐ 8. Deploy: git push (Vercel auto-deploys)
```

---

## ⏱️ TIMING

| Task | Time | Effort | Blocker |
|------|------|--------|---------|
| GA4 setup | 15 min | Easy | GA4 account |
| products.json | 15 min | Easy | None |
| ProductShowcase update | 15 min | Easy | products.json |
| og-image upload | 15 min | Easy | Photo file |
| /contact test | 15 min | Easy | None |
| **TOTAL** | **75 min** | **Easy** | **Photos** |

---

## 🎯 AFTER YOU SEND PHOTOS

Once photos arrive, I'll:
1. Upload to `frontend/public/`
2. Update ProductShowcase with real images
3. Create hero section with background image
4. Create product detail pages
5. Build & deploy
6. Test everything
7. Report Lighthouse scores

**Timeline:** 2-3 hours after photos → full PRIORITÉ 1 DONE ✅

---

**That's it!** These 5 things will prepare the site for maximum impact once photos arrive.

**Ready to send photos?** 📸
