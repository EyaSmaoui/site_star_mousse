# 🎨 EXEMPLES DE MODIFICATION - Dashboard Employé

## 1️⃣ MODIFIER LES COULEURS DES KPIs

### Avant
```javascript
const KPI_CONFIG = [
  {
    label: "Chiffre d'affaires",
    iconColor: "#10b981",  // Vert
  },
  {
    label: "Commandes",
    iconColor: "#3b82f6",  // Bleu
  },
  {
    label: "Commandes actives",
    iconColor: "#7c3aed",  // Violet
  },
];
```

### Après (Thème Chaud)
```javascript
const KPI_CONFIG = [
  {
    label: "Chiffre d'affaires",
    iconColor: "#f59e0b",  // Orange
  },
  {
    label: "Commandes",
    iconColor: "#ef4444",  // Rouge
  },
  {
    label: "Commandes actives",
    iconColor: "#ec4899",  // Rose
  },
];
```

---

## 2️⃣ AJOUTER UN NOUVEAU STATUT

**Scenario:** Vous voulez ajouter le statut "remboursé"

### Étape 1: Ajouter dans STATUS_STYLES
```javascript
const STATUS_STYLES = {
  // ... autres statuts ...
  remboursé: { 
    bg: "#fecfe0",      // Rose clair
    color: "#ec4899",   // Rose
    border: "#fbcfe8"   // Rose très clair
  },
};
```

### Étape 2: Ajouter dans STATUS_COLORS
```javascript
const STATUS_COLORS = {
  // ... autres couleurs ...
  remboursé: "#ec4899",  // Rose (pour graphiques)
};
```

### Étape 3: Mettre à jour les commandes actives
```javascript
const activeOrders = orders.filter((order) =>
  ["en attente", "en cours", "confirmé", "expédié", "pending"].includes(String(order.status || "").toLowerCase())
).length;

// ou si "remboursé" doit être exclu:
// Pas besoin de modifier, il ne sera pas compté comme actif
```

---

## 3️⃣ AUGMENTER LE NOMBRE DE COMMANDES CHARGÉES

### Avant
```javascript
const [ordersData, productsData] = await Promise.all([
  getAllOrders({ limit: 50 }),  // Max 50
  getAllProducts()
]);
```

### Après (200 commandes)
```javascript
const [ordersData, productsData] = await Promise.all([
  getAllOrders({ limit: 200 }),  // Max 200
  getAllProducts()
]);
```

---

## 4️⃣ CHANGER LE BREAKPOINT MOBILE

### Avant (900px)
```javascript
const isMobile = window.innerWidth <= 900;
```

### Après (768px - Standard)
```javascript
const isMobile = window.innerWidth <= 768;
```

### Variantes
```javascript
// Mobile très petit (ancien standards)
const isMobile = window.innerWidth <= 640;

// Très large (pour grands écrans)
const isMobile = window.innerWidth <= 1024;
```

---

## 5️⃣ CHANGER LA PÉRIODE PAR DÉFAUT

### Avant
```javascript
const [selectedPeriod, setSelectedPeriod] = useState("Ce mois-ci");
```

### Après (Année)
```javascript
const [selectedPeriod, setSelectedPeriod] = useState("Cette année");
```

### Options Disponibles
```javascript
"7 derniers jours"
"30 derniers jours"
"Ce mois-ci"          // Défaut actuel
"Ce trimestre"
"Cette année"
```

---

## 6️⃣ MODIFIER LE STYLE DES GRAPHIQUES

### Avant (Légende cachée)
```javascript
const lineOptions = {
  plugins: { 
    legend: { display: false }
  }
};
```

### Après (Légende visible)
```javascript
const lineOptions = {
  plugins: { 
    legend: { 
      display: true,
      position: 'top',  // ou 'bottom', 'left', 'right'
      labels: {
        color: '#6b7280',
        font: { size: 12 }
      }
    }
  }
};
```

### Changer l'opacité de la grille
```javascript
// Avant (très légère)
scales: {
  x: { grid: { color: "rgba(0,0,0,.05)" } }
}

// Après (plus visible)
scales: {
  x: { grid: { color: "rgba(0,0,0,.15)" } }
}
```

### Changer le trou central du donut
```javascript
// Avant (70% = gros trou)
const donutOptions = {
  cutout: "70%"
};

// Après (50% = petit trou)
const donutOptions = {
  cutout: "50%"
};

// Ou (0% = Pie chart complet, pas de trou)
const donutOptions = {
  cutout: "0%"
};
```

---

## 7️⃣ AJOUTER UN NOUVEL ONGLET

### Avant
```javascript
const TABS = ["Aperçu", "Commandes", "Stock"];
```

### Après (Ajouter "Rapports")
```javascript
const TABS = ["Aperçu", "Commandes", "Stock", "Rapports"];
```

