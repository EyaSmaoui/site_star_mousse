# Deployment & Hosting Guide

## Architecture

```
┌─────────────────────────────────────────────┐
│           Client (Browser)                   │
│         Frontend (React + Build)             │
└──────────────┬──────────────────────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────────────────────┐
│      Ngrok (Public Tunnel) - Dev Only        │
│  https://xxxxxx.ngrok-free.app              │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│     Backend Server (Node.js + Express)       │
│         Port 5000 / 3000                     │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│         MongoDB (Atlas/Local)                │
│    Database & Data Storage                   │
└─────────────────────────────────────────────┘
```

## Phase 1: Development Setup

### 1. Clone & Install
```bash
git clone <repository>
cd site_star_mousse
npm run install:all
```

### 2. Configure Environment Variables

**backend/.env**
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/site_star_mousse
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
```

**frontend/.env.development**
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

### 3. Start Services

**Terminal 1: Backend**
```bash
cd backend
npm run dev
# Écoute sur http://localhost:5000
```

**Terminal 2: Frontend**
```bash
cd frontend
npm start
# Écoute sur http://localhost:3000
```

**Terminal 3: Ngrok (pour tester publiquement)**
```bash
ngrok http 5000
# URL: https://xxxxxx.ngrok-free.app
```

## Phase 2: Testing Before Deployment

### Unit Tests
```bash
npm run test --prefix backend
npm run test --prefix frontend
```

### Coverage Report
```bash
npm run test:coverage --prefix backend
npm run test:coverage --prefix frontend
```

### E2E Tests
```bash
npm run cypress:run --prefix frontend
```

### Performance Tests
```bash
npm run perf:load --prefix backend
npm run perf:stress --prefix backend
```

## Phase 3: Build for Production

### Build Frontend
```bash
cd frontend
npm run build
# Crée le dossier build/
```

### Build Backend (si nécessaire)
```bash
cd backend
npm run build
# Ou gardez les fichiers JavaScript tels quels
```

### Vérifier les builds
```bash
# Frontend built files
ls frontend/build/

# Backend ready
npm start --prefix backend
```

## Phase 4: Production Deployment Options

### Option A: Heroku (Simple & Gratuit avec limites)

**1. Installer Heroku CLI**
```bash
choco install heroku
heroku login
```

**2. Créer l'app Heroku**
```bash
heroku create site-star-mousse
```

**3. Ajouter buildpacks**
```bash
heroku buildpacks:add heroku/nodejs
```

**4. Configurer les variables d'environnement**
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
heroku config:set JWT_SECRET=your-secret
```

**5. Déployer**
```bash
git push heroku main
```

### Option B: DigitalOcean App Platform

**1. Créer une app**
- Allez sur https://cloud.digitalocean.com
- Cliquez "Create" → "Apps"
- Connectez votre repo GitHub

**2. Configuration**
```yaml
name: site-star-mousse
services:
  - name: backend
    github:
      repo: your-repo
      branch: main
    build_command: npm install --prefix backend
    run_command: npm start --prefix backend
    envs:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        scope: RUN_AND_BUILD_TIME
        value: ${db.connection_string}

  - name: frontend
    github:
      repo: your-repo
      branch: main
    build_command: npm run build --prefix frontend
    http_port: 3000

databases:
  - name: db
    engine: MONGODB
    version: "7"
```

### Option C: AWS (Production-Grade)

**Backend on EC2 + Frontend on S3 + CloudFront:**

```bash
# 1. EC2 Instance
- Créer une instance Ubuntu
- SSH dans l'instance
- Clone du repo et npm install

# 2. MongoDB Atlas
- Créer un cluster MongoDB Atlas
- Whitelister l'IP EC2

# 3. Nginx reverse proxy
sudo apt install nginx

# /etc/nginx/sites-available/backend
server {
    listen 80;
    server_name api.example.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# 4. PM2 (Process Manager)
npm install -g pm2
pm2 start backend/app.js --name "backend"
pm2 startup
pm2 save

# 5. SSL (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.example.com
```

