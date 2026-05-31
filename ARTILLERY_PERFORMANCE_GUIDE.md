# Performance Testing Guide - Artillery

## Installation

### 1. Installer Artillery
```bash
npm install -g artillery

# Ou localement
npm install --save-dev artillery
```

### 2. Vérifier l'installation
```bash
artillery --version
```

## Configuration

### artillery.yml - Configuration de base

```yaml
config:
  target: "http://localhost:5000"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Ramp up"
    - duration: 60
      arrivalRate: 100
      name: "Sustained load"
  processor: "./processor.js"
  variables:
    token: "your-jwt-token"

scenarios:
  - name: "API Performance Test"
    flow:
      - get:
          url: "/api/health"
      - think: 5
      - get:
          url: "/api/data"
      - think: 3
      - post:
          url: "/api/data"
          json:
            name: "Test Item"
            description: "Performance test"
      - think: 2
      - get:
          url: "/api/data"
```

## Scenarios Complets

### Load Testing - artillery-load.yml
```yaml
config:
  target: "http://localhost:5000"
  phases:
    - duration: 10
      arrivalRate: 5
      name: "Light load"
    - duration: 30
      arrivalRate: 20
      name: "Medium load"
    - duration: 30
      arrivalRate: 50
      name: "Heavy load"
    - duration: 10
      arrivalRate: 10
      name: "Cool down"
  defaults:
    headers:
      Content-Type: "application/json"

scenarios:
  - name: "Complete User Journey"
    flow:
      # Health check
      - get:
          url: "/api/health"
          expect:
            - statusCode: 200

      # Get data
      - get:
          url: "/api/items"
          expect:
            - statusCode: 200

      # Create item
      - post:
          url: "/api/items"
          json:
            name: "Test Item {{ $randomNumber(1, 1000) }}"
            value: "{{ $randomNumber(100, 1000) }}"
          expect:
            - statusCode: 201

      # Get specific item
      - get:
          url: "/api/items/{{ itemId }}"
          expect:
            - statusCode: 200

      # Update item
      - put:
          url: "/api/items/{{ itemId }}"
          json:
            name: "Updated Item"
          expect:
            - statusCode: 200

      # Delete item
      - delete:
          url: "/api/items/{{ itemId }}"
          expect:
            - statusCode: 204
```

### Stress Testing - artillery-stress.yml
```yaml
config:
  target: "http://localhost:5000"
  phases:
    - duration: 60
      arrivalRate: 10
      rampTo: 100
      name: "Ramp to stress"
    - duration: 60
      arrivalRate: 100
      name: "Stress phase"
    - duration: 30
      arrivalRate: 200
      name: "Extreme stress"
    - duration: 60
      arrivalRate: 0
      name: "Cool down"
  defaults:
    headers:
      Authorization: "Bearer {{ token }}"

scenarios:
  - name: "Stress Test"
    flow:
      - get:
          url: "/api/health"
      - get:
          url: "/api/heavy-computation"
      - post:
          url: "/api/process"
          json:
            data: "{{ $randomString(1000) }}"
```

### Soak Testing - artillery-soak.yml
```yaml
config:
  target: "http://localhost:5000"
  phases:
    - duration: 3600  # 1 hour
      arrivalRate: 20
      name: "Soak test"
  defaults:
    headers:
      Content-Type: "application/json"

scenarios:
  - name: "Sustained Load"
    flow:
      - get:
          url: "/api/health"
      - get:
          url: "/api/data"
      - think: 30  # Pause de 30 secondes entre requêtes
```

## Processor.js - Logic personnalisée

