# 📊 PARAMÈTRES - Interface Dashboard Employé
**URL:** `http://localhost:3000/employer/dashboard`

---

## 🎨 CONFIGURATION GÉNÉRALE

### Onglets Disponibles
```javascript
const TABS = ["Aperçu", "Commandes", "Stock"];
```
- **Aperçu** : Dashboard principal avec KPIs et graphiques
- **Commandes** : Liste détaillée des commandes
- **Stock** : Gestion du stock produits

### Périodes de Temps
```javascript
const PERIOD_OPTIONS = [
  "7 derniers jours",
  "30 derniers jours", 
  "Ce mois-ci",
  "Ce trimestre",
  "Cette année"
];
```

---

## 📈 KPIs (Indicateurs Clés)

### Configuration des KPIs
```javascript
const KPI_CONFIG = [
  {
    label: "Chiffre d'affaires",
    valueKey: "totalRevenue",
    format: (v) => `${Number(v || 0).toLocaleString("fr-TN")} DT`,
    change: "+55%",
    changeLabel: "mois précédent",
    iconColor: "#10b981",  // Vert
    icon: <SVG_ICON />
  },
  {
    label: "Commandes",
    valueKey: "totalOrders",
    format: (v) => String(v || 0),
    change: "+12%",
    changeLabel: "activité",
    iconColor: "#3b82f6",  // Bleu
    icon: <SVG_ICON />
  },
  {
    label: "Commandes actives",
    valueKey: "activeOrders",
    format: (v) => String(v || 0),
    change: "En cours",
    changeLabel: "suivi",
    iconColor: "#7c3aed",  // Violet
    icon: <SVG_ICON />
  }
];
```

**Statistiques Calculées :**
- `totalOrders` : Nombre total de commandes
- `totalRevenue` : Somme de tous les totaux (en DT)
- `avgBasket` : Panier moyen (totalRevenue / totalOrders)
- `activeOrders` : Commandes avec statut "en attente", "en cours", "confirmé", "expédié"

---

## 🎨 CODES COULEURS STATUTS

### Styles Statuts Commandes
```javascript
const STATUS_STYLES = {
  livré: { 
    bg: "#f0fdf4",      // Fond vert clair
    color: "#16a34a",   // Texte vert
    border: "#bbf7d0"   // Bordure vert clair
  },
  "en transit": { 
    bg: "#fffbeb", 
    color: "#d97706", 
    border: "#fde68a" 
  },
  confirmé: { 
    bg: "#eff6ff", 
    color: "#2563eb", 
    border: "#bfdbfe" 
  },
  "en attente": { 
    bg: "#fffbeb", 
    color: "#d97706", 
    border: "#fde68a" 
  },
  "en cours": { 
    bg: "#ede9fe", 
    color: "#6d28d9", 
    border: "#c4b5fd" 
  },
  expédié: { 
    bg: "#dbeafe", 
    color: "#1d4ed8", 
    border: "#93c5fd" 
  },
  annulé: { 
    bg: "#fef2f2", 
    color: "#dc2626", 
    border: "#fecaca" 
  }
};
```

### Couleurs Graphiques Statuts
```javascript
const STATUS_COLORS = {
  livré: "#10b981",      // Vert
  "en attente": "#fb923c", // Orange
  "en cours": "#8b5cf6",   // Violet
  expédié: "#3b82f6",      // Bleu
  annulé: "#ef4444",       // Rouge
  inconnu: "#94a3b8"       // Gris
};
```

---

## 📊 CONFIGURATION GRAPHIQUES

### Options Graphique Ligne
```javascript
const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { display: false }  // Cache la légende
  },
  scales: {
    x: { 
      grid: { color: "rgba(0,0,0,.05)", drawBorder: false }, 
      ticks: { color: "#9ca3af" }  // Gris clair
    },
    y: { 
      grid: { color: "rgba(0,0,0,.05)", drawBorder: false }, 
      ticks: { color: "#9ca3af" }
    }
  }
};
```

### Options Graphique Donut (Doughnut)
```javascript
const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "70%",              // Taille du trou central (70%)
  plugins: { 
    legend: { display: false }  // Cache la légende
  }
};
```

---

## 🔍 FILTRES

### Configuration de Filtrage
```javascript
const filterConfig = {
  search: '',           // Recherche texte
  status: [],           // Statuts sélectionnés (array)
  sort: ''              // Type de tri
};
```

### Options de Tri
- `'recent'` : Plus récent en premier
- `'older'` : Plus ancien en premier
- `'amount_high'` : Montant décroissant
- `'amount_low'` : Montant croissant

### Champs Recherchables
```javascript
// Dans les commandes:
[order._id, order.id, order.customerName, order.address, order.phone]

// Dans les produits:
[product.name, product.productId, product._id, product.category]
```