### Option D: Docker + Docker Compose (Professionnel)

**Dockerfile pour Backend**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --production

COPY backend/ ./

EXPOSE 5000
CMD ["node", "app.js"]
```

**Dockerfile pour Frontend**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml**
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongo_data:/data/db

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://admin:password@mongodb:27017/site_star_mousse
      NODE_ENV: production
    depends_on:
      - mongodb
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  mongo_data:
```

**Deploy**
```bash
docker-compose up -d
```

## Phase 5: CI/CD Pipeline (GitHub Actions)

Les tests s'exécutent automatiquement:
- À chaque push sur `main` ou `develop`
- À chaque pull request
- Rapports de couverture automatiques

Vérifiez `.github/workflows/testing.yml`

## Phase 6: Monitoring & Logging

### Sentry (Error Tracking)
```bash
npm install @sentry/node
```

**backend/app.js**
```javascript
const Sentry = require("@sentry/node");

Sentry.init({ dsn: "your-sentry-dsn" });
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

### Winston Logger (Logs)
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### MongoDB Monitoring
- Atlas Dashboard: https://cloud.mongodb.com
- Vérifiez "Performance" et "Monitoring"

## Phase 7: Security Checklist

- [ ] SSL/TLS activé (HTTPS)
- [ ] Environment variables sécurisées
- [ ] Rate limiting configuré
- [ ] CORS validé
- [ ] CSRF protection activée
- [ ] Headers de sécurité (Helmet)
- [ ] Password hashing (bcrypt)
- [ ] Input validation
- [ ] SQL/NoSQL injection prevention
- [ ] Secrets pas en git (.env ignoré)

## Phase 8: Performance Optimization

```javascript
// Compression
const compression = require('compression');
app.use(compression());

// Caching
app.use(express.static('public', { maxAge: '1d' }));

// Database indexing
db.collection('users').createIndex({ email: 1 });

// Pagination
router.get('/api/items', (req, res) => {
  const page = req.query.page || 1;
  const limit = 20;
  Item.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();
});
```

## Rollback & Disaster Recovery

```bash
# Rollback Heroku
heroku releases
heroku rollback v5

# Backup MongoDB
mongodump --uri="your-uri" --out=backup/

# Restore MongoDB
mongorestore --uri="your-uri" backup/
```

## Monitoring Dashboard

### Outils recommandés
- **New Relic**: Performance monitoring
- **Datadog**: Log aggregation
- **Grafana**: Metrics visualization
- **PagerDuty**: Alerting

## Troubleshooting Deployment

### Application ne démarre pas
```bash
# Vérifiez les logs
heroku logs --tail
docker logs <container>

# Vérifiez les variables d'environnement
heroku config
docker exec <container> env
```

### Erreurs de base de données
```bash
# Vérifier la connexion MongoDB
mongosh "your-connection-string"

# Vérifier les indexes
db.users.getIndexes()
```

### Performance lente
```bash
# Vérifier les requêtes lentes
db.setProfilingLevel(1)
db.system.profile.find().limit(5).sort({ ts: -1 }).pretty()

# Ajouter des indexes
db.items.createIndex({ category: 1 })
```

## Coûts d'Hébergement

| Service | Gratuit | Payant |
|---------|---------|--------|
| MongoDB Atlas | 512MB | $9+/mois |
| Heroku | Limité | $5+/mois |
| DigitalOcean | - | $5+/mois |
| AWS | 1 an gratuit | Variable |
| Ngrok | Basique | $5+/mois |

## Ressources
- Heroku Deploy: https://devcenter.heroku.com/
- DigitalOcean: https://www.digitalocean.com/docs/
- AWS Documentation: https://aws.amazon.com/documentation/
- Docker: https://docs.docker.com/
- MongoDB Atlas: https://docs.atlas.mongodb.com/
