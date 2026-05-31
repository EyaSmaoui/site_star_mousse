# E2E Testing Guide - Cypress

## Installation

### 1. Installer Cypress
```bash
npm install --save-dev cypress

# Ou dans le frontend
npm install --save-dev cypress --prefix frontend
```

### 2. Initialiser Cypress
```bash
npx cypress open
```

Cela va créer la structure `cypress/` automatiquement.

## Structure des Tests

```
cypress/
├── fixtures/           # Données de test
├── support/           # Configuration & helpers
│   ├── commands.js
│   └── e2e.js
├── e2e/               # Les tests
│   ├── auth.cy.js
│   ├── home.cy.js
│   └── api.cy.js
└── downloads/         # Téléchargements
```

## Exemple de Test

### cypress/e2e/auth.cy.js
```javascript
describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
  });

  it('should load login page', () => {
    cy.contains('Login').should('be.visible');
  });

  it('should login with valid credentials', () => {
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome').should('be.visible');
  });

  it('should show error with invalid credentials', () => {
    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid credentials').should('be.visible');
  });

  it('should logout successfully', () => {
    cy.login('test@example.com', 'password123');
    cy.get('[data-testid="logout-btn"]').click();
    cy.url().should('include', '/login');
  });
});
```

### cypress/e2e/home.cy.js
```javascript
describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should render home page', () => {
    cy.contains('Welcome').should('be.visible');
  });

  it('should display navigation menu', () => {
    cy.get('nav').should('be.visible');
    cy.get('nav').contains('Home').should('be.visible');
    cy.get('nav').contains('Dashboard').should('be.visible');
  });

  it('should handle responsive design', () => {
    // Test mobile view
    cy.viewport('iphone-x');
    cy.get('[data-testid="menu-toggle"]').should('be.visible');
    
    // Test desktop view
    cy.viewport(1280, 720);
    cy.get('[data-testid="menu-toggle"]').should('not.be.visible');
  });

  it('should navigate between pages', () => {
    cy.get('a').contains('Dashboard').click();
    cy.url().should('include', '/dashboard');
  });
});
```

### cypress/support/commands.js
```javascript
// Custom commands
Cypress.Commands.add('login', (email, password) => {
  cy.visit('http://localhost:3000/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="logout-btn"]').click();
  cy.url().should('include', '/login');
});

Cypress.Commands.add('navigateTo', (path) => {
  cy.get(`a[href="${path}"]`).click();
});
```

## Configuration

### cypress.config.js
```javascript
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    chromeWebSecurity: false,
    video: true,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // Plugins
    },
  },
});
```

## Scripts NPM

Ajouter à `frontend/package.json`:
```json
{
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "cypress:headless": "cypress run --headless",
    "e2e": "cypress run --e2e"
  }
}
```

## Exécuter les Tests

```bash
# Mode interactif
npm run cypress:open

# Mode headless (CI)
npm run cypress:run

# Tests spécifiques
npx cypress run --spec "cypress/e2e/auth.cy.js"

# Avec vidéos
npx cypress run --record --key YOUR_RECORD_KEY
```

## Best Practices

### 1. Utiliser les data-testid
```html
<button data-testid="logout-btn">Logout</button>
```

```javascript
cy.get('[data-testid="logout-btn"]').click();
```

### 2. Attendre les éléments
```javascript
// ❌ Mauvais
cy.get('.element').click();

// ✅ Bon
cy.get('.element').should('be.visible').click();
cy.get('.element').should('exist').and('be.enabled').click();
```

### 3. Utiliser les fixtures
```javascript
// cypress/fixtures/user.json
{
  "email": "test@example.com",
  "password": "password123"
}
```

```javascript
cy.fixture('user').then(user => {
  cy.login(user.email, user.password);
});
```

### 4. Nettoyer la DB avant/après les tests
```javascript
beforeEach(() => {
  cy.request('POST', 'http://localhost:5000/api/test/reset');
});
```

## Cypress Cloud (Enregistrement des tests)

```bash
# Créer un compte
npx cypress run --record --key YOUR_KEY

# Voir les résultats
# Dashboard: https://cloud.cypress.io
```

## Troubleshooting

### Erreur: "Target URL does not exist"
- Vérifiez que le serveur frontend est en cours d'exécution
- Vérifiez que baseUrl est correct

### Erreur: "Timed out"
- Augmentez `defaultCommandTimeout` dans cypress.config.js
- Vérifiez que le serveur n'est pas bloqué

### Tests flaky (instables)
- Utilisez `.should()` au lieu de `.click()` directement
- Attendez les animations/transitions
- Utilisez `cy.wait()` pour les requêtes API

## Resources
- Cypress Documentation: https://docs.cypress.io
- Cypress Best Practices: https://docs.cypress.io/guides/references/best-practices
- Cypress Dashboard: https://cloud.cypress.io