```javascript
// processor.js
module.exports = {
  setToken: setToken,
  generateData: generateData,
  checkResponse: checkResponse,
};

function setToken(requestParams, context, ee, next) {
  // Générer ou récupérer un token
  context.vars.token = "jwt-token-here";
  return next();
}

function generateData(requestParams, context, ee, next) {
  // Générer des données dynamiques
  context.vars.itemName = `Test Item ${Date.now()}`;
  context.vars.itemId = Math.floor(Math.random() * 1000);
  return next();
}

function checkResponse(requestParams, response, context, ee, next) {
  // Valider les réponses
  if (response.statusCode !== 200) {
    console.log(`Error: ${response.statusCode}`);
  }
  // Extraire les données pour les requêtes suivantes
  if (response.body && response.body.id) {
    context.vars.itemId = response.body.id;
  }
  return next();
}
```

## Scripts NPM

Ajouter à `backend/package.json`:
```json
{
  "scripts": {
    "perf:load": "artillery run artillery-load.yml",
    "perf:stress": "artillery run artillery-stress.yml",
    "perf:soak": "artillery run artillery-soak.yml",
    "perf:quick": "artillery quick --count 100 --num 10 http://localhost:5000/api/health"
  }
}
```

## Exécuter les Tests

```bash
# Load test
artillery run artillery-load.yml

# Avec rapport HTML
artillery run artillery-load.yml --output report.json
artillery report report.json

# Test rapide
artillery quick --count 100 --num 10 http://localhost:5000/api/health

# Test spécifique
artillery run artillery-stress.yml --target http://localhost:5000

# Avec environnement
artillery run artillery-load.yml --target https://api.example.com
```

## Métriques Clés

### Response Time (ms)
- min: Minimum
- max: Maximum
- mean: Moyenne
- p50: Médiane
- p95: 95e percentile
- p99: 99e percentile

### Throughput
- rps: Requêtes par seconde
- codes: Status codes reçus

### Errors
- Connection errors
- Socket timeout errors
- 5xx errors

## Analyse des Résultats

```
Summary report @ 14:32:21(+0000)
scenarios launched: 100
scenarios completed: 95
requests completed: 950
mean response time: 250ms
p95 response time: 450ms
p99 response time: 800ms
Errors:
  Connection refused: 3
  Timeout: 2
```

### Interprétation:
- **p95 < 500ms**: Excellent
- **p95 < 1s**: Bon
- **p95 > 2s**: Problème de performance
- **Errors > 0.1%**: Problème de stabilité

## Best Practices

### 1. Test progressif
```yaml
phases:
  - duration: 10
    arrivalRate: 5    # Light
  - duration: 20
    arrivalRate: 20   # Medium
  - duration: 30
    arrivalRate: 100  # Heavy
```

### 2. Réalisme
```yaml
scenarios:
  - flow:
      - get:
          url: "/api/data"
      - think: 30  # Pause réaliste
      - post:
          url: "/api/process"
```

### 3. Validation des réponses
```yaml
expect:
  - statusCode: 200
  - contentType: json
  - hasProperty: id
```

### 4. Nettoyage après test
```javascript
// processor.js
module.exports = {
  cleanup: cleanup
};

function cleanup(context, ee, next) {
  // Supprimer les données de test
  console.log("Cleanup: Removing test data");
  return next();
}
```

## CI/CD Integration

### GitHub Actions
```yaml
- name: Performance Test
  run: npm run perf:load --prefix backend
  
- name: Upload Results
  uses: actions/upload-artifact@v3
  with:
    name: performance-report
    path: ./artillery-report.json
```

## Troubleshooting

### Erreur: "Connection refused"
- Vérifiez que le serveur est actif
- Vérifiez le port et l'URL

### Erreur: "Too many open files"
- Augmentez les limites système
- Réduisez l'arrivalRate

### Résultats peu réalistes
- Augmentez la durée du test
- Ajoutez des `think` delays
- Utilisez plusieurs scénarios

## Resources
- Artillery Documentation: https://artillery.io/docs
- Artillery Examples: https://github.com/artilleryio/artillery/tree/main/examples
- Performance Testing Best Practices: https://www.perfmatrix.com/