---

## 📱 RESPONSIVE DESIGN

### Point de Rupture Mobile
```javascript
const isMobile = window.innerWidth <= 900  // Layout mobile si < 900px
```
- Écoute `resize` en temps réel
- Adapte l'affichage des graphiques et tableaux

---

## 🔐 CONTRÔLE D'ACCÈS

### Rôles Autorisés
```javascript
hasAccess(userData, [ROLES.MANAGER, ROLES.EMPLOYEE, "employeur"])
```

**Roles acceptés:**
- `MANAGER` - Chef de projet/Manager
- `EMPLOYEE` - Employé
- `"employeur"` - Employeur (string)

### Redirection
- ❌ Pas connecté ? → `/login`
- ❌ Pas autorisé ? → `/login`

---

## 📋 FORMATAGE DONNÉES

### Fonction Formatage Date
```javascript
const fmtDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("fr-FR", { 
    day: "2-digit", 
    month: "short", 
    year: "numeric" 
  });
  // Exemple: "03 juin 2026"
};
```

### Fonction ID Commande
```javascript
const orderId = (order) => (order._id ? order._id.slice(-6).toUpperCase() : order.id || "TEMP");
// Affiche les 6 derniers caractères en majuscules
// Exemple: "5F9A8C"
```

### Fonction Montant
```javascript
const orderAmount = (order) => 
  order.total != null 
    ? `${Number(order.total).toLocaleString("fr-TN")} DT` 
    : order.amount || "0 DT";
// Exemple: "600 DT"
```

---

## 🔄 CHARGEMENT DONNÉES

### API Appelées
```javascript
const [ordersData, productsData] = await Promise.all([
  getAllOrders({ limit: 50 }),      // Max 50 commandes
  getAllProducts()                   // Tous les produits
]);
```

### États React
```javascript
const [activeTab, setActiveTab] = useState("Aperçu");
const [selectedPeriod, setSelectedPeriod] = useState("Ce mois-ci");
const [time, setTime] = useState(new Date());          // MAJ chaque seconde
const [isMobile, setIsMobile] = useState(...);
const [user, setUser] = useState(null);
const [orders, setOrders] = useState([]);
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(false);
const [filterConfig, setFilterConfig] = useState({...});
```

---

## ⏱️ MISE À JOUR EN TEMPS RÉEL

```javascript
useEffect(() => {
  const timer = setInterval(() => setTime(new Date()), 1000);  // Chaque 1000ms
  return () => clearInterval(timer);
}, []);
```
L'horloge se met à jour chaque seconde

---

## 🎯 COMPOSANTS UTILISÉS

### Composants Internes
- `EmployeeSidebar` - Menu latéral
- `AdvancedFilters` - Barre de filtres avancée
- `Doughnut` (Chart.js) - Graphique donut/pie
- `Line` (Chart.js) - Graphique linéaire

### Styles CSS
- Importé depuis `../Admin/AdminDashboard.css`

---

## 🚀 EXEMPLE DE MODIFICATION

### Changer la couleur d'un KPI
```javascript
// Avant: iconColor: "#10b981" (Vert)
// Après: iconColor: "#ef4444" (Rouge)

const KPI_CONFIG = [
  {
    label: "Chiffre d'affaires",
    valueKey: "totalRevenue",
    format: (v) => `${Number(v || 0).toLocaleString("fr-TN")} DT`,
    change: "+55%",
    changeLabel: "mois précédent",
    iconColor: "#ef4444",  // ✅ NOUVEAU ROUGE
    icon: <SVG_ICON />
  },
  // ...
];
```

### Ajouter un Nouveau Statut
```javascript
// Dans STATUS_STYLES
"remboursé": { 
  bg: "#fecfe0", 
  color: "#ec4899", 
  border: "#fbcfe8" 
},

// Dans STATUS_COLORS
remboursé: "#ec4899"  // Rose
```

### Changer le Point de Rupture Mobile
```javascript
// Avant: window.innerWidth <= 900
// Après: window.innerWidth <= 768

const isMobile = window.innerWidth <= 768  // Maintenant mobile si < 768px
```

---

## 📝 RÉSUMÉ CONFIGURATION

| Paramètre | Valeur | Description |
|-----------|--------|-------------|
| **Onglets** | 3 | Aperçu, Commandes, Stock |
| **KPIs** | 3 | Revenu, Commandes, Actifs |
| **Statuts** | 7 | livré, transit, confirmé, attente, cours, expédié, annulé |
| **Graphiques** | 2 | Ligne + Donut |
| **Limite Commandes** | 50 | Max chargées au démarrage |
| **Mobile Breakpoint** | 900px | Taille écran responsive |
| **Update Horloge** | 1s | Mise à jour temps réel |