### Ajouter le contenu correspondant
```javascript
{activeTab === "Rapports" && (
  <div>
    {/* Contenu de Rapports */}
  </div>
)}
```

---

## 8️⃣ CHANGER LE FORMAT DES MONTANTS

### Avant (Locale Tunisien)
```javascript
format: (v) => `${Number(v || 0).toLocaleString("fr-TN")} DT`
// Résultat: "1 200 DT"
```

### Après (Locale Français)
```javascript
format: (v) => `${Number(v || 0).toLocaleString("fr-FR")} DT`
// Résultat: "1 200 DT"
```

### Ou (Format personnalisé)
```javascript
format: (v) => {
  const num = Number(v || 0);
  return `${num.toFixed(2)} DT`;  // "1200.00 DT"
}
```

---

## 9️⃣ MODIFIER LES OPTIONS DE TRI

### Avant
```javascript
const filterConfig.sort:
- 'recent'
- 'older'
- 'amount_high'
- 'amount_low'
```

### Après (Ajouter tri par statut)
```javascript
case 'status_pending':
  result = [...result].sort((a, b) => 
    String(a.status || '').localeCompare(String(b.status || ''))
  );
  break;

case 'status_reverse':
  result = [...result].sort((a, b) => 
    String(b.status || '').localeCompare(String(a.status || ''))
  );
  break;
```

---

## 🔟 AJOUTER UN CHAMP DE RECHERCHE SUPPLÉMENTAIRE

### Avant
```javascript
[order._id, order.id, order.customerName, order.address, order.phone]
```

### Après (Ajouter email)
```javascript
[order._id, order.id, order.customerName, order.address, order.phone, order.customerEmail]
```

### Pour les produits
```javascript
[product.name, product.productId, product._id, product.category, product.description]
```

---

## 1️⃣1️⃣ MODIFIER LA FRÉQUENCE DE MAJ HORLOGE

### Avant (1 seconde)
```javascript
const timer = setInterval(() => setTime(new Date()), 1000);
```

### Après (0.5 seconde - Plus rapide)
```javascript
const timer = setInterval(() => setTime(new Date()), 500);
```

### Ou (5 secondes - Moins rapide)
```javascript
const timer = setInterval(() => setTime(new Date()), 5000);
```

---

## 1️⃣2️⃣ CHANGER LES RÔLES AUTORISÉS

### Avant
```javascript
hasAccess(userData, [ROLES.MANAGER, ROLES.EMPLOYEE, "employeur"])
```

### Après (Seulement Manager)
```javascript
hasAccess(userData, [ROLES.MANAGER])
```

### Ou (Ajouter Admin)
```javascript
hasAccess(userData, [ROLES.MANAGER, ROLES.EMPLOYEE, ROLES.ADMIN, "employeur"])
```

---

## 1️⃣3️⃣ MODIFIER LE FORMAT DES DATES

### Avant (fr-FR)
```javascript
const fmtDate = (date) => {
  return new Date(date).toLocaleDateString("fr-FR", { 
    day: "2-digit", 
    month: "short", 
    year: "numeric" 
  });
  // "03 juin 2026"
};
```

### Après (Format US)
```javascript
const fmtDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", { 
    day: "2-digit", 
    month: "short", 
    year: "numeric" 
  });
  // "06-03-2026"
};
```

### Ou (Format long)
```javascript
const fmtDate = (date) => {
  return new Date(date).toLocaleDateString("fr-FR", { 
    weekday: "long",
    day: "2-digit", 
    month: "long", 
    year: "numeric" 
  });
  // "mardi 03 juin 2026"
};
```

---

## 1️⃣4️⃣ MODIFIER LA LONGUEUR DE L'ID COMMANDE

### Avant (6 caractères)
```javascript
const orderId = (order) => (order._id ? order._id.slice(-6).toUpperCase() : order.id || "TEMP");
// "5F9A8C"
```

### Après (8 caractères)
```javascript
const orderId = (order) => (order._id ? order._id.slice(-8).toUpperCase() : order.id || "TEMP");
// "975F9A8C"
```

### Ou (Afficher tout l'ID)
```javascript
const orderId = (order) => (order._id ? order._id.toUpperCase() : order.id || "TEMP");
```

---

## 1️⃣5️⃣ DÉSACTIVER LE RESPONSIVE (Mode Desktop seulement)

### Avant
```javascript
const isMobile = typeof window !== "undefined" ? window.innerWidth <= 900 : false;
```

### Après (Toujours desktop)
```javascript
const isMobile = false;
```

---

## FICHIER À MODIFIER

Tous ces changements sont dans:
```
frontend/src/pages/Employee/EmployeeDashboard.js
```

**Lignes clés:**
- 25: PERIOD_OPTIONS
- 26: TABS
- 28-45: STATUS_STYLES et STATUS_COLORS
- 47-92: KPI_CONFIG
- 94-109: Options graphiques
- 121-133: États React
- 163: getAllOrders limit

